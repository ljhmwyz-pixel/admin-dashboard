import {
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React, { useState } from 'react';

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  users: <UserOutlined />,
  products: <ShopOutlined />,
  orders: <FileTextOutlined />,
  analytics: <BarChartOutlined />,
  marketing: <TeamOutlined />,
  content: <AppstoreOutlined />,
  system: <SettingOutlined />,
  appstore: <AppstoreOutlined />,
  team: <TeamOutlined />,
  user: <UserOutlined />,
};
import { AntLayout, AntMenu } from '../antd-imports';
import { AntAvatar } from '../antd-imports';

import './Sidebar.css';

// 侧边栏菜单项类型定义
export interface SidebarMenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: SidebarMenuItem[];
  path?: string;
}

// 侧边栏组件属性
export interface SidebarProps {
  /** 菜单数据 */
  menuItems?: SidebarMenuItem[];
  /** 默认展开的菜单项 */
  defaultOpenKeys?: string[];
  /** 默认选中的菜单项 */
  defaultSelectedKeys?: string[];
  /** 当前选中的菜单项 */
  selectedKeys?: string[];
  /** 侧边栏主题 */
  theme?: 'light' | 'dark';
  /** 侧边栏宽度 */
  width?: number;
  /** 是否折叠 */
  collapsed?: boolean;
  /** 折叠状态改变回调 */
  onCollapse?: (collapsed: boolean) => void;
  /** 菜单项点击回调 */
  onItemClick?: (item: SidebarMenuItem, key: string) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 侧边栏导航组件
 * 基于 Ant Design Layout.Sider 和 Menu 组件封装
 */
const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  defaultOpenKeys = [],
  defaultSelectedKeys = [],
  selectedKeys,
  theme = 'dark',
  width = 256,
  collapsed = false,
  onCollapse,
  onItemClick,
  className = '',
}) => {
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);
  const [currentSelectedKeys, setCurrentSelectedKeys] = useState<string[]>(defaultSelectedKeys);

  // 默认菜单数据
  const defaultMenuItems: SidebarMenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
      path: '/dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      path: '/users',
    },
    {
      key: 'products',
      icon: <ShopOutlined />,
      label: '商品管理',
      children: [
        {
          key: 'product-list',
          label: '商品列表',
          path: '/products/list',
        },
        {
          key: 'product-category',
          label: '商品分类',
          path: '/products/category',
        },
        {
          key: 'product-brand',
          label: '品牌管理',
          path: '/products/brand',
        },
      ],
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: '订单管理',
      path: '/orders',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
      path: '/analytics',
    },
    {
      key: 'marketing',
      icon: <TeamOutlined />,
      label: '营销管理',
      children: [
        {
          key: 'campaigns',
          label: '活动管理',
          path: '/marketing/campaigns',
        },
        {
          key: 'coupons',
          label: '优惠券',
          path: '/marketing/coupons',
        },
      ],
    },
    {
      key: 'content',
      icon: <AppstoreOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'articles',
          label: '文章管理',
          path: '/content/articles',
        },
        {
          key: 'banners',
          label: '横幅管理',
          path: '/content/banners',
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'settings-basic',
          label: '基本设置',
          path: '/system/basic',
        },
        {
          key: 'settings-security',
          label: '安全设置',
          path: '/system/security',
        },
        {
          key: 'settings-notification',
          label: '通知设置',
          path: '/system/notification',
        },
      ],
    },
  ];

  const items = menuItems || defaultMenuItems;

  // 转换菜单数据格式
  const convertMenuItems = (items: SidebarMenuItem[]): MenuProps['items'] => {
    return items.map((item) => ({
      key: item.key,
      icon: typeof item.icon === 'string' ? iconMap[item.icon] || undefined : item.icon,
      label: item.label,
      children: item.children ? convertMenuItems(item.children) : undefined,
    }));
  };

  // 处理手动折叠切换
  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    onCollapse?.(newCollapsed);
  };

  // 构建菜单项，根据折叠状态添加特殊项
  const buildMenuItems = (): MenuProps['items'] => {
    const baseItems = convertMenuItems(items) || [];

    if (collapsed) {
      // 收拢状态下，在顶部添加logo和展开按钮
      return [
        {
          key: 'logo-trigger',
          icon: <div className="sidebar-logo-mini">PY</div>,
          label: '',
          onClick: () => {},
        },
        {
          key: 'expand-trigger',
          icon: <MenuUnfoldOutlined />,
          label: '',
          onClick: handleToggleCollapse,
        },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  // 处理菜单项点击
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const findMenuItem = (items: SidebarMenuItem[], key: string): SidebarMenuItem | undefined => {
      for (const item of items) {
        if (item.key === key) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, key);
          if (found) return found;
        }
      }

      return undefined;
    };

    const menuItem = findMenuItem(items, key);
    if (menuItem) {
      setCurrentSelectedKeys([key]);
      onItemClick?.(menuItem, key);
    }
  };

  // 处理子菜单展开/收起
  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <AntLayout.Sider
      style={{ height: '100vh' }}
      className={`custom-sidebar ${className}`}
      theme={theme}
      width={collapsed ? 80 : width}
      collapsed={false} // 手动控制，禁用默认折叠
      collapsible={false}
    >
      <div className="custom-sidebar-header">
        <div className="custom-sidebar-logo">
          {collapsed ? (
            <div className="logo-collapsed">PYLONTECH</div>
          ) : (
            <div className="logo-expanded">
              <h2>PYLONTECH</h2>
              <p>管理后台</p>
            </div>
          )}
        </div>
        <button className="sidebar-collapse-btn" onClick={handleToggleCollapse}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <AntMenu
        className="custom-sidebar-menu"
        mode="inline"
        theme={theme}
        selectedKeys={selectedKeys || currentSelectedKeys}
        openKeys={openKeys}
        items={buildMenuItems()}
        onClick={(info) => {
          // 特殊处理展开按钮点击
          if (info.key === 'expand-trigger' || info.key === 'logo-trigger') {
            if (info.key === 'expand-trigger') {
              handleToggleCollapse();
            }

            return;
          }
          // 正常菜单项处理
          handleMenuClick(info);
        }}
        onOpenChange={handleOpenChange}
        inlineCollapsed={false}
        inlineIndent={24}
      />

      {/* 用户信息区域 */}
      <div className={`user-info ${collapsed ? 'collapsed' : ''}`}>
        <div className="user-info-content">
          <AntAvatar size={32} style={{ backgroundColor: '#1890ff' }}>
            L
          </AntAvatar>
          {!collapsed && (
            <div className="user-info-text">
              <div className="user-name">Leyu.song</div>
              <div className="user-role">Admin</div>
            </div>
          )}
        </div>
      </div>
    </AntLayout.Sider>
  );
};

export default Sidebar;
