import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type {
  OrganizationTypePermissionItem,
  OrganizationTypePermissionResponse,
} from '@shared/types/organizationType';
import { Input, Segmented, Select, Spin, Table } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

const { Option } = Select;
// 抽离出options
const permissionOptions = [
  { label: 'Assignable', value: 'ASSIGNABLE' },
  { label: 'Owner Only', value: 'OWNER_ONLY' },
  { label: 'No Access', value: 'NO_ACCESS' },
];

interface OrganizationPermissionTableProps {
  typeCode: string;
  isEditMode?: boolean;
  onHasChanges?: (hasChanges: boolean) => void;
}

const OrganizationPermissionTable: React.FC<OrganizationPermissionTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
}) => {
  const [activeTab, setActiveTab] = useState('WEB'); // 默认选中web端权限 (实际值)
  const [originalData, setOriginalData] = useState<OrganizationTypePermissionItem[]>([]); // 原始数据，用于比较是否有修改
  const [modifiedData, setModifiedData] = useState<any>({}); // 修改的数据
  const [firstLevelNodes, setFirstLevelNodes] = useState<
    Omit<OrganizationTypePermissionItem, 'children'>[]
  >([]); //左侧面板一级节点列表数据
  const [selectedKey, setSelectedKey] = useState<string | null>(null); //当前选中的一级节点
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 权限搜索关键词
  const [debouncedSearchText, setDebouncedSearchText] = useState(''); // 防抖后的搜索关键词

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [searchText]);

  // 处理搜索
  const handleSearch = () => {
    // 直接更新防抖搜索文本，触发前端搜索
    setDebouncedSearchText(searchText);
  };

  // 处理刷新
  const handleRefresh = () => {
    // 刷新时重新获取数据，不需要传递搜索关键词
    fetchPermissions();
  };

  // 获取组织类型-权限数据
  const fetchPermissions = useCallback(
    async (keyword?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response: OrganizationTypePermissionResponse =
          await organizationTypeApi.getOrganizationTypePermissions(typeCode, {
            permissionType: 'FUNCTIONAL',
            platform: activeTab,
            permissionKeyword: keyword,
          });
        const functionalPermissions: OrganizationTypePermissionItem[] =
          response.data.functionalPermissions || [];

        // 设置权限的原始数据
        setOriginalData(functionalPermissions);
        // 提取第一级节点，排除children属性
        const firstLevel = functionalPermissions.map(({ children, ...rest }) => rest);
        setFirstLevelNodes(firstLevel);
        // 直接使用firstLevel设置selectedKey，而不是依赖状态更新
        setSelectedKey(firstLevel[0]?.permissionCode || null);
      } catch (err) {
        console.error('Failed to fetch permissions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    },
    [typeCode, activeTab],
  );

  // 初始加载权限数据或当切换tab时重新获取权限数据
  useEffect(() => {
    fetchPermissions();
  }, [typeCode, activeTab, fetchPermissions]);

  // 处理树节点点击
  const handleTreeSelect = (selectedKey: string) => {
    setSelectedKey(selectedKey || null);
  };

  // 查找选中的权限
  const findPermissionByCode = useCallback(
    (
      code: string,
      permissions: OrganizationTypePermissionItem[],
    ): OrganizationTypePermissionItem | null => {
      // 确保permissions是数组
      if (!Array.isArray(permissions)) {
        return null;
      }

      for (const permission of permissions) {
        if (permission.permissionCode === code) {
          return permission;
        }
        if (permission.children && Array.isArray(permission.children)) {
          const found = findPermissionByCode(code, permission.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    [],
  );

  // 使用useMemo优化selectedPermission的计算
  const selectedPermission = useMemo(() => {
    return selectedKey ? findPermissionByCode(selectedKey, originalData) : null;
  }, [selectedKey, originalData, findPermissionByCode]);

  // 生成表格数据
  const generateTableData = useCallback(
    (permission: OrganizationTypePermissionItem | null, parentCode: string = ''): any[] => {
      if (!permission) return [];

      // 只返回children数据，不显示一级节点
      if (!permission.children || permission.children.length === 0) {
        return [];
      }

      return permission.children.map((child) => {
        // 生成唯一的key，避免重复
        const uniqueKey = parentCode
          ? `${parentCode}-${child.permissionCode}`
          : child.permissionCode;

        return {
          key: uniqueKey,
          permissionName: child.permissionName,
          thisOrganization: child.scopeLevels.SELF,
          directSubOrganizations: child.scopeLevels.DIRECT_CHILD,
          indirectSubOrganizations: child.scopeLevels.NON_DIRECT_CHILD,
          children:
            child.children && child.children.length > 0
              ? generateTableData({ ...child, children: child.children }, uniqueKey)
              : undefined,
        };
      });
    },
    [],
  );

  // 过滤表格数据（前端搜索）
  const filterTableData = useCallback(
    (data: any[]): any[] => {
      if (!debouncedSearchText) return data;

      const searchLower = debouncedSearchText.toLowerCase();

      const filterRecursive = (items: any[]): any[] => {
        return items
          .map((item) => {
            // 过滤子节点
            const filteredChildren = item.children ? filterRecursive(item.children) : [];

            // 检查当前节点或其子节点是否匹配搜索条件
            const itemMatches = item.permissionName.toLowerCase().includes(searchLower);
            const hasMatchingChildren = filteredChildren.length > 0;

            if (itemMatches || hasMatchingChildren) {
              return {
                ...item,
                children: filteredChildren.length > 0 ? filteredChildren : undefined,
              };
            }
            return null;
          })
          .filter(Boolean) as any[];
      };

      return filterRecursive(data);
    },
    [debouncedSearchText],
  );

  // 使用useMemo优化表格数据计算
  const tableDataForDisplay = useMemo(() => {
    return filterTableData(generateTableData(selectedPermission));
  }, [filterTableData, generateTableData, selectedPermission]);

  // 处理权限级别变更
  const handlePermissionChange = (key: string, field: string, value: string) => {
    console.log(`Change ${field} for ${key} to ${value}`);

    // 更新修改的数据并通知外层组件
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

      return newData;
    });
  };

  const columns = [
    {
      title: 'Permissions',
      dataIndex: 'permissionName',
      key: 'permissionName',
    },
    {
      title: 'This Organization',
      dataIndex: 'thisOrganization',
      key: 'thisOrganization',
      width: 150,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
          disabled={!isEditMode}
        >
          {permissionOptions.map((item) => (
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
      width: 220,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          {permissionOptions.map((item) => (
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
      width: 220,
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 132 }}
          onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          {permissionOptions.map((item) => (
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
            { label: 'Web', value: 'WEB' },
            { label: 'App', value: 'APP' },
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
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
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
      ) : (
        <div className={styles.treeContainer} style={{ flex: 1 }}>
          {firstLevelNodes.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#8c8c8c',
              }}
            >
              无数据
            </div>
          ) : (
            <>
              <div style={{ width: 184, background: '#ffffff', overflow: 'auto' }}>
                {firstLevelNodes.map((node) => (
                  <div
                    key={node.permissionCode}
                    className={styles.itemBlock}
                    style={{ padding: '8px 16px' }}
                    onClick={() => handleTreeSelect(node.permissionCode)}
                  >
                    <div
                      className={`${styles.itemName} ${selectedKey === node.permissionCode ? styles.active : ''}`}
                    >
                      {node.permissionName}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
                  <Table
                    dataSource={tableDataForDisplay}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                    locale={{ emptyText: '无数据' }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationPermissionTable;
