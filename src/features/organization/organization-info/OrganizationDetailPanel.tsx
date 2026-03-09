import React, { useState } from 'react';

import { FormTabs } from '@/components';
import { useLanguage } from '@/shared/hooks';
import type { TreeNodeData } from '@/shared/types/organization';

import OrganizationView from './OrganizationView';

import styles from './OrganizationDetailPanel.module.scss';

interface OrganizationDetailPanelIProps {
  selectedKey: string;
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
}

const OrganizationDetailPanel: React.FC<OrganizationDetailPanelIProps> = ({
  selectedKey: orgId,
  currentParentNode,
  treeData,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string>('info');
  const { t } = useLanguage();

  // Tab内容配置
  const tabItems = [
    {
      key: 'info',
      label: <div className={styles.tabItems}>{t('org.info.title')}</div>,
      children: orgId ? (
        <OrganizationView orgId={orgId} currentParentNode={currentParentNode} treeData={treeData} />
      ) : null,
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
