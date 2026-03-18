import React from 'react';
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
} from '@pages/organization/components';
import { OrganizationInfo } from '@pages/organization/components';
import type { TreeNodeData } from '@pages/organization/dto';
import { useOrganizationForm } from '@pages/organization/hooks';
import { AntForm, AntRow } from '@shared/components';
import { useLanguage } from '@shared/hooks';
import { Spin } from 'antd';

import { FormButton, FormDrawer } from '@/components';
import { useThemeModal } from '@/components/Modal';

import styles from './AddOrganizationDrawer.module.scss';

interface AddOrganizationProps {
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * 变更可见性
   */
  onChange: (visible: boolean) => void;
  /**
   * 当前父节点
   */
  currentParentNode?: TreeNodeData;
  /**
   * 加载数据
   */
  loadData?: () => void;
}

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({
  visible,
  onChange,
  currentParentNode,
  loadData,
}) => {
  const [form] = AntForm.useForm();
  const { t } = useLanguage();
  const { warningConfirm } = useThemeModal();

  const { existingUsername, existingPhone, verifyResult, verifyEmail, handleSubmit, loading } =
    useOrganizationForm(currentParentNode);

  const onFinish = async (values: any) => {
    const result = await handleSubmit(values, () => {
      form.resetFields();
      onChange?.(false);
      loadData?.();
    });

    if (!result.success && result.code === 422) {
      form.setFields([
        {
          name: 'orgAddress',
          errors: ['Please select correct country/region to create organization.'],
        },
      ]);
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
        body: {
          padding: '0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
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
        {currentParentNode && (
          <div className={styles.info}>
            <OrganizationInfo orgName={currentParentNode?.title} orgId={currentParentNode?.key} />
          </div>
        )}
        <div className={styles.form}>
          <AntForm form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
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
              <OrgUsernameField form={form} existingUsername={existingUsername} />

              {/* 电话字段 */}
              <OrgPhoneField
                form={form}
                verifyResult={verifyResult}
                existingPhone={existingPhone}
              />
            </AntRow>

            <AntRow gutter={30}>
              {/* 描述字段 */}
              <OrgDescriptionField form={form} />
            </AntRow>
          </AntForm>
        </div>
      </Spin>
    </FormDrawer>
  );
};

export default AddOrganizationDrawer;
