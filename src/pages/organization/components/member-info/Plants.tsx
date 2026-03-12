import React, { useState } from 'react';
import { Input, Space, Table, Tabs } from 'antd';

interface PlantsProps {
  member: any;
}

const { TabPane } = Tabs;

/**
 * 成员 Plants 信息组件
 * 展示成员可访问的电站信息，分为组织级别和电站级别
 */
const Plants: React.FC<PlantsProps> = ({ member }) => {
  const [orgSearch, setOrgSearch] = useState<string>('');
  const [plantSearch, setPlantSearch] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);

  // 模拟组织数据（仅展示当前登录组织及其下级，不展示上级）
  const organizations = [
    { value: 'org1', label: 'Pylontech' },
    { value: 'org2', label: 'Dealer A' },
    { value: 'org3', label: 'Dealer B' },
  ];

  // 模拟电站数据
  const plants = [
    { key: 'plant1', name: 'Plant 1', id: 'PRC-NXW-644W1' },
    { key: 'plant2', name: 'Plant 2', id: 'PRC-NXW-644W2' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Tabs defaultActiveKey="organization">
        {/* 组织级别 */}
        <TabPane tab="Organization Level" key="organization">
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Selected Organization (1)</span>
              <Input
                placeholder="Please enter organization name..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </Space>

          <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden' }}>
            <Table
              dataSource={organizations}
              columns={[
                {
                  title: '',
                  dataIndex: 'checkbox',
                  render: (_, record) => (
                    <input
                      type="checkbox"
                      checked={selectedOrg === record.value}
                      onChange={() => setSelectedOrg(record.value)}
                    />
                  ),
                },
                {
                  title: '',
                  dataIndex: 'label',
                  key: 'label',
                },
              ]}
              pagination={false}
              rowKey="value"
            />
          </div>
        </TabPane>

        {/* 电站级别 */}
        <TabPane tab="Plant Level" key="plant">
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Selected Plants</span>
              <Input
                placeholder="Please enter plant name..."
                value={plantSearch}
                onChange={(e) => setPlantSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </Space>

          <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden' }}>
            <Table
              dataSource={plants}
              columns={[
                {
                  title: '',
                  dataIndex: 'checkbox',
                  render: (_, record) => (
                    <input
                      type="checkbox"
                      checked={selectedPlants.includes(record.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlants([...selectedPlants, record.key]);
                        } else {
                          setSelectedPlants(selectedPlants.filter((key) => key !== record.key));
                        }
                      }}
                    />
                  ),
                },
                {
                  title: 'Plant Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Plant ID',
                  dataIndex: 'id',
                  key: 'id',
                },
              ]}
              pagination={false}
              rowKey="key"
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Plants;
