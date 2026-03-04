import React from 'react';
import { Space } from 'antd';

import type { TreeNodeData } from '@/shared/types/organization';

import styles from './TreeNodeTitle.module.scss';

interface TreeNodeTitleProps {
  /** 节点数据 */
  nodeData: TreeNodeData;
  /** 节点添加回调 */
  onNodeAdd?: (nodeData: TreeNodeData) => void;
  /** 节点编辑回调 */
  onNodeEdit?: (nodeData: TreeNodeData) => void;
}

/**
 * 树节点标题组件
 * 负责渲染树节点的自定义标题，包含操作图标
 */
const TreeNodeTitle: React.FC<TreeNodeTitleProps> = ({ nodeData, onNodeAdd, onNodeEdit }) => {
  return (
    <div className={styles.treeNodeTitle}>
      <span className={styles.nodeTitle} id="tree-title">
        {nodeData.title}
      </span>
      <Space className={styles.nodeActions} size="small">
        {nodeData.canDelete && (
          <span
            className={styles.actionIcon}
            onClick={(e) => {
              e.stopPropagation();
              onNodeEdit?.(nodeData);
            }}
          >
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
                d="M4.87305 9.10748L6.74665 7.23388L9.1274 4.87656"
                stroke="#F45858"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle
                cx="7.0001"
                cy="7.00001"
                r="6.4"
                stroke="#191B1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        {nodeData.canAdd && (
          <span
            className={styles.actionIcon}
            onClick={(e) => {
              e.stopPropagation();
              onNodeAdd?.(nodeData);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.600098 1.60001C0.600098 1.04772 1.04781 0.600006 1.6001 0.600006H9.6001C10.1524 0.600006 10.6001 1.04772 10.6001 1.60001V9.60001C10.6001 10.1523 10.1524 10.6 9.6001 10.6H1.6001C1.04781 10.6 0.600098 10.1523 0.600098 9.60001L0.600098 1.60001Z"
                stroke="#191B1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M13.3999 5.39999V12.4C13.3999 12.9523 12.9522 13.4 12.3999 13.4H5.3999"
                stroke="#191B1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M3.1001 5.59188L5.6079 5.60016M5.6079 5.60016H8.1001M5.6079 5.60016L5.60844 3.10001M5.6079 5.60016L5.60016 8.10001"
                stroke="#33C2C8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </Space>
    </div>
  );
};

export default TreeNodeTitle;
