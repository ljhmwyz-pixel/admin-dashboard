import React, { useCallback, useEffect, useState } from 'react';

import { FormButton, FormModal } from '@/components';
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
  const { showLoading, hideLoading } = useGlobalLoading();
  const {
    userExists,
    existingUsername,
    existingPhone,
    verifyResult,
    verifyEmail,
    verifyOrganization,
  } = useOrganizationForm(currentParentNode);
  const { success: ModalSuccess, error: ModalError } = FormModal();

  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  useEffect(() => {
    if (!orgId) return;
    fetchDetail(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);
  /**
   * 编辑组织
   */
  const handleUpdateOrganization = useCallback(async (values: OrganizationFormData) => {
    const response = await organizationApi.update(values);
    return response;
  }, []);

  const setValue = (res: any) => {
    form.setFieldsValue({
      orgName: res.data.orgName,
      orgDescription: res.data.description,
      orgUsername: res.data.ownerUserName,
      orgPhone: res.data.ownerPhone,
      orgEmail: res.data.ownerEmail,
      orgPostalCode: res.data.zipCode,
      orgType: res.data.orgType,
      orgAddress: res.data.address,
      orgCountryRegion: res.data.regionCode,
    });
  };
  const fetchDetail = async (orgId: string) => {
    try {
      const res = await organizationApi.detail({ orgId });
      setValue(res);
      if (res.code === 200) {
        setDetail(res.data);
      }
    } catch (error) {
      console.error('Get org detail failed:', error);
    }
  };
  const onEdit = () => {
    setCanEdit(true);
    form.setFieldsValue({ res: detail });
  };
  const onCancel = () => {
    setCanEdit(false);
    form.setFieldsValue({ res: detail });
  };
  const handleSubmit = useCallback(
    async (values: OrganizationFormData) => {
      showLoading();
      try {
        const verifyData = await verifyOrganization(values);
        if (!verifyData.valid) {
          return { success: false, reason: 'validation_failed', verifyData };
        }
        const requestData: OrganizationFormData = {
          orgName: values.orgName || '',
          orgType: values.orgType || '',
          address: values.orgAddress || '',
          regionCode: values.orgCountryRegion || '',
          zipCode: values.orgPostalCode || '',
          description: values.orgDescription || '',
          orgId,
        };
        const response = await handleUpdateOrganization(requestData);
        if (response.code === 200) {
          return { success: true, data: response };
        } else {
          return { success: false, reason: 'create_failed', response };
        }
      } catch (error) {
        return { success: false, reason: 'error', error };
      } finally {
        hideLoading();
      }
    },
    [hideLoading, orgId, showLoading, verifyOrganization, handleUpdateOrganization],
  );

  const onSave = () => {
    form
      .validateFields([
        'orgName',
        'orgType',
        'orgAddress',
        'orgPostalCode',
        'orgCountryRegion',
        'orgDescription',
      ])
      .then(async (values) => {
        try {
          const result = await handleSubmit(values);
          if (!result.success) {
            ModalError({
              title: result.reason,
            });
          } else {
            setCanEdit(false);
            fetchDetail(orgId);
            ModalSuccess({
              title: t('org.toast.update_success'),
            });
          }
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
              canEdit={false}
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
