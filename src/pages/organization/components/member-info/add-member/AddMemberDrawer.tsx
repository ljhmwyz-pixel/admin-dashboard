import React, { useState } from 'react';
import { OrganizationInfo } from '@pages/organization/components';
import type { AddMemberFormData, FieldProps, TreeNodeData } from '@pages/organization/dto';
import { AntForm, AntSteps } from '@shared/components';

import { FormButton, FormDrawer } from '@/components';
import { useThemeModal } from '@/components/Modal';
import { useOrganizationForm } from '@/pages/organization/hooks';

import AddMemberAssignRoles from './AddMemberAssignRoles';
import AddMemberAssociatePlants from './AddMemberAssociatePlants';
import AddMemberBasicInfo from './AddMemberBasicInfo';

import styles from './AddMemberDrawer.module.scss';

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
  /** 组织 ID */
  orgId: string;
  /** 当前节点数据 */
  currentParentNode?: TreeNodeData;
}

/**
 * 新增成员抽屉组件
 * 实现三步式新增成员流程：
 * 1. 基本信息（邮箱、用户名、电话）
 * 2. 分配角色
 * 3. 关联电站
 *
 * 功能特性：
 * - 支持分步表单提交
 * - 支持步骤导航（上一步/下一步）
 * - 支持表单数据状态管理
 * - 支持邮箱查重和用户类型判断
 */
const AddMemberDrawer: React.FC<AddMemberDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
  orgId,
  currentParentNode,
}) => {
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = AntForm.useForm();
  /** 表单数据 */
  const [formData, setFormData] = useState<AddMemberFormData>({
    basicInfo: { orgEmail: '', orgUsername: '', orgPhone: '' },
    role: [],
    plants: { organizationKeys: [], plantKeys: [] },
  });
  const { warning, warningConfirm } = useThemeModal();
  const { existingUsername, existingPhone, verifyEmail, setExistingPhone, setExistingUsername } =
    useOrganizationForm(currentParentNode);

  /** 步骤配置 */
  const steps = [{ title: 'Basic Info' }, { title: 'Assign Roles' }, { title: 'Associate Plants' }];

  /**
   * 处理基本信息提交
   */
  const handleBasicInfoSubmit = async (values: AddMemberFormData['basicInfo']) => {
    const emailResult = await verifyEmail?.(values.orgEmail);
    const { userExists, userType = '' } = emailResult || {};
    // 内部用户或者访客用户不能新增
    if (userType === 'GUEST' || userType === 'INTERNAL' || userExists) {
      warning({
        title: 'Email Exists !',
        content: 'This email address is already in ues.',
        onOk: () => {
          handleCancel();
        },
      });

      return;
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
    onSuccess({ ...formData, plants: values });
    setTimeout(() => {
      handleCloseDrawer();
    }, 0);
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
    const formValues = form.getFieldsValue(true);
    const hasValues = Object.values(formValues).some((value) => {
      return value !== undefined && value !== null && value !== '';
    });
    // 如果表单有改动，显示确认弹窗
    if (hasValues) {
      warningConfirm({
        title: 'Unsaved Changes !',
        content: 'You have unsaved changes. Are you sure you want to exit without saving?',
        okText: 'Exit',
        cancelText: 'Cancel',
        okButtonProps: {
          danger: true,
        },
        onOk: () => {
          handleCloseDrawer();
        },
      });
    } else {
      handleCloseDrawer();
    }
  };

  const handleCloseDrawer = () => {
    // 表单没有改动，直接关闭
    form.resetFields();
    setCurrentStep(0);
    setFormData({
      basicInfo: { orgEmail: '', orgUsername: '', orgPhone: '' },
      role: [],
      plants: { organizationKeys: [], plantKeys: [] },
    });
    // 重置已存在的用户名和电话
    setExistingUsername('');
    setExistingPhone('');
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
    <FormDrawer
      title="Add Member"
      open={visible}
      placement="right"
      closable={{ placement: 'end' }}
      onClose={handleCancel}
      styles={{
        header: {
          padding: '18px 20px',
        },
        body: {
          padding: 0,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
      }}
      destroyOnHidden
      size="60%"
    >
      {currentParentNode && (
        <OrganizationInfo
          orgName={currentParentNode?.title}
          orgType={currentParentNode?.type}
          orgId={currentParentNode?.key}
        />
      )}
      {/* 步骤容器 */}
      <div className={styles.stepsContainer}>
        {/* 左侧步骤条 */}
        <div className={styles.stepsSidebar}>
          <AntSteps current={currentStep} items={steps} orientation="vertical" />
        </div>

        {/* 右侧步骤内容 */}
        <div className={styles.stepRight}>
          <div className={styles.stepsContent}>{renderStepContent()}</div>
          <div className={styles.actions}>
            <FormButton color="default" onClick={handleCancel}>
              Cancel
            </FormButton>
            {currentStep > 0 && (
              <FormButton onClick={handlePrevious} className={styles.button}>
                Previous
              </FormButton>
            )}
            {currentStep === steps.length - 1 ? (
              <FormButton
                type="primary"
                variant="solid"
                onClick={() => form.submit()}
                className={styles.button}
              >
                Confirm
              </FormButton>
            ) : (
              <FormButton
                type="primary"
                variant="solid"
                className={styles.button}
                onClick={() => form.submit()}
              >
                Next
              </FormButton>
            )}
          </div>
        </div>
      </div>
    </FormDrawer>
  );
};

export default AddMemberDrawer;
