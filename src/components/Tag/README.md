# Tag 标签组件使用文档

Tag 组件是一个基于 Ant Design Tag 的二次封装组件，提供预设样式和灵活的自定义能力。

## 📦 基础用法

### 方式 1: 使用 preset 属性（推荐）

最简单的使用方式，直接使用预设的标签样式：

```tsx
import Tag from '@/components/Tag';
import { PRESET_TAGS } from '@/components/Tag/constants';

// 状态类标签
<Tag preset={PRESET_TAGS.NORMAL} />      {/* 正常状态 - 深灰色 */}
<Tag preset={PRESET_TAGS.ACTIVE} />      {/* 激活状态 - 绿色 */}
<Tag preset={PRESET_TAGS.DELETED} />     {/* 已删除 - 红色 */}
<Tag preset={PRESET_TAGS.PENDING} />     {/* 待处理 - 蓝色 */}
<Tag preset={PRESET_TAGS.APPROVED} />    {/* 已通过 - 绿色 */}
<Tag preset={PRESET_TAGS.REJECTED} />    {/* 已拒绝 - 红色 */}
<Tag preset={PRESET_TAGS.SUSPENDED} />   {/* 已暂停 - 橙色 */}
<Tag preset={PRESET_TAGS.WAITING} />     {/* 等待中 - 蓝色 */}
<Tag preset={PRESET_TAGS.DEACTIVATED} /> {/* 已禁用 - 灰色 */}
<Tag preset={PRESET_TAGS.LOCKED} />      {/* 已锁定 - 橙色 */}

// 布尔值标签
<Tag preset={PRESET_TAGS.YES} />         {/* 是 - 绿色，带边框 */}
<Tag preset={PRESET_TAGS.NO} />          {/* 否 - 橙色，带边框 */}

// 操作类标签
<Tag preset={PRESET_TAGS.MODIFY} />      {/* 修改 - 蓝色 */}
<Tag preset={PRESET_TAGS.ADD} />         {/* 添加 - 绿色 */}

// 组织类型标签
<Tag preset={PRESET_TAGS.PYLONTECH} />   {/* 公司 - 青色 */}
<Tag preset={PRESET_TAGS.PERSONAL} />    {/* 个人 - 橙色 */}
<Tag preset={PRESET_TAGS.ORGANIZATION} />{/* 组织 - 蓝色 */}

// 特殊标签
<Tag preset={PRESET_TAGS.PARENT} />      {/* 父级 - 蓝色，带边框 */}
```

### 方式 2: 覆盖预设样式

在预设基础上自定义颜色：

```tsx
// 覆盖颜色和背景色
<Tag 
  preset={PRESET_TAGS.NORMAL} 
  color="#ff0000" 
  backgroundColor="rgba(255,0,0,0.1)" 
/>

// 仅覆盖背景色
<Tag 
  preset={PRESET_TAGS.ACTIVE} 
  backgroundColor="#31C47F1A" 
/>

// 仅覆盖文字颜色
<Tag 
  preset={PRESET_TAGS.DELETED} 
  color="#ff4444" 
/>
```

### 方式 3: 完全自定义

不使用预设，完全自定义样式：

```tsx
<Tag 
  color="#1890FF" 
  backgroundColor="rgba(24,144,255,0.08)"
>
  自定义标签
</Tag>

// 或者使用 style 属性
<Tag 
  style={{ 
    color: '#722ED1',
    background: 'rgba(114,46,209,0.08)',
    borderRadius: '4px'
  }}
>
  自定义样式
</Tag>
```

## 🎨 预设样式列表

### 状态类标签

| 预设常量 | 标签文本 | 文字颜色 | 背景颜色 | 边框 |
|---------|---------|---------|---------|------|
| `PRESET_TAGS.NORMAL` | Normal | #31C47F | #31C47F1A | 无 |
| `PRESET_TAGS.ACTIVE` | Active | #31C47F | #31C47F1A | 无 |
| `PRESET_TAGS.DELETED` | Deleted | #F45858 | #F458581A | 无 |
| `PRESET_TAGS.PENDING` | Pending | #4083C6 | #4083C61A | 无 |
| `PRESET_TAGS.APPROVED` | Approved | #31C47F | #31C47F1A | 无 |
| `PRESET_TAGS.REJECTED` | Rejected | #F45858 | #F458581A | 无 |
| `PRESET_TAGS.SUSPENDED` | Suspended | #F4AA58 | #F4AA581A | 无 |
| `PRESET_TAGS.WAITING` | Waiting | #4083C6 | #4083C61A | 无 |
| `PRESET_TAGS.DEACTIVATED` | Deactivated | #A3A4A6 | #A3A4A61A | 无 |
| `PRESET_TAGS.LOCKED` | Locked | #F4AA58 | #F4AA581A | 无 |

### 布尔值标签（带边框）

| 预设常量 | 标签文本 | 文字颜色 | 背景颜色 | 边框 |
|---------|---------|---------|---------|------|
| `PRESET_TAGS.YES` | Yes | #31C47F | #ffffff | ✅ 1px solid #31C47F |
| `PRESET_TAGS.NO` | No | #F4AA58 | #ffffff | ✅ 1px solid #F4AA58 |

### 操作类标签

| 预设常量 | 标签文本 | 文字颜色 | 背景颜色 | 边框 |
|---------|---------|---------|---------|------|
| `PRESET_TAGS.MODIFY` | Modify | #4083C6 | #4083C61A | 无 |
| `PRESET_TAGS.ADD` | Add | #31C47F | #31C47F1A | 无 |

### 组织类型标签

| 预设常量 | 标签文本 | 文字颜色 | 背景颜色 | 边框 |
|---------|---------|---------|---------|------|
| `PRESET_TAGS.PYLONTECH` | Pylontech | #33C2C8 | #33C2C81A | 无 |
| `PRESET_TAGS.PERSONAL` | Personal | #F4AA58 | #F4AA581A | 无 |
| `PRESET_TAGS.ORGANIZATION` | Organization | #4083C6 | #4083C6 | 无 |

### 特殊标签（带边框）

| 预设常量 | 标签文本 | 文字颜色 | 背景颜色 | 边框 |
|---------|---------|---------|---------|------|
| `PRESET_TAGS.PARENT` | Parent | #4083C6 | #ffffff | ✅ 1px solid #4083C6 |

## 🔧 API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|------|--------|
| `preset` | 预设标签配置对象 | `TagConfig` | - |
| `color` | 文字颜色（可覆盖预设） | `string` | - |
| `backgroundColor` | 背景颜色（可覆盖预设） | `string` | - |
| `className` | 自定义类名 | `string` | - |
| `style` | 内联样式（优先级最高） | `React.CSSProperties` | - |
| `tagProps` | Ant Design Tag 的其他属性 | `TagProps` | - |

### 样式优先级

```
外部传入的 style > 组件内部计算的样式 > Ant Design 默认样式
```

示例：
```tsx
// border 会被外部的 style 覆盖
<Tag 
  preset={PRESET_TAGS.PARENT}  // 默认 border: 1px solid #4083C6
  style={{ border: '1px solid red' }}  // ✅ 最终：1px solid red
/>
```

## 💡 使用场景

### 1. 状态展示

```tsx
// 用户状态
<Tag preset={PRESET_TAGS.ACTIVE}>Active User</Tag>
<Tag preset={PRESET_TAGS.DELETED}>Deleted Account</Tag>

// 订单状态
<Tag preset={PRESET_TAGS.PENDING}>Pending Payment</Tag>
<Tag preset={PRESET_TAGS.APPROVED}>Order Confirmed</Tag>
<Tag preset={PRESET_TAGS.REJECTED}>Order Cancelled</Tag>
```

### 2. 权限标识

```tsx
// 角色类型
<Tag preset={PRESET_TAGS.PYLONTECH}>Company Admin</Tag>
<Tag preset={PRESET_TAGS.PERSONAL}>Personal User</Tag>
<Tag preset={PRESET_TAGS.ORGANIZATION}>Organization Manager</Tag>
```

### 3. 布尔值显示

```tsx
// 是否验证
{isVerified ? (
  <Tag preset={PRESET_TAGS.YES}>Yes</Tag>
) : (
  <Tag preset={PRESET_TAGS.NO}>No</Tag>
)}
```

### 4. 操作按钮组

```tsx
<div style={{ display: 'flex', gap: 8 }}>
  <Tag preset={PRESET_TAGS.ADD} style={{ cursor: 'pointer' }}>Add</Tag>
  <Tag preset={PRESET_TAGS.MODIFY} style={{ cursor: 'pointer' }}>Modify</Tag>
</div>
```

## 📝 最佳实践

### ✅ 推荐写法

```tsx
// 1. 优先使用预设
<Tag preset={PRESET_TAGS.NORMAL} />

// 2. 需要微调时使用覆盖
<Tag preset={PRESET_TAGS.NORMAL} backgroundColor="#custom" />

// 3. 完全自定义时才不用 preset
<Tag color="#custom" backgroundColor="#custom">Custom</Tag>
```

### ⚠️ 注意事项

```tsx
// ❌ 不推荐：重复定义所有样式
<Tag color="#31C47F" backgroundColor="#31C47F1A">Normal</Tag>

// ✅ 推荐：使用预设
<Tag preset={PRESET_TAGS.NORMAL} />

// ❌ 不推荐：忽略边框特性
<Tag preset={PRESET_TAGS.YES} style={{ border: 'none' }} />

// ✅ 推荐：保留预设特性（除非确实需要移除）
<Tag preset={PRESET_TAGS.YES} />
```

## 🎯 完整示例

```tsx
import React from 'react';
import { Tag, PRESET_TAGS } from '@/components/Tag';

const TagDemo = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {/* 基础预设 */}
      <Tag preset={PRESET_TAGS.NORMAL} />
      <Tag preset={PRESET_TAGS.ACTIVE} />
      <Tag preset={PRESET_TAGS.DELETED} />
      
      {/* 带边框的特殊标签 */}
      <Tag preset={PRESET_TAGS.YES} />
      <Tag preset={PRESET_TAGS.NO} />
      <Tag preset={PRESET_TAGS.PARENT} />
      
      {/* 自定义覆盖 */}
      <Tag 
        preset={PRESET_TAGS.NORMAL} 
        color="#ff0000" 
        backgroundColor="rgba(255,0,0,0.1)" 
      />
      
      {/* 完全自定义 */}
      <Tag 
        color="#722ED1" 
        backgroundColor="rgba(114,46,209,0.08)"
      >
        Custom Tag
      </Tag>
    </div>
  );
};

export default TagDemo;
```

---

**最后更新**: 2026-03-18  
**维护者**: Pylon Cloud Team
