import React, { useEffect, useState } from 'react';

import {
  FormButton,
  FormInput,
  FormModal,
  FormSelect,
  FormTextArea,
  ImageIcons,
} from '@/components';
import organizationApi from '@/services/modules/organization/organizationApi';
import { AntCol, AntForm, AntRow } from '@/shared/components/antd-imports';
import { useLanguage } from '@/shared/hooks/useLanguage';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

interface OrganizationViewIProps {
  orgId: string;
}
const OrganizationView: React.FC<OrganizationViewIProps> = ({ orgId }) => {
  const [form] = AntForm.useForm();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [detail, setDetail] = useState({});
  const { t } = useLanguage();
  const { success } = FormModal();

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
    setIsEdit(true);
    form.setFieldsValue(detail);
  };
  const onCancel = () => {
    setIsEdit(false);
    form.setFieldsValue(detail);
  };
  const onSave = () => {
    form.validateFields().then(async (values) => {
      try {
        const requestParams = {
          orgName: 'Updated Dealer Name',
          description: '更新后的描述',
          contactPerson: '李四',
          contactPhone: '0755-87654321',
          contactEmail: 'new-contact@example.com',
          address: '广东省深圳市福田区',
        };
        const res = await organizationApi.update(requestParams);
        if (res.code === 200) {
          setIsEdit(false);
          success({
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
      <OrgInfo orgDetail={detail} />
      {/* 组织信息编辑 */}
      <div className={styles.editContainer}>
        <AntForm form={form} layout="vertical" initialValues={detail}>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.name')}
                name="orgName"
                prefixIcon={<img src={ImageIcons.form.orgAddressIcon} width={14} height={14} />}
                rules={[{ required: true, message: t('org.validation.name.required') }]}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: !isEdit,
                  placeholder: t('org.placeholder.search_org'),
                }}
              />
            </AntCol>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.type')}
                name="orgType"
                prefixIcon={<img src={ImageIcons.form.orgAddressIcon} width={14} height={14} />}
                rules={[{ required: true, message: t('org.validation.type.required') }]}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: !isEdit,
                  placeholder: t('org.placeholder.select_org_type'),
                }}
              />
            </AntCol>
          </AntRow>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.address')}
                name="address"
                rules={[{ required: true, message: t('org.validation.address.required') }]}
                prefixIcon={<img src={ImageIcons.form.orgAddressIcon} width={14} height={14} />}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: !isEdit,
                  placeholder: t('org.placeholder.select_org_address'),
                }}
              />
            </AntCol>
            <AntCol span={12}>
              <FormSelect
                label={t('org.field.country_region')}
                name="countryCode"
                rules={[{ required: true, message: t('org.validation.country.required') }]}
                prefixIcon={<img src={ImageIcons.form.orgCountryIcon} width={14} height={14} />}
                selectProps={{
                  className: styles.inputStyle,
                  disabled: !isEdit,
                  placeholder: t('org.placeholder.select_country_region'),
                }}
              />
            </AntCol>
          </AntRow>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.postal_code')}
                name="zipCode"
                prefixIcon={<img src={ImageIcons.form.orgPostalCodeIcon} width={14} height={14} />}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: !isEdit,
                  placeholder: t('org.placeholder.enter_postal_code'),
                }}
              />
            </AntCol>
          </AntRow>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.email')}
                name="contactEmail"
                prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
                rules={[{ required: true, message: t('org.validation.email.required') }]}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: true,
                  placeholder: t('guest.placeholder.email'),
                }}
              />
            </AntCol>
          </AntRow>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.username')}
                name="contactPerson"
                prefixIcon={<img src={ImageIcons.form.orgAdminNameIcon} width={14} height={14} />}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: true,
                  placeholder: t('org.placeholder.enter_username'),
                }}
              />
            </AntCol>
            <AntCol span={12}>
              <FormInput
                label={t('org.field.phone')}
                name="contactPhone"
                prefixIcon={<img src={ImageIcons.form.orgPhoneIcon} width={14} height={14} />}
                inputProps={{
                  className: styles.inputStyle,
                  disabled: true,
                  placeholder: t('org.placeholder.enter_phone'),
                }}
              />
            </AntCol>
          </AntRow>
          <FormTextArea
            label={t('org.field.comment')}
            name="description"
            prefixIcon={<img src={ImageIcons.form.orgCommentIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: t('org.placeholder.enter_comment'),
            }}
          />
        </AntForm>
        {/* 操作按钮 */}
        <div className={styles.btns}>
          {isEdit ? (
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
