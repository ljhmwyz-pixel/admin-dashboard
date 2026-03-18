import React from 'react';
import { AntForm, AntSelect } from '@shared/components';
import type { FormItemProps, SelectProps } from 'antd';
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
    <AntForm.Item
      label={
        <div className={styles.label}>
          {prefixIcon ? prefixIcon : null}
          <span>{label}</span>
        </div>
      }
      {...formItemProps}
      className={classNames(styles.wrapper, className)}
    >
      <AntSelect
        maxTagCount="responsive"
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        {...selectProps}
        placeholder={selectProps?.disabled ? '' : selectProps?.placeholder}
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
    </AntForm.Item>
  );
};

export default CustomSelect;
