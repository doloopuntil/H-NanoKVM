import { useEffect, type ReactNode } from 'react';
import { Button, Input } from 'antd';
import { useSetAtom } from 'jotai';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';
import { MenuHeader } from '@/components/menu-rows.tsx';
import { SettingRow } from '@/components/setting-rows.tsx';

type SidebarModelConfigProps = {
  apiBase: string;
  apiKey: string;
  isSaving: boolean;
  // a key is already stored: the key field may stay empty
  keySet: boolean;
  modelIdentifier: string;
  modelName?: string;
  onApiBaseChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onModelIdentifierChange: (value: string) => void;
  onSave: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
};

// A field with the label and typography of a setting row, but with the input under the label:
// the sidebar is too narrow to hold a model name or an URL beside it.
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <span className="text-sm text-neutral-300">{label}</span>
    {children}
  </div>
);

export const SidebarModelConfig = ({
  apiBase,
  apiKey,
  isSaving,
  keySet,
  modelIdentifier,
  modelName,
  onApiBaseChange,
  onApiKeyChange,
  onModelIdentifierChange,
  onSave,
  onCancel,
  showCancel = false
}: SidebarModelConfigProps) => {
  const { t } = useTranslation();
  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

  useEffect(() => {
    setIsKeyboardEnable(false);
    return () => {
      setIsKeyboardEnable(true);
    };
  }, [setIsKeyboardEnable]);

  return (
    <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-5 pt-5 pb-8">
      <div>
        {/* opened to change the model (it has a Cancel) or because none is set up yet */}
        <MenuHeader
          title={t(showCancel ? 'picoclaw.model.menuLabel' : 'picoclaw.model.requiredTitle')}
        />
        {!showCancel && (
          <div className="-mt-2 text-xs leading-5 text-neutral-500">
            {t('picoclaw.model.requiredDescription')}
            {modelName && <span className="ml-1 text-neutral-400">{modelName}</span>}
          </div>
        )}
      </div>

      <SettingRow
        label={t('picoclaw.model.docsTitle')}
        description={t('picoclaw.model.docsDesc')}
        inline
      >
        <Button
          href="https://docs.picoclaw.io/docs/configuration/model-list/#supported-vendors-and-protocols"
          target="_blank"
          rel="noreferrer"
          aria-label={t('picoclaw.model.docsTitle')}
          icon={<ExternalLinkIcon size={16} />}
        />
      </SettingRow>

      <Field label={t('picoclaw.model.modelIdentifier')}>
        <Input
          placeholder={t('picoclaw.model.modelIdentifierPlaceholder')}
          value={modelIdentifier}
          onChange={(e) => onModelIdentifierChange(e.target.value)}
        />
      </Field>
      <Field label={t('picoclaw.model.apiKey')}>
        <Input.Password
          placeholder={t(
            keySet ? 'picoclaw.model.apiKeyKeepPlaceholder' : 'picoclaw.model.apiKeyPlaceholder'
          )}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
      </Field>
      <Field label={t('picoclaw.model.apiBase')}>
        <Input
          placeholder={t('picoclaw.model.apiBasePlaceholder')}
          value={apiBase}
          onChange={(e) => onApiBaseChange(e.target.value)}
        />
      </Field>

      <div className="flex justify-end gap-2">
        {showCancel && <Button onClick={onCancel}>{t('picoclaw.cancel')}</Button>}
        <Button loading={isSaving} onClick={() => void onSave()} type="primary">
          {t(isSaving ? 'picoclaw.model.saving' : 'picoclaw.model.save')}
        </Button>
      </div>
    </div>
  );
};
