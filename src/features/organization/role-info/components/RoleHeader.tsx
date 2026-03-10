import React from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tooltip } from 'antd';
import cls from 'classnames';

import { useLanguage } from '@/shared/hooks/useLanguage';

import type { StatusFilter } from '../types';

import styles from './RoleHeader.module.scss';

interface RoleHeaderProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  searchKeyword: string;
  onSearchKeywordChange: (keyword: string) => void;
  onAdd: (() => void) | undefined;
  onRefresh: () => void;
}

const RoleHeader: React.FC<RoleHeaderProps> = ({
  statusFilter,
  onStatusChange,
  searchKeyword,
  onSearchKeywordChange,
  onAdd,
  onRefresh,
}) => {
  const { t } = useLanguage();

  const statusList = [
    { key: 'all', name: 'All' },
    { key: 'normal', name: 'Normal' },
    { key: 'deleted', name: 'Deleted' },
  ];

  return (
    <div className={styles.roleHeader}>
      {/* 左侧：状态筛选 */}
      <div className={styles.headerLeft}>
        {statusList.map((item) => (
          <span
            key={item.key}
            onClick={() => onStatusChange(item.key as StatusFilter)}
            className={cls(styles.filterButton, {
              [styles.filterButtonActive]: statusFilter === item.key,
            })}
          >
            {item.name}
          </span>
        ))}
      </div>

      {/* 右侧：搜索 + 操作按钮 */}
      <div className={styles.headerRight}>
        <Space size="middle">
          <Tooltip
            title={
              <div>
                <p>Support searchable fields</p>
                <p>1. Role name</p>
              </div>
            }
            placement="bottomLeft"
          >
            <Input
              name="search"
              placeholder={t('role.placeholder.search') || 'Please enter role name'}
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              allowClear
              className={styles.searchInput}
              style={{ width: 240 }}
              prefix={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.6001 13.6L10.1001 10.1M11.6001 6.1C11.6001 9.13757 9.13766 11.6 6.1001 11.6C3.06253 11.6 0.600098 9.13757 0.600098 6.1C0.600098 3.06243 3.06253 0.6 6.1001 0.6C9.13766 0.6 11.6001 3.06243 11.6001 6.1Z"
                    stroke="#191B1F"
                    strokeOpacity="0.4"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </Tooltip>
          <Space size="small">
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Add
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} title="Refresh" />
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default RoleHeader;
