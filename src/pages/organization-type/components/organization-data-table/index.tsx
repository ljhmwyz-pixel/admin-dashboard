import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { OrganizationTypeDataItem } from '@shared/types/organizationType';
import { Input, Segmented, Select, Spin, Table } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

const { Option } = Select;

interface OrganizationDataTableProps {
  typeCode: string;
  isEditMode?: boolean;
  onHasChanges?: (hasChanges: boolean) => void;
}

const OrganizationDataTable: React.FC<OrganizationDataTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
}) => {
  const [activeTab, setActiveTab] = useState('ORGANIZATION'); // 默认选中Organization权限
  const [originalData, setOriginalData] = useState<OrganizationTypeDataItem[]>([]); // 原始数据，用于比较是否有修改
  const [modifiedData, setModifiedData] = useState<any>({}); // 修改的数据
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 权限搜索关键词
  // 处理搜索
  const handleSearch = () => {
    fetchDataPermissions(searchText);
  };
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

  // 初始加载数据权限
  useEffect(() => {
    fetchDataPermissions();
  }, [typeCode, fetchDataPermissions]);

  // 当切换tab时重新获取权限数据
  useEffect(() => {
    fetchDataPermissions(searchText);
  }, [activeTab, searchText, typeCode, fetchDataPermissions]);

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
      return newData;
    });

    // 通知外层组件有修改
    setModifiedData((prev: any) => {
      const hasChanges = Object.keys(prev).length > 0;
      if (onHasChanges) {
        onHasChanges(hasChanges);
      }
      return prev;
    });
  };

  // 生成表格数据
  const generateTableData = () => {
    return originalData.map((dataPermission) => ({
      key: dataPermission.dataPermissionCode,
      dataField: dataPermission.dataPermissionName,
      thisOrganization: dataPermission.levels.SELF,
      directSubOrganizations: dataPermission.levels.DIRECT_CHILD,
      indirectSubOrganizations: dataPermission.levels.NON_DIRECT_CHILD,
    }));
  };

  const tableDataForDisplay = generateTableData();

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
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 120 }}
          onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
          disabled={!isEditMode}
        >
          <Option value="UNMASKED">Unmasked</Option>
          <Option value="MASKED">Masked</Option>
          <Option value="NO_ACCESS">No Access</Option>
        </Select>
      ),
    },
    {
      title: 'Direct Sub-Organizations',
      dataIndex: 'directSubOrganizations',
      key: 'directSubOrganizations',
      render: (text: string, record: any) => (
        <Select
          value={text}
          onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          <Option value="UNMASKED">Unmasked</Option>
          <Option value="MASKED">Masked</Option>
          <Option value="NO_ACCESS">No Access</Option>
          <Option value="---">---</Option>
        </Select>
      ),
    },
    {
      title: 'Indirect Sub-Organizations',
      dataIndex: 'indirectSubOrganizations',
      key: 'indirectSubOrganizations',
      render: (text: string, record: any) => (
        <Select
          value={text}
          onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          <Option value="UNMASKED">Unmasked</Option>
          <Option value="MASKED">Masked</Option>
          <Option value="NO_ACCESS">No Access</Option>
          <Option value="---">---</Option>
        </Select>
      ),
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
          <Table
            dataSource={tableDataForDisplay}
            columns={columns}
            pagination={false}
            rowKey="key"
          />
        </div>
      )}
    </div>
  );
};

export default OrganizationDataTable;
