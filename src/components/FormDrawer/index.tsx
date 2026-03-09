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
  const [isOverflow, setIsOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    const el = contentRef.current;
    if (!el) return;

    setIsOverflow(el.scrollHeight > el.clientHeight);
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

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
          <div className={classNames(styles.footer, isOverflow && styles.footerOverflow)}>
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
