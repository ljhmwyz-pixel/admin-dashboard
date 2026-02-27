import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Divider, Splitter } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import './OrganizationList.css';

const OrganizationList: React.FC = () => {
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 模拟组织数据
  const organizationData = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      code: 'TS001',
      type: 'Technology',
      status: 'active',
      createdAt: '2024-01-15',
      members: 150,
      description: '专注于技术创新的解决方案公司'
    },
    {
      id: 2,
      name: 'Marketing Pro Ltd.',
      code: 'MP002',
      type: 'Marketing',
      status: 'active',
      createdAt: '2024-02-20',
      members: 85,
      description: '专业的数字营销服务提供商'
    },
    {
      id: 3,
      name: 'Finance Group LLC',
      code: 'FG003',
      type: 'Finance',
      status: 'inactive',
      createdAt: '2023-11-10',
      members: 42,
      description: '金融服务和投资咨询公司'
    },
    {
      id: 4,
      name: 'Health Care Partners',
      code: 'HCP004',
      type: 'Healthcare',
      status: 'active',
      createdAt: '2024-01-05',
      members: 120,
      description: '医疗健康服务合作伙伴'
    }
  ];

  // 组织详情数据
  const [selectedOrganization, setSelectedOrganization] = useState<any>(organizationData[0]);

  // 表格列定义
  const columns = [
    {
      title: '组织名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Button 
          type="link" 
          style={{ padding: 0 }}
          onClick={() => setSelectedOrganization(record)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '组织编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
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
      title: '成员数',
      dataIndex: 'members',
      key: 'members',
    }
  ];

  // 过滤后的数据
  const filteredData = organizationData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         item.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="organization-list-page">
      <Card 
        title="组织列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            新增组织
          </Button>
        }
        style={{ height: '100%' }}
        bodyStyle={{ height: 'calc(100% - 56px)', padding: 0 }}
      >
        <Splitter 
          style={{ height: '100%' }}
        >
          {/* 左侧面板 - 组织列表 */}
          <Splitter.Panel>
            <div className="organization-list-panel">
              {/* 搜索和筛选区域 */}
              <div className="organization-search-area">
                <Input
                  placeholder="搜索组织名称或编码"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  <Select.Option value="all">全部状态</Select.Option>
                  <Select.Option value="active">活跃</Select.Option>
                  <Select.Option value="inactive">非活跃</Select.Option>
                </Select>
              </div>

              {/* 组织表格 */}
              <div className="organization-table-container">
                <Table 
                  dataSource={filteredData} 
                  columns={columns} 
                  rowKey="id"
                  pagination={false}
                  scroll={{ y: '100%' }}
                  rowClassName={(record) => 
                    selectedOrganization?.id === record.id ? 'selected-row' : ''
                  }
                  onRow={(record) => ({
                    onClick: () => setSelectedOrganization(record)
                  })}
                />
              </div>
            </div>
          </Splitter.Panel>

          {/* 右侧面板 - 组织详情 */}
          <Splitter.Panel>
            <div className="organization-detail-panel">
              {selectedOrganization ? (
                <div className="organization-detail-content">
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 16px 0', color: '#1d1d1d' }}>
                      {selectedOrganization.name}
                    </h2>
                    <Tag color="blue">{selectedOrganization.code}</Tag>
                    <Tag color={selectedOrganization.status === 'active' ? 'success' : 'default'}>
                      {selectedOrganization.status === 'active' ? '活跃' : '非活跃'}
                    </Tag>
                  </div>

                  <Divider />

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0' }}>基本信息</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                      <span style={{ color: '#666' }}>组织类型:</span>
                      <span>{selectedOrganization.type}</span>
                      
                      <span style={{ color: '#666' }}>成员数量:</span>
                      <span>{selectedOrganization.members} 人</span>
                      
                      <span style={{ color: '#666' }}>创建时间:</span>
                      <span>{selectedOrganization.createdAt}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0' }}>组织描述</h3>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                      {selectedOrganization.description}
                    </p>
                  </div>

                  <Divider />

                  <div>
                    <h3 style={{ margin: '0 0 16px 0' }}>操作</h3>
                    <Space>
                      <Button type="primary" icon={<EditOutlined />}>编辑组织</Button>
                      <Button icon={<DeleteOutlined />}>删除组织</Button>
                    </Space>
                  </div>
                </div>
              ) : (
                <div className="organization-placeholder">
                  <p>请选择一个组织查看详情</p>
                </div>
              )}
            </div>
          </Splitter.Panel>
        </Splitter>
      </Card>
    </div>
  );
};

export default OrganizationList;