import React from 'react';
import type { MenuProps } from 'antd';
import { Layout } from 'antd';

import SiderFooter from '../../layouts/SiderFooter';
import SiderHeader from '../../layouts/SiderHeader';
import SiderMenu from '../../layouts/SiderMenu';

const { Sider } = Layout;

interface SidebarTemplateProps {
  /** 菜单数据 */
  menuItems: MenuProps['items'];
  /** 当前选中的菜单项 */
  selectedKeys: string[];
  /** 当前展开的菜单项 */
  openKeys: string[];
  /** 菜单选中回调 */
  onMenuSelect: (info: any) => void;
  /** 菜单展开回调 */
  onOpenChange: (keys: string[]) => void;
  /** 侧边栏折叠状态 */
  collapsed: boolean;
  /** 折叠状态改变回调 */
  onCollapse: (collapsed: boolean) => void;
  /** 自定义类名 */
  className?: string;
  /** Logo URL */
  logo?: string;
  /** 应用标题 */
  title?: string;
}

/**
 * 侧边栏模板组件
 * 包含完整的侧边导航栏结构
 */
const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  menuItems: _menuItems,
  selectedKeys: _selectedKeys,
  openKeys: _openKeys,
  onMenuSelect: _onMenuSelect,
  onOpenChange: _onOpenChange,
  collapsed,
  onCollapse,
  className = '',
  logo: _logo,
  title: _title = '管理系统',
}) => {
  return (
    <Sider
      className={`sidebar-template ${className}`}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={256}
      collapsedWidth={80}
      theme="light"
    >
      <SiderHeader collapsed={collapsed} onToggle={() => onCollapse(!collapsed)} />

      <SiderMenu collapsed={collapsed} />

      <SiderFooter collapsed={collapsed} />
    </Sider>
  );
};

export default SidebarTemplate;
