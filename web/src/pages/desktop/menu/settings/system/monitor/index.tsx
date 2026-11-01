import type { ReactNode } from 'react';
import { Alert, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

import { formatUptime } from '@/lib/uptime.ts';
import { SettingSection } from '@/components/setting-rows.tsx';

import { Meter, SplitMeter } from './meter';
import {
  CPU_CRIT_PERCENT,
  CPU_WARN_PERCENT,
  formatBytes,
  formatMegabytes,
  MEMORY_CRIT_PERCENT,
  MEMORY_WARN_PERCENT,
  percent,
  percentAxis,
  TEMP_CRIT_C,
  TEMP_WARN_C,
  temperatureAxis,
  toneFor,
  VALUE_COLORS
} from './scale';
import { Sparkline } from './sparkline';
import { useMonitor } from './use-monitor';

const DASH = '-';

// A reading with a history line under it; the value takes the colour of the line.
const History = ({
  label,
  caption,
  value,
  unit,
  tone,
  children
}: {
  label: string;
  caption: string;
  value: string;
  unit: string;
  tone: 'normal' | 'warn' | 'crit';
  children: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col lg:min-h-[104px]">
    <div className="flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col space-y-0.5">
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="break-words text-xs text-neutral-500">{caption}</span>
      </div>
      <div className={`shrink-0 whitespace-nowrap text-[15px] tabular-nums ${VALUE_COLORS[tone]}`}>
        {value}
        <small className="ml-0.5 text-xs text-neutral-500">{unit}</small>
      </div>
    </div>
    {children}
  </div>
);

export const Monitor = () => {
  const { t } = useTranslation();
  const { data, temperatures, memoryPercents, swapPercents, cpuPercents, unavailable } =
    useMonitor();

  const temperature = data?.temperatureC ?? undefined;
  const temperatureTone = toneFor(temperature, TEMP_WARN_C, TEMP_CRIT_C);
  const memory = data?.memory;
  const memoryPercent = memory ? percent(memory.usedKb, memory.totalKb) : 0;
  const memoryTone = toneFor(memoryPercent, MEMORY_WARN_PERCENT, MEMORY_CRIT_PERCENT);
  const swapOn = !!memory && memory.swapTotalKb > 0;
  const swapPercentNow = swapOn ? percent(memory.swapUsedKb, memory.swapTotalKb) : 0;
  const swapTone = toneFor(swapPercentNow, MEMORY_WARN_PERCENT, MEMORY_CRIT_PERCENT);
  const cpu = data?.cpu;
  const cpuPercent = cpu ? Math.min(100, cpu.userPercent + cpu.systemPercent) : undefined;
  const cpuTone = toneFor(cpuPercent, CPU_WARN_PERCENT, CPU_CRIT_PERCENT);
  const disk = (mount: string) => data?.disks.find((item) => item.mount === mount);

  function storage(mount: string, title: string, label: string) {
    const item = disk(mount);
    const used = item ? percent(item.usedBytes, item.totalBytes) : 0;
    return (
      <SettingSection title={title}>
        <Meter
          label={label}
          caption={
            item
              ? t('settings.system.monitor.percentUsed', { percent: Math.round(used) })
              : t('settings.system.monitor.unavailable')
          }
          value={
            item
              ? t('settings.system.monitor.sizeOf', {
                  used: formatBytes(item.usedBytes),
                  total: formatBytes(item.totalBytes)
                })
              : DASH
          }
          percent={used}
        />
      </SettingSection>
    );
  }

  return (
    <div className="flex min-w-0 flex-col space-y-6">
      {unavailable && (
        <Alert type="warning" showIcon title={t('settings.system.monitor.noReadings')} />
      )}

      <div className="grid min-w-0 grid-cols-1 gap-x-14 gap-y-7 lg:grid-cols-2">
        <SettingSection title={t('settings.system.performance.processor')}>
          <div className="flex min-w-0 flex-col gap-5">
            <SplitMeter
              label={t('settings.system.monitor.cpuLoad')}
              caption={
                cpu
                  ? t('settings.system.monitor.cpuLoadCaption', {
                      user: Math.round(cpu.userPercent),
                      system: Math.round(cpu.systemPercent)
                    })
                  : t('settings.system.monitor.unavailable')
              }
              value={cpuPercent !== undefined ? `${Math.round(cpuPercent)} %` : DASH}
              first={cpu?.userPercent ?? 0}
              second={cpu?.systemPercent ?? 0}
            />
            <History
              label={t('settings.system.monitor.cpuUtilization')}
              caption={t('settings.system.monitor.lastMinutes')}
              value={cpuPercent !== undefined ? `${Math.round(cpuPercent)}` : DASH}
              unit={cpuPercent !== undefined ? '%' : ''}
              tone={cpuTone}
            >
              <Sparkline
                label={t('settings.system.monitor.cpuUtilization')}
                values={cpuPercents}
                axis={percentAxis}
                warn={CPU_WARN_PERCENT}
                crit={CPU_CRIT_PERCENT}
              />
            </History>
            <History
              label={t('settings.system.monitor.temperature')}
              caption={t('settings.system.monitor.lastMinutes')}
              value={temperature !== undefined ? temperature.toFixed(1) : DASH}
              unit={temperature !== undefined ? '°C' : ''}
              tone={temperatureTone}
            >
              <Sparkline
                label={t('settings.system.monitor.temperature')}
                values={temperatures}
                axis={temperatureAxis(temperatures)}
                warn={TEMP_WARN_C}
                crit={TEMP_CRIT_C}
              />
            </History>
          </div>
        </SettingSection>

        <SettingSection title={t('settings.system.performance.memory')}>
          <div className="flex min-w-0 flex-col gap-5">
            <Meter
              label={t('settings.system.monitor.ram')}
              caption={t('settings.system.monitor.percent', {
                percent: Math.round(memoryPercent)
              })}
              value={
                memory
                  ? t('settings.system.monitor.sizeOf', {
                      used: formatMegabytes(memory.usedKb),
                      total: formatMegabytes(memory.totalKb)
                    })
                  : DASH
              }
              percent={memoryPercent}
              tone={memoryTone}
            />
            <History
              label={t('settings.system.monitor.ramHistory')}
              caption={t('settings.system.monitor.lastMinutes')}
              value={memory ? `${Math.round(memoryPercent)}` : DASH}
              unit={memory ? '%' : ''}
              tone={memoryTone}
            >
              <Sparkline
                label={t('settings.system.monitor.ramHistory')}
                values={memoryPercents}
                axis={percentAxis}
                warn={MEMORY_WARN_PERCENT}
                crit={MEMORY_CRIT_PERCENT}
              />
            </History>
            <History
              label={t('settings.system.monitor.swapUtilization')}
              caption={
                swapOn
                  ? t('settings.system.monitor.swapSizeLastMinutes', {
                      size: formatMegabytes(memory.swapTotalKb)
                    })
                  : t('settings.system.monitor.off')
              }
              value={swapOn ? `${Math.round(swapPercentNow)}` : DASH}
              unit={swapOn ? '%' : ''}
              tone={swapTone}
            >
              <Sparkline
                label={t('settings.system.monitor.swapUtilization')}
                values={swapOn ? swapPercents : []}
                axis={percentAxis}
                warn={MEMORY_WARN_PERCENT}
                crit={MEMORY_CRIT_PERCENT}
              />
            </History>
          </div>
        </SettingSection>
      </div>

      <Divider className="opacity-50" />

      <div className="grid min-w-0 grid-cols-1 gap-x-14 gap-y-7 lg:grid-cols-2">
        {storage('/', t('settings.system.monitor.systemPartition'), '/')}
        {storage('/data', t('settings.system.monitor.dataPartition'), '/data')}
      </div>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-neutral-500">
        <span>{t('settings.system.monitor.refresh')}</span>
        <span>
          {t('settings.about.uptime')} {formatUptime(data?.uptimeSeconds)}
        </span>
      </div>
    </div>
  );
};
