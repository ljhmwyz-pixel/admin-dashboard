import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { OrganizationTypeRecordItem } from '@shared/types/organizationType';
import { Input, Segmented, Spin, Table } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

interface OrganizationRecordTableProps {
  typeCode: string;
}

const OrganizationRecordTable: React.FC<OrganizationRecordTableProps> = ({ typeCode }) => {
  const [activeTab, setActiveTab] = useState('DATA_ORGANIZATION'); // 默认选中Organization标签
  const [records, setRecords] = useState<OrganizationTypeRecordItem[]>([]); // 变更记录数据
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 搜索关键词
  const [debouncedSearchText, setDebouncedSearchText] = useState(''); // 防抖后的搜索关键词

  // 获取组织类型-变更记录数据
  const fetchRecords = useCallback(
    async (keyword?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationTypeApi.getOrganizationTypeRecords(typeCode, {
          recordType: activeTab,
          keyword,
        });
        const recordPage = response.data || {};
        const recordData = recordPage.records || [];

        // 设置变更记录数据
        setRecords(recordData);
      } catch (err) {
        console.error('Failed to fetch records:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch records');
      } finally {
        setLoading(false);
      }
    },
    [typeCode, activeTab],
  );

  // 初始加载变更记录
  useEffect(() => {
    fetchRecords(debouncedSearchText);
  }, [typeCode, fetchRecords, activeTab, debouncedSearchText]);

  // 处理搜索
  const handleSearch = () => {
    setDebouncedSearchText(searchText);
  };

  // 处理刷新
  const handleRefresh = () => {
    setDebouncedSearchText(searchText);
  };

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms防抖

    return () => clearTimeout(timer);
  }, [searchText]);

  const columns = [
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
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.topSearchContainer}>
        <Segmented
          options={[
            { label: 'Organization', value: 'DATA_ORGANIZATION' },
            { label: 'Members', value: 'DATA_USER' },
            { label: 'Plants', value: 'DATA_PLANT' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table
          className={styles.table}
          dataSource={loading ? [] : records}
          columns={columns}
          pagination={false}
          rowKey="no"
          loading={{ spinning: loading, indicator: <Spin size="large" /> }}
        />
        {error && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'red',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationRecordTable;
