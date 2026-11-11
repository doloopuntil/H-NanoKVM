import { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import * as totpApi from '@/api/auth-totp.ts';
import * as authApi from '@/api/auth.ts';
import * as vmApi from '@/api/vm.ts';
import { encrypt } from '@/lib/encrypt.ts';
import { attempt } from '@/lib/feedback.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';

type UnlockProps = {
  onUnlock: (ticket: string) => void;
  onCancel: () => void;
};

// Scripts run as root, so each upload or run needs a fresh terminal unlock: the password, and a
// code when the account has a second factor.
export const Unlock = ({ onUnlock, onCancel }: UnlockProps) => {
  const { t } = useTranslation();
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [msg, setMsg] = useState('');

  // The desktop sends every key to the controlled computer; typing here needs that off.
  useEffect(() => {
    setIsKeyboardEnable(false);
    return () => setIsKeyboardEnable(true);
  }, [setIsKeyboardEnable]);

  useEffect(() => {
    attempt(() => authApi.getAccount(), { quiet: true }).then((rsp) => {
      setUsername(rsp?.data?.username ?? '');
    });
    attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
      setTotpEnabled(!!rsp?.data?.enabled);
    });
  }, []);

  function unlock() {
    if (isUnlocking) return;
    setMsg('');
    setIsUnlocking(true);

    vmApi
      .unlockTerminal(username, encrypt(password), code.trim() || undefined)
      .then((rsp) => {
        if (rsp.code === 0) {
          onUnlock(rsp.data.ticket);
          return;
        }
        if (rsp.code === -2) setMsg(t('terminal.invalidCredentials'));
        else if (rsp.code === -5) setMsg(t('terminal.locked'));
        else if (rsp.code === -6) setMsg(t('auth.totp.invalidCode'));
        else setMsg(rsp.msg || t('terminal.unlockFailed'));
      })
      .catch((err) => {
        if (err?.response?.status === 403) setMsg(t('script.terminalRequired'));
        else setMsg(err?.response?.data?.msg || t('terminal.unlockFailed'));
      })
      .finally(() => setIsUnlocking(false));
  }

  return (
    <Modal
      centered
      open
      destroyOnHidden
      title={t('terminal.unlockTitle')}
      okText={t('terminal.unlock')}
      cancelText={t('common.cancel')}
      okButtonProps={{
        disabled: !username || !password || (totpEnabled && !code),
        loading: isUnlocking
      }}
      onOk={unlock}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-4 py-2">
        <p className="m-0">{t('script.unlockDesc')}</p>
        <Input.Password
          autoFocus
          value={password}
          autoComplete="current-password"
          placeholder={t('settings.account.password')}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={unlock}
        />
        {totpEnabled && (
          <Input
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t('auth.totp.placeholderCode')}
            onChange={(e) => setCode(e.target.value)}
            onPressEnter={unlock}
          />
        )}
        {msg && <div className="text-sm text-red-500">{msg}</div>}
      </div>
    </Modal>
  );
};
