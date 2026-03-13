import React from 'react';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { AntButton, AntInput, AntSegmented, AntTooltip } from '@shared/components';

import styles from './MemberList.module.scss';

/**
 * MemberListHeader 组件属性接口
 */
interface MemberListHeaderProps {
  /** 当前选中的状态 */
  status: string;
  /** 当前搜索关键词 */
  keyword: string;
  /** 状态变更回调函数 */
  onStatusChange: (status: string) => void;
  /** 搜索回调函数 */
  onSearch: () => void;
  /** 重置回调函数 */
  onReset: () => void;
  /** 关键词变更回调函数 */
  onKeywordChange: (keyword: string) => void;
  /** 新增成员回调函数 */
  onAdd: () => void;
}

/**
 * 成员列表头部组件
 * 包含状态筛选按钮、搜索框、新增按钮和重置按钮
 */
const MemberListHeader: React.FC<MemberListHeaderProps> = ({
  status,
  keyword,
  onStatusChange,
  onSearch,
  onReset,
  onKeywordChange,
  onAdd,
}) => {
  /** 状态选项配置 */
  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'WAITING', label: 'Waiting' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'LOCKED', label: 'Locked' },
  ];
  return (
    <div className={styles.header}>
      {/* 状态筛选 Segmented 组件 */}
      <div className={styles.statusTabs}>
        <AntSegmented
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          style={{ width: 'auto' }}
        />
      </div>

      {/* 操作区域：搜索框、新增按钮、重置按钮 */}
      <div className={styles.actions}>
        <AntTooltip
          placement="bottomLeft"
          title={
            <div>
              <div>Support searchable fields:</div>
              <div>1. Role name</div>
              <div>2. User name</div>
              <div>3. UID</div>
            </div>
          }
        >
          <AntInput
            placeholder="Please enter role / User..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            prefix={<SearchOutlined />}
            onPressEnter={onSearch}
          />
        </AntTooltip>
        <AntButton type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add
        </AntButton>
        <AntButton icon={<ReloadOutlined />} onClick={onReset}>
          Reset
        </AntButton>
      </div>
    </div>
  );
};

export default MemberListHeader;
