import type { ButtonProps } from 'antd';

// The Yes button of the power menu confirmations is red, because it does something to the host.
// Its shadow is as strong as the blue one of the Popconfirms of the Settings pages: antd's red
// one is a third of that, so the red button looked flat next to the others.
export const confirmOkProps: ButtonProps = {
  danger: true,
  style: { boxShadow: '0 2px 0 rgba(238, 38, 56, 0.31)' }
};
