import React, { useCallback } from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { Pagination, PlatformFilter, RoleRecord } from '@pages/organization/dto';
import {
  AntButton,
  AntCheckbox,
  AntDropdown,
  AntSpace,
  AntTable,
  AntTag,
  AntTooltip,
} from '@shared/components';

// import { useLanguage } from '@shared/hooks/useLanguage';
import styles from './RoleTable.module.scss';

interface RoleTableProps {
  dataSource: RoleRecord[];
  loading: boolean;
  pagination: Pagination;
  onTableChange: (pagination: any) => void;
  selectedKeys: string[];
  onSelectChange: (selectedRowKeys: string[], selectedRows: RoleRecord[]) => void;
  onSelectAll: (selected: boolean, selectedRows: RoleRecord[]) => void;
  platformFilter: PlatformFilter;
  onPlatformChange: (checkedValues: (string | number)[]) => void;
  onStatusChange: (status: 'all' | 'normal' | 'deleted') => void;
  onView?: (record: RoleRecord) => void;
  onEdit?: (record: RoleRecord) => void;
  onDelete?: (record: RoleRecord) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
  dataSource,
  loading,
  pagination,
  onTableChange,
  selectedKeys,
  onSelectChange,
  onSelectAll,
  platformFilter,
  onPlatformChange,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
}) => {
  // const { t } = useLanguage();

  // 平台筛选选项
  const platformOptions = [
    { label: 'App', value: 'app' },
    { label: 'Web', value: 'web' },
  ];

  // 状态筛选选项
  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Normal', value: 'normal' },
    { label: 'Deleted', value: 'deleted' },
  ];

  // 计算当前选中的平台筛选值
  const selectedPlatformValues: string[] = [];
  if (platformFilter.app === true) selectedPlatformValues.push('app');
  if (platformFilter.web === true) selectedPlatformValues.push('web');

  // 处理平台筛选菜单点击
  const handlePlatformMenuClick = useCallback(
    (checkedValues: string[]) => {
      onPlatformChange(checkedValues);
    },
    [onPlatformChange],
  );

  // 平台筛选菜单
  const platformMenu = (
    <div className={styles.platformFilterMenuContent}>
      {platformOptions.map((option) => (
        <div key={option.value} className={styles.platformFilterItem}>
          <span>{option.label}</span>
          <AntCheckbox
            checked={platformFilter[option.value as keyof PlatformFilter] === true}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...selectedPlatformValues, option.value]
                : selectedPlatformValues.filter((v) => v !== option.value);
              handlePlatformMenuClick(newValues);
            }}
          />
        </div>
      ))}
    </div>
  );

  // 状态筛选菜单
  const statusMenu = (
    <div className={styles.platformFilterMenuContent}>
      {statusOptions.map((option) => (
        <div key={option.value} className={styles.platformFilterItem}>
          <span
            onClick={() => {
              onStatusChange(option.value as 'all' | 'normal' | 'deleted');
            }}
          >
            {option.label}
          </span>
        </div>
      ))}
    </div>
  );

  // 表格列定义
  const columns = [
    {
      title: (
        <AntCheckbox
          indeterminate={selectedKeys.length > 0 && selectedKeys.length < dataSource.length}
          checked={selectedKeys.length === dataSource.length && dataSource.length > 0}
          onChange={(e) => onSelectAll(e.target.checked, dataSource)}
        />
      ),
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (key: string | number) => (
        <AntCheckbox
          checked={selectedKeys.includes(key.toString())}
          onChange={(e) => {
            if (e.target.checked) {
              onSelectChange(
                [...selectedKeys, key.toString()],
                dataSource.filter((item) =>
                  [...selectedKeys, key.toString()].includes(item.key.toString()),
                ),
              );
            } else {
              onSelectChange(
                selectedKeys.filter((k) => k !== key.toString()),
                dataSource.filter((item) =>
                  selectedKeys.filter((k) => k !== key.toString()).includes(item.key.toString()),
                ),
              );
            }
          }}
        />
      ),
    },
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 80,
    },
    {
      title: 'Role name',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 180,
    },
    {
      title: (
        <AntDropdown
          menu={{ items: [{ key: 'platform', label: platformMenu }] }}
          placement="bottomLeft"
        >
          <div className={styles.filterHeader}>
            Platform <DownOutlined className={styles.filterIcon} />
          </div>
        </AntDropdown>
      ),
      dataIndex: 'platform',
      key: 'platform',
      width: 150,
      render: (platform: { app?: boolean; web?: boolean }) => {
        return (
          <AntSpace size="small">
            <AntTag color={platform.app ? 'blue' : 'default'}>App</AntTag>
            <AntTag color={platform.web ? 'green' : 'default'}>Web</AntTag>
          </AntSpace>
        );
      },
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      width: 100,
    },
    {
      title: (
        <AntDropdown
          menu={{ items: [{ key: 'status', label: statusMenu }] }}
          placement="bottomLeft"
        >
          <div className={styles.filterHeader}>
            Status <DownOutlined className={styles.filterIcon} />
          </div>
        </AntDropdown>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: 'Normal' | 'Deleted') => (
        <AntTag color={status === 'Normal' ? 'success' : 'default'}>{status}</AntTag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      tooltip: (text: string) => text,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: true,
      render: (_: any, record: RoleRecord) => (
        <AntSpace size="small">
          <AntTooltip title="View">
            <AntButton icon={<EyeOutlined />} size="small" onClick={() => onView?.(record)} />
          </AntTooltip>
          <AntTooltip title="Edit">
            <AntButton icon={<EditOutlined />} size="small" onClick={() => onEdit?.(record)} />
          </AntTooltip>
          <AntTooltip title="Delete">
            <AntButton
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete?.(record)}
            />
          </AntTooltip>
        </AntSpace>
      ),
    },
  ];

  return (
    <div className={styles.roleTable}>
      {/* 表格 */}
      <AntTable
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page: number, pageSize?: number) => {
            onTableChange({ current: page, pageSize });
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          hideOnSinglePage: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          locale: {
            items_per_page: '/Page',
            jump_to: 'to',
            page: 'Page',
          },
          itemRender: (_current, type, originalElement) => {
            if (type === 'prev') {
              return (
                <div>
                  <a onClick={() => onTableChange({ current: 1 })}>First</a>
                  {originalElement}
                </div>
              );
            }
            if (type === 'next') {
              return (
                <div>
                  {originalElement}
                  <a
                    onClick={() =>
                      onTableChange({ current: Math.ceil(pagination.total / pagination.pageSize) })
                    }
                  >
                    Last
                  </a>
                </div>
              );
            }
            return originalElement;
          },
        }}
        rowKey="key"
        size="middle"
        className={styles.table}
        virtual
        scroll={{ y: window.innerHeight - 270 || 800 }}
        bordered={false}
      />
    </div>
  );
};

export default RoleTable;
