import type { InputNumberProps } from 'antd';

// Values sit at the right edge of a settings row (layout rule 8).

// className for a multiple select: its tags flush right. antd names no part for the empty
// slot after the last tag, so this stays one set of classes rather than a styles prop.
export const rightAlignedTags =
  'pr-1.75 [&_.ant-select-content]:mr-0 [&_.ant-select-content]:justify-end [&_.ant-select-content-item-suffix]:-ml-1 [&_.ant-select-placeholder]:text-right';

// styles for an InputNumber
export const rightAlignedNumber: InputNumberProps['styles'] = {
  input: { textAlign: 'right' }
};
