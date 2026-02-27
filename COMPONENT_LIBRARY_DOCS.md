# 组件库使用文档

## 项目概述

这是一个基于 Ant Design 的自定义组件库，采用二次封装的方式，提供了更丰富的主题选项和自定义功能，同时保持了 Ant Design 的核心特性。

## 目录结构

```
src/components/lib/
├── index.ts              # 统一导出入口
├── antd-imports.ts       # Ant Design 组件统一导入
├── button/
│   ├── Button.tsx        # 自定义按钮组件
│   └── Button.css        # 按钮样式
├── form/
│   ├── Form.tsx          # 自定义表单组件
│   ├── Input.tsx         # 自定义输入框组件
│   ├── Select.tsx        # 自定义选择器组件
│   ├── Form.css          # 表单样式
│   ├── Input.css         # 输入框样式
│   └── Select.css        # 选择器样式
└── layout/
    ├── Card.tsx          # 自定义卡片组件
    ├── Layout.tsx        # 自定义布局组件
    ├── Card.css          # 卡片样式
    └── Layout.css        # 布局样式
```

## 安装和使用

### 基本导入

```typescript
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  Form,
  Input,
  Select,
  Card,
  Layout
} from './components/lib';
```

### 使用示例

#### 按钮组件

```typescript
// 基础按钮
<Button>默认按钮</Button>

// 主题按钮
<PrimaryButton>主要按钮</PrimaryButton>
<SuccessButton>成功按钮</SuccessButton>
<WarningButton>警告按钮</WarningButton>
<DangerButton>危险按钮</DangerButton>

// 不同尺寸
<Button size="small">小按钮</Button>
<Button size="middle">中按钮</Button>
<Button size="large">大按钮</Button>

// 特殊样式
<Button rounded>圆角按钮</Button>
<Button block>块级按钮</Button>
```

#### 表单组件

```typescript
import { Form, Input, Select } from './components/lib';
import { Form as AntForm } from 'antd';

const { useForm } = AntForm;
const { Option } = Select;

const MyForm = () => {
  const [form] = useForm();
  
  return (
    <Form form={form} onFinish={handleSubmit}>
      <AntForm.Item label="用户名" name="username">
        <Input placeholder="请输入用户名" theme="filled" />
      </AntForm.Item>
      
      <AntForm.Item label="状态" name="status">
        <Select placeholder="请选择状态" theme="filled">
          <Option value="active">活跃</Option>
          <Option value="inactive">非活跃</Option>
        </Select>
      </AntForm.Item>
    </Form>
  );
};
```

#### 布局组件

```typescript
import { Layout, Card } from './components/lib';

const MyLayout = () => (
  <Layout theme="light">
    <Layout.Header>头部</Layout.Header>
    <Layout.Content>
      <Card title="卡片标题" theme="shadow" hoverable>
        卡片内容
      </Card>
    </Layout.Content>
  </Layout>
);
```

## 组件特性

### Button 组件

**Props:**
- `theme`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'small' | 'middle' | 'large'
- `rounded`: boolean (是否圆角)
- `block`: boolean (是否块级)
- 支持所有 Ant Design Button 的原生属性

**主题样式:**
- 渐变背景色
- 悬停动画效果
- 点击波纹效果
- 响应式设计

### Form 组件

**Props:**
- `theme`: 'default' | 'compact' | 'card'
- `animated`: boolean (是否启用动画)
- 支持所有 Ant Design Form 的原生属性

### Input 组件

**Props:**
- `theme`: 'default' | 'underlined' | 'filled'
- `bordered`: boolean
- `prefixIcon`: ReactNode (前缀图标)
- `suffixIcon`: ReactNode (后缀图标)
- 支持所有 Ant Design Input 的原生属性

### Select 组件

**Props:**
- `theme`: 'default' | 'borderless' | 'filled'
- `showSearch`: boolean
- 支持所有 Ant Design Select 的原生属性

### Card 组件

**Props:**
- `theme`: 'default' | 'shadow' | 'bordered' | 'gradient'
- `hoverable`: boolean
- 支持所有 Ant Design Card 的原生属性

### Layout 组件

**Props:**
- `theme`: 'light' | 'dark' | 'blue'
- `fixedSider`: boolean
- 支持所有 Ant Design Layout 的原生属性

## 开发规范

### 代码组织原则

1. **统一导入**: 所有 Ant Design 组件通过 `antd-imports.ts` 统一管理
2. **二次封装**: 在原始组件基础上扩展功能，而非完全重写
3. **样式隔离**: 使用 CSS Modules 或 BEM 命名规范
4. **类型安全**: 完整的 TypeScript 类型定义

### 添加新组件步骤

1. 在对应目录下创建组件文件
2. 创建对应的 CSS 样式文件
3. 在 `index.ts` 中导出组件
4. 更新文档说明

### 主题定制

组件库支持通过 CSS 变量进行主题定制：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --danger-color: #ff4d4f;
}
```

## 性能优化

- 使用 React.memo 优化组件渲染
- 合理使用 CSS 动画和过渡效果
- 按需加载组件和样式
- 避免不必要的重渲染

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 版本信息

当前版本: 1.0.0

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License