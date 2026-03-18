# SearchInput 搜索输入框组件

基于 Ant Design Input 封装的搜索输入框组件，支持按 Enter 键触发搜索。

## 📦 特性

- ✅ 内置搜索图标
- ✅ 按 Enter 键自动触发搜索
- ✅ 支持 Tooltip 提示可搜索字段
- ✅ 使用 ref 模式，无需状态管理
- ✅ 非实时搜索，性能优化

## 🚀 基础用法

### 方式 1: 使用 ref（推荐 - 最简单）

```tsx
import { useRef } from 'react';
import { SearchInput } from '@/components';

const SearchExample = () => {
  const searchRef = useRef<any>(null);

  const handleSearch = () => {
    // 从 ref 获取搜索值
    const keyword = searchRef.current?.input?.value || '';
    console.log('搜索关键词:', keyword);
    // 执行搜索逻辑...
  };

  return (
    <SearchInput
      inputRef={searchRef}
      placeholder="请输入搜索内容"
      onSearch={handleSearch}
    />
  );
};
```

**优势：**
- 不需要 useState 管理输入值
- 代码最简洁
- 性能最优（不触发额外渲染）

### 方式 2: 受控模式

```tsx
import { useState } from 'react';
import { SearchInput } from '@/components';

const ControlledSearch = () => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    console.log('搜索关键词:', value);
    // 执行搜索逻辑...
  };

  return (
    <SearchInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onPressEnter={handleSearch}
      placeholder="请输入搜索内容"
    />
  );
};
```

## 📖 API

### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|-----|------|------|--------|------|
| `inputRef` | 输入框 ref（ref 模式） | `React.RefObject<any>` | - | 否 |
| `onSearch` | 按 Enter 时的回调函数 | `(value: string) => void` | - | 否 |
| `searchFields` | 可搜索的字段列表（用于 Tooltip） | `string[]` | - | 否 |
| `tooltipTitle` | Tooltip 标题 | `React.ReactNode` | `'Support searchable fields'` | 否 |
| `tooltipProps` | Tooltip 其他属性 | `TooltipProps` | - | 否 |
| `placeholder` | 占位符 | `string` | - | 否 |
| `allowClear` | 是否显示清除按钮 | `boolean` | `true` | 否 |
| `value` | 输入值（受控模式） | `string` | - | 否 |
| `onChange` | 值变化回调（受控模式） | `(e: ChangeEvent) => void` | - | 否 |
| `onPressEnter` | Enter 键回调（受控模式） | `() => void` | - | 否 |

> 💡 **注意**: `inputRef` 和 `value/onChange` 不要同时使用，选择一种模式即可。

## 💡 使用场景

### 1. 表格搜索筛选

```tsx
import { useRef } from 'react';
import { SearchInput } from '@/components';

const TableSearch = () => {
  const searchRef = useRef<any>(null);
  const [data, setData] = useState([]);

  const loadData = async () => {
    const keyword = searchRef.current?.input?.value || '';
    const response = await api.search({ keyword });
    setData(response.data);
  };

  return (
    <div>
      <SearchInput
        inputRef={searchRef}
        placeholder="搜索角色名称..."
        onSearch={() => {
          setPage(1);  // 重置到第一页
          loadData();  // 加载数据
        }}
        searchFields={['Role name']} // 显示可搜索字段提示
      />
    </div>
  );
};
```

### 2. 带 Tooltip 提示的搜索

```tsx
<SearchInput
  inputRef={searchRef}
  placeholder="搜索..."
  onSearch={handleSearch}
  searchFields={['Name', 'Email', 'Phone']} // 会显示在 Tooltip 中
  tooltipTitle="支持搜索的字段"
/>
```

### 3. 与其他筛选器组合

```tsx
<div style={{ display: 'flex', gap: 16 }}>
  <Segmented
    options={statusOptions}
    value={statusFilter}
    onChange={setStatusFilter}
  />
  
  <SearchInput
    inputRef={searchRef}
    placeholder="搜索名称..."
    onSearch={() => {
      setPage(1);
      loadData();
    }}
  />
  
  <Button onClick={handleRefresh}>刷新</Button>
</div>
```

## 🔧 完整示例

### Role 管理页面搜索

```tsx
import { useRef, useState, useCallback } from 'react';
import { SearchInput, Segmented, Table } from '@/components';

const RoleManagement = () => {
  const searchRef = useRef<any>(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = useCallback(async () => {
    const keyword = searchRef.current?.input?.value || '';
    
    try {
      const response = await api.getRoleList({
        pageNum: page,
        pageSize: 10,
        status: statusFilter,
        keyword: keyword,
      });
      
      setData(response.data.records);
    } catch (error) {
      console.error(error);
    }
  }, [page, statusFilter]);

  const handleRefresh = () => {
    setStatusFilter('all');
    if (searchRef.current?.input) {
      searchRef.current.input.value = ''; // 清空输入框
    }
    setPage(1);
    loadData();
  };

  return (
    <div>
      {/* 顶部筛选栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Segmented
          options={[
            { label: '全部', value: 'all' },
            { label: '正常', value: 'normal' },
            { label: '已删除', value: 'deleted' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        
        <SearchInput
          inputRef={searchRef}
          placeholder="搜索角色名称..."
          onSearch={() => {
            setPage(1);
            loadData();
          }}
          searchFields={['Role name']}
        />
      </div>
      
      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          pageSize: 10,
          total: total,
          onChange: setPage,
        }}
      />
    </div>
  );
};
```

## ⚠️ 注意事项

1. **ref 模式 vs 受控模式**
   - 推荐使用 ref 模式（更简单、性能更好）
   - 如果需要实时验证或其他交互，使用受控模式

2. **清空输入框**
   ```tsx
   // ref 模式清空
   if (searchRef.current?.input) {
     searchRef.current.input.value = '';
   }
   
   // 受控模式清空
   setValue('');
   ```

3. **防抖处理**
   - 组件内部不做防抖
   - 如需防抖，请在 `onSearch` 回调中自行处理

4. **清除按钮**
   - `allowClear={true}` 时会显示清除按钮
   - 清除后不会自动触发搜索，需要手动调用

## 🎨 样式定制

```tsx
<SearchInput
  inputRef={searchRef}
  className="custom-search"
  style={{ width: 300 }}
  placeholder="搜索..."
/>
```

```scss
.custom-search {
  :global(.ant-input) {
    border-radius: 6px;
    background-color: rgba(25, 27, 31, 0.06);
  }
}
```

---

**最后更新**: 2026-03-18  
**维护者**: Pylon Cloud Team
