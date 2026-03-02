import React, { useState } from 'react';
import { CommentOutlined, EnvironmentOutlined, MailOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import FormInput from '@/components/FormInput';

import styles from './OrganizationView.module.scss';

const OrganizationView: React.FC = () => {
  const [form] = Form.useForm();
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // 简单的邮箱验证示例
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter the correct email');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className={styles.organizationView}>
      <div className={styles.orgInfo}>上边距还未去掉</div>
      {/* <Form
        form={form}
        initialValues={{
          address: 'No.300 Miaojiao Road, Pudong, Shanghai',
        }}
      >
        <FormInput
          name="address"
          label="Organization Address"
          icon={<EnvironmentOutlined />}
          mode="edit"
          rules={[
            { required: true, message: 'Address is required' },
            { min: 5, message: 'Address too short' },
          ]}
        />
      </Form> */}
    </div>
  );
};

export default OrganizationView;
