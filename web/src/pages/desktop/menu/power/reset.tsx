import { Popconfirm } from 'antd';
import { RotateCcwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { setGpio } from '@/api/vm.ts';
import { attempt } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { MenuRow } from '@/components/menu-rows.tsx';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

type ResetProps = {
  showConfirm: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const Reset = ({ showConfirm, isLoading, setIsLoading }: ResetProps) => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  function reset() {
    if (isLoading) return;
    setIsLoading(true);

    attempt(() => setGpio('reset', 800)).finally(() => {
      setIsLoading(false);
    });
  }

  const row = (
    <MenuRow icon={<RotateCcwIcon size={16} />} onClick={showConfirm ? undefined : reset}>
      {t('power.reset')}
    </MenuRow>
  );

  if (!showConfirm) return row;

  return (
    <Popconfirm
      placement="bottomLeft"
      title={t('power.resetConfirm')}
      okText={t('power.okBtn')}
      cancelText={t('power.cancelBtn')}
      okButtonProps={confirmOkProps}
      color={popconfirmColor}
      onConfirm={reset}
    >
      {row}
    </Popconfirm>
  );
};
