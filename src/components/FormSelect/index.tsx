import React from 'react';
import type { FormItemProps } from 'antd';
import type { SelectProps } from 'antd';
import { Form, Select } from 'antd';
import classNames from 'classnames';

import { ImageIcons } from '@/components';

import styles from './index.module.scss';

interface CustomSelectProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  selectProps?: SelectProps;
  className?: string;
  formItemProps?: FormItemProps;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  prefixIcon,
  selectProps,
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
      <Select
        maxTagCount="responsive"
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        {...selectProps}
        className={`
              ${styles.input}
              ${selectProps?.className || ''}
              ${selectProps?.disabled ? styles.disabledStyle : ''}
              ${selectProps?.mode === 'multiple' ? styles.multiSelect : ''}
              ${selectProps?.mode === 'multiple' && selectProps?.disabled ? styles.multiSelectDisabledStyle : ''}
            `}
        suffixIcon={<img src={ImageIcons.form.arrowDefaultIcon} width={14} height={14} />}
        removeIcon={<img src={ImageIcons.form.tagRemoveIcon} width={12} height={12} />}
      />
    </Form.Item>
  );
};

export default CustomSelect;
