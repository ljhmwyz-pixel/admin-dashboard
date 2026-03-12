import React, { useCallback, useEffect } from 'react';
import {
  OrgEmailField,
  OrgPhoneField,
  OrgUsernameField,
  RoleField,
  StatusField,
  UidField,
} from '@pages/organization/components';
import type { MemberDetail } from '@pages/organization/types/memberList';
import { type FormInstance, Space, Spin, Table, Tabs, Tag } from 'antd';

import { AntForm, AntRow } from '@/shared/components';

interface BasicInfoProps {
  member: MemberDetail;
  loading: boolean;
  editMember?: boolean;
  webPermissions: any[];
  phonePermissions: any[];
  onSave?: (member: MemberDetail) => void;
  /** 表单实例 */
  form: FormInstance;
}

/**
 * 成员基本信息组件
 * 展示成员的基本信息和权限清单
 */
const BasicInfo: React.FC<BasicInfoProps> = ({
  member,
  loading,
  editMember = false,
  webPermissions,
  phonePermissions,
  onSave,
  form,
}) => {
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

  useEffect(() => {
    setFormValues();
  }, [member, setFormValues]);
  return (
    <div>
      <div className="form">
        <AntForm form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <AntRow gutter={30}>
            <RoleField form={form} canEdit={editMember} />
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
      <div>
        <h4 style={{ marginBottom: 12 }}>Permissions List</h4>
        <Tabs
          defaultActiveKey="web"
          items={[
            {
              key: 'web',
              label: 'Web',
              children: (
                <Spin spinning={loading}>
                  <Table
                    dataSource={webPermissions}
                    columns={[
                      {
                        title: 'Permission',
                        dataIndex: 'permission',
                        key: 'permission',
                      },
                      {
                        title: 'Roles',
                        dataIndex: 'roles',
                        key: 'roles',
                        render: (roles: string[]) => (
                          <Space>
                            {roles.map((role, index) => (
                              <Tag key={index}>{role}</Tag>
                            ))}
                          </Space>
                        ),
                      },
                    ]}
                    pagination={false}
                    rowKey="permission"
                  />
                </Spin>
              ),
            },
            {
              key: 'phone',
              label: 'Phone',
              children: (
                <Spin spinning={loading}>
                  <Table
                    dataSource={phonePermissions}
                    columns={[
                      {
                        title: 'Permission',
                        dataIndex: 'permission',
                        key: 'permission',
                      },
                      {
                        title: 'Roles',
                        dataIndex: 'roles',
                        key: 'roles',
                        render: (roles: string[]) => (
                          <Space>
                            {roles.map((role, index) => (
                              <Tag key={index}>{role}</Tag>
                            ))}
                          </Space>
                        ),
                      },
                    ]}
                    pagination={false}
                    rowKey="permission"
                  />
                </Spin>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
