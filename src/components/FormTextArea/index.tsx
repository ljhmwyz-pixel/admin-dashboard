import React from 'react';
import type { FormItemProps } from 'antd';
import { Form, Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomTextAreaProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  inputProps?: TextAreaProps;
  className?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  prefixIcon,
  inputProps,
  className,
  ...formItemProps
}) => {
  return (
    <Form.Item
      label={
        <div className={styles.label}>
          {prefixIcon ? prefixIcon : null}
          <span>{label}</span>
        </div>
      }
      {...formItemProps}
      className={classNames(styles.wrapper, className)}
    >
      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 6 }}
        {...inputProps}
        className={`
              ${styles.input}
              ${inputProps?.className || ''}
              ${inputProps?.disabled ? styles.disabledStyle : ''}
            `}
      />
    </Form.Item>
  );
};

export default CustomTextArea;
