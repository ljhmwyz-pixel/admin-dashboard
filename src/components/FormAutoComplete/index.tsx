import React from 'react';
import { AntAutoComplete, AntForm } from '@shared/components';
import type { AutoCompleteProps, FormItemProps } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomAutoCompleteProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  autoCompleteProps?: AutoCompleteProps;
  className?: string;
}

const CustomAutoComplete: React.FC<CustomAutoCompleteProps> = ({
  label,
  prefixIcon,
  autoCompleteProps,
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
      <AntAutoComplete
        {...autoCompleteProps}
        placeholder={autoCompleteProps?.disabled ? '' : autoCompleteProps?.placeholder}
        className={classNames(
          styles.input,
          autoCompleteProps?.className,
          autoCompleteProps?.disabled && styles.disabledStyle,
        )}
      />
    </AntForm.Item>
  );
};

export default CustomAutoComplete;
