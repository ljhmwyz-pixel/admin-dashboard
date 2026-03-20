import React, { useMemo, useState } from 'react';
import { DATA_PLATFORM_OPTIONS } from '@pages/organization/constants';
import { AntSpace, AntSpin, AntTable, AntTag } from '@shared/components';
import type { SegmentedValue } from 'antd/es/segmented';

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
  const [activeKey, setActiveKey] = useState<SegmentedValue>('WEB');

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
      permissionList?.platformPermissions?.find((item) => item.platform === activeKey)?.children ||
        [],
    );
  }, [activeKey, permissionList]);

  /** 处理标签页切换 */
  const handleStatusChange = (key: SegmentedValue) => {
    setActiveKey(key);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.title}>
        <span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.599609 13.4001H13.3995M4.38626 11.3704L7.26394 9.76071C7.42117 9.67277 7.55172 9.54398 7.64179 9.38797L10.9813 3.60385C11.5335 2.64726 11.2058 1.42408 10.2492 0.871799C9.29262 0.319514 8.06944 0.647265 7.51715 1.60385L4.17769 7.38797C4.08761 7.54398 4.04136 7.72143 4.04381 7.90156L4.08864 11.1985C4.0907 11.3501 4.25399 11.4444 4.38626 11.3704Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Permissions List</span>
      </div>
      <div className={styles.segmented}>
        <div className={styles.segmentedContainer}>
          <Segmented
            value={activeKey}
            options={DATA_PLATFORM_OPTIONS}
            onChange={handleStatusChange}
          />
        </div>
        <AntSpin spinning={loading} style={{ height: '100%' }}>
          <AntTable
            styles={{
              header: {
                cell: {
                  backgroundColor: '#191B1F0F',
                  color: '#191B1F99',
                  fontWeight: 500,
                },
              },
            }}
            className={styles.table}
            dataSource={
              permissionList?.platformPermissions.find((item) => item.platform === activeKey)
                ?.children || []
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
                width: '60%',
                fixed: 'left',
                render: (roles: Role[]) => (
                  <AntSpace size={10}>
                    {roles.map((role, index) => (
                      <span key={index} className={styles.tag}>
                        {role.roleName}
                      </span>
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
    </div>
  );
};

export default PermissionsList;
