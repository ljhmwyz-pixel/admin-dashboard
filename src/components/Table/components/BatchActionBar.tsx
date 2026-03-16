import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import styles from './BatchActionBar.module.scss';

interface Props {
  selectedKeys: React.Key[];
  actions?: any[];
  onClear: () => void;
  selectedCountText?: (count: number) => string;
}

const BatchActionBar: React.FC<Props> = ({ selectedKeys, actions, onClear, selectedCountText }) => {
  if (!selectedKeys.length) return null;

  const defaultText = (count: number) => (
    <div className={styles.selectedCountText}>
      <div className={styles.selectedCount}>{count}</div>
      <span className={styles.defaultText}>items selected</span>
    </div>
  );
  const getText = selectedCountText || defaultText;

  return (
    <div className={styles.batchBar}>
      <Space size={20} separator="|">
        <span className={styles.selectedText}>{getText(selectedKeys.length)}</span>

        {actions?.map((action) => (
          <div
            className={styles.labelWrap}
            key={action.key}
            onClick={() => action.onClick(selectedKeys)}
          >
            {action.icon && action.icon}
            <span className={styles.actionLabel}>{action.label}</span>
          </div>
        ))}
      </Space>

      <div className={styles.closeWrap} onClick={onClear}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.00273 2.00114L6.99943 6.99864M6.99943 6.99864L12 12M6.99943 6.99864L2 11.9989M6.99943 6.99864L11.9973 2"
            stroke="#191B1F"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default BatchActionBar;
