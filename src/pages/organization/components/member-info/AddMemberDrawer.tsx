import React, { useState } from 'react';
import { ApartmentOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Steps } from 'antd';

import type { TreeNodeData } from '../../dto';
import OrganizationInfo from '../organization-info/OrganizationInfo';
import AddMemberAssignRoles from './AddMemberAssignRoles';
import AddMemberAssociatePlants from './AddMemberAssociatePlants';
import AddMemberBasicInfo from './AddMemberBasicInfo';

import styles from './AddMember.module.scss';

/**
 * 新增成员表单数据接口
 */
export interface AddMemberFormData {
  /** 基本信息 */
  basicInfo: {
    /** 邮箱 */
    orgEmail: string;
    /** 用户名 */
    orgUsername: string;
    /** 电话号码 */
    orgPhone: string;
  };
  /** 角色信息 */
  roles: {
    /** 角色ID */
    roleId: string;
    /** 角色名称 */
    roleName: string;
  };
  /** 电站信息 */
  plants: {
    /** 组织ID列表 */
    organizationKeys: string[];
    /** 电站ID列表 */
    plantKeys: string[];
  };
}

/**
 * AddMemberDrawer 组件属性接口
 */
interface AddMemberDrawerProps {
  /** 抽屉是否可见 */
  visible: boolean;
  /** 关闭抽屉回调 */
  onClose: () => void;
  /** 新增成功回调 */
  onSuccess: () => void;
  /** 组织ID */
  orgId: string;
  /** 父组织节点数据 */
  parentNodeData: TreeNodeData | null;
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
}) => {
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState(0);
  /** 表单数据 */
  const [formData, setFormData] = useState<AddMemberFormData>({
    basicInfo: { orgEmail: '', orgUsername: '', orgPhone: '' },
    roles: { roleId: '', roleName: '' },
    plants: { organizationKeys: [], plantKeys: [] },
  });
  /** 表单实例 */
  const [form] = Form.useForm();

  /** 步骤配置 */
  const steps = [
    { title: 'Basic Info', icon: <UserOutlined /> },
    { title: 'Assign Roles', icon: <ApartmentOutlined /> },
    { title: 'Associate Plants', icon: <ThunderboltOutlined /> },
  ];

  /**
   * 处理基本信息提交
   */
  const handleBasicInfoSubmit = (values: any) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: values,
    }));
    setCurrentStep(1);
  };

  /**
   * 处理角色分配提交
   */
  const handleRolesSubmit = (values: any) => {
    setFormData((prev) => ({
      ...prev,
      roles: values,
    }));
    setCurrentStep(2);
  };

  /**
   * 处理电站关联提交
   */
  const handlePlantsSubmit = (values: any) => {
    setFormData((prev) => ({
      ...prev,
      plants: values,
    }));
    // 这里可以调用新增成员的API
    console.log('Form Data:', formData);
    onSuccess();
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
      roles: { roleId: '', roleName: '' },
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
        return <AddMemberBasicInfo form={form} onSubmit={handleBasicInfoSubmit} />;
      case 1:
        return <AddMemberAssignRoles form={form} onSubmit={handleRolesSubmit} orgId={orgId} />;
      case 2:
        return <AddMemberAssociatePlants form={form} onSubmit={handlePlantsSubmit} orgId={orgId} />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title="Add Member"
      open={visible}
      onClose={handleCancel}
      placement="right"
      size="60%"
      footer={
        <div className={styles.actions}>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
          {currentStep > 0 && (
            <Button onClick={handlePrevious} style={{ marginRight: 8 }}>
              Previous
            </Button>
          )}
          {currentStep === steps.length - 1 ? (
            <Button type="primary" onClick={() => form.submit()}>
              Confirm
            </Button>
          ) : (
            <Button type="primary" onClick={() => form.submit()}>
              Next
            </Button>
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
          <Steps current={currentStep} direction="vertical" items={steps} />
        </div>

        {/* 右侧步骤内容 */}
        <div className={styles.stepsContent}>{renderStepContent()}</div>
      </div>
    </Drawer>
  );
};

export default AddMemberDrawer;
