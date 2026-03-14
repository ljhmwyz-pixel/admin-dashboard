/**
 * 组织数据权限表格组件
 * 用于展示和编辑组织类型的数据权限
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrganizationTypeDataItem } from '@shared/types/organizationType';
import { Select } from 'antd';

import { FormButton, SearchInput, Segmented, Table, TableSelect } from '@/components';
// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { DATA_PERMISSION_OPTIONS, DATA_PLATFORM_OPTIONS } from '../../constants';

// 导入样式
import styles from './index.module.scss';

const { Option } = Select;
// 定义一个options数组常量，用于Select组件的选项
const options = [
  { label: 'Unmasked', value: 'FULL' },
  { label: 'Masked', value: 'MASKED' },
  { label: 'Hidden', value: 'HIDDEN' },
];

/**
 * 组织数据权限表格组件属性
 */
interface OrganizationDataTableProps {
  /** 组织类型编码 */
  typeCode: string;
  /** 是否为编辑模式 */
  isEditMode?: boolean;
  /** 有修改时的回调函数 */
  onHasChanges?: (hasChanges: boolean) => void;
  /** 获取修改数据的回调函数 */
  onGetModifiedData?: (data: any) => void;
}

const OrganizationDataTable: React.FC<OrganizationDataTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
  onGetModifiedData,
}) => {
  /** 当前选中的平台（Organization、Members或Plants） */
  const [activeTab, setActiveTab] = useState('ORGANIZATION'); // 默认选中Organization权限

  /** 原始数据权限数据，用于比较是否有修改 */
  const [originalData, setOriginalData] = useState<OrganizationTypeDataItem[]>([]);

  /** 修改的数据权限数据 */
  const [modifiedData, setModifiedData] = useState<any>({});

  /** 加载状态 */
  const [loading, setLoading] = useState(false);

  /** 错误信息 */
  const [error, setError] = useState<string | null>(null);

  /** 搜索关键词 */
  const [searchText, setSearchText] = useState('');

  /** 防抖后的搜索关键词 */
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // 表格相关参数
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  };

  /**
   * 防抖处理，避免频繁搜索
   * 当searchText变化时，300ms后更新debouncedSearchText
   * 用于优化搜索性能，避免频繁调用API
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      // 搜索时重置到第一页
      setPage(1);
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * 处理刷新
   */
  const handleRefresh = () => {
    // 刷新时重置到第一页
    setPage(1);
    fetchDataPermissions();
  };

  /**
   * 获取组织类型-数据权限数据
   */
  const fetchDataPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationTypeApi.getOrganizationTypeDataPermissions(typeCode, {
        resourceType: activeTab,
        dataKeyword: debouncedSearchText,
        pageNum: page,
        pageSize: pageSize,
      });
      const dataPermissions: OrganizationTypeDataItem[] = response.data.records || [];
      setOriginalData(dataPermissions);
      setTotal(response.data.total || 0);
      setPage(response.data.current || 1);
      // 重置修改数据
      setModifiedData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data permissions');
    } finally {
      setLoading(false);
    }
  }, [typeCode, activeTab, debouncedSearchText, page, pageSize]);

  /**
   * 初始加载和切换tab时获取数据权限
   */
  useEffect(() => {
    fetchDataPermissions();
  }, [activeTab, typeCode, fetchDataPermissions, debouncedSearchText]);

  /**
   * 处理权限级别变更
   * @param key 权限key
   * @param field 权限字段
   * @param value 权限值
   */
  const handlePermissionChange = useCallback(
    (key: string, field: string, value: string) => {
      console.log(`Change ${field} for ${key} to ${value}`);

      // 更新修改的数据并通知外层组件
      setModifiedData((prev: any) => {
        const newData = { ...prev };
        if (!newData[key]) {
          newData[key] = {};
        }
        newData[key][field] = value;

        // 通知外层组件有修改
        if (onHasChanges) {
          onHasChanges(Object.keys(newData).length > 0);
        }

        // 通知外层组件修改后的数据
        if (onGetModifiedData) {
          onGetModifiedData(newData);
        }

        return newData;
      });
    },
    [onHasChanges, onGetModifiedData],
  );

  /**
   * 组件挂载或修改数据变化时通知外层组件
   */
  useEffect(() => {
    if (onGetModifiedData) {
      onGetModifiedData(modifiedData);
    }
  }, [modifiedData, onGetModifiedData]);

  /**
   * 生成表格数据
   * @returns 表格数据数组
   */
  const generateTableData = React.useCallback(() => {
    const data = originalData;

    return data.map((dataPermission) => {
      const hasModifiedData = modifiedData[dataPermission.dataPermissionCode];

      return {
        key: dataPermission.dataPermissionCode,
        dataField: dataPermission.dataPermissionName,
        thisOrganization: hasModifiedData?.SELF || dataPermission.levels.SELF,
        directSubOrganizations: hasModifiedData?.DIRECT_CHILD || dataPermission.levels.DIRECT_CHILD,
        indirectSubOrganizations:
          hasModifiedData?.NON_DIRECT_CHILD || dataPermission.levels.NON_DIRECT_CHILD,
      };
    });
  }, [originalData, modifiedData]);

  /**
   * 最终显示的表格数据
   * 使用useMemo优化计算，避免重复计算
   */
  const tableDataForDisplay = React.useMemo(() => {
    return generateTableData();
  }, [generateTableData]);

  /**
   * 表格列配置
   * 使用useMemo优化，避免重复创建
   */
  const columns = useMemo(
    () => [
      {
        title: 'Data Fields',
        dataIndex: 'dataField',
        key: 'dataField',
      },
      {
        title: 'This Organization',
        dataIndex: 'thisOrganization',
        key: 'thisOrganization',
        width: 180,
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = DATA_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
      {
        title: 'Direct Sub-Organizations',
        dataIndex: 'directSubOrganizations',
        key: 'directSubOrganizations',
        width: 230,
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = DATA_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
      {
        title: 'Indirect Sub-Organizations',
        dataIndex: 'indirectSubOrganizations',
        key: 'indirectSubOrganizations',
        width: 210,
        render: (text: string, record: any) => {
          // 不可编辑时显示文本，可编辑时显示Select组件
          if (!isEditMode) {
            // 根据值获取对应的标签
            const option = DATA_PERMISSION_OPTIONS.find((item) => item.value === text);
            return option ? option.label : text;
          }
          return (
            <TableSelect
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </TableSelect>
          );
        },
      },
    ],
    [handlePermissionChange, isEditMode],
  );

  /**
   * 渲染内容区域
   */
  const renderContent = () => {
    if (error) {
      return <div className={`${styles.statusContainer} ${styles.errData}`}>{error}</div>;
    }

    return (
      <div className={styles.tableContainer}>
        <Table
          dataSource={tableDataForDisplay}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total: total,
            onChange: handlePageChange,
          }}
          rowKey="key"
          locale={{ emptyText: '无数据' }}
          scroll={{ y: window.innerHeight - 200 }}
          loading={loading}
          rowClassName={() => (isEditMode ? styles.editRow : styles.readOnlyRow)}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <div className={styles.topSearchContainer}>
        <Segmented
          options={DATA_PLATFORM_OPTIONS}
          value={activeTab}
          onChange={(value) => setActiveTab(value as string)}
        />
        <div className={styles.searchContainer}>
          <SearchInput
            allowClear={true}
            placeholder="Please enter data field"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FormButton
            className={styles.refreshBtn}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4001 7.0001C13.4001 3.46548 10.5347 0.600098 7.0001 0.600098C3.46548 0.600098 0.600098 3.46548 0.600098 7.0001C0.600098 10.5347 3.46548 13.4001 7.0001 13.4001C8.51148 13.4001 9.90051 12.8762 10.9955 12.0001M10.9955 12.0001L9.80049 11.5001M10.9955 12.0001L10.7706 13.4001M8.00049 7.0001C8.00049 7.55238 7.55277 8.0001 7.00049 8.0001C6.4482 8.0001 6.00049 7.55238 6.00049 7.0001C6.00049 6.44781 6.4482 6.0001 7.00049 6.0001C7.55277 6.0001 8.00049 6.44781 8.00049 7.0001Z"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={() => handleRefresh()}
            title="Refresh"
          />
        </div>
      </div>

      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationDataTable;
