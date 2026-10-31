import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  ConfigProvider,
  Divider,
  Input,
  InputNumber,
  Select,
  Space,
  Switch
} from 'antd';
import { RefreshCwIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/system-log.ts';
import type { SystemLogConfig } from '@/api/system-log.ts';
import { toast } from '@/lib/feedback.ts';
import { useSettingsLoadState } from '@/hooks/useSettingsLoad.ts';
import { SettingRow } from '@/components/setting-rows.tsx';

import type { SystemActionHandle, SystemActionState } from '../system/action.ts';

const defaultLogFile = '/tmp/hardened-syslog/messages';

const defaultConfig: SystemLogConfig = {
  remoteEnabled: false,
  remoteHost: '',
  remotePort: 514,
  priority: 8,
  bufferKb: 200,
  rotations: 1,
  smallOutput: false,
  stripTimestamps: false,
  kernelEnabled: true,
  kernelConsoleLevel: 7
};

type SystemLogProps = {
  onActionStateChange?: (state: SystemActionState) => void;
};

export const SystemLog = forwardRef<SystemActionHandle, SystemLogProps>(
  ({ onActionStateChange }, ref) => {
    const { t } = useTranslation();

    const [config, setConfig] = useState<SystemLogConfig>(defaultConfig);
    const [localLogFile, setLocalLogFile] = useState(defaultLogFile);
    const [savedConfig, setSavedConfig] = useState<SystemLogConfig>(defaultConfig);
    const [lineCount, setLineCount] = useState(200);
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLogLoading, setIsLogLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [logTruncated, setLogTruncated] = useState(false);

    const priorityOptions = useMemo(
      () =>
        [8, 7, 6, 5, 4, 3, 2, 1].map((level) => ({
          value: level,
          label: t(`settings.systemLog.level.${level}`)
        })),
      [t]
    );

    useEffect(() => {
      refreshLog(200);
    }, []);

    function patchConfig(patch: Partial<SystemLogConfig>) {
      setConfig((current) => ({ ...current, ...patch }));
    }

    const { status: loadState } = useSettingsLoadState(api.getConfig, (rsp) => {
      if (!rsp.data) throw new Error('missing system log config');

      const nextConfig = { ...defaultConfig, ...rsp.data.config };
      setConfig(nextConfig);
      setSavedConfig(nextConfig);
      setLocalLogFile(rsp.data.localLogFile || defaultLogFile);
    });
    const isUnavailable = loadState !== 'ready';

    const save = useCallback(async () => {
      if (isSaving) return;
      if (config.remoteEnabled && !config.remoteHost.trim()) {
        toast.error(t('settings.systemLog.invalidHost'));
        return;
      }

      setIsSaving(true);
      try {
        const rsp = await api.setConfig({
          ...config,
          remoteHost: config.remoteHost.trim()
        });
        if (rsp.code !== 0) {
          toast.error(rsp.msg || t('settings.systemLog.saveFailed'));
          return;
        }

        toast.success(t('settings.systemLog.saved'));
        if (rsp.data?.config) {
          const nextConfig = { ...defaultConfig, ...rsp.data.config };
          setConfig(nextConfig);
          setSavedConfig(nextConfig);
        }
        refreshLog(lineCount);
      } catch (err) {
        console.log(err);
        toast.error(t('settings.systemLog.saveFailed'));
      } finally {
        setIsSaving(false);
      }
    }, [config, isSaving, lineCount, t]);

    async function refreshLog(lines = lineCount) {
      setIsLogLoading(true);
      try {
        const rsp = await api.getMessages('system', lines);
        if (rsp.code !== 0 || !rsp.data) {
          toast.error(rsp.msg || t('settings.systemLog.logLoadFailed'));
          return;
        }

        setContent(rsp.data.content || '');
        setLogTruncated(Boolean(rsp.data.truncated));
      } catch (err) {
        console.log(err);
        toast.error(t('settings.systemLog.logLoadFailed'));
      } finally {
        setIsLogLoading(false);
      }
    }

    async function sendTestMessage() {
      if (isTesting) return;

      setIsTesting(true);
      try {
        const rsp = await api.sendTestMessage();
        if (rsp.code !== 0) {
          toast.error(rsp.msg || t('settings.systemLog.testFailed'));
          return;
        }

        toast.success(t('settings.systemLog.testSent'));
        refreshLog(lineCount);
      } catch (err) {
        console.log(err);
        toast.error(t('settings.systemLog.testFailed'));
      } finally {
        setIsTesting(false);
      }
    }

    function changeLineCount(value: number) {
      setLineCount(value);
      refreshLog(value);
    }

    const normalizedConfig = normalizeSystemLogConfig(config);
    const normalizedSavedConfig = normalizeSystemLogConfig(savedConfig);
    const hasPending = JSON.stringify(normalizedConfig) !== JSON.stringify(normalizedSavedConfig);
    const hasInvalid = normalizedConfig.remoteEnabled && !normalizedConfig.remoteHost;
    const isBusy = isUnavailable || isSaving;

    useImperativeHandle(ref, () => ({ save }), [save]);

    useEffect(() => {
      onActionStateChange?.({
        hasPending,
        hasInvalid,
        canSave: hasPending && !hasInvalid && !isBusy,
        isBusy,
        statusText: hasInvalid
          ? t('settings.systemLog.invalidHost')
          : hasPending
            ? t('settings.system.unsaved')
            : '',
        statusKind: hasInvalid ? 'error' : hasPending ? 'warning' : '',
        label: t('settings.systemLog.save')
      });
    }, [hasInvalid, hasPending, isBusy, onActionStateChange, t]);

    return (
      <>
        <ConfigProvider componentDisabled={isUnavailable}>
          <div className="flex min-w-0 flex-col space-y-6">
            <div className="flex min-w-0 flex-col space-y-6">
              <div className="text-neutral-400">{t('settings.systemLog.kernel.title')}</div>
              <SettingRow
                label={t('settings.systemLog.kernel.enabled')}
                description={t('settings.systemLog.kernel.enabledDesc')}
                isSwitch
              >
                <Switch
                  checked={config.kernelEnabled}
                  onChange={(kernelEnabled) => patchConfig({ kernelEnabled })}
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.kernel.consoleLevel')}
                description={t('settings.systemLog.kernel.consoleLevelDesc')}
                inline
              >
                <Select
                  value={config.kernelConsoleLevel}
                  options={priorityOptions}
                  onChange={(kernelConsoleLevel) => patchConfig({ kernelConsoleLevel })}
                  className="w-32 text-right sm:w-36"
                />
              </SettingRow>
            </div>

            <Divider className="opacity-50" />

            <div className="flex min-w-0 flex-col space-y-6">
              <div className="text-neutral-400">{t('settings.systemLog.remote.title')}</div>
              <SettingRow
                label={t('settings.systemLog.remote.forward')}
                description={t('settings.systemLog.remote.description')}
                isSwitch
              >
                <Switch
                  checked={config.remoteEnabled}
                  onChange={(remoteEnabled) => patchConfig({ remoteEnabled })}
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.remote.host')}
                description={t('settings.systemLog.remote.hostDesc')}
                inline
              >
                <Input
                  value={config.remoteHost}
                  placeholder="10.0.87.5"
                  status={hasInvalid ? 'error' : undefined}
                  disabled={!config.remoteEnabled}
                  onChange={(event) => patchConfig({ remoteHost: event.target.value })}
                  className="w-36 text-right sm:w-36"
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.remote.port')}
                description={t('settings.systemLog.remote.protocol')}
                inline
              >
                <InputNumber<number>
                  min={1}
                  max={65535}
                  controls={false}
                  disabled={!config.remoteEnabled}
                  value={config.remotePort}
                  onChange={(value) => patchConfig({ remotePort: value || 514 })}
                  className="w-20 [&_.ant-input-number-input]:!text-right"
                />
              </SettingRow>
            </div>

            <Divider className="opacity-50" />

            <div className="flex min-w-0 flex-col space-y-6">
              <div className="text-neutral-400">{t('settings.systemLog.local.title')}</div>
              <Alert
                type="info"
                showIcon
                message={t('settings.systemLog.local.description', { path: localLogFile })}
              />
              <SettingRow
                label={t('settings.systemLog.local.priority')}
                description={t('settings.systemLog.local.priorityDesc')}
                inline
              >
                <Select
                  value={config.priority}
                  options={priorityOptions}
                  onChange={(priority) => patchConfig({ priority })}
                  className="w-32 text-right sm:w-36"
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.local.buffer')}
                description={t('settings.systemLog.local.bufferDesc')}
                inline
              >
                <InputNumber<number>
                  min={16}
                  max={1024}
                  controls={false}
                  value={config.bufferKb}
                  addonAfter="KiB"
                  onChange={(value) => patchConfig({ bufferKb: value || 200 })}
                  className="w-28 [&_.ant-input-number-input]:!text-right"
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.local.rotations')}
                description={t('settings.systemLog.local.rotationsDesc')}
                inline
              >
                <InputNumber<number>
                  min={0}
                  max={4}
                  controls={false}
                  value={config.rotations}
                  onChange={(value) => patchConfig({ rotations: value || 0 })}
                  className="w-16 [&_.ant-input-number-input]:!text-right"
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.local.compact')}
                description={t('settings.systemLog.local.compactDesc')}
                isSwitch
              >
                <Switch
                  checked={config.smallOutput}
                  onChange={(smallOutput) => patchConfig({ smallOutput })}
                />
              </SettingRow>
              <SettingRow
                label={t('settings.systemLog.local.stripTimestamps')}
                description={t('settings.systemLog.local.stripTimestampsDesc')}
                isSwitch
              >
                <Switch
                  checked={config.stripTimestamps}
                  onChange={(stripTimestamps) => patchConfig({ stripTimestamps })}
                />
              </SettingRow>
            </div>

            <Divider className="opacity-50" />

            <div className="flex min-w-0 flex-col space-y-6">
              <div className="text-neutral-400">{t('settings.systemLog.viewer.title')}</div>

              <div className="space-y-3">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                  <Button
                    className="w-full sm:w-auto"
                    icon={<SendIcon size={16} />}
                    loading={isTesting}
                    onClick={sendTestMessage}
                  >
                    {t('settings.systemLog.test')}
                  </Button>

                  <div className="flex w-full min-w-0 items-center gap-2 sm:ml-auto sm:w-auto sm:flex-wrap sm:justify-end">
                    <Space.Compact className="!flex min-w-0 flex-1 basis-0 sm:!inline-flex sm:flex-none sm:basis-auto">
                      <Select
                        className="min-w-0 flex-1 text-right sm:w-20 sm:flex-none"
                        value={lineCount}
                        options={[100, 200, 500, 1000].map((value) => ({
                          value,
                          label: String(value)
                        }))}
                        onChange={changeLineCount}
                      />
                      <Space.Addon className="w-16 text-center">
                        {t('settings.systemLog.viewer.linesUnit')}
                      </Space.Addon>
                    </Space.Compact>
                    <Button
                      className="flex-1 basis-0 sm:flex-none sm:basis-auto"
                      icon={<RefreshCwIcon size={16} />}
                      loading={isLogLoading}
                      onClick={() => refreshLog()}
                    >
                      {t('settings.systemLog.viewer.refresh')}
                    </Button>
                  </div>
                </div>

                {logTruncated && (
                  <Alert type="info" showIcon title={t('settings.systemLog.viewer.truncated')} />
                )}

                <pre className="max-h-[360px] min-h-[260px] overflow-auto rounded bg-black/50 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                  {content || t('settings.systemLog.viewer.empty')}
                </pre>
              </div>
            </div>
          </div>
        </ConfigProvider>
      </>
    );
  }
);

SystemLog.displayName = 'SystemLog';

function normalizeSystemLogConfig(config: SystemLogConfig): SystemLogConfig {
  return {
    remoteEnabled: Boolean(config.remoteEnabled),
    remoteHost: config.remoteHost.trim(),
    remotePort: Number(config.remotePort) || defaultConfig.remotePort,
    priority: Number(config.priority) || defaultConfig.priority,
    bufferKb: Number(config.bufferKb) || defaultConfig.bufferKb,
    rotations: Number(config.rotations) || 0,
    smallOutput: Boolean(config.smallOutput),
    stripTimestamps: Boolean(config.stripTimestamps),
    kernelEnabled: Boolean(config.kernelEnabled),
    kernelConsoleLevel: Number(config.kernelConsoleLevel) || defaultConfig.kernelConsoleLevel
  };
}
