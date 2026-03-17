import React, { useCallback, useEffect, useState } from 'react';
import type {
  AddMemberFormData,
  FieldProps,
  PreviewMemberPermissionData,
  Record,
} from '@pages/organization/dto';
import { loadMemberPermissions, loadRoles } from '@pages/organization/services/organizationService';
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
  onSubmit: (values: AddMemberFormData['role']) => void;
  /** 组织 ID */
  orgId: string;
}

/**
 * 新增成员第二步：分配角色
 * 选择角色并展示该角色的权限列表
 *
 * 功能特性：
 * - 支持多选角色
 * - 支持权限清单展示
 * - 支持角色变化时更新权限预览
 * - 支持表单验证
 */
const AddMemberAssignRoles: React.FC<AddMemberAssignRolesProps> = ({ form, onSubmit, orgId }) => {
  /** 权限清单数据 */
  const [permissionList, setPermissionList] = useState<PreviewMemberPermissionData>();
  /** 角色列表 */
  const [roleList, setRoleList] = useState<Record[]>([]);

  /**
   * 处理角色选择变化
   * 根据选择的角色 ID 加载对应的权限清单
   * @param roleIds - 角色 ID 数组
   */
  const handleRoleChange = useCallback(async (roleIds: string[]) => {
    if (!roleIds || roleIds.length === 0) {
      setPermissionList(undefined);
      return;
    }

    try {
      const res = await loadMemberPermissions({ roleIds });
      if (res?.data) {
        setPermissionList(res.data);
      } else {
        setPermissionList(undefined);
      }
    } catch (error) {
      console.error('Failed to load member permissions:', error);
      setPermissionList(undefined);
    }
  }, []);

  /**
   * 加载角色列表数据
   * 过滤掉 Organization Owner 角色
   */
  useEffect(() => {
    const loadRolesData = async () => {
      if (!orgId) return;
      try {
        const roleList = await loadRoles({
          orgId,
          pageNum: 1,
          pageSize: 1000,
        });
        if (roleList?.data?.records) {
          setRoleList(
            roleList.data.records.filter((role) => role.roleName !== 'Organization Owner') || [],
          );
        }
      } catch (error) {
        console.error('Failed to load roles:', error);
      }
    };

    loadRolesData();
  }, [orgId]);

  return (
    <AntForm form={form} onFinish={onSubmit} className={styles.form} layout="vertical">
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
      </div>
      <PermissionsList permissionList={permissionList} />
    </AntForm>
  );
};

export default AddMemberAssignRoles;
