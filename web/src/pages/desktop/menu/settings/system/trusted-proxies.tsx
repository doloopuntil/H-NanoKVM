import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import * as totpApi from '@/api/auth-totp.ts';
import * as api from '@/api/vm.ts';
import { encrypt } from '@/lib/encrypt.ts';
import { attempt } from '@/lib/feedback.ts';
import { useSettingsLoad } from '@/hooks/useSettingsLoad.ts';
import { LabelTip } from '@/components/label-tip.tsx';
import { InfoRow, SettingRow } from '@/components/setting-rows.tsx';

type DialogProps = {
  open: boolean;
  proxies: string[];
  onClose: () => void;
  onSaved: (proxies: string[]) => void;
};

// A listed address chooses the client address that the login limit and the log record, so the
// change asks for the password, and for a code when the account has a second factor. The parent
// gives it a new key at every opening, which is what starts it from the saved list again.
const TrustedProxiesDialog = ({ open, proxies, onClose, onSaved }: DialogProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(proxies);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    attempt(() => totpApi.getStatus(), { quiet: true }).then((rsp) => {
      setTotpEnabled(!!rsp?.data?.enabled);
    });
  }, []);

  const unchanged = draft.join() === proxies.join();

  async function submit() {
    setSaving(true);
    const rsp = await attempt(() =>
      api.setTrustedProxies(draft, encrypt(password), code.trim() || undefined)
    );
    setSaving(false);
    if (!rsp) return;

    onSaved(rsp.data?.proxies ?? draft);
    onClose();
  }

  return (
    <Modal
      centered
      open={open}
      title={t('settings.network.trustedProxies.editTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      okButtonProps={{
        disabled: unchanged || !password || (totpEnabled && !code),
        loading: saving
      }}
      onOk={submit}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-4 py-2">
        <span className="text-sm text-neutral-400">
          {t('settings.network.trustedProxies.dialogDescription')}
        </span>
        <Select
          mode="tags"
          open={false}
          tokenSeparators={[',', ' ']}
          value={draft}
          placeholder="10.0.0.1"
          suffixIcon={null}
          onChange={setDraft}
        />
        <Input.Password
          value={password}
          placeholder={t('settings.account.password')}
          onChange={(e) => setPassword(e.target.value)}
        />
        {totpEnabled && (
          <Input
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t('auth.totp.placeholderCode')}
            onChange={(e) => setCode(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
};

export const TrustedProxies = () => {
  const { t } = useTranslation();
  const [proxies, setProxies] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [openings, setOpenings] = useState(0);

  const isReady = useSettingsLoad(api.getTrustedProxies, (rsp) => {
    setProxies(rsp.data?.proxies ?? []);
  });

  return (
    <>
      <InfoRow
        label={
          <LabelTip
            text={t('settings.network.trustedProxies.title')}
            tip={t('settings.network.trustedProxies.tip')}
            warning
          />
        }
        description={t('settings.network.trustedProxies.description')}
        value={
          <span className="block max-w-32 sm:max-w-56">
            {proxies.length > 0 ? proxies.join(', ') : t('settings.network.trustedProxies.none')}
          </span>
        }
      />

      <SettingRow
        label={t('settings.network.trustedProxies.editRow')}
        description={t('settings.network.trustedProxies.editDescription')}
        inline
      >
        <Button
          disabled={!isReady}
          onClick={() => {
            setOpenings((count) => count + 1);
            setOpen(true);
          }}
        >
          {t('settings.network.trustedProxies.edit')}
        </Button>
      </SettingRow>

      {openings > 0 && (
        <TrustedProxiesDialog
          key={openings}
          open={open}
          proxies={proxies}
          onClose={() => setOpen(false)}
          onSaved={setProxies}
        />
      )}
    </>
  );
};
