import { Button, Progress } from 'antd';
import { DownloadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from './empty-state.tsx';

type SidebarInstallProps = {
  installProgress?: number;
  installStage?: string;
  isInstalling: boolean;
  onInstall: () => void | Promise<void>;
};

export const SidebarInstall = ({
  installProgress,
  installStage,
  isInstalling,
  onInstall
}: SidebarInstallProps) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<DownloadIcon className="text-blue-400" size={24} />}
      title={t('picoclaw.install.requiredTitle')}
      description={
        isInstalling
          ? t('picoclaw.install.progressDescription')
          : t('picoclaw.install.requiredDescription')
      }
    >
      {isInstalling ? (
        <div className="w-full text-left">
          <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
            <span>{t(`picoclaw.install.stages.${installStage || 'downloading'}`)}</span>
            <span>{installProgress ?? 0}%</span>
          </div>
          <Progress
            percent={installProgress || 0}
            showInfo={false}
            railColor="rgba(255,255,255,0.07)"
            status="active"
          />
        </div>
      ) : (
        <Button icon={<DownloadIcon size={16} />} onClick={() => void onInstall()} type="primary">
          {t('picoclaw.install.install')}
        </Button>
      )}
    </EmptyState>
  );
};
