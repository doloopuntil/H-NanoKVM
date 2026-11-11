import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Progress, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/application.ts';
import * as totpApi from '@/api/auth-totp.ts';
import { getVirtualDevice, updateVirtualDevice } from '@/api/virtual-device.ts';
import { encrypt } from '@/lib/encrypt.ts';
import { attempt, confirm, toast } from '@/lib/feedback.ts';
import type { UploadResponse } from '@/lib/upload.ts';
import { SettingRow } from '@/components/setting-rows.tsx';

function megabytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export type LocalKey = { configured: boolean; fingerprint?: string | null };

type UploadProps = {
  disabled: boolean;
  // the local key, or null while it loads; uploads are checked against it, so they need one
  localKey: LocalKey | null;
  onStaged: (data: any) => void;
  setBusy: (busy: boolean) => void;
};

type BundleUploadProps = UploadProps & {
  label: string;
  description: string;
  // why the server will not take a file of this size, or null
  check: (size: number) => Promise<string | null>;
  send: (
    data: FormData,
    onProgress: (loaded: number, total: number) => void
  ) => Promise<UploadResponse>;
};

export const SystemUpload = (props: UploadProps) => {
  const { t } = useTranslation();

  return (
    <BundleUpload
      {...props}
      label={t('settings.update.local.title')}
      description={t('settings.update.local.desc')}
      check={api.checkSystemUpload}
      send={api.uploadSystemUpdate}
    />
  );
};

export const ApplicationUpload = (props: UploadProps) => {
  const { t } = useTranslation();

  return (
    <BundleUpload
      {...props}
      label={t('settings.update.offline.title')}
      description={t('settings.update.offline.desc')}
      check={api.checkApplicationUpload}
      send={api.uploadApplicationUpdate}
    />
  );
};

const BundleUpload = ({
  disabled,
  localKey,
  onStaged,
  setBusy,
  label,
  description,
  check,
  send
}: BundleUploadProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  // bytes sent so far, or undefined while nothing is being uploaded
  const [sent, setSent] = useState<{ loaded: number; total: number }>();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!/\.tar(\.gz)?$/.test(file.name)) {
      setError(t('settings.update.local.invalidFile'));
      return;
    }

    setError('');

    // /data is read-only while the virtual disk serves it to the host, and the bundle is staged
    // there, so the disk has to go off first
    const rsp = await attempt(() => getVirtualDevice(), { quiet: true });
    if (rsp?.data?.disk) {
      confirm({
        title: t('settings.update.local.diskTitle'),
        content: t('settings.update.local.diskWarn'),
        okText: t('download.diskOff'),
        onOk: () => {
          void turnDiskOffAndUpload(file);
        }
      });
      return;
    }

    await upload(file);
  }

  async function turnDiskOffAndUpload(file: File) {
    setBusy(true);
    // The button toggles, so only press it while the disk is still on.
    const state = await attempt(() => getVirtualDevice(), { quiet: true });
    const rsp = state?.data?.disk ? await attempt(() => updateVirtualDevice('disk')) : state;
    setBusy(false);
    if (rsp) await upload(file);
  }

  async function upload(file: File) {
    setBusy(true);
    const data = new FormData();
    data.append('file', file);

    // Ask first: the server refuses an upload before reading it (read-only /data, no space, an
    // update running), and the browser would only see a connection reset instead of the reason.
    const refusal = await check(file.size);
    if (refusal) {
      showFailure(refusal);
      setBusy(false);
      return;
    }

    // Not `attempt`: a network failure or a raw server error must stay readable here, since the
    // upload is the one step that can fail in the browser before the request is sent.
    try {
      setSent({ loaded: 0, total: file.size });
      const rsp = await send(data, (loaded, total) =>
        setSent({ loaded, total: total || file.size })
      );
      if (rsp.code === 0) {
        onStaged(rsp.data);
      } else {
        showFailure(rsp.msg);
      }
    } catch (err) {
      console.log(err);
      // an UploadError says what the server said, or the status, or that the link failed
      showFailure(err instanceof Error ? err.message : undefined);
    } finally {
      setSent(undefined);
      setBusy(false);
    }
  }

  function showFailure(detail?: string) {
    const text = detail ? `${t('common.actionFailed')}: ${detail}` : t('common.actionFailed');
    setError(text);
    toast.error(t('common.actionFailed'), { description: detail, key: `upload:${detail ?? ''}` });
  }

  const percent = sent && sent.total > 0 ? Math.floor((sent.loaded / sent.total) * 100) : 0;
  const isVerifying = !!sent && sent.total > 0 && sent.loaded >= sent.total;

  return (
    <>
      <SettingRow
        label={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {label}
            {localKey && !localKey.configured && (
              <Tag className="m-0" color="orange">
                {t('settings.update.local.keyRequired')}
              </Tag>
            )}
          </span>
        }
        description={error || description}
        inline
      >
        <input
          ref={inputRef}
          type="file"
          accept=".tar,.gz"
          onChange={handleChange}
          className="hidden"
        />
        <Button
          disabled={disabled || !localKey?.configured}
          onClick={() => inputRef.current?.click()}
        >
          {t('settings.update.local.choose')}
        </Button>
      </SettingRow>
      {sent && (
        <div className="flex min-w-0 flex-col gap-1">
          <Progress percent={percent} size="small" showInfo={false} status="active" />
          <span className="text-xs text-neutral-500">
            {isVerifying
              ? t('settings.update.local.verifying')
              : `${t('settings.update.local.uploading')} ${t('settings.system.monitor.sizeOf', {
                  used: megabytes(sent.loaded),
                  total: megabytes(sent.total)
                })}`}
          </span>
        </div>
      )}
    </>
  );
};

export const LocalKeyRow = ({
  localKey: key,
  onChange
}: {
  localKey: LocalKey | null;
  onChange: (key: LocalKey) => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pem, setPem] = useState('');
  const [password, setPassword] = useState('');
  // a second factor is asked for when the account has one
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [code, setCode] = useState('');
  const [removing, setRemoving] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
      setTotpEnabled(!!rsp?.data?.enabled);
    });
  }, []);

  function close() {
    setOpen(false);
    setRemoving(false);
    setPem('');
    setPassword('');
    setCode('');
  }

  async function submit() {
    setSaving(true);
    const rsp = await attempt(() =>
      removing
        ? api.removeLocalUpdateKey(encrypt(password), code.trim() || undefined)
        : api.setLocalUpdateKey(encrypt(password), pem, code.trim() || undefined)
    );
    setSaving(false);
    if (!rsp) return;

    onChange(removing ? { configured: false } : rsp.data);
    close();
  }

  return (
    <>
      <SettingRow
        label={t('settings.update.local.keyTitle')}
        description={
          key?.configured
            ? (key.fingerprint ?? t('settings.update.local.keyDesc'))
            : t('settings.update.local.keyNone')
        }
        inline
      >
        <div className="flex gap-2">
          {key?.configured && (
            <Button
              danger
              onClick={() => {
                setRemoving(true);
                setOpen(true);
              }}
            >
              {t('settings.update.local.keyRemove')}
            </Button>
          )}
          <Button onClick={() => setOpen(true)}>{t('settings.update.local.keySet')}</Button>
        </div>
      </SettingRow>

      <Modal
        centered
        open={open}
        title={t('settings.update.local.keyTitle')}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        okButtonProps={{
          disabled: !password || (totpEnabled && !code) || (!removing && !pem),
          loading: saving
        }}
        onOk={submit}
        onCancel={close}
      >
        <div className="flex flex-col gap-3">
          {!removing && (
            <>
              <span className="text-sm text-neutral-400">{t('settings.update.local.keyDesc')}</span>
              <Input.TextArea
                rows={6}
                value={pem}
                placeholder="-----BEGIN PUBLIC KEY-----"
                onChange={(e) => setPem(e.target.value)}
              />
            </>
          )}
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
};
