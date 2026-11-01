import { Tooltip } from 'antd';
import { useAtom } from 'jotai';
import { CircleQuestionMarkIcon, RatioIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { updateScreen } from '@/api/vm';
import { Resolution as TypeResolution } from '@/types';
import { attempt } from '@/lib/feedback.ts';
import { setResolution as setCookie } from '@/lib/localstorage';
import { resolutionAtom } from '@/jotai/screen.ts';
import { MenuOption } from '@/components/menu-rows.tsx';
import { MenuSubmenu } from '@/components/menu-submenu.tsx';

const resolutions: TypeResolution[] = [
  { width: 0, height: 0 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
  { width: 800, height: 600 },
  { width: 640, height: 480 }
];

export const Resolution = () => {
  const { t } = useTranslation();
  const [resolution, setResolution] = useAtom(resolutionAtom);

  async function update(item: TypeResolution) {
    const rsp = await attempt(() => updateScreen('resolution', item.height));
    if (!rsp) return;

    setResolution(item);
    setCookie(item);
  }

  const content = (
    <>
      {resolutions.map((res) => (
        <MenuOption
          key={res.height}
          selected={res.height === resolution?.height}
          onClick={() => update(res)}
        >
          {res.height === 0 ? (
            <div className="flex items-center justify-between gap-2">
              <span>{t('screen.auto')}</span>
              <Tooltip
                title={t('screen.autoTips')}
                placement="right"
                styles={{ container: { width: '300px' } }}
              >
                <CircleQuestionMarkIcon size={16} />
              </Tooltip>
            </div>
          ) : (
            <>
              <span>{res.width}</span>
              <span className="px-1">x</span>
              <span>{res.height}</span>
            </>
          )}
        </MenuOption>
      ))}
    </>
  );

  return (
    <MenuSubmenu icon={<RatioIcon size={16} />} label={t('screen.resolution')} content={content} />
  );
};
