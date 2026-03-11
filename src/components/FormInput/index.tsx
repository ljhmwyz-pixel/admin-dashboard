import React from 'react';
import { AntForm, AntInput } from '@shared/components';
import type { FormItemProps, InputProps } from 'antd';
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
      <AntInput
        autoComplete="off"
        {...inputProps}
        className={`
              ${styles.input}
              ${inputProps?.className || ''}
              ${inputProps?.disabled ? styles.disabledStyle : ''}
            `}
      />
    </AntForm.Item>
  );
};

export default CustomInput;
