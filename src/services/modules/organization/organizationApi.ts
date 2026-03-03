import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  OrganizationListParams,
  OrganizationListResponse,
} from '@/shared/types/organization';

import { apiClient } from '../../api/client';
import { ORGANIZATION_ENDPOINTS } from '../../api/endpoints';

// 组织管理 API 接口定义
export interface OrganizationApi {
  // 获取组织列表
  getList: (params?: OrganizationListParams) => Promise<OrganizationListResponse>;

  // 创建组织
  create: (data: CreateOrganizationRequest) => Promise<CreateOrganizationResponse>;
}

// 组织管理API实现
class OrganizationApiImpl implements OrganizationApi {
  async getList(params?: OrganizationListParams): Promise<OrganizationListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.LIST, { params });
  }

  async create(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.CREATE, data);
  }
}

// 创建组织API实例
export const organizationApi = new OrganizationApiImpl();

export default organizationApi;
