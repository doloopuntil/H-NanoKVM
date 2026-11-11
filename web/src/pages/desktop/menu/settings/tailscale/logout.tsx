import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/extensions/tailscale.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

type LogoutProps = {
  onSuccess: () => void;
};

export const Logout = ({ onSuccess }: LogoutProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    if (isLoading) return;
    setIsLoading(true);

    const rsp = await attempt(() => api.logout());
    if (rsp) onSuccess();

    setIsLoading(false);
  }

  return (
    <Popconfirm
      color={popconfirmColor}
      placement="topRight"
      title={t('settings.tailscale.logoutDesc')}
      okText={t('settings.tailscale.logout')}
      cancelText={t('common.cancel')}
      okButtonProps={confirmOkProps}
      styles={{ root: { maxWidth: 360 } }}
      onConfirm={logout}
    >
      <Button danger loading={isLoading}>
        {t('settings.tailscale.logout')}
      </Button>
    </Popconfirm>
  );
};
