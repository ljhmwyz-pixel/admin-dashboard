import React, { useMemo } from 'react';
import {
  ApartmentOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { SelectedListProps } from '@pages/organization/dto';
import { AntButton, AntInput } from '@shared/components';
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
  editable = true,
  showSearch = true,
  searchPlaceholder = 'Please enter name...',
  showReset = true,
  onReset,
  className = '',
  style,
  loading = false,
  emptyText = 'No selected items',
  iconType = 'org',
}) => {
  /** 是否受控搜索 */
  const isSearchControlled = controlledSearchValue !== undefined;
  const searchValue = isSearchControlled ? controlledSearchValue : '';

  /**
   * 过滤后的数据
   */
  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  }, [data, searchValue]);

  /**
   * 处理搜索变化
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  /**
   * 处理移除项
   */
  const handleRemove = (key: string) => {
    const newKeys = selectedKeys.filter((k) => k !== key);
    onChange(newKeys);
  };

  /**
   * 处理重置
   */
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange([]);
    }
  };

  /**
   * 渲染图标
   */
  const renderIcon = (isPlant?: boolean) => {
    const type = isPlant ? 'plant' : iconType;
    return type === 'plant' ? (
      <ThunderboltOutlined className={`${styles.icon} ${styles.plantIcon}`} />
    ) : (
      <ApartmentOutlined className={`${styles.icon} ${styles.orgIcon}`} />
    );
  };

  /**
   * 渲染编辑态
   */
  const renderEditable = () => (
    <div className={clsx(styles.editableContainer, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.title}>
          {renderIcon()}
          <span>{title}</span>
        </div>
        {showSearch && (
          <AntInput
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
            allowClear
          />
        )}
      </div>
      <div className={styles.listContainer}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className={styles.empty}>{emptyText}</div>
        ) : (
          filteredData.map((item) => (
            <div key={item.key} className={styles.selectedItem}>
              {renderIcon(item.isPlant)}
              <span className={styles.itemText}>{item.title}</span>
              <CloseOutlined className={styles.removeIcon} onClick={() => handleRemove(item.key)} />
            </div>
          ))
        )}
      </div>
      {showReset && editable && (
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

  /**
   * 渲染展示态
   */
  const renderReadonly = () => (
    <div className={`${styles.readonlyContainer} ${className}`} style={style}>
      <div className={styles.header}>
        <div className={styles.title}>
          {renderIcon()}
          <span>{title}</span>
        </div>
        {showSearch && (
          <AntInput
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
            allowClear
          />
        )}
      </div>
      <div className={styles.listContainer}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className={styles.empty}>{emptyText}</div>
        ) : (
          filteredData.map((item) => (
            <div key={item.key} className={styles.readonlyItem}>
              {renderIcon(item.isPlant)}
              <span className={styles.itemText}>{item.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return editable ? renderEditable() : renderReadonly();
};

export default SelectedList;
