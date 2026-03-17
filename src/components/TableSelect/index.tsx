import React from 'react';
import { AntSelect } from '@shared/components';
import type { SelectProps } from 'antd';

import { ImageIcons } from '@/components';

import styles from './index.module.scss';

interface TableSelectProps extends SelectProps {
  className?: string;
}

const TableSelect: React.FC<TableSelectProps> = ({
  className,
  style,
  disabled,
  mode,
  ...selectProps
}) => {
  return (
    <AntSelect
      maxTagCount="responsive"
      getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      style={style}
      {...selectProps}
      className={`
              ${styles.input}
              ${className || ''}
              ${disabled ? styles.disabledStyle : ''}
              ${mode === 'multiple' ? styles.multiSelect : ''}
              ${mode === 'multiple' && disabled ? styles.multiSelectDisabledStyle : ''}
            `}
      suffixIcon={<img src={ImageIcons.form.arrowDefaultIcon} width={14} height={14} />}
      removeIcon={<img src={ImageIcons.form.tagRemoveIcon} width={12} height={12} />}
    />
  );
};

export default TableSelect;
