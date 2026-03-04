import React, { useState } from 'react';

import { FormButton } from '@/components';
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
import { organizationApi } from '@/services/modules/organization/organizationApi';
import { AntRow, Drawer, Form, useForm } from '@/shared/components';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { TreeNodeData, VerifyOrganization } from '@/shared/types/organization';

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
  const { showLoading, hideLoading } = useGlobalLoading();
  const [options] = useState([]);

  const [userExists, setUserExists] = useState<boolean>(false);
  const [existingUsername, setExistingUsername] = useState<string>('');
  const [existingPhone, setExistingPhone] = useState<number>(0);
  const [verifyResult, setVerifyResult] = useState<VerifyOrganization>({
    isOrganizationExists: false,
    isOrganizationSimilar: false,
    isPhoneExists: false,
    isScope: false,
    timestamp: 0,
  });

  const verifyEmail = async (
    email: string,
  ): Promise<{ userExists: boolean; existingUsername: string; existingPhone: number }> => {
    const defaultResult = { userExists: false, existingUsername: '', existingPhone: 0 };

    try {
      const response = await organizationApi.verifyEmail({ email: email || '' });
      const result = {
        userExists: response.data.userExists || false,
        existingUsername: response.data.existingUsername || '',
        existingPhone: response.data.existingPhone || 0,
      };

      setUserExists(result.userExists);
      setExistingUsername(result.existingUsername);
      setExistingPhone(result.existingPhone);
      return result;
    } catch (error) {
      setUserExists(false);
      setExistingUsername('');
      setExistingPhone(0);
      return defaultResult;
    }
  };

  const verify = async (values: any) => {
    const defaultResult = {
      isOrganizationExists: false,
      isOrganizationSimilar: false,
      isPhoneExists: false,
      isScope: false,
      timestamp: Date.now(),
    };

    try {
      const response = await organizationApi.verify(values);
      setVerifyResult({ ...response.data, timestamp: Date.now() });
      return response.data;
    } catch (error) {
      setVerifyResult(defaultResult);
      return defaultResult;
    }
  };

  const onFinish = async (values: any) => {
    // 开始全局loading
    showLoading();

    try {
      // 第一个请求：验证组织信息
      const verifyData = await verify(values);
      console.log('验证组织信息:', verifyData);
      if (
        verifyData?.isOrganizationExists ||
        verifyData?.isOrganizationSimilar ||
        verifyData?.isPhoneExists ||
        verifyData?.isScope
      ) {
        return;
      }

      // 第二个请求：验证邮箱
      const emailResult = await verifyEmail(values.orgEmail);
      if (emailResult?.userExists) {
        await handleConfirm({
          values,
          username: emailResult.existingUsername,
          phone: emailResult.existingPhone,
        });
      } else {
        await handleConfirm(values);
      }
    } finally {
      // 所有请求结束后关闭 loading
      hideLoading();
    }
  };

  const handleConfirm = async (values: any) => {
    const requestData = {
      orgName: values.orgName,
      orgType: values.orgType,
      parentOrgId: currentParentNode?.key || undefined,
      address: values.orgAddress,
      countryRegion: values.orgCountryRegion,
      postalCode: values.orgPostalCode,
      email: values.orgEmail,
      username: values.orgUsername,
      phone: values.orgPhone,
      description: values.orgDescription,
    };

    const response = await organizationApi.create(requestData);
    console.log('创建成功:', response);
    form.resetFields();
    onChange?.(false);
  };

  const handleCancel = () => {
    form.resetFields();
    onChange?.(false);
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
        <OrganizationInfo />
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
          <OrgAddressField form={form} verifyResult={verifyResult} />

          {/* 国家地区字段 */}
          <OrgCountryRegionField form={form} countryOptions={options} />
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
          {/* 描述字段 */}
          <OrgDescriptionField form={form} />
        </AntRow>
      </Form>
    </Drawer>
  );
};

export default AddOrganizationDrawer;
