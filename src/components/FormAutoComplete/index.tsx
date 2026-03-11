import React from 'react';
import type { AutoCompleteProps, FormItemProps } from 'antd';
import { AutoComplete, Form } from 'antd';
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
      <AutoComplete
        {...autoCompleteProps}
        className={classNames(
          styles.input,
          autoCompleteProps?.className,
          autoCompleteProps?.disabled && styles.disabledStyle,
        )}
      />
    </Form.Item>
  );
};

export default CustomAutoComplete;
