import React, { useState } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Row } from 'antd';

import type { Organization } from '../../../shared/types/organization';
import OrganizationTree from '../../organisms/OrganizationTree/OrganizationTree';

const { Content } = Layout;

/**
 * 组织管理页面
 * 集成组织树展示和管理功能
 */
const OrganizationPage: React.FC = () => {
  const [organizations] = useState<Organization[]>([
    {
      id: '1',
      name: '总公司',
      code: 'COMPANY001',
      type: 'company',
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      children: [
        {
          id: '2',
          name: '技术部',
          code: 'DEPT001',
          type: 'department',
          status: 'active',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
    },
  ]);

  const [loading] = useState(false);

  const handleAddOrganization = () => {
    console.log('Add organization clicked');
  };

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    console.log('Tree selected:', selectedKeys);
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
  };

  return (
    <Content className="organization-page">
      <Card
        title="组织机构管理"
        extra={
          <Row gutter={8}>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOrganization}>
                新增组织
              </Button>
            </Col>
            <Col>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                刷新
              </Button>
            </Col>
          </Row>
        }
      >
        <OrganizationTree
          treeData={organizations}
          onSelect={handleTreeSelect}
          showSearch={true}
          className="organization-tree-wrapper"
        />
      </Card>
    </Content>
  );
};

export default OrganizationPage;
