/**
 * 组织权限表格组件
 * 用于展示和编辑组织类型的功能权限
 */
import React, { useCallback, useEffect, useState } from 'react';
// 引入类型定义
import type {
  OrganizationTypeDetailFunctionalResponse, // 组织类型权限响应
  OrganizationTypePermissionItem, // 组织类型权限项
} from '@shared/types/organizationType';

import { FormButton, SearchInput, Segmented } from '@/components';
// 导入API
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 导入常量
import { PLATFORM_OPTIONS } from '../../constants';
// 导入子组件
import PermissionContent, { type PlatformData } from './PermissionContent';

// 导入样式
import styles from './index.module.scss';

/**
 * 组织权限表格组件属性接口
 */
interface OrganizationPermissionTableProps {
  /** 组织类型编码 */
  typeCode: string;
  /** 是否为编辑模式 */
  isEditMode?: boolean;
  /** 有修改时的回调函数 */
  onHasChanges?: (hasChanges: boolean) => void;
  /** 获取修改数据的回调函数 */
  onGetModifiedData?: (data: any) => void;
}

const OrganizationPermissionTable: React.FC<OrganizationPermissionTableProps> = ({
  typeCode,
  isEditMode = false,
  onHasChanges,
  onGetModifiedData,
}) => {
  /** 当前选中的平台（Web或App） */
  const [activeTab, setActiveTab] = useState('WEB'); // 默认选中web端权限

  /** 平台数据缓存 */
  const [platformData, setPlatformData] = useState<Record<string, PlatformData>>({
    WEB: {
      originalData: [],
      firstLevelNodes: [],
      selectedKey: null,
      expandedRowKeys: [],
      loading: false,
      error: null,
      searchText: '',
      debouncedSearchText: '',
      modifiedData: {},
    },
    APP: {
      originalData: [],
      firstLevelNodes: [],
      selectedKey: null,
      expandedRowKeys: [],
      loading: false,
      error: null,
      searchText: '',
      debouncedSearchText: '',
      modifiedData: {},
    },
  });

  /**
   * 防抖处理，避免频繁搜索
   * 当searchText变化时，300ms后更新debouncedSearchText
   * 用于优化搜索性能，避免频繁调用API
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlatformData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          debouncedSearchText: prev[activeTab].searchText,
        },
      }));
    }, 300); // 300ms防抖
    return () => clearTimeout(timer);
  }, [activeTab, platformData[activeTab]?.searchText]);

  /**
   * 处理刷新按钮点击
   */
  const handleRefresh = () => {
    // 保存当前的展开状态
    const currentExpandedRowKeys = platformData[activeTab].expandedRowKeys;
    const currentSelectedKey = platformData[activeTab].selectedKey;

    // 重新请求数据
    fetchPermissions(activeTab).then(() => {
      // 数据加载完成后恢复展开状态和选中状态
      setPlatformData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          expandedRowKeys: currentExpandedRowKeys,
          selectedKey: currentSelectedKey,
        },
      }));
    });
  };

  /**
   * 获取组织类型-权限数据
   * @param platform 平台类型
   */
  const fetchPermissions = useCallback(
    async (platform: string) => {
      try {
        setPlatformData((prev) => ({
          ...prev,
          [platform]: {
            ...prev[platform],
            loading: true,
            error: null,
          },
        }));

        const response: OrganizationTypeDetailFunctionalResponse =
          await organizationTypeApi.getOrganizationTypeFunctionalPermissions(typeCode, {
            platform: platform,
            // 不再传递搜索关键词，搜索在前端进行
          });
        // 确保functionalPermissions是数组，防止空指针错误
        const functionalPermissions: OrganizationTypePermissionItem[] =
          response.data.functionalPermissions || [];

        // 提取第一级节点，排除children属性
        const firstLevel = functionalPermissions.map(({ children: _children, ...rest }) => rest);

        // 设置权限的原始数据
        setPlatformData((prev) => {
          // 保留当前的选中状态和展开状态
          const currentSelectedKey = prev[platform].selectedKey;
          const currentExpandedRowKeys = prev[platform].expandedRowKeys;

          // 只有当当前选中的节点不存在时才设置新的选中节点
          const newSelectedKey =
            currentSelectedKey &&
            firstLevel.some((node) => node.permissionCode === currentSelectedKey)
              ? currentSelectedKey
              : firstLevel[0]?.permissionCode || null;

          return {
            ...prev,
            [platform]: {
              ...prev[platform],
              originalData: functionalPermissions,
              firstLevelNodes: firstLevel,
              selectedKey: newSelectedKey,
              expandedRowKeys:
                currentExpandedRowKeys.length > 0
                  ? currentExpandedRowKeys
                  : newSelectedKey
                    ? [newSelectedKey]
                    : [],
              loading: false,
            },
          };
        });
      } catch (err) {
        setPlatformData((prev) => ({
          ...prev,
          [platform]: {
            ...prev[platform],
            error: err instanceof Error ? err.message : 'Failed to fetch permissions',
            loading: false,
          },
        }));
      }
    },
    [typeCode],
  );

  /**
   * 当debouncedSearchText变化时，只进行前端搜索，不重新请求后端接口
   */
  useEffect(() => {
    // 搜索只在前端进行，不重新请求后端接口
  }, [activeTab, platformData[activeTab]?.debouncedSearchText]);

  /**
   * 初始加载权限数据
   */
  useEffect(() => {
    // 初始加载WEB平台数据
    fetchPermissions('WEB');
    // 初始加载APP平台数据
    fetchPermissions('APP');
  }, [fetchPermissions]);

  /**
   * 处理树节点点击
   * @param platform 平台类型
   * @param selectedKey 选中的节点编码
   */
  const handleTreeSelect = useCallback((platform: string, selectedKey: string) => {
    setPlatformData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        selectedKey: selectedKey || null,
        expandedRowKeys: prev[platform].expandedRowKeys.includes(selectedKey)
          ? prev[platform].expandedRowKeys
          : [...prev[platform].expandedRowKeys, selectedKey],
      },
    }));
  }, []);

  /**
   * 处理表格展开/收起状态变化
   * @param platform 平台类型
   * @param expandedKeys 展开的行的key
   */
  const handleExpandedRowsChange = useCallback((platform: string, expandedKeys: string[]) => {
    setPlatformData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        expandedRowKeys: expandedKeys,
      },
    }));
  }, []);

  /**
   * 处理权限级别变更
   * @param platform 平台类型
   * @param key 权限key
   * @param field 权限字段
   * @param value 权限值
   */
  const handlePermissionChange = useCallback(
    (platform: string, key: string, field: string, value: string) => {
      console.log(`Change ${field} for ${key} to ${value} on platform ${platform}`);

      // 更新修改的数据并通知外层组件
      setPlatformData((prev) => {
        const newModifiedData = { ...prev[platform].modifiedData };
        if (!newModifiedData[key]) {
          newModifiedData[key] = {};
        }
        newModifiedData[key][field] = value;

        // 合并所有平台的修改数据
        const allModifiedData = {
          ...prev.WEB.modifiedData,
          ...prev.APP.modifiedData,
          ...newModifiedData,
        };

        // 通知外层组件有修改
        if (onHasChanges) {
          onHasChanges(Object.keys(allModifiedData).length > 0);
        }

        // 通知外层组件修改后的数据
        if (onGetModifiedData) {
          onGetModifiedData(allModifiedData);
        }

        return {
          ...prev,
          [platform]: {
            ...prev[platform],
            modifiedData: newModifiedData,
          },
        };
      });
    },
    [onHasChanges, onGetModifiedData],
  );

  /**
   * 组件挂载或修改数据变化时通知外层组件
   */
  useEffect(() => {
    if (onGetModifiedData) {
      // 合并所有平台的修改数据
      const allModifiedData = {
        ...platformData.WEB.modifiedData,
        ...platformData.APP.modifiedData,
      };
      onGetModifiedData(allModifiedData);
    }
  }, [platformData, onGetModifiedData]);

  return (
    <div className={styles.container}>
      {/* 顶部搜索容器 */}
      <div className={styles.topSearchContainer}>
        <Segmented
          options={PLATFORM_OPTIONS}
          value={activeTab}
          onChange={(value) => setActiveTab(value as string)}
        />
        <div className={styles.searchContainer}>
          <SearchInput
            allowClear={true}
            placeholder="Please enter permission"
            value={platformData[activeTab]?.searchText || ''}
            onChange={(e) => {
              setPlatformData((prev) => ({
                ...prev,
                [activeTab]: {
                  ...prev[activeTab],
                  searchText: e.target.value,
                },
              }));
            }}
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

      {/* 内容区域 - 使用 show 条件渲染 */}
      {activeTab === 'WEB' && (
        <PermissionContent
          platform="WEB"
          data={platformData.WEB}
          typeCode={typeCode}
          isEditMode={isEditMode}
          onPermissionChange={handlePermissionChange}
          onTreeSelect={handleTreeSelect}
          onExpandedRowsChange={handleExpandedRowsChange}
        />
      )}
      {activeTab === 'APP' && (
        <PermissionContent
          platform="APP"
          data={platformData.APP}
          typeCode={typeCode}
          isEditMode={isEditMode}
          onPermissionChange={handlePermissionChange}
          onTreeSelect={handleTreeSelect}
          onExpandedRowsChange={handleExpandedRowsChange}
        />
      )}
    </div>
  );
};

export default OrganizationPermissionTable;
