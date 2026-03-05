import React, { useState } from 'react';

import { FormButton, FormModal } from '@/components';
import {
  OrgAddressField,
  OrgBDCountryRegionField,
  OrgCountryRegionField,
  OrgDescriptionField,
  OrgEmailField,
  OrgNameField,
  OrgPhoneField,
  OrgPostalCodeField,
  OrgTypeField,
  OrgUsernameField,
} from '@/components/fields';
import { AntRow, Drawer, Form, useForm, useWatch } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useOrganizationForm } from '@/shared/hooks/useOrganizationForm';
import type { TreeNodeData } from '@/shared/types/organization';

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
  const { warningConfirm } = FormModal();

  const {
    userExists,
    existingUsername,
    existingPhone,
    verifyResult,
    verifyEmail,
    handleSubmit,
    refreshOrganizationList,
  } = useOrganizationForm(currentParentNode);

  const onFinish = async (values: any) => {
    const result = await handleSubmit(values, () => {
      form.resetFields();
      onChange?.(false);
      refreshOrganizationList();
    });

    if (!result.success) {
      console.warn('❌ 表单提交失败:', result.reason);
    } else {
      console.log('✅ 表单提交成功');
    }
  };

  const handleCancel = () => {
    const formValues = form.getFieldsValue(true);
    const hasValues = Object.values(formValues).some((value) => {
      return value !== undefined && value !== null && value !== '';
    });

    if (hasValues) {
      warningConfirm({
        title: t('org.dialog.unsaved.title'),
        content: t('org.dialog.unsaved.content'),
        okText: 'Exit',
        onOk: () => {
          form.resetFields();
          onChange?.(false);
        },
      });
    } else {
      form.resetFields();
      onChange?.(false);
    }
  };

  return (
    <Drawer
      bodyStyle={{ padding: '0 30px', backgroundColor: '#fff' }}
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
          <FormButton color="primary" variant="solid" onClick={() => form.submit()}>
            {t('common.action.confirm')}
          </FormButton>
        </div>
      }
    >
      <div className={styles.info}>
        <OrganizationInfo
          showExtra={false}
          orgName={currentParentNode?.title || ''}
          orgCode={currentParentNode?.key || ''}
        />
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <AntRow gutter={30}>
          {/* 组织名称字段 */}
          <OrgNameField form={form} verifyResult={verifyResult} />

          {/* 组织类型字段 */}
          <OrgTypeField form={form} parentOrgType={currentParentNode?.type} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 组织地址字段 */}
          <OrgAddressField
            form={form}
            verifyResult={verifyResult}
            // onChange={(values) => setAddressValues(values)}
          />

          {/* 国家地区字段 */}
          <OrgCountryRegionField form={form} useWatch={useWatch} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 邮政编码字段 */}
          <OrgPostalCodeField form={form} />
        </AntRow>

        <AntRow gutter={30}>
          {/* 邮箱字段 */}
          <OrgEmailField form={form} onCheckEmailExists={verifyEmail} userExists={userExists} />
        </AntRow>
        <AntRow gutter={30}>
          {/* 用户名字段 */}
          <OrgUsernameField
            form={form}
            userExists={userExists}
            existingUsername={existingUsername}
          />

          {/* 电话字段 */}
          <OrgPhoneField
            form={form}
            userExists={userExists}
            existingPhone={existingPhone}
            verifyResult={verifyResult}
          />
        </AntRow>
        <AntRow gutter={30}>
          {/* BD国家地区字段 */}
          {/* <OrgBDCountryRegionField form={form} parentOrgType={currentParentNode?.type} /> */}
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
