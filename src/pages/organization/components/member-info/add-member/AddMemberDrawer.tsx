import React, { useState } from 'react';
import { ApartmentOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { OrganizationInfo } from '@pages/organization/components';
import type { AddMemberFormData, TreeNodeData } from '@pages/organization/dto';
import { AntButton, AntDrawer, AntForm, AntSteps } from '@shared/components';

import { useThemeModal } from '@/components/Modal';
import { useOrganizationForm } from '@/pages/organization/hooks';

import AddMemberAssignRoles from './AddMemberAssignRoles';
import AddMemberAssociatePlants from './AddMemberAssociatePlants';
import AddMemberBasicInfo from './AddMemberBasicInfo';

import styles from './AddMember.module.scss';

/**
 * AddMemberDrawer 组件属性接口
 */
interface AddMemberDrawerProps {
  /** 抽屉是否可见 */
  visible: boolean;
  /** 关闭抽屉回调 */
  onClose: () => void;
  /** 新增成功回调 */
  onSuccess: (formData: AddMemberFormData) => void;
  /** 组织ID */
  orgId: string;
  /** 父组织节点数据 */
  parentNodeData: TreeNodeData | null;
  /** 当前节点数据 */
  currentParentNode?: TreeNodeData;
}

/**
 * 新增成员抽屉组件
 * 实现三步式新增成员流程：
 * 1. 基本信息（邮箱、用户名、电话）
 * 2. 分配角色
 * 3. 关联电站
 */
const AddMemberDrawer: React.FC<AddMemberDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
  orgId,
  parentNodeData,
  currentParentNode,
}) => {
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState(0);
  /** 表单数据 */
  const [formData, setFormData] = useState<AddMemberFormData>({
    basicInfo: { orgEmail: '', orgUsername: '', orgPhone: '' },
    role: [],
    plants: { organizationKeys: [], plantKeys: [] },
  });
  /** 表单实例 */
  const [form] = AntForm.useForm();
  const { warning } = useThemeModal();
  const { existingUsername, existingPhone, verifyEmail } = useOrganizationForm(currentParentNode);

  /** 步骤配置 */
  const steps = [
    { title: 'Basic Info', icon: <UserOutlined /> },
    { title: 'Assign Roles', icon: <ApartmentOutlined /> },
    { title: 'Associate Plants', icon: <ThunderboltOutlined /> },
  ];

  /**
   * 处理基本信息提交
   */
  const handleBasicInfoSubmit = async (values: AddMemberFormData['basicInfo']) => {
    const emailResult = await verifyEmail?.(values.orgEmail);
    const {
      userExists,
      existingUsername = '',
      existingPhone = '',
      userType = '',
    } = emailResult || {};
    // 内部用户或者访客用户不能新增
    if (userType === 'GUEST' || userType === 'INTERNAL') {
      warning({
        title: 'Email Exists !',
        content: 'This email address is already in ues.',
        onOk: () => {
          handleCancel();
        },
      });

      return;
    }
    if (userExists) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...values,
          orgUsername: existingUsername,
          orgPhone: existingPhone,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        basicInfo: values,
      }));
    }
    setCurrentStep(1);
  };

  /**
   * 处理角色分配提交
   */
  const handleRolesSubmit = (values: AddMemberFormData['role']) => {
    setFormData((prev) => ({
      ...prev,
      ...values,
    }));
    setCurrentStep(2);
  };

  /**
   * 处理电站关联提交
   */
  const handlePlantsSubmit = (values: AddMemberFormData['plants']) => {
    setFormData((prev) => ({
      ...prev,
      plants: values,
    }));
    // 这里可以调用新增成员的API
    onSuccess({ ...formData, plants: values });
  };

  /**
   * 处理上一步
   */
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  /**
   * 处理取消
   */
  const handleCancel = () => {
    // 重置表单和状态
    form.resetFields();
    setCurrentStep(0);
    setFormData({
      basicInfo: { orgEmail: '', orgUsername: '', orgPhone: '' },
      role: [],
      plants: { organizationKeys: [], plantKeys: [] },
    });
    onClose();
  };

  /**
   * 渲染步骤内容
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddMemberBasicInfo
            form={form}
            onSubmit={handleBasicInfoSubmit}
            verifyEmail={verifyEmail}
            existingPhone={existingPhone}
            existingUsername={existingUsername}
            onCancel={handleCancel}
          />
        );
      case 1:
        return <AddMemberAssignRoles form={form} onSubmit={handleRolesSubmit} orgId={orgId} />;
      case 2:
        return <AddMemberAssociatePlants form={form} onSubmit={handlePlantsSubmit} orgId={orgId} />;
      default:
        return null;
    }
  };

  return (
    <AntDrawer
      title="Add Member"
      open={visible}
      onClose={handleCancel}
      placement="right"
      destroyOnHidden
      size="60%"
      footer={
        <div className={styles.actions}>
          <AntButton onClick={handleCancel} style={{ marginLeft: 8 }}>
            Cancel
          </AntButton>
          {currentStep > 0 && (
            <AntButton onClick={handlePrevious} style={{ marginRight: 8 }}>
              Previous
            </AntButton>
          )}
          {currentStep === steps.length - 1 ? (
            <AntButton type="primary" onClick={() => form.submit()}>
              Confirm
            </AntButton>
          ) : (
            <AntButton type="primary" onClick={() => form.submit()}>
              Next
            </AntButton>
          )}
        </div>
      }
    >
      {parentNodeData && (
        <OrganizationInfo
          orgName={parentNodeData?.title}
          orgType={parentNodeData?.type}
          orgId={parentNodeData?.key}
        />
      )}
      {/* 步骤容器 */}
      <div className={styles.stepsContainer}>
        {/* 左侧步骤条 */}
        <div className={styles.stepsSidebar}>
          <AntSteps current={currentStep} items={steps} orientation="vertical" />
        </div>

        {/* 右侧步骤内容 */}
        <div className={styles.stepsContent}>{renderStepContent()}</div>
      </div>
    </AntDrawer>
  );
};

export default AddMemberDrawer;
