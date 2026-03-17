/**
 * 组织变更记录表格组件
 * 用于展示组织类型的变更记录
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrganizationTypeRecordItem } from '@shared/types/organizationType';
import { Spin, Tooltip } from 'antd';

import { FormButton, SearchInput, Segmented, Table } from '@/components';
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
  // 表格相关参数
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  };

  /**
   * 防抖处理，避免频繁搜索
   * 当searchText变化时，300ms后更新debouncedSearchText
   * 用于优化搜索性能，避免频繁调用API
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      // 搜索时重置到第一页
      setPage(1);
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * 处理刷新
   */
  const handleRefresh = () => {
    // 刷新时重置到第一页
    setPage(1);
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
        pageNum: page,
        pageSize: pageSize,
      });
      const recordPage = response.data || {};
      const recordData = recordPage.records || [];
      setTotal(recordPage.total || 0);

      // 设置变更记录数据
      setRecords(recordData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, [typeCode, activeTab, debouncedSearchText, page, pageSize]);

  /**
   * 初始加载和切换tab时获取变更记录
   */
  useEffect(() => {
    // 切换tab时重置到第一页
    setPage(1);
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
        render: (text: string) => (
          <Tooltip title={text} placement="top">
            <div className={styles.changeContent}>{text}</div>
          </Tooltip>
        ),
      },
      {
        title: 'Changed Time',
        dataIndex: 'changeTime',
        key: 'changeTime',
        width: 200,
        render: (text: string) => {
          // 将输入的时间字符串解析为UTC+0时区的时间
          // 首先将格式从 "YYYY-MM-DD HH:mm:ss" 转换为 ISO 格式 "YYYY-MM-DDTHH:mm:ssZ"
          const isoString = text.replace(' ', 'T') + 'Z';
          const utcDate = new Date(isoString);

          // 转换为UTC+8时区的时间
          const utc8Timestamp = utcDate.getTime() + 8 * 60 * 60 * 1000;
          const utc8Date = new Date(utc8Timestamp);

          // 提取日期和时间部分
          const date = utc8Date.toISOString().split('T')[0];
          const time = utc8Date.toISOString().split('T')[1].substring(0, 8);

          return (
            <div className={styles.changeTimeContainer}>
              <div className={styles.time}>{time} UTC+08:00</div>
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

    return (
      <div className={styles.tableContainer}>
        <Table
          dataSource={records}
          columns={columns}
          rowKey="no"
          locale={{ emptyText: '无数据' }}
          pagination={{
            current: page,
            pageSize,
            total: total,
            onChange: handlePageChange,
          }}
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
        <Segmented
          options={RECORD_PLATFORM_OPTIONS}
          value={activeTab}
          onChange={(value) => setActiveTab(value as string)}
        />
        <div className={styles.searchContainer}>
          <SearchInput
            allowClear={true}
            placeholder="Please enter role name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FormButton
            className={styles.refreshBtn}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4001 7.0001C13.4001 3.46548 10.5347 0.600098 7.0001 0.600098C3.46548 0.600098 0.600098 3.46548 0.600098 7.0001C0.600098 10.5347 3.46548 13.4001 7.0001 13.4001C8.51148 13.4001 9.90051 12.8762 10.9955 12.0001M10.9955 12.0001L9.80049 11.5001M10.9955 12.0001L10.7706 13.4001M8.00049 7.0001C8.00049 7.55238 7.55277 8.0001 7.00049 8.0001C6.4482 8.0001 6.00049 7.55238 6.00049 7.0001C6.00049 6.44781 6.4482 6.0001 7.00049 6.0001C7.55277 6.0001 8.00049 6.44781 8.00049 7.0001Z"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={() => handleRefresh()}
            title="Refresh"
          />
        </div>
      </div>

      {/* 表格内容 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationRecordTable;
