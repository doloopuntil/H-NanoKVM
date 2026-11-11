import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

export const Reboot = () => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isLoading, setIsLoading] = useState(false);

  function reboot() {
    if (isLoading) return;
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      window.location.reload();
    }, 30000);

    attempt(() => api.reboot()).then((rsp) => {
      if (rsp) return;

      setIsLoading(false);
      clearTimeout(timeoutId);
    });
  }

  return (
    <Popconfirm
      color={popconfirmColor}
      placement="topRight"
      title={t('settings.device.rebootDesc')}
      okText={t('settings.device.reboot')}
      cancelText={t('common.cancel')}
      okButtonProps={confirmOkProps}
      styles={{ root: { maxWidth: 360 } }}
      onConfirm={reboot}
    >
      <Button danger loading={isLoading}>
        {t('settings.device.reboot')}
      </Button>
    </Popconfirm>
  );
};
