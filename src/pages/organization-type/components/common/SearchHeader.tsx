import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Segmented } from 'antd';

import styles from './SearchHeader.module.scss';

interface SearchHeaderProps {
  options: Array<{ label: string; value: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
  searchPlaceholder: string;
  onSearch: (keyword: string) => void;
  onRefresh: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  options,
  activeTab,
  onTabChange,
  searchPlaceholder,
  onSearch,
  onRefresh,
}) => {
  const [searchText, setSearchText] = useState('');

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  // 处理搜索按钮点击
  const handleSearch = useCallback(() => {
    onSearch(searchText);
  }, [searchText, onSearch]);

  return (
    <div className={styles.topSearchContainer}>
      <Segmented options={options} value={activeTab} onChange={onTabChange} />
      <div className={styles.searchContainer}>
        <Input
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        <div className={styles.refreshIcon} onClick={onRefresh}>
          <ReloadOutlined />
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
