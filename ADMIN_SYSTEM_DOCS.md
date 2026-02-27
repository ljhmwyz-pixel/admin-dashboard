# 管理后台系统使用文档

## 系统概述

这是一个基于 React + Ant Design + TypeScript 构建的现代化管理后台系统，包含完整的组件库和页面布局。

## 系统架构

```
src/
├── components/
│   ├── lib/                    # 组件库
│   │   ├── button/            # 按钮组件
│   │   ├── form/              # 表单组件
│   │   ├── layout/            # 布局组件
│   │   ├── navigation/        # 导航组件
│   │   ├── index.ts          # 统一导出
│   │   └── antd-imports.ts   # Ant Design 统一导入
│   ├── AdminLayout.tsx       # 管理后台布局
│   ├── Dashboard.tsx         # 仪表板页面
│   └── ComponentDemo.tsx     # 组件演示页面
├── store/                    # Redux 状态管理
├── hooks/                    # 自定义 Hooks
└── App.tsx                  # 应用入口
```

## 核心功能

### 1. 布局系统

**AdminLayout 组件** 提供完整的管理后台布局：

```typescript
import { AdminLayout } from './components/lib';

const MyApp = () => (
  <AdminLayout pageTitle="我的页面">
    <div>页面内容</div>
  </AdminLayout>
);
```

**特性：**
- 可折叠侧边栏
- 响应式设计
- 顶部导航栏
- 底部信息栏
- 平滑动画效果

### 2. 侧边栏导航

**Sidebar 组件** 提供专业的导航菜单：

```typescript
import { Sidebar } from './components/lib';

<Sidebar 
  collapsed={false}
  onCollapse={(collapsed) => console.log(collapsed)}
  selectedKeys={['dashboard']}
/>
```

**内置菜单项：**
- 仪表板
- 用户管理
- 商品管理（含子菜单）
- 订单管理
- 数据分析
- 营销管理（含子菜单）
- 内容管理（含子菜单）
- 系统设置（含子菜单）

### 3. 组件库

#### 按钮组件
```typescript
import { 
  Button, 
  PrimaryButton, 
  SuccessButton,
  WarningButton,
  DangerButton
} from './components/lib';

<PrimaryButton>主要按钮</PrimaryButton>
<Button size="large" rounded>大圆角按钮</Button>
```

#### 表单组件
```typescript
import { Form, Input, Select } from './components/lib';

<Form>
  <Input placeholder="请输入内容" theme="filled" />
  <Select placeholder="请选择">
    <Select.Option value="1">选项1</Select.Option>
  </Select>
</Form>
```

#### 布局组件
```typescript
import { Card, Layout } from './components/lib';

<Card title="卡片标题" theme="shadow" hoverable>
  卡片内容
</Card>
```

## 页面开发指南

### 创建新页面

1. **创建页面组件**
```typescript
// src/pages/UserManagement.tsx
import React from 'react';
import { Card } from '../components/lib';

const UserManagement: React.FC = () => {
  return (
    <div>
      <Card title="用户管理">
        <p>用户管理内容</p>
      </Card>
    </div>
  );
};

export default UserManagement;
```

2. **在路由中使用**
```typescript
// App.tsx
import UserManagement from './pages/UserManagement';

<AdminLayout pageTitle="用户管理">
  <UserManagement />
</AdminLayout>
```

### 状态管理

使用 Redux 进行全局状态管理：

```typescript
// hooks/redux.ts
import { useAppSelector, useAppDispatch } from './hooks/redux';

const MyComponent = () => {
  const loading = useAppSelector(state => state.loading.globalLoading);
  const dispatch = useAppDispatch();
  
  // 使用 dispatch 触发 action
};
```

## 样式定制

### 主题切换
```typescript
// 暗色主题（默认）
<Sidebar theme="dark" />

// 亮色主题
<Sidebar theme="light" />
```

### 自定义 CSS 变量
```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --danger-color: #ff4d4f;
}
```

## 响应式设计

系统支持以下断点：
- **桌面端**: ≥ 1200px
- **平板端**: 768px - 1199px
- **手机端**: < 768px

## 性能优化

1. **按需加载**: 组件库采用按需导入
2. **代码分割**: 使用 React.lazy 进行动态导入
3. **缓存策略**: 合理使用 useMemo 和 useCallback
4. **虚拟滚动**: 大数据列表使用虚拟滚动

## 开发规范

### 代码组织
```
组件目录结构：
ComponentName/
├── ComponentName.tsx      # 组件实现
├── ComponentName.css      # 组件样式
└── index.ts              # 导出文件（如需要）
```

### 命名规范
- 组件名：大驼峰命名法（PascalCase）
- 文件名：与组件名一致
- CSS 类名：BEM 命名规范
- 变量名：小驼峰命名法（camelCase）

### TypeScript 规范
- 完整的类型定义
- 接口使用 `I` 前缀（可选）
- 泛型参数使用描述性名称

## 部署说明

### 构建项目
```bash
pnpm build
```

### 本地预览
```bash
pnpm preview
```

### 环境变量
创建 `.env` 文件：
```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=管理后台
```

## 常见问题

**Q: 如何添加新的菜单项？**
A: 修改 Sidebar 组件中的 defaultMenuItems 数组

**Q: 如何自定义主题颜色？**
A: 修改 CSS 变量或在组件中传入 theme 属性

**Q: 如何处理权限控制？**
A: 在路由层面或组件层面添加权限判断逻辑

**Q: 如何集成第三方图表库？**
A: 在 Dashboard 组件的 chart-placeholder 区域集成 ECharts 或 Recharts

## 技术栈

- **框架**: React 18
- **UI库**: Ant Design 5
- **状态管理**: Redux Toolkit
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: CSS Modules + PostCSS
- **图标**: Ant Design Icons

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 版本信息

当前版本: 1.0.0
最后更新: 2024年

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request