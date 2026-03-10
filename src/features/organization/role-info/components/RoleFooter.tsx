import React from 'react';
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import styles from './RoleFooter.module.scss';

interface RoleFooterProps {
  selectedCount: number;
  onBatchEdit: () => void;
  onBatchDelete: () => void;
  onClearSelection: () => void;
}

const RoleFooter: React.FC<RoleFooterProps> = ({
  selectedCount,
  onBatchEdit,
  onBatchDelete,
  onClearSelection,
}) => {
  return (
    <div className={styles.roleFooter}>
      <div className={styles.footerContent}>
        <div className={styles.selectedInfo}>
          <span>Selected {selectedCount} items</span>
        </div>
        <div className={styles.actions}>
          <Space size="small">
            <Button type="primary" icon={<EditOutlined />} onClick={onBatchEdit}>
              Batch Edit
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={onBatchDelete}>
              Batch Delete
            </Button>
            <Button icon={<CloseOutlined />} onClick={onClearSelection}>
              Clear
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default RoleFooter;
