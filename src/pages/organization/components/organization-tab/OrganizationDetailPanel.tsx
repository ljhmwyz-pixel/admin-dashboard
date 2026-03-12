import React, { useState } from 'react';
import { OrganizationView, RoleInfo } from '@pages/organization/components';
import type { TreeNodeData } from '@pages/organization/dto';
import { useLanguage } from '@shared/hooks';

import { FormTabs } from '@/components';

import styles from './OrganizationDetailPanel.module.scss';

interface OrganizationDetailPanelIProps {
  selectedKey: string;
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  loadData: () => void;
  setLoading: (loading: boolean) => void;
}

const OrganizationDetailPanel: React.FC<OrganizationDetailPanelIProps> = ({
  selectedKey: orgId,
  currentParentNode,
  treeData,
  loadData,
  setLoading,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string>('info');
  const { t } = useLanguage();

  // Tab内容配置
  const tabItems = [
    {
      key: 'info',
      label: <div className={styles.tabItems}>{t('org.info.title')}</div>,
      children: orgId ? (
        <OrganizationView
          orgId={orgId}
          currentParentNode={currentParentNode}
          treeData={treeData}
          loadData={loadData}
          setLoading={setLoading}
        />
      ) : (
        '空态页设计中...'
      ),
    },
    {
      key: 'role-list',
      label: <div className={styles.tabItems}>{t('role.list.title')}</div>,
      children: <RoleInfo />,
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
