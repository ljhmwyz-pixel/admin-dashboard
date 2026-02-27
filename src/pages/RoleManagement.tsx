import React from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const RoleManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const dataSource = [
    {
      id: 1,
      name: '管理员',
      code: 'ADMIN',
      description: '系统管理员，拥有所有权限',
      status: 'active',
      users: 3,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: '运营人员',
      code: 'OPERATOR',
      description: '负责日常运营管理',
      status: 'active',
      users: 15,
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: '财务人员',
      code: 'FINANCE',
      description: '负责财务管理相关工作',
      status: 'inactive',
      users: 8,
      createdAt: '2024-02-01'
    }
  ];

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
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
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'users',
      key: 'users',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
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
        title="角色管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            新增角色
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
        title="新增角色"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入角色描述" rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">活跃</Select.Option>
              <Select.Option value="inactive">非活跃</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;