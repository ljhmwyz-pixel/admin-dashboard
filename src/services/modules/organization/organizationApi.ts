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
} from '@/shared/types/organization';

import { apiClient } from '../../api/client';
import { ORGANIZATION_ENDPOINTS } from '../../api/endpoints';

// 组织管理 API 接口定义
export interface OrganizationApi {
  // 获取组织列表
  getList: (params?: OrganizationListParams) => Promise<OrganizationListResponse>;

  // 创建组织
  create: (data: CreateOrganizationRequest) => Promise<CreateOrganizationResponse>;

  // 创建组织
  update: (data: CreateOrganizationRequest) => Promise<CreateOrganizationResponse>;

  // 获取组织详情
  detail: (data: { orgId: string }) => Promise<CreateOrganizationResponse>;

  // 验证邮箱
  verifyEmail: (data: { email: string }) => Promise<VerifyEmailResponse>;

  // 删除校验
  verifyDelete: (data: { orgId: string | number }) => Promise<VerifyDeleteResponse>;

  // 删除组织
  delete: (data: { orgId: string | number }) => Promise<DeleteResponse>;
}

// 组织管理API实现
class OrganizationApiImpl implements OrganizationApi {
  async getList(params?: OrganizationListParams): Promise<OrganizationListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.LIST, { params });
  }

  async create(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.CREATE, data);
  }

  async update(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.put(ORGANIZATION_ENDPOINTS.UPDATE(data.orgId), data);
  }

  async detail(data: { orgId: string }): Promise<CreateOrganizationResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.DETAIL(data.orgId), { params: data });
  }

  async verify(data: CreateOrganizationRequest): Promise<VerifyResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.VERIFY, data);
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.VERIFY_EMAIL, { params: data });
  }

  async delete(data: { orgId: string | number }): Promise<DeleteResponse> {
    return apiClient.delete(ORGANIZATION_ENDPOINTS.DELETE(data.orgId), {
      params: { orgId: data.orgId },
    });
  }

  async verifyDelete(data: { orgId: string | number }): Promise<VerifyDeleteResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.VERIFY_DELETE(data.orgId), {
      params: { orgId: data.orgId },
    });
  }
}

// 创建组织API实例
export const organizationApi = new OrganizationApiImpl();

export default organizationApi;
