import React, { useMemo } from 'react';
import {
  ApartmentOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';

import styles from './SelectedList.module.scss';

/**
 * 列表项数据类型
 */
export interface ListItem {
  /** 唯一标识 */
  key: string;
  /** 标题 */
  title: string;
  /** 是否为电站 */
  isPlant?: boolean;
  /** 额外数据 */
  [key: string]: any;
}

/**
 * SelectedList 组件属性接口
 */
export interface SelectedListProps {
  /** 列表标题 */
  title: string;
  /** 列表数据 */
  data: ListItem[];
  /** 选中的keys */
  selectedKeys: React.Key[];
  /** 选中变化回调 */
  onChange: (selectedKeys: React.Key[]) => void;
  /** 搜索关键词 */
  searchValue?: string;
  /** 搜索变化回调 */
  onSearch?: (value: string) => void;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否展示搜索框 */
  showSearch?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 是否展示重置按钮 */
  showReset?: boolean;
  /** 重置回调 */
  onReset?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态展示 */
  emptyText?: React.ReactNode;
  /** 图标类型 */
  iconType?: 'org' | 'plant';
}

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
    <div className={`${styles.editableContainer} ${className}`} style={style}>
      <div className={styles.header}>
        <div className={styles.title}>
          {renderIcon()}
          <span>{title}</span>
        </div>
        {showSearch && (
          <Input
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
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            className={styles.resetBtn}
          >
            Reset
          </Button>
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
          <Input
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
