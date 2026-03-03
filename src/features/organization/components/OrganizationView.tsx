import React from 'react';
import { Form } from 'antd';

import { FormInput, FormSelect, FormTextArea, ImageIcons } from '@/components';

import OrgInfo from './OrganizationInfo';

import styles from './OrganizationView.module.scss';

const OrganizationView: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className={styles.organizationView}>
      {/* 组织基本信息 */}
      <OrgInfo />
      <Form
        form={form}
        initialValues={{
          OrganizationAddress: 'No.300 Miaoqiao Road, Pudong, Shanghai',
          CountryRegion: 'China',
          PostalCode: '201315',
          AdminName: 'Mark Tong',
          PhoneNumber: '--',
          Comment: 'Australia',
          Email: 'm******g@pylontech.com.cn',
        }}
      >
        <div className={styles.formGroups}>
          <FormInput
            label="Organization Address"
            name="OrganizationAddress"
            prefixIcon={<img src={ImageIcons.form.orgAddressIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormSelect
            label="Country / Region"
            name="CountryRegion"
            prefixIcon={<img src={ImageIcons.form.orgCountryIcon} width={14} height={14} />}
            selectProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormInput
            label="Postal Code"
            name="PostalCode"
            prefixIcon={<img src={ImageIcons.form.orgPostalCodeIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormInput
            label="Admin Name"
            name="AdminName"
            prefixIcon={<img src={ImageIcons.form.orgAdminNameIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormInput
            label="Email"
            name="Email"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormInput
            label="Phone Number"
            name="PhoneNumber"
            prefixIcon={<img src={ImageIcons.form.orgPhoneIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
          <FormTextArea
            label="Comment"
            name="Comment"
            prefixIcon={<img src={ImageIcons.form.orgCommentIcon} width={14} height={14} />}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '',
            }}
          />
        </div>
      </Form>
    </div>
  );
};

export default OrganizationView;
