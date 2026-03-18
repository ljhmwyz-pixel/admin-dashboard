import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AntSpace, AntSpin, AntTable, AntTag } from '@shared/components';
import type { SegmentedValue } from 'antd/es/segmented';
import cls from 'classnames';

import { Segmented } from '@/components';
import type { PreviewMemberPermissionData, Role } from '@/pages/organization/dto';

import styles from './PermissionsList.module.scss';

/**
 * PermissionsList 组件属性接口
 */
interface PermissionsListProps {
  /** 加载状态 */
  loading?: boolean;
  /** 权限清单 */
  permissionList?: PreviewMemberPermissionData;
}

/**
 * 权限清单组件
 * 展示指定角色的权限清单，分为 Web 和 Phone 两个标签页
 */
const PermissionsList: React.FC<PermissionsListProps> = ({ permissionList, loading = false }) => {
  const [activeKey, setActiveKey] = useState<SegmentedValue>('web');

  /**
   * 递归收集所有节点的 key
   * @param data 权限数据
   * @returns 所有节点的 key 数组
   */
  const getAllRowKeys = (data: any[]): string[] => {
    const keys: string[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        if (item.permissionId) {
          keys.push(item.permissionId);
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(data);
    return keys;
  };

  /** 计算所有需要展开的行 key */
  const expandedRowKeys = useMemo(() => {
    return getAllRowKeys(
      activeKey === 'web'
        ? permissionList?.webPermissions || []
        : permissionList?.appPermissions || [],
    );
  }, [activeKey, permissionList]);

  /** 处理标签页切换 */
  const handleStatusChange = (key: SegmentedValue) => {
    setActiveKey(key);
  };

  return (
    <div>
      <h4>Permissions List</h4>
      <div className={styles.segmentedContainer}>
        <Segmented
          value={activeKey}
          options={[
            {
              label: (
                <span
                  className={cls(styles.segmentedLabel, {
                    [styles.active]: activeKey === 'web',
                  })}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.999609 6H12.9996M2.99961 4H3.09961M5.09922 4H5.19922M7.19883 4H7.29883M2.59961 12H11.3996C12.5042 12 13.3996 11.1046 13.3996 10V4C13.3996 2.89543 12.5042 2 11.3996 2H2.59961C1.49504 2 0.599609 2.89543 0.599609 4V10C0.599609 11.1046 1.49504 12 2.59961 12Z"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Web
                </span>
              ),
              value: 'web',
            },
            {
              label: (
                <span
                  className={cls(styles.segmentedLabel, {
                    [styles.active]: activeKey === 'phone',
                  })}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8.39961V2.59961C12 1.49504 11.1046 0.599609 10 0.599609H4C2.89543 0.599609 2 1.49504 2 2.59961V8.39961M12 8.39961V11.3996C12 12.5042 11.1046 13.3996 10 13.3996H4C2.89543 13.3996 2 12.5042 2 11.3996V8.39961M12 8.39961H2M6.5 10.9996H7.5"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Phone
                </span>
              ),
              value: 'phone',
            },
          ]}
          onChange={handleStatusChange}
        />
      </div>
      <AntSpin spinning={loading}>
        <AntTable
          className={styles.table}
          dataSource={
            activeKey === 'web'
              ? permissionList?.webPermissions || []
              : permissionList?.appPermissions || []
          }
          expandable={{
            expandedRowKeys,
          }}
          columns={[
            {
              title: 'permissionName',
              dataIndex: 'permissionCode',
              key: 'permissionCode',
            },
            {
              title: 'Roles',
              dataIndex: 'roles',
              key: 'roles',
              render: (roles: Role[]) => (
                <AntSpace>
                  {roles.map((role, index) => (
                    <AntTag key={index}>{role.roleName}</AntTag>
                  ))}
                </AntSpace>
              ),
            },
          ]}
          pagination={false}
          rowKey="permissionId"
        />
      </AntSpin>
    </div>
  );
};

export default PermissionsList;
