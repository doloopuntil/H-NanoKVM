import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { useAtomValue } from 'jotai';
import { MonitorIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { getHardware, updateScreen } from '@/api/vm';
import * as ls from '@/lib/localstorage';
import { resolutionAtom, videoModeAtom } from '@/jotai/screen.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

import { BitRateMap, QualityMap } from './constants.ts';
import { Fps } from './fps';
import { FrameDetect } from './frame-detect';
import { Quality } from './quality';
import { Reset } from './reset.tsx';
import { Resolution } from './resolution';
import { Scale } from './scale';
import { VideoMode } from './video-mode.tsx';

export const Screen = () => {
  const { t } = useTranslation();

  const videoMode = useAtomValue(videoModeAtom);
  const resolution = useAtomValue(resolutionAtom);
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState(2);
  // only a PCIe board has the HDMI reset line that Reset HDMI pulses
  const [isPcie, setIsPcie] = useState(false);

  useEffect(() => {
    updateScreen('type', videoMode === 'mjpeg' ? 0 : 1);
    if (resolution) {
      updateScreen('resolution', resolution.height);
    }
    updateQuality();
    updateFps();
    getHardware()
      .then((rsp) => setIsPcie(rsp.data?.version === 'PCIE'))
      .catch(() => {});
  }, []);

  async function updateQuality() {
    const cookieQuality = ls.getQuality();
    if (!cookieQuality) return;

    const key = cookieQuality >= 1 && cookieQuality <= 4 ? cookieQuality : 2;
    const value = videoMode === 'mjpeg' ? QualityMap.get(key)! : BitRateMap.get(key)!;

    const rsp = await updateScreen('quality', value);
    if (rsp.code === 0) {
      setQuality(key);
    }
  }

  async function updateFps() {
    const cookieFps = ls.getFps();
    if (!cookieFps) return;

    const rsp = await updateScreen('fps', cookieFps);
    if (rsp.code === 0) {
      setFps(cookieFps);
    }
  }

  const content = (
    <div className="min-w-[200px]">
      <MenuHeader title={t('screen.title')} />

      <div className="flex flex-col space-y-1">
        <VideoMode />
        <Resolution />
        <Quality quality={quality} setQuality={setQuality} />
        <Fps fps={fps} setFps={setFps} />
        <Scale />
        {videoMode === 'mjpeg' && <FrameDetect />}
        {isPcie && (
          <>
            <Divider style={{ margin: '10px 0' }} />
            <Reset />
          </>
        )}
      </div>
    </div>
  );

  return <MenuItem title={t('screen.title')} icon={<MonitorIcon size={18} />} content={content} />;
};
