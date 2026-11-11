import { ChangeEvent, useRef, useState } from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import clsx from 'clsx';
import {
  ChevronRightIcon,
  FastForwardIcon,
  FileJsonIcon,
  PlayIcon,
  Trash2Icon,
  UploadIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/script.ts';
import { attempt, confirm } from '@/lib/feedback.ts';
import { usePopconfirmColor } from '@/hooks/usePopconfirmColor.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';
import { confirmOkProps } from '@/components/popconfirm-ok.ts';

import { Run } from './run';
import { Unlock } from './unlock';

// What the unlock dialog is for: a run, or the replacement of a script that exists. A new
// script needs no password, only running one does.
type Pending = { kind: 'upload'; file: File } | { kind: 'run'; type: string; script: string };

const SCRIPT_DIRECTORY = '/etc/kvm/scripts';

export const Script = () => {
  const { t } = useTranslation();
  const popconfirmColor = usePopconfirmColor();

  const [scripts, setScripts] = useState<string[]>([]);
  // added or replaced since the user last ran them
  const [unapproved, setUnapproved] = useState<string[]>([]);
  const [currentScript, setCurrentScript] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runTicket, setRunTicket] = useState('');
  const [runName, setRunName] = useState('');
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
    const file = e.target.files[0];
    // replacing a script needs the password; adding a new one does not
    if (scripts.includes(file.name)) {
      setPending({ kind: 'upload', file });
    } else {
      upload(file);
    }
  }

  function upload(file: File, ticket?: string) {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    attempt(() => api.uploadScript(formData, ticket))
      .then((rsp) => {
        if (!rsp) return;

        if (!scripts.includes(rsp.data.file)) {
          setScripts([...scripts, rsp.data.file]);
          setUnapproved((list) => [...list, rsp.data.file]);
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  function runScript(type: string) {
    const script = currentScript;
    if (!script) return;

    if (!unapproved.includes(script)) {
      setPending({ kind: 'run', type, script });
      return;
    }

    // new, or replaced since the last run: anyone with the session could have uploaded it
    confirm({
      danger: true,
      title: t('script.unreviewedTitle'),
      content: (
        <div className="space-y-1">
          <p>{t('script.unreviewedDesc')}</p>
          <Typography.Text code>{`cat ${SCRIPT_DIRECTORY}/${script}`}</Typography.Text>
        </div>
      ),
      okText: t('script.run'),
      onOk: () => setPending({ kind: 'run', type, script })
    });
  }

  function unlocked(ticket: string) {
    const action = pending;
    setPending(null);
    if (!action) return;

    if (action.kind === 'upload') {
      upload(action.file, ticket);
      return;
    }

    // the server notes that the script has been run
    setUnapproved((list) => list.filter((name) => name !== action.script));

    if (action.type === 'foreground') {
      setRunName(action.script);
      setRunTicket(ticket);
      setIsRunning(true);
    } else {
      attempt(() => api.runScript(action.script, action.type, ticket));
    }
  }

  function getScripts() {
    attempt(() => api.getScripts()).then((rsp) => {
      if (!rsp) return;

      if (rsp.data?.files?.length > 0) {
        setScripts(rsp.data.files);
      }
      setUnapproved(rsp.data?.unapproved ?? []);
    });
  }

  function deleteScript(name: string) {
    attempt(() => api.deleteScript(name)).then((rsp) => {
      if (!rsp) return;

      setScripts((list) => list.filter((script) => script !== name));
      setUnapproved((list) => list.filter((script) => script !== name));
    });
  }

  function activate(script: string) {
    setCurrentScript(script === currentScript ? '' : script);
  }

  // `close` takes the menu away before a dialog opens over it.
  const content = (close: () => void) => (
    <div className="min-w-62.5">
      <MenuHeader title={t('script.title')}>
        <input
          ref={inputRef}
          type="file"
          accept=".sh,.py"
          className="hidden"
          onChange={(e) => {
            uploadFile(e);
            close();
          }}
        />
        <Button
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
              <Button
                type="primary"
                size="small"
                icon={<PlayIcon size={16} />}
                onClick={() => {
                  runScript('foreground');
                  close();
                }}
              >
                {t('script.run')}
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<FastForwardIcon size={16} />}
                onClick={() => {
                  runScript('background');
                  close();
                }}
              >
                {t('script.runBackground')}
              </Button>

              <Popconfirm
                color={popconfirmColor}
                placement="bottomRight"
                title={t('script.delDesc')}
                okText={t('script.delete')}
                cancelText={t('common.cancel')}
                okButtonProps={confirmOkProps}
                onConfirm={() => deleteScript(script)}
              >
                <Button danger size="small" icon={<Trash2Icon size={16} />}>
                  {t('script.delete')}
                </Button>
              </Popconfirm>
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
      {isRunning && <Run script={runName} ticket={runTicket} setIsRunning={setIsRunning} />}
    </>
  );
};
