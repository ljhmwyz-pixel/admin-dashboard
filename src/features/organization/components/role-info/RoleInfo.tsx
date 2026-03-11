import { useCallback, useEffect, useMemo, useState } from 'react';

import { RoleFooter, RoleHeader, RoleTable } from '@/features/organization/components';
import type { RoleRecord } from '@/features/organization/dto';

import styles from './RoleInfo.module.scss';

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
const mockData = generateMockData(1000);

interface RoleInfoProps {
  onAdd?: () => void;
  onEdit?: (record: RoleRecord) => void;
  onView?: (record: RoleRecord) => void;
  onDelete?: (record: RoleRecord) => void;
  onBatchEdit?: (records: RoleRecord[]) => void;
  onBatchDelete?: (records: RoleRecord[]) => void;
}

const RoleInfo: React.FC<RoleInfoProps> = ({
  onAdd,
  onEdit,
  onView,
  onDelete,
  onBatchEdit,
  onBatchDelete,
}) => {
  // const { t } = useLanguage();

  // 状态筛选：'all' | 'normal' | 'deleted'
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'deleted'>('all');

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
      />

      <div className={styles.tableContainer}>
        {/* 数据表格 */}
        <RoleTable
          dataSource={filteredData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
          }}
          onTableChange={handleTableChange}
          selectedKeys={selectedKeys}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          platformFilter={platformFilter}
          onPlatformChange={handlePlatformChange}
          onStatusChange={handleStatusChange}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* 底部选中状态 */}
        {selectedKeys.length > 0 && (
          <RoleFooter
            selectedCount={selectedKeys.length}
            onBatchEdit={handleBatchEdit}
            onBatchDelete={handleBatchDelete}
            onClearSelection={() => {
              setSelectedKeys([]);
              setSelectedRecords([]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RoleInfo;
