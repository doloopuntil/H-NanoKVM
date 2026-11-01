import { useState } from 'react';
import { InputNumber, Space, Switch } from 'antd';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { rightAlignedNumber } from '@/lib/antd-styles.ts';
import { attempt } from '@/lib/feedback.ts';
import { isHdmiEnabledAtom } from '@/jotai/screen.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { SettingRow } from '@/components/setting-rows.tsx';

export const Hdmi = () => {
  const { t } = useTranslation();

  const [isHdmiEnabled, setIsHdmiEnabled] = useAtom(isHdmiEnabledAtom);

  const [isPcie, setIsPcie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(0);
  const [idleTimeoutInput, setIdleTimeoutInput] = useState<number | null>(0);
  const [isIdleTimeoutLoading, setIsIdleTimeoutLoading] = useState(false);

  const isHardwareReady = useSettingsLoad(api.getHardware, (rsp) => {
    setIsPcie(rsp.data?.version === 'PCIE');
  });

  const isStateReady = useSettingsLoad(api.getHdmiState, (rsp) => {
    setIsHdmiEnabled(rsp.data.enabled);
    const timeout = rsp.data.idleTimeout ?? 0;
    setIdleTimeout(timeout);
    setIdleTimeoutInput(timeout);
  });

  const isReady = isHardwareReady && isStateReady;

  function updateIdleTimeout() {
    if (
      isIdleTimeoutLoading ||
      idleTimeoutInput === null ||
      idleTimeoutInput < 0 ||
      idleTimeoutInput === idleTimeout
    ) {
      return;
    }

    setIsIdleTimeoutLoading(true);
    attempt(() => api.setHdmiIdleTimeout(idleTimeoutInput))
      .then((rsp) => {
        if (!rsp) {
          setIdleTimeoutInput(idleTimeout);
          return;
        }

        setIdleTimeout(idleTimeoutInput);
      })
      .finally(() => {
        setIsIdleTimeoutLoading(false);
      });
  }

  async function setHdmiState() {
    if (isLoading) return;
    setIsLoading(true);

    const enabled = !isHdmiEnabled;

    const rsp = await attempt(() => api.setHdmiState(enabled));
    if (!rsp) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsHdmiEnabled(enabled);
      setIsLoading(false);
    }, 1000);
  }

  if (!isPcie) return null;

  return (
    <>
      <SettingRow label="HDMI" description={t('settings.device.hdmi.description')} isSwitch>
        <Switch
          checked={isHdmiEnabled}
          loading={isLoading}
          disabled={!isReady}
          onChange={setHdmiState}
        />
      </SettingRow>

      <SettingRow
        label={t('settings.device.hdmi.idleTimeoutTitle')}
        description={t('settings.device.hdmi.idleTimeoutDescription')}
        inline
      >
        <Space.Compact>
          <InputNumber
            className="w-20"
            styles={rightAlignedNumber}
            min={0}
            max={10080}
            precision={0}
            value={idleTimeoutInput}
            disabled={isIdleTimeoutLoading || !isReady}
            onChange={setIdleTimeoutInput}
            onBlur={updateIdleTimeout}
            onPressEnter={updateIdleTimeout}
          />
          <Space.Addon className="w-16 text-center">{t('settings.device.minutes')}</Space.Addon>
        </Space.Compact>
      </SettingRow>
    </>
  );
};
