import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Input, Modal, Select, Spin, Tag } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as totpApi from '@/api/auth-totp.ts';
import * as api from '@/api/vm.ts';
import type { CertInfo, CertSource } from '@/api/vm.ts';
import { encrypt } from '@/lib/encrypt.ts';
import { attempt, confirm, toast } from '@/lib/feedback.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { InfoRow, SettingRow } from '@/components/setting-rows.tsx';

import type { SystemActionHandle, SystemActionState } from './action.ts';

const POLL_SECONDS = 3;
// an order is cut off after two minutes on the device; this leaves room for the install
const WAIT_LIMIT_SECONDS = 200;
const DAY_SECONDS = 24 * 60 * 60;
const RENEW_BEFORE_DAYS = 30;

const DOMAIN_PATTERN =
  /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
const LOCAL_SUFFIXES = ['.local', '.localhost', '.lan', '.internal', '.home.arpa'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Draft = { source: CertSource; domain: string; email: string };

function isValidDomain(domain: string) {
  const name = domain.trim().toLowerCase();
  return (
    DOMAIN_PATTERN.test(name) &&
    !/^[\d.]+$/.test(name) &&
    !LOCAL_SUFFIXES.some((suffix) => name.endsWith(suffix))
  );
}

function draftOf(info: CertInfo): Draft {
  return { source: info.source, domain: info.domain, email: info.email };
}

// the server words its reasons in lower case
function sentence(text: string | null | undefined) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : undefined;
}

function sleep(seconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
}

type CertificateProps = {
  onActionStateChange?: (state: SystemActionState) => void;
  // what stops certificates now, for the Alert above the sections; null when nothing does
  onBlockedChange?: (message: string | null) => void;
};

// The rows under the HTTPS switch: where the certificate comes from and how it is doing. A change
// is a draft, saved from the bar of the page; the password dialog then starts the request.
export const Certificate = forwardRef<SystemActionHandle, CertificateProps>(
  ({ onActionStateChange, onBlockedChange }, ref) => {
    const { t } = useTranslation();

    const [info, setInfo] = useState<CertInfo | null>(null);
    const [draft, setDraft] = useState<Draft>({ source: 'selfSigned', domain: '', email: '' });
    const [isAsking, setIsAsking] = useState(false);
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    // a second factor is asked for when the account has one
    const [totpEnabled, setTotpEnabled] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const isMounted = useRef(true);

    const { status } = useSettingsLoadState(api.getCert, (rsp) => {
      const data = rsp.data as CertInfo;
      setInfo(data);
      setDraft(draftOf(data));
    });

    useEffect(() => {
      isMounted.current = true;
      attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
        setTotpEnabled(!!rsp?.data?.enabled);
      });
      return () => {
        isMounted.current = false;
      };
    }, []);

    const isReady = status === 'ready' && info !== null;
    const isBusy = isWorking || !!info?.busy;
    const isManaged = draft.source === 'acme';

    // the clock and the Paranoid firewall stop both sources; Tailscale can also be unavailable alone
    const blockerText =
      info?.blocker === 'clockUnsynced'
        ? t('settings.network.certificate.blockedClock')
        : info?.blocker === 'paranoidFirewall'
          ? t('settings.network.certificate.blockedParanoid')
          : null;
    const tailscaleDownText =
      info && !info.blocker && !info.tailscaleAvailable
        ? t('settings.network.certificate.tailscaleUnavailable')
        : null;
    const blockedReason =
      draft.source === 'selfSigned'
        ? null
        : draft.source === 'tailscale'
          ? (blockerText ?? tailscaleDownText)
          : blockerText;
    const domainInvalid = isManaged && draft.domain.trim() !== '' && !isValidDomain(draft.domain);
    const emailInvalid = isManaged && draft.email.trim() !== '' && !EMAIL_PATTERN.test(draft.email);

    const hasPending =
      !!info &&
      (draft.source !== info.source ||
        (isManaged && (draft.domain.trim() !== info.domain || draft.email.trim() !== info.email)));
    const hasInvalid =
      !!blockedReason || (isManaged && (!isValidDomain(draft.domain) || emailInvalid));

    // Poll until the device is done with the request, then say how it went.
    const waitForRequest = useCallback(
      async (before: CertInfo, expected?: CertSource) => {
        setIsWorking(true);
        let latest: CertInfo | undefined;
        for (let waited = 0; waited < WAIT_LIMIT_SECONDS && isMounted.current; ) {
          await sleep(POLL_SECONDS);
          waited += POLL_SECONDS;
          const rsp = await attempt(() => api.getCert(), { quiet: true });
          if (!rsp) continue;

          latest = rsp.data as CertInfo;
          const attempted = latest.status.lastAttempt !== before.status.lastAttempt;
          const switched = expected !== undefined && latest.source === expected;
          if (!latest.busy && (attempted || switched)) break;
        }
        if (!isMounted.current) return;
        setIsWorking(false);
        if (!latest) return;

        setInfo(latest);
        const pending = await attempt(() => api.getTlsPending(), { quiet: true });
        if (pending?.data?.pending && pending.data.certificate && latest.url) {
          setDraft(draftOf(latest));
          openNewAddress(latest.url);
        } else if (
          latest.status.lastError &&
          latest.status.lastAttempt !== before.status.lastAttempt
        ) {
          toast.error(t('common.actionFailed'), {
            description: sentence(latest.status.lastError)
          });
        } else {
          setDraft(draftOf(latest));
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [t]
    );

    // The new certificate serves new connections: the address that has it is another origin, where
    // the browser signs in again and keeps or reverts the change.
    function openNewAddress(url: string) {
      confirm({
        title: t('settings.network.certificate.openTitle'),
        content: (
          <div className="space-y-2">
            <p>{t('settings.network.certificate.openDesc')}</p>
            <p className="font-mono text-xs break-all text-neutral-400">{url}</p>
          </div>
        ),
        okText: t('settings.network.certificate.openOk'),
        cancelText: t('common.cancel'),
        onOk: () => window.location.assign(url)
      });
    }

    function save() {
      if (!hasPending || hasInvalid) return;
      setIsAsking(true);
    }

    function close() {
      setIsAsking(false);
      setPassword('');
      setCode('');
    }

    async function submit() {
      if (!info) return;
      setIsWorking(true);
      const rsp = await attempt(() =>
        api.setCert({
          source: draft.source,
          domain: draft.domain.trim(),
          email: draft.email.trim(),
          password: encrypt(password),
          code: code.trim() || undefined
        })
      );
      setIsWorking(false);
      if (!rsp) return;

      close();
      await waitForRequest(info, draft.source === 'selfSigned' ? 'selfSigned' : undefined);
    }

    async function renew() {
      if (!info) return;
      const rsp = await attempt(() => api.renewCert());
      if (rsp) await waitForRequest(info);
    }

    useImperativeHandle(ref, () => ({ save }));

    useEffect(() => {
      onActionStateChange?.({
        hasPending,
        hasInvalid,
        canSave: hasPending && !hasInvalid && !isBusy && isReady,
        isBusy,
        statusText: hasPending ? (blockedReason ?? t('settings.system.unsaved')) : '',
        statusKind: hasPending ? (blockedReason ? 'error' : 'warning') : '',
        label: t('settings.system.saveChanges')
      });
    }, [blockedReason, hasInvalid, hasPending, isBusy, isReady, onActionStateChange, t]);

    useEffect(() => {
      onBlockedChange?.(info?.httpsEnabled ? blockerText : null);
    }, [blockerText, info?.httpsEnabled, onBlockedChange]);

    if (!info) return null;

    const disabled = !isReady || !info.httpsEnabled || isBusy;
    const sourceOptions = [
      { value: 'selfSigned', label: t('settings.network.certificate.selfSigned') },
      {
        value: 'tailscale',
        label: 'Tailscale',
        disabled: !!info.blocker || !info.tailscaleAvailable
      },
      { value: 'acme', label: "Let's Encrypt", disabled: !!info.blocker }
    ];

    const now = Math.floor(Date.now() / 1000);
    const left = info.currentNotAfter === null ? null : info.currentNotAfter - now;
    const expiryTag =
      info.source === 'selfSigned' ? (
        <Tag className="m-0">{t('settings.network.certificate.selfSigned')}</Tag>
      ) : left !== null && left <= 0 ? (
        <Tag className="m-0" color="red">
          {t('settings.network.certificate.expired')}
        </Tag>
      ) : left !== null && left <= RENEW_BEFORE_DAYS * DAY_SECONDS ? (
        <Tag className="m-0" color="gold">
          {t('settings.network.certificate.expiresSoon')}
        </Tag>
      ) : (
        <Tag className="m-0" color="green">
          {t('settings.network.certificate.valid')}
        </Tag>
      );

    const failed = !!info.status.lastError;
    const askKey =
      draft.source === 'selfSigned'
        ? 'applySelfSigned'
        : draft.source === 'tailscale'
          ? 'applyTailscale'
          : 'applyAcme';

    return (
      <>
        <SettingRow
          label={
            <span className="flex items-center gap-2">
              {tailscaleDownText ? (
                <LabelTip
                  text={t('settings.network.certificate.title')}
                  tip={tailscaleDownText}
                  warning
                />
              ) : (
                t('settings.network.certificate.title')
              )}
              {isBusy && (
                <Spin
                  size="small"
                  indicator={<LoaderCircleIcon size="1em" className="animate-spin" />}
                />
              )}
            </span>
          }
          description={
            isBusy
              ? t('settings.network.certificate.requesting')
              : t('settings.network.certificate.desc')
          }
          error={draft.source === 'tailscale' ? (tailscaleDownText ?? undefined) : undefined}
          inline
        >
          <Select
            className="w-40 text-right"
            value={draft.source}
            options={sourceOptions}
            disabled={disabled}
            onChange={(source) => setDraft({ ...draft, source })}
          />
        </SettingRow>

        {draft.source === 'tailscale' ? (
          <InfoRow
            label={t('settings.network.certificate.domain')}
            description={t('settings.network.certificate.domainTailscale')}
            value={info.tailscaleDomain}
          />
        ) : (
          <SettingRow
            label={t('settings.network.certificate.domain')}
            description={t('settings.network.certificate.domainDesc')}
            error={domainInvalid ? t('settings.network.certificate.domainInvalid') : undefined}
            inline
          >
            <Input
              className="w-44 min-w-0 text-right sm:w-72"
              value={draft.domain}
              placeholder="kvm.example.org"
              status={domainInvalid ? 'error' : undefined}
              disabled={disabled || !isManaged}
              onChange={(e) => setDraft({ ...draft, domain: e.target.value })}
            />
          </SettingRow>
        )}

        <SettingRow
          label={t('settings.network.certificate.email')}
          description={t('settings.network.certificate.emailDesc')}
          error={emailInvalid ? t('settings.network.certificate.emailInvalid') : undefined}
          inline
        >
          <Input
            className="w-44 min-w-0 text-right sm:w-72"
            value={draft.email}
            status={emailInvalid ? 'error' : undefined}
            disabled={disabled || !isManaged}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </SettingRow>

        {(info.currentNotAfter !== null ||
          (info.source !== 'selfSigned' && info.status.lastAttempt !== null)) && (
          <div className="flex flex-col gap-3">
            {info.currentNotAfter !== null && (
              <InfoRow
                label={
                  <span className="flex items-center gap-2">
                    {t('settings.network.certificate.validUntil')}
                    {expiryTag}
                  </span>
                }
                value={new Date(info.currentNotAfter * 1000).toLocaleDateString()}
              />
            )}

            {info.source !== 'selfSigned' && info.status.lastAttempt !== null && (
              <InfoRow
                label={
                  <span className="flex items-center gap-2">
                    {t('settings.network.certificate.lastRenewal')}
                    <Tag className="m-0" color={failed ? 'red' : 'green'}>
                      {failed
                        ? t('settings.network.certificate.failed')
                        : t('settings.network.certificate.renewed')}
                    </Tag>
                  </span>
                }
                description={
                  failed ? (
                    <span className="text-red-400">{sentence(info.status.lastError)}</span>
                  ) : undefined
                }
                value={new Date(info.status.lastAttempt * 1000).toLocaleString()}
              />
            )}
          </div>
        )}

        {info.source !== 'selfSigned' && (
          <SettingRow
            label={t('settings.network.certificate.renewNow')}
            description={t('settings.network.certificate.renewNowDesc')}
            inline
          >
            <Button disabled={disabled || hasPending} onClick={renew}>
              {t('settings.network.certificate.renewBtn')}
            </Button>
          </SettingRow>
        )}

        <Modal
          centered
          open={isAsking}
          title={t('settings.network.certificate.applyTitle')}
          okText={t('settings.network.certificate.applyOk')}
          cancelText={t('common.cancel')}
          okButtonProps={{ disabled: !password || (totpEnabled && !code), loading: isWorking }}
          onOk={submit}
          onCancel={close}
        >
          <div className="flex flex-col gap-3">
            <span className="text-sm text-neutral-400">
              {t(`settings.network.certificate.${askKey}`)}
            </span>
            <Input.Password
              value={password}
              placeholder={t('settings.account.password')}
              onChange={(e) => setPassword(e.target.value)}
            />
            {totpEnabled && (
              <Input
                value={code}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder={t('auth.totp.placeholderCode')}
                onChange={(e) => setCode(e.target.value)}
              />
            )}
          </div>
        </Modal>
      </>
    );
  }
);

Certificate.displayName = 'Certificate';
