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
  { value: '', label: 'All', color: '#33C2C8' },
  { value: 'NORMAL', label: 'Normal', color: '#31C47F' },
  { value: 'WAITING', label: 'Waiting', color: '#A3A4A6' },
  { value: 'REJECTED', label: 'Rejected', color: '#F4AA58' },
  { value: 'LOCKED', label: 'Locked', color: '#F45858' },
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
            className={styles.searchInput}
          />
        </AntTooltip>
        <AntButton
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          Add
        </AntButton>
        <AntButton
          className={styles.resetButton}
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4001 6.99961C13.4001 3.46499 10.5347 0.599609 7.0001 0.599609C3.46548 0.599609 0.600098 3.46499 0.600098 6.99961C0.600098 10.5342 3.46548 13.3996 7.0001 13.3996C8.51148 13.3996 9.90051 12.8757 10.9955 11.9996M10.9955 11.9996L9.80049 11.4996M10.9955 11.9996L10.7706 13.3996M8.00049 6.99961C8.00049 7.5519 7.55277 7.99961 7.00049 7.99961C6.4482 7.99961 6.00049 7.5519 6.00049 6.99961C6.00049 6.44733 6.4482 5.99961 7.00049 5.99961C7.55277 5.99961 8.00049 6.44733 8.00049 6.99961Z"
                stroke="#191B1F"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={onReset}
        />
      </div>
    </div>
  );
};

export default MemberListHeader;
