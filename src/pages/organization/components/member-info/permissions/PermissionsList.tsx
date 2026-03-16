import React, { useEffect, useState } from 'react';
import { AntSpace, AntSpin, AntTable, AntTabs, AntTag } from '@shared/components';

/**
 * 权限项接口
 */
interface PermissionItem {
  /** 权限名称 */
  permission: string;
  /** 所属角色 */
  roles: string[];
}

/**
 * PermissionsList 组件属性接口
 */
interface PermissionsListProps {
  /** 角色名称 */
  roleNamesList: string[];
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 权限清单组件
 * 展示指定角色的权限清单，分为 Web 和 Phone 两个标签页
 */
const PermissionsList: React.FC<PermissionsListProps> = ({ roleNamesList, loading = false }) => {
  /** Web 权限列表 */
  const [webPermissions, setWebPermissions] = useState<PermissionItem[]>([]);
  /** Phone 权限列表 */
  const [phonePermissions, setPhonePermissions] = useState<PermissionItem[]>([]);
  /** 组件加载状态 */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 获取权限数据
   * @param roleNamesList 角色名称列表
   */
  const fetchPermissions = async (roleNamesList: string[]) => {
    setIsLoading(true);
    try {
      // 这里可以从 API 获取权限数据
      // 模拟 API 调用
      const mockWebPermissions: PermissionItem[] = [
        {
          permission: 'View Members',
          roles: roleNamesList,
        },
        {
          permission: 'Add Members',
          roles: roleNamesList,
        },
        {
          permission: 'Edit Members',
          roles: roleNamesList,
        },
        {
          permission: 'Delete Members',
          roles: roleNamesList,
        },
        {
          permission: 'View Plants',
          roles: roleNamesList,
        },
        {
          permission: 'Manage Plants',
          roles: roleNamesList,
        },
      ];

      const mockPhonePermissions: PermissionItem[] = [
        {
          permission: 'View Plants',
          roles: roleNamesList,
        },
        {
          permission: 'Monitor Plants',
          roles: roleNamesList,
        },
        {
          permission: 'Receive Alerts',
          roles: roleNamesList,
        },
      ];

      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      setWebPermissions(mockWebPermissions);
      setPhonePermissions(mockPhonePermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /** 当角色名称变化时，重新获取权限数据 */
  useEffect(() => {
    if (roleNamesList.length) {
      fetchPermissions(roleNamesList);
    }
  }, [roleNamesList]);

  return (
    <div>
      <h4>Permissions List</h4>
      <AntTabs
        defaultActiveKey="web"
        items={[
          {
            key: 'web',
            label: 'Web',
            children: (
              <AntSpin spinning={loading || isLoading}>
                <AntTable
                  dataSource={webPermissions}
                  columns={[
                    {
                      title: 'Permission',
                      dataIndex: 'permission',
                      key: 'permission',
                    },
                    {
                      title: 'Roles',
                      dataIndex: 'roles',
                      key: 'roles',
                      render: (roles: string[]) => (
                        <AntSpace>
                          {roles.map((role, index) => (
                            <AntTag key={index}>{role}</AntTag>
                          ))}
                        </AntSpace>
                      ),
                    },
                  ]}
                  pagination={false}
                  rowKey="permission"
                />
              </AntSpin>
            ),
          },
          {
            key: 'phone',
            label: 'Phone',
            children: (
              <AntSpin spinning={loading || isLoading}>
                <AntTable
                  dataSource={phonePermissions}
                  columns={[
                    {
                      title: 'Permission',
                      dataIndex: 'permission',
                      key: 'permission',
                    },
                    {
                      title: 'Roles',
                      dataIndex: 'roles',
                      key: 'roles',
                      render: (roles: string[]) => (
                        <AntSpace>
                          {roles.map((role, index) => (
                            <AntTag key={index}>{role}</AntTag>
                          ))}
                        </AntSpace>
                      ),
                    },
                  ]}
                  pagination={false}
                  rowKey="permission"
                />
              </AntSpin>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PermissionsList;
