import React, { useEffect, useState } from 'react';

import { AntCheckbox } from '@/shared/components';
import { useLanguage } from '@/shared/hooks';

import TreeCheckList from './TreeCheckList';

import styles from './RolePermissions.module.scss';

interface IRolePermissions {
  rolePermissionData?: any;
  onChange?: (selectedKeys: Record<string, string[]>) => void; // 返回选中的节点 key 集合
  permissionTreeKeys?: any; // 默认选中的节点 key 集合（树形结构）
  mode?: 'view' | 'edit'; // 模式：查看或编辑
  checkedKeys?: Record<string, string[]>; // 受控模式的选中 keys
}

const RolePermissions: React.FC<IRolePermissions> = ({
  rolePermissionData,
  onChange,
  permissionTreeKeys,
  mode = 'edit',
  checkedKeys,
}) => {
  const { t } = useLanguage();

  // 初始化选中的权限状态
  const getInitialCheckedKeysMap = () => {
    if (permissionTreeKeys) {
      return {
        Web: extractPermissionIds(permissionTreeKeys.webPermissions || []),
        Phone: extractPermissionIds(permissionTreeKeys.appPermissions || []),
      };
    }
    return {
      Web: [],
      Phone: [],
    };
  };

  // 从权限树中提取所有选中的权限 ID（叶子节点）
  const extractPermissionIds = (permissions: any[]): string[] => {
    const ids: string[] = [];
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        // 如果是叶子节点（没有子节点或子节点为空数组），则收集其 permissionId
        if (!node.children || node.children.length === 0) {
          ids.push(node.permissionId);
        } else {
          // 有子节点，递归遍历
          traverse(node.children);
        }
      });
    };
    traverse(permissions);
    return ids;
  };

  // 为每个平台维护独立的选中状态（支持受控和非受控）
  const [internalCheckedKeysMap, setInternalCheckedKeysMap] =
    useState<Record<string, string[]>>(getInitialCheckedKeysMap);

  // 如果父组件传递了 checkedKeys，则使用父组件的值（受控模式），否则使用内部状态
  const checkedKeysMap = checkedKeys !== undefined ? checkedKeys : internalCheckedKeysMap;

  const permissionsPlatform = [
    {
      treeData:
        mode === 'view' ? permissionTreeKeys?.webPermissions || [] : rolePermissionData || [],
      label: 'Web',
      color: 'rgba(49, 196, 127, 1)',
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.999609 6H12.9996M2.99961 4H3.09961M5.09922 4H5.19922M7.19883 4H7.29883M2.59961 12H11.3996C12.5042 12 13.3996 11.1046 13.3996 10V4C13.3996 2.89543 12.5042 2 11.3996 2H2.59961C1.49504 2 0.599609 2.89543 0.599609 4V10C0.599609 11.1046 1.49504 12 2.59961 12Z"
            stroke="#31C47F"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      treeData: [],
      label: 'Phone',
      color: '#33C2C8',
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8.4001V2.6001C12 1.49553 11.1046 0.600098 10 0.600098H4C2.89543 0.600098 2 1.49553 2 2.6001V8.4001M12 8.4001V11.4001C12 12.5047 11.1046 13.4001 10 13.4001H4C2.89543 13.4001 2 12.5047 2 11.4001V8.4001M12 8.4001H2M6.5 11.0001H7.5"
            stroke="#33C2C8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  // 获取所有 checkbox 的 keys（包括所有层级）
  const getAllKeys = (nodes: any[]): string[] => {
    if (!nodes || !Array.isArray(nodes)) return [];

    const keys: string[] = [];
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        keys.push(node.permissionId);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return keys;
  };

  const handleSelectAll = (platform: string) => (e: any) => {
    const checked = e.target.checked;
    const platformTreeData =
      permissionsPlatform.find((item) => item.label === platform)?.treeData || [];
    const allKeys = getAllKeys(platformTreeData);

    const newCheckedKeysMap = {
      ...checkedKeysMap,
      [platform]: checked ? allKeys : [],
    };

    // 更新内部状态（如果是非受控模式）
    if (checkedKeys === undefined) {
      setInternalCheckedKeysMap(newCheckedKeysMap);
    }
    onChange?.(newCheckedKeysMap);
  };

  return (
    <div className={styles.rolePermissionsContainer}>
      <div className={styles.rolePermissionsheader}>
        <div className={styles.rolePermissionsheaderIcon}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.59961 8.4001L2.8925 13.1072C2.70497 13.2947 2.45061 13.4001 2.1854 13.4001H0.699609C0.644381 13.4001 0.599609 13.3553 0.599609 13.3001V11.8143C0.599609 11.5491 0.704966 11.2947 0.892503 11.1072L5.59961 6.4001M3.99961 8.0001L2.99961 7.0001M1.99961 10.0001L0.999611 9.0001M13.3996 4.6001C13.3996 6.80924 11.6088 8.6001 9.39961 8.6001C7.19047 8.6001 5.39961 6.80924 5.39961 4.6001C5.39961 2.39096 7.19047 0.600098 9.39961 0.600098C11.6088 0.600098 13.3996 2.39096 13.3996 4.6001ZM9.89961 4.6001C9.89961 4.87624 9.67575 5.1001 9.39961 5.1001C9.12347 5.1001 8.89961 4.87624 8.89961 4.6001C8.89961 4.32396 9.12347 4.1001 9.39961 4.1001C9.67575 4.1001 9.89961 4.32396 9.89961 4.6001Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={styles.rolePermissionsTitleText}>{t('role.field.permissions')}</div>
      </div>
      <div className={styles.rolePermissionsBodyContainer}>
        {permissionsPlatform.map((item, index) => {
          const currentCheckedKeys = checkedKeysMap[item.label] || [];
          const allKeys = getAllKeys(item.treeData || []);
          const isAllChecked = currentCheckedKeys.length === allKeys.length;

          return (
            <div key={index} className={styles.rolePermissionsBody}>
              <div className={styles.header}>
                {item.icon}
                <div className={styles.headerText} style={{ color: item.color }}>
                  {item.label}
                </div>
              </div>
              <div className={styles.content}>
                <TreeCheckList
                  data={item.treeData}
                  checkedKeys={currentCheckedKeys}
                  hideCheckbox={mode === 'view'}
                  onChange={(keys) => {
                    const newCheckedKeysMap = {
                      ...checkedKeysMap,
                      [item.label]: keys,
                    };
                    setInternalCheckedKeysMap(newCheckedKeysMap);
                    onChange?.(newCheckedKeysMap);
                  }}
                />
              </div>
              {mode === 'view' || item.treeData.length === 0 ? null : (
                <div className={styles.footer}>
                  <span className={styles.selectAll}>Select All</span>
                  <AntCheckbox
                    checked={isAllChecked}
                    indeterminate={!isAllChecked && currentCheckedKeys.length > 0}
                    onChange={handleSelectAll(item.label)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RolePermissions;
