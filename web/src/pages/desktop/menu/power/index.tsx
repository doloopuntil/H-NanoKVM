import { useCallback, useEffect, useState } from 'react';
import { Switch, Tooltip } from 'antd';
import { LoaderCircleIcon, PowerIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm';
import * as localstorage from '@/lib/localstorage.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

import { PowerLong } from './power-long.tsx';
import { PowerShort } from './power-short.tsx';
import { Reset } from './reset.tsx';

export const Power = () => {
  const { t } = useTranslation();

  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(() => localstorage.getPowerConfirm());

  const getLed = useCallback(async () => {
    try {
      const rsp = await api.getGpio();
      if (rsp.code === 0) {
        setIsPowerOn(rsp.data.pwr);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sets state after the request answers
    getLed();
    const interval = setInterval(getLed, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [getLed]);

  function updateShowConfirm(value: boolean) {
    setShowConfirm(value);
    localstorage.setPowerConfirm(value);
  }

  const icon = (
    <div
      className={
        isPowerOn ? 'text-red-400 hover:text-red-500' : 'text-green-600 hover:text-green-500'
      }
    >
      {isLoading ? (
        <LoaderCircleIcon className="animate-spin" size={18} />
      ) : (
        <PowerIcon size={18} />
      )}
    </div>
  );

  const content = (
    <div className="min-w-50">
      <MenuHeader title={t('power.title')}>
        <Tooltip title={t('power.showConfirmTip')} placement="right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">{t('power.showConfirm')}</span>

            <Switch size="small" checked={showConfirm} onChange={updateShowConfirm} />
          </div>
        </Tooltip>
      </MenuHeader>

      <div className="flex flex-col gap-1">
        <Reset showConfirm={showConfirm} isLoading={isLoading} setIsLoading={setIsLoading} />
        <PowerShort showConfirm={showConfirm} isLoading={isLoading} setIsLoading={setIsLoading} />
        <PowerLong showConfirm={showConfirm} isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </div>
  );

  return <MenuItem title={t('power.title')} icon={icon} content={content} />;
};
