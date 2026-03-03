import React from 'react';
import { ConfigProvider, Form, Input } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { InputProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

// @ts-expect-error 暂时忽略
interface CustomInputProps extends Omit<FormItemProps, 'children' | 'label'>, InputProps {
  label: React.ReactNode;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  inputProps?: InputProps;
}
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  prefixIcon = '',
  className,
  inputProps,
  ...formItemRest
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorError: '#F45858',
        },
        components: {
          Input: {
            colorTextPlaceholder: '#191B1F66',
          },
        },
      }}
    >
      <Form.Item
        name={formItemRest.name}
        rules={formItemRest.rules}
        validateFirst
        className={classNames(styles.wrapper, className)}
        {...formItemRest}
      >
        <div className={styles.container}>
          <div className={styles.label}>
            {prefixIcon && prefixIcon}
            <span>
              {label}
              {required && <span className={styles.required}>*</span>}
            </span>
          </div>

          <Input.TextArea
            className={styles.input}
            placeholder={formItemRest.placeholder}
            {...inputProps}
          />
        </div>
      </Form.Item>
    </ConfigProvider>
  );
};

export default CustomInput;
