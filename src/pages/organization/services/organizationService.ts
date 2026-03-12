// 组织服务API
import { transformOrganizationToTreeData } from '@pages/organization/utils';

import type {
  MemberDetail,
  MemberListParams,
  MemberListResponse,
  MemberUpdateResponse,
  OrganizationListParams,
  TreeNodeData,
} from '@/pages/organization/dto';
import { organizationApi } from '@/services/modules/organization/organizationApi';

// 删除验证结果类型
export interface DeleteValidationResult {
  canDelete: boolean; // 是否可以删除
  code: number; // 响应码
}

// 删除操作结果类型
export interface DeleteResult {
  success: boolean;
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
    await withLoading(loadDataLogic);
  } else {
    // 如果没有提供withLoading，直接执行
    try {
      await loadDataLogic();
    } catch (error) {
      console.error('Failed to load organization tree:', error);
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

      if (response.code === 200 && response.data.valid) {
        return {
          canDelete: true,
          code: response.code,
        };
      } else {
        return {
          canDelete: false,
          code: response.code,
        };
      }
    } catch (error) {
      // 处理网络错误或异常
      console.error('Validate delete failed:', error);
      return {
        canDelete: false,
        code: 500,
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
        code: 500,
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

      if (response.code === 200) {
        return {
          success: true,
        };
      }

      // 删除操作理论上不应该失败，如果失败直接返回错误
      return {
        success: false,
      };
    } catch (error) {
      // 处理网络错误或异常
      console.error('Delete organization failed:', error);
      return {
        success: false,
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
      }
    );
  }

  // 否则直接执行
  return deleteLogic();
};

/**
 * 获取组织成员列表
 * @param params 查询参数（分页、搜索、状态等）
 * @param withLoading 全局 loading 包装函数
 * @returns 组织成员列表数据
 */
export const loadMembers = async (
  params: MemberListParams,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<MemberListResponse | undefined> => {
  const loadMembersLogic = async (): Promise<MemberListResponse> => {
    const response = await organizationApi.getMembers(params);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMembersLogic, {
      onError: (error) => {
        console.error('Load members error:', error);
      },
    });
  }

  try {
    return await loadMembersLogic();
  } catch (error) {
    console.error('Failed to load members:', error);
    return undefined;
  }
};

/**
 * 获取组织成员详情
 * @param memberId 成员ID
 * @param withLoading 全局 loading 包装函数
 * @returns 组织成员详情数据
 */
export const loadMemberDetail = async (
  memberId: string,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<MemberDetail | undefined> => {
  const loadMemberDetailLogic = async (): Promise<MemberDetail> => {
    const response = await organizationApi.getMemberDetail(memberId);
    return response.data;
  };

  if (withLoading) {
    return withLoading(loadMemberDetailLogic, {
      onError: (error) => {
        console.error('Load member detail error:', error);
      },
    });
  }

  try {
    return await loadMemberDetailLogic();
  } catch (error) {
    console.error('Failed to load member detail:', error);
    return undefined;
  }
};

/**
 * 更新组织成员信息
 * @param memberId 成员ID
 * @param status 成员状态
 * @param withLoading 全局 loading 包装函数
 * @returns 更新结果
 */
export const updateMember = async (
  memberId: string,
  data: { status: string; roleId: string },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<{ success: boolean; message?: string }> => {
  const updateMemberLogic = async (): Promise<{ success: boolean; message?: string }> => {
    const response: MemberUpdateResponse = await organizationApi.updateMember(memberId, data);
    if (response.code === 200) {
      return {
        success: true,
        message: response.message || '更新成功',
      };
    } else {
      return {
        success: false,
        message: response.message || '更新失败',
      };
    }
  };

  if (withLoading) {
    const result = await withLoading(updateMemberLogic, {
      onError: (error) => {
        console.error('Update member error:', error);
      },
    });
    return result ?? { success: false, message: '更新失败' };
  }

  try {
    return await updateMemberLogic();
  } catch (error) {
    console.error('Failed to update member:', error);
    return { success: false, message: '更新失败' };
  }
};
