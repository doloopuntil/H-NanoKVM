import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/vm.ts';
import { attempt, toast } from '@/lib/feedback.ts';
import { protocolUrl } from '@/lib/protocol-url.ts';

// the server restarts to go back, as it did to switch
const REDIRECT_DELAY_SECONDS = 12;

// After the protocol was switched, the server waits for a signed-in browser to keep the new
// address, and goes back to the previous protocol when nobody does.
export const TlsConfirm = () => {
  const { t } = useTranslation();

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isReverting, setIsReverting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  // a new certificate, not a protocol: reverting swaps it back and the page stays
  const [isCertificate, setIsCertificate] = useState(false);

  const protocol = window.location.protocol === 'https:' ? 'HTTPS' : 'HTTP';

  useEffect(() => {
    attempt(() => api.getTlsPending(), { quiet: true }).then((rsp) => {
      if (rsp?.data?.pending) {
        setIsCertificate(!!rsp.data.certificate);
        setSecondsLeft(rsp.data.secondsLeft);
      }
    });
  }, []);

  useEffect(() => {
    if (secondsLeft === null || isReverting) return;
    if (secondsLeft <= 0) {
      goBack();
      return;
    }

    const timer = window.setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isReverting]);

  // the server reverts by itself at zero; the browser follows to the previous address
  function goBack() {
    if (isCertificate) {
      setSecondsLeft(null);
      toast.info(t('settings.network.tls.certReverted'));
      return;
    }

    setIsReverting(true);
    window.setTimeout(() => {
      window.location.assign(protocolUrl(protocol !== 'HTTPS'));
    }, REDIRECT_DELAY_SECONDS * 1000);
  }

  async function keep() {
    if (isBusy) return;
    setIsBusy(true);

    const rsp = await attempt(() => api.confirmTls());
    if (rsp) setSecondsLeft(null);
    setIsBusy(false);
  }

  async function revert() {
    if (isBusy) return;
    setIsBusy(true);

    const rsp = await attempt(() => api.revertTls());
    if (rsp) goBack();
    setIsBusy(false);
  }

  return (
    <Modal
      open={secondsLeft !== null}
      centered
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      title={
        isReverting
          ? null
          : t(
              isCertificate ? 'settings.network.tls.certTitle' : 'settings.network.tls.confirmTitle'
            )
      }
      footer={
        isReverting ? null : (
          <>
            <Button disabled={isBusy} onClick={revert}>
              {t('settings.network.tls.confirmRevert')}
            </Button>
            <Button type="primary" loading={isBusy} onClick={keep}>
              {t('settings.network.tls.confirmKeep')}
            </Button>
          </>
        )
      }
    >
      <p className="m-0">
        {isReverting
          ? t('settings.network.tls.reverting', { seconds: REDIRECT_DELAY_SECONDS })
          : isCertificate
            ? t('settings.network.tls.certDesc', { seconds: secondsLeft })
            : t('settings.network.tls.confirmDesc', { protocol, seconds: secondsLeft })}
      </p>
    </Modal>
  );
};
