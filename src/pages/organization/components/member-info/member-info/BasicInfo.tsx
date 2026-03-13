import React, { useCallback, useEffect, useState } from 'react';
import {
  OrgEmailField,
  OrgPhoneField,
  OrgUsernameField,
  RoleField,
  StatusField,
  UidField,
} from '@pages/organization/components';
import type { FieldProps, MemberDetail } from '@pages/organization/dto';

import { AntForm, AntRow } from '@/shared/components';

import PermissionsList from '../permissions/PermissionsList';

interface BasicInfoProps {
  member: MemberDetail;
  loading: boolean;
  editMember?: boolean;
  onSave?: (member: MemberDetail) => void;
  /** 表单实例 */
  form: FieldProps['form'];
}

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
 * 成员基本信息组件
 * 展示成员的基本信息和权限清单
 */
const BasicInfo: React.FC<BasicInfoProps> = ({
  member,
  loading,
  editMember = false,
  onSave,
  form,
}) => {
  /** 角色列表 */
  const [roles] = useState<Role[]>(mockRoles);
  /** 当前选择的角色名称 */
  const [roleNamesList, setRoleNamesList] = useState<string[]>([member.roleName]);
  const setFormValues = useCallback(() => {
    form.setFieldsValue({
      role: [member.roleName],
      status: [member.status],
      uid: member.userId,
      orgUsername: member.username,
      orgEmail: member.email,
      orgPhone: member.phone,
    });
  }, [form, member]);

  const handleSubmit = useCallback(
    (formValues: { role: string[] }) => {
      if (!formValues?.role?.length) {
        form.setFields([
          {
            name: 'role',
            errors: ['Please select at least one role'],
          },
        ]);
        return;
      }
      onSave?.(member);
    },
    [form, onSave, member],
  );

  /** 处理角色选择变化 */
  const handleRoleChange = (values: string[]) => {
    setRoleNamesList(values);
  };
  useEffect(() => {
    setFormValues();
  }, [member, setFormValues]);
  return (
    <div>
      <div className="form">
        <AntForm form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <AntRow gutter={30}>
            <RoleField
              form={form}
              canEdit={editMember}
              options={roles.map((role) => ({
                value: role.roleId,
                label: role.roleName,
              }))}
              onChange={handleRoleChange}
            />
            <StatusField form={form} canEdit={false} />
          </AntRow>

          <AntRow gutter={30}>
            <UidField form={form} canEdit={false} />
            <OrgUsernameField form={form} required={false} />
          </AntRow>

          <AntRow gutter={30}>
            <OrgEmailField form={form} required={false} canEdit={false} />
            <OrgPhoneField form={form} canEdit={false} />
          </AntRow>
        </AntForm>
      </div>

      {/* 权限清单 */}
      <PermissionsList roleNamesList={roleNamesList} loading={loading} />
    </div>
  );
};

export default BasicInfo;
