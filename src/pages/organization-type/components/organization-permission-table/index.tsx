import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type {
  OrganizationTypePermissionItem,
  OrganizationTypePermissionResponse,
} from '@shared/types/organizationType';
import { Input, Layout, Segmented, Select, Spin, Table } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

const { Sider, Content } = Layout;
const { Option } = Select;

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
  const [originalData, setOriginalData] = useState<any>({}); // 原始数据，用于比较是否有修改
  const [modifiedData, setModifiedData] = useState<any>({}); // 修改的数据
  const [firstLevelNodes, setFirstLevelNodes] = useState<
    Omit<OrganizationTypePermissionItem, 'children'>[]
  >([]); //左侧面板一级节点列表数据
  const [selectedKey, setSelectedKey] = useState<string | null>(null); //当前选中的一级节点
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // 权限搜索关键词

  //
  // 处理搜索
  const handleSearch = () => {
    fetchPermissions(searchText);
  };

  // 处理刷新
  const handleRefresh = () => {
    fetchPermissions(searchText);
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

  // 初始加载权限数据
  useEffect(() => {
    fetchPermissions();
  }, [typeCode, fetchPermissions]);

  // 当切换tab时重新获取权限数据
  useEffect(() => {
    fetchPermissions(searchText);
  }, [activeTab, searchText, typeCode, fetchPermissions]);

  // 处理树节点点击
  const handleTreeSelect = (selectedKey: string) => {
    debugger;
    setSelectedKey(selectedKey || null);
  };

  // 生成表格数据
  const generateTableData = (
    permission: OrganizationTypePermissionItem | null,
    parentCode: string = '',
  ): any[] => {
    if (!permission) return [];

    // 只返回children数据，不显示一级节点
    if (!permission.children || permission.children.length === 0) {
      return [];
    }

    return permission.children.map((child) => {
      // 生成唯一的key，避免重复
      const uniqueKey = parentCode ? `${parentCode}-${child.permissionCode}` : child.permissionCode;

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
  };

  // 查找选中的权限
  const findPermissionByCode = (
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
  };
  debugger;
  const selectedPermission = selectedKey
    ? findPermissionByCode(selectedKey, Array.isArray(originalData) ? originalData : [])
    : null;
  const tableDataForDisplay = generateTableData(selectedPermission);

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
      render: (text: string, record: any) => (
        <Select
          value={text}
          style={{ width: 120 }}
          onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
          disabled={!isEditMode}
        >
          <Option value="ASSIGNABLE">Assignable</Option>
          <Option value="OWNER_ONLY">Owner Only</Option>
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
          style={{ width: 120 }}
          onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          <Option value="ASSIGNABLE">Assignable</Option>
          <Option value="OWNER_ONLY">Owner Only</Option>
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
          style={{ width: 120 }}
          onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
          disabled={!isEditMode}
        >
          <Option value="ASSIGNABLE">Assignable</Option>
          <Option value="OWNER_ONLY">Owner Only</Option>
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
            { label: 'Web', value: 'WEB' },
            { label: 'Phone', value: 'PHONE' },
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
        <Layout style={{ height: '100%', border: '1px solid #f0f0f0' }}>
          <Sider width={184} style={{ background: '#ffffff' }}>
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
          </Sider>
          <Content
            style={{ padding: '16px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <Table
              dataSource={tableDataForDisplay}
              columns={columns}
              pagination={false}
              rowKey="key"
              style={{ flex: 1 }}
            />
          </Content>
        </Layout>
      )}
    </div>
  );
};

export default OrganizationPermissionTable;
