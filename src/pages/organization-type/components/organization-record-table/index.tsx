/**
 * 组织变更记录表格组件
 * 用于展示组织类型的变更记录
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { OrganizationTypeRecordItem } from '@shared/types/organizationType';
import { Input, Segmented, Spin, Table } from 'antd';

// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

//导入常量
import { RECORD_PLATFORM_OPTIONS } from '../../constants';

// 导入样式
import styles from './index.module.scss';

/**
 * 组织变更记录表格组件属性
 */
interface OrganizationRecordTableProps {
  /** 组织类型编码 */
  typeCode: string;
}

const OrganizationRecordTable: React.FC<OrganizationRecordTableProps> = ({ typeCode }) => {
  /** 当前选中的标签（Organization、Members或Plants） */
  const [activeTab, setActiveTab] = useState('DATA_ORGANIZATION'); // 默认选中Organization标签

  /** 变更记录数据 */
  const [records, setRecords] = useState<OrganizationTypeRecordItem[]>([]);

  /** 加载状态 */
  const [loading, setLoading] = useState(false);

  /** 错误信息 */
  const [error, setError] = useState<string | null>(null);

  /** 搜索关键词 */
  const [searchText, setSearchText] = useState('');

  /** 防抖后的搜索关键词 */
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  /**
   * 防抖处理，避免频繁搜索
   * 当searchText变化时，300ms后更新debouncedSearchText
   * 用于优化搜索性能，避免频繁调用API
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    setDebouncedSearchText(searchText);
  };

  /**
   * 处理刷新
   */
  const handleRefresh = () => {
    fetchRecords();
  };

  /**
   * 获取组织类型-变更记录数据
   */
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationTypeApi.getOrganizationTypeRecords(typeCode, {
        recordType: activeTab,
        keyword: debouncedSearchText,
      });
      const recordPage = response.data || {};
      const recordData = recordPage.records || [];

      // 设置变更记录数据
      setRecords(recordData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, [typeCode, activeTab, debouncedSearchText]);

  /**
   * 初始加载和切换tab时获取变更记录
   */
  useEffect(() => {
    fetchRecords();
  }, [typeCode, fetchRecords, activeTab, debouncedSearchText]);

  /**
   * 表格列配置
   * 使用useMemo优化，避免重复创建
   */
  const columns = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        width: 60,
      },
      {
        title: 'Change Type',
        dataIndex: 'changeType',
        key: 'changeType',
        width: 180,
        render: (text: string) => <span className={styles.changeType}>{text}</span>,
      },
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        width: 180,
      },
      {
        title: 'Changed Content',
        dataIndex: 'changeContent',
        key: 'changeContent',
      },
      {
        title: 'Changed Time',
        dataIndex: 'changeTime',
        key: 'changeTime',
        width: 200,
        render: (text: string) => {
          // 解析时间字符串，提取日期和时间部分
          const [date, time] = text.split(' ');
          return (
            <div className={styles.changeTimeContainer}>
              <div className={styles.time}>{time}</div>
              <div className={styles.date}>{date}</div>
            </div>
          );
        },
        align: 'right' as const,
      },
    ],
    [],
  );

  /**
   * 渲染内容区域
   */
  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.statusContainer}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return <div className={`${styles.statusContainer} ${styles.errData}`}>{error}</div>;
    }

    if (records.length === 0) {
      return <div className={`${styles.statusContainer} ${styles.noData}`}>无数据</div>;
    }

    return (
      <div className={styles.tableContainer}>
        <Table
          dataSource={records}
          columns={columns}
          pagination={false}
          rowKey="no"
          locale={{ emptyText: '无数据' }}
        />
      </div>
    );
  };

  /**
   * 渲染组件
   */
  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <div className={styles.topSearchContainer}>
        <Segmented options={RECORD_PLATFORM_OPTIONS} value={activeTab} onChange={setActiveTab} />
        <div className={styles.searchContainer}>
          <Input
            placeholder="Please enter role name"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onPressEnter={handleSearch}
          />
          <div className={styles.refreshIcon} onClick={handleRefresh}>
            <ReloadOutlined />
          </div>
        </div>
      </div>

      {/* 表格内容 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationRecordTable;
