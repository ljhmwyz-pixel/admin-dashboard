import React from 'react';
import { AntTabs } from '@shared/components';
import type { TabsProps } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomTabsProps extends TabsProps {
  variant?: 'default' | 'card';
}

const CustomTabs: React.FC<CustomTabsProps> = ({ className, variant = 'default', ...rest }) => {
  return (
    <AntTabs
      {...rest}
      className={classNames(styles.wrapper, styles[variant], className)}
      classNames={{ indicator: styles.indicator }}
    />
  );
};

export default CustomTabs;
