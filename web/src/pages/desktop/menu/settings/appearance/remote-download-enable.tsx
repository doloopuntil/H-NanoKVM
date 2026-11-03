import { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import * as totpApi from '@/api/auth-totp.ts';
import * as downloadApi from '@/api/download.ts';
import { attempt } from '@/lib/feedback.ts';

type RemoteDownloadEnableProps = {
  open: boolean;
  onClose: () => void;
  onEnabled: () => void;
};

// Turning remote download on lets the device fetch URLs, so it asks for the password, and for a
// code when the account has a second factor.
export const RemoteDownloadEnable = ({ open, onClose, onEnabled }: RemoteDownloadEnableProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
      setTotpEnabled(!!rsp?.data?.enabled);
    });
  }, [open]);

  function close() {
    setPassword('');
    setCode('');
    onClose();
  }

  async function submit() {
    setSaving(true);
    const rsp = await attempt(() =>
      downloadApi.setRemoteImageDownloadEnabled(true, password, code.trim() || undefined)
    );
    setSaving(false);
    if (!rsp) return;

    onEnabled();
    close();
  }

  return (
    <Modal
      centered
      open={open}
      title={t('settings.appearance.menuBar.remoteDownloadWarningTitle')}
      okText={t('settings.appearance.menuBar.remoteDownloadWarningConfirm')}
      cancelText={t('common.cancel')}
      okButtonProps={{
        danger: true,
        disabled: !password || (totpEnabled && !code),
        loading: saving
      }}
      onOk={submit}
      onCancel={close}
    >
      <div className="flex flex-col gap-3">
        <span className="text-sm text-neutral-400">
          {t('settings.appearance.menuBar.remoteDownloadWarningDesc')}
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
  );
};
