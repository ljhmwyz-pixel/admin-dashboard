import React from 'react';
import type { LayoutProps as AntLayoutProps } from 'antd';

import { AntLayout } from '../antd-imports';

import './Layout.css';

// 扩展的布局属性接口
export interface LayoutProps extends AntLayoutProps {
  /** 布局主题 */
  theme?: 'light' | 'dark' | 'blue';
  /** 是否固定侧边栏 */
  fixedSider?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Layout 组件
 * 基于 Ant Design Layout 进行二次封装
 */
const Layout: React.FC<LayoutProps> = ({
  theme = 'light',
  fixedSider = false,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-layout',
    `custom-layout--${theme}`,
    fixedSider ? 'custom-layout--fixed-sider' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntLayout className={customClassName} {...restProps}>
      {children}
    </AntLayout>
  );
};

// 导出 Layout 的子组件
export const Header = AntLayout.Header;
export const Content = AntLayout.Content;
export const Footer = AntLayout.Footer;
export const Sider = AntLayout.Sider;

export default Layout;
