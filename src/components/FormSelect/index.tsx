import React from 'react';
import type { FormItemProps } from 'antd';
import type { SelectProps } from 'antd';
import { Form, Select } from 'antd';
import classNames from 'classnames';

import { ImageIcons } from '@/components';

import styles from './index.module.scss';

interface CustomSelectProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  selectProps?: SelectProps;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  required,
  prefixIcon,
  selectProps,
  className,
  ...formItemProps
}) => {
  const isRequired =
    required ||
    formItemProps.rules?.some(
      (rule) => typeof rule === 'object' && 'required' in rule && rule.required,
    );

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
              {isRequired && !selectProps?.disabled && <span className={styles.required}>*</span>}
            </span>
          </div>
        )}
        <Form.Item {...formItemProps} noStyle>
          <Select
            {...selectProps}
            className={`
              ${styles.input}
              ${selectProps?.className || ''}
              ${selectProps?.disabled ? styles.disabledStyle : ''}
            `}
            suffixIcon={<img src={ImageIcons.form.arrowDefaultIcon} width={14} height={14} />}
          />
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default CustomSelect;
