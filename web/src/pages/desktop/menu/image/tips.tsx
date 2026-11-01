import { useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, Modal } from 'antd';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Tips = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'USB',
      children: (
        <ul className="my-2 list-decimal pl-10">
          <li>{t('image.tips.usb1')}</li>
          <li>{t('image.tips.usb2')}</li>
          <li>{t('image.tips.usb3')}</li>
        </ul>
      )
    },
    {
      key: '2',
      label: 'SCP',
      children: (
        <ul className="my-2 list-decimal pl-10">
          <li>{t('image.tips.scp1')}</li>
          <li>{t('image.tips.scp2')}</li>
          <li>{t('image.tips.scp3')}</li>
        </ul>
      )
    },
    {
      key: '3',
      label: t('image.tips.tfCard'),
      children: (
        <>
          <p className="my-2 pl-5 text-sm text-neutral-400">{t('image.tips.tf1')}</p>
          <ul className="my-2 list-decimal pl-10">
            <li>{t('image.tips.tf2')}</li>
            <li>{t('image.tips.tf3')}</li>
            <li>{t('image.tips.tf4')}</li>
            <li>{t('image.tips.tf5')}</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <>
      <div
        className="flex cursor-pointer items-center space-x-1 text-neutral-500 hover:text-blue-500"
        onClick={() => setIsModalOpen(true)}
      >
        <CircleQuestionMarkIcon size={16} />
      </div>

      <Modal
        title={t('image.tips.title')}
        open={isModalOpen}
        footer={null}
        centered
        onCancel={() => setIsModalOpen(false)}
      >
        <Collapse
          accordion
          items={items}
          bordered={false}
          defaultActiveKey={['1']}
          style={{ backgroundColor: 'transparent' }}
        />
      </Modal>
    </>
  );
};
