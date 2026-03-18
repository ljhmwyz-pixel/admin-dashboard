import React, { useCallback, useEffect, useState } from 'react';
import {
  ApplyReasonField,
  OrgEmailField,
  OrgPhoneField,
  OrgUsernameField,
  RoleField,
  StatusField,
  UidField,
} from '@pages/organization/components';
import type {
  FieldProps,
  MemberDetail,
  PreviewMemberPermissionData,
  Record,
} from '@pages/organization/dto';

import { AntForm, AntRow } from '@/shared/components';

import PermissionsList from '../permissions/PermissionsList';

interface BasicInfoProps {
  member: MemberDetail;
  loading: boolean;
  editMember?: boolean;
  onSave?: (member: MemberDetail, roleIds: string[]) => void;
  /** 表单实例 */
  form: FieldProps['form'];
  /** 角色选项 */
  roleOptionList?: Record[];
  /** 权限清单 */
  permissionList?: PreviewMemberPermissionData;
  /** 更新权限清单 */
  updateMemberPreviewPermission?: (roleIds: string[]) => void;
}

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
  roleOptionList = [],
  permissionList,
  updateMemberPreviewPermission,
}) => {
  /** 当前选择的角色名称 */

  const setFormValues = useCallback(() => {
    form.setFieldsValue({
      role:
        member?.roleList?.map((role) => ({
          value: role.roleId,
          label: role.roleName,
        })) || (member?.preAssignedRole ? [member?.preAssignedRole] : []),
      status: [member.status],
      uid: member.uid,
      orgUsername: member.username,
      orgEmail: member.email,
      orgPhone: member.phone,
      applyReason: member?.applyReason,
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
      } else {
        form.setFields([
          {
            name: 'role',
            errors: [],
          },
        ]);
      }
      onSave?.(member, formValues.role);
    },
    [form, onSave, member],
  );

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
              options={roleOptionList
                ?.filter((role) => role?.roleName !== 'Organization Owner')
                ?.map((role) => ({
                  value: role.roleId,
                  label: role.roleName,
                }))}
              onChange={updateMemberPreviewPermission}
            />
            <StatusField form={form} canEdit={false} />
          </AntRow>

          <AntRow gutter={30}>
            <UidField form={form} canEdit={false} />
            <OrgUsernameField form={form} required={false} canEdit={false} />
          </AntRow>

          <AntRow gutter={30}>
            <OrgEmailField form={form} required={false} canEdit={false} />
            <OrgPhoneField form={form} canEdit={false} />
          </AntRow>
          {member?.applyReason && (
            <AntRow gutter={30}>
              <ApplyReasonField form={form} canEdit={false} />
            </AntRow>
          )}
        </AntForm>
      </div>

      {/* 权限清单 */}
      <PermissionsList permissionList={permissionList} loading={loading} />
    </div>
  );
};

export default BasicInfo;
