import React, { useState } from 'react';

import { FormButton } from '@/components';
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
import OrganizationInfo from './OrganizationInfo';

import styles from './AddOrganizationDrawer.module.scss';

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
      bodyStyle={{ padding: '0 15px', backgroundColor: '#fff' }}
      headerStyle={{
        backgroundColor: '#F1F1F2',
        borderBottom: 'none',
        borderTopLeftRadius: '12px',
        color: '#191B1F',
        fontWeight: '600',
      }}
      footerStyle={{
        backgroundColor: '#fff',
        borderTop: 'none',
        padding: '0 0 60px',
      }}
      className={styles.drawer}
      size="60%"
      placement="right"
      closable={{ placement: 'end' }}
      onClose={handleCancel}
      open={visible}
      title={t('org.add.title')}
      footer={
        <div className={styles.footer}>
          <FormButton color="default" onClick={handleCancel}>
            {t('common.action.cancel')}
          </FormButton>
          <FormButton color="primary" variant="solid" form="organization-form">
            {t('common.action.confirm')}
          </FormButton>
        </div>
      }
    >
      <div className={styles.info}>
        <OrganizationInfo />
      </div>
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
