import { useState } from 'react';
import { Switch } from 'antd';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { statusImage } from '@/api/download.ts';
import { getHidMode, getUsbWakeup, setHidMode, setUsbWakeup } from '@/api/hid.ts';
import { getMountedImage } from '@/api/storage.ts';
import * as api from '@/api/virtual-device.ts';
import { attempt, confirm, toast } from '@/lib/feedback.ts';
import { notifyImageListChanged } from '@/lib/image-events.ts';
import { closeSettingsRequestAtom } from '@/jotai/settings.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { SettingRow } from '@/components/setting-rows.tsx';

export const VirtualDevices = () => {
  const { t } = useTranslation();

  const [isHidOnlyMode, setIsHidOnlyMode] = useState(false);
  const [isUsbWakeupEnabled, setIsUsbWakeupEnabled] = useState(false);
  const [isDiskEnabled, setIsDiskEnabled] = useState(false);
  const [isNetworkEnabled, setIsNetworkEnabled] = useState(false);
  const [isImageMounted, setIsImageMounted] = useState(false);
  const [loading, setLoading] = useState<'' | 'disk' | 'network' | 'wakeup' | 'hid'>('');
  const setCloseSettingsRequest = useSetAtom(closeSettingsRequestAtom);

  const applyVirtualDevice = (rsp: { data?: any }) => {
    setIsDiskEnabled(rsp.data.disk);
    setIsNetworkEnabled(rsp.data.network);
  };

  const applyImageState = (rsp: { data?: any }) => {
    setIsImageMounted(!!rsp.data?.file);
  };

  const isReady = [
    useSettingsLoad(getHidMode, (rsp) => setIsHidOnlyMode(rsp.data.mode === 'hid-only')),
    useSettingsLoad(api.getVirtualDevice, applyVirtualDevice),
    useSettingsLoad(getMountedImage, applyImageState),
    useSettingsLoad(getUsbWakeup, (rsp) => setIsUsbWakeupEnabled(rsp.data.enabled))
  ].every(Boolean);

  async function update(device: 'disk' | 'network') {
    if (loading) return;
    setLoading(device);

    const rsp = await attempt(() => api.updateVirtualDevice(device));
    if (rsp) {
      const device = await attempt(() => api.getVirtualDevice());
      if (device) applyVirtualDevice(device);

      const image = await attempt(() => getMountedImage());
      if (image) applyImageState(image);

      // the desktop shows the mounted image and the CD-ROM flag too
      notifyImageListChanged();
    }

    setLoading('');
  }

  // enabling the disk hands /data to the host and takes it away from the
  // mounted image, and a running transfer would be cut short
  async function toggleDisk() {
    if (isDiskEnabled) {
      await update('disk');
      return;
    }

    try {
      const rsp = await statusImage();
      if (rsp.code === 0 && rsp.data?.status === 'in_progress') {
        toast.warning(t('settings.device.diskTransferRunning'));
        return;
      }
    } catch (err) {
      console.log(err);
    }

    if (isImageMounted) {
      confirm({
        title: t('settings.device.diskEnable'),
        okText: t('settings.device.diskEnable'),
        content: t('settings.device.diskCancelMount'),
        onOk: () => update('disk')
      });
      return;
    }

    await update('disk');
  }

  // restarting the USB connection drops the mounted image and brings the virtual disk back
  function toggleNetwork() {
    if (!isImageMounted) {
      update('network');
      return;
    }

    confirm({
      title: t('settings.device.networkChange'),
      okText: t('settings.device.networkChange'),
      content: t('settings.device.networkCancelMount'),
      onOk: () => update('network')
    });
  }

  // the device reboots to apply the mode, so the dialog closes and the page reloads once it is back
  function updateHidMode() {
    if (loading) return;
    setLoading('hid');

    const timeoutId = setTimeout(() => {
      window.location.reload();
    }, 30000);

    setHidMode(isHidOnlyMode ? 'normal' : 'hid-only')
      .then((rsp) => {
        if (rsp.code !== 0) {
          toast.error(rsp.msg || t('common.actionFailed'));
          setLoading('');
          clearTimeout(timeoutId);
          return;
        }

        setCloseSettingsRequest((count) => count + 1);
      })
      .catch((err) => {
        console.log(err);
        setLoading('');
        clearTimeout(timeoutId);
      });
  }

  async function updateWakeup(enabled: boolean) {
    if (loading) return;
    setLoading('wakeup');

    const rsp = await attempt(() => setUsbWakeup(enabled));
    if (rsp) setIsUsbWakeupEnabled(rsp.data.enabled);

    setLoading('');
  }

  const usbWakeup = (
    <SettingRow
      label={
        <LabelTip text={t('settings.device.usbWakeup')} tip={t('settings.device.usbWakeupTip')} />
      }
      description={t('settings.device.usbWakeupDesc')}
      isSwitch
    >
      <Switch
        checked={isUsbWakeupEnabled}
        loading={loading === 'wakeup'}
        disabled={!isReady}
        onChange={updateWakeup}
      />
    </SettingRow>
  );

  const hidOnly = (
    <>
      <SettingRow
        label={
          <LabelTip text={t('settings.device.hidOnly')} tip={t('settings.device.hidOnlyTip')} />
        }
        description={t('settings.device.hidOnlyDesc')}
        isSwitch
      >
        {/* Both directions reboot the device, so each asks in a dialog. */}
        <Switch
          checked={isHidOnlyMode}
          loading={loading === 'hid'}
          disabled={!isReady}
          onChange={() => {
            if (!isHidOnlyMode) {
              confirm({
                title: t('mouse.hidOnly.enable'),
                content: (
                  <div className="space-y-2">
                    <p>{t('mouse.hidOnly.desc')}</p>
                    <ul className="list-disc space-y-1 pl-5 text-neutral-400">
                      <li>{t('mouse.hidOnly.tip1')}</li>
                      <li>{t('mouse.hidOnly.tip2')}</li>
                      <li>{t('mouse.hidOnly.tip3')}</li>
                    </ul>
                  </div>
                ),
                okText: t('mouse.hidOnly.enable'),
                onOk: updateHidMode
              });
              return;
            }

            confirm({
              title: t('mouse.hidOnly.disable'),
              content: t('mouse.hidOnly.tip3'),
              okText: t('mouse.hidOnly.disable'),
              onOk: updateHidMode
            });
          }}
        />
      </SettingRow>
    </>
  );

  return (
    <>
      {hidOnly}

      <SettingRow
        label={t('settings.device.disk')}
        description={
          isImageMounted ? t('settings.device.diskLocked') : t('settings.device.diskDesc')
        }
        isSwitch
      >
        <Switch
          checked={isDiskEnabled && !isHidOnlyMode}
          loading={loading === 'disk'}
          disabled={!isReady || isHidOnlyMode}
          onChange={toggleDisk}
        />
      </SettingRow>

      <SettingRow
        label={t('settings.device.network')}
        description={t('settings.device.networkDesc')}
        isSwitch
      >
        <Switch
          checked={isNetworkEnabled && !isHidOnlyMode}
          loading={loading === 'network'}
          disabled={!isReady || isHidOnlyMode}
          onChange={toggleNetwork}
        />
      </SettingRow>

      {usbWakeup}
    </>
  );
};
