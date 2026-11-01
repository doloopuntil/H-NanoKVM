import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Popconfirm, Popover, Select, Tooltip } from 'antd';
import clsx from 'clsx';
import {
  HistoryIcon,
  LoaderCircleIcon,
  PanelRightCloseIcon,
  PlayIcon,
  PowerIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  Trash2Icon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { confirm } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { MenuRow } from '@/components/menu-rows.tsx';

type HeaderButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: ReactNode;
  loading?: boolean;
  // switched on, such as the history while it is open
  active?: boolean;
  danger?: boolean;
};

// The icon buttons of the header: the 30px square of the menu bar. Props pass on so that
// Tooltip, Popconfirm and Dropdown can wrap one.
const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ icon, loading, active, danger, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={clsx(
        'box-border flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded border-0 bg-transparent p-0',
        disabled || loading
          ? 'cursor-not-allowed text-neutral-500'
          : [
              'cursor-pointer hover:bg-neutral-700/80',
              danger ? 'text-red-400 hover:text-red-500' : 'text-neutral-300 hover:text-white',
              active && 'bg-neutral-700/80 text-white'
            ],
        className
      )}
      {...props}
    >
      {loading ? <LoaderCircleIcon size={16} className="animate-spin" /> : icon}
    </button>
  )
);
HeaderButton.displayName = 'HeaderButton';

type SidebarHeaderProps = {
  isCheckingRuntime: boolean;
  installed?: boolean;
  modelConfigured?: boolean;
  runtimeReady?: boolean;
  isTogglingRuntime: boolean;
  agentProfile?: string;
  isSwitchingAgent?: boolean;
  isHistoryOpen?: boolean;
  onToggleRuntime: () => void | Promise<void>;
  onClose?: () => void;
  onOpenHistory?: () => void;
  onAgentProfileChange?: (profile: string) => void | Promise<void>;
  onOpenModelConfig?: () => void;
  isUninstallingRuntime?: boolean;
  onUninstallRuntime?: () => void | Promise<void>;
};

export const SidebarHeader = ({
  isCheckingRuntime,
  installed,
  modelConfigured,
  runtimeReady,
  isTogglingRuntime,
  agentProfile,
  isSwitchingAgent,
  isHistoryOpen,
  onToggleRuntime,
  onClose,
  onOpenHistory,
  onAgentProfileChange,
  onOpenModelConfig,
  isUninstallingRuntime,
  onUninstallRuntime
}: SidebarHeaderProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isRuntimeReady = runtimeReady === true;
  const isInstalled = installed !== false;
  const isModelConfigured = modelConfigured !== false;

  const agentOptions = [
    {
      value: 'kvm',
      title: t('picoclaw.agent.kvmTitle'),
      description: t('picoclaw.agent.kvmDescription')
    },
    {
      value: 'default',
      title: t('picoclaw.agent.defaultTitle'),
      description: t('picoclaw.agent.defaultDescription')
    }
  ];

  const handleUninstallClick = () =>
    confirm({
      danger: true,
      title: t('picoclaw.uninstall.confirmTitle'),
      content: t('picoclaw.uninstall.confirmContent'),
      okText: t('picoclaw.uninstall.confirmOk'),
      onOk: () => onUninstallRuntime?.()
    });

  return (
    <>
      <div className="flex h-12 flex-shrink-0 items-center justify-between gap-3 pl-2 pr-4">
        {/* Left: Title */}
        <div className="flex min-w-0 items-center gap-1.5">
          <Tooltip title={t('menu.collapse')} mouseEnterDelay={0.6} placement="bottom">
            <HeaderButton
              icon={<PanelRightCloseIcon size={16} />}
              aria-label={t('menu.collapse')}
              onClick={onClose}
            />
          </Tooltip>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {isCheckingRuntime ? null : isInstalled ? (
            <>
              {/* Agent Profile Selector */}
              <Select
                variant="borderless"
                size="small"
                value={agentProfile || 'kvm'}
                onChange={(value) => void onAgentProfileChange?.(value)}
                disabled={isUninstallingRuntime || isTogglingRuntime || isSwitchingAgent}
                loading={isSwitchingAgent}
                popupMatchSelectWidth={false}
                className="min-w-[120px] [&_.ant-select-content-value]:text-neutral-300"
                options={agentOptions.map((option) => ({
                  value: option.value,
                  label: option.title
                }))}
                optionRender={(option) => {
                  const current = agentOptions.find((item) => item.value === option.value);
                  if (!current) return option.label;
                  return (
                    <div className="py-1">
                      <div className="text-sm font-medium text-neutral-200">{current.title}</div>
                      <div className="mt-0.5 text-xs leading-snug text-neutral-500">
                        {current.description}
                      </div>
                    </div>
                  );
                }}
              />

              {/* Start/ Stop & History Button */}
              {isRuntimeReady ? (
                <>
                  <Tooltip title={t('picoclaw.history.title')} mouseEnterDelay={0.6}>
                    <HeaderButton
                      icon={<HistoryIcon size={16} />}
                      aria-label={t('picoclaw.history.title')}
                      active={isHistoryOpen}
                      onClick={onOpenHistory}
                    />
                  </Tooltip>
                  <Tooltip title={t('picoclaw.config.stopRuntime')} mouseEnterDelay={0.6}>
                    <Popconfirm
                      title={t('picoclaw.config.stopConfirm')}
                      onConfirm={() => void onToggleRuntime()}
                      okText={t('power.okBtn')}
                      cancelText={t('power.cancelBtn')}
                      placement="bottomRight"
                      color={popconfirmColor}
                      disabled={isTogglingRuntime}
                    >
                      <HeaderButton
                        icon={<PowerIcon size={16} />}
                        aria-label={t('picoclaw.config.stopRuntime')}
                        loading={isTogglingRuntime}
                        danger
                      />
                    </Popconfirm>
                  </Tooltip>
                </>
              ) : isModelConfigured ? (
                <Tooltip title={t('picoclaw.config.startRuntime')} mouseEnterDelay={0.6}>
                  <HeaderButton
                    icon={<PlayIcon size={16} />}
                    aria-label={t('picoclaw.config.startRuntime')}
                    loading={isTogglingRuntime}
                    onClick={() => void onToggleRuntime()}
                  />
                </Tooltip>
              ) : null}

              {/* Settings menu */}
              <Tooltip title={t('settings.title')} mouseEnterDelay={0.6}>
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  arrow={false}
                  open={isMoreOpen}
                  onOpenChange={setIsMoreOpen}
                  content={
                    <div className="min-w-44">
                      <MenuRow
                        icon={<SlidersHorizontalIcon size={16} />}
                        onClick={() => {
                          setIsMoreOpen(false);
                          onOpenModelConfig?.();
                        }}
                      >
                        {t('picoclaw.model.menuLabel')}
                      </MenuRow>
                      <MenuRow
                        danger
                        icon={<Trash2Icon size={16} />}
                        onClick={() => {
                          setIsMoreOpen(false);
                          handleUninstallClick();
                        }}
                      >
                        {t('picoclaw.uninstall.confirmTitle')}
                      </MenuRow>
                    </div>
                  }
                >
                  <HeaderButton
                    icon={<SettingsIcon size={16} />}
                    aria-label={t('settings.title')}
                    disabled={isTogglingRuntime}
                    loading={isUninstallingRuntime}
                  />
                </Popover>
              </Tooltip>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};
