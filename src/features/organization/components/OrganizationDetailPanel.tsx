import React, { useState } from 'react';

import { FormTabs } from '@/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import OrganizationView from './OrganizationView';

import styles from './OrganizationDetailPanel.module.scss';

const OrganizationDetailPanel: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('info');
  const { t } = useLanguage();

  // Tab内容配置
  const tabItems = [
    {
      key: 'info',
      label: <div className={styles.tabItems}>{t('org.info.title')}</div>,
      children: <OrganizationView />,
    },
    {
      key: 'role-list',
      label: <div className={styles.tabItems}>{t('role.list.title')}</div>,
      children: (
        <div className="organization-detail-content">
          <p>Role list content will be implemented here.</p>
        </div>
      ),
    },
    {
      key: 'member-list',
      label: <div className={styles.tabItems}>{t('member.list.title')}</div>,
      children: (
        <div className="organization-detail-content">
          <p>Member list content will be implemented here.</p>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.organizationDetailPanel}>
      <FormTabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={tabItems}
        className={styles.antTabs}
      />
    </div>
  );
};

export default OrganizationDetailPanel;
