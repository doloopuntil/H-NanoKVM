import { useEffect, useState } from 'react';
import { Button, Segmented } from 'antd';
import clsx from 'clsx';
import { DiscIcon, HardDriveIcon, PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/storage.ts';
import { attempt, toast } from '@/lib/feedback.ts';
import { IMAGE_LIST_CHANGED_EVENT } from '@/lib/image-events.ts';
import { useImageStorage } from '@/hooks/useImageStorage.ts';
import { useImageTransfer } from '@/hooks/useImageTransfer.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

import { AddImageDialog } from './add-image-dialog.tsx';
import { Images } from './images.tsx';
import { Tips } from './tips.tsx';
import { TransferRow } from './transfer-row.tsx';

export const Image = () => {
  const { t } = useTranslation();
  const storage = useImageStorage();
  // lives here, not in the add dialog, so that a transfer goes on when the dialog is closed
  const transfer = useImageTransfer({
    remoteEnabled: storage.isRemoteEnabled,
    onFailed: (message) => toast.error(t('download.failed'), { description: message })
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState('mass-storage');

  const isTransferring = transfer.status === 'in_progress';

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

  useEffect(() => {
    getImageState();
    storage.refresh();
    // picks up a transfer that is running, also after the page was reloaded
    transfer.resume();

    const handleImageUpdated = () => {
      getImageState();
    };
    window.addEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageUpdated);

    return () => {
      window.removeEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageUpdated);
    };
    // runs once, when the menu bar is shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open) storage.refresh();
  }

  function openDialog() {
    transfer.resume();
    setIsDialogOpen(true);
  }

  function closeDialog() {
    // forgets a finished transfer, keeps a running one
    transfer.reset();
    setIsDialogOpen(false);
  }

  const content = (close: () => void) => (
    // on a phone the popover would close at a tap on a row; only `close` closes it
    <div data-menu-keep-open className="w-[min(400px,calc(100vw-48px))]">
      <MenuHeader title={t('image.title')}>
        <div className="flex items-center gap-2">
          <Tips />
          <Button
            size="small"
            icon={<PlusIcon size={16} />}
            onClick={() => {
              openDialog();
              close();
            }}
          >
            {t('image.addImage')}
          </Button>
        </div>
      </MenuHeader>

      {isTransferring && <TransferRow transfer={transfer} />}

      {/* the buttons drop under the label when a translation leaves no room beside it */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1 pb-2">
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

      <Images
        isOpen={isOpen}
        cdrom={mode === 'cd-rom'}
        setCdrom={(nextCdrom) => setMode(nextCdrom ? 'cd-rom' : 'mass-storage')}
        setIsMounted={setIsMounted}
        isDiskShared={storage.isDiskShared}
        isDiskStateKnown={storage.isDiskStateKnown}
        refreshDiskState={storage.refresh}
        disableDisk={storage.disableDisk}
        isDisablingDisk={storage.isDisablingDisk}
      />
    </div>
  );

  return (
    <>
      <MenuItem
        title={t('image.title')}
        icon={
          <span className="relative flex">
            <DiscIcon size={18} />
            {isTransferring && (
              <span className="absolute -top-1 -right-1 size-2 animate-pulse rounded-full bg-blue-500" />
            )}
          </span>
        }
        className={clsx(
          'flex size-7.5 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-700/80',
          isMounted ? 'text-blue-500' : 'text-neutral-300 hover:text-white'
        )}
        content={content}
        onOpenChange={handleOpenChange}
      />

      {isDialogOpen && (
        <AddImageDialog transfer={transfer} storage={storage} onClose={closeDialog} />
      )}
    </>
  );
};
