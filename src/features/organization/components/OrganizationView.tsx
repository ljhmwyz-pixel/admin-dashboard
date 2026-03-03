import React from 'react';
import { Form } from 'antd';

import { FormInput, FormSelect, FormTextArea, ImageIcons } from '@/components';

import styles from './OrganizationView.module.scss';

const OrganizationView: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className={styles.organizationView}>
      <div className={styles.orgInfo}>上边距还未去掉</div>
      <Form
        form={form}
        initialValues={{
          email1: '11111111111',
          Country: 'Australia',
          Region: 'Australia',
        }}
      >
        <div className={styles.formGroups}>
          <FormInput
            label="邮箱地址"
            name="email1"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '格式不正确' },
            ]}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: 'example@domain.com',
            }}
          />
          <FormInput
            label="邮箱地址"
            name="email2"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '格式不正确' },
            ]}
            inputProps={{
              className: styles.inputStyle,
              placeholder: 'example@domain.com',
            }}
          />
        </div>
        <div className={styles.formGroups}>
          <FormTextArea
            label="这是文本域1"
            name="email3"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '111' },
              { type: 'email', message: '2222' },
            ]}
            inputProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: '这是文本域1',
            }}
          />
          <FormTextArea
            label="这是文本域2"
            name="email4"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '3333' },
              { type: 'email', message: '4444' },
            ]}
            inputProps={{
              className: styles.inputStyle,
              placeholder: '这是文本域2',
            }}
          />
        </div>
        <div className={styles.formGroups}>
          <FormSelect
            label="Country / Region"
            name="Country"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '111' },
              { type: 'email', message: '2222' },
            ]}
            selectProps={{
              className: styles.inputStyle,
              disabled: true,
              placeholder: 'Please select country / region',
            }}
          />
          <FormSelect
            label="Country / Region"
            name="Region"
            prefixIcon={<img src={ImageIcons.form.emailIcon} width={14} height={14} />}
            required
            rules={[
              { required: true, message: '3333' },
              { type: 'email', message: '4444' },
            ]}
            selectProps={{
              className: styles.inputStyle,
              placeholder: 'Please select country / region',
            }}
          />
        </div>
      </Form>
    </div>
  );
};

export default OrganizationView;
