/**
 * 组织数据权限表格组件
 * 用于展示和编辑组织类型的数据权限
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrganizationTypeDataItem } from '@shared/types/organizationType';
import { Select } from 'antd';

// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { DATA_PERMISSION_OPTIONS, DATA_PLATFORM_OPTIONS } from '../../constants';
// 导入hooks
import { useApiCall } from '../../hooks/useApiCall';
// 导入共用组件
import SearchHeader from '../common/SearchHeader';
import TableContainer from '../common/TableContainer';

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

  /**
   * 获取组织类型-数据权限数据
   */
  const {
    loading,
    error,
    callApi: fetchDataPermissions,
  } = useApiCall(async (keyword?: string) => {
    const response = await organizationTypeApi.getOrganizationTypePermissions(typeCode, {
      permissionType: 'DATA',
      resourceType: activeTab,
      permissionKeyword: keyword,
    });
    const dataPermissions: OrganizationTypeDataItem[] = response.data.dataPermissions || [];
    setOriginalData(dataPermissions);
    // 重置修改数据
    setModifiedData({});
    return dataPermissions;
  });

  /**
   * 处理搜索
   */
  const handleSearch = useCallback(
    (keyword: string) => {
      fetchDataPermissions(keyword);
    },
    [fetchDataPermissions],
  );

  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(() => {
    fetchDataPermissions();
  }, [fetchDataPermissions]);

  /**
   * 初始加载和切换tab时获取数据权限
   */
  useEffect(() => {
    fetchDataPermissions();
  }, [activeTab, typeCode, fetchDataPermissions]);

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

  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <SearchHeader
        options={DATA_PLATFORM_OPTIONS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchPlaceholder="Please enter data field"
        onSearch={handleSearch}
        onRefresh={handleRefresh}
      />

      {/* 表格内容 */}
      <div className={styles.tableContainer}>
        <TableContainer
          loading={loading}
          error={error}
          dataSource={tableDataForDisplay}
          columns={columns}
          rowKey="key"
          scroll={{ y: window.innerHeight - 200 }}
        />
      </div>
    </div>
  );
};

export default OrganizationDataTable;
