import React from 'react';
import { Drawer, Form, Input, Select } from 'antd';

interface AddOrganizationProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
}

import type { OrganizationFormData } from '@/shared/types/organization';

const { Option } = Select;

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({ visible, onChange }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: OrganizationFormData) => {
    console.log('提交表单:', values);
  };

  const handleCancel = () => {
    form.resetFields();
    onChange?.(false);
  };

  return (
    <Drawer
      title={<div>新增组织</div>}
      size="large"
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={visible}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* 组织名称 */}
        <Form.Item
          label="组织名称"
          name="organizationName"
          rules={[{ required: true, message: '请输入组织名称' }]}
        >
          <Input placeholder="请输入组织名称" />
        </Form.Item>

        {/* 组织类型 */}
        <Form.Item
          label="组织类型"
          name="organizationType"
          rules={[{ required: true, message: '请选择组织类型' }]}
        >
          <Select placeholder="请选择组织类型">
            <Option value="company">公司</Option>
            <Option value="dealer">经销商</Option>
            <Option value="installer">安装商</Option>
          </Select>
        </Form.Item>

        {/* 地址 */}
        <Form.Item
          label="组织地址"
          name="organizationAddress"
          rules={[{ required: true, message: '请输入组织地址' }]}
        >
          <Input placeholder="请输入组织地址" />
        </Form.Item>

        {/* 邮政编码 */}
        <Form.Item
          label="邮政编码"
          name="postalCode"
          rules={[{ required: true, message: '请输入邮政编码' }]}
        >
          <Input placeholder="请输入邮政编码" />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          label="邮箱地址"
          name="emailAddress"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱地址" />
        </Form.Item>

        {/* 联系人姓名 */}
        <Form.Item
          label="联系人姓名"
          name="username"
          rules={[{ required: true, message: '请输入联系人姓名' }]}
        >
          <Input placeholder="请输入联系人姓名" />
        </Form.Item>

        {/* 电话号码 */}
        <Form.Item
          label="电话号码"
          name="phoneNumber"
          rules={[{ required: true, message: '请输入电话号码' }]}
        >
          <Input placeholder="请输入电话号码" />
        </Form.Item>

        {/* 备注 */}
        <Form.Item label="备注" name="comment">
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddOrganizationDrawer;
