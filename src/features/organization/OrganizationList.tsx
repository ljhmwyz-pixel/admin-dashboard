import React, { useState } from 'react';
import { Splitter } from 'antd';

import { AntTabs } from '@/shared/components/antd-imports';

import OrganizationTree from './components/OrganizationTree';
import { organizationDetails } from './mocks/organizationData';

import styles from './OrganizationList.module.scss';

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
    <div className={styles.organizationListPage}>
      <Splitter
        draggerIcon={
          <svg
            width="15"
            height="28"
            viewBox="0 0 15 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_237_5088)">
              <path
                d="M4 4C4 2.89543 4.89543 2 6 2H9C10.1046 2 11 2.89543 11 4V20C11 21.1046 10.1046 22 9 22H6C4.89543 22 4 21.1046 4 20V4Z"
                fill="#33C2C8"
              />
            </g>
            <path
              d="M6 7.5C6 7.22386 6.22386 7 6.5 7C6.77614 7 7 7.22386 7 7.5V16.5C7 16.7761 6.77614 17 6.5 17C6.22386 17 6 16.7761 6 16.5V7.5Z"
              fill="white"
            />
            <path
              d="M8 7.5C8 7.22386 8.22386 7 8.5 7C8.77614 7 9 7.22386 9 7.5V16.5C9 16.7761 8.77614 17 8.5 17C8.22386 17 8 16.7761 8 16.5V7.5Z"
              fill="white"
            />
            <defs>
              <filter
                id="filter0_d_237_5088"
                x="0"
                y="0"
                width="15"
                height="28"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.0980392 0 0 0 0 0.105882 0 0 0 0 0.121569 0 0 0 0.06 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_237_5088"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_237_5088"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        }
      >
        {/* 左侧面板 - 组织树 */}
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <div className={styles.organizationListPanel}>
            <OrganizationTree
              onSelect={(selectedKey) => {
                setSelectedKey(selectedKey);
                setActiveTabKey('info');
              }}
              selectedKey={selectedKey}
            />
          </div>
        </Splitter.Panel>

        {/* 右侧面板 - 组织详情 */}
        <Splitter.Panel>
          <div className={styles.organizationDetailPanel}>
            <AntTabs activeKey={activeTabKey} onChange={setActiveTabKey} items={tabItems} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default OrganizationList;
