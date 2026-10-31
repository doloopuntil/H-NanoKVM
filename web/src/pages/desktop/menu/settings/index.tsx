import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Badge, Modal, Tooltip } from 'antd';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ActivityIcon,
  BrickWallIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleArrowUpIcon,
  ClockIcon,
  CpuIcon,
  GaugeIcon,
  GlobeIcon,
  InfoIcon,
  NetworkIcon,
  PaletteIcon,
  RadioTowerIcon,
  ScrollTextIcon,
  ServerCogIcon,
  SettingsIcon,
  ShieldEllipsisIcon,
  SlidersHorizontalIcon,
  UserRoundIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import semver from 'semver';

import * as api from '@/api/application.ts';
import { attempt } from '@/lib/feedback.ts';
import * as ls from '@/lib/localstorage.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import { closeSettingsRequestAtom, submenuOpenCountAtom } from '@/jotai/settings.ts';
import { useIsTouchLayout } from '@/hooks/useResponsiveLayout.ts';
import { Tailscale as TailscaleIcon } from '@/components/icons/tailscale';
import { SettingsLoadGroup } from '@/components/settings-load-group.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';

import { About } from './about';
import { Account } from './account';
import { Appearance } from './appearance';
import { Device } from './device';
import { System, type SystemSection } from './system';
import { Tailscale } from './tailscale';
import { Wireguard } from './wireguard';

type Tab = {
  id: string;
  icon: ReactNode;
  title: string;
  component?: ReactNode;
  // a group has no page of its own; choosing it opens its first subpage
  children?: Tab[];
};

export const Settings = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [currentTab, setCurrentTab] = useState('about');
  // the groups open on the desktop; they start closed
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const isTouchLayout = useIsTouchLayout();

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);
  const setSubmenuOpenCount = useSetAtom(submenuOpenCountAtom);
  const closeRequest = useAtomValue(closeSettingsRequestAtom);
  const isModalOpenRef = useRef(false);
  isModalOpenRef.current = isModalOpen;

  const systemTab = (section: SystemSection, icon: ReactNode, title: string): Tab => ({
    id: `system.${section}`,
    icon,
    title,
    component: <System section={section} setIsLocked={setIsLocked} />
  });

  const tabs: Tab[] = [
    {
      id: 'about',
      icon: <InfoIcon size={16} />,
      title: t('settings.about.title'),
      component: <About />
    },
    {
      id: 'device',
      icon: <CpuIcon size={16} />,
      title: t('settings.device.title'),
      component: <Device />
    },
    {
      id: 'user',
      icon: <SlidersHorizontalIcon size={16} />,
      title: t('settings.user.title'),
      children: [
        {
          id: 'user.account',
          icon: <UserRoundIcon size={16} />,
          title: t('settings.account.title'),
          component: <Account setIsLocked={setIsLocked} />
        },
        {
          id: 'user.appearance',
          icon: <PaletteIcon size={16} />,
          title: t('settings.appearance.title'),
          component: <Appearance />
        }
      ]
    },
    {
      id: 'networking',
      icon: <GlobeIcon size={16} />,
      title: t('settings.networking.title'),
      children: [
        systemTab('network', <NetworkIcon size={16} />, t('settings.network.title')),
        systemTab('services', <RadioTowerIcon size={16} />, t('settings.system.sections.services')),
        systemTab('firewall', <BrickWallIcon size={16} />, t('settings.system.sections.firewall')),
        {
          id: 'networking.wireguard',
          icon: <ShieldEllipsisIcon size={16} />,
          title: t('settings.wireguard.title'),
          component: <Wireguard />
        },
        {
          id: 'networking.tailscale',
          icon: <TailscaleIcon />,
          title: t('settings.tailscale.title'),
          component: <Tailscale setIsLocked={setIsLocked} />
        }
      ]
    },
    {
      id: 'system',
      icon: <ServerCogIcon size={16} />,
      title: t('settings.system.title'),
      children: [
        systemTab('time', <ClockIcon size={16} />, t('settings.system.sections.time')),
        systemTab(
          'systemLog',
          <ScrollTextIcon size={16} />,
          t('settings.system.sections.systemLog')
        ),
        systemTab(
          'performance',
          <GaugeIcon size={16} />,
          t('settings.system.sections.performance')
        ),
        systemTab('monitor', <ActivityIcon size={16} />, t('settings.system.sections.monitor')),
        systemTab('updates', <CircleArrowUpIcon size={16} />, t('settings.update.title'))
      ]
    }
  ];

  const pages = tabs.flatMap((tab) => tab.children ?? [tab]);
  const currentGroup = tabs.find((tab) => tab.children?.some((child) => child.id === currentTab));

  useEffect(() => {
    const skip = ls.getSkipUpdate();
    if (!skip) {
      checkForUpdates();
    }
  }, []);

  useEffect(() => {
    scrollViewportRef.current?.scrollTo({ top: 0, left: 0 });
  }, [currentTab]);

  function checkForUpdates() {
    attempt(() => api.getVersion(), { quiet: true }).then((rsp: any) => {
      if (!rsp?.data?.current || !rsp.data.latest) {
        return;
      }

      if (semver.gt(rsp.data.latest, rsp.data.current)) {
        setIsUpdateAvailable(true);
      }
    });
  }

  function changeTab(tab: string) {
    if (isLocked) {
      return;
    }

    setCurrentTab(tab);

    if (isUpdateAvailable && tab === 'system.updates') {
      setIsUpdateAvailable(false);
      ls.setSkipUpdate(true);
    }
  }

  function openModal() {
    setIsModalOpen(true);
    setIsKeyboardEnable(false);
    setSubmenuOpenCount((count) => count + 1);
  }

  function closeModal() {
    if (isLocked) {
      return;
    }

    finishClose();
  }

  function finishClose() {
    setIsKeyboardEnable(true);
    setIsModalOpen(false);
    setCurrentTab('about');
    setSubmenuOpenCount((count) => Math.max(0, count - 1));
  }

  // something in a tab (a change that reboots the device) asks for the dialog to close
  useEffect(() => {
    if (closeRequest === 0 || !isModalOpenRef.current) return;
    finishClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeRequest]);

  function toggleGroup(id: string) {
    setOpenGroups((groups) =>
      groups.includes(id) ? groups.filter((group) => group !== id) : [...groups, id]
    );
  }

  function renderTab(tab: Tab, isChild = false) {
    const firstPage = tab.children?.[0];
    const isActive = tab.id === currentTab || (!!tab.children && currentGroup === tab);
    const isOpen = openGroups.includes(tab.id);
    // a closed group carries the dot of the page inside it
    const showBadge =
      isUpdateAvailable &&
      (tab.id === 'system.updates' || (tab.id === 'system' && (!isOpen || isTouchLayout)));
    const label = (
      <span
        className={clsx(
          isTouchLayout
            ? 'mt-1 block text-center text-[11px] leading-tight [overflow-wrap:anywhere]'
            : 'hidden truncate text-sm sm:block'
        )}
      >
        {tab.title}
      </span>
    );

    return (
      <div
        key={tab.id}
        className={clsx(
          'cursor-pointer select-none rounded-lg',
          isTouchLayout
            ? 'flex min-w-0 flex-auto flex-col items-center justify-center px-1 py-2'
            : clsx('flex items-center space-x-2 sm:px-3', isChild ? 'py-1.5 pl-2 sm:pl-8' : 'p-2'),
          // on the desktop a group is only a label; its subpage carries the selection
          isActive && (!tab.children || isTouchLayout)
            ? 'bg-neutral-700/50'
            : 'hover:bg-neutral-700/50',
          tab.children && !isTouchLayout && 'text-neutral-400'
        )}
        onClick={() => {
          if (tab.children && !isTouchLayout) {
            toggleGroup(tab.id);
          } else if (firstPage && currentGroup !== tab) {
            changeTab(firstPage.id);
          } else if (!tab.children) {
            changeTab(tab.id);
          }
        }}
      >
        <div className="flex h-[16px] w-[16px] items-center justify-center">{tab.icon}</div>
        {showBadge ? (
          <Badge dot color="blue" offset={[6, 3]}>
            {label}
          </Badge>
        ) : (
          label
        )}
        {tab.children && !isTouchLayout && (
          <span className="!ml-auto hidden sm:block">
            {isOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <Tooltip
        title={isTouchLayout ? undefined : t('settings.title')}
        placement="bottom"
        mouseEnterDelay={0.6}
        open={isTouchLayout ? false : undefined}
      >
        <div
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded hover:bg-neutral-700/80"
          onClick={openModal}
        >
          <Badge dot={isUpdateAvailable} color="blue" offset={[0, 2]}>
            <div className="pt-[3px] text-neutral-300 hover:text-white">
              <SettingsIcon size={16} />
            </div>
          </Badge>
        </div>
      </Tooltip>

      <Modal
        open={isModalOpen}
        width={isTouchLayout ? '100vw' : '80%'}
        centered={!isTouchLayout}
        footer={null}
        destroyOnHidden={true}
        onCancel={closeModal}
        className={isTouchLayout ? 'settings-modal-mobile' : undefined}
        style={
          isTouchLayout
            ? { maxWidth: 'none', margin: 0, paddingBottom: 0, top: 0 }
            : { maxWidth: '1024px' }
        }
        styles={{
          container: {
            padding: 0,
            ...(isTouchLayout ? { height: '100dvh', overflow: 'hidden', borderRadius: 0 } : {})
          },
          body: isTouchLayout ? { height: '100%' } : undefined
        }}
      >
        <div
          className={clsx(
            'outline outline-1 outline-neutral-700',
            isTouchLayout
              ? 'flex h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden rounded-none'
              : 'flex h-[82.5vh] max-h-[710px] rounded-lg'
          )}
        >
          <div
            className={clsx(
              isTouchLayout
                ? 'shrink-0 border-b border-neutral-700 bg-neutral-900/95 pt-[env(safe-area-inset-top)]'
                : 'flex h-full max-w-[260px] flex-col space-y-0.5 rounded-l-lg bg-neutral-800/90 px-1 sm:w-1/5 md:w-1/4 md:px-2'
            )}
          >
            <div
              className={clsx(
                isTouchLayout
                  ? 'flex min-h-11 items-center px-3 pr-12 text-base'
                  : 'hidden px-3 pt-10 text-xl sm:block'
              )}
            >
              {t('settings.title')}
            </div>
            {!isTouchLayout && <div className="h-10 sm:h-5" />}
            <div
              className={clsx(
                isTouchLayout
                  ? 'grid grid-cols-5 gap-1 px-1 pb-2'
                  : 'flex min-h-0 flex-1 flex-col space-y-0.5 overflow-y-auto pb-3'
              )}
            >
              {tabs.map((tab) => (
                <Fragment key={tab.id}>
                  {renderTab(tab)}
                  {/* desktop: the subpages sit under their group; touch: they get their own row */}
                  {!isTouchLayout &&
                    openGroups.includes(tab.id) &&
                    tab.children?.map((child) => renderTab(child, true))}
                </Fragment>
              ))}
            </div>
            {isTouchLayout && currentGroup && (
              <div className="flex flex-wrap gap-1 border-0 border-t border-solid border-neutral-700 px-2 py-2">
                {currentGroup.children?.map((child) => renderTab(child, true))}
              </div>
            )}
          </div>

          <ScrollArea
            viewportRef={scrollViewportRef}
            className={clsx(
              'w-full max-w-full overflow-x-hidden bg-settings-panel [&_[data-slot=scroll-area-scrollbar]]:w-1.5 [&_[data-slot=scroll-area-scrollbar]]:p-0 [&_[data-slot=scroll-area-thumb]]:bg-neutral-500/30 [&_[data-slot=scroll-area-viewport]>div]:!block',
              isTouchLayout
                ? 'box-border min-h-0 flex-1 rounded-none px-4'
                : 'h-full rounded-r-lg px-6'
            )}
          >
            <div className="flex h-full w-full min-w-0 justify-center">
              <div
                className={clsx(
                  'min-w-0',
                  isTouchLayout ? 'w-full max-w-full' : 'w-full max-w-2xl',
                  isTouchLayout ? 'pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4' : 'pb-10 pt-10'
                )}
              >
                <SettingsLoadGroup key={currentTab} slot>
                  {pages.find((tab) => tab.id === currentTab)?.component}
                </SettingsLoadGroup>
              </div>
            </div>
          </ScrollArea>
        </div>
      </Modal>
    </>
  );
};
