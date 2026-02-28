import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import React from 'react';

const OrganizationType: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const dataSource = [
    {
      id: 1,
      name: 'Technology',
      code: 'TECH',
      description: '科技类组织',
      status: 'enabled',
      organizations: 25,
    },
    {
      id: 2,
      name: 'Marketing',
      code: 'MARK',
      description: '市场营销类组织',
      status: 'enabled',
      organizations: 18,
    },
    {
      id: 3,
      name: 'Finance',
      code: 'FIN',
      description: '金融类组织',
      status: 'disabled',
      organizations: 12,
    },
  ];

  const columns = [
    {
      title: '类型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'success' : 'default'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '关联组织数',
      dataIndex: 'organizations',
      key: 'organizations',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('提交数据:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="组织类型管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            新增类型
          </Button>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="新增组织类型"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="类型名称"
            rules={[{ required: true, message: '请输入类型名称' }]}
          >
            <Input placeholder="请输入类型名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="类型编码"
            rules={[{ required: true, message: '请输入类型编码' }]}
          >
            <Input placeholder="请输入类型编码" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" rows={3} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="enabled">
            <Select>
              <Select.Option value="enabled">启用</Select.Option>
              <Select.Option value="disabled">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationType;
