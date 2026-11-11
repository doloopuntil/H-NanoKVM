import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

export const Poweroff = () => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isLoading, setIsLoading] = useState(false);

  // the device goes away, so the button keeps spinning once it has been told to
  function poweroff() {
    if (isLoading) return;
    setIsLoading(true);

    attempt(() => api.poweroff()).then((rsp) => {
      if (!rsp) setIsLoading(false);
    });
  }

  return (
    <Popconfirm
      color={popconfirmColor}
      placement="topRight"
      title={t('settings.device.poweroffDesc')}
      okText={t('settings.device.poweroff')}
      cancelText={t('common.cancel')}
      okButtonProps={confirmOkProps}
      styles={{ root: { maxWidth: 360 } }}
      onConfirm={poweroff}
    >
      <Button danger loading={isLoading}>
        {t('settings.device.poweroff')}
      </Button>
    </Popconfirm>
  );
};
