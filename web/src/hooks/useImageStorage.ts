import { useCallback, useState } from 'react';

import { imageEnabled } from '@/api/download.ts';
import { getVirtualDevice, updateVirtualDevice } from '@/api/virtual-device.ts';
import { attempt } from '@/lib/feedback.ts';

// Whether images can be added or deleted: /data is read-only while the virtual disk serves it
// to the host, and the remote download can be switched off in the settings.
export type ImageStorage = ReturnType<typeof useImageStorage>;

export function useImageStorage() {
  const [isWritable, setIsWritable] = useState(false);
  const [isRemoteEnabled, setIsRemoteEnabled] = useState(false);
  const [isDiskShared, setIsDiskShared] = useState(false);
  const [isDiskStateKnown, setIsDiskStateKnown] = useState(false);
  const [isDisablingDisk, setIsDisablingDisk] = useState(false);

  const refresh = useCallback(() => {
    imageEnabled()
      .then((rsp) => {
        setIsWritable(rsp.data.enabled === true);
        setIsRemoteEnabled(rsp.data.remoteEnabled === true);
      })
      .catch(() => {
        setIsWritable(false);
        setIsRemoteEnabled(false);
      });

    getVirtualDevice()
      .then((rsp) => {
        setIsDiskShared(!!rsp.data?.disk);
        setIsDiskStateKnown(true);
      })
      .catch(() => {
        setIsDiskShared(false);
        setIsDiskStateKnown(false);
      });
  }, []);

  // hand /data back to the KVM, which makes adding and deleting possible again
  const disableDisk = useCallback(() => {
    if (isDisablingDisk) return;
    setIsDisablingDisk(true);

    attempt(() => updateVirtualDevice('disk'))
      .then((rsp) => {
        if (rsp) refresh();
      })
      .finally(() => setIsDisablingDisk(false));
  }, [isDisablingDisk, refresh]);

  return {
    isWritable,
    isRemoteEnabled,
    isDiskShared,
    isDiskStateKnown,
    isDisablingDisk,
    refresh,
    disableDisk
  };
}
