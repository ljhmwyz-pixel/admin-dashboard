import React from 'react';
import type { DrawerProps as AntDrawerProps } from 'antd';

import { AntDrawer } from '../antd-imports';

// 扩展的抽屉属性接口
export interface DrawerProps extends AntDrawerProps {
  /** 抽屉主题风格 */
  theme?: 'default' | 'dark' | 'light';
  /** 是否启用动画效果 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Drawer 组件
 * 基于 Ant Design Drawer 进行二次封装
 * 提供更多主题和动画选项
 */
const Drawer: React.FC<DrawerProps> = ({
  theme = 'default',
  animated = true,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-drawer',
    `custom-drawer--${theme}`,
    animated ? 'custom-drawer--animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntDrawer className={customClassName} {...restProps}>
      {children}
    </AntDrawer>
  );
};

export default Drawer;
