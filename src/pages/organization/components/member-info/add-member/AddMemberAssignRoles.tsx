import React, { useState } from 'react';
import { AntForm } from '@shared/components';

import { RoleField } from '../../form-fields';
import PermissionsList from '../permissions/PermissionsList';

import styles from './AddMemberAssignRoles.module.scss';

/**
 * 角色接口
 */
interface Role {
  /** 角色ID */
  roleId: string;
  /** 角色名称 */
  roleName: string;
  /** 角色描述 */
  description: string;
}

/**
 * 模拟角色数据
 */
const mockRoles: Role[] = [
  {
    roleId: 'Organization Owner',
    roleName: 'Organization Owner',
    description: 'Full access to the organization',
  },
  {
    roleId: 'Organization Admin',
    roleName: 'Organization Admin',
    description: 'Manage organization members and settings',
  },
  {
    roleId: 'Plant Manager',
    roleName: 'Plant Manager',
    description: 'Manage plants and related operations',
  },
  { roleId: 'Viewer', roleName: 'Viewer', description: 'View-only access to organization data' },
];

/**
 * AddMemberAssignRoles 组件属性接口
 */
interface AddMemberAssignRolesProps {
  /** 表单实例 */
  form: any;
  /** 提交回调 */
  onSubmit: (values: any) => void;
  /** 组织ID */
  orgId: string;
}

/**
 * 新增成员第二步：分配角色
 * 选择角色并展示该角色的权限列表
 */
const AddMemberAssignRoles: React.FC<AddMemberAssignRolesProps> = ({ form, onSubmit }) => {
  /** 角色列表 */
  const [roles] = useState<Role[]>(mockRoles);
  /** 当前选择的角色名称 */
  const [roleNamesList, setRoleNamesList] = useState<string[]>([]);

  /** 处理角色选择变化 */
  const handleRoleChange = (values: string[]) => {
    setRoleNamesList(values);
  };

  return (
    <AntForm form={form} onFinish={onSubmit} layout="vertical">
      <div className={styles.stepContent}>
        <RoleField
          form={form}
          required
          span={24}
          options={roles.map((role) => ({
            value: role.roleId,
            label: role.roleName,
          }))}
          onChange={handleRoleChange}
        />

        <PermissionsList roleNamesList={roleNamesList} />
      </div>
    </AntForm>
  );
};

export default AddMemberAssignRoles;
