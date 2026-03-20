// 组织服务API
import type {
  AddMemberRequest,
  AddMemberResponse,
  AssignMemberPlantsResponse,
  DeleteResponse,
  MemberDetailResponse,
  MemberListParams,
  MemberListResponse,
  MemberPlantTreeResponse,
  MemberUpdateResponse,
  OrganizationListParams,
  PlantTreeParams,
  PlantTreeResponse,
  PreviewMemberPermissionRequest,
  PreviewMemberPermissionResponse,
  RecordListResponse,
  ReviewMemberApplicationResponse,
  RoleListResponse,
  TreeNodeData,
} from '@pages/organization/dto';
import { transformOrganizationToTreeData } from '@pages/organization/utils';

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
): Promise<MemberDetailResponse | undefined> => {
  const loadMemberDetailLogic = async (): Promise<MemberDetailResponse> => {
    const response = await organizationApi.getMemberDetail(memberId);
    return response;
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
  data: { status: string; roleIds: string[] },
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

/**
 * 获取组织成员权限
 * @param params 查询参数（角色ID）
 * @param withLoading 全局 loading 包装函数
 * @returns 组织成员权限数据
 */
export const loadMemberPermissions = async (
  params: PreviewMemberPermissionRequest,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<PreviewMemberPermissionResponse | undefined> => {
  const loadMemberPermissionLogic = async (): Promise<PreviewMemberPermissionResponse> => {
    const response = await organizationApi.previewMemberPermission(params);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMemberPermissionLogic, {
      onError: (error) => {
        console.error('Load member permission error:', error);
      },
    });
  }

  try {
    return await loadMemberPermissionLogic();
  } catch (error) {
    console.error('Failed to load member permission:', error);
    return undefined;
  }
};

export const loadMemberPermission = async (
  memberId: string,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<PreviewMemberPermissionResponse | undefined> => {
  const loadMemberPermissionsLogic = async (): Promise<PreviewMemberPermissionResponse> => {
    const response = await organizationApi.getMemberPermissions(memberId);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMemberPermissionsLogic, {
      onError: (error) => {
        console.error('Load member permissions error:', error);
      },
    });
  }

  try {
    return await loadMemberPermissionsLogic();
  } catch (error) {
    console.error('Failed to load member permissions:', error);
    return undefined;
  }
};

export const loadMemberApplicationDetail = async (
  applicationId: string,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<MemberDetailResponse | undefined> => {
  const loadMemberApplicationDetailLogic = async (): Promise<MemberDetailResponse> => {
    const response = await organizationApi.getMemberApplicationDetail(applicationId);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMemberApplicationDetailLogic, {
      onError: (error) => {
        console.error('Load member application permissions error:', error);
      },
    });
  }

  try {
    return await loadMemberApplicationDetailLogic();
  } catch (error) {
    console.error('Failed to load member application detail:', error);
    return undefined;
  }
};

export const loadRoles = async (
  params: MemberListParams,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<RoleListResponse | undefined> => {
  const loadRolesLogic = async (): Promise<RoleListResponse> => {
    const response = await organizationApi.getRoles(params);
    return response;
  };

  if (withLoading) {
    return withLoading(loadRolesLogic, {
      onError: (error) => {
        console.error('Load roles error:', error);
      },
    });
  }

  try {
    return await loadRolesLogic();
  } catch (error) {
    console.error('Failed to load roles:', error);
    return undefined;
  }
};

/**
 * 获取组织成员变更历史记录
 * @param memberId 成员ID
 * @param withLoading 全局 loading 包装函数
 * @returns 组织成员变更历史记录数据
 */
export const loadMemberChangeLogs = async (
  memberId: string,
  params: { pageNum: number; pageSize: number },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<RecordListResponse | undefined> => {
  const loadMemberChangeLogsLogic = async (): Promise<RecordListResponse> => {
    const response = await organizationApi.getMemberChangeLogs(memberId, params);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMemberChangeLogsLogic, {
      onError: (error) => {
        console.error('Load member change logs error:', error);
      },
    });
  }

  try {
    return await loadMemberChangeLogsLogic();
  } catch (error) {
    console.error('Failed to load member change logs:', error);
    return undefined;
  }
};

/**
 * 获取组织成员应用变更日志
 * @param applicationId 应用ID
 * @param withLoading 全局 loading 包装函数
 * @returns 组织成员应用变更日志数据
 */

export const loadMemberApplicationChangeLogs = async (
  applicationId: string,
  params: { pageNum: number; pageSize: number },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<RecordListResponse | undefined> => {
  const loadMemberApplicationChangeLogsLogic = async (): Promise<RecordListResponse> => {
    const response = await organizationApi.getMemberApplicationChangeLogs(applicationId, params);
    return response;
  };

  if (withLoading) {
    return withLoading(loadMemberApplicationChangeLogsLogic, {
      onError: (error) => {
        console.error('Load member application change logs error:', error);
      },
    });
  }

  try {
    return await loadMemberApplicationChangeLogsLogic();
  } catch (error) {
    console.error('Failed to load member application change logs:', error);
    return undefined;
  }
};

/**
 *
 * @param data
 * @param withLoading
 * @returns
 */
export const addMember = async (
  data: AddMemberRequest,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<AddMemberResponse | undefined> => {
  const addMemberLogic = async (): Promise<AddMemberResponse> => {
    const response = await organizationApi.addMember(data);
    return response;
  };

  if (withLoading) {
    return withLoading(addMemberLogic, {
      onError: (error) => {
        console.error('Add member error:', error);
      },
    });
  }

  try {
    return await addMemberLogic();
  } catch (error) {
    console.error('Failed to add member:', error);
    return undefined;
  }
};

/**
 * 删除组织成员
 * @param memberId 成员ID
 * @param data 确认删除数据
 * @param withLoading 全局 loading 包装函数
 * @returns 删除响应数据
 */
export const deleteMember = async (
  memberId: string,
  data: { confirmUid: string },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<DeleteResponse | undefined> => {
  const deleteMemberLogic = async (): Promise<DeleteResponse> => {
    const response = await organizationApi.deleteMember(memberId, data);
    return response;
  };

  if (withLoading) {
    return withLoading(deleteMemberLogic, {
      onError: (error) => {
        console.error('Delete member error:', error);
      },
    });
  }

  try {
    return await deleteMemberLogic();
  } catch (error) {
    console.error('Failed to delete member:', error);
    return undefined;
  }
};

/**
 *
 * @param applicationId
 * @param data
 * @param withLoading
 * @returns
 */
export const reviewMemberApplication = async (
  applicationId: string,
  data: { status: string; reason?: string },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<ReviewMemberApplicationResponse | undefined> => {
  const reviewMemberApplicationLogic = async (): Promise<ReviewMemberApplicationResponse> => {
    const response = await organizationApi.reviewMemberApplication(applicationId, data);
    return response;
  };

  if (withLoading) {
    return withLoading(reviewMemberApplicationLogic, {
      onError: (error) => {
        console.error('Review member application error:', error);
      },
    });
  }

  try {
    return await reviewMemberApplicationLogic();
  } catch (error) {
    console.error('Failed to review member application:', error);
    return undefined;
  }
};

/**
 * 变更组织成员状态
 * @param memberId 成员ID
 * @param data 变更状态数据
 * @param withLoading 全局 loading 包装函数
 * @returns 删除响应数据
 */
export const changeMemberStatus = async (
  memberId: string,
  data: { status: string; confirmUid: string; reason?: string },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<DeleteResponse | undefined> => {
  const changeMemberStatusLogic = async (): Promise<DeleteResponse> => {
    const response = await organizationApi.changeMemberStatus(memberId, data);
    return response;
  };

  if (withLoading) {
    return withLoading(changeMemberStatusLogic, {
      onError: (error) => {
        console.error('Change member status error:', error);
      },
    });
  }

  try {
    return await changeMemberStatusLogic();
  } catch (error) {
    console.error('Failed to change member status:', error);
    return undefined;
  }
};

/**
 * 获取电站树
 * @param params - 查询参数（电站ID、组织名称关键词）
 * @param withLoading - 全局 loading 包装函数
 * @returns 电站树数据
 */
export const getPlantTree = async (
  params?: PlantTreeParams,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<PlantTreeResponse | undefined> => {
  const getPlantTreeLogic = async (): Promise<PlantTreeResponse> => {
    const response = await organizationApi.getPlantTree(params);
    return response;
  };

  if (withLoading) {
    return withLoading(getPlantTreeLogic, {
      onError: (error) => {
        console.error('Get plant tree error:', error);
      },
    });
  }

  try {
    return await getPlantTreeLogic();
  } catch (error) {
    console.error('Failed to get plant tree:', error);
    return undefined;
  }
};

/**
 * 获取组织成员电站树
 * @param memberId 成员ID
 * @param params - 查询参数（电站ID、组织名称关键词）
 * @param withLoading - 全局 loading 包装函数
 * @returns 电站树数据
 */
export const getMemberPlantTree = async (
  memberId: string,
  params?: PlantTreeParams,
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<MemberPlantTreeResponse | undefined> => {
  const getMemberPlantTreeLogic = async (): Promise<MemberPlantTreeResponse> => {
    const response = await organizationApi.getMemberPlantTree(memberId, params);
    return response;
  };

  if (withLoading) {
    return withLoading(getMemberPlantTreeLogic, {
      onError: (error) => {
        console.error('Get member plant tree error:', error);
      },
    });
  }

  try {
    return await getMemberPlantTreeLogic();
  } catch (error) {
    console.error('Failed to get member plant tree:', error);
    return undefined;
  }
};

/**
 * 分配组织成员电站
 * @param memberId 成员ID
 * @param data 分配数据（包含组织ID、电站ID列表）
 * @param withLoading 全局 loading 包装函数
 * @returns 分配结果
 */
export const assignMemberPlants = async (
  memberId: string,
  data: { orgId: string; orgScopeIds: string[]; plantIds: string[] },
  withLoading?: <T>(
    asyncFn: () => Promise<T>,
    options?: { onError?: (error: unknown) => void },
  ) => Promise<T | undefined>,
): Promise<AssignMemberPlantsResponse | undefined> => {
  const assignMemberPlantsLogic = async (): Promise<AssignMemberPlantsResponse> => {
    const response = await organizationApi.assignMemberPlants(memberId, data);
    return response;
  };

  if (withLoading) {
    return withLoading(assignMemberPlantsLogic, {
      onError: (error) => {
        console.error('Assign member plants error:', error);
      },
    });
  }

  try {
    return await assignMemberPlantsLogic();
  } catch (error) {
    console.error('Failed to assign member plants:', error);
    return undefined;
  }
};
