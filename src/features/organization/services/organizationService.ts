// 组织服务API
import { organizationApi } from '@/services/modules/organization/organizationApi';
import type { OrganizationListParams, TreeNodeData } from '@/shared/types/organization';

import {
  generateFallbackTreeData,
  transformOrganizationToTreeData,
} from '../utils/dataTransformer';

// 删除组织的响应码常量
export const DeleteResponseCode = {
  SUCCESS: 200, // 验证通过，可以删除
  NOT_FOUND: 404, // 组织不存在
  FORBIDDEN: 403, // 无权限
  CONFLICT: 409, // 有依赖关系，无法删除
  SERVER_ERROR: 500, // 服务器错误
  UNKNOWN_ERROR: -1, // 未知错误
} as const;

// 删除验证结果类型
export interface DeleteValidationResult {
  canDelete: boolean; // 是否可以删除
  code: number; // 响应码
  message: string; // 提示信息
}

// 删除操作结果类型
export interface DeleteResult {
  success: boolean;
  message: string;
}

// 通用的组织数据加载服务
export interface LoadOrganizationDataOptions {
  searchKeyword?: string;
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>;
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

/**
 * 删除组织前的验证接口
 * @param orgId 组织 ID
 * @param withLoading 全局 loading 包装函数
 * @returns 验证结果
 */
export const validateDeleteOrganization = async (
  orgId: string | number,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<DeleteValidationResult> => {
  const validateLogic = async (): Promise<DeleteValidationResult> => {
    try {
      const response = await organizationApi.verifyDelete({ orgId });

      // 根据响应码返回不同结果
      switch (response.code) {
        case DeleteResponseCode.SUCCESS:
          return {
            canDelete: true,
            code: response.code,
            message: response.msg || '可以删除',
          };

        case DeleteResponseCode.NOT_FOUND:
          return {
            canDelete: false,
            code: response.code,
            message: '要删除的组织不存在',
          };

        case DeleteResponseCode.FORBIDDEN:
          return {
            canDelete: false,
            code: response.code,
            message: '您没有权限删除该组织',
          };

        case DeleteResponseCode.CONFLICT:
          // 存在依赖关系，返回详细的依赖信息
          return {
            canDelete: false,
            code: response.code,
            message: '该组织存在关联数据，无法删除',
          };

        case DeleteResponseCode.SERVER_ERROR:
          return {
            canDelete: false,
            code: response.code,
            message: '服务器错误，请稍后重试',
          };

        default:
          return {
            canDelete: false,
            code: response.code || DeleteResponseCode.UNKNOWN_ERROR,
            message: response.msg || '验证失败，请稍后重试',
          };
      }
    } catch (error) {
      // 处理网络错误或异常
      console.error('Validate delete failed:', error);
      return {
        canDelete: false,
        code: DeleteResponseCode.UNKNOWN_ERROR,
        message: error instanceof Error ? error.message : '网络错误，请检查连接',
      };
    }
  };

  // 如果提供了 withLoading，则使用它包装
  if (withLoading) {
    const result = await withLoading(validateLogic, {
      onError: (error) => {
        console.error('Validate operation error:', error);
      },
    });
    // 如果 withLoading 返回 undefined（理论上不应该），使用兜底值
    return (
      result ?? {
        canDelete: false,
        code: DeleteResponseCode.UNKNOWN_ERROR,
        message: '验证失败，请稍后重试',
      }
    );
  }

  // 否则直接执行
  return validateLogic();
};

/**
 * 删除组织操作
 * @param orgId 组织 ID
 * @param withLoading 全局 loading 包装函数
 * @returns 删除结果
 */
export const deleteOrganization = async (
  orgId: string | number,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<DeleteResult> => {
  const deleteLogic = async (): Promise<DeleteResult> => {
    try {
      const response = await organizationApi.delete({ orgId });

      if (response.code === DeleteResponseCode.SUCCESS) {
        return {
          success: true,
          message: response.msg || '删除成功',
        };
      }

      // 删除操作理论上不应该失败，如果失败直接返回错误
      return {
        success: false,
        message: response.msg || '删除失败，请稍后重试',
      };
    } catch (error) {
      // 处理网络错误或异常
      console.error('Delete organization failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '网络错误，请检查连接',
      };
    }
  };

  // 如果提供了 withLoading，则使用它包装
  if (withLoading) {
    const result = await withLoading(deleteLogic, {
      onError: (error) => {
        console.error('Delete operation error:', error);
      },
    });
    // 如果 withLoading 返回 undefined（理论上不应该），使用兜底值
    return (
      result ?? {
        success: false,
        message: '删除失败，请稍后重试',
      }
    );
  }

  // 否则直接执行
  return deleteLogic();
};
