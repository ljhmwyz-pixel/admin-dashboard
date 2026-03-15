import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { RoleRecord } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';
import type { TableColumnsType, TableProps } from 'antd';

import { FormButton, FormDrawer, Table } from '@/components';
import type { OptionItem } from '@/components/Segmented';
import type { BatchAction, OperationAction } from '@/components/Table/dto';
import { AntDrawer, AntForm, AntSpace } from '@/shared/components';
import { useLanguage } from '@/shared/hooks';

import AddRole, { type AddRoleRef } from './components/AddRole';
import RoleFooter from './components/RoleFooter';
import RoleHeader from './components/RoleHeader';

import styles from './index.module.scss';

// 生成大量模拟数据的方法
const generateMockData = (count: number): RoleRecord[] => {
  const roleNames = [
    'Organization Owner',
    'FAE',
    'Electrician',
    'CED',
    'Administrator',
    'Manager',
    'Supervisor',
    'Operator',
  ];
  const descriptions = [
    'System default role: Organization administrator, granted all permissions.',
    'Custom role with limited access to specific modules.',
    'Read-only role for viewing reports and dashboards.',
    'Field service role with mobile app access.',
    'Management role with team oversight capabilities.',
  ];

  return Array.from({ length: count }, (_, index) => {
    const no = index + 1;
    const roleName = roleNames[index % roleNames.length];
    const description = descriptions[index % descriptions.length];

    // 随机生成平台配置
    const platformConfigurations = [
      { app: true, web: false },
      { app: false, web: true },
      { app: true, web: true },
      { app: false, web: false },
    ];
    const platform = platformConfigurations[index % platformConfigurations.length];

    // 随机生成成员数量 (1-50)
    const members = Math.floor(Math.random() * 50) + 1;

    // 随机生成状态 (70% Normal, 30% Deleted)
    const status = Math.random() > 0.3 ? 'Normal' : 'Deleted';

    return {
      key: String(no),
      no,
      roleName,
      platform,
      members,
      status,
      description,
    };
  });
};

// 使用生成的方法创建模拟数据
const mockData = generateMockData(20);

interface RoleInfoProps {
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  onAdd?: () => void;
  onEdit?: (record: RoleRecord) => void;
  onView?: (record: RoleRecord) => void;
  onDelete?: (record: RoleRecord) => void;
  onBatchEdit?: (records: RoleRecord[]) => void;
  onBatchDelete?: (records: RoleRecord[]) => void;
}

const RoleInfo: React.FC<RoleInfoProps> = ({
  currentParentNode,
  treeData,
  onEdit,
  onView,
  onDelete,
  onBatchEdit,
  onBatchDelete,
}) => {
  // const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = AntForm.useForm();
  const roleModalRef = useRef<AddRoleRef>(null);
  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  };

  // 状态筛选：'all' | 'normal' | 'deleted'
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'deleted'>('all');
  const statusList: OptionItem[] = [
    { label: 'All', value: 'all', color: '#33C2C8' },
    {
      label: 'Normal',
      value: 'normal',
      color: '#31C47F',
    },
    {
      label: 'Deleted',
      value: 'deleted',
      color: '#F45858',
    },
  ];

  // Platform 筛选
  const [platformFilter, setPlatformFilter] = useState<{
    app?: boolean;
    web?: boolean;
  }>({ app: true, web: true });

  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');

  // 加载中状态
  const [loading, setLoading] = useState(false);

  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [tableData, setTableData] = useState<RoleRecord[]>([]);

  // 选中的记录
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<RoleRecord[]>([]);
  const { t } = useLanguage();
  // 根据筛选条件过滤数据
  const filteredData = useMemo(() => {
    const result = tableData.filter((item) => {
      // 状态筛选
      if (statusFilter === 'normal' && item.status !== 'Normal') return false;
      if (statusFilter === 'deleted' && item.status !== 'Deleted') return false;

      // Platform 筛选逻辑
      const hasApp = platformFilter.app === true;
      const hasWeb = platformFilter.web === true;

      // 如果两个平台都未选中，不显示任何数据
      if (!hasApp && !hasWeb) {
        return false;
      }

      // 如果只选中 App，只显示有 App 的数据
      if (hasApp && !hasWeb && !item.platform.app) {
        return false;
      }

      // 如果只选中 Web，只显示有 Web 的数据
      if (!hasApp && hasWeb && !item.platform.web) {
        return false;
      }

      // 如果两个都选中（hasApp && hasWeb），显示所有数据
      return true;
    });

    return result;
  }, [statusFilter, platformFilter, tableData]);

  // 加载数据（模拟接口调用）
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟接口延迟 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟接口返回数据
      const data = mockData;
      const total = mockData.length;

      // 更新表格数据和分页信息
      setTableData(data);
      setPagination((prev) => ({
        ...prev,
        total: total,
      }));
    } catch (error) {
      console.error('❌ 加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新 - 重置所有筛选条件
  const handleRefresh = useCallback(() => {
    setStatusFilter('all');
    setPlatformFilter({ app: true, web: true });
    setSearchKeyword('');
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSelectedKeys([]);
    setSelectedRecords([]);
    loadData();
  }, [loadData]);

  // Platform 筛选变化
  const handlePlatformChange = useCallback((checkedValues: (string | number)[]) => {
    setPlatformFilter({
      app: checkedValues.includes('app'),
      web: checkedValues.includes('web'),
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  // 状态筛选
  const handleStatusChange = useCallback((status: 'all' | 'normal' | 'deleted') => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  // 处理选中变化
  const handleSelectChange = useCallback(
    (selectedRowKeys: string[], selectedRows: RoleRecord[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedRecords(selectedRows);
    },
    [],
  );

  // 处理全选
  const handleSelectAll = useCallback((selected: boolean, selectedRows: RoleRecord[]) => {
    if (selected) {
      const keys = selectedRows.map((row) => row.key.toString());
      setSelectedKeys(keys);
      setSelectedRecords(selectedRows);
    } else {
      setSelectedKeys([]);
      setSelectedRecords([]);
    }
  }, []);

  // 处理批量编辑
  const handleBatchEdit = useCallback(() => {
    onBatchEdit?.(selectedRecords);
  }, [onBatchEdit, selectedRecords]);

  // 处理批量删除
  const handleBatchDelete = useCallback(() => {
    onBatchDelete?.(selectedRecords);
  }, [onBatchDelete, selectedRecords]);

  const handleTableChange = useCallback(
    (newPagination: { current?: number; pageSize?: number }) => {
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current || prev.current,
        pageSize: newPagination.pageSize || prev.pageSize,
      }));
    },
    [],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dataSource = [
    {
      key: '1',
      no: 1,
      roleName: 'Organization Owner',
      platform: 'App, Web',
      members: 3,
      status: 'Normal',
      description: 'System default role: Organization administrator, granted all permissions.',
    },
    {
      key: '2',
      no: 2,
      roleName: 'FAE',
      platform: 'App',
      members: 12,
      status: 'Normal',
      description: 'Field application engineer with mobile app access.',
    },
    {
      key: '3',
      no: 3,
      roleName: 'Electrician',
      platform: 'App, Web',
      members: 25,
      status: 'Normal',
      description: 'Custom role with limited access to specific modules.',
    },
    {
      key: '4',
      no: 4,
      roleName: 'CED',
      platform: 'Web',
      members: 8,
      status: 'Deleted',
      description: 'Read-only role for viewing reports and dashboards.',
    },
    {
      key: '5',
      no: 5,
      roleName: 'Administrator',
      platform: 'App, Web',
      members: 50,
      status: 'Normal',
      description: 'Management role with team oversight capabilities.',
    },
    {
      key: '6',
      no: 6,
      roleName: 'Manager',
      platform: 'Web',
      members: 18,
      status: 'Normal',
      description: 'Management role with department level permissions.',
    },
    {
      key: '7',
      no: 7,
      roleName: 'Supervisor',
      platform: 'App',
      members: 7,
      status: 'Deleted',
      description: 'Supervision role with monitoring capabilities.',
    },
    {
      key: '8',
      no: 8,
      roleName: 'Operator',
      platform: 'App, Web',
      members: 32,
      status: 'Normal',
      description: 'Basic operator role with standard operational permissions.',
    },
    {
      key: '9',
      no: 9,
      roleName: 'Technical Lead',
      platform: 'Web',
      members: 15,
      status: 'Normal',
      description: 'Technical leadership role with architecture oversight.',
    },
    {
      key: '10',
      no: 10,
      roleName: 'QA Engineer',
      platform: 'App, Web',
      members: 22,
      status: 'Normal',
      description: 'Quality assurance role with testing permissions.',
    },
    {
      key: '11',
      no: 11,
      roleName: 'DevOps Engineer',
      platform: 'Web',
      members: 9,
      status: 'Normal',
      description: 'Infrastructure and deployment management role.',
    },
    {
      key: '12',
      no: 12,
      roleName: 'Business Analyst',
      platform: 'App, Web',
      members: 14,
      status: 'Deleted',
      description: 'Business analysis and reporting role.',
    },
    {
      key: '13',
      no: 13,
      roleName: 'Project Manager',
      platform: 'Web',
      members: 28,
      status: 'Normal',
      description: 'Project coordination and team management role.',
    },
    {
      key: '14',
      no: 14,
      roleName: 'UX Designer',
      platform: 'App',
      members: 11,
      status: 'Normal',
      description: 'User experience design and research role.',
    },
    {
      key: '15',
      no: 15,
      roleName: 'Security Officer',
      platform: 'Web',
      members: 6,
      status: 'Normal',
      description: 'Security compliance and monitoring role.',
    },
    {
      key: '16',
      no: 16,
      roleName: 'Data Analyst',
      platform: 'App, Web',
      members: 19,
      status: 'Normal',
      description: 'Data analysis and insights generation role.',
    },
    {
      key: '17',
      no: 17,
      roleName: 'Support Specialist',
      platform: 'App',
      members: 35,
      status: 'Deleted',
      description: 'Customer support and service role.',
    },
    {
      key: '18',
      no: 18,
      roleName: 'Compliance Manager',
      platform: 'Web',
      members: 10,
      status: 'Normal',
      description: 'Regulatory compliance and audit management role.',
    },
  ];

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: 'Number of Members',
      dataIndex: 'members',
      key: 'members',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, page, pageSize]);

  /**
   *添加角色
   */
  const onAdd = () => {
    roleModalRef.current?.open();
  };
  const handleCancel = () => {};

  return (
    <div className={styles.roleInfo}>
      {/* 顶部操作栏 */}
      <RoleHeader
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        onAdd={onAdd}
        onRefresh={handleRefresh}
        statusList={statusList}
      />
      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={pagedData}
          pagination={{
            current: page,
            pageSize,
            total: dataSource.length,
            onChange: handlePageChange,
          }}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record: any) => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          }}
          filterConfig={{
            platform: {
              type: 'select',
              options: [
                { label: 'App', value: 'app' },
                { label: 'Web', value: 'web' },
              ],
            },
          }}
          batchActions={[
            {
              key: 'batch-delete',
              label: 'Delete',
              icon: undefined,
              danger: true,
              onClick: handleBatchDelete,
            },
            {
              key: 'batch-edit',
              label: 'Edit',
              icon: undefined,
              onClick: handleBatchEdit,
            },
          ]}
          operations={[
            {
              key: 'view',
              label: 'View',
              onClick: (record: RoleRecord) => onView?.(record),
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.3141 7.99979C15.3141 8.78297 12.0394 13.1426 7.99983 13.1426C3.96026 13.1426 0.685547 8.78297 0.685547 7.99979C0.685547 7.21661 3.96026 2.85693 7.99983 2.85693C12.0394 2.85693 15.3141 7.21661 15.3141 7.99979Z"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10.2858 8.00007C10.2858 9.26243 9.26243 10.2858 8.00007 10.2858C6.7377 10.2858 5.71436 9.26243 5.71436 8.00007C5.71436 6.7377 6.7377 5.71436 8.00007 5.71436"
                    stroke="#33C2C8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              key: 'edit',
              label: 'Edit',
              onClick: (record: RoleRecord) => onEdit?.(record),
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.59171 1.82879C9.22289 0.735546 10.6208 0.360973 11.7141 0.992156C12.8073 1.62334 13.1819 3.02126 12.5507 4.1145L8.73416 10.7249C8.63121 10.9032 8.48202 11.0504 8.30233 11.1509L5.01355 12.9905C4.86239 13.0751 4.67577 12.9673 4.67342 12.7941L4.62218 9.02617C4.61938 8.82031 4.67224 8.61751 4.77518 8.4392L8.59171 1.82879Z"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0.685547 15.3105H15.314"
                    stroke="#33C2C8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              key: 'delete',
              label: 'Delete',
              danger: true,
              onClick: (record: RoleRecord) => onDelete?.(record),
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4289 2.97126V1.8284C11.4289 1.19722 10.9172 0.685547 10.286 0.685547H5.7146C5.08342 0.685547 4.57174 1.19722 4.57174 1.8284V2.97126M0.686035 3.42841H15.3146M2.28603 3.42841H13.7146V13.0284C13.7146 14.2908 12.6912 15.3141 11.4289 15.3141H4.57174C3.30938 15.3141 2.28603 14.2908 2.28603 13.0284V3.42841Z"
                    stroke="#191B1F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.28564 6.85693V11.8855M9.71422 6.85693V11.8855"
                    stroke="#F45858"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ]}
        />
      </div>
      {/* 新增角色 */}
      <AddRole
        ref={roleModalRef}
        title="新增角色"
        currentParentNode={currentParentNode}
        treeData={treeData}
      />
    </div>
  );
};

export default RoleInfo;
