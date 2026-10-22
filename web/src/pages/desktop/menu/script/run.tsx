import { useEffect, useState } from 'react';
import { Card, Modal, Spin } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/script';
import { DialogAction } from '@/components/dialog-parts.tsx';

type RunProps = {
  script: string;
  ticket: string;
  setIsRunning: (isRunning: boolean) => void;
};

export const Run = ({ script, ticket, setIsRunning }: RunProps) => {
  const { t } = useTranslation();
  const [state, setState] = useState('running');
  const [log, setLog] = useState('');

  useEffect(() => {
    api
      .runScript(script, 'foreground', ticket)
      .then((rsp) => {
        if (rsp.code !== 0) {
          setLog(rsp.msg);
          setState('failed');
          return;
        }

        setState('success');
        setLog(rsp.data.log);
      })
      .catch((err) => {
        setLog(err?.response?.data?.msg || t('script.runFailed'));
        setState('failed');
      });
    // runs the script once, when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={script} width={600} centered closable={false} footer={null} open={true}>
      {state === 'running' ? (
        <div className="flex h-75 items-center justify-center">
          <Spin indicator={<LoaderCircleIcon size="1em" className="animate-spin" />} size="large" />
        </div>
      ) : (
        <Card className="h-150 overflow-auto font-mono whitespace-pre-line">{log}</Card>
      )}

      <DialogAction onClick={() => setIsRunning(false)}>{t('script.close')}</DialogAction>
    </Modal>
  );
};
