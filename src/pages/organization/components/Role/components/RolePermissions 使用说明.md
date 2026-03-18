# RolePermissions 使用说明

## 功能说明

`RolePermissions` 组件用于管理角色在不同平台（Web、Phone）上的权限选择。组件会自动维护每个平台的选中状态，并在变化时通知父组件。

## Props

```typescript
interface IRolePermissions {
  rolePermissionData?: any;  // 权限树形数据
  onChange?: (selectedPermissions: Record<string, string[]>) => void;  // 选中变化回调
}
```

### onChange 回调参数

```typescript
{
  Web: ['permissionId1', 'permissionId2', ...],  // Web 平台选中的权限 ID 列表
  Phone: ['permissionId3', 'permissionId4', ...]  // Phone 平台选中的权限 ID 列表
}
```

## 使用示例

### 1. 基础用法 - 获取选中数据

```tsx
import RolePermissions from './components/RolePermissions';

const AddRole = () => {
  const handlePermissionsChange = (selectedPermissions: Record<string, string[]>) => {
    console.log('用户选择的权限：', selectedPermissions);
    console.log('Web 平台选中：', selectedPermissions.Web);
    console.log('Phone 平台选中：', selectedPermissions.Phone);
    
    // 可以在这里保存到表单状态或提交到后端
  };

  return (
    <RolePermissions
      rolePermissionData={permissionTreeData}
      onChange={handlePermissionsChange}
    />
  );
};
```

### 2. 在表单中使用

```tsx
import { useState } from 'react';
import RolePermissions from './components/RolePermissions';

const CreateRoleForm = () => {
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    permissions: {
      Web: [],
      Phone: [],
    },
  });

  const handleSubmit = async () => {
    // 提交时的权限数据
    const submitData = {
      roleName: formData.roleName,
      description: formData.description,
      permissionIds: [
        ...formData.permissions.Web,
        ...formData.permissions.Phone,
      ],
      // 或者按平台分开提交
      platformPermissions: formData.permissions,
    };

    await api.createRole(submitData);
  };

  return (
    <div>
      <input
        value={formData.roleName}
        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
        placeholder="角色名称"
      />
      
      <RolePermissions
        rolePermissionData={permissionTreeData}
        onChange={(selectedPermissions) => {
          setFormData((prev) => ({
            ...prev,
            permissions: selectedPermissions,
          }));
        }}
      />
      
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};
```

### 3. 编辑模式 - 回显已选权限

```tsx
import { useEffect, useState } from 'react';
import RolePermissions from './components/RolePermissions';

const EditRole = ({ roleId }) => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    Web: [],
    Phone: [],
  });

  // 加载角色详情时初始化权限
  useEffect(() => {
    const loadRoleDetail = async () => {
      const detail = await api.getRoleDetail(roleId);
      
      // 假设后端返回的数据结构
      setPermissions({
        Web: detail.webPermissionIds || [],
        Phone: detail.phonePermissionIds || [],
      });
    };
    
    loadRoleDetail();
  }, [roleId]);

  const handleSubmit = async () => {
    await api.updateRole(roleId, {
      permissionIds: [
        ...permissions.Web,
        ...permissions.Phone,
      ],
    });
  };

  return (
    <RolePermissions
      rolePermissionData={permissionTreeData}
      onChange={setPermissions}
    />
  );
};
```

## 数据结构说明

### rolePermissionData 格式

```typescript
[
  {
    permissionId: 'perm_001',
    permissionName: '用户管理',
    children: [
      {
        permissionId: 'perm_001_001',
        permissionName: '查看用户',
      },
      {
        permissionId: 'perm_001_002',
        permissionName: '创建用户',
      },
    ],
  },
  // ...
]
```

### onChange 返回值格式

```typescript
{
  Web: ['perm_001_001', 'perm_001_002'],
  Phone: ['perm_001_001']
}
```

## 注意事项

1. **组件会自动维护选中状态**：父组件不需要手动管理 `checkedKeys`
2. **实时通知**：每次选中项变化时都会触发 `onChange`
3. **全选功能**：点击 "Select All" 也会触发 `onChange`
4. **独立管理**：Web 和 Phone 平台的选中状态是独立的

## 常见问题

### Q: 如何获取所有选中的权限？
A: 通过 `onChange` 回调的第二个参数即可获得所有选中的权限 ID 列表。

### Q: 如何区分不同平台的权限？
A: `onChange` 返回的对象中，`Web` 和 `Phone` 字段分别对应各自平台的选中权限。

### Q: 如何实现权限联动？
A: 当前版本由 `TreeCheckList` 组件内部处理父子节点的联动选中逻辑。
