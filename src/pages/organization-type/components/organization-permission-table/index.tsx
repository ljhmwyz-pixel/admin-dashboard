/**
 * 组织权限表格组件
 * 用于展示和编辑组织类型的功能权限
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
// 引入类型定义
import type {
  OrganizationTypePermissionItem, // 组织类型权限项
  OrganizationTypePermissionResponse, // 组织类型权限响应
} from '@shared/types/organizationType';
import { Input, Segmented, Select, Spin, Table } from 'antd';

// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { PERMISSION_OPTIONS, PLATFORM_OPTIONS } from './constants';

// 导入样式
import styles from './index.module.scss';

const { Option } = Select;

/**
 * 组织权限表格组件属性接口
 */
interface OrganizationPermissionTableProps {
  /** 组织类型编码 */
  typeCode: string;
  /** 是否为编辑模式 */
  isEditMode?: boolean;
  /** 有修改时的回调函数 */
  onHasChanges?: (hasChanges: boolean) => void;
  /** 获取修改数据的回调函数 */
  onGetModifiedData?: (data: any) => void;
}

const OrganizationPermissionTable: React.FC<OrganizationPermissionTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
  onGetModifiedData,
}) => {
  /** 当前选中的平台（Web或App） */
  const [activeTab, setActiveTab] = useState('WEB'); // 默认选中web端权限
  /** 原始权限数据，用于比较是否有修改 */
  const [originalData, setOriginalData] = useState<OrganizationTypePermissionItem[]>([]);
  /** 修改的权限数据 */
  const [modifiedData, setModifiedData] = useState<any>({});
  /** 左侧面板一级节点列表数据 */
  const [firstLevelNodes, setFirstLevelNodes] = useState<
    Omit<OrganizationTypePermissionItem, 'children'>[]
  >([]);
  /** 当前选中的一级节点 */
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  /** 加载状态 */
  const [loading, setLoading] = useState(false);
  /** 错误信息 */
  const [error, setError] = useState<string | null>(null);
  /** 权限搜索关键词 */
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
   * 处理搜索按钮点击
   * 当用户点击搜索按钮时，触发搜索操作
   * 直接更新防抖搜索文本，触发前端搜索
   */
  const handleSearch = () => {
    setDebouncedSearchText(searchText);
  };

  /**
   * 处理刷新按钮点击
   * 当用户点击刷新按钮时，触发重新获取权限数据操作
   * 不需要传递搜索关键词，直接刷新所有数据
   */
  const handleRefresh = () => {
    fetchPermissions();
  };

  /**
   * 获取组织类型-权限数据
   * @param keyword 搜索关键词
   */
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
        // 确保functionalPermissions是数组，防止空指针错误
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
        setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    },
    [typeCode, activeTab],
  );

  /**
   * 初始加载权限数据或当切换tab时重新获取权限数据
   */
  useEffect(() => {
    fetchPermissions();
  }, [typeCode, activeTab, fetchPermissions]);

  /**
   * 处理树节点点击
   * @param selectedKey 选中的节点编码
   */
  const handleTreeSelect = useCallback((selectedKey: string) => {
    setSelectedKey(selectedKey || null);
  }, []);

  /**
   * 根据权限编码查找权限
   * @param code 权限编码
   * @param permissions 权限数组
   * @returns 找到的权限或null
   */
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

  /**
   * 选中的权限数据
   * 使用useMemo优化计算，避免重复计算
   */
  const selectedPermission = useMemo(() => {
    return selectedKey ? findPermissionByCode(selectedKey, originalData) : null;
  }, [selectedKey, originalData, findPermissionByCode]);

  /**
   * 生成表格数据
   * @param permission 权限数据
   * @param parentCode 父权限编码
   * @returns 表格数据数组
   */
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

        // 检查是否有修改的数据
        const hasModifiedData = modifiedData[uniqueKey];

        return {
          key: uniqueKey,
          permissionName: child.permissionName,
          thisOrganization: hasModifiedData?.SELF || child.scopeLevels.SELF,
          directSubOrganizations: hasModifiedData?.DIRECT_CHILD || child.scopeLevels.DIRECT_CHILD,
          indirectSubOrganizations:
            hasModifiedData?.NON_DIRECT_CHILD || child.scopeLevels.NON_DIRECT_CHILD,
          children:
            child.children && child.children.length > 0
              ? generateTableData({ ...child, children: child.children }, uniqueKey)
              : undefined,
        };
      });
    },
    [modifiedData],
  );

  /**
   * 过滤表格数据（前端搜索）
   * @param data 原始表格数据
   * @returns 过滤后的表格数据
   */
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

  /**
   * 最终显示的表格数据
   * 使用useMemo优化计算，避免重复计算
   */
  const tableDataForDisplay = useMemo(() => {
    return filterTableData(generateTableData(selectedPermission));
  }, [filterTableData, generateTableData, selectedPermission]);

  /**
   * 处理权限级别变更
   * @param key 权限key
   * @param field 权限字段
   * @param value 权限值
   */
  const handlePermissionChange = useCallback(
    (key: string, field: string, value: string) => {
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

        // 通知外层组件修改后的数据
        if (onGetModifiedData) {
          onGetModifiedData(newData);
        }

        return newData;
      });
    },
    [onHasChanges, onGetModifiedData],
  );

  /**
   * 组件挂载或修改数据变化时通知外层组件
   */
  useEffect(() => {
    if (onGetModifiedData) {
      onGetModifiedData(modifiedData);
    }
  }, [modifiedData, onGetModifiedData]);

  /**
   * 表格列配置
   * 使用useMemo优化，避免重复创建
   */
  const columns = useMemo(
    () => [
      {
        title: 'Permissions',
        dataIndex: 'permissionName',
        key: 'permissionName',
      },
      {
        title: 'This Organization',
        dataIndex: 'thisOrganization',
        key: 'thisOrganization',
        width: 170,
        render: (text: string, record: any) => (
          <Select
            value={text}
            style={{ width: 132 }}
            onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
            disabled={!isEditMode}
          >
            {PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
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
            {PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
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
            {PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        ),
      },
    ],
    [handlePermissionChange, isEditMode],
  );

  /**
   * 渲染左侧节点列表
   */
  const renderLeftPannel = () => {
    return (
      <div style={{ width: 184, background: '#ffffff', overflow: 'auto' }}>
        {firstLevelNodes.map((node) => (
          <div
            key={node.permissionCode}
            className={styles.itemBlock}
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
    );
  };

  /**
   * 渲染右侧表格
   */
  const renderTable = () => {
    return (
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
    );
  };

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

    if (firstLevelNodes.length === 0) {
      return <div className={`${styles.statusContainer} ${styles.noData}`}>无数据</div>;
    }

    return (
      <div className={styles.treeContainer}>
        {renderLeftPannel()}
        {renderTable()}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <div className={styles.topSearchContainer}>
        <Segmented options={PLATFORM_OPTIONS} value={activeTab} onChange={setActiveTab} />
        <div className={styles.searchContainer}>
          <Input
            placeholder="Search permissions"
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

      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationPermissionTable;
