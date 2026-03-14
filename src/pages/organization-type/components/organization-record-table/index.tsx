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
  const [activeTab, setActiveTab] = useState('ORGANIZATION'); // 默认选中Organization标签
  const [records, setRecords] = useState<OrganizationTypeRecordItem[]>([]); // 变更记录数据
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 搜索关键词

  // 获取组织类型-变更记录数据
  const fetchRecords = useCallback(
    async (keyword?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationTypeApi.getOrganizationTypeRecords(typeCode);
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
    [typeCode],
  );

  // 初始加载变更记录
  useEffect(() => {
    fetchRecords();
  }, [typeCode, fetchRecords]);

  // 处理搜索
  const handleSearch = () => {
    fetchRecords(searchText);
  };

  // 处理刷新
  const handleRefresh = () => {
    fetchRecords(searchText);
  };

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
      width: 100,
      render: (text: string) => <span className={styles.changeType}>{text}</span>,
    },
    {
      title: 'Changed By',
      dataIndex: 'changedBy',
      key: 'changedBy',
      width: 150,
    },
    {
      title: 'Changed Content',
      dataIndex: 'changeContent',
      key: 'changeContent',
      flex: 1,
    },
    {
      title: 'Changed Time',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 180,
    },
  ];

  return (
    <div>
      <div className={styles.topSearchContainer}>
        <Segmented
          options={[
            { label: 'Organization', value: 'ORGANIZATION' },
            { label: 'Members', value: 'USER' },
            { label: 'Plants', value: 'PLANT' },
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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'red' }}>
          {error}
        </div>
      ) : (
        <div style={{ border: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px', overflow: 'auto' }}>
            <Table
              dataSource={records}
              columns={columns}
              pagination={false}
              rowKey="no"
              className={styles.recordTable}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationRecordTable;
