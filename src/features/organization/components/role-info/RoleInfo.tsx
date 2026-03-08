import { useCallback, useState } from 'react';
import {
  AppstoreOutlined,
  DeleteOutlined,
  DesktopOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Badge, Button, Checkbox, Dropdown, Input, Space, Table, Tag } from 'antd';
import cls from 'classnames';

import { useLanguage } from '@/shared/hooks/useLanguage';

import styles from './RoleInfo.module.scss';

interface RoleRecord {
  key: string | number;
  no: number;
  roleName: string;
  platform: {
    app?: boolean;
    web?: boolean;
  };
  members: number;
  status: 'Normal' | 'Deleted';
  description: string;
}

interface RoleInfoProps {
  onAdd?: () => void;
  onEdit?: (record: RoleRecord) => void;
  onView?: (record: RoleRecord) => void;
  onDelete?: (record: RoleRecord) => void;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ onAdd, onEdit, onView, onDelete }) => {
  const { t } = useLanguage();

  // 状态筛选：'all' | 'normal' | 'deleted'
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'deleted'>('all');

  // Platform 筛选
  const [platformFilter, setPlatformFilter] = useState<{
    app?: boolean;
    web?: boolean;
  }>({});

  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');

  // 加载中状态
  const [loading, setLoading] = useState(false);

  // 表格高度
  const [tableHeight, setTableHeight] = useState<number | string>('calc(100vh - 280px)');

  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 92,
  });

  // 模拟数据
  const mockData: RoleRecord[] = [
    {
      key: 1,
      no: 1,
      roleName: 'Organization Owner',
      platform: { app: true, web: true },
      members: 1,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 2,
      no: 2,
      roleName: 'FAE',
      platform: { app: true, web: true },
      members: 4,
      status: 'Deleted',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 3,
      no: 3,
      roleName: 'FAE',
      platform: { app: true, web: true },
      members: 5,
      status: 'Deleted',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 4,
      no: 4,
      roleName: 'Electrician',
      platform: { app: true, web: true },
      members: 12,
      status: 'Deleted',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 5,
      no: 5,
      roleName: 'CED',
      platform: { app: true, web: true },
      members: 8,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 6,
      no: 6,
      roleName: 'Organization Owner',
      platform: { app: true, web: true },
      members: 1,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 7,
      no: 7,
      roleName: 'Electrician',
      platform: { app: true, web: true },
      members: 12,
      status: 'Deleted',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 8,
      no: 8,
      roleName: 'CED',
      platform: { app: true, web: true },
      members: 17,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 9,
      no: 9,
      roleName: 'Organization Owner',
      platform: { app: true, web: true },
      members: 12,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: 10,
      no: 10,
      roleName: 'CED',
      platform: { app: true, web: true },
      members: 1,
      status: 'Deleted',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
  ];

  // 根据筛选条件过滤数据
  const filteredData = mockData.filter((item) => {
    // 状态筛选
    if (statusFilter === 'normal' && item.status !== 'Normal') return false;
    if (statusFilter === 'deleted' && item.status !== 'Deleted') return false;

    // Platform 筛选
    const hasAppFilter = platformFilter.app !== undefined;
    const hasWebFilter = platformFilter.web !== undefined;

    if (hasAppFilter || hasWebFilter) {
      // 如果设置了筛选，至少需要匹配一个平台
      let matchesPlatform = false;
      if (platformFilter.app && item.platform.app) matchesPlatform = true;
      if (platformFilter.web && item.platform.web) matchesPlatform = true;
      if (!matchesPlatform) return false;
    }

    // 搜索筛选
    if (searchKeyword && !item.roleName.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }

    return true;
  });

  // 加载数据（调用接口）
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 调用实际接口
      // await api.getRoles({
      //   page: pagination.current,
      //   pageSize: pagination.pageSize,
      //   status: statusFilter !== 'all' ? statusFilter : undefined,
      //   keyword: searchKeyword || undefined,
      // });

      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, statusFilter, searchKeyword]);

  // 刷新 - 重置所有筛选条件
  const handleRefresh = useCallback(() => {
    setStatusFilter('all');
    setPlatformFilter({});
    setSearchKeyword('');
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData();
  }, [loadData]);

  // Platform 筛选变化
  const handlePlatformChange = (checkedValues: (string | number)[]) => {
    setPlatformFilter({
      app: checkedValues.includes('app'),
      web: checkedValues.includes('web'),
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 清空 Platform 筛选
  const handleClearPlatformFilter = () => {
    setPlatformFilter({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 状态筛选
  const handleStatusChange = (status: 'all' | 'normal' | 'deleted') => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData();
  };

  // 分页变化
  const handleTableChange: TableProps<RoleRecord>['onChange'] = (newPagination) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 20,
      total: newPagination.total || 0,
    });
    loadData();
  };

  // 表格列定义
  const columns: TableProps<RoleRecord>['columns'] = [
    {
      title: (
        <input
          type="checkbox"
          className={styles.checkboxHeader}
          onChange={(e) => {
            // TODO: 全选/取消全选
            console.log('Select all:', e.target.checked);
          }}
        />
      ),
      dataIndex: 'key',
      key: 'selection',
      width: 50,
      render: (_, record) => (
        <input
          type="checkbox"
          onChange={() => {
            // TODO: 单选
            console.log('Select record:', record);
          }}
        />
      ),
    },
    {
      title: t('role.col.no') || 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: (no: number) => no,
    },
    {
      title: t('role.col.name') || 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 100,
    },
    {
      title: (
        <Dropdown
          menu={{
            items: [
              {
                key: 'platform-filter',
                label: (
                  <div className={styles.platformFilterDropdown}>
                    <Checkbox.Group
                      value={[
                        ...(platformFilter.app ? ['app'] : []),
                        ...(platformFilter.web ? ['web'] : []),
                      ]}
                      onChange={handlePlatformChange}
                      className={styles.platformCheckboxGroup}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Checkbox value="app" className={styles.platformCheckbox}>
                          <Space>
                            <AppstoreOutlined />
                            App
                          </Space>
                        </Checkbox>
                        <Checkbox value="web" className={styles.platformCheckbox}>
                          <Space>
                            <DesktopOutlined />
                            Web
                          </Space>
                        </Checkbox>
                      </Space>
                    </Checkbox.Group>
                    {(platformFilter.app || platformFilter.web) && (
                      <div className={styles.platformFilterFooter}>
                        <Button
                          type="link"
                          size="small"
                          onClick={handleClearPlatformFilter}
                          icon={<ReloadOutlined />}
                        >
                          清空筛选
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space className={styles.platformFilterTrigger}>
            Platform
            {(platformFilter.app || platformFilter.web) && (
              <span className={styles.filterIndicator} />
            )}
          </Space>
        </Dropdown>
      ),
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: RoleRecord['platform']) => (
        <Space size="small">
          {platform.app && (
            <Tag color="cyan" className={styles.platformTag}>
              <AppstoreOutlined /> App
            </Tag>
          )}
          {platform.web && (
            <Tag color="green" className={styles.platformTag}>
              <DesktopOutlined /> Web
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('role.col.members') || 'Number of Members',
      dataIndex: 'members',
      key: 'members',
      width: 100,
      align: 'left',
    },
    {
      title: (
        <Dropdown
          menu={{
            items: [
              {
                key: 'status-all',
                label: (
                  <div
                    className={cls(styles.statusFilterItem, {
                      [styles.statusFilterItemActive]: statusFilter === 'all',
                    })}
                    onClick={() => handleStatusChange('all')}
                  >
                    All
                  </div>
                ),
              },
              {
                key: 'status-normal',
                label: (
                  <div
                    className={cls(styles.statusFilterItem, {
                      [styles.statusFilterItemActive]: statusFilter === 'normal',
                    })}
                    onClick={() => handleStatusChange('normal')}
                  >
                    <Badge color="#52c41a" text="Normal" />
                  </div>
                ),
              },
              {
                key: 'status-deleted',
                label: (
                  <div
                    className={cls(styles.statusFilterItem, {
                      [styles.statusFilterItemActive]: statusFilter === 'deleted',
                    })}
                    onClick={() => handleStatusChange('deleted')}
                  >
                    <Badge color="#ff4d4f" text="Deleted" />
                  </div>
                ),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space className={styles.statusFilterTrigger}>
            Status
            {statusFilter !== 'all' && <span className={styles.filterIndicator} />}
          </Space>
        </Dropdown>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: RoleRecord['status']) => (
        <Badge
          color={status === 'Normal' ? '#52c41a' : '#ff4d4f'}
          text={status}
          className={cls(styles.statusBadge, {
            [styles.statusNormal]: status === 'Normal',
            [styles.statusDeleted]: status === 'Deleted',
          })}
        />
      ),
    },
    {
      title: t('role.col.description') || 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: t('role.col.operation') || 'Operation',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" className={styles.operationButtons}>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView?.(record)}
            title="View"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
            title="Edit"
          />
          {record.status === 'Deleted' ? (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDelete?.(record)}
              title="Delete permanently"
              danger
            />
          ) : (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDelete?.(record)}
              title="Delete"
              danger
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.roleInfo}>
      {/* 顶部操作栏 */}
      <div className={styles.header}>
        {/* 左侧：状态筛选 */}
        <div className={styles.headerLeft}>
          <Space size="small">
            <Button
              type={statusFilter === 'all' ? 'primary' : 'default'}
              onClick={() => handleStatusChange('all')}
              className={cls(styles.filterButton, {
                [styles.filterButtonActive]: statusFilter === 'all',
              })}
            >
              All
            </Button>
            <Button
              type={statusFilter === 'normal' ? 'primary' : 'default'}
              onClick={() => handleStatusChange('normal')}
              className={cls(styles.filterButton, {
                [styles.filterButtonActive]: statusFilter === 'normal',
              })}
            >
              Normal
            </Button>
            <Button
              type={statusFilter === 'deleted' ? 'primary' : 'default'}
              onClick={() => handleStatusChange('deleted')}
              className={cls(styles.filterButton, {
                [styles.filterButtonActive]: statusFilter === 'deleted',
              })}
            >
              Deleted
            </Button>
          </Space>
        </div>

        {/* 右侧：搜索 + 操作按钮 */}
        <div className={styles.headerRight}>
          <Space size="middle">
            <Input.Search
              placeholder={t('role.placeholder.search') || 'Please enter role name'}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              allowClear
              className={styles.searchInput}
              style={{ width: 240 }}
            />
            <Space size="small">
              <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Add
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} title="Refresh" />
            </Space>
          </Space>
        </div>
      </div>

      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table<RoleRecord>
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `1-${Math.min(pagination.pageSize, total)} of ${total} items`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          rowKey="key"
          scroll={{ x: 1200, y: 'calc(100vh - 280px)' }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default RoleInfo;
