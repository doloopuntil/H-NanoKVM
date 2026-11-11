import type { ButtonProps } from 'antd';

// The OK button of a Popconfirm that does something to the host or deletes something is red.
// Its shadow is as strong as the blue one of the Popconfirms of the Settings pages: antd's red
// one is a third of that, so the red button looked flat next to the others.
export const confirmOkProps: ButtonProps = {
  danger: true,
  style: { boxShadow: '0 2px 0 rgba(238, 38, 56, 0.31)' }
};
