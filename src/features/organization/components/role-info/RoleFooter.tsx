import React from 'react';
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { AntButton, AntSpace } from '@/shared/components';

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
          <AntSpace size="small">
            <AntButton type="primary" icon={<EditOutlined />} onClick={onBatchEdit}>
              Batch Edit
            </AntButton>
            <AntButton danger icon={<DeleteOutlined />} onClick={onBatchDelete}>
              Batch Delete
            </AntButton>
            <AntButton icon={<CloseOutlined />} onClick={onClearSelection}>
              Clear
            </AntButton>
          </AntSpace>
        </div>
      </div>
    </div>
  );
};

export default RoleFooter;
