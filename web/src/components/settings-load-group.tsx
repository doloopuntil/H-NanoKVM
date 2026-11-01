import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { Alert, Button } from 'antd';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LoadGroupContext, type LoadStatus } from '@/hooks/useSettingsLoad.ts';

const LOADING_BANNER_DELAY_MS = 600;

// The banners of a group that shows them elsewhere, see `slot` and LoadBanner.
const LoadBannerContext = createContext<ReactNode>(null);

// Where a group with a slot shows its banners; a page header puts it below itself.
export const LoadBanner = () => useContext(LoadBannerContext);

// Shows loading and failure banners for the useSettingsLoad calls below it. With `slot` it hands
// them to a LoadBanner instead of putting them above its children.
export const SettingsLoadGroup = ({
  children,
  slot = false
}: {
  children: ReactNode;
  slot?: boolean;
}) => {
  const { t } = useTranslation();

  const [statuses, setStatuses] = useState<Record<string, LoadStatus>>({});
  const [generation, setGeneration] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  const report = useCallback((id: string, status: LoadStatus | null) => {
    setStatuses((prev) => {
      if (status === null) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return prev[id] === status ? prev : { ...prev, [id]: status };
    });
  }, []);

  const values = Object.values(statuses);
  const isLoading = values.includes('loading');
  const isFailed = values.includes('failed');

  // fast loads finish before the banner would flash
  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false);
      return;
    }

    const timer = setTimeout(() => setShowLoading(true), LOADING_BANNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const value = useMemo(() => ({ generation, report }), [generation, report]);

  const banner = (
    <>
      {isLoading && showLoading && (
        <Alert
          className="mb-6"
          type="info"
          showIcon
          icon={<LoaderCircleIcon className="animate-spin" size={16} />}
          title={t('common.loading')}
        />
      )}

      {!isLoading && isFailed && (
        <Alert
          className="mb-6"
          type="warning"
          showIcon
          title={t('common.loadFailed')}
          action={
            <Button size="small" onClick={() => setGeneration((value) => value + 1)}>
              {t('common.retry')}
            </Button>
          }
        />
      )}
    </>
  );

  return (
    <LoadGroupContext.Provider value={value}>
      <LoadBannerContext.Provider value={slot ? banner : null}>
        {!slot && banner}

        {children}
      </LoadBannerContext.Provider>
    </LoadGroupContext.Provider>
  );
};
