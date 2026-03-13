import React from 'react';
import { Form } from 'antd';

import { OrgEmailField, OrgPhoneField, OrgUsernameField } from '../form-fields';

import styles from './AddMemberBasicInfo.module.scss';

/**
 * AddMemberBasicInfo 组件属性接口
 */
interface AddMemberBasicInfoProps {
  /** 表单实例 */
  form: any;
  /** 提交回调 */
  onSubmit: (values: any) => void;
}

/**
 * 新增成员第一步：基本信息
 * 收集用户的邮箱、用户名和电话号码
 */
const AddMemberBasicInfo: React.FC<AddMemberBasicInfoProps> = ({ form, onSubmit }) => {
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <div className={styles.stepContent}>
        <OrgEmailField form={form} canEdit span={24} />
        <OrgUsernameField form={form} span={24} canEdit />
        <OrgPhoneField form={form} span={24} canEdit required={true} />
      </div>
    </Form>
  );
};

export default AddMemberBasicInfo;
