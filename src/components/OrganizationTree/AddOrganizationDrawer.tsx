import React from 'react';
import { Drawer, Form, Input, Select, Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddOrganizationProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (values: OrganizationFormData) => void;
  parentNode?: TreeNodeData; // 父节点信息，用于确定添加位置
}

import type { TreeNodeData, OrganizationFormData } from '../../types/organization';

const { Option } = Select;

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({ 
  visible, 
  onClose, 
  onAdd,
  parentNode 
}) => {
  const [form] = Form.useForm();
  
  const handleSubmit = async (values: OrganizationFormData) => {
    try {
      // 验证必填字段
      if (!values.organizationName || !values.organizationType) {
        message.error('请填写组织名称和组织类型');
        return;
      }
      
      // 添加父节点信息到提交数据中
      const submitData = {
        ...values,
        parentId: parentNode?.key || null,
        parentTitle: parentNode?.title || null
      };
      
      onAdd(submitData);
      message.success('组织添加成功！');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('添加组织失败:', error);
      message.error('添加组织失败，请重试');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={
        <Space>
          <PlusOutlined />
          <span>新增组织</span>
        </Space>
      }
      width={720}
      placement="right"
      closable={true}
      onClose={handleCancel}
      open={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            确认
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          organizationType: 'installer',
          ...(parentNode && { parentId: parentNode.key })
        }}
      >
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
            { type: 'email', message: '请输入有效的邮箱地址' }
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
        <Form.Item
          label="备注"
          name="comment"
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddOrganizationDrawer;