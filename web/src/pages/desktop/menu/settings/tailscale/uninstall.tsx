import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

type UninstallProps = {
  onSuccess: () => void;
};

export const Uninstall = ({ onSuccess }: UninstallProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isLoading, setIsLoading] = useState(false);

  function uninstall() {
    if (isLoading) return;
    setIsLoading(true);

    return attempt(() => api.uninstall()).finally(() => {
      setIsLoading(false);
      onSuccess();
    });
  }

  return (
    <Popconfirm
      color={popconfirmColor}
      placement="topRight"
      title={t('settings.tailscale.uninstallDesc')}
      okText={t('settings.tailscale.uninstall')}
      cancelText={t('common.cancel')}
      okButtonProps={confirmOkProps}
      styles={{ root: { maxWidth: 360 } }}
      onConfirm={uninstall}
    >
      <Button danger loading={isLoading}>
        {t('settings.tailscale.uninstall')}
      </Button>
    </Popconfirm>
  );
};
