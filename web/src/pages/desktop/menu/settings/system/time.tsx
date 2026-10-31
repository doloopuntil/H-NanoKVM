import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Button, ConfigProvider, Divider, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/system-time.ts';
import type { TimeConfig, TimeConfigResponse } from '@/api/system-time.ts';
import { toast } from '@/lib/feedback.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { SettingRow, SettingSection } from '@/components/setting-rows.tsx';

import type { SystemActionHandle, SystemActionState } from './action.ts';

const maxServers = 6;

const defaultConfig: TimeConfig = {
  ntpEnabled: true,
  timezone: 'Etc/UTC',
  servers: ['0.pool.ntp.org', '1.pool.ntp.org', '2.pool.ntp.org', '3.pool.ntp.org']
};

type TimeSettingsProps = {
  onActionStateChange?: (state: SystemActionState) => void;
};

export const TimeSettings = forwardRef<SystemActionHandle, TimeSettingsProps>(
  ({ onActionStateChange }, ref) => {
    const { t } = useTranslation();

    const [data, setData] = useState<TimeConfigResponse | null>(null);
    const [config, setConfig] = useState<TimeConfig>(defaultConfig);
    const [savedConfig, setSavedConfig] = useState<TimeConfig>(defaultConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const timezoneOptions = useMemo(
      () =>
        (data?.timezoneOptions || [config.timezone]).map((zone) => ({
          value: zone,
          label: zone
        })),
      [data?.timezoneOptions, config.timezone]
    );

    function patchConfig(patch: Partial<TimeConfig>) {
      setConfig((current) => ({ ...current, ...patch }));
    }

    const { status: loadState, reload: load } = useSettingsLoadState(api.getConfig, (rsp) => {
      if (!rsp.data) throw new Error('missing time config');

      const nextConfig = { ...defaultConfig, ...rsp.data.config };
      setData(rsp.data);
      setConfig(nextConfig);
      setSavedConfig(nextConfig);
    });
    const isLoading = loadState === 'loading';
    const isUnavailable = loadState !== 'ready';

    function changeNtpEnabled(ntpEnabled: boolean) {
      if (ntpEnabled && config.servers.length === 0) {
        patchConfig({
          ntpEnabled,
          servers: data?.gateway ? [data.gateway] : data?.defaultServers || defaultConfig.servers
        });
        return;
      }

      patchConfig({ ntpEnabled });
    }

    function changeServers(servers: string[]) {
      if (servers.length > maxServers) {
        toast.error(t('settings.system.time.maxServers', { count: maxServers }));
        return;
      }
      patchConfig({ servers });
    }

    function useRouter() {
      if (!data?.gateway) return;
      patchConfig({ servers: [data.gateway] });
    }

    function useDefaults() {
      patchConfig({ servers: data?.defaultServers || defaultConfig.servers });
    }

    const save = useCallback(async () => {
      if (isSaving) return;

      const servers = config.servers.map((server) => server.trim()).filter(Boolean);
      if (config.ntpEnabled && servers.length === 0) {
        toast.error(t('settings.system.time.invalidServers'));
        return;
      }

      setIsSaving(true);
      try {
        const rsp = await api.setConfig({ ...config, servers });
        if (rsp.code !== 0 || !rsp.data) {
          toast.error(rsp.msg || t('settings.system.time.saveFailed'));
          return;
        }

        const nextConfig = { ...defaultConfig, ...rsp.data.config };
        setData(rsp.data);
        setConfig(nextConfig);
        setSavedConfig(nextConfig);
        toast.success(t('settings.system.time.saved'));
      } catch (err) {
        console.log(err);
        toast.error(t('settings.system.time.saveFailed'));
      } finally {
        setIsSaving(false);
      }
    }, [config, isSaving, t]);

    async function syncNow() {
      if (isSyncing) return;

      setIsSyncing(true);
      try {
        const rsp = await api.syncNow();
        if (rsp.code !== 0 || !rsp.data) {
          toast.error(rsp.msg || t('settings.system.time.syncFailed'));
          return;
        }

        const nextConfig = { ...defaultConfig, ...rsp.data.config };
        setData(rsp.data);
        setConfig(nextConfig);
        setSavedConfig(nextConfig);
        toast.success(t('settings.system.time.synced'));
      } catch (err) {
        console.log(err);
        toast.error(t('settings.system.time.syncFailed'));
      } finally {
        setIsSyncing(false);
      }
    }

    const normalizedConfig = normalizeTimeConfig(config);
    const normalizedSavedConfig = normalizeTimeConfig(savedConfig);
    const hasPending = JSON.stringify(normalizedConfig) !== JSON.stringify(normalizedSavedConfig);
    const hasInvalid = normalizedConfig.ntpEnabled && normalizedConfig.servers.length === 0;
    const isBusy = isUnavailable || isSaving || isSyncing;

    useImperativeHandle(ref, () => ({ save }), [save]);

    useEffect(() => {
      onActionStateChange?.({
        hasPending,
        hasInvalid,
        canSave: hasPending && !hasInvalid && !isBusy,
        isBusy,
        statusText: hasInvalid
          ? t('settings.system.time.invalidServers')
          : hasPending
            ? t('settings.system.unsaved')
            : '',
        statusKind: hasInvalid ? 'error' : hasPending ? 'warning' : '',
        label: t('settings.system.time.save')
      });
    }, [hasInvalid, hasPending, isBusy, onActionStateChange, t]);

    return (
      <ConfigProvider componentDisabled={isUnavailable}>
        <div className="flex min-w-0 flex-col space-y-6">
          <SettingSection title={t('settings.system.time.networkTime')}>
            <SettingRow
              label={t('settings.system.time.ntp.title')}
              description={t('settings.system.time.ntp.description')}
              isSwitch
            >
              <Switch checked={config.ntpEnabled} loading={isLoading} onChange={changeNtpEnabled} />
            </SettingRow>

            <SettingRow
              label={t('settings.system.time.servers.title')}
              description={t('settings.system.time.servers.description')}
              inline
            >
              <Select
                className="w-44 sm:w-72 [&_.ant-select-content]:justify-end"
                mode="tags"
                open={false}
                disabled={!config.ntpEnabled}
                tokenSeparators={[',', ' ']}
                value={config.servers}
                placeholder="0.pool.ntp.org"
                status={hasInvalid ? 'error' : undefined}
                suffixIcon={null}
                onChange={(servers) => changeServers(servers.map(String))}
              />
            </SettingRow>

            <SettingRow
              label={t('settings.system.time.servers.presets')}
              description={t('settings.system.time.servers.presetsDesc')}
            >
              <div className="flex min-w-0 flex-wrap justify-end gap-2">
                <Button
                  className="min-w-0"
                  disabled={!config.ntpEnabled || !data?.gateway}
                  onClick={useRouter}
                >
                  {data?.gateway
                    ? `${t('settings.system.time.servers.useRouter')} ${data.gateway}`
                    : t('settings.system.time.servers.useRouter')}
                </Button>
                <Button className="min-w-0" disabled={!config.ntpEnabled} onClick={useDefaults}>
                  {t('settings.system.time.servers.useDefaults')}
                </Button>
              </div>
            </SettingRow>

            <SettingRow
              label={t('settings.system.time.syncNow')}
              description={t('settings.system.time.syncNowDesc')}
              inline
            >
              <Button disabled={!config.ntpEnabled} loading={isSyncing} onClick={syncNow}>
                {t('settings.system.time.syncNow')}
              </Button>
            </SettingRow>
          </SettingSection>

          <Divider className="opacity-50" />

          <SettingSection title={t('settings.system.time.clock.title')}>
            <SettingRow
              label={t('settings.system.time.clock.current')}
              description={data?.currentTime || '-'}
              inline
            >
              <Button disabled={false} loading={isLoading} onClick={load}>
                {t('settings.system.time.refresh')}
              </Button>
            </SettingRow>

            <SettingRow
              label={t('settings.system.time.clock.timezone')}
              description={t('settings.system.time.clock.description')}
              inline
            >
              <Select
                showSearch
                value={config.timezone}
                options={timezoneOptions}
                onChange={(timezone) => patchConfig({ timezone })}
                filterOption={(input, option) =>
                  String(option?.label || '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-44 text-right sm:w-72 [&_.ant-select-input]:text-right"
              />
            </SettingRow>
          </SettingSection>
        </div>
      </ConfigProvider>
    );
  }
);

TimeSettings.displayName = 'TimeSettings';

function normalizeTimeConfig(config: TimeConfig): TimeConfig {
  return {
    ntpEnabled: Boolean(config.ntpEnabled),
    timezone: config.timezone || defaultConfig.timezone,
    servers: config.servers.map((server) => server.trim()).filter(Boolean)
  };
}
