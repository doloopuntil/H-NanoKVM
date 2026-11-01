import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { ZapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/hid.ts';
import { attempt } from '@/lib/feedback.ts';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Recorder } from './recorder.tsx';
import { Shortcut } from './shortcut.tsx';
import type { Shortcut as ShortcutInterface } from './types.ts';

export const Shortcuts = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [customShortcuts, setCustomShortcuts] = useState<ShortcutInterface[]>([]);

  const defaultShortcuts: ShortcutInterface[] = [
    {
      keys: [
        { code: 'MetaLeft', label: 'Win' },
        { code: 'Tab', label: 'Tab' }
      ]
    },
    {
      keys: [
        { code: 'ControlLeft', label: 'Ctrl' },
        { code: 'AltLeft', label: 'Alt' },
        { code: 'Delete', label: '⌫' }
      ]
    }
  ];

  // the list is only shown in the popover, so a failed preload stays quiet
  useEffect(() => {
    getShortcuts(!isOpen);
  }, [isOpen]);

  async function getShortcuts(quiet = false) {
    const rsp = await attempt(() => api.getShortcuts(), { quiet });
    if (!rsp) return;

    setCustomShortcuts(Array.isArray(rsp.data?.shortcuts) ? rsp.data.shortcuts : []);
  }

  async function addShortcut(shortcut: ShortcutInterface) {
    const rsp = await attempt(() => api.addShortcut(shortcut.keys));
    if (!rsp) return;

    await getShortcuts();
  }

  async function delShortcut(shortcut: ShortcutInterface) {
    const id = shortcut.id;
    if (!id) return;

    const rsp = await attempt(() => api.deleteShortcut(id));
    if (!rsp) return;

    await getShortcuts();
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      setIsOpen(true);
      return;
    }
    if (isRecording) {
      return;
    }
    setIsOpen(false);
  }

  const content = (
    <ScrollArea className="max-w-[min(400px,calc(100vw-48px))] *:data-radix-scroll-area-viewport:max-h-[350px]">
      {/* custom shortcuts */}
      {customShortcuts.length > 0 && (
        <>
          {customShortcuts.map((shortcut) => (
            <Shortcut key={shortcut.id} shortcut={shortcut}></Shortcut>
          ))}

          <Divider style={{ margin: '5px 0 5px 0' }} />
        </>
      )}

      {/*  default shortcuts */}
      {defaultShortcuts.map((shortcut, index) => (
        <Shortcut key={index} shortcut={shortcut}></Shortcut>
      ))}

      <Divider style={{ margin: '5px 0 5px 0' }} />

      <Recorder
        shortcuts={customShortcuts}
        addShortcut={addShortcut}
        delShortcut={delShortcut}
        setIsRecording={setIsRecording}
      />
    </ScrollArea>
  );

  return (
    <MenuSubmenu
      icon={<ZapIcon size={16} />}
      label={t('keyboard.shortcut.title')}
      content={content}
      open={isOpen}
      onOpenChange={handleOpenChange}
    />
  );
};
