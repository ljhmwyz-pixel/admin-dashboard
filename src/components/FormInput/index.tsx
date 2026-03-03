import React from 'react';
import { Form, Input } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { InputProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomInputProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  inputProps?: InputProps;
  className?: string;
}
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required,
  prefixIcon,
  inputProps,
  className,
  ...formItemProps
}) => {
  return (
    <Form.Item {...formItemProps} className={classNames(styles.wrapper, className)}>
      <div className={styles.container}>
        <div className={styles.label}>
          {prefixIcon ? prefixIcon : null}
          <span>
            {label}
            {required && !inputProps?.disabled && <span className={styles.required}>*</span>}
          </span>
        </div>
        <Form.Item {...formItemProps} noStyle>
          <Input
            {...inputProps}
            className={`
              ${styles.input}
              ${inputProps?.className || ''}
              ${inputProps?.disabled ? styles.disabledStyle : ''}
            `}
          />
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default CustomInput;
