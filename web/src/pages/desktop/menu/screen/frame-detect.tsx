import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { LoaderCircleIcon, ScanEyeIcon, ScanIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/stream.ts';
import { attempt } from '@/lib/feedback.ts';
import * as ls from '@/lib/localstorage.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

export const FrameDetect = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => ls.getFrameDetect());

  useEffect(() => {
    if (!ls.getFrameDetect()) {
      attempt(() => api.updateFrameDetect(false), { quiet: true });
    }
  }, []);

  function update() {
    if (isLoading) return;
    setIsLoading(true);

    const enabled = !isEnabled;

    attempt(() => api.updateFrameDetect(enabled))
      .then((rsp) => {
        if (rsp) {
          setIsEnabled(enabled);
          ls.setFrameDetect(enabled);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Tooltip placement="rightTop" title={t('screen.frameDetectTip')} color="#262626" arrow>
      <MenuRow
        className="group"
        icon={
          isLoading ? (
            <LoaderCircleIcon className="animate-spin" size={16} />
          ) : isEnabled ? (
            <ScanEyeIcon color="#22c55e" size={16} />
          ) : (
            <ScanIcon size={16} />
          )
        }
        onClick={update}
      >
        <span className={isEnabled ? 'group-hover:text-red-500' : 'group-hover:text-green-500'}>
          {t('screen.frameDetect')}
        </span>
      </MenuRow>
    </Tooltip>
  );
};
