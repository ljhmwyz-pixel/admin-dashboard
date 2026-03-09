import React, { useEffect, useState } from 'react';

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
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useOrganizationForm } from '@/shared/hooks/useOrganizationForm';
import type { TreeNodeData } from '@/shared/types/organization';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

interface OrganizationViewIProps {
  orgId: string;
  currentParentNode: TreeNodeData;
}
const OrganizationView: React.FC<OrganizationViewIProps> = ({ orgId, currentParentNode }) => {
  const [form] = AntForm.useForm();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [detail, setDetail] = useState({});
  const { t } = useLanguage();

  const { userExists, existingUsername, existingPhone, verifyResult, verifyEmail } =
    useOrganizationForm(currentParentNode);

  useEffect(() => {
    if (!orgId) return;

    const fetchDetail = async () => {
      try {
        const res = await organizationApi.detail({ orgId });

        if (res.code === 200) {
          form.setFieldsValue(res.data);
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
  const onSave = () => {
    form.validateFields().then(async (_values) => {
      try {
        // const requestParams = {
        //   orgName: 'Updated Dealer Name',
        //   description: '更新后的描述',
        //   contactPerson: '李四',
        //   contactPhone: '0755-87654321',
        //   contactEmail: 'new-contact@example.com',
        //   address: '广东省深圳市福田区',
        // };
        // const res = await organizationApi.update(requestParams);
        // if (res.code === 200) {
        //   setIsEdit(false);
        //   success({
        //     title: t('org.toast.update_success'),
        //   });
        // }
      } catch (error) {
        console.error('Get org detail failed:', error);
      }
    });
  };
  return (
    <div className={styles.organizationView}>
      {/* 组织基本信息 */}
      <OrgInfo orgDetail={detail} />
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
            <OrgCountryRegionField form={form} canEdit={canEdit} />
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
              canEdit={canEdit}
            />

            {/* 电话字段 */}
            <OrgPhoneField
              form={form}
              userExists={userExists}
              existingPhone={existingPhone}
              verifyResult={verifyResult}
              canEdit={canEdit}
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
