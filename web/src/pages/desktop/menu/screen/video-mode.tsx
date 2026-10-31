import { useCallback, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { useAtomValue } from 'jotai';
import { TvMinimalPlayIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as downloadApi from '@/api/download.ts';
import * as firewallApi from '@/api/system-firewall.ts';
import { confirm } from '@/lib/feedback.ts';
import { setVideoMode as setCookie } from '@/lib/localstorage.ts';
import { videoModeAtom } from '@/jotai/screen.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

const videoModes = [
  { key: 'direct', name: 'H.264 (Direct)' },
  { key: 'h264', name: 'H.264 (WebRTC)' },
  { key: 'mjpeg', name: 'MJPEG' }
];

export const VideoMode = () => {
  const { t } = useTranslation();
  const videoMode = useAtomValue(videoModeAtom);

  const [isDirectSupported, setIsDirectSupported] = useState<boolean | null>(null);
  const [isWebrtcBlocked, setIsWebrtcBlocked] = useState(false);

  const refreshFirewallStatus = useCallback(() => {
    firewallApi
      .getStatus()
      .then((rsp) => {
        if (rsp.code !== 0 || !rsp.data) return;
        const firewall = rsp.data;
        setIsWebrtcBlocked(
          firewall.webrtcBlocked ||
            firewall.restrictedActive ||
            firewall.paranoidActive ||
            firewall.effectiveMode === 'restricted' ||
            firewall.effectiveMode === 'paranoid'
        );
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const isHttps = window.location.protocol === 'https:';
    const isDecoderSupported = !!window.VideoDecoder;

    setIsDirectSupported(isHttps && isDecoderSupported);
  }, []);

  useEffect(() => {
    refreshFirewallStatus();
  }, [refreshFirewallStatus]);

  useEffect(() => {
    function refreshIfVisible() {
      if (!document.hidden) {
        refreshFirewallStatus();
      }
    }

    window.addEventListener('focus', refreshFirewallStatus);
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      window.removeEventListener('focus', refreshFirewallStatus);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [refreshFirewallStatus]);

  useEffect(() => {
    if (!isWebrtcBlocked || videoMode !== 'h264' || isDirectSupported === null) return;

    setCookie(isDirectSupported ? 'direct' : 'mjpeg');
    setTimeout(() => {
      window.location.reload();
    }, 250);
  }, [isDirectSupported, isWebrtcBlocked, videoMode]);

  async function isTransferRunning() {
    try {
      const rsp = await downloadApi.statusImage();
      return rsp.code === 0 && rsp.data?.status === 'in_progress';
    } catch {
      return false;
    }
  }

  function applyMode(mode: string) {
    setCookie(mode);

    // reload after changing video mode
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  async function update(mode: string) {
    if (mode === videoMode) return;
    if (mode === 'h264' && isWebrtcBlocked) return;

    // The reload below would cancel a running image upload or download.
    if (await isTransferRunning()) {
      confirm({
        title: t('screen.transferRunningTitle'),
        content: t('screen.transferRunningDesc'),
        okText: t('screen.transferRunningOk'),
        onOk: () => applyMode(mode)
      });
      return;
    }

    applyMode(mode);
  }

  const content = (
    <>
      {!isDirectSupported && (
        <Tooltip
          title={t('screen.videoDirectTips')}
          placement="right"
          styles={{ root: { maxWidth: '270px' } }}
        >
          <MenuOption disabled>H.264 (Direct)</MenuOption>
        </Tooltip>
      )}

      {videoModes.map(
        (mode) =>
          (isDirectSupported || mode.key !== 'direct') && (
            <Tooltip
              key={mode.key}
              title={
                mode.key === 'h264' && isWebrtcBlocked
                  ? t('screen.videoWebrtcBlockedByFirewall')
                  : undefined
              }
              placement="right"
              styles={{ root: { maxWidth: '270px' } }}
            >
              <MenuOption
                disabled={mode.key === 'h264' && isWebrtcBlocked}
                selected={mode.key === videoMode}
                onClick={() => update(mode.key)}
              >
                {mode.name}
              </MenuOption>
            </Tooltip>
          )
      )}
    </>
  );

  return (
    <MenuSubmenu
      icon={<TvMinimalPlayIcon size={16} />}
      label={t('screen.video')}
      content={content}
      onOpenChange={(open) => {
        if (open) refreshFirewallStatus();
      }}
    />
  );
};
