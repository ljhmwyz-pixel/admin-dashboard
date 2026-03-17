/**
 * 组织权限表格组件
 * 用于展示和编辑组织类型的功能权限
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// 引入类型定义
import type {
  OrganizationTypeDetailFunctionalResponse, // 组织类型权限响应
  OrganizationTypePermissionItem, // 组织类型权限项
} from '@shared/types/organizationType';
import { Select, Spin } from 'antd';

import { FormButton, SearchInput, Segmented, Table } from '@/components';
// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { FUNCTIONAL_PERMISSION_OPTIONS, PLATFORM_OPTIONS } from '../../constants';

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
  /** 原始权限数据 */
  const [originalData, setOriginalData] = useState<OrganizationTypePermissionItem[]>([]);
  /** 第一级权限节点 */
  const [firstLevelNodes, setFirstLevelNodes] = useState<OrganizationTypePermissionItem[]>([]);
  /** 选中的权限编码 */
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  /** 修改后的权限数据 */
  const [modifiedData, setModifiedData] = useState<any>({});
  /** 加载状态 */
  const [loading, setLoading] = useState(false);
  /** 错误信息 */
  const [error, setError] = useState<string | null>(null);
  /** 权限搜索关键词 */
  const [searchText, setSearchText] = useState('');
  /** 防抖后的搜索关键词 */
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  /** 展开的行的key */
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

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
        const response: OrganizationTypeDetailFunctionalResponse =
          await organizationTypeApi.getOrganizationTypeFunctionalPermissions(typeCode, {
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

        // 保持当前选中的节点状态，只有当selectedKey不存在或无效时才设置为第一个节点
        if (!selectedKey || !firstLevel.some((node) => node.permissionCode === selectedKey)) {
          setSelectedKey(firstLevel[0]?.permissionCode || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    },
    [typeCode, activeTab, selectedKey],
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
    [], // 空依赖数组，因为函数内部没有使用外部变量
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
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: 'Direct Sub-Organizations',
        dataIndex: 'directSubOrganizations',
        key: 'directSubOrganizations',
        width: 220,
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: 'Indirect Sub-Organizations',
        dataIndex: 'indirectSubOrganizations',
        key: 'indirectSubOrganizations',
        width: 220,
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
    ],
    [handlePermissionChange, isEditMode],
  );

  /**
   * 渲染左侧节点列表
   */
  const renderLeftPannel = () => {
    return (
      <div className={styles.leftContainer} style={{ width: 184 }}>
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
      <div className={styles.tableContainer}>
        <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={tableDataForDisplay}
            pagination={false}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={(expandedKeys) => setExpandedRowKeys(expandedKeys as string[])}
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
        <Segmented
          options={PLATFORM_OPTIONS}
          value={activeTab}
          onChange={(value) => setActiveTab(value as string)}
        />
        <div className={styles.searchContainer}>
          <SearchInput
            allowClear={true}
            placeholder="Please enter permission"
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

      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationPermissionTable;
