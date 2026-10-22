import { ChangeEvent, useRef, useState } from 'react';
import { Button } from 'antd';
import clsx from 'clsx';
import { ChevronRightIcon, FileJsonIcon, UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/script.ts';
import { attempt, confirm } from '@/lib/feedback.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

import { Run } from './run';
import { Unlock } from './unlock';

// What the unlock dialog is for. The file is chosen first, inside the click, and the password
// asked after.
type Pending = { kind: 'upload'; file: File } | { kind: 'run'; type: string };

export const Script = () => {
  const { t } = useTranslation();

  const [scripts, setScripts] = useState<string[]>([]);
  const [currentScript, setCurrentScript] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runTicket, setRunTicket] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<any>(null);

  function handleOpenChange(open: boolean) {
    if (open) {
      getScripts();
    } else {
      setCurrentScript('');
    }
  }

  function selectFile() {
    if (inputRef.current) {
      inputRef.current.value = null;
    }

    inputRef.current?.click();
  }

  function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target?.files?.length || isUploading) return;
    setPending({ kind: 'upload', file: e.target.files[0] });
  }

  function upload(file: File, ticket: string) {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    attempt(() => api.uploadScript(formData, ticket))
      .then((rsp) => {
        if (!rsp) return;

        if (!scripts.includes(rsp.data.file)) {
          setScripts([...scripts, rsp.data.file]);
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  function runScript(type: string) {
    if (!currentScript) return;
    setPending({ kind: 'run', type });
  }

  function unlocked(ticket: string) {
    const action = pending;
    setPending(null);
    if (!action) return;

    if (action.kind === 'upload') {
      upload(action.file, ticket);
    } else if (action.type === 'foreground') {
      setRunTicket(ticket);
      setIsRunning(true);
    } else {
      attempt(() => api.runScript(currentScript, action.type, ticket));
    }
  }

  function getScripts() {
    attempt(() => api.getScripts()).then((rsp) => {
      if (!rsp) return;

      if (rsp.data?.files?.length > 0) {
        setScripts(rsp.data.files);
      }
    });
  }

  function deleteScript() {
    if (!currentScript) return;

    attempt(() => api.deleteScript(currentScript)).then((rsp) => {
      if (!rsp) return;

      setScripts(scripts.filter((script) => script !== currentScript));
    });
  }

  function confirmDelete() {
    confirm({
      danger: true,
      title: t('script.delete'),
      content: t('script.delDesc'),
      okText: t('script.delete'),
      onOk: deleteScript
    });
  }

  function activate(script: string) {
    setCurrentScript(script === currentScript ? '' : script);
  }

  const content = (
    <div className="min-w-62.5">
      <MenuHeader title={t('script.title')}>
        <input
          ref={inputRef}
          type="file"
          accept=".sh,.py"
          className="hidden"
          onChange={uploadFile}
        />
        <Button
          ghost
          type="primary"
          size="small"
          icon={<UploadIcon size={16} />}
          loading={isUploading}
          onClick={selectFile}
        >
          {t('script.upload')}
        </Button>
      </MenuHeader>

      {scripts.map((script) => (
        <div
          key={script}
          className={clsx(
            'my-1 cursor-pointer rounded-sm',
            script === currentScript ? 'bg-neutral-700/50' : 'hover:bg-neutral-700/70'
          )}
        >
          <div
            className="flex items-center justify-between gap-5 px-2 py-1.5"
            onClick={() => activate(script)}
          >
            <div className="max-w-75 truncate select-none">{script}</div>
            <div className={clsx('size-4', script === currentScript && 'rotate-90')}>
              <ChevronRightIcon size={16} />
            </div>
          </div>

          {script === currentScript && (
            <div className="flex items-center justify-end gap-2 p-3">
              <Button type="primary" size="small" onClick={() => runScript('foreground')}>
                {t('script.run')}
              </Button>
              <Button type="primary" size="small" onClick={() => runScript('background')}>
                {t('script.runBackground')}
              </Button>

              <Button danger type="primary" size="small" onClick={confirmDelete}>
                {t('script.delete')}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <MenuItem
        title={t('script.title')}
        icon={<FileJsonIcon size={18} />}
        content={content}
        onOpenChange={handleOpenChange}
      />

      {pending && <Unlock onUnlock={unlocked} onCancel={() => setPending(null)} />}
      {isRunning && <Run script={currentScript} ticket={runTicket} setIsRunning={setIsRunning} />}
    </>
  );
};
