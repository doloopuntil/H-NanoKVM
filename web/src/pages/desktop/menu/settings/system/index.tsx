import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

import { discardOnEscape } from '@/lib/discard.ts';
import { PageHeader } from '@/components/page-header.tsx';
import { SaveBar } from '@/components/save-bar.tsx';
import { SettingSection } from '@/components/setting-rows.tsx';
import { SettingsLoadGroup } from '@/components/settings-load-group.tsx';

import { Network } from '../network';
import { SystemLog } from '../system-log';
import { Update } from '../update';
import type { SystemActionHandle, SystemActionState } from './action';
import { idleSystemActionState } from './action';
import { Certificate } from './certificate';
import { Clocks } from './clocks';
import { FirewallSettings } from './firewall';
import { Mdns } from './mdns';
import { Monitor } from './monitor';
import { Overdrive } from './overdrive';
import { Ssh } from './ssh';
import { Swap } from './swap';
import { TimeSettings } from './time';
import { Tls } from './tls';
import { Watchdog } from './watchdog';

export type SystemSection =
  | 'time'
  | 'network'
  | 'firewall'
  | 'systemLog'
  | 'performance'
  | 'monitor'
  | 'services'
  | 'updates';

type SystemProps = {
  section: SystemSection;
  setIsLocked: (locked: boolean) => void;
};

export const System = ({ section, setIsLocked }: SystemProps) => {
  const { t } = useTranslation();
  const [actionState, setActionState] = useState<SystemActionState>(idleSystemActionState);
  // changing it remounts the section, which drops every draft and loads the settings again
  const [discardCount, setDiscardCount] = useState(0);
  const networkRef = useRef<SystemActionHandle>(null);
  const timeRef = useRef<SystemActionHandle>(null);
  const systemLogRef = useRef<SystemActionHandle>(null);
  const servicesRef = useRef<SystemActionHandle>(null);
  // what stops certificates now; the Alert above the Services sections
  const [certificateBlocked, setCertificateBlocked] = useState<string | null>(null);

  const updateActionState = useCallback((state: SystemActionState) => {
    setActionState(state);
  }, []);

  useEffect(() => {
    setActionState(idleSystemActionState);
  }, [section]);

  function saveActiveSection() {
    if (section === 'network') {
      void networkRef.current?.save();
      return;
    }
    if (section === 'time') {
      void timeRef.current?.save();
      return;
    }
    if (section === 'systemLog') {
      void systemLogRef.current?.save();
      return;
    }
    if (section === 'services') {
      void servicesRef.current?.save();
    }
  }

  function discardSection() {
    setActionState(idleSystemActionState);
    setDiscardCount((count) => count + 1);
  }

  const titles: Record<SystemSection, string> = {
    time: t('settings.system.sections.time'),
    network: t('settings.network.title'),
    firewall: t('settings.system.sections.firewall'),
    systemLog: t('settings.system.sections.systemLog'),
    performance: t('settings.system.sections.performance'),
    monitor: t('settings.system.sections.monitor'),
    services: t('settings.system.sections.services'),
    updates: t('settings.update.title')
  };

  // the updates page has its own header and load handling
  if (section === 'updates') {
    return <Update setIsLocked={setIsLocked} />;
  }

  return (
    <>
      <PageHeader title={titles[section]} />

      {/* The load banner is part of the section, below the sticky header; the group of the whole
          tab would put it above the header, where the header's cover hides it. */}
      <SettingsLoadGroup key={`${section}-${discardCount}`}>
        <div
          className="min-w-0 overflow-x-hidden"
          onKeyDown={discardOnEscape(actionState.hasPending, discardSection)}
        >
          {section === 'network' && (
            <Network ref={networkRef} onActionStateChange={updateActionState} />
          )}
          {section === 'time' && (
            <TimeSettings ref={timeRef} onActionStateChange={updateActionState} />
          )}
          {section === 'firewall' && <FirewallSettings />}
          {section === 'systemLog' && (
            <SystemLog ref={systemLogRef} onActionStateChange={updateActionState} />
          )}
          {section === 'services' && (
            <div className="flex flex-col space-y-6">
              {certificateBlocked && <Alert type="warning" showIcon title={certificateBlocked} />}

              <SettingSection title={t('settings.system.sections.webInterface')}>
                <Tls />
                <Certificate
                  ref={servicesRef}
                  onActionStateChange={updateActionState}
                  onBlockedChange={setCertificateBlocked}
                />
              </SettingSection>

              <Divider className="opacity-50" />

              <SettingSection title={t('settings.device.sections.connectivity')}>
                <Ssh />
                <Mdns />
              </SettingSection>
            </div>
          )}
          {section === 'monitor' && <Monitor />}
          {section === 'performance' && (
            <div className="flex flex-col space-y-6">
              <SettingSection title={t('settings.system.performance.processor')}>
                <Overdrive />
                <Clocks />
              </SettingSection>

              <Divider className="opacity-50" />

              <SettingSection title={t('settings.system.performance.memory')}>
                <Swap />
              </SettingSection>

              <Divider className="opacity-50" />

              <SettingSection title={t('settings.system.performance.recovery')}>
                <Watchdog />
              </SettingSection>
            </div>
          )}
        </div>
      </SettingsLoadGroup>

      {/* outside the section above, whose overflow would keep the bar from sticking */}
      {(actionState.hasPending || actionState.statusText) && (
        <SaveBar
          statusText={actionState.statusText}
          statusKind={actionState.statusKind}
          label={t('settings.system.saveChanges')}
          loading={actionState.isBusy}
          disabled={!actionState.canSave}
          onSave={actionState.hasPending ? saveActiveSection : undefined}
          onDiscard={actionState.hasPending ? discardSection : undefined}
          discardLabel={t('common.discard')}
        />
      )}
    </>
  );
};
