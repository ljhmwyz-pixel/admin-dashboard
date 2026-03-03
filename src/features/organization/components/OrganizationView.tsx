import React, { useState } from 'react';
import { Form } from 'antd';

import { FormButton, FormInput, FormSelect, ImageIcons } from '@/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

const OrganizationView: React.FC = () => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [detail, setDetail] = useState({
    id: '1',
    OrganizationAddress: 'No.300 Miaoqiao Road, Pudong, Shanghai',
    CountryRegion: 'China',
    PostalCode: '201315',
    AdminName: 'Mark Tong',
    PhoneNumber: '--',
    Comment: 'Australia',
    Email: 'm******g@pylontech.com.cn',
  });
  const { t } = useLanguage();
  const onEdit = () => {
    setIsEdit(true);
    form.setFieldsValue(detail);
  };
  const onCancel = () => {};
  const onSave = () => {};
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
              placeholder: '',
            }}
          />
          <FormSelect
            label={t('org.field.country_region')}
            name="CountryRegion"
            prefixIcon={<img src={ImageIcons.form.orgCountryIcon} width={14} height={14} />}
            selectProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormInput
            label={t('org.field.postal_code')}
            name="PostalCode"
            prefixIcon={<img src={ImageIcons.form.orgPostalCodeIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: '',
            }}
          />
          <FormInput
            label={t('org.field.username')}
            name="AdminName"
            prefixIcon={<img src={ImageIcons.form.orgAdminNameIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: '',
            }}
          />
          <FormInput
            label={t('org.field.email')}
            name="Email"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: '',
            }}
          />
          <FormInput
            label={t('org.field.phone')}
            name="PhoneNumber"
            prefixIcon={<img src={ImageIcons.form.orgPhoneIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: '',
            }}
          />
          <FormInput
            label={t('org.field.comment')}
            name="Comment"
            prefixIcon={<img src={ImageIcons.form.orgCommentIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: !isEdit,
              placeholder: '',
            }}
          />
        </div>
      </Form>
      {/* 操作按钮 */}
      <div className={styles.btns}>
        <FormButton color="default" onClick={onEdit}>
          {t('common.action.modify')}
        </FormButton>
        <FormButton onClick={onCancel}>{t('common.action.cancel')}</FormButton>
        <FormButton color="primary" variant="solid" onClick={onSave}>
          {t('common.action.save')}
        </FormButton>
      </div>
    </div>
  );
};

export default OrganizationView;
