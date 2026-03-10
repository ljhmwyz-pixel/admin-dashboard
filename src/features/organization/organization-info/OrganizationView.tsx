import React, { useCallback, useEffect, useState } from 'react';
import { Spin } from 'antd';

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
import { useThemeModal } from '@/components/Modal';
import { Permission } from '@/components/Permission';
import { PermissionCode } from '@/components/Permission/permissionCode';
import organizationApi from '@/services/modules/organization/organizationApi';
import { AntForm, AntRow } from '@/shared/components/antd-imports';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { type OrganizationFormData, useOrganizationForm } from '@/shared/hooks/useOrganizationForm';
import type { TreeNodeData } from '@/shared/types/organization';
import { getParentNode } from '@/shared/utils/dataTransformer';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

interface OrganizationViewIProps {
  orgId: string;
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  loadData: () => void;
  setLoading: (loading: boolean) => void;
}
const OrganizationView: React.FC<OrganizationViewIProps> = ({
  orgId,
  currentParentNode,
  treeData,
  loadData,
  setLoading,
}) => {
  const [form] = AntForm.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const { t } = useLanguage();
  const {
    existingUsername,
    existingPhone,
    verifyResultByUpdate,
    verifyEmail,
    verifyOrganizationByUpdate,
  } = useOrganizationForm(currentParentNode);
  const { success: ModalSuccess, error: ModalError, warningConfirm } = useThemeModal();

  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  useEffect(() => {
    if (!orgId) return;
    setSpinning(true);
    fetchDetail(orgId);
    setCanEdit(false);
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
      if (res.code === 200) {
        setValue(res);
        setDetail(res.data);
      }
    } catch (error) {
      console.error('Get org detail failed:', error);
    } finally {
      setSpinning(false);
    }
  };
  const handleEdit = () => {
    setCanEdit(true);
  };
  const handleCancel = () => {
    const formValues = form.getFieldsValue();
    const fieldMap = {
      orgName: 'orgName',
      orgDescription: 'description',
      orgAddress: 'address',
      orgCountryRegion: 'regionCode',
      orgPostalCode: 'zipCode',
      orgType: 'orgType',
    };

    const isSame = Object.entries(fieldMap).every(
      ([formKey, detailKey]) => formValues[formKey] === detail?.[detailKey],
    );
    if (isSame) {
      setCanEdit(false);
      setValue({ data: detail });
    } else {
      warningConfirm({
        title: t('org.dialog.unsaved.title'),
        content: t('org.dialog.unsaved.content'),
        okText: 'Exit',
        onOk: () => {
          setCanEdit(false);
          setValue({ data: detail });
        },
      });
    }
  };
  const handleSubmit = useCallback(
    async (values: OrganizationFormData) => {
      try {
        setSpinning(true);
        setLoading(true);
        const verifyData = await verifyOrganizationByUpdate({ ...values, orgId });
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
        setLoading(false);
        setSpinning(false);
      }
    },
    [setLoading, verifyOrganizationByUpdate, orgId, handleUpdateOrganization],
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
            loadData?.();
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
    <Spin description="加载中..." spinning={spinning}>
      <div className={styles.organizationView}>
        {/* 组织基本信息 */}
        {parentNode && (
          <OrgInfo orgName={parentNode?.title} orgType={parentNode?.type} orgId={parentNode?.key} />
        )}
        {/* 组织信息编辑 */}
        <div className={styles.editContainer}>
          <AntForm form={form} layout="vertical" initialValues={detail}>
            <AntRow gutter={30}>
              {/* 组织名称字段 */}
              <OrgNameField form={form} verifyResult={verifyResultByUpdate} canEdit={canEdit} />

              {/* 组织类型字段 */}
              <OrgTypeField form={form} parentOrgType={currentParentNode?.type} canEdit={canEdit} />
            </AntRow>
            <AntRow gutter={30}>
              {/* 组织地址字段 */}
              <OrgAddressField form={form} verifyResult={verifyResultByUpdate} canEdit={canEdit} />

              {/* 国家地区字段 */}
              <OrgCountryRegionField form={form} canEdit={false} />
            </AntRow>
            <AntRow gutter={30}>
              {/* 邮政编码字段 */}
              <OrgPostalCodeField form={form} canEdit={canEdit} />
            </AntRow>
            <AntRow gutter={30}>
              {/* 邮箱字段 */}
              <OrgEmailField form={form} onCheckEmailExists={verifyEmail} canEdit={false} />
            </AntRow>
            <AntRow gutter={30}>
              {/* 用户名字段 */}
              <OrgUsernameField form={form} existingUsername={existingUsername} canEdit={false} />

              {/* 电话字段 */}
              <OrgPhoneField form={form} existingPhone={existingPhone} canEdit={false} />
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
                <FormButton key="org_common.action.cancel" onClick={handleCancel}>
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
              <Permission value={PermissionCode.ORG_EDIT}>
                <FormButton key="org_common.action.modify" color="default" onClick={handleEdit}>
                  {t('common.action.modify')}
                </FormButton>
              </Permission>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default OrganizationView;
