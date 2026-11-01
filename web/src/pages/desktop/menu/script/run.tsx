import { useEffect, useState } from 'react';
import { Card, Modal, Spin } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/script';
import { DialogAction } from '@/components/dialog-parts.tsx';

type RunProps = {
  script: string;
  setIsRunning: (isRunning: boolean) => void;
};

export const Run = ({ script, setIsRunning }: RunProps) => {
  const { t } = useTranslation();
  const [state, setState] = useState('');
  const [log, setLog] = useState('');

  useEffect(() => {
    setState('running');

    api
      .runScript(script, 'foreground')
      .then((rsp) => {
        if (rsp.code !== 0) {
          setLog(rsp.msg);
          setState('failed');
          return;
        }

        setState('success');
        setLog(rsp.data.log);
      })
      .catch(() => {
        setLog(t('script.runFailed'));
        setState('failed');
      });
  }, []);

  return (
    <Modal title={script} width={600} centered closable={false} footer={null} open={true}>
      {state === 'running' ? (
        <div className="flex h-[300px] items-center justify-center">
          <Spin indicator={<LoaderCircleIcon size="1em" className="animate-spin" />} size="large" />
        </div>
      ) : (
        <Card className="h-[600px] overflow-auto font-mono whitespace-pre-line">{log}</Card>
      )}

      <DialogAction onClick={() => setIsRunning(false)}>{t('script.close')}</DialogAction>
    </Modal>
  );
};
