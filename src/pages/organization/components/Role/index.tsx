import { useCallback, useEffect, useRef, useState } from 'react';
import type { RoleRecord } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';
import type { ColumnsType } from 'antd/es/table';

import { Table } from '@/components';
import { useThemeModal } from '@/components/Modal';
import type { OptionItem } from '@/components/Segmented';
import Tag from '@/components/Tag';
import { PRESET_TAGS } from '@/components/Tag/constants';
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [dataSource, setDataSource] = useState<GetOrgRoleDTO[]>([]);
  const searchInputRef = useRef<any>(null);
  const roleModalRef = useRef<AddRoleRef>(null);
  const { t } = useLanguage();
  const { confirm: themeModalConfirm } = useThemeModal();
  // 加载中状态
  const [loading, setLoading] = useState(false);
  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  };
  // 状态筛选
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'deleted'>('all');
  const statusList: OptionItem[] = [
    { label: t('common.tab.all'), value: 'all', color: '#33C2C8' },
    {
      label: t('common.status.normal'),
      value: 'normal',
      color: '#31C47F',
    },
    {
      label: t('common.status.deleted'),
      value: 'deleted',
      color: '#F45858',
    },
  ];
  // Platform 筛选（使用 Table filterConfig 的状态）
  const [platformFilter, setPlatformFilter] = useState<{ App?: boolean; Web?: boolean }>({
    App: false,
    Web: false,
  });

  // 加载数据
  const loadData = useCallback(async () => {
    if (!currentParentNode.key) return;
    setLoading(true);
    try {
      // 构建 platform 参数：根据筛选状态返回对应的平台数组
      const platform = Object.entries(platformFilter)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform.toUpperCase()) as ('APP' | 'WEB')[];

      const reqParams: GetOrgRoleListReq = {
        orgId: currentParentNode.key,
        pageNum: page,
        pageSize,
        status: statusFilter === 'all' ? '' : statusFilter,
        keyword: searchInputRef.current?.input?.value || '',
        platform: platform.length === 2 ? ['APP', 'WEB'] : platform,
      };
      const {
        data: { current, records, size, total },
      }: GetOrgRoleListRes = await OrgRoleApi.getOrgRoleList(reqParams);
      records.forEach((item, index) => {
        item.no = (current - 1) * size + index + 1;
      });
      setDataSource(records);
      setPageSize(size);
      setTotal(total);
    } catch (error) {
      console.error('error====:', error);
    } finally {
      setLoading(false);
    }
  }, [currentParentNode.key, page, pageSize, platformFilter, statusFilter]);

  /**
   * 监听筛选条件变化，触发数据加载
   */
  useEffect(() => {
    // platformFilter 变化时，重置到第一页并加载数据
    setPage(1);
  }, [platformFilter]);

  /**
   * 获取数据 - 当 page、statusFilter 等变化时加载数据
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 刷新 - 重置所有筛选条件
  const handleRefresh = useCallback(() => {
    setStatusFilter('all');
    setPlatformFilter({ App: false, Web: false });
    if (searchInputRef.current?.input) {
      searchInputRef.current.input.value = ''; // 清空输入框
    }
    setPage(1);
  }, []);

  const columns: ColumnsType = [
    {
      title: t('role.col.no'),
      dataIndex: 'no',
      key: 'index',
      width: 70,
      minWidth: 70,
    },
    {
      title: t('role.col.name'),
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
      minWidth: 140,
    },
    {
      title: t('role.col.platform'),
      dataIndex: 'platform',
      key: 'platform',
      minWidth: 150,
      render(value) {
        return (
          <div className={styles.platformContainer}>
            <div
              className={`${styles.platformLabelContainer} ${value.includes('APP') ? '' : styles.platformLabelContainerDisabled}`}
            >
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
              <span className={styles.platformAPPStyle}>APP</span>
            </div>
            <div
              className={`${styles.platformLabelContainer} ${value.includes('WEB') ? '' : styles.platformLabelContainerDisabled}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.0001 6H13.0001M3.0001 4H3.1001M5.09971 4H5.19971M7.19932 4H7.29932M2.6001 12H11.4001C12.5047 12 13.4001 11.1046 13.4001 10V4C13.4001 2.89543 12.5047 2 11.4001 2H2.6001C1.49553 2 0.600098 2.89543 0.600098 4V10C0.600098 11.1046 1.49553 12 2.6001 12Z"
                  stroke="#31C47F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles.platformWEBStyle}>WEB</span>
            </div>
          </div>
        );
      },
    },
    {
      title: t('role.col.members'),
      dataIndex: 'userCount',
      key: 'userCount',
      width: 90,
      minWidth: 90,
    },
    {
      title: t('role.col.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      minWidth: 90,
      render(value) {
        if (value === 'Normal') return <Tag preset={PRESET_TAGS.NORMAL} />;
        if (value === 'Delete') return <Tag preset={PRESET_TAGS.DELETED} />;
      },
    },
    {
      title: t('role.col.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      minWidth: 140,
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
  return (
    <AntSpin spinning={loading}>
      <div className={styles.roleInfo}>
        {/* 顶部操作栏 */}
        <RoleHeader
          statusFilter={statusFilter}
          onStatusChange={(status: 'all' | 'normal' | 'deleted') => {
            setStatusFilter(status);
          }}
          searchInputRef={searchInputRef}
          onPressEnter={() => {
            setPage(1);
            loadData();
          }}
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
              total,
              onChange: handlePageChange,
            }}
            filterConfig={{
              platform: {
                mode: 'multiple',
                options: [
                  { label: 'App', value: 'App' },
                  { label: 'Web', value: 'Web' },
                ],
              },
            }}
            onFilterChange={(filters) => {
              // 监听筛选器变化
              if (filters.platform !== undefined) {
                const platformValues = Array.isArray(filters.platform) ? filters.platform : [];
                setPlatformFilter({
                  App: platformValues.includes('App'),
                  Web: platformValues.includes('Web'),
                });
              }
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
        <AddRole ref={roleModalRef} currentParentNode={currentParentNode} treeData={treeData} />
      </div>
    </AntSpin>
  );
};

export default RoleInfo;
