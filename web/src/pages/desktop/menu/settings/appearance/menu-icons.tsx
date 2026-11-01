import { useState } from 'react';
import { Switch } from 'antd';
import { useAtom } from 'jotai';
import {
  BotIcon,
  DiscIcon,
  DownloadIcon,
  FileJsonIcon,
  MaximizeIcon,
  NetworkIcon,
  PowerIcon,
  SquareTerminalIcon,
  XIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as downloadApi from '@/api/download.ts';
import * as vmApi from '@/api/vm.ts';
import { attempt, confirm } from '@/lib/feedback.ts';
import * as ls from '@/lib/localstorage.ts';
import { menuDisabledItemsAtom } from '@/jotai/settings.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { SettingRow, SettingSection } from '@/components/setting-rows.tsx';

import { RemoteDownloadEnable } from './remote-download-enable.tsx';

export const MenuIcons = () => {
  const { t } = useTranslation();

  const [menuDisabledItems, setMenuDisabledItems] = useAtom(menuDisabledItemsAtom);
  const [isTerminalLoading, setIsTerminalLoading] = useState(false);
  const [isRemoteDownloadEnabled, setIsRemoteDownloadEnabled] = useState(false);
  const [isRemoteDownloadLoading, setIsRemoteDownloadLoading] = useState(false);
  const [isRemoteDownloadDialogOpen, setIsRemoteDownloadDialogOpen] = useState(false);

  const items = [
    { key: 'image', icon: <DiscIcon size={16} /> },
    {
      key: 'remoteDownload',
      icon: <DownloadIcon size={16} />,
      label: 'settings.appearance.menuBar.remoteDownload'
    },
    { key: 'terminal', icon: <SquareTerminalIcon size={16} /> },
    { key: 'script', icon: <FileJsonIcon size={16} /> },
    { key: 'wol', icon: <NetworkIcon size={16} /> },
    { key: 'picoclaw', icon: <BotIcon size={16} /> },
    { key: 'power', icon: <PowerIcon size={16} /> },
    { key: 'fullscreen', icon: <MaximizeIcon size={16} />, label: 'fullscreen.toggle' },
    { key: 'collapse', icon: <XIcon size={16} />, label: 'menu.collapse' }
  ];

  const isTerminalReady = useSettingsLoad(vmApi.getTerminalEnabled, (rsp) => {
    if (typeof rsp.data?.enabled === 'boolean') {
      setItemVisible('terminal', rsp.data.enabled);
    }
  });

  const isRemoteDownloadReady = useSettingsLoad(
    downloadApi.getRemoteImageDownloadEnabled,
    (rsp) => {
      if (typeof rsp.data?.remoteEnabled === 'boolean') {
        setIsRemoteDownloadEnabled(rsp.data.remoteEnabled);
      }
    }
  );

  function saveItems(newItems: string[]) {
    setMenuDisabledItems(newItems);
    ls.setMenuDisabledItems(newItems);
  }

  function setItemVisible(key: string, visible: boolean) {
    const newItems = visible
      ? menuDisabledItems.filter((item) => item !== key)
      : Array.from(new Set([...menuDisabledItems, key]));

    saveItems(newItems);
  }

  function updateItems(key: string) {
    const enabled = !menuDisabledItems.includes(key);
    const nextEnabled = !enabled;

    if (key === 'terminal') {
      if (nextEnabled) {
        confirm({
          title: t('settings.appearance.menuBar.terminalWarningTitle'),
          content: t('settings.appearance.menuBar.terminalWarningDesc'),
          okText: t('settings.appearance.menuBar.terminalWarningConfirm'),
          danger: true,
          onOk: () => updateTerminal(true)
        });
      } else {
        updateTerminal(false);
      }
      return;
    }

    if (key === 'remoteDownload') {
      if (!isRemoteDownloadEnabled) {
        setIsRemoteDownloadDialogOpen(true);
      } else {
        updateRemoteDownload(false);
      }
      return;
    }

    setItemVisible(key, nextEnabled);
  }

  function updateTerminal(enabled: boolean) {
    if (isTerminalLoading) return;
    setIsTerminalLoading(true);

    return attempt(() => vmApi.setTerminalEnabled(enabled))
      .then((rsp) => {
        if (!rsp) return;
        setItemVisible('terminal', enabled);
      })
      .finally(() => setIsTerminalLoading(false));
  }

  function updateRemoteDownload(enabled: boolean) {
    if (isRemoteDownloadLoading) return;
    setIsRemoteDownloadLoading(true);

    return attempt(() => downloadApi.setRemoteImageDownloadEnabled(enabled))
      .then((rsp) => {
        if (!rsp) return;
        setIsRemoteDownloadEnabled(enabled);
      })
      .finally(() => setIsRemoteDownloadLoading(false));
  }

  function itemChecked(key: string) {
    if (key === 'remoteDownload') {
      return isRemoteDownloadEnabled;
    }
    return !menuDisabledItems.includes(key);
  }

  function itemLoading(key: string) {
    if (key === 'terminal') {
      return isTerminalLoading;
    }
    if (key === 'remoteDownload') {
      return isRemoteDownloadLoading;
    }
    return false;
  }

  function itemDisabled(key: string) {
    if (key === 'terminal') return !isTerminalReady;
    if (key === 'remoteDownload') return !isRemoteDownloadReady;
    return false;
  }

  return (
    <>
      <SettingSection
        title={t('settings.appearance.menuBar.icons')}
        description={t('settings.appearance.menuBar.iconsDesc')}
      >
        {items.map((item) => (
          <SettingRow
            key={item.key}
            label={
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-neutral-400">{item.icon}</span>
                <span className="min-w-0 wrap-break-word">
                  {item.label ? t(item.label) : t(`${item.key}.title`)}
                </span>
              </span>
            }
            isSwitch
          >
            <Switch
              checked={itemChecked(item.key)}
              loading={itemLoading(item.key)}
              disabled={itemDisabled(item.key)}
              onChange={() => updateItems(item.key)}
            />
          </SettingRow>
        ))}
      </SettingSection>

      <RemoteDownloadEnable
        open={isRemoteDownloadDialogOpen}
        onClose={() => setIsRemoteDownloadDialogOpen(false)}
        onEnabled={() => setIsRemoteDownloadEnabled(true)}
      />
    </>
  );
};
