import React from 'react';
import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import classNames from 'classnames';

import { ImageIcons } from '@/components/ImageIcons';

import styles from './index.module.scss';

interface AppDrawerProps extends DrawerProps {
  headerExtra?: React.ReactNode;
}

const AppDrawer: React.FC<AppDrawerProps> = ({
  className,
  title,
  closeIcon,
  children,
  ...rest
}) => {
  return (
    <Drawer
      {...rest}
      className={classNames(styles.drawer, className)}
      title={
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
      }
      closeIcon={closeIcon ?? <img src={ImageIcons.form.drawerCloseIcon} width={18} height={18} />}
    >
      <div className={styles.content}>{children}</div>
    </Drawer>
  );
};

export default AppDrawer;
