import React, { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { useLanguage } from '@shared/hooks/useLanguage';
import type { OrganizationTypeItem } from '@shared/types/organizationType';
import { Button, message, Space } from 'antd';

import { FormTabs } from '@/components';
import { FormButton, FormDrawer } from '@/components';

import OrganizationDataTable from '../organization-data-table';
import OrganizationPermissionTable from '../organization-permission-table';
import OrganizationRecordTable from '../organization-record-table';

import styles from './index.module.scss';

interface OrganizationTypeDetailProps {
  visible: boolean;
  organizationType: OrganizationTypeItem | null;
  isDefaultEditMode: boolean;
  onCancel: () => void;
}

const OrganizationTypeDetail: React.FC<OrganizationTypeDetailProps> = ({
  visible,
  organizationType,
  isDefaultEditMode,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState('permissions'); // 当前选中的Tab
  const [isEditMode, setIsEditMode] = useState(isDefaultEditMode);
  const [hasChanges, setHasChanges] = useState(false); // 是否有未保存的修改
  const { t } = useLanguage();

  // 处理保存
  const handleSave = async () => {
    try {
      message.success('保存成功');
      setHasChanges(false);
      setIsEditMode(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '保存失败');
    }
  };
  // 处理修改
  const handleModify = () => {
    setIsEditMode(true);
  };

  // 处理取消
  const handleCancel = () => {
    if (hasChanges) {
      // 提示用户有未保存的数据
    } else {
      console.log('取消保存');
      onCancel();
    }
  };

  // 处理子组件的修改通知
  const handleHasChanges = (changes: boolean) => {
    // todo: 这里需要判断多个子组件是否有修改
    setHasChanges(changes);
  };
  if (!organizationType) return null;
  // Tab内容配置
  const tabItems = [
    {
      key: 'permissions',
      label: <div className={styles.tabItems}>Permissions</div>,
      // children: '空态页设计中...',
      children: (
        <OrganizationPermissionTable
          isEditMode={isEditMode}
          typeCode={organizationType.typeCode}
          onHasChanges={handleHasChanges}
        />
      ),
    },
    {
      key: 'data',
      label: <div className={styles.tabItems}>Data</div>,
      children: (
        <OrganizationDataTable
          isEditMode={isEditMode}
          typeCode={organizationType.typeCode}
          onHasChanges={handleHasChanges}
        />
      ),
    },
    {
      key: 'record',
      label: <div className={styles.tabItems}>Record</div>,
      children: <OrganizationRecordTable typeCode={organizationType.typeCode} />,
    },
  ];

  if (!organizationType) return null;

  return (
    <FormDrawer
      title={organizationType.typeName}
      className={styles.drawer}
      size="60%"
      placement="right"
      closable={{ placement: 'end' }}
      open={visible}
      onClose={onCancel}
      styles={{
        body: { padding: '0px', display: 'flex', flexDirection: 'column' },
      }}
      footer={
        <div className={styles.footer}>
          <FormButton color="default" onClick={handleCancel}>
            {t('common.action.cancel')}
          </FormButton>
          {isEditMode ? (
            <FormButton color="primary" variant="solid" onClick={handleSave}>
              {t('common.action.save')}
            </FormButton>
          ) : (
            <FormButton color="primary" onClick={handleModify}>
              {t('common.action.modify')}
            </FormButton>
          )}
        </div>
      }
    >
      <div className={styles.tabContent}>
        <FormTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.antTabs}
        />
      </div>
    </FormDrawer>
  );
};

export default OrganizationTypeDetail;
