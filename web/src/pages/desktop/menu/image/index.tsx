import { useEffect, useState } from 'react';
import { Modal, Segmented, Tooltip } from 'antd';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { DiscIcon, HardDriveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/storage.ts';
import { attempt } from '@/lib/feedback.ts';
import { IMAGE_LIST_CHANGED_EVENT } from '@/lib/image-events.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import { submenuOpenCountAtom } from '@/jotai/settings.ts';
import { useImageStorage } from '@/hooks/useImageStorage.ts';
import { useIsTouchLayout } from '@/hooks/useResponsiveLayout.ts';

import { AddImage } from './add-image.tsx';
import { Images } from './images.tsx';
import { Tips } from './tips.tsx';

export const Image = () => {
  const { t } = useTranslation();
  const setSubmenuOpenCount = useSetAtom(submenuOpenCountAtom);
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);
  const storage = useImageStorage();
  const isTouchLayout = useIsTouchLayout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState('mass-storage');

  const modes = [
    {
      value: 'mass-storage',
      label: (
        <div className="flex items-center gap-1">
          <HardDriveIcon size={16} />
          <span>{t('image.massStorage')}</span>
        </div>
      )
    },
    {
      value: 'cd-rom',
      label: (
        <div className="flex items-center gap-1">
          <DiscIcon size={16} />
          <span>{t('image.cdRom')}</span>
        </div>
      )
    }
  ];

  useEffect(() => {
    getImageState();

    const handleImageUpdated = () => {
      getImageState();
    };
    window.addEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageUpdated);

    return () => {
      window.removeEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageUpdated);
    };
  }, []);

  // readers of the mounted image and of the CD-ROM flag: the icon state and the
  // mode selector here, and the same state in the mount panel
  function getImageState() {
    attempt(() => api.getMountedImage(), { quiet: true }).then((rsp) => {
      if (rsp) setIsMounted(!!rsp.data?.file);
    });

    attempt(() => api.getCdRom(), { quiet: true }).then((rsp) => {
      if (rsp) setMode(rsp.data?.cdrom === 1 ? 'cd-rom' : 'mass-storage');
    });
  }

  function toggleModal(open: boolean) {
    setIsModalOpen(open);
    // typing in the add form must not reach the host
    setIsKeyboardEnable(!open);
    if (open) storage.refresh();
    setSubmenuOpenCount((count) => (open ? count + 1 : Math.max(0, count - 1)));
  }

  return (
    <>
      <Tooltip title={t('image.title')} placement="bottom" mouseEnterDelay={0.6}>
        <div
          className={clsx(
            'flex size-7.5 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-700',
            isMounted ? 'text-blue-500' : 'text-neutral-300 hover:text-white'
          )}
          onClick={() => toggleModal(true)}
        >
          <DiscIcon size={18} />
        </div>
      </Tooltip>

      <Modal
        title={
          <div className="flex items-center gap-1">
            <span>{t('image.title')}</span>
            <Tips />
          </div>
        }
        open={isModalOpen}
        // not centred on a phone, so that the phone's keyboard does not cover the text boxes
        centered={!isTouchLayout}
        footer={null}
        onCancel={() => toggleModal(false)}
      >
        <div className="flex flex-col pt-3">
          {/* the buttons drop under the label when a translation leaves no room beside it */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <span className="font-semibold">{t('image.mountMode')}</span>
            <Segmented
              className="ml-auto"
              size="small"
              value={mode}
              options={modes}
              disabled={isMounted}
              onChange={setMode}
            />
          </div>

          <div className="mt-3">
            <Images
              isOpen={isModalOpen}
              cdrom={mode === 'cd-rom'}
              setCdrom={(nextCdrom) => setMode(nextCdrom ? 'cd-rom' : 'mass-storage')}
              setIsMounted={setIsMounted}
              isDiskShared={storage.isDiskShared}
              isDiskStateKnown={storage.isDiskStateKnown}
              refreshDiskState={storage.refresh}
            >
              <AddImage
                isOpen={isModalOpen}
                isWritable={storage.isWritable}
                isRemoteEnabled={storage.isRemoteEnabled}
                isDiskShared={storage.isDiskShared}
                isDisablingDisk={storage.isDisablingDisk}
                onDisableDisk={storage.disableDisk}
              />
            </Images>
          </div>
        </div>
      </Modal>
    </>
  );
};
