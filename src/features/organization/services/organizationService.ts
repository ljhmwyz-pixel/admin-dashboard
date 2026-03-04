// 组织服务API
import { organizationApi } from '@/services/modules/organization/organizationApi';
import type { OrganizationListParams, TreeNodeData } from '@/shared/types/organization';

import {
  generateFallbackTreeData,
  transformOrganizationToTreeData,
} from '../utils/dataTransformer';

// 通用的组织数据加载服务
export interface LoadOrganizationDataOptions {
  searchKeyword?: string;
  withLoading?: (
    asyncFn: () => Promise<any>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<unknown>;
  setData?: (data: TreeNodeData[]) => void;
}

export const loadOrganizationData = async ({
  searchKeyword,
  withLoading,
  setData,
}: LoadOrganizationDataOptions): Promise<void> => {
  const loadDataLogic = async () => {
    // 构造API参数
    const params: OrganizationListParams = {
      pageNum: 1,
      pageSize: searchKeyword ? 100 : 1000,
    };

    // 如果有搜索关键词，添加到参数中
    if (searchKeyword?.trim()) {
      params.keyword = searchKeyword.trim();
    }

    // 调用符合需求文档的 API 接口
    const response = await organizationApi.getList(params);

    // 从响应中提取数据（符合需求文档规范）
    const apiData = response.data;
    const records = apiData.records; // 从 records 字段获取组织列表

    // 转换数据格式
    const transformedData = transformOrganizationToTreeData(records);

    // 设置数据
    if (setData) {
      setData(transformedData);
    }

    return transformedData;
  };

  // 如果提供了withLoading，则使用它包装异步操作
  if (withLoading) {
    await withLoading(loadDataLogic, {
      onError: (error) => {
        console.error('Failed to load organization tree:', error);
        // 使用兜底数据
        const fallbackData = generateFallbackTreeData(searchKeyword ? 10 : 100);
        if (setData) {
          setData(fallbackData);
        }
      },
    });
  } else {
    // 如果没有提供withLoading，直接执行
    try {
      await loadDataLogic();
    } catch (error) {
      console.error('Failed to load organization tree:', error);
      // 使用兜底数据
      const fallbackData = generateFallbackTreeData(searchKeyword ? 10 : 100);
      if (setData) {
        setData(fallbackData);
      }
    }
  }
};
