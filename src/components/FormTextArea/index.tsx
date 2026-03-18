import React from 'react';
import { AntForm, AntInput } from '@shared/components';
import type { FormItemProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomTextAreaProps extends Omit<FormItemProps, 'children' | 'label'> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  inputProps?: TextAreaProps;
  className?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
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
      <AntInput.TextArea
        autoSize={{ minRows: 3, maxRows: 6 }}
        {...inputProps}
        placeholder={inputProps?.disabled ? '' : inputProps?.placeholder}
        className={`
              ${styles.input}
              ${inputProps?.className || ''}
              ${inputProps?.disabled ? styles.disabledStyle : ''}
            `}
      />
    </AntForm.Item>
  );
};

export default CustomTextArea;
