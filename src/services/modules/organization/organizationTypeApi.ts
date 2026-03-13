import type { OrganizationTypeListResponse } from '@shared/types/organizationType';

import { apiClient } from '@/services/api/client';
import { ORGANIZATIONTYPE_ENDPOINTS } from '@/services/api/endpoints';
export interface OrganizationTypeApi {
  /** 查看所有组织类型 */
  getAllOrganizationTypes: () => Promise<OrganizationTypeListResponse>;
}

/**
 * 组织类型管理 API 实现类
 * 实现了所有组织类型相关的 API 调用逻辑
 */
class OrganizationTypeApiImpl implements OrganizationTypeApi {
  /**
   * 获取所有组织类型
   */
  async getAllOrganizationTypes(): Promise<OrganizationTypeListResponse> {
    return apiClient.get(ORGANIZATIONTYPE_ENDPOINTS.ORGANIZATION_TYPES);
  }
}

// 创建组织 API 实例
export const organizationTypeApi = new OrganizationTypeApiImpl();

export default organizationTypeApi;
