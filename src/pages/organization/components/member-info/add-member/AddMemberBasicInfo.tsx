import React from 'react';
import { OrgEmailField, OrgPhoneField, OrgUsernameField } from '@pages/organization/components';
import { AntForm } from '@shared/components';

import type { FieldProps, OrganizationType } from '@/pages/organization/dto';
import type { EmailVerifyResult } from '@/pages/organization/hooks/useOrganizationForm';

import styles from './AddMemberBasicInfo.module.scss';

/**
 * AddMemberBasicInfo 组件属性接口
 */
interface AddMemberBasicInfoProps {
  /** 表单实例 */
  form: FieldProps['form'];
  /** 提交回调 */
  onSubmit: (values: any) => void;
  /** 验证邮箱是否存在 */
  verifyEmail?: (
    email: string,
    withGlobalLoading?: boolean,
    onCancel?: () => void,
  ) => Promise<EmailVerifyResult>;
  /** 已存在用户的电话 */
  existingPhone?: string;
  /** 已存在用户的用户名 */
  existingUsername?: string;
  /** 取消回调 */
  onCancel?: () => void;
}

/**
 * 新增成员第一步：基本信息
 * 收集用户的邮箱、用户名和电话号码
 *
 * 功能特性：
 * - 支持邮箱验证和查重
 * - 支持用户名自动填充（用户已存在时）
 * - 支持电话号码自动填充（用户已存在时）
 * - 支持表单验证
 */
const AddMemberBasicInfo: React.FC<AddMemberBasicInfoProps> = ({
  form,
  onSubmit,
  verifyEmail,
  existingPhone,
  existingUsername,
  onCancel,
}) => {
  return (
    <AntForm form={form} onFinish={onSubmit} layout="vertical">
      <div className={styles.stepContent}>
        <OrgEmailField
          form={form}
          canEdit
          span={24}
          onCheckEmailExists={verifyEmail}
          onCancel={onCancel}
        />
        <OrgUsernameField form={form} span={24} canEdit existingUsername={existingUsername} />
        <OrgPhoneField
          form={form}
          span={24}
          canEdit
          required={true}
          existingPhone={existingPhone}
        />
      </div>
    </AntForm>
  );
};

export default AddMemberBasicInfo;
