import { ChangeEvent, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import type { InputRef } from 'antd';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { Eye, EyeClosed, NetworkIcon, Pencil, SendIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { deleteWolMac, getWolMacs, setWolMacName, wol } from '@/api/network.ts';
import { attempt } from '@/lib/feedback.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import { MenuItem } from '@/components/menu-item.tsx';
import { MenuHeader } from '@/components/menu-rows.tsx';

interface MacItem {
  name: string;
  mac: string;
  isShow: boolean;
  isName: boolean;
  isEdit: boolean;
}

export const Wol = () => {
  const { t } = useTranslation();

  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [log, setLog] = useState('');

  const [macList, setMacList] = useState<MacItem[]>([]);

  const inputRef = useRef<InputRef>(null);

  function handleOpenChange(open: boolean) {
    if (open) {
      getMacs();
      setIsKeyboardEnable(false);
    } else {
      setInput('');
      setStatus('');
      setLog('');
      setIsKeyboardEnable(true);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function getMacs() {
    attempt(() => getWolMacs()).then((rsp) => {
      if (!rsp) return;

      const isEdit = false;
      const macList = rsp.data.macs
        .map((item: string) => item.trim())
        .filter((item: string) => item !== '')
        .map((item: string) => {
          const separator = item.search(/\s/);
          const mac = separator === -1 ? item : item.slice(0, separator);
          const name = separator === -1 ? '' : item.slice(separator).trim();
          const isName = name !== '';
          const isShow = !isName;
          return { name, mac, isShow, isName, isEdit };
        });

      setMacList(macList);
    });
  }

  function toggleShow(mac: string) {
    setMacList((list) =>
      list.map((item) => (item.mac === mac ? { ...item, isShow: !item.isShow } : item))
    );
  }

  function editMac(mac: string, isEdit: boolean) {
    setMacList((list) =>
      list.map((item) => (item.mac === mac ? { ...item, isEdit: !isEdit } : item))
    );
  }

  async function setMacName(e: React.KeyboardEvent<HTMLInputElement>, mac: string) {
    const value = e.currentTarget.value.trim();
    if (!value) return;

    const rsp = await attempt(() => setWolMacName(mac, value));
    if (!rsp) return;

    getMacs();
  }

  function deleteMac(mac: string) {
    attempt(() => deleteWolMac(mac)).then((rsp) => {
      if (rsp) getMacs();
    });
  }

  function wake(mac?: string) {
    if (status === 'loading') return;

    const value = (mac ? mac : input).trim();
    if (!value) return;

    setStatus('loading');
    setLog(t('wol.sending'));

    wol(value)
      .then((rsp) => {
        if (rsp.code !== 0) {
          setStatus('failed');
          setLog(rsp.msg);
          return;
        }

        setStatus('success');
        setLog(t('wol.sent'));
        getMacs();
        setInput('');
      })
      .catch(() => {
        setStatus('failed');
        setLog(t('auth.error'));
      });
  }

  const content = (
    <div className="min-w-75">
      <MenuHeader title={t('wol.title')} />

      <div className="w-full space-y-1 pb-3">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            placeholder={t('wol.input')}
            onChange={handleChange}
            onPressEnter={() => wake()}
          />
          <Button type="primary" onClick={() => wake()}>
            {t('wol.ok')}
          </Button>
        </div>

        {status && (
          <div
            className={clsx(
              'max-w-75 text-sm wrap-break-word',
              status === 'failed' ? 'text-red-500' : 'text-green-500'
            )}
          >
            {log}
          </div>
        )}
      </div>

      {macList.length > 0 && (
        <div>
          {macList.map((item) => (
            <div
              key={item.mac}
              className="flex w-full items-center justify-between border-b border-white/6 py-3 last:border-b-0"
            >
              <div className="h-6 max-w-50">
                {item.isEdit ? (
                  <Input
                    placeholder={item.mac}
                    onFocus={() => setIsKeyboardEnable(false)}
                    onBlur={() => setIsKeyboardEnable(true)}
                    defaultValue={item.name}
                    onPressEnter={(e) => setMacName(e, item.mac)}
                  />
                ) : item.isShow ? (
                  item.mac
                ) : (
                  item.name
                )}
              </div>

              <div className="flex items-center gap-1">
                {item.isName && (
                  <div
                    className="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-700/80"
                    onClick={() => toggleShow(item.mac)}
                  >
                    {item.isShow ? <EyeClosed size={16} /> : <Eye size={16} />}
                  </div>
                )}
                <div
                  className="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-700"
                  onClick={() => editMac(item.mac, item.isEdit)}
                >
                  <Pencil size={16} />
                </div>
                <div
                  className="flex size-6 cursor-pointer items-center justify-center rounded-sm text-green-500 hover:bg-neutral-700/80"
                  onClick={() => wake(item.mac)}
                >
                  <SendIcon size={16} />
                </div>
                <div
                  className="flex size-6 cursor-pointer items-center justify-center rounded-sm text-red-500 hover:bg-neutral-700"
                  onClick={() => deleteMac(item.mac)}
                >
                  <Trash2Icon size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MenuItem
      title={t('wol.title')}
      icon={<NetworkIcon size={18} />}
      content={content}
      onOpenChange={handleOpenChange}
    />
  );
};
