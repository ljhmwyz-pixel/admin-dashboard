import type {
  OrganizationTypeListResponse,
  OrganizationTypePermissionResponse,
  OrganizationTypeRecordResponse,
} from '@shared/types/organizationType';

import { apiClient } from '@/services/api/client';
import { ORGANIZATIONTYPE_ENDPOINTS } from '@/services/api/endpoints';
export interface OrganizationTypeApi {
  /** 查看所有组织类型 */
  getAllOrganizationTypes: () => Promise<OrganizationTypeListResponse>;

  /** 查询组织类型权限配置 */
  getOrganizationTypePermissions: (typeCode: string) => Promise<OrganizationTypePermissionResponse>;

  /** 查询组织类型变更记录 */
  getOrganizationTypeRecords: (typeCode: string) => Promise<OrganizationTypeRecordResponse>;
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

  /**
   * 获取组织类型权限
   * @param typeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypePermissions(
    orgTypeCode: string,
    params?: {
      permissionType?: string; // 权限类型，可选值：FUNCTIONAL, DATA
      platform?: string; // 平台类型，可选值：WEB, APP
      resourceType?: string; // 资源类型，可选值：ORGANIZATION, USER, PLANT
      permissionKeyword?: string;
      dataKeyword?: string;
    },
  ): Promise<OrganizationTypePermissionResponse> {
    return apiClient.get(`/api/v1/org-types/${orgTypeCode}/permissions`, { params });
  }
  /**
   * 获取组织类型变更记录
   * @param typeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypeRecords(
    typeCode: string,
    params?: {
      pageNum?: number;
      pageSize?: number;
      keyword?: string;
      recordType?: 'PERMISSION' | 'DATA_ORGANIZATION' | 'DATA_USER' | 'DATA_PLANT';
    },
  ): Promise<OrganizationTypeRecordResponse> {
    return apiClient.get(`/api/v1/organization/organization-types/${typeCode}/records`, { params });
  }
}

// 创建组织 API 实例
export const organizationTypeApi = new OrganizationTypeApiImpl();

export default organizationTypeApi;
