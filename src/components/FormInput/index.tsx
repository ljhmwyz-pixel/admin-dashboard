import React from 'react';
import { Form, Input } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { InputProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomInputProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  inputProps?: InputProps;
  className?: string;
  formItemProps?: FormItemProps;
}
const CustomInput: React.FC<CustomInputProps> = ({
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
      <Input
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

export default CustomInput;
