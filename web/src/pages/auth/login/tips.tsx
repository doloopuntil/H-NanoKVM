import { useState } from 'react';
import { Button, Card, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

export const Tips = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <span
        className="cursor-pointer text-neutral-300 underline underline-offset-4"
        onClick={showModal}
      >
        {t('auth.forgetPassword')}
      </span>

      <Modal
        title={t('auth.forgetPassword')}
        open={isModalOpen}
        onCancel={hideModal}
        closeIcon={null}
        footer={null}
        centered={true}
      >
        <Card style={{ marginTop: '20px' }}>
          <div className="flex flex-col space-y-5 wrap-break-word">
            <div>{t('auth.tips.hardenedRecovery')}</div>
          </div>
        </Card>

        <div className="flex justify-center pb-3 pt-10">
          <Button type="primary" className="w-24" onClick={hideModal}>
            {t('auth.ok')}
          </Button>
        </div>
      </Modal>
    </>
  );
};
