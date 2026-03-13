import React, { useState } from 'react';
import { UpOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown } from 'antd';

import styles from './HeaderFilter.module.scss';

export interface HeaderFilterOption {
  label: string;
  value: string;
}

interface IHeaderFilterProps {
  title: string;
  value?: string[];
  options: HeaderFilterOption[];
  onChange?: (val: string[]) => void;
  multiple?: boolean;
}

const HeaderFilter: React.FC<IHeaderFilterProps> = ({ options }) => {
  const [value, setValue] = useState<string[]>([]);

  const overlay = (
    <div className={styles.menu}>
      <Checkbox.Group options={options} value={value} onChange={(v) => setValue(v as string[])} />
    </div>
  );

  return (
    <Dropdown popupRender={() => overlay} trigger={['click']} placement="bottomLeft">
      <div className={styles.trigger}>
        Platform
        <UpOutlined className={styles.icon} />
      </div>
    </Dropdown>
  );
};

export default HeaderFilter;
