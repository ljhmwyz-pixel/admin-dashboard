import React, { useState } from 'react';

import { AntRow, Button, Drawer, Form, Space, useForm } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { TreeNodeData } from '@/shared/types/organization';

import {
  OrgAddressField,
  OrgCountryRegionField,
  OrgDescriptionField,
  OrgEmailField,
  OrgNameField,
  OrgPhoneField,
  OrgPostalCodeField,
  OrgTypeField,
  OrgUsernameField,
} from './fields';

interface AddOrganizationProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
  currentParentNode?: TreeNodeData;
}

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({
  visible,
  onChange,
  currentParentNode,
}) => {
  const [form] = useForm();
  const { t } = useLanguage();
  // TODO: 从 API 获取选项数据
  const [options] = useState([]);

  // TODO: 实现表单提交逻辑
  const onFinish = async (values: any) => {
    console.log('submit:', values);

    // TODO: 调用 API 进行组织名称模糊查重（提交后）
    // 查重范围：当前服务器
    // 不同服务器可以存在名称一致或相似的组织
    try {
      // 示例：调用查重 API
      // const duplicateCheck = await checkOrganizationDuplicate(values.orgName);
      // if (duplicateCheck.exists) {
      //   form.setFields([
      //     {
      //       name: 'orgName',
      //       errors: [t('org.validation.name_duplicate')],
      //     },
      //   ]);
      //   return;
      // }

      // 查重通过后继续提交
      console.log('查重通过，准备提交数据');
    } catch (error) {
      console.error('查重失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onChange?.(false);
  };

  return (
    <Drawer
      size="large"
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={visible}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '16px',
          }}
        >
          <Space>
            <Button onClick={handleCancel}>{t('common.action.cancel')}</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {t('common.action.confirm')}
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <AntRow gutter={30}>
          {/* 组织名称字段 */}
          <OrgNameField form={form} />

          {/* 组织类型字段 */}
          <OrgTypeField form={form} parentOrgType={currentParentNode?.type} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 组织地址字段 */}
          <OrgAddressField form={form} />

          {/* 国家地区字段 */}
          <OrgCountryRegionField form={form} countryOptions={options} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 邮政编码字段 */}
          <OrgPostalCodeField form={form} />

          {/* 邮箱字段 */}
          <OrgEmailField form={form} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 用户名字段 */}
          <OrgUsernameField form={form} />

          {/* 电话字段 */}
          <OrgPhoneField form={form} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 描述字段 */}
          <OrgDescriptionField form={form} />
        </AntRow>
      </Form>
    </Drawer>
  );
};

export default AddOrganizationDrawer;
