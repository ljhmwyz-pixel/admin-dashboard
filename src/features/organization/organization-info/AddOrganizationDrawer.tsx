import React from 'react';
import { Spin } from 'antd';

import { FormButton, FormDrawer, FormModal } from '@/components';
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
} from '@/components/fields';
import { AntRow, Form, useForm } from '@/shared/components';
import { useLanguage, useOrganizationForm } from '@/shared/hooks';
import type { TreeNodeData } from '@/shared/types/organization';
import { getParentNode } from '@/shared/utils/dataTransformer';

import OrganizationInfo from './OrganizationInfo';

import styles from './AddOrganizationDrawer.module.scss';

interface AddOrganizationProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
  currentParentNode?: TreeNodeData;
  loadData?: () => void;
  treeData?: TreeNodeData[]; // 添加树形数据参数
}

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({
  visible,
  onChange,
  currentParentNode,
  loadData,
  treeData,
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
    loading,
  } = useOrganizationForm(currentParentNode);

  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  const onFinish = async (values: any) => {
    const result = await handleSubmit(values, () => {
      form.resetFields();
      onChange?.(false);
      loadData?.();
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
    <FormDrawer
      className={styles.drawer}
      size="60%"
      placement="right"
      closable={{ placement: 'end' }}
      onClose={handleCancel}
      styles={{
        body: { padding: '0 30px' },
      }}
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
      <Spin spinning={loading}>
        {parentNode && (
          <div className={styles.info}>
            <OrganizationInfo orgName={parentNode?.title} orgId={parentNode?.key} />
          </div>
        )}
        <div className={styles.form}>
          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <AntRow gutter={30}>
              {/* 组织名称字段 */}
              <OrgNameField form={form} verifyResult={verifyResult} />

              {/* 组织类型字段 */}
              <OrgTypeField form={form} parentOrgType={currentParentNode?.type} />
            </AntRow>

            <AntRow gutter={30}>
              {/* 组织地址字段 */}
              <OrgAddressField form={form} verifyResult={verifyResult} />

              {/* 国家地区字段 */}
              <OrgCountryRegionField form={form} canEdit={false} />
            </AntRow>

            <AntRow gutter={30}>
              {/* 邮政编码字段 */}
              <OrgPostalCodeField form={form} />
            </AntRow>

            <AntRow gutter={30}>
              {/* 邮箱字段 */}
              <OrgEmailField form={form} onCheckEmailExists={verifyEmail} />
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
            {/* <AntRow gutter={30}>
          <OrgBDCountryRegionField form={form} parentOrgType={currentParentNode?.type} />
        </AntRow> */}

            <AntRow gutter={30}>
              {/* 描述字段 */}
              <OrgDescriptionField form={form} />
            </AntRow>
          </Form>
        </div>
      </Spin>
    </FormDrawer>
  );
};

export default AddOrganizationDrawer;
