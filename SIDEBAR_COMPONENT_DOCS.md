# 侧边栏导航组件使用文档

## 组件概述

Sidebar 组件是一个基于 Ant Design Layout.Sider 和 Menu 封装的专业侧边栏导航组件，提供了丰富的功能和自定义选项。

## 基本用法

```typescript
import { Sidebar } from './components/lib';

const MyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Layout>
      <Sidebar 
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <Layout style={{ marginLeft: collapsed ? 80 : 256 }}>
        <Content>主要内容区域</Content>
      </Layout>
    </Layout>
  );
};
```

## Props 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| menuItems | SidebarMenuItem[] | 内置菜单 | 自定义菜单数据 |
| defaultOpenKeys | string[] | [] | 默认展开的菜单项 |
| defaultSelectedKeys | string[] | [] | 默认选中的菜单项 |
| selectedKeys | string[] | - | 当前选中的菜单项 |
| theme | 'light' \| 'dark' | 'dark' | 侧边栏主题 |
| width | number | 256 | 侧边栏宽度 |
| collapsed | boolean | false | 是否折叠 |
| onCollapse | (collapsed: boolean) => void | - | 折叠状态改变回调 |
| onItemClick | (item: SidebarMenuItem, key: string) => void | - | 菜单项点击回调 |
| className | string | '' | 自定义类名 |

## 菜单项数据结构

```typescript
interface SidebarMenuItem {
  key: string;           // 唯一标识符
  icon?: React.ReactNode; // 图标
  label: string;         // 显示文本
  children?: SidebarMenuItem[]; // 子菜单
  path?: string;         // 路由路径
}
```

## 使用示例

### 1. 基础侧边栏

```typescript
<Sidebar />
```

### 2. 自定义菜单

```typescript
const customMenuItems = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
    path: '/home'
  },
  {
    key: 'products',
    icon: <ShopOutlined />,
    label: '产品管理',
    children: [
      {
        key: 'product-list',
        label: '产品列表',
        path: '/products/list'
      },
      {
        key: 'product-add',
        label: '添加产品',
        path: '/products/add'
      }
    ]
  }
];

<Sidebar menuItems={customMenuItems} />
```

### 3. 带状态控制的完整布局

```typescript
import React, { useState } from 'react';
import { Layout, Sidebar, Button } from './components/lib';

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const handleMenuClick = (item, key) => {
    console.log('菜单点击:', item, key);
    setSelectedKey(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedKeys={[selectedKey]}
        onItemClick={handleMenuClick}
      />
      
      <Layout style={{ marginLeft: collapsed ? 80 : 256 }}>
        <Layout.Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1>管理后台</h1>
          <Button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '展开' : '收起'}
          </Button>
        </Layout.Header>
        
        <Layout.Content style={{ padding: '24px' }}>
          {/* 页面内容 */}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
```

## 内置菜单项

组件内置了常用的管理后台菜单项：

- 仪表板 (Dashboard)
- 用户管理 (Users)
- 商品管理 (Products) - 包含子菜单
- 订单管理 (Orders)
- 数据分析 (Analytics)
- 营销管理 (Marketing) - 包含子菜单
- 内容管理 (Content) - 包含子菜单
- 系统设置 (System) - 包含子菜单

## 样式定制

### 主题切换

```typescript
// 暗色主题（默认）
<Sidebar theme="dark" />

// 亮色主题
<Sidebar theme="light" />
```

### 自定义宽度

```typescript
<Sidebar width={200} />  // 窄一些的侧边栏
<Sidebar width={300} />  // 宽一些的侧边栏
```

### CSS 变量定制

```css
:root {
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);
  --sidebar-hover-bg: rgba(255, 255, 255, 0.1);
  --sidebar-selected-bg: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}
```

## 响应式支持

组件自动适配移动端设备，在小屏幕下会自动调整为固定定位的抽屉式菜单。

## 事件处理

### 菜单点击事件

```typescript
const handleItemClick = (item, key) => {
  console.log('点击的菜单项:', item);
  console.log('菜单项key:', key);
  // 可以在这里处理路由跳转
  navigate(item.path);
};

<Sidebar onItemClick={handleItemClick} />
```

### 折叠状态变化

```typescript
const handleCollapse = (collapsed) => {
  console.log('侧边栏状态:', collapsed ? '已折叠' : '已展开');
  // 可以保存状态到 localStorage
  localStorage.setItem('sidebarCollapsed', collapsed.toString());
};

<Sidebar onCollapse={handleCollapse} />
```

## 性能优化

- 使用 React.memo 优化渲染
- 虚拟滚动支持大量菜单项
- CSS 动画优化用户体验
- 懒加载子菜单内容

## 注意事项

1. 侧边栏宽度变化时需要同步调整主内容区域的 marginLeft
2. 在移动端使用时建议配合抽屉组件
3. 菜单项的 key 必须唯一
4. 嵌套层级建议不超过 3 层以保证用户体验

## 常见问题

**Q: 如何动态加载菜单数据？**
A: 可以通过 useEffect 获取菜单数据后设置 menuItems 属性

**Q: 如何保持菜单展开状态？**
A: 使用 localStorage 或 sessionStorage 保存 openKeys 状态

**Q: 如何高亮当前路由对应的菜单项？**
A: 根据当前路由路径设置 selectedKeys 属性

**Q: 如何禁用某些菜单项？**
A: 在菜单数据中添加 disabled: true 属性