import React from 'react';
import { AntSegmented } from '@shared/components';
import type { SegmentedProps } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

export interface OptionItem {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface Props extends Omit<SegmentedProps, 'options'> {
  options: OptionItem[];
  className?: string;
}

const Segmented: React.FC<Props> = ({ options, className, ...rest }) => {
  const formattedOptions = options.map((item) => ({
    label: (
      <span className={styles.label}>
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        {item.label}
      </span>
    ),
    value: item.value,
    disabled: item.disabled,
  }));

  return (
    <AntSegmented
      {...rest}
      options={formattedOptions}
      className={classNames(styles.segmented, className)}
    />
  );
};

export default Segmented;
