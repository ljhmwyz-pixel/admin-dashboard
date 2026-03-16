import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  DeleteResponse,
  MemberDetailResponse,
  MemberListParams,
  MemberListResponse,
  MemberUpdateResponse,
  OrganizationListParams,
  OrganizationListResponse,
  PreviewMemberPermissionRequest,
  PreviewMemberPermissionResponse,
  RecordListResponse,
  RoleListResponse,
  VerifyDeleteResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyResponse,
} from '@pages/organization/dto';

import { apiClient } from '@/services/api/client';
import { ORGANIZATION_ENDPOINTS } from '@/services/api/endpoints';

/**
 * 组织管理 API 接口定义
 * 提供组织相关的完整 CRUD 操作和验证功能
 */
export interface OrganizationApi {
  /** 获取组织列表 */
  getList: (params?: OrganizationListParams) => Promise<OrganizationListResponse>;

  /** 创建新组织 */
  create: (data: CreateOrganizationRequest) => Promise<CreateOrganizationResponse>;

  /** 更新组织信息 */
  update: (data: CreateOrganizationRequest) => Promise<CreateOrganizationResponse>;

  /** 获取组织详情 */
  detail: (data: { orgId: string }) => Promise<CreateOrganizationResponse>;

  /** 获取组织成员列表 */
  getMembers: (params: MemberListParams) => Promise<MemberListResponse>;

  /** 获取组织成员详情 */
  getMemberDetail: (memberId: string) => Promise<MemberDetailResponse>;

  /** 更新组织成员信息 */
  updateMember: (
    memberId: string,
    data: { status: string; roleIds: string[] },
  ) => Promise<MemberUpdateResponse>;

  /** 预览组织成员权限 */
  previewMemberPermission: (
    params: PreviewMemberPermissionRequest,
  ) => Promise<PreviewMemberPermissionResponse>;

  /** 获取组织成员权限 */
  getMemberPermissions: (memberId: string) => Promise<PreviewMemberPermissionResponse>;

  /** 获取组织成员应用权限 */
  getMemberApplicationDetail: (applicationId: string) => Promise<MemberDetailResponse>;

  /** 获取组织成员变更日志 */
  getMemberChangeLogs: (
    memberId: string,
    params: { pageNum: number; pageSize: number },
  ) => Promise<RecordListResponse>;

  /** 获取组织角色列表 */
  getRoles: (params: MemberListParams) => Promise<RoleListResponse>;

  /** 验证组织信息（创建时） */
  verify: (data: CreateOrganizationRequest) => Promise<VerifyResponse>;

  /** 验证组织信息（更新时） */
  verifyByUpdate: (data: CreateOrganizationRequest) => Promise<VerifyResponse>;

  /** 验证邮箱是否存在 */
  verifyEmail: (data: { email: string }) => Promise<VerifyEmailResponse>;

  /** 删除前验证 */
  verifyDelete: (data: { orgId: string | number }) => Promise<VerifyDeleteResponse>;

  /** 删除组织 */
  delete: (data: { orgId: string | number }) => Promise<DeleteResponse>;
}

/**
 * 组织管理 API 实现类
 * 实现了所有组织相关的 API 调用逻辑
 */
class OrganizationApiImpl implements OrganizationApi {
  /**
   * 获取组织列表
   * @param params - 查询参数（分页、搜索等）
   * @returns 组织列表数据
   */
  async getList(params?: OrganizationListParams): Promise<OrganizationListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.LIST, { params });
  }

  /**
   * 创建新组织
   * @param data - 组织创建请求数据
   * @returns 创建结果
   */
  async create(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.CREATE, data);
  }

  /**
   * 更新组织信息
   * @param data - 组织更新请求数据（包含 orgId）
   * @returns 更新结果
   */
  async update(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.put(ORGANIZATION_ENDPOINTS.UPDATE(data.orgId || ''), data);
  }

  /**
   * 获取组织详情
   * @param data - 组织 ID
   * @returns 组织详细信息
   */
  async detail(data: { orgId: string }): Promise<CreateOrganizationResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.DETAIL(data.orgId), { params: data });
  }

  /**
   * 验证组织信息（创建时）
   * @param data - 待验证的组织信息
   * @returns 验证结果（包括国家范围、组织类型等验证）
   */
  async verify(data: CreateOrganizationRequest): Promise<VerifyResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.VERIFY, data);
  }

  /**
   * 验证组织信息（更新时）
   * @param data - 待验证的组织信息（包含 orgId）
   * @returns 验证结果
   */
  async verifyByUpdate(data: CreateOrganizationRequest): Promise<VerifyResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.VERIFY_UPDATE(data.orgId || ''), data);
  }

  /**
   * 验证邮箱是否存在
   * @param data - 邮箱地址
   * @returns 验证结果（用户是否存在、用户名、手机号等）
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.VERIFY_EMAIL, { params: data });
  }

  /**
   * 删除组织
   * @param data - 组织 ID
   * @returns 删除结果
   */
  async delete(data: { orgId: string | number }): Promise<DeleteResponse> {
    return apiClient.delete(ORGANIZATION_ENDPOINTS.DELETE(data.orgId), {
      params: { orgId: data.orgId },
    });
  }

  /**
   * 删除前验证
   * @param data - 组织 ID
   * @returns 验证结果（是否可以安全删除）
   */
  async verifyDelete(data: { orgId: string | number }): Promise<VerifyDeleteResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.VERIFY_DELETE(data.orgId), {
      params: { orgId: data.orgId },
    });
  }

  /**
   * 获取组织成员列表
   * @param params - 查询参数（分页、搜索、状态等）
   * @returns 组织成员列表数据
   */
  async getMembers(params: MemberListParams): Promise<MemberListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.MEMBERS, { params });
  }

  /**
   * 获取组织列表
   * @returns 组织列表数据
   */
  async getRoles(params: MemberListParams): Promise<RoleListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.ROLES, { params });
  }

  /**
   * 获取组织成员详情
   * @param memberId - 成员ID
   * @returns 组织成员详情数据
   */
  async getMemberDetail(memberId: string): Promise<MemberDetailResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.MEMBER_DETAIL(memberId));
  }

  /**
   * 获取组织成员变更日志
   * @param memberId - 成员ID
   * @returns 变更日志数据
   */
  async getMemberChangeLogs(
    memberId: string,
    params: { pageNum: number; pageSize: number },
  ): Promise<RecordListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.CHANGE_LOGS(memberId), { params });
  }

  /**
   * 更新组织成员信息
   * @param memberId - 成员ID
   * @param data - 更新数据（包含状态、角色列表）
   * @returns 更新结果
   */
  async updateMember(
    memberId: string,
    data: { status: string; roleIds: string[] },
  ): Promise<MemberUpdateResponse> {
    return apiClient.put(ORGANIZATION_ENDPOINTS.MEMBER_UPDATE(memberId), data);
  }

  /**
   * 预览组织成员权限
   * @param params - 预览数据（包含角色ID）
   * @returns 预览结果
   */
  async previewMemberPermission(
    params: PreviewMemberPermissionRequest,
  ): Promise<PreviewMemberPermissionResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.PERMISSION_PREVIEW, { params });
  }

  /**
   * 获取组织成员权限
   * @param memberId - 成员ID
   * @returns 权限数据
   */
  async getMemberPermissions(memberId: string): Promise<PreviewMemberPermissionResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.PERMISSIONS(memberId));
  }

  /**
   * 获取组织成员应用权限
   * @param applicationId - 应用ID
   * @returns 应用权限数据
   */
  async getMemberApplicationDetail(applicationId: string): Promise<MemberDetailResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.APPLICATION_PERMISSIONS(applicationId));
  }
}

// 创建组织 API 实例
export const organizationApi = new OrganizationApiImpl();

export default organizationApi;
