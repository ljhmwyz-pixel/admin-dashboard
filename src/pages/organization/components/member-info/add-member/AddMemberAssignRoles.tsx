import React, { useCallback, useEffect, useState } from 'react';
import type { FieldProps, PreviewMemberPermissionData, Record } from '@pages/organization/dto';
import { loadRoles } from '@pages/organization/services/organizationService';
import { AntForm } from '@shared/components';

import { RoleField } from '../../form-fields';
import PermissionsList from '../permissions/PermissionsList';

import styles from './AddMemberAssignRoles.module.scss';

/**
 * AddMemberAssignRoles 组件属性接口
 */
interface AddMemberAssignRolesProps {
  /** 表单实例 */
  form: FieldProps['form'];
  /** 提交回调 */
  onSubmit: (values: any) => void;
  /** 组织ID */
  orgId: string;
}

/**
 * 新增成员第二步：分配角色
 * 选择角色并展示该角色的权限列表
 */
const AddMemberAssignRoles: React.FC<AddMemberAssignRolesProps> = ({ form, onSubmit, orgId }) => {
  const [permissionList, setPermissionList] = useState<PreviewMemberPermissionData>();
  const [roleList, setRoleList] = useState<Record[]>([]);

  /** 处理角色选择变化 */
  const handleRoleChange = (values: string[]) => {
    // setRoleNamesList(values);
  };

  const loadRolesData = useCallback(async () => {
    if (!orgId) return;
    const roleList = await loadRoles({
      orgId: orgId,
      pageNum: 1,
      pageSize: 1000,
    });
    if (roleList?.data?.records) {
      setRoleList(roleList.data.records);
    }
  }, [orgId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRolesData();
  }, [loadRolesData]);

  return (
    <AntForm form={form} onFinish={onSubmit} layout="vertical">
      <div className={styles.stepContent}>
        <RoleField
          form={form}
          required
          span={24}
          options={roleList.map((role) => ({
            value: role.roleId,
            label: role.roleName,
          }))}
          onChange={handleRoleChange}
        />

        {/* <PermissionsList permissionList={permissionList} /> */}
      </div>
    </AntForm>
  );
};

export default AddMemberAssignRoles;
