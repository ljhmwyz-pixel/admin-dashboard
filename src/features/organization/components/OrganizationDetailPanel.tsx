import React, { useState } from 'react';

import { AntTabs } from '@/shared/components';

import OrganizationView from './OrganizationView';

import styles from './OrganizationDetailPanel.module.scss';

const OrganizationDetailPanel: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('info');

  // 获取当前选中的组织详情
  // const currentDetail = organizationDetails[selectedKey] || organizationDetails['p001'];

  // Tab内容配置
  const tabItems = [
    {
      key: 'info',
      label: <div className={styles.tabItems}>Organization Information</div>,
      children: <OrganizationView />,
    },
    {
      key: 'role-list',
      label: <div className={styles.tabItems}>Role List</div>,
      children: (
        <div className="organization-detail-content">
          <p>Role list content will be implemented here.</p>
        </div>
      ),
    },
    {
      key: 'member-list',
      label: <div className={styles.tabItems}>Member List</div>,
      children: (
        <div className="organization-detail-content">
          <p>Member list content will be implemented here.</p>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.organizationDetailPanel}>
      <AntTabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={tabItems}
        className={styles.antTabs}
        classNames={{
          indicator: styles.indicator,
        }}
      />
    </div>
  );
};

export default OrganizationDetailPanel;
