import type { ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Button, Segmented, Spin, Tag } from 'antd';
import type { TFunction } from 'i18next';
import {
  LockKeyholeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldOffIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/system-firewall.ts';
import type { FirewallMode, FirewallStatus } from '@/api/system-firewall.ts';
import { confirm, toast } from '@/lib/feedback.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { InfoRow, SectionDivider } from '@/components/setting-rows.tsx';

type RulesTab = 'ipv4' | 'ipv6' | 'nft';

type ModeOption = {
  mode: FirewallMode;
  icon: ReactNode;
  title: string;
  description: string;
  tags: string[];
  disabled?: boolean;
  danger?: boolean;
};

export const FirewallSettings = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<FirewallStatus | null>(null);
  const [rulesTab, setRulesTab] = useState<RulesTab>('ipv4');
  const rulesTabPicked = useRef(false);
  const [isApplying, setIsApplying] = useState(false);

  const selectedRules = useMemo(() => {
    if (!status) return '';
    return status.rules[rulesTab] || t('settings.system.firewall.rules.empty');
  }, [status, rulesTab, t]);

  const effectiveMode = status?.effectiveMode || status?.config.mode || 'moderate';

  const modeOptions = useMemo<ModeOption[]>(() => {
    const httpsModeDisabled = !status?.httpsEnabled;
    return [
      {
        mode: 'baseline',
        icon: <ShieldOffIcon size={16} />,
        title: t('settings.system.firewall.mode.baseline'),
        description: t('settings.system.firewall.mode.baselineDesc'),
        tags: [
          t('settings.system.firewall.mode.openTag'),
          t('settings.system.firewall.mode.outboundOpen')
        ],
        danger: true
      },
      {
        mode: 'moderate',
        icon: <ShieldCheckIcon size={16} />,
        title: t('settings.system.firewall.mode.moderate'),
        description: t('settings.system.firewall.mode.moderateDesc'),
        tags: [
          t('settings.system.firewall.mode.default'),
          t('settings.system.firewall.mode.localOnly'),
          t('settings.system.firewall.mode.outboundOpen')
        ]
      },
      {
        mode: 'restricted',
        icon: <ShieldIcon size={16} />,
        title: t('settings.system.firewall.mode.restricted'),
        description: t('settings.system.firewall.mode.restrictedDesc'),
        tags: [
          t('settings.system.firewall.mode.localOnly'),
          t('settings.system.firewall.mode.outboundLimited'),
          ...(httpsModeDisabled ? [t('settings.system.firewall.mode.httpsRequiredTag')] : [])
        ],
        disabled: httpsModeDisabled
      },
      {
        mode: 'paranoid',
        icon: <LockKeyholeIcon size={16} />,
        title: t('settings.system.firewall.mode.paranoid'),
        description: t('settings.system.firewall.mode.paranoidDesc'),
        tags: [
          t('settings.system.firewall.mode.localOnly'),
          t('settings.system.firewall.mode.httpsOnly'),
          ...(httpsModeDisabled ? [t('settings.system.firewall.mode.httpsRequiredTag')] : [])
        ],
        disabled: httpsModeDisabled,
        danger: true
      }
    ];
  }, [status?.httpsEnabled, t]);

  const { status: loadState, reload } = useSettingsLoadState(api.getStatus, (rsp) => {
    if (!rsp.data) throw new Error('missing firewall status');
    setStatus(rsp.data);
    // With nftables the iptables views are empty; show the ruleset unless a tab was picked.
    if (!rulesTabPicked.current && rsp.data.backend.preferred === 'nftables') {
      setRulesTab('nft');
    }
  });
  const isLoading = loadState === 'loading';

  function selectMode(mode: FirewallMode) {
    if (!status || isApplying || mode === effectiveMode) return;

    const option = modeOptions.find((item) => item.mode === mode);
    if (!option || option.disabled) {
      if (mode !== 'baseline' && mode !== 'moderate' && !status.httpsEnabled) {
        toast.warning(t('settings.system.firewall.enableHttpsFirst'));
      }
      return;
    }

    if (mode === 'restricted') {
      confirm({
        danger: true,
        title: t('settings.system.firewall.restricted.confirmTitle'),
        content: t('settings.system.firewall.restricted.confirmDesc'),
        okText: t('settings.system.firewall.restricted.enable'),
        cancelText: t('settings.system.firewall.cancel'),
        onOk: () => applyMode(mode)
      });
      return;
    }

    if (mode === 'paranoid') {
      confirm({
        danger: true,
        title: t('settings.system.firewall.paranoid.confirmTitle'),
        content: t('settings.system.firewall.paranoid.confirmDesc'),
        okText: t('settings.system.firewall.paranoid.enable'),
        cancelText: t('settings.system.firewall.cancel'),
        onOk: () => applyMode(mode)
      });
      return;
    }

    if (mode === 'baseline') {
      confirm({
        title: t('settings.system.firewall.baseline.confirmTitle'),
        content: t('settings.system.firewall.baseline.confirmDesc'),
        okText: t('settings.system.firewall.baseline.apply'),
        cancelText: t('settings.system.firewall.cancel'),
        onOk: () => applyMode(mode)
      });
      return;
    }

    confirm({
      title: modeApplyLabel(t, mode),
      content: option.description,
      okText: modeApplyLabel(t, mode),
      cancelText: t('settings.system.firewall.cancel'),
      onOk: () => applyMode(mode)
    });
  }

  async function applyMode(mode: FirewallMode) {
    setIsApplying(true);
    try {
      const rsp = await api.setMode(mode);
      if (rsp.code !== 0 || !rsp.data) {
        toast.error(rsp.msg || t('settings.system.firewall.saveFailed'));
        return;
      }

      let nextStatus: FirewallStatus = rsp.data;
      if (nextStatus.confirmationRequired) {
        const confirmRsp = await api.confirmPending();
        if (confirmRsp.code === 0 && confirmRsp.data) {
          nextStatus = confirmRsp.data;
        }
      }

      setStatus(nextStatus);
      toast.success(t('settings.system.firewall.saved'));
    } catch (err) {
      console.log(err);
      toast.error(t('settings.system.firewall.saveFailed'));
    } finally {
      setIsApplying(false);
      reload();
    }
  }

  if (isLoading && !status) {
    return (
      <div className="flex justify-center py-12">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="min-w-0 space-y-6">
        <div className="text-neutral-400">
          {status && !status.httpsEnabled ? (
            <LabelTip
              text={t('settings.system.firewall.mode.title')}
              tip={t('settings.system.firewall.httpsRequired')}
              warning
            />
          ) : (
            t('settings.system.firewall.mode.title')
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {modeOptions.map((option) => (
            <ModeChoice
              key={option.mode}
              option={option}
              active={option.mode === effectiveMode}
              current={option.mode === effectiveMode}
              busy={isApplying || !status}
              currentLabel={t('settings.system.firewall.mode.current')}
              onSelect={selectMode}
            />
          ))}
        </div>
      </div>

      <SectionDivider />

      <div className="space-y-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-neutral-400">{t('settings.system.firewall.rules.title')}</div>
          <Segmented
            size="small"
            className="max-w-full overflow-x-auto"
            value={rulesTab}
            options={[
              { value: 'ipv4', label: 'IPv4' },
              { value: 'ipv6', label: 'IPv6' },
              { value: 'nft', label: 'nft' }
            ]}
            onChange={(value) => {
              rulesTabPicked.current = true;
              setRulesTab(value as RulesTab);
            }}
          />
        </div>
        <pre className="max-h-90 min-h-65 overflow-auto rounded-sm bg-black/50 p-3 font-mono text-xs leading-relaxed text-neutral-200">
          {selectedRules}
        </pre>
      </div>

      <SectionDivider />

      <div className="space-y-6">
        <div className="text-neutral-400">{t('settings.system.firewall.backends')}</div>
        <div className="space-y-3">
          <InfoRow
            label={t('settings.system.firewall.mode.current')}
            value={status?.backend.preferred}
          />
          <InfoRow label="iptables" value={toolText(status?.backend.iptables)} />
          <InfoRow label="ip6tables" value={toolText(status?.backend.ip6tables)} />
          <InfoRow label="nft" value={toolText(status?.backend.nft)} />
        </div>
      </div>

      <SectionDivider />

      <div className="flex min-w-0 flex-wrap justify-end gap-2">
        <Button icon={<RefreshCwIcon size={16} />} loading={isLoading} onClick={reload}>
          {t('settings.system.firewall.refresh')}
        </Button>
      </div>
    </div>
  );
};

function ModeChoice({
  option,
  active,
  current,
  busy,
  currentLabel,
  onSelect
}: {
  option: ModeOption;
  active: boolean;
  current: boolean;
  busy: boolean;
  currentLabel: string;
  onSelect: (mode: FirewallMode) => void;
}) {
  const disabled = busy || Boolean(option.disabled);

  return (
    <button
      type="button"
      className={modeButtonClass(active, disabled, option.danger)}
      disabled={disabled}
      onClick={() => onSelect(option.mode)}
    >
      <span className={modeIconClass(active, option.danger)}>{option.icon}</span>
      <span className="min-w-0 flex-1 space-y-2 overflow-hidden text-left">
        <span className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-neutral-100">{option.title}</span>
          {current && (
            <Tag className="m-0 max-w-[55%] shrink-0 truncate" color={modeColor(option.mode)}>
              {currentLabel}
            </Tag>
          )}
        </span>
        <span className="block text-xs leading-snug wrap-break-word text-neutral-400">
          {option.description}
        </span>
        <span className="flex min-w-0 flex-wrap gap-1">
          {option.tags.map((tag) => (
            <Tag
              key={tag}
              className="m-0 max-w-full leading-snug wrap-break-word whitespace-normal"
              color={tagColor(option.mode, option.danger)}
            >
              {tag}
            </Tag>
          ))}
        </span>
      </span>
    </button>
  );
}

function modeButtonClass(active: boolean, disabled: boolean, danger?: boolean) {
  const base =
    'flex w-full min-w-0 items-start gap-3 overflow-hidden rounded-md border p-3 text-left transition-colors';
  if (disabled && !active) {
    return `${base} cursor-not-allowed border-neutral-800 bg-neutral-900/35 opacity-60`;
  }
  if (active) {
    return danger
      ? `${base} cursor-default border-red-500/60 bg-red-500/10`
      : `${base} cursor-default border-blue-500/60 bg-blue-500/10`;
  }
  if (danger) {
    return `${base} border-neutral-700 bg-neutral-900/30 hover:border-red-500/60 hover:bg-red-500/10`;
  }
  return `${base} border-neutral-700 bg-neutral-900/30 hover:border-blue-500/60 hover:bg-blue-500/10`;
}

function modeIconClass(active: boolean, danger?: boolean) {
  const base = 'flex size-9 shrink-0 items-center justify-center rounded-md';
  if (danger) {
    return active ? `${base} bg-red-500/20 text-red-200` : `${base} bg-neutral-800 text-red-300`;
  }
  return active ? `${base} bg-blue-500/20 text-blue-200` : `${base} bg-neutral-800 text-blue-300`;
}

function tagColor(mode: FirewallMode, danger?: boolean) {
  if (mode === 'moderate') return 'green';
  if (mode === 'restricted') return 'orange';
  if (danger) return 'red';
  return 'blue';
}

function toolText(tool?: { installed: boolean; detail: string }) {
  if (!tool) return '-';
  return tool.installed ? tool.detail : 'missing';
}

function modeApplyLabel(t: TFunction, mode: FirewallMode) {
  switch (mode) {
    case 'baseline':
      return t('settings.system.firewall.baseline.apply');
    case 'moderate':
      return t('settings.system.firewall.moderate.apply');
    case 'restricted':
      return t('settings.system.firewall.restricted.enable');
    case 'paranoid':
      return t('settings.system.firewall.paranoid.enable');
  }
}

function modeColor(mode: FirewallMode) {
  switch (mode) {
    case 'baseline':
      return 'red';
    case 'moderate':
      return 'green';
    case 'restricted':
      return 'orange';
    case 'paranoid':
      return 'red';
  }
}
