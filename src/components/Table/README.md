# Table 表格组件

基于 Ant Design Table 的二次封装，提供增强的功能和更好的使用体验。

## 📦 特性

- ✅ 内置分页组件（自定义样式）
- ✅ 表头筛选器（支持单选/多选）
- ✅ 批量操作栏
- ✅ 行选择功能
- ✅ 操作列自动渲染
- ✅ 数据自动过滤
- ✅ 响应式布局

## 🚀 基础用法

### 方式 1: 最简单的表格

```tsx
import { Table } from '@/components';

const SimpleTable = () => {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
  ];

  const data = [
    { key: '1', name: '张三', age: 28, address: '北京' },
    { key: '2', name: '李四', age: 32, address: '上海' },
    { key: '3', name: '王五', age: 25, address: '广州' },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="key"
    />
  );
};
```

### 方式 2: 带分页的表格

```tsx
import { useState } from 'react';
import { Table } from '@/components';

const PagedTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [data, setData] = useState([]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (p, ps) => {
          setPage(p);
          setPageSize(ps);
          // 加载新页面数据...
        },
      }}
    />
  );
};
```

## 📖 API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|------|--------|
| `columns` | 列配置 | `ColumnsType` | `[]` |
| `dataSource` | 数据源 | `RecordType[]` | `[]` |
| `rowKey` | 行键名字段 | `string` | `'key'` |
| `pagination` | 分页配置 | `PaginationConfig \| false` | - |
| `filterConfig` | 筛选器配置 | `Record<string, FilterConfig>` | - |
| `operations` | 操作列配置 | `OperationItem[]` | - |
| `operationWidth` | 操作列宽度 | `number` | `180` |
| `rowSelection` | 行选择配置 | `RowSelectionConfig` | - |
| `batchActions` | 批量操作配置 | `BatchAction[]` | - |
| `selectedCountText` | 选中项数量文本 | `string` | - |
| `className` | 自定义类名 | `string` | - |

> 💡 **注意**: 其他 Ant Design Table 的 props 也都支持（通过 `...props` 透传）

## 💡 核心功能

### 1. 表头筛选器

```tsx
import { Table } from '@/components';

const FilterableTable = () => {
  return (
    <Table
      columns={[
        { title: '平台', dataIndex: 'platform', key: 'platform' },
        { title: '状态', dataIndex: 'status', key: 'status' },
      ]}
      filterConfig={{
        platform: {
          mode: 'multiple', // 多选模式
          options: [
            { label: 'App', value: 'app' },
            { label: 'Web', value: 'web' },
          ],
        },
        status: {
          mode: 'single', // 单选模式
          options: [
            { label: '全部', value: 'all' },
            { label: '正常', value: 'normal' },
            { label: '已删除', value: 'deleted' },
          ],
        },
      }}
      dataSource={data}
    />
  );
};
```

**筛选器模式：**
- `multiple` - 多选模式（使用 Checkbox.Group）
- `single` - 单选模式（点击即选中）

### 2. 操作列

```tsx
<Table
  columns={columns}
  operations={[
    {
      key: 'view',
      label: '查看',
      icon: <ViewIcon />,
      onClick: (record) => handleView(record),
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditIcon />,
      onClick: (record) => handleEdit(record),
      hidden: (record) => !record.canEdit, // 动态隐藏
    },
    {
      key: 'delete',
      label: '删除',
      danger: true, // 危险操作样式
      icon: <DeleteIcon />,
      onClick: (record) => handleDelete(record),
    },
  ]}
  operationWidth={150} // 操作列宽度
/>
```

### 3. 行选择与批量操作

```tsx
<Table
  columns={columns}
  dataSource={data}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys, rows) => setSelectedKeys(keys),
  }}
  batchActions={[
    {
      key: 'batch-delete',
      label: '批量删除',
      icon: <DeleteIcon />,
      onClick: () => handleBatchDelete(selectedKeys),
    },
    {
      key: 'batch-export',
      label: '批量导出',
      icon: <ExportIcon />,
      onClick: () => handleBatchExport(selectedKeys),
    },
  ]}
  selectedCountText="已选择 {{count}} 项"
/>
```

### 4. 自定义分页

```tsx
<Table
  columns={columns}
  dataSource={data}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    onChange: (page, pageSize) => {
      console.log('页码变化:', page, pageSize);
      // 加载新数据...
    },
  }}
/>
```

## 🔧 完整示例

### Role 管理页面

```tsx
import { useState, useCallback } from 'react';
import { Table, Tag, PRESET_TAGS } from '@/components';
import type { GetOrgRoleDTO } from '@/services/modules/organization';

const RoleManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<GetOrgRoleDTO[]>([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'no',
      key: 'index',
      width: 60,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        if (value === 'Normal') return <Tag preset={PRESET_TAGS.NORMAL} />;
        if (value === 'Delete') return <Tag preset={PRESET_TAGS.DELETED} />;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Table
      rowKey="roleId"
      columns={columns}
      dataSource={dataSource}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (p, ps) => {
          setPage(p);
          setPageSize(ps);
        },
      }}
      filterConfig={{
        platform: {
          mode: 'multiple',
          options: [
            { label: 'App', value: 'app' },
            { label: 'Web', value: 'web' },
          ],
        },
      }}
      operations={[
        {
          key: 'view',
          label: '查看',
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {/* SVG 路径 */}
            </svg>
          ),
          onClick: (record: GetOrgRoleDTO) => handleView(record),
        },
        {
          key: 'edit',
          label: '编辑',
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {/* SVG 路径 */}
            </svg>
          ),
          onClick: (record: GetOrgRoleDTO) => handleEdit(record),
        },
        {
          key: 'delete',
          label: '删除',
          danger: true,
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {/* SVG 路径 */}
            </svg>
          ),
          onClick: (record: GetOrgRoleDTO) => handleDelete(record),
        },
      ]}
      operationWidth={120}
    />
  );
};
```

## ⚠️ 注意事项

### 1. rowKey 必传

```tsx
// ✅ 推荐：明确指定 rowKey
<Table rowKey="id" columns={columns} dataSource={data} />

// ❌ 不推荐：使用默认的 'key'
<Table columns={columns} dataSource={data} />
```

### 2. 筛选器配置

```tsx
// ✅ 正确：为每个需要筛选的列配置
filterConfig={{
  platform: {
    mode: 'multiple',
    options: [...],
  },
}}

// ❌ 错误：配置了不存在的列
filterConfig={{
  nonExistentField: { ... }, // 这个字段在 columns 中不存在
}}
```

### 3. 操作列的 hidden 属性

```tsx
// ✅ 动态隐藏
operations={[
  {
    key: 'edit',
    hidden: (record) => !record.permission.edit,
  },
]}

// ✅ 静态隐藏
operations={[
  {
    key: 'delete',
    hidden: true, // 始终隐藏
  },
]}
```

### 4. 分页配置

```tsx
// ✅ 完整配置
pagination={{
  current: page,
  pageSize: pageSize,
  total: total,
  onChange: handlePageChange,
}}

// ✅ 禁用分页
pagination={false}
```

## 🎨 样式定制

### 自定义表格样式

```tsx
<Table
  className="custom-table"
  columns={columns}
  dataSource={data}
/>
```

```scss
.custom-table {
  :global(.ant-table) {
    border-radius: 8px;
    overflow: hidden;
  }
  
  :global(.ant-table-thead > tr > th) {
    background-color: #f5f5f5;
    font-weight: 600;
  }
}
```

### 自定义操作按钮样式

```scss
.operationButtonItem {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(51, 194, 200, 0.08);
  }
}
```

## 📊 数据流

```
用户操作 → Table 内部状态 → 触发回调 → 父组件更新状态 → 重新渲染
     ↓
筛选器 → filters 状态 → 自动过滤数据 → 展示结果
     ↓
分页器 → page/pageSize → 父组件加载数据 → 更新 dataSource
```

## 🔍 常见问题

### Q1: 如何实现服务端分页？

```tsx
const ServerSidePagination = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadData = async (pageNum: number) => {
    const response = await api.getList({ pageNum });
    setData(response.records);
    setTotal(response.total);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize: 10,
        total,
        onChange: (p) => {
          setPage(p);
          loadData(p);
        },
      }}
    />
  );
};
```

### Q2: 如何禁用某些行的选择？

```tsx
<Table
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'deleted', // 禁用的条件
      name: record.name,
    }),
  }}
/>
```

### Q3: 如何自定义筛选逻辑？

Table 组件内部会自动处理筛选逻辑，如果你需要自定义：

```tsx
// 方式 1: 使用 filterConfig（推荐）
filterConfig={{
  status: {
    mode: 'single',
    options: [...],
  },
}}

// 方式 2: 手动控制（不使用 filterConfig）
const [filters, setFilters] = useState({});
const filteredData = useMemo(() => {
  return data.filter(item => {
    // 自定义筛选逻辑
    return matchesFilter(item, filters);
  });
}, [data, filters]);

<Table
  columns={columns}
  dataSource={filteredData}
  // 不使用 filterConfig，手动控制
/>
```

---

**最后更新**: 2026-03-18  
**维护者**: Pylon Cloud Team
