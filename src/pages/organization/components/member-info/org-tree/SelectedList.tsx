import React, { useMemo } from 'react';
import {
  ApartmentOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { PlantTreeDatum, SelectedListProps } from '@pages/organization/dto';
import { AntButton, AntEmpty, AntInput, AntSpin } from '@shared/components';
import clsx from 'classnames';

import styles from './SelectedList.module.scss';
/**
 * 已选列表组件
 * 支持编辑态（可移除）和展示态（只读）
 *
 * 功能特性：
 * - 支持搜索过滤
 * - 支持重置操作
 * - 支持编辑态和展示态切换
 * - 支持组织和电站两种图标类型
 */
const SelectedList: React.FC<SelectedListProps> = ({
  title,
  data,
  selectedKeys,
  onChange,
  searchValue: controlledSearchValue,
  onSearch,
  showReset = false,
  onReset,
  className = '',
  style,
  loading = false,
  iconType = 'org',
}) => {
  /**
   * 处理搜索变化
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  /**
   * 处理移除项
   */
  const handleRemove = (nodeData: PlantTreeDatum) => {
    onChange?.(nodeData);
  };

  /**
   * 处理重置
   */
  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className={clsx(styles.editableContainer, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>{title}</span>
        </div>
        {/* {showSearch && (
          <AntInput
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
            allowClear
          />
        )} */}
      </div>
      <div className={styles.listContainer}>
        <AntSpin spinning={loading}>
          {data.length === 0 ? (
            <AntEmpty />
          ) : (
            data.map((item) => (
              <div key={item.nodeId} className={styles.selectedItem}>
                <span className={styles.itemText}>{item.nodeName}</span>
                <span onClick={() => handleRemove(item)}>
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
                </span>
              </div>
            ))
          )}
        </AntSpin>
      </div>

      {showReset && (
        <div className={styles.footer}>
          <AntButton
            type="link"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            className={styles.resetBtn}
          >
            Reset
          </AntButton>
        </div>
      )}
    </div>
  );
};

export default SelectedList;
