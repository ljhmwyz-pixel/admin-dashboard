import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RoleRecord } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';

import { Table } from '@/components';
import { useThemeModal } from '@/components/Modal';
import type { OptionItem } from '@/components/Segmented';
import OrgRoleApi, {
  type DeleteOrgRoleReq,
  type GetOrgRoleDTO,
  type GetOrgRoleListReq,
  type GetOrgRoleListRes,
} from '@/services/modules/organization/organizationRoleApi';
import { AntMessage, AntSpin } from '@/shared/components';
import { useLanguage } from '@/shared/hooks';

import AddRole, { type AddRoleRef } from './components/AddRole';
import RoleHeader from './components/RoleHeader';

import styles from './index.module.scss';

interface RoleInfoProps {
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  onBatchEdit?: (records: RoleRecord[]) => void;
  onBatchDelete?: (records: RoleRecord[]) => void;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ currentParentNode, treeData }) => {
  // const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSource, setDataSource] = useState<GetOrgRoleDTO[]>([]);
  const roleModalRef = useRef<AddRoleRef>(null);
  const { confirm: themeModalConfirm } = useThemeModal();
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

  // 加载数据
  const loadData = useCallback(async () => {
    if (!currentParentNode.key) return;
    setLoading(true);
    try {
      const reqParams: GetOrgRoleListReq = {
        orgId: currentParentNode.key,
      };
      const {
        data: { current, records, size },
      }: GetOrgRoleListRes = await OrgRoleApi.getOrgRoleList(reqParams);
      // 增加No列，自增1
      records.forEach((item, index) => {
        item.no = (current - 1) * size + index + 1;
      });
      setDataSource(records);
      setPage(current);
      setPageSize(size);
    } catch (error) {
      console.error('error====:', error);
    } finally {
      setLoading(false);
    }
  }, [currentParentNode.key]);

  /**
   * 获取数据
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

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
      dataIndex: 'memberCount',
      key: 'memberCount',
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
  /**
   *点击添加角色
   */
  const onAdd = (record?: GetOrgRoleDTO, opt?: 'add' | 'edit' | 'view') => {
    roleModalRef.current?.open(record, opt);
  };
  /**
   *点击删除角色
   */
  const onDelete = (record: GetOrgRoleDTO) => {
    themeModalConfirm({
      title: 'Confirm Deletion !',
      content: (
        <div className={styles.deleteConfirmInput}>
          <div className={styles.confirmText}>
            {' '}
            Are you sure delete this Role?
            <br />
            This action cannot be undone.
          </div>
          <div className={styles.confirmContent}>
            <div className={styles.confirmItems}>
              <div className={styles.confirmItem}>
                <span>Role Name</span>
                <span className={styles.confirmItemValue}>CED</span>
              </div>
            </div>
          </div>
        </div>
      ),
      okText: t('common.action.delete'),
      cancelText: t('common.action.cancel'),
      onOk: async () => {
        try {
          setLoading(true);
          const reqParams: DeleteOrgRoleReq = {
            roleId: record.roleId || '',
          };
          OrgRoleApi.deleteOrgRole(reqParams).then((res: any) => {
            AntMessage.success('Delete role successfully');
          });
        } catch (error) {
          console.error('error====:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };
  /**
   * 保存角色
   * @param values
   */
  const handleAddRole = (values: any) => {
    console.log('Received values of form: ', values);
  };
  return (
    <AntSpin spinning={loading}>
      <div className={styles.roleInfo}>
        {/* 顶部操作栏 */}
        <RoleHeader
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={setSearchKeyword}
          onAdd={() => onAdd(undefined, 'add')}
          onRefresh={handleRefresh}
          statusList={statusList}
        />
        {/* 数据表格 */}
        <div className={styles.tableContainer}>
          <Table
            rowKey="roleId"
            columns={columns}
            dataSource={dataSource}
            pagination={{
              current: page,
              pageSize,
              total: dataSource.length,
              onChange: handlePageChange,
            }}
            filterConfig={{
              platform: {
                mode: 'multiple',
                options: [
                  { label: 'App', value: 'app' },
                  { label: 'Web', value: 'web' },
                ],
              },
              status: {
                mode: 'single', // 单选模式
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Deleted', value: 'deleted' },
                ],
              },
            }}
            operations={[
              {
                key: 'view',
                label: 'View',
                onClick: (record: GetOrgRoleDTO) => onAdd(record, 'view'),
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
                onClick: (record: GetOrgRoleDTO) => onAdd(record, 'edit'),
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
                onClick: (record: GetOrgRoleDTO) => onDelete?.(record),
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
            operationWidth={120}
          />
        </div>
        {/* 新增角色 */}
        <AddRole
          ref={roleModalRef}
          currentParentNode={currentParentNode}
          treeData={treeData}
          onOk={handleAddRole}
        />
      </div>
    </AntSpin>
  );
};

export default RoleInfo;
