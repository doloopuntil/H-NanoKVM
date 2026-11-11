import { useState } from 'react';
import { Button, Input, Modal, Popconfirm } from 'antd';
import { LockIcon, WifiIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/network.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';
import { SettingRow } from '@/components/setting-rows.tsx';

export const Wifi = () => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isSupported, setIsSupported] = useState(false);
  const [isAPMode, setIsAPMode] = useState(false);
  const [connectedWiFi, setConnectedWifi] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'' | 'connecting' | 'disconnecting'>('');

  const applyWiFi = (rsp: { data?: any }) => {
    setIsSupported(!!rsp.data?.supported);
    setIsAPMode(!!rsp.data?.apMode);

    if (rsp.data?.connected && rsp.data?.ssid) {
      setConnectedWifi(rsp.data.ssid);
    } else {
      setConnectedWifi('');
    }
  };

  const isReady = useSettingsLoad(api.getWiFi, applyWiFi);

  // refresh after a failed connect
  async function getWiFi() {
    const rsp = await attempt(() => api.getWiFi(), { quiet: true });
    if (rsp) applyWiFi(rsp);
  }

  async function connect() {
    if (!ssid || !password) return;

    if (status !== '') return;
    setStatus('connecting');

    const rsp = await attempt(() => api.connectWifi(ssid, password));
    if (rsp) {
      setConnectedWifi(ssid);
      setIsModalOpen(false);
    } else {
      getWiFi();
    }

    setStatus('');
  }

  async function disconnect() {
    if (status !== '') return;

    setStatus('disconnecting');

    const rsp = await attempt(() => api.disconnectWifi());
    if (rsp) {
      setConnectedWifi('');
      setIsModalOpen(false);
    }

    setStatus('');
  }

  function openModal() {
    setSsid('');
    setPassword('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (status !== '') return;
    setIsModalOpen(false);
  }

  if (!isSupported) {
    return <></>;
  }

  if (isAPMode) {
    return (
      <SettingRow
        label={t('settings.network.wifi.title')}
        description={t('settings.network.wifi.apMode')}
        inline
      >
        {null}
      </SettingRow>
    );
  }

  return (
    <>
      <SettingRow
        label={t('settings.network.wifi.title')}
        description={connectedWiFi ? connectedWiFi : t('settings.network.wifi.description')}
        inline
      >
        <Button disabled={!isReady} onClick={openModal}>
          {connectedWiFi ? t('settings.account.updateBtn') : t('settings.network.wifi.joinBtn')}
        </Button>
      </SettingRow>

      <Modal
        title={t('settings.network.wifi.connect')}
        open={isModalOpen}
        centered={true}
        onOk={connect}
        onCancel={closeModal}
        okText={t('settings.network.wifi.joinBtn')}
        cancelText={t('settings.network.wifi.cancelBtn')}
        okButtonProps={{ disabled: !ssid || !password }}
        confirmLoading={status === 'connecting'}
      >
        <div className="flex flex-col gap-4 py-2">
          {connectedWiFi && (
            <SettingRow
              label={connectedWiFi}
              description={t('settings.network.wifi.connected')}
              inline
            >
              {/* the link may be the one this page is loaded over */}
              <Popconfirm
                color={popconfirmColor}
                placement="topRight"
                title={t('settings.network.wifi.disconnect')}
                okText={t('settings.network.wifi.disconnectBtn')}
                cancelText={t('settings.network.wifi.cancelBtn')}
                okButtonProps={confirmOkProps}
                styles={{ root: { maxWidth: 360 } }}
                onConfirm={disconnect}
              >
                <Button danger loading={status === 'disconnecting'}>
                  {t('settings.network.wifi.disconnectBtn')}
                </Button>
              </Popconfirm>
            </SettingRow>
          )}

          <span className="text-sm text-neutral-400">
            {t('settings.network.wifi.connectDesc1')}
          </span>

          <Input
            value={ssid}
            prefix={<WifiIcon size={16} />}
            placeholder={t('settings.network.wifi.ssid')}
            onChange={(e) => setSsid(e.target.value)}
          />
          <Input.Password
            value={password}
            prefix={<LockIcon size={16} />}
            placeholder={t('settings.network.wifi.password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};
