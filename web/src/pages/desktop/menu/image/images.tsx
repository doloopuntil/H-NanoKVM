import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Divider, Popconfirm, Typography } from 'antd';
import clsx from 'clsx';
import {
  CableIcon,
  ChevronRightIcon,
  HardDriveDownloadIcon,
  HardDriveUploadIcon,
  LoaderCircleIcon,
  PackageIcon,
  PackageSearchIcon,
  Trash2Icon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/storage.ts';
import { getVirtualDevice, updateVirtualDevice } from '@/api/virtual-device.ts';
import { attempt, confirm, toast } from '@/lib/feedback.ts';
import { IMAGE_LIST_CHANGED_EVENT } from '@/lib/image-events.ts';
import { formatBytes } from '@/lib/image-transfer.ts';
import { client } from '@/lib/websocket.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

type ImagesProps = {
  isOpen: boolean;
  cdrom: boolean;
  setCdrom: (cdrom: boolean) => void;
  setIsMounted: (isMounted: boolean) => void;
  isDiskShared: boolean;
  isDiskStateKnown: boolean;
  refreshDiskState: () => void;
  disableDisk: () => void;
  isDisablingDisk: boolean;
};

export const Images = ({
  isOpen,
  cdrom,
  setCdrom,
  setIsMounted,
  isDiskShared,
  isDiskStateKnown,
  refreshDiskState,
  disableDisk,
  isDisablingDisk
}: ImagesProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [mountingImage, setMountingImage] = useState('');
  const [mountedImage, setMountedImage] = useState('');
  const [deletingImage, setDeletingImage] = useState('');
  // the row that shows its buttons
  const [expandedImage, setExpandedImage] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isListFailed, setIsListFailed] = useState(false);
  const isLoadingRef = useRef(false);

  // get mounted image
  const getMountedImage = useCallback(() => {
    attempt(() => api.getMountedImage()).then((rsp) => {
      if (!rsp) return;

      const file = rsp.data?.file;
      setMountedImage(file);
      setIsMounted(!!file);
    });
  }, [setIsMounted]);

  // get image list
  const getImages = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    attempt(() => api.getImages())
      .then((rsp) => {
        setIsListFailed(!rsp);
        if (!rsp) return;

        const files = rsp.data?.files;

        if (files?.length > 0) {
          setImages(files);
          setSizes(rsp.data?.sizes ?? {});
          getMountedImage();
        } else {
          setImages([]);
          setSizes({});
        }
      })
      .finally(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
      });
  }, [getMountedImage]);

  useEffect(() => {
    if (isOpen) {
      getImages();
    }
  }, [getImages, isOpen]);

  useEffect(() => {
    function handleImageListChanged() {
      if (isOpen) {
        getImages();
        refreshDiskState();
      }
    }

    window.addEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageListChanged);
    return () => window.removeEventListener(IMAGE_LIST_CHANGED_EVENT, handleImageListChanged);
  }, [refreshDiskState, getImages, isOpen]);

  // mounting an image takes the mass storage device away from the virtual disk,
  // so ask the user before the virtual disk changes on the computer
  function mountImage(image: string) {
    if (mountingImage) return;

    // unmounting leaves the virtual disk alone
    if (mountedImage === image) {
      doMountImage(image);
      return;
    }

    attempt(() => getVirtualDevice()).then((rsp) => {
      if (!rsp) return;

      const diskOn = !!rsp.data?.disk;
      confirm({
        title: t('image.mountTitle'),
        okText: t('image.mountTitle'),
        content: (
          <div className="space-y-1">
            <p>{t(diskOn ? 'image.diskOnWarn' : 'image.diskOffWarn')}</p>
            <Typography.Text code>{fileName(image)}</Typography.Text>
          </div>
        ),
        onOk: () => confirmMountImage(image, diskOn)
      });
    });
  }

  // turn the virtual disk on, then mount
  async function confirmMountImage(image: string, diskOn: boolean) {
    // the media device only exists while the virtual disk is enabled
    if (!diskOn) {
      const rsp = await updateVirtualDevice('disk');
      if (rsp.code !== 0) {
        console.log(rsp.msg);
        openNotification(false, rsp.msg);
        return;
      }
    }

    doMountImage(image);
  }

  // mount/unmount image
  function doMountImage(image: string, force = false) {
    if (mountingImage) return;
    setMountingImage(image);

    client.close();

    const isMounted = mountedImage === image;
    const filename = isMounted ? '' : image;
    const imageCdrom = isImageCdrom(image) && cdrom;
    const nextCdrom = isMounted ? false : imageCdrom;

    api
      .mountImage(filename, nextCdrom, force)
      .then((rsp) => {
        // the computer has locked the medium, so offer to force the eject
        if (rsp.code === api.MEDIA_LOCKED_CODE) {
          confirm({
            danger: true,
            title: t('image.forceEject'),
            content: (
              <div className="space-y-1">
                <p>{t('image.forceEjectConfirm')}</p>
                <Typography.Text code>{fileName(image)}</Typography.Text>
              </div>
            ),
            okText: t('image.forceEject'),
            onOk: () => doMountImage(image, true)
          });
          return;
        }

        if (rsp.code !== 0) {
          console.log(rsp.msg);
          openNotification(isMounted, rsp.msg);
          return;
        }

        setMountedImage(filename);
        setIsMounted(!!filename);
        setCdrom(nextCdrom);
      })
      .finally(() => {
        setMountingImage('');
        client.connect();
        refreshDiskState();
      });
  }

  // delete image
  function deleteImage(image: string) {
    if (deletingImage) return;
    setDeletingImage(image);

    attempt(() => api.deleteImage(image))
      .then((rsp) => {
        if (!rsp) return;

        getImages();
      })
      .finally(() => {
        setDeletingImage('');
      });
  }

  function confirmReconnectUsbGadget() {
    confirm({
      title: t('image.usbReconnect'),
      content: t('image.usbReconnectConfirm'),
      okText: t('image.usbReconnect'),
      onOk: reconnectUsbGadget
    });
  }

  function reconnectUsbGadget() {
    if (isReconnecting) return;

    setIsReconnecting(true);
    client.close();

    api
      .reconnectUsbGadget()
      .then((rsp) => {
        if (rsp.code !== 0) {
          toast.error(t('image.usbReconnectFailed'), {
            description: rsp.msg || t('image.mountDesc')
          });
          return;
        }

        toast.success(t('image.usbReconnectSuccess'));
        getMountedImage();
      })
      .finally(() => {
        setIsReconnecting(false);
        client.connect();
      });
  }

  // show mount/unmount failed notification
  function openNotification(isMounted: boolean, apiMessage?: string) {
    const message = isMounted ? 'image.unmountFailed' : 'image.mountFailed';
    const description = isMounted ? 'image.unmountDesc' : 'image.mountDesc';

    toast.error(t(message), { description: apiMessage || t(description) });
  }

  return (
    <div>
      {/* why Delete is off after an unmount: the virtual disk serves /data, which is then read-only */}
      {isDiskStateKnown && isDiskShared && !isLoading && images.length > 0 && (
        <Alert
          className="mb-2"
          type="warning"
          showIcon
          title={t('image.deleteDiskShared')}
          action={
            <Button type="primary" size="small" loading={isDisablingDisk} onClick={disableDisk}>
              {t('image.turnOff')}
            </Button>
          }
        />
      )}

      {renderList()}

      <Divider style={{ margin: '12px 0' }} />

      <div className="flex justify-end">
        <Button
          size="small"
          icon={
            isReconnecting ? (
              <LoaderCircleIcon className="animate-spin" size={16} />
            ) : (
              <CableIcon size={16} />
            )
          }
          loading={isReconnecting}
          onClick={confirmReconnectUsbGadget}
        >
          {t('image.usbReconnect')}
        </Button>
      </div>
    </div>
  );

  function renderList() {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 py-5 text-neutral-400">
          <LoaderCircleIcon className="animate-spin" size={16} />
          <span className="text-sm">{t('image.loading')}</span>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="flex items-center justify-center gap-2 py-5 text-neutral-500">
          <PackageSearchIcon size={16} />
          <span className="text-sm">
            {isListFailed ? t('common.actionFailed') : t('image.empty')}
          </span>
        </div>
      );
    }

    return (
      // the rest scroll; a thin scrollbar on a transparent track
      <ScrollArea className="flex max-h-56 flex-col pr-1">
        {images.map((image) => {
          const isMountedImage = mountedImage === image;
          const isExpanded = expandedImage === image;

          return (
            <div
              key={image}
              className={clsx(
                'my-1 rounded-sm',
                isExpanded ? 'bg-neutral-700/50' : 'hover:bg-neutral-700/70'
              )}
            >
              <div
                className={clsx(
                  'flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1.5 select-none',
                  isMountedImage && 'text-blue-500'
                )}
                onClick={() => setExpandedImage(isExpanded ? '' : image)}
              >
                <div className="flex size-5 items-center justify-center">
                  {mountingImage === image ? (
                    <LoaderCircleIcon className="animate-spin" size={16} />
                  ) : (
                    <PackageIcon size={16} />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate">{fileName(image)}</span>
                </div>
                {sizes[image] !== undefined && (
                  <div className="shrink-0 text-xs text-neutral-500">
                    {formatBytes(sizes[image])}
                  </div>
                )}
                <div
                  className={clsx(
                    'mr-0.5 rounded-sm border px-1.5 py-0.5 text-xs leading-none font-semibold uppercase',
                    isImageCdrom(image)
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                      : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  )}
                >
                  {isImageCdrom(image) ? 'ISO' : 'IMG'}
                </div>
                <ChevronRightIcon
                  size={16}
                  className={clsx(
                    'shrink-0 text-neutral-500 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </div>

              {isExpanded && (
                <div className="flex items-center justify-end gap-2 p-3">
                  {isMountedImage ? (
                    <Button
                      danger
                      size="small"
                      icon={<HardDriveUploadIcon size={16} />}
                      loading={mountingImage === image}
                      disabled={!!mountingImage}
                      onClick={() => mountImage(image)}
                    >
                      {t('image.eject')}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      icon={<HardDriveDownloadIcon size={16} />}
                      loading={mountingImage === image}
                      disabled={!!mountingImage}
                      onClick={() => mountImage(image)}
                    >
                      {t('image.mount')}
                    </Button>
                  )}

                  <Popconfirm
                    color={popconfirmColor}
                    placement="bottomRight"
                    title={t('image.deleteConfirm')}
                    okText={t('common.delete')}
                    cancelText={t('common.cancel')}
                    okButtonProps={confirmOkProps}
                    onConfirm={() => deleteImage(image)}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<Trash2Icon size={16} />}
                      disabled={isMountedImage || isDiskShared || !isDiskStateKnown}
                      loading={deletingImage === image}
                    >
                      {t('common.delete')}
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>
    );
  }
};

function fileName(path: string): string {
  return path.replace(/^.*[\\/]/, '');
}

function isImageCdrom(image: string): boolean {
  return image.toLowerCase().endsWith('.iso');
}
