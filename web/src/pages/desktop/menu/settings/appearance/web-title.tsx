import { useState } from 'react';
import { Input } from 'antd';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { HNANOKVM_NAME } from '@/lib/hnanokvm.ts';
import { webTitleAtom } from '@/jotai/settings.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { SettingRow } from '@/components/setting-rows.tsx';

export const WebTitle = () => {
  const { t } = useTranslation();
  const [webTitle, setWebTitle] = useAtom(webTitleAtom);

  const [isLoading, setIsLoading] = useState(false);

  const isReady = useSettingsLoad(api.getWebTitle, (rsp) => {
    if (rsp.data?.title) {
      setWebTitle(rsp.data.title);
    }
  });

  function submit() {
    if (isLoading) return;
    setIsLoading(true);

    attempt(() => api.setWebTitle(webTitle)).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <SettingRow
      label={t('settings.appearance.webTitle')}
      description={t('settings.appearance.webTitleDesc')}
      inline
    >
      <Input
        disabled={isLoading || !isReady}
        className="w-36 max-w-full text-right sm:w-48"
        value={webTitle}
        onChange={(e) => setWebTitle(e.target.value)}
        onPressEnter={submit}
        onBlur={submit}
        placeholder={HNANOKVM_NAME}
      />
    </SettingRow>
  );
};
