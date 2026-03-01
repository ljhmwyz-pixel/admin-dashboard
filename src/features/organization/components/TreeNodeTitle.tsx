import React from 'react';

import { AntButton } from '../../../shared/components/antd-imports';
import type { TreeNodeData } from '../../../shared/types/organization';
import styles from './TreeNodeTitle.module.less';

interface TreeNodeTitleProps {
  nodeData: TreeNodeData;
  onAdd?: (nodeData: TreeNodeData, e: React.MouseEvent) => void;
  onDelete?: (nodeData: TreeNodeData, e: React.MouseEvent) => void;
}

const TreeNodeTitle: React.FC<TreeNodeTitleProps> = ({ nodeData, onAdd, onDelete }) => {
  const { title, canAdd = false, canDelete = false } = nodeData;

  return (
    <div className={styles.treeNodeTitleContainer}>
      <div className={styles.treeNodeTitle}>{title}</div>
      <div className={styles.buttonGroup}>
        {canAdd && (
          <AntButton
            type="text"
            icon={
              <span className="anticon anticon-plus">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.88477 4.86484L6.75837 6.73844L9.11569 9.11919"
                    stroke="#F45858"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.87305 9.10748L6.74665 7.23387L9.1274 4.87655"
                    stroke="#F45858"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="7.0001"
                    cy="7"
                    r="6.4"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            }
            size="small"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete?.(nodeData, e);
            }}
            title="添加子节点"
          />
        )}
        {canDelete && (
          <AntButton
            type="text"
            icon={
              <span className="anticon anticon-delete">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.600098 1.6C0.600098 1.04771 1.04781 0.599998 1.6001 0.599998H9.6001C10.1524 0.599998 10.6001 1.04771 10.6001 1.6V9.6C10.6001 10.1523 10.1524 10.6 9.6001 10.6H1.6001C1.04781 10.6 0.600098 10.1523 0.600098 9.6L0.600098 1.6Z"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13.3999 5.4V12.4C13.3999 12.9523 12.9522 13.4 12.3999 13.4H5.3999"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.1001 5.59187L5.6079 5.60015M5.6079 5.60015H8.1001M5.6079 5.60015L5.60844 3.1M5.6079 5.60015L5.60016 8.1"
                    stroke="#33C2C8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            }
            size="small"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onAdd?.(nodeData, e);
            }}
            title="删除节点"
          />
        )}
      </div>
    </div>
  );
};

export default TreeNodeTitle;
