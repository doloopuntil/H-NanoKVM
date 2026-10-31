import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  Button,
  ConfigProvider,
  Divider,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Typography
} from 'antd';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/system-wireguard.ts';
import type { WireguardConfig, WireguardStatus } from '@/api/system-wireguard.ts';
import { discardOnEscape } from '@/lib/discard.ts';
import { attempt, confirm, toast } from '@/lib/feedback.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { PageHeader } from '@/components/page-header.tsx';
import { SaveBar } from '@/components/save-bar.tsx';
import { SettingRow } from '@/components/setting-rows.tsx';

const POLL_MS = 5000;
// WireGuard re-handshakes every two minutes while traffic flows, so older means the peer is silent.
const FRESH_HANDSHAKE_SECONDS = 180;

type Draft = {
  enabled: boolean;
  address: string;
  publicKey: string;
  endpointHost: string;
  endpointPort: number | null;
  allowedIps: string[];
  keepalive: number | null;
};

const emptyDraft: Draft = {
  enabled: false,
  address: '',
  publicKey: '',
  endpointHost: '',
  endpointPort: null,
  allowedIps: [],
  keepalive: 25
};

export const Wireguard = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<WireguardStatus | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saved, setSaved] = useState<Draft>(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  // Set when turning on fails the checks, so the empty fields that are needed light up.
  const [showRequired, setShowRequired] = useState(false);
  const [isKeyBusy, setIsKeyBusy] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  function patch(change: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...change }));
    if (!('enabled' in change)) setShowRequired(false);
  }

  const { status: loadState } = useSettingsLoadState(api.getStatus, (rsp) => {
    if (!rsp.data) throw new Error('missing WireGuard status');

    const next = toDraft(rsp.data.config);
    setStatus(rsp.data);
    setDraft(next);
    setSaved(next);
  });
  const isLoading = loadState === 'loading';
  const isUnavailable = loadState !== 'ready';

  // Keep the status card current without touching what is being edited.
  const savedEnabled = saved.enabled;
  useEffect(() => {
    if (!savedEnabled || isUnavailable) return;

    const timer = setInterval(() => {
      attempt(() => api.getStatus(), { quiet: true }).then((rsp) => {
        if (rsp?.data) setStatus(rsp.data);
      });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [savedEnabled, isUnavailable]);

  function applyStatus(next: WireguardStatus) {
    const config = toDraft(next.config);
    setStatus(next);
    setSaved(config);
    return config;
  }

  // Applies a config and returns the state the device reports, or nothing if it failed.
  async function submit(config: WireguardConfig) {
    if (isSaving) return undefined;

    setIsSaving(true);
    const rsp = await attempt(() => api.setConfig(config));
    setIsSaving(false);
    if (!rsp?.data) return undefined;

    toast.success(t('settings.wireguard.saved'));
    return applyStatus(rsp.data);
  }

  async function save() {
    const next = await submit(toConfig(draft));
    if (next) setDraft(next);
  }

  function discard() {
    if (isSaving) return;
    setDraft(saved);
    setShowRequired(false);
  }

  // The switch applies at once: on with everything the form holds, if that is all valid; off
  // with the saved settings, leaving unsaved edits where they are.
  async function toggle(enabled: boolean) {
    if (enabled) {
      const candidate = { ...draft, enabled };
      if (Object.keys(validate(candidate)).length > 0) {
        setShowRequired(true);
        toast.warning(t('settings.wireguard.invalid'));
        return;
      }

      const next = await submit(toConfig(candidate));
      if (next) setDraft(next);
      return;
    }

    const next = await submit({ ...toConfig(saved), enabled });
    if (next) patch({ enabled: next.enabled });
  }

  async function runKeyAction(call: () => Promise<{ code: number; msg: string; data: any }>) {
    setIsKeyBusy(true);
    const rsp = await attempt(call);
    setIsKeyBusy(false);
    if (!rsp?.data) return false;

    // Removing the key turns the tunnel off; the rest of the form is left as it is.
    const config = applyStatus(rsp.data);
    patch({ enabled: config.enabled });
    toast.success(t('settings.wireguard.saved'));
    return true;
  }

  async function submitKey() {
    const ok = await runKeyAction(() => api.setPrivateKey(keyInput.trim()));
    if (ok) closeKeyModal();
  }

  function closeKeyModal() {
    setIsKeyModalOpen(false);
    setKeyInput('');
  }

  function generateKey() {
    const run = () => void runKeyAction(() => api.generatePrivateKey());
    if (!status?.privateKeySet) {
      run();
      return;
    }

    confirm({
      title: t('settings.wireguard.privateKey.generateConfirmTitle'),
      content: t('settings.wireguard.privateKey.generateConfirmDesc'),
      danger: true,
      onOk: run
    });
  }

  function removeKey() {
    confirm({
      title: t('settings.wireguard.privateKey.removeConfirmTitle'),
      content: t('settings.wireguard.privateKey.removeConfirmDesc'),
      danger: true,
      onOk: () => void runKeyAction(() => api.removePrivateKey())
    });
  }

  const errors = validate(showRequired ? { ...draft, enabled: true } : draft);
  const hasInvalid = Object.keys(errors).length > 0;
  const hasPending = JSON.stringify(normalize(draft)) !== JSON.stringify(normalize(saved));
  const isBusy = isUnavailable || isSaving || isKeyBusy;
  const canTurnOn = Boolean(
    status?.toolInstalled && status.privateKeySet && !status.firewallBlocked
  );

  return (
    <>
      <PageHeader title={t('settings.wireguard.title')} />

      <ConfigProvider componentDisabled={isUnavailable}>
        <div
          className="flex min-w-0 flex-col space-y-6"
          onKeyDown={discardOnEscape(hasPending || hasInvalid, discard)}
        >
          <Section title={t('settings.network.connection')}>
            {status && !status.toolInstalled && (
              <Alert type="warning" showIcon title={t('settings.wireguard.unavailable')} />
            )}
            {status?.firewallBlocked && (
              <Alert type="warning" showIcon title={t('settings.wireguard.blocked')} />
            )}

            <SettingRow
              label={t('settings.wireguard.tunnel')}
              description={t('settings.wireguard.description')}
              isSwitch
            >
              <Switch
                checked={draft.enabled}
                loading={isLoading || isSaving}
                disabled={isKeyBusy || (!draft.enabled && !canTurnOn)}
                onChange={(enabled) => void toggle(enabled)}
              />
            </SettingRow>

            {status && !status.privateKeySet && (
              <Alert type="info" showIcon title={t('settings.wireguard.needsKey')} />
            )}

            {saved.enabled && status && <StatusCard status={status} />}
          </Section>

          <Divider className="opacity-50" />

          <Section title={t('settings.wireguard.device')}>
            <SettingRow
              label={
                <span className="flex items-center gap-2">
                  {t('settings.wireguard.privateKey.title')}
                  <Tag className="m-0" color={status?.privateKeySet ? 'green' : 'default'}>
                    {status?.privateKeySet
                      ? t('settings.wireguard.privateKey.set')
                      : t('settings.wireguard.privateKey.notSet')}
                  </Tag>
                </span>
              }
              description={t('settings.wireguard.privateKey.description')}
            >
              <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                <Button
                  className="flex-1 sm:flex-none"
                  disabled={isKeyBusy}
                  onClick={() => setIsKeyModalOpen(true)}
                >
                  {t('settings.wireguard.privateKey.setBtn')}
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  disabled={isKeyBusy || !status?.toolInstalled}
                  onClick={generateKey}
                >
                  {t('settings.wireguard.privateKey.generate')}
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  danger
                  disabled={isKeyBusy || !status?.privateKeySet}
                  onClick={removeKey}
                >
                  {t('settings.wireguard.privateKey.remove')}
                </Button>
              </div>
            </SettingRow>

            {status?.publicKey && (
              <SettingRow
                label={t('settings.wireguard.publicKey.title')}
                description={t('settings.wireguard.publicKey.description')}
              >
                <Typography.Text copyable className="break-all font-mono text-xs">
                  {status.publicKey}
                </Typography.Text>
              </SettingRow>
            )}

            <SettingRow
              label={t('settings.wireguard.address.title')}
              description={t('settings.wireguard.address.description')}
              error={errors.address ? t('settings.wireguard.invalidAddress') : undefined}
              inline
            >
              <Input
                className="w-32 text-right sm:w-40"
                value={draft.address}
                placeholder="10.0.0.1/24"
                status={errors.address ? 'error' : undefined}
                onChange={(event) => patch({ address: event.target.value })}
              />
            </SettingRow>
          </Section>

          <Divider className="opacity-50" />

          <Section title={t('settings.wireguard.peer.title')}>
            <SettingRow
              label={t('settings.wireguard.peer.publicKey')}
              description={t('settings.wireguard.peer.publicKeyDescription')}
              error={errors.publicKey ? t('settings.wireguard.invalidKey') : undefined}
            >
              <Input
                className="h-8 text-right font-mono text-xs sm:w-[22rem]"
                value={draft.publicKey}
                status={errors.publicKey ? 'error' : undefined}
                onChange={(event) => patch({ publicKey: event.target.value })}
              />
            </SettingRow>

            <SettingRow
              label={t('settings.wireguard.peer.server')}
              description={t('settings.wireguard.peer.serverDescription')}
              error={errors.endpointHost ? t('settings.wireguard.invalidEndpoint') : undefined}
              inline
            >
              <Input
                className="w-36 text-right sm:w-56"
                value={draft.endpointHost}
                placeholder="vpn.example.com"
                status={errors.endpointHost ? 'error' : undefined}
                onChange={(event) => patch({ endpointHost: event.target.value })}
              />
            </SettingRow>

            <SettingRow
              label={t('settings.wireguard.peer.port')}
              description={t('settings.wireguard.peer.portDescription')}
              error={errors.endpointPort ? t('settings.wireguard.invalidPort') : undefined}
              inline
            >
              <InputNumber
                className="w-20 [&_.ant-input-number-input]:!text-right"
                controls={false}
                min={1}
                max={65535}
                precision={0}
                value={draft.endpointPort}
                placeholder="51820"
                status={errors.endpointPort ? 'error' : undefined}
                onChange={(endpointPort) => patch({ endpointPort })}
              />
            </SettingRow>

            <SettingRow
              label={t('settings.wireguard.peer.allowedIps')}
              description={t('settings.wireguard.peer.allowedIpsDescription')}
              error={errors.allowedIps ? t('settings.wireguard.invalidRanges') : undefined}
              inline
            >
              <Select
                className="w-36 sm:w-56 [&_.ant-select-selection-overflow]:justify-end [&_.ant-select-selection-placeholder]:text-right"
                mode="tags"
                open={false}
                tokenSeparators={[',', ' ']}
                value={draft.allowedIps}
                placeholder="10.0.0.0/24"
                status={errors.allowedIps ? 'error' : undefined}
                suffixIcon={null}
                onChange={(allowedIps) => patch({ allowedIps })}
              />
            </SettingRow>

            <SettingRow
              label={t('settings.wireguard.peer.keepalive')}
              description={t('settings.wireguard.peer.keepaliveDescription')}
              inline
            >
              <Space.Compact>
                <InputNumber
                  className="w-24 sm:w-20 [&_.ant-input-number-input]:!text-right"
                  controls={false}
                  min={0}
                  max={65535}
                  precision={0}
                  value={draft.keepalive}
                  onChange={(keepalive) => patch({ keepalive })}
                />
                <Space.Addon className="w-8 text-center">s</Space.Addon>
              </Space.Compact>
            </SettingRow>
          </Section>

          {(hasInvalid || hasPending) && (
            <SaveBar
              statusText={
                hasInvalid ? t('settings.wireguard.invalid') : t('settings.wireguard.unsaved')
              }
              statusKind={hasInvalid ? 'error' : 'warning'}
              label={t('settings.wireguard.save')}
              loading={isSaving}
              disabled={hasInvalid || isBusy}
              onSave={() => void save()}
              onDiscard={discard}
              discardLabel={t('common.discard')}
            />
          )}
        </div>

        <Modal
          open={isKeyModalOpen}
          centered
          title={t('settings.wireguard.privateKey.modalTitle')}
          okText={t('common.save')}
          cancelText={t('common.cancel')}
          okButtonProps={{
            loading: isKeyBusy,
            disabled: !KEY_PATTERN.test(keyInput.trim())
          }}
          afterClose={() => setKeyInput('')}
          onOk={() => void submitKey()}
          onCancel={closeKeyModal}
        >
          <div className="space-y-3 pt-2">
            <div className="text-xs text-neutral-500">
              {t('settings.wireguard.privateKey.modalDescription')}
            </div>
            <Input.Password
              autoFocus
              autoComplete="off"
              spellCheck={false}
              value={keyInput}
              placeholder={t('settings.wireguard.privateKey.placeholder')}
              status={keyInput && !KEY_PATTERN.test(keyInput.trim()) ? 'error' : undefined}
              onChange={(event) => setKeyInput(event.target.value)}
              onPressEnter={() => KEY_PATTERN.test(keyInput.trim()) && void submitKey()}
            />
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

const KEY_PATTERN = /^[A-Za-z0-9+/]{43}=$/;
const HOST_PATTERN =
  /^(?=.{1,253}$)[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const IPV6_PATTERN = /^[0-9a-f:.]*:[0-9a-f:.]*$/i;

function validOctets(text: string) {
  const parts = text.split('.');
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function validCidr(text: string, { prefixRequired }: { prefixRequired: boolean }) {
  const [address, prefix, ...rest] = text.split('/');
  if (rest.length > 0 || !validOctets(address)) return false;
  if (prefix === undefined) return !prefixRequired;
  return /^\d{1,2}$/.test(prefix) && Number(prefix) >= 1 && Number(prefix) <= 32;
}

type Errors = Partial<
  Record<'address' | 'publicKey' | 'endpointHost' | 'endpointPort' | 'allowedIps', true>
>;

// Mirrors the server's checks so mistakes show before saving; the server decides. A turned-off
// tunnel may be half filled in, but whatever is filled in must be right.
function validate(draft: Draft): Errors {
  const errors: Errors = {};
  const required = draft.enabled;
  const filled = (text: string) => text.trim() !== '';

  if (
    (required || filled(draft.address)) &&
    !validCidr(draft.address.trim(), { prefixRequired: true })
  ) {
    errors.address = true;
  }
  if ((required || filled(draft.publicKey)) && !KEY_PATTERN.test(draft.publicKey.trim())) {
    errors.publicKey = true;
  }
  const host = draft.endpointHost.trim();
  if ((required || filled(host)) && !(HOST_PATTERN.test(host) || IPV6_PATTERN.test(host))) {
    errors.endpointHost = true;
  }
  if (required && !draft.endpointPort) {
    errors.endpointPort = true;
  }
  const ranges = draft.allowedIps.map((range) => range.trim()).filter(Boolean);
  if (
    (required && ranges.length === 0) ||
    ranges.some((range) => !validCidr(range, { prefixRequired: false }) || range.endsWith('/0'))
  ) {
    errors.allowedIps = true;
  }

  return errors;
}

function normalize(draft: Draft): Draft {
  return {
    ...draft,
    address: draft.address.trim(),
    publicKey: draft.publicKey.trim(),
    endpointHost: draft.endpointHost.trim(),
    allowedIps: draft.allowedIps.map((range) => range.trim()).filter(Boolean)
  };
}

function toDraft(config: WireguardConfig): Draft {
  return {
    enabled: config.enabled,
    address: config.address,
    publicKey: config.peer.publicKey,
    endpointHost: config.peer.endpointHost,
    endpointPort: config.peer.endpointPort || null,
    allowedIps: config.peer.allowedIps,
    keepalive: config.peer.persistentKeepalive
  };
}

function toConfig(draft: Draft): WireguardConfig {
  const value = normalize(draft);
  return {
    enabled: value.enabled,
    address: value.address,
    peer: {
      publicKey: value.publicKey,
      endpointHost: value.endpointHost,
      endpointPort: value.endpointPort ?? 0,
      allowedIps: value.allowedIps,
      persistentKeepalive: value.keepalive ?? 0
    }
  };
}

function formatBytes(bytes: number) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
}

const StatusCard = ({ status }: { status: WireguardStatus }) => {
  const { t } = useTranslation();

  const age = Date.now() / 1000 - status.latestHandshake;
  const connected = status.running && status.latestHandshake > 0 && age < FRESH_HANDSHAKE_SECONDS;
  const [color, label] = !status.running
    ? ['red', t('settings.wireguard.status.stopped')]
    : connected
      ? ['green', t('settings.wireguard.status.connected')]
      : ['gold', t('settings.wireguard.status.waiting')];

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      <Tag className="m-0" color={color}>
        {label}
      </Tag>
      {status.running && status.latestHandshake > 0 && (
        <span className="text-xs text-neutral-400">
          {t('settings.wireguard.status.handshake', {
            time: new Date(status.latestHandshake * 1000).toLocaleString()
          })}
        </span>
      )}
      {status.running && (
        <span className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <ArrowDownIcon size={12} />
            {formatBytes(status.rxBytes)}
          </span>
          <span className="flex items-center gap-1">
            <ArrowUpIcon size={12} />
            {formatBytes(status.txBytes)}
          </span>
        </span>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col space-y-6">
    <div className="text-neutral-400">{title}</div>
    {children}
  </div>
);
