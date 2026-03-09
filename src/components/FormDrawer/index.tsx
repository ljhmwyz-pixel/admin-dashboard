import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(60);

  useEffect(() => {
    const body = contentRef.current?.closest('.ant-drawer-body') as HTMLElement;
    if (!body) return;

    const checkOverflow = () => {
      const isOverflow = body.scrollHeight > body.clientHeight;

      setFooterHeight((prev) => {
        const next = isOverflow ? 30 : 60;
        return prev === next ? prev : next;
      });
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(body);

    return () => observer.disconnect();
  }, [children]);

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
      footer={
        rest.footer ? (
          <div className={styles.footer} style={{ height: footerHeight }}>
            {rest.footer}
          </div>
        ) : null
      }
    >
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </Drawer>
  );
};

export default AppDrawer;
