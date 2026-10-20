import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { CheckIcon, KeyRoundIcon, LockIcon, WifiIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import * as api from '@/api/network.ts';
import { Head } from '@/components/head.tsx';

type State = '' | 'loading' | 'success' | 'failed' | 'denied';
type VerifyState = '' | 'failed' | 'denied';

export const Wifi = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>('');
  const [apPassword, setApPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyState, setVerifyState] = useState<VerifyState>('');

  useEffect(() => {
    const pass = searchParams.get('p') || searchParams.get('P');
    if (pass) {
      verifyPassword(pass);
    }
    // reads the password from the link once, when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyPassword(password: string) {
    if (verifying) return;
    setVerifying(true);
    setVerifyState('');

    try {
      const rsp = await api.verifyApLogin(password);
      if (rsp?.code === 0) {
        setApPassword(password);
        setIsAuthenticated(true);
      } else {
        setVerifyState(rsp?.code === -1 ? 'denied' : 'failed');
      }
    } catch (err) {
      console.error(err);
      setVerifyState('failed');
    }
    setVerifying(false);
  }

  async function onVerifyFinish(values: any) {
    if (!values.apPassword) return;
    await verifyPassword(values.apPassword);
  }

  async function connect(values: any) {
    if (!values.ssid || !values.password) return;

    if (state === 'loading') return;
    setState('loading');

    try {
      const rsp = await api.connectWifiNoAuth(values.ssid, values.password, apPassword);

      switch (rsp?.code) {
        case 0:
          setState('success');
          return;
        case -1:
        case -4:
          setState('denied');
          return;
        default:
          setState('failed');
          return;
      }
    } catch {
      setState('failed');
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head title={t('head.wifi')} />

        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <Form
            style={{ minWidth: 300, maxWidth: 500 }}
            initialValues={{ remember: true }}
            onFinish={onVerifyFinish}
          >
            <div className="flex flex-col gap-1 pb-5">
              <span className="text-center text-2xl font-semibold text-red-500">
                {t('wifi.ap.authTitle')}
              </span>
              <span className="text-center text-neutral-400">{t('wifi.ap.authDescription')}</span>
            </div>

            <Form.Item name="apPassword">
              <Input.Password
                prefix={<KeyRoundIcon size={16} />}
                placeholder={t('wifi.ap.passPlaceholder')}
              />
            </Form.Item>

            <Form.Item>
              <Button className="w-full" htmlType="submit" type="primary" loading={verifying}>
                {t('wifi.ap.verifyBtn')}
              </Button>
            </Form.Item>
          </Form>

          <div className="flex max-w-125 justify-center px-5 pt-3 md:px-10">
            {verifyState === 'failed' && (
              <span className="text-sm text-red-500">{t('wifi.ap.authFailed')}</span>
            )}
            {verifyState === 'denied' && (
              <span className="text-sm text-red-500">{t('wifi.invalidMode')}</span>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={t('head.wifi')} />

      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Form
          style={{ minWidth: 300, maxWidth: 500 }}
          initialValues={{ remember: true }}
          onFinish={connect}
        >
          <div className="flex flex-col gap-1 pb-5">
            <span className="text-center text-2xl font-semibold text-neutral-100">
              {t('wifi.title')}
            </span>
            <span className="text-center text-neutral-400">{t('wifi.description')}</span>
          </div>

          <Form.Item name="ssid">
            <Input prefix={<WifiIcon size={16} />} placeholder="SSID" />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password
              prefix={<LockIcon size={16} />}
              placeholder={t('auth.placeholderPassword')}
            />
          </Form.Item>

          <Form.Item>
            {state === 'success' ? (
              <Button className="w-full" type="primary" icon={<CheckIcon size={16} />}>
                {t('wifi.finishBtn')}
              </Button>
            ) : (
              <Button
                className="w-full"
                htmlType="submit"
                type="primary"
                loading={state === 'loading'}
              >
                {t('wifi.confirmBtn')}
              </Button>
            )}
          </Form.Item>
        </Form>

        <div className="flex max-w-125 justify-center px-5 pt-3 md:px-10">
          {state === 'success' && (
            <span className="text-sm text-green-500">{t('wifi.success')}</span>
          )}

          {state === 'failed' && <span className="text-sm text-red-500">{t('wifi.failed')} </span>}
          {state === 'denied' && (
            <div className="flex flex-col items-center gap-5">
              <span className="text-sm text-red-500">{t('wifi.invalidMode')} </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
