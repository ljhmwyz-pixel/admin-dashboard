/**
 * 组织数据权限表格组件
 * 用于展示和编辑组织类型的数据权限
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { OrganizationTypeDataItem } from '@shared/types/organizationType';
import { Input, Select, Spin, Table } from 'antd';

import { SearchInput, Segmented } from '@/components';
// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { DATA_PERMISSION_OPTIONS, DATA_PLATFORM_OPTIONS } from '../../constants';

// 导入样式
import styles from './index.module.scss';

const { Option } = Select;

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

  /**
   * 防抖处理，避免频繁搜索
   * 当searchText变化时，300ms后更新debouncedSearchText
   * 用于优化搜索性能，避免频繁调用API
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    setDebouncedSearchText(searchText);
  };

  /**
   * 处理刷新
   */
  const handleRefresh = () => {
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
        permissionKeyword: debouncedSearchText,
      });
      const dataPermissions: OrganizationTypeDataItem[] = response.data.records || [];
      setOriginalData(dataPermissions);
      // 重置修改数据
      setModifiedData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data permissions');
    } finally {
      setLoading(false);
    }
  }, [typeCode, activeTab, debouncedSearchText]);

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
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'SELF', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
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
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'DIRECT_CHILD', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
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
            <Select
              value={text}
              style={{ width: 132 }}
              onChange={(value) => handlePermissionChange(record.key, 'NON_DIRECT_CHILD', value)}
            >
              {DATA_PERMISSION_OPTIONS.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
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
    if (loading) {
      return (
        <div className={styles.statusContainer}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return <div className={`${styles.statusContainer} ${styles.errData}`}>{error}</div>;
    }

    if (originalData.length === 0) {
      return <div className={`${styles.statusContainer} ${styles.noData}`}>无数据</div>;
    }

    return (
      <div className={styles.tableContainer}>
        <Table
          dataSource={tableDataForDisplay}
          columns={columns}
          pagination={false}
          rowKey="key"
          locale={{ emptyText: '无数据' }}
          scroll={{ y: window.innerHeight - 200 }}
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
          <Input
            placeholder="Please enter data field"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onPressEnter={handleSearch}
          />
          <div className={styles.refreshIcon} onClick={handleRefresh}>
            <ReloadOutlined />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default OrganizationDataTable;
