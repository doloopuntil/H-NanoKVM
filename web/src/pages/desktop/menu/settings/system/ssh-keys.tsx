import { useEffect, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Tag } from 'antd';
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as totpApi from '@/api/auth-totp.ts';
import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';
import { InfoRow, SettingRow } from '@/components/setting-rows.tsx';

type SshKeysProps = {
  // keys only because of two-factor auth, with no key registered: nobody can log in over SSH
  onLockoutChange: (lockout: boolean) => void;
};

export const SshKeys = ({ onLockoutChange }: SshKeysProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [state, setState] = useState<api.SshKeys>({ keys: [], keysOnly: false });
  const [removing, setRemoving] = useState<string | null>(null);
  // the add dialog
  const [open, setOpen] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [label, setLabel] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);
  // a second factor is asked for when the account has one
  const [totpEnabled, setTotpEnabled] = useState(false);

  function apply(data: api.SshKeys) {
    setState(data);
    onLockoutChange(data.keysOnly && data.keys.length === 0);
  }

  const isReady = useSettingsLoad(api.getSshKeys, (rsp) => apply(rsp.data));

  useEffect(() => {
    attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
      setTotpEnabled(!!rsp?.data?.enabled);
    });
  }, []);

  function close() {
    setOpen(false);
    setPublicKey('');
    setLabel('');
    setPassword('');
    setCode('');
  }

  async function add() {
    setSaving(true);
    const rsp = await attempt(() =>
      api.addSshKey(
        password,
        publicKey.trim(),
        label.trim() || undefined,
        code.trim() || undefined
      )
    );
    setSaving(false);
    if (!rsp) return;
    apply(rsp.data);
    close();
  }

  async function remove(fingerprint: string) {
    setRemoving(fingerprint);
    const rsp = await attempt(() => api.removeSshKey(fingerprint));
    setRemoving(null);
    if (rsp) apply(rsp.data);
  }

  return (
    <>
      <InfoRow
        label={t('settings.device.sshKeys.passwordLogin')}
        description={
          state.keysOnly
            ? t('settings.device.sshKeys.passwordLoginOffDesc')
            : t('settings.device.sshKeys.passwordLoginOnDesc')
        }
        value={
          isReady
            ? state.keysOnly
              ? t('settings.device.sshKeys.off')
              : t('settings.device.sshKeys.on')
            : undefined
        }
      />

      {state.keys.map((key) => (
        <SettingRow
          key={key.fingerprint}
          label={
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {key.label || t('settings.device.sshKeys.unnamed')}
              {key.hasOptions && <Tag className="m-0">{t('settings.device.sshKeys.options')}</Tag>}
            </span>
          }
          description={`${key.keyType} ${key.fingerprint}`}
          inline
        >
          <Popconfirm
            color={popconfirmColor}
            placement="topRight"
            title={t('settings.device.sshKeys.removeConfirm')}
            okText={t('settings.device.sshKeys.remove')}
            cancelText={t('common.cancel')}
            okButtonProps={confirmOkProps}
            onConfirm={() => remove(key.fingerprint)}
          >
            <Button
              danger
              icon={<Trash2Icon size={16} />}
              loading={removing === key.fingerprint}
              disabled={!!removing}
              aria-label={t('settings.device.sshKeys.remove')}
            />
          </Popconfirm>
        </SettingRow>
      ))}

      <SettingRow
        label={t('settings.device.sshKeys.add')}
        description={t('settings.device.sshKeys.addDesc')}
        inline
      >
        <Button disabled={!isReady} onClick={() => setOpen(true)}>
          {t('settings.device.sshKeys.addButton')}
        </Button>
      </SettingRow>

      <Modal
        centered
        open={open}
        title={t('settings.device.sshKeys.addTitle')}
        okText={t('settings.device.sshKeys.addButton')}
        cancelText={t('common.cancel')}
        okButtonProps={{
          disabled: !publicKey.trim() || !password || (totpEnabled && !code),
          loading: saving
        }}
        onOk={add}
        onCancel={close}
      >
        <div className="flex flex-col gap-3">
          <span className="text-sm text-neutral-400">{t('settings.device.sshKeys.addHelp')}</span>
          <Input.TextArea
            rows={4}
            value={publicKey}
            placeholder="ssh-ed25519 AAAA…"
            onChange={(e) => setPublicKey(e.target.value)}
          />
          <Input
            value={label}
            maxLength={64}
            placeholder={t('settings.device.sshKeys.labelPlaceholder')}
            onChange={(e) => setLabel(e.target.value)}
          />
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
