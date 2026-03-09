import React, { useCallback, useEffect, useState } from 'react';

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
import organizationApi from '@/services/modules/organization/organizationApi';
import { AntForm, AntRow } from '@/shared/components/antd-imports';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { type OrganizationFormData, useOrganizationForm } from '@/shared/hooks/useOrganizationForm';
import type { TreeNodeData } from '@/shared/types/organization';

import { getParentNode } from '../utils/dataTransformer';
import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

interface OrganizationViewIProps {
  orgId: string;
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
}
const OrganizationView: React.FC<OrganizationViewIProps> = ({
  orgId,
  currentParentNode,
  treeData,
}) => {
  const [form] = AntForm.useForm();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [detail, setDetail] = useState({});
  const { t } = useLanguage();
  const { withLoading, showLoading, hideLoading } = useGlobalLoading();
  const { userExists, existingUsername, existingPhone, verifyResult, verifyEmail } =
    useOrganizationForm(currentParentNode);

  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  useEffect(() => {
    if (!orgId) return;

    const fetchDetail = async () => {
      try {
        const res = await organizationApi.detail({ orgId });

        if (res.code === 200) {
          form.setFieldsValue({
            orgName: res.data.orgName,
            orgDescription: res.data.description,
            orgUsername: res.data.contactPerson,
            orgPhone: res.data.contactPhone,
            orgEmail: res.data.contactEmail,
            orgPostalCode: res.data.zipCode,
            orgType: res.data.orgType,
            orgAddress: res.data.address,
            orgCountryRegion: res.data.regionCode,
          });
          setDetail(res.data);
        }
      } catch (error) {
        console.error('Get org detail failed:', error);
      }
    };

    fetchDetail();
  }, [orgId, form]);

  const onEdit = () => {
    setCanEdit(true);
    form.setFieldsValue(detail);
  };
  const onCancel = () => {
    setCanEdit(false);
    form.setFieldsValue(detail);
  };
  const handleSubmit = useCallback(async (values: OrganizationFormData, onRefresh?: () => void) => {
    // 开始全局 loading
    showLoading();

    try {
      // ===== 第一步：验证组织信息 =====
      // const verifyData = await verifyOrganization(values);
      // // 如果验证失败，直接返回
      // if (!verifyData.valid) {
      //   return { success: false, reason: 'validation_failed', verifyData };
      // }
      // // ===== 第二步：验证邮箱 =====
      // const emailResult = await verifyEmail(values.orgEmail);
      // // ===== 第三步：创建组织 =====
      // let response;
      // // 关键判断：只有当 userExists 为 true 时才使用已存在用户
      // if (emailResult?.userExists) {
      //   // 用户已存在，使用现有用户信息创建组织
      //   response = await handleConfirmWithExistingUser(
      //     values,
      //     emailResult.existingUsername || '',
      //     emailResult.existingPhone || '',
      //   );
      // } else {
      //   // 用户不存在，创建新组织和用户
      //   response = await handleCreateOrganization(values);
      // }
      // // ===== 第四步：检查创建结果 =====
      // if (response.code === 200) {
      //   // 显示成功提示（在回调中刷新列表）
      //   success({
      //     title: 'Success !',
      //     content: t('org.toast.create_success'),
      //     onOk: () => {
      //       onRefresh?.();
      //     },
      //   });
      //   return { success: true, data: response };
      // } else {
      //   // 创建失败时不刷新列表，直接返回错误
      //   return { success: false, reason: 'create_failed', response };
      // }
    } catch (error) {
      // 发生异常时不刷新列表，直接返回错误
      return { success: false, reason: 'error', error };
    } finally {
      // 所有请求结束后关闭 loading
      hideLoading();
    }
  }, []);
  const onSave = () => {
    form.validateFields().then(async (values) => {
      try {
        const result = await handleSubmit(values, () => {
          setCanEdit(false);
          // loadData?.();
        });

        // if (!result.success) {
        //   console.warn('❌ 表单提交失败:', result.reason);
        // } else {
        //   console.log('✅ 表单提交成功');
        // }
        // const res = await organizationApi.update(requestParams);
        // if (res.code === 200) {
        //   setCanEdit(false);
        //   // Moda({
        //   //   title: t('org.toast.update_success'),
        //   // });
        // }
      } catch (error) {
        console.error('Get org detail failed:', error);
      }
    });
  };

  return (
    <div className={styles.organizationView}>
      {/* 组织基本信息 */}
      <OrgInfo orgName={parentNode?.title} orgType={parentNode?.type} orgId={parentNode?.key} />
      {/* 组织信息编辑 */}
      <div className={styles.editContainer}>
        <AntForm form={form} layout="vertical" initialValues={detail}>
          <AntRow gutter={30}>
            {/* 组织名称字段 */}
            <OrgNameField form={form} verifyResult={verifyResult} canEdit={canEdit} />

            {/* 组织类型字段 */}
            <OrgTypeField form={form} parentOrgType={currentParentNode?.type} canEdit={canEdit} />
          </AntRow>
          <AntRow gutter={30}>
            {/* 组织地址字段 */}
            <OrgAddressField form={form} verifyResult={verifyResult} canEdit={canEdit} />

            {/* 国家地区字段 */}
            <OrgCountryRegionField form={form} canEdit={false} />
          </AntRow>
          <AntRow gutter={30}>
            {/* 邮政编码字段 */}
            <OrgPostalCodeField form={form} canEdit={canEdit} />
          </AntRow>
          <AntRow gutter={30}>
            {/* 邮箱字段 */}
            <OrgEmailField
              form={form}
              onCheckEmailExists={verifyEmail}
              userExists={userExists}
              canEdit={canEdit}
            />
          </AntRow>
          <AntRow gutter={30}>
            {/* 用户名字段 */}
            <OrgUsernameField
              form={form}
              userExists={userExists}
              existingUsername={existingUsername}
              canEdit={false}
            />

            {/* 电话字段 */}
            <OrgPhoneField
              form={form}
              userExists={userExists}
              existingPhone={existingPhone}
              verifyResult={verifyResult}
              canEdit={false}
            />
          </AntRow>
          <AntRow gutter={30}>
            {/* 描述字段 */}
            <OrgDescriptionField form={form} canEdit={canEdit} />
          </AntRow>
          {/* 描述字段 */}
        </AntForm>
        {/* 操作按钮 */}
        <div className={styles.btns}>
          {canEdit ? (
            [
              <FormButton key="org_common.action.cancel" onClick={onCancel}>
                {t('common.action.cancel')}
              </FormButton>,
              <FormButton
                key="org_common.action.save"
                color="primary"
                variant="solid"
                onClick={onSave}
              >
                {t('common.action.save')}
              </FormButton>,
            ]
          ) : (
            <FormButton key="org_common.action.modify" color="default" onClick={onEdit}>
              {t('common.action.modify')}
            </FormButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationView;
