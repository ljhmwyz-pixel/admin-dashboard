import React, { useState } from 'react';
import { Form } from 'antd';

import { FormButton, FormInput, FormModal, FormSelect, ImageIcons } from '@/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

const OrganizationView: React.FC = () => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const detail = {
    id: '1',
    OrganizationAddress: 'No.300 Miaoqiao Road, Pudong, Shanghai',
    CountryRegion: 'China',
    PostalCode: '201315',
    AdminName: 'Mark Tong',
    PhoneNumber: '--',
    Comment: 'Australia',
    Email: 'm******g@pylontech.com.cn',
  };
  const { t } = useLanguage();
  const { success } = FormModal();

  const onEdit = () => {
    // setIsEdit(true);
    // form.setFieldsValue(detail);
    success({
      title: 'Success !',
      content:
        'The organization has been successfully created. An email containing intial login password has been sent to the administrator’s email address.',
      onOk: onCancel,
    });
    // warningConfirm({
    //   title: 'Sub-Organizations Exists !',
    //   content:
    //     'This organization cannot be deleted while it has sub-organizations.Please remove or reassign the sub-organizations first.',
    //   onOk: onCancel,
    //   okButtonProps: {
    //     disabled: true,
    //   },
    //   cancelButtonProps: {
    //     disabled: true,
    //   },
    // });
  };
  const onCancel = () => {
    setIsEdit(false);
    form.setFieldsValue(detail);
  };
  const onSave = () => {
    form.validateFields().then((values) => {
      console.log(values);
      setIsEdit(false);
    });
  };
  return (
    <div className={styles.organizationView}>
      {/* 组织基本信息 */}
      <OrgInfo />
      <Form form={form} layout="vertical" initialValues={detail}>
        <div className={styles.formGroups}>
          <FormInput
            label={t('org.field.address')}
            name="OrganizationAddress"
            prefixIcon={<img src={ImageIcons.form.orgAddressIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: t('org.placeholder.select_org_address'),
            }}
          />
          <FormSelect
            label={t('org.field.country_region')}
            name="CountryRegion"
            prefixIcon={<img src={ImageIcons.form.orgCountryIcon} width={14} height={14} />}
            selectProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: t('org.placeholder.select_country_region'),
            }}
          />
          <FormInput
            label={t('org.field.postal_code')}
            name="PostalCode"
            prefixIcon={<img src={ImageIcons.form.orgPostalCodeIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: t('org.placeholder.enter_postal_code'),
            }}
          />
          <FormInput
            label={t('org.field.username')}
            name="AdminName"
            prefixIcon={<img src={ImageIcons.form.orgAdminNameIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: t('org.placeholder.enter_username'),
            }}
          />
          <FormInput
            label={t('org.field.email')}
            name="Email"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            rules={[{ required: true, message: t('org.validation.email.required') }]}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: t('guest.placeholder.email'),
            }}
          />
          <FormInput
            label={t('org.field.phone')}
            name="PhoneNumber"
            prefixIcon={<img src={ImageIcons.form.orgPhoneIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: t('org.placeholder.enter_phone'),
            }}
          />
          <FormInput
            label={t('org.field.comment')}
            name="Comment"
            prefixIcon={<img src={ImageIcons.form.orgCommentIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: t('org.placeholder.enter_comment'),
            }}
          />
        </div>
      </Form>
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
  );
};

export default OrganizationView;
