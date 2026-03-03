import React from 'react';
import type { FormItemProps } from 'antd';
import { Form, Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomTextAreaProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  inputProps?: TextAreaProps;
  className?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  required,
  prefixIcon,
  inputProps,
  className,
  ...formItemProps
}) => {
  return (
    <Form.Item
      {...formItemProps}
      required={required}
      className={classNames(styles.wrapper, className)}
    >
      <div className={styles.container}>
        {label && (
          <div className={styles.label}>
            {prefixIcon}
            <span>
              {label}
              {required && !inputProps?.disabled && <span className={styles.required}>*</span>}
            </span>
          </div>
        )}
        <Form.Item {...formItemProps} noStyle>
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
      </div>
    </Form.Item>
  );
};

export default CustomTextArea;
