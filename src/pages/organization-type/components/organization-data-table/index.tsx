import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { OrganizationTypeDataItem } from '@shared/types/organizationType';
import { Input, Segmented, Select, Spin, Table, Tabs } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

const { Option } = Select;
// 定义一个options数组常量，用于Select组件的选项
const options = [
  { label: 'Unmasked', value: 'FULL' },
  { label: 'Masked', value: 'MASKED' },
  { label: 'Hidden', value: 'HIDDEN' },
];

interface OrganizationDataTableProps {
  typeCode: string;
  isEditMode?: boolean;
  onHasChanges?: (hasChanges: boolean) => void;
  onGetModifiedData?: (data: any) => void;
}

const OrganizationDataTable: React.FC<OrganizationDataTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
  onGetModifiedData,
}) => {
  const [activeTab, setActiveTab] = useState('ORGANIZATION'); // 默认选中Organization权限
  const [originalData, setOriginalData] = useState<OrganizationTypeDataItem[]>([]); // 原始数据，用于比较是否有修改
  const [modifiedData, setModifiedData] = useState<any>({}); // 修改的数据
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 权限搜索关键词
  const [debouncedSearchText, setDebouncedSearchText] = useState(''); // 防抖后的搜索关键词

  // 处理搜索
  const handleSearch = () => {
    setDebouncedSearchText(searchText);
  };

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 500ms防抖

    return () => clearTimeout(timer);
  }, [searchText]);
  // 处理刷新
  const handleRefresh = () => {
    fetchDataPermissions(searchText);
  };
  // 获取组织类型-数据权限数据
  const fetchDataPermissions = useCallback(
    async (keyword?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationTypeApi.getOrganizationTypePermissions(typeCode, {
          permissionType: 'DATA',
          resourceType: activeTab,
          permissionKeyword: keyword,
        });
        const dataPermissions: OrganizationTypeDataItem[] = response.data.dataPermissions || [];

        // 设置权限的原始数据
        setOriginalData(dataPermissions);
      } catch (err) {
        console.error('Failed to fetch data permissions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data permissions');
      } finally {
        setLoading(false);
      }
    },
    [typeCode, activeTab],
  );

  // 初始加载和切换tab时获取数据权限
  useEffect(() => {
    fetchDataPermissions(debouncedSearchText);
  }, [activeTab, typeCode, fetchDataPermissions]);

  // 处理权限级别变更
  const handlePermissionChange = (key: string, field: string, value: string) => {
    console.log(`Change ${field} for ${key} to ${value}`);

    // 更新修改的数据
    setModifiedData((prev: any) => {
      const newData = { ...prev };
      if (!newData[key]) {
        newData[key] = {};
      }
      newData[key][field] = value;

      // 通知外层组件有修改
      if (onHasChanges) {
        onHasChanges(Object.keys(newData).length > 0);
      }

      // 通知外层组件修改后的数据
      if (onGetModifiedData) {
        onGetModifiedData(newData);
      }

      return newData;
    });
  };

  // 组件挂载时通知外层组件修改后的数据
  React.useEffect(() => {
    if (onGetModifiedData) {
      onGetModifiedData(modifiedData);
    }
  }, [modifiedData, onGetModifiedData]);

  // 生成表格数据
  const generateTableData = () => {
    let data = originalData;

    // 搜索过滤
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase();
      data = data.filter((item) => item.dataPermissionName.toLowerCase().includes(searchLower));
    }

    return data.map((dataPermission) => {
      const hasModifiedData = modifiedData[dataPermission.dataPermissionCode];

      return {
        key: dataPermission.dataPermissionCode,
        dataField: dataPermission.dataPermissionName,
        thisOrganization: hasModifiedData?.SELF || dataPermission.levels.SELF,
        directSubOrganizations: hasModifiedData?.DIRECT_CHILD || dataPermission.levels.DIRECT_CHILD,
        indirectSubOrganizations:
          hasModifiedData?.NON_DIRECT_CHILD || dataPermission.levels.NON_DIRECT_CHILD,
      };
    });
  };

  // 使用useMemo优化表格数据计算
  const tableDataForDisplay = React.useMemo(() => {
    return generateTableData();
  }, [originalData, debouncedSearchText, modifiedData]);

  const columns = [
    {
      title: 'Data Fields',
      dataIndex: 'dataField',
      key: 'dataField',
    },
    {
      title: 'This Organization',
      dataIndex: 'thisOrganization',
      key: 'thisOrganization',
      width: 180,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
          disabled={!isEditMode}
        >
          {options.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Direct Sub-Organizations',
      dataIndex: 'directSubOrganizations',
      key: 'directSubOrganizations',
      width: 230,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          {options.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Indirect Sub-Organizations',
      dataIndex: 'indirectSubOrganizations',
      key: 'indirectSubOrganizations',
      width: 210,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          {options.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            placeholder="Please enter data field "
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
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
          dataSource={loading ? [] : tableDataForDisplay}
          columns={columns}
          rowKey="key"
          loading={{ spinning: loading, indicator: <Spin size="small" /> }}
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

export default OrganizationDataTable;
