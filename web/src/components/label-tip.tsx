import { Tooltip } from 'antd';
import { CircleAlertIcon, CircleQuestionMarkIcon } from 'lucide-react';

type LabelTipProps = {
  text: string;
  tip: string;
  // an orange alert icon for what a setting costs or risks, a grey help icon otherwise
  warning?: boolean;
};

// A label with its tooltip, for the secondary explanation of a setting.
export const LabelTip = ({ text, tip, warning = false }: LabelTipProps) => (
  <span className="inline-flex items-center gap-1.5">
    {text}
    <Tooltip title={tip} placement="top" styles={{ root: { maxWidth: '400px' } }}>
      {warning ? (
        <CircleAlertIcon size={16} className="cursor-pointer text-orange-400" />
      ) : (
        <CircleQuestionMarkIcon size={16} className="cursor-pointer text-neutral-500" />
      )}
    </Tooltip>
  </span>
);
