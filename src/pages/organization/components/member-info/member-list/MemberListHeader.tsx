import React, { useRef } from 'react';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { AntButton, AntInput, AntTooltip } from '@shared/components';
import type { SegmentedValue } from 'antd/es/segmented';

import { Segmented } from '@/components';

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
  onStatusChange: (value: SegmentedValue) => void;
  /** 重置回调函数 */
  onReset: () => void;
  /** 关键词变更回调函数 */
  onKeywordChange: (keyword: string) => void;
  /** 新增成员回调函数 */
  onAdd: () => void;
}
/** 状态选项配置 */
const statusOptions = [
  { value: '', label: 'All' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'WAITING', label: 'Waiting' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'LOCKED', label: 'Locked' },
];

/**
 * 成员列表头部组件
 * 包含状态筛选按钮、搜索框、新增按钮和重置按钮
 */
const MemberListHeader: React.FC<MemberListHeaderProps> = ({
  status,
  keyword,
  onStatusChange,
  onReset,
  onKeywordChange,
  onAdd,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.header}>
      {/* 状态筛选 Segmented 组件 */}
      <Segmented value={status} options={statusOptions} onChange={onStatusChange} />

      {/* 操作区域：搜索框、新增按钮、重置按钮 */}
      <div className={styles.actions} ref={ref}>
        <AntTooltip
          placement="bottomLeft"
          className={styles.tooltip}
          getPopupContainer={() => ref.current || document.body}
          title={
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipTitle}>Support searchable fields:</div>
              <div className={styles.tooltipItem}>1. User name</div>
              <div className={styles.tooltipItem}>2. UID</div>
            </div>
          }
        >
          <AntInput
            placeholder="Please enter role / User..."
            value={keyword}
            maxLength={100}
            onChange={(e) => onKeywordChange(e.target.value)}
            prefix={<SearchOutlined />}
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
