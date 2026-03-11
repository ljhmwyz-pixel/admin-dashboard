import React, { useEffect, useRef, useState } from 'react';
import { AntDrawer } from '@shared/components';
import type { DrawerProps } from 'antd';
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
  const [isOverflow, setIsOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    const body = contentRef.current?.closest('.ant-drawer-body') as HTMLElement;
    if (!body) return;

    const hasScrollbar = body.scrollHeight > body.clientHeight + 1;
    setIsOverflow(hasScrollbar);
  };

  useEffect(() => {
    if (!rest.open) return;

    // 等 Drawer 动画 + DOM 渲染完成
    const timer = setTimeout(checkOverflow, 50);

    return () => clearTimeout(timer);
  }, [rest.open]);

  return (
    <AntDrawer
      open={rest.open}
      {...rest}
      className={classNames(styles.drawer, className)}
      title={
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
      }
      closeIcon={closeIcon ?? <img src={ImageIcons.form.drawerCloseIcon} width={18} height={18} />}
      footer={
        rest.footer ? (
          <div
            className={classNames(styles.footer, {
              [styles.footerOverflow]: isOverflow,
            })}
          >
            {rest.footer}
          </div>
        ) : null
      }
    >
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </AntDrawer>
  );
};

export default AppDrawer;
