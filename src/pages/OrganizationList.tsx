import React, { useState } from 'react';
import { Splitter } from 'antd';

import { AntTabs } from '../components/lib/antd-imports';
import OrganizationTree from '../components/OrganizationTree/OrganizationTree';
import { organizationDetails } from '../mocks/organizationData';

import './OrganizationList.css';

const OrganizationList: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [activeTabKey, setActiveTabKey] = useState<string>('info');

  // 获取当前选中的组织详情
  const currentDetail = organizationDetails[selectedKey] || organizationDetails['p001'];

  // Tab内容配置
  const tabItems = [
    {
      key: 'info',
      label: 'Organization Information',
      children: (
        <div className="organization-detail-content">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <h2>{currentDetail.name}</h2>
            {currentDetail.type === 'company' && (
              <span
                style={{
                  marginLeft: '8px',
                  color: '#1890ff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Parent
              </span>
            )}
            {currentDetail.type === 'dealer' && (
              <span
                style={{
                  marginLeft: '8px',
                  color: '#52c41a',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Dealer
              </span>
            )}
            {currentDetail.type === 'installer' && (
              <span
                style={{
                  marginLeft: '8px',
                  color: '#faad14',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Installer
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Organization Address
                </label>
                <input
                  type="text"
                  value={currentDetail.address}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  value={currentDetail.postalCode}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Email
                </label>
                <input
                  type="text"
                  value={currentDetail.email}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Comment
                </label>
                <textarea
                  value={currentDetail.comment}
                  readOnly
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Country / Region
                </label>
                <input
                  type="text"
                  value={currentDetail.country}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Admin Name
                </label>
                <input
                  type="text"
                  value={currentDetail.adminName}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#595959',
                    fontSize: '14px',
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  value={currentDetail.phoneNumber}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button
              style={{
                backgroundColor: '#1677ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Modify
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'role-list',
      label: 'Role List',
      children: (
        <div className="organization-detail-content">
          <p>Role list content will be implemented here.</p>
        </div>
      ),
    },
    {
      key: 'member-list',
      label: 'Member List',
      children: (
        <div className="organization-detail-content">
          <p>Member list content will be implemented here.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="organization-list-page">
      <Splitter style={{ height: '100%' }}>
        {/* 左侧面板 - 组织树 */}
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <div className="organization-list-panel">
            <OrganizationTree
              onSelect={(key) => {
                setSelectedKey(key);
                setActiveTabKey('info');
              }}
              selectedKey={selectedKey}
            />
          </div>
        </Splitter.Panel>

        {/* 右侧面板 - 组织详情 */}
        <Splitter.Panel>
          <div className="organization-detail-panel">
            <AntTabs
              activeKey={activeTabKey}
              onChange={setActiveTabKey}
              items={tabItems}
              style={{ height: '100%' }}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default OrganizationList;
