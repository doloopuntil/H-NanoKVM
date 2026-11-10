import { useState } from 'react';
import { Popconfirm, Slider } from 'antd';
import { CirclePowerIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

import { confirmOkProps } from '@/components/popconfirm-ok.ts';

const DEFAULT_POWER_LONG_DURATION_SECONDS = 12;

type PowerLongProps = {
  showConfirm: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const PowerLong = ({ showConfirm, isLoading, setIsLoading }: PowerLongProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [duration, setDuration] = useState(DEFAULT_POWER_LONG_DURATION_SECONDS);

  function power() {
    if (isLoading) return;
    setIsLoading(true);

    attempt(() => api.setGpio('power', duration * 1000)).finally(() => {
      setIsLoading(false);
    });
  }

  const row = (
    <MenuRow icon={<CirclePowerIcon size={16} />} onClick={showConfirm ? undefined : power}>
      {t('power.powerLong')}
      <span className="ml-2 text-xs text-neutral-500">{`${duration}s`}</span>
    </MenuRow>
  );

  return (
    <>
      {showConfirm ? (
        <Popconfirm
          placement="bottomLeft"
          title={t('power.powerConfirm')}
          okText={t('power.okBtn')}
          cancelText={t('power.cancelBtn')}
          okButtonProps={confirmOkProps}
          color={popconfirmColor}
          onConfirm={power}
        >
          {row}
        </Popconfirm>
      ) : (
        row
      )}

      <div className="px-3">
        <Slider
          defaultValue={DEFAULT_POWER_LONG_DURATION_SECONDS}
          min={1}
          max={30}
          tooltip={{ placement: 'bottom' }}
          onChange={setDuration}
        />
      </div>
    </>
  );
};
