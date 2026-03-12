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

  const defaultText = (count: number) => `${count} items selected`;
  const getText = selectedCountText || defaultText;

  return (
    <div className={styles.batchBar}>
      <Space size={16}>
        <span className={styles.selectedText}>{getText(selectedKeys.length)}</span>

        {actions?.map((action) => (
          <Button
            key={action.key}
            type="link"
            onClick={() => action.onClick(selectedKeys)}
            disabled={action.disabled}
            danger={action.danger}
          >
            {action.icon && <span style={{ marginRight: 4 }}>{action.icon}</span>}
            {action.label}
          </Button>
        ))}

        <Button type="link" onClick={onClear} icon={<CloseCircleOutlined />}>
          Clear
        </Button>
      </Space>
    </div>
  );
};

export default BatchActionBar;
