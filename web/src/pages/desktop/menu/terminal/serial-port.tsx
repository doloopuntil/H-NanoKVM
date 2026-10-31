import { ChangeEvent, useState } from 'react';
import { Input, InputNumber, Modal, Radio, RadioChangeEvent, Select } from 'antd';
import { useSetAtom } from 'jotai';
import { SquareTerminalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import { DialogAction } from '@/components/dialog-parts.tsx';
import { MenuRow } from '@/components/menu-rows.tsx';
import { SettingRow } from '@/components/setting-rows.tsx';

export const SerialPort = () => {
  const { t } = useTranslation();
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [port, setPort] = useState('');
  const [baudrate, setBaudrate] = useState(115200);
  const [parity, setParity] = useState<string>('none');
  const [flowControl, setFlowControl] = useState<string>('none');
  const [dataBits, setDataBits] = useState(8);
  const [stopBits, setStopBits] = useState(1);

  function openModal() {
    setIsKeyboardEnable(false);

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsKeyboardEnable(true);
    setIsModalOpen(false);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setPort(e.target.value);
  }

  function handleRadioChange(e: RadioChangeEvent) {
    setPort(e.target.value);
  }

  function onInputNumberChange(value: number | null) {
    if (value === null) return;
    setBaudrate(value);
  }

  function submit() {
    if (!port || !baudrate) {
      closeModal();
      return;
    }

    setIsModalOpen(false);
    window.open(
      `/#terminal?port=${port}&baud=${baudrate}&parity=${parity}&flowControl=${flowControl}&dataBits=${dataBits}&stopBits=${stopBits}`,
      '_blank'
    );
  }

  return (
    <>
      <MenuRow icon={<SquareTerminalIcon size={16} />} onClick={openModal}>
        {t('terminal.serial')}
      </MenuRow>

      <Modal
        open={isModalOpen}
        centered
        width={420}
        title={t('terminal.serial')}
        footer={null}
        onCancel={closeModal}
      >
        <div className="flex flex-col space-y-6 pt-2">
          <SettingRow label={t('terminal.serialPort')} inline>
            <Input
              className="w-56 text-right"
              value={port}
              placeholder={t('terminal.serialPortPlaceholder')}
              onChange={handleInputChange}
            />
          </SettingRow>

          <div className="-mt-3 flex justify-end">
            <Radio.Group value={port} onChange={handleRadioChange}>
              <Radio value="/dev/ttyS1">
                <code>/dev/ttyS1</code>
              </Radio>
              <Radio value="/dev/ttyS2">
                <code>/dev/ttyS2</code>
              </Radio>
            </Radio.Group>
          </div>

          <SettingRow label={t('terminal.baudrate')} inline>
            <InputNumber
              className="w-32 [&_.ant-input-number-input]:!text-right"
              controls={false}
              min={1}
              value={baudrate}
              onChange={onInputNumberChange}
            />
          </SettingRow>

          <SettingRow label={t('terminal.parity')} inline>
            <Select
              className="w-32 text-right"
              value={parity}
              onChange={setParity}
              options={[
                { label: t('terminal.parityNone'), value: 'none' },
                { label: t('terminal.parityEven'), value: 'even' },
                { label: t('terminal.parityOdd'), value: 'odd' }
              ]}
            />
          </SettingRow>

          <SettingRow label={t('terminal.flowControl')} inline>
            <Select
              className="w-32 text-right"
              value={flowControl}
              onChange={setFlowControl}
              options={[
                { label: t('terminal.flowControlNone'), value: 'none' },
                { label: t('terminal.flowControlSoft'), value: 'soft' },
                { label: t('terminal.flowControlHard'), value: 'hard' }
              ]}
            />
          </SettingRow>

          <SettingRow label={t('terminal.dataBits')} inline>
            <Select
              className="w-32 text-right"
              value={dataBits}
              onChange={setDataBits}
              options={[
                { label: '5', value: 5 },
                { label: '6', value: 6 },
                { label: '7', value: 7 },
                { label: '8', value: 8 }
              ]}
            />
          </SettingRow>

          <SettingRow label={t('terminal.stopBits')} inline>
            <Select
              className="w-32 text-right"
              value={stopBits}
              onChange={setStopBits}
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 }
              ]}
            />
          </SettingRow>
        </div>

        <DialogAction onClick={submit}>{t('terminal.open')}</DialogAction>
      </Modal>
    </>
  );
};
