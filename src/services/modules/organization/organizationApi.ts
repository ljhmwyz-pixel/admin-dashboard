import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  DeleteResponse,
  OrganizationListParams,
  OrganizationListResponse,
  VerifyDeleteResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyResponse,
} from '@shared/types/organization';

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
}

// 创建组织 API 实例
export const organizationApi = new OrganizationApiImpl();

export default organizationApi;
