import { useEffect, useState } from 'react';
import { Button, Card, Form, Input } from 'antd';
import { LockIcon, ShieldUserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as totpApi from '@/api/auth-totp.ts';
import * as api from '@/api/auth.ts';
import { removeToken } from '@/lib/cookie.ts';
import { encrypt } from '@/lib/encrypt.ts';
import { Head } from '@/components/head.tsx';

export const Password = () => {
  const { t } = useTranslation();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  // a second factor is asked for when the account has one
  const [totpEnabled, setTotpEnabled] = useState(false);

  useEffect(() => {
    totpApi
      .getStatus()
      .then((rsp) => setTotpEnabled(rsp.code === 0 && !!rsp.data?.enabled))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (msg) {
      setTimeout(() => setMsg(''), 3000);
    }
  }, [msg]);

  function changePassword(values: any) {
    if (values.password !== values.password2) {
      setMsg(t('auth.differentPassword'));
      return;
    }
    if (!validateString(values.password)) {
      setMsg(t('auth.illegalPassword'));
      return;
    }

    const currentPassword = encrypt(values.currentPassword);
    const password = encrypt(values.password);

    // There is a single account, and the server wants its name with the request.
    api
      .getAccount()
      .then((account: any) => {
        const username = account.data?.username;
        if (account.code !== 0 || !username) {
          setMsg(t('auth.error'));
          return;
        }

        const code = values.code?.trim() || undefined;
        return api.changePassword(username, currentPassword, password, code).then((rsp: any) => {
          if (rsp.code === -2) {
            setMsg(t('auth.wrongCurrentPassword'));
            return;
          }
          if (rsp.code === -6) {
            setMsg(t('auth.totp.invalidCode'));
            return;
          }
          if (rsp.code === -1 && rsp.msg) {
            setMsg(rsp.msg);
            return;
          }
          if (rsp.code !== 0) {
            setMsg(t('auth.error'));
            return;
          }

          removeToken();
          navigate('/auth/login', { replace: true });
        });
      })
      .catch((err) => {
        const detail = err?.response?.data?.msg;
        setMsg(typeof detail === 'string' && detail ? detail : t('auth.error'));
      });
  }

  function validateString(str: string) {
    const regex = /['"\\/]/;
    return !regex.test(str);
  }

  function cancel() {
    window.location.replace('/');
  }

  return (
    <>
      <Head title={t('head.changePassword')} />

      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 px-4 py-6">
        <h2 className="text-xl font-semibold text-neutral-100">{t('auth.changePassword')}</h2>

        <Form
          style={{ minWidth: 300, maxWidth: 500 }}
          initialValues={{ remember: true }}
          onFinish={changePassword}
        >
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: t('auth.noEmptyPassword'), min: 1 }]}
          >
            <Input
              prefix={<LockIcon size={16} />}
              type="password"
              autoComplete="current-password"
              placeholder={t('auth.placeholderCurrentPassword')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t('auth.noEmptyPassword'), min: 1 }]}
          >
            <Input
              prefix={<LockIcon size={16} />}
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.placeholderNewPassword')}
            />
          </Form.Item>

          <Form.Item
            name="password2"
            rules={[{ required: true, message: t('auth.noEmptyPassword'), min: 1 }]}
          >
            <Input
              prefix={<LockIcon size={16} />}
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.placeholderPassword2')}
            />
          </Form.Item>

          {totpEnabled && (
            <Form.Item
              name="code"
              rules={[{ required: true, message: t('auth.totp.noEmptyCode'), min: 1 }]}
            >
              <Input
                prefix={<ShieldUserIcon size={16} />}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder={t('auth.totp.placeholderCode')}
              />
            </Form.Item>
          )}

          {msg && <div className="mb-3 text-red-500">{msg}</div>}
          <Form.Item>
            <div className="flex w-full space-x-2">
              <Button type="primary" htmlType="submit" className="w-1/2">
                {t('auth.ok')}
              </Button>
              <Button className="w-1/2" onClick={cancel}>
                {t('auth.cancel')}
              </Button>
            </div>
          </Form.Item>
        </Form>

        <Card className="w-full max-w-[500px]">
          <div className="flex flex-col wrap-break-word">
            <div>{t('auth.tips.change1')}</div>
            <ul className="my-3.5 list-outside list-decimal pl-10">
              <li>{t('auth.tips.change2')}</li>
              <li>{t('auth.tips.change3')}</li>
            </ul>
            <div className="text-red-500">
              {t('auth.tips.hardenedRecovery', {
                defaultValue:
                  'This Hardened image does not support password reset from the BOOT button. If the password is lost, reflash the SD card and create a new account.'
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
