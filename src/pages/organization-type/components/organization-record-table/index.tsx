/**
 * 组织变更记录表格组件
 * 用于展示组织类型的变更记录
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrganizationTypeRecordItem } from '@shared/types/organizationType';

// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

//导入常量
import { RECORD_PLATFORM_OPTIONS } from '../../constants';
// 导入hooks
import { useApiCall } from '../../hooks/useApiCall';
// 导入共用组件
import SearchHeader from '../common/SearchHeader';
import TableContainer from '../common/TableContainer';

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

  /**
   * 获取组织类型-变更记录数据
   */
  const {
    loading,
    error,
    callApi: fetchRecords,
  } = useApiCall(async (keyword?: string) => {
    const response = await organizationTypeApi.getOrganizationTypeRecords(typeCode, {
      recordType: activeTab,
      keyword,
    });
    const recordPage = response.data || {};
    const recordData = recordPage.records || [];

    // 设置变更记录数据
    setRecords(recordData);
    return recordData;
  });

  /**
   * 处理搜索
   */
  const handleSearch = useCallback(
    (keyword: string) => {
      fetchRecords(keyword);
    },
    [fetchRecords],
  );

  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(() => {
    fetchRecords();
  }, [fetchRecords]);

  /**
   * 初始加载和切换tab时获取变更记录
   */
  useEffect(() => {
    fetchRecords();
  }, [typeCode, fetchRecords, activeTab]);

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
   * 渲染组件
   */
  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <SearchHeader
        options={RECORD_PLATFORM_OPTIONS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchPlaceholder="Please enter role name"
        onSearch={handleSearch}
        onRefresh={handleRefresh}
      />

      {/* 表格内容 */}
      <div className={styles.tableContainer}>
        <TableContainer
          loading={loading}
          error={error}
          dataSource={records}
          columns={columns}
          rowKey="no"
        />
      </div>
    </div>
  );
};

export default OrganizationRecordTable;
