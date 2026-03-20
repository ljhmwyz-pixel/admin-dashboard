/**
 * 权限内容组件
 * 用于展示单个平台的组织类型功能权限
 */
import React, { useCallback, useMemo } from 'react';
// 引入类型定义
import type {
  OrganizationTypePermissionItem, // 组织类型权限项
} from '@shared/types/organizationType';
import { Select, Spin, Table } from 'antd';

import { TableSelect } from '@/components';

// 导入常量
import { FUNCTIONAL_PERMISSION_OPTIONS } from '../../constants';

// 导入样式
import styles from './index.module.scss';

const { Option } = Select;

// 平台数据接口
export interface PlatformData {
  originalData: OrganizationTypePermissionItem[];
  firstLevelNodes: OrganizationTypePermissionItem[];
  selectedKey: string | null;
  expandedRowKeys: string[];
  loading: boolean;
  error: string | null;
  searchText: string;
  debouncedSearchText: string;
  modifiedData: any;
}

// 组件属性接口
interface PermissionContentProps {
  platform: string;
  data: PlatformData;
  typeCode: string;
  isEditMode: boolean;
  onPermissionChange: (platform: string, key: string, field: string, value: string) => void;
  onTreeSelect: (platform: string, selectedKey: string) => void;
  onExpandedRowsChange: (platform: string, expandedKeys: string[]) => void;
}

const PermissionContent: React.FC<PermissionContentProps> = ({
  platform,
  data,
  typeCode,
  isEditMode,
  onPermissionChange,
  onTreeSelect,
  onExpandedRowsChange,
}) => {
  // 根据权限编码查找权限
  const findPermissionByCode = useCallback(function find(
    code: string,
    permissions: OrganizationTypePermissionItem[],
  ): OrganizationTypePermissionItem | null {
    if (!Array.isArray(permissions)) {
      return null;
    }

    for (const permission of permissions) {
      if (permission.permissionCode === code) {
        return permission;
      }
      if (permission.children && Array.isArray(permission.children)) {
        const found = find(code, permission.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  // 选中的权限数据
  const selectedPermission = useMemo(() => {
    return data.selectedKey ? findPermissionByCode(data.selectedKey, data.originalData) : null;
  }, [data.selectedKey, data.originalData, findPermissionByCode]);

  // 生成表格数据
  const generateTableData = useCallback(
    (permission: OrganizationTypePermissionItem | null, parentCode: string = ''): any[] => {
      if (!permission) return [];

      // 生成当前节点的唯一key
      const uniqueKey = parentCode
        ? `${parentCode}-${permission.permissionCode}`
        : permission.permissionCode;

      // 检查是否有修改的数据
      const hasModifiedData = data.modifiedData[uniqueKey];

      // 创建当前节点
      const currentNode: any = {
        key: uniqueKey,
        permissionName: permission.permissionName,
        thisOrganization: hasModifiedData?.SELF || permission.scopeLevels.SELF,
        directSubOrganizations:
          hasModifiedData?.DIRECT_CHILD || permission.scopeLevels.DIRECT_CHILD,
        indirectSubOrganizations:
          hasModifiedData?.NON_DIRECT_CHILD || permission.scopeLevels.NON_DIRECT_CHILD,
        children: undefined,
      };

      // 处理子节点
      if (permission.children && permission.children.length > 0) {
        currentNode.children = permission.children.map((child) => {
          const childKey = `${uniqueKey}-${child.permissionCode}`;
          const childHasModifiedData = data.modifiedData[childKey];

          return {
            key: childKey,
            permissionName: child.permissionName,
            thisOrganization: childHasModifiedData?.SELF || child.scopeLevels.SELF,
            directSubOrganizations:
              childHasModifiedData?.DIRECT_CHILD || child.scopeLevels.DIRECT_CHILD,
            indirectSubOrganizations:
              childHasModifiedData?.NON_DIRECT_CHILD || child.scopeLevels.NON_DIRECT_CHILD,
            children:
              child.children && child.children.length > 0
                ? child.children.map((grandChild) => {
                    const grandChildKey = `${childKey}-${grandChild.permissionCode}`;
                    const grandChildHasModifiedData = data.modifiedData[grandChildKey];

                    return {
                      key: grandChildKey,
                      permissionName: grandChild.permissionName,
                      thisOrganization:
                        grandChildHasModifiedData?.SELF || grandChild.scopeLevels.SELF,
                      directSubOrganizations:
                        grandChildHasModifiedData?.DIRECT_CHILD ||
                        grandChild.scopeLevels.DIRECT_CHILD,
                      indirectSubOrganizations:
                        grandChildHasModifiedData?.NON_DIRECT_CHILD ||
                        grandChild.scopeLevels.NON_DIRECT_CHILD,
                    };
                  })
                : undefined,
          };
        });
      }

      return [currentNode];
    },
    [data.modifiedData],
  );

  // 过滤表格数据
  const filterTableData = useCallback(
    (tableData: any[]): any[] => {
      if (!data.debouncedSearchText) return tableData;

      const searchLower = data.debouncedSearchText.toLowerCase();

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

      return filterRecursive(tableData);
    },
    [data.debouncedSearchText],
  );

  // 最终显示的表格数据
  const tableDataForDisplay = useMemo(() => {
    return filterTableData(generateTableData(selectedPermission));
  }, [filterTableData, generateTableData, selectedPermission]);

  // 处理权限级别变更
  const handlePermissionChange = useCallback(
    (key: string, field: string, value: string) => {
      onPermissionChange(platform, key, field, value);
    },
    [platform, onPermissionChange],
  );

  // 表格列配置
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
          if (text === 'NOT_APPLICABLE') {
            return '--';
          }
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
      {
        title: 'Direct Sub-Organizations',
        dataIndex: 'directSubOrganizations',
        key: 'directSubOrganizations',
        width: 220,
        render: (text: string, record: any) => {
          if (text === 'NOT_APPLICABLE') {
            return '--';
          }
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
      {
        title: 'Indirect Sub-Organizations',
        dataIndex: 'indirectSubOrganizations',
        key: 'indirectSubOrganizations',
        width: 220,
        render: (text: string, record: any) => {
          if (text === 'NOT_APPLICABLE') {
            return '--';
          }
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = FUNCTIONAL_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
            >
              {FUNCTIONAL_PERMISSION_OPTIONS.map((item: { label: string; value: string }) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
    ],
    [handlePermissionChange, isEditMode],
  );

  // 渲染左侧节点列表
  const renderLeftPannel = () => {
    return (
      <div className={styles.leftContainer} style={{ width: 184 }}>
        {data.firstLevelNodes.map((node) => (
          <div
            key={node.permissionCode}
            className={styles.itemBlock}
            onClick={() => onTreeSelect(platform, node.permissionCode)}
          >
            <div
              className={`${styles.itemName} ${data.selectedKey === node.permissionCode ? styles.active : ''}`}
            >
              {node.permissionName}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染右侧表格
  const renderTable = () => {
    return (
      <div className={styles.tableContainer}>
        <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={tableDataForDisplay}
            pagination={false}
            expandedRowKeys={data.expandedRowKeys}
            scroll={{ y: window.innerHeight - 365 }}
            onExpandedRowsChange={(expandedKeys) => {
              onExpandedRowsChange(platform, expandedKeys as string[]);
            }}
            rowClassName={() => (isEditMode ? styles.editRow : styles.readOnlyRow)}
          />
        </div>
      </div>
    );
  };

  // 渲染内容区域
  const renderContent = () => {
    if (data.loading) {
      return (
        <div className={styles.statusContainer}>
          <Spin size="large" />
        </div>
      );
    }

    if (data.error) {
      return <div className={`${styles.statusContainer} ${styles.errData}`}>{data.error}</div>;
    }

    if (data.firstLevelNodes.length === 0) {
      return <div className={`${styles.statusContainer} ${styles.noData}`}>无数据</div>;
    }

    return (
      <div className={styles.treeContainer}>
        {renderLeftPannel()}
        {renderTable()}
      </div>
    );
  };

  return renderContent();
};

export default PermissionContent;
