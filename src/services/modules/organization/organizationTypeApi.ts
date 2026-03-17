import type {
  OrganizationTypeDetailDataResponse,
  OrganizationTypeDetailFunctionalResponse,
  OrganizationTypeListResponse,
  OrganizationTypePermissionResponse,
  OrganizationTypeRecordResponse,
} from '@shared/types/organizationType';

import { apiClient } from '@/services/api/client';
export interface OrganizationTypeApi {
  /** 查看所有组织类型 */
  getAllOrganizationTypes: () => Promise<OrganizationTypeListResponse>;

  /** 查询组织类型-功能权限配置 */
  getOrganizationTypeFunctionalPermissions: (
    orgTypeCode: string,
    params?: {
      platform?: string; // 平台类型，可选值：WEB, APP
      permissionKeyword?: string;
    },
  ) => Promise<OrganizationTypeDetailFunctionalResponse>;

  /** 查询组织类型-数据权限配置 */
  getOrganizationTypeDataPermissions: (
    orgTypeCode: string,
    params?: {
      resourceType?: string; // 资源类型，可选值：ORGANIZATION, USER, PLANT
      permissionKeyword?: string;
    },
  ) => Promise<OrganizationTypeDetailDataResponse>;

  /** 更新组织类型-权限数据配置 */
  updateOrganizationTypePermissions: (orgTypeCode: string, data: any) => Promise<any>;

  /** 查询组织类型-变更记录 */
  getOrganizationTypeRecords: (typeCode: string) => Promise<OrganizationTypeRecordResponse>;

  /** 上传组织类型图片 */
  uploadOrganizationTypeImage: (typeId: string, image: File) => Promise<any>;
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
    return apiClient.get('/api/v1/organization/organization-types');
  }

  /**
   * 获取组织类型功能权限
   * @param orgTypeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypeFunctionalPermissions(
    orgTypeCode: string,
    params?: {
      platform?: string; // 平台类型，可选值：WEB, APP
      permissionKeyword?: string;
    },
  ): Promise<OrganizationTypeDetailFunctionalResponse> {
    return apiClient.get(`/api/v1/org-types/${orgTypeCode}/permissions/functional`, { params });
  }

  /**
   * 获取组织类型数据权限
   * @param orgTypeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypeDataPermissions(
    orgTypeCode: string,
    params?: {
      resourceType?: string; // 资源类型，可选值：ORGANIZATION, USER, PLANT
      dataKeyword?: string;
      pageNum?: number;
      pageSize?: number;
    },
  ): Promise<OrganizationTypeDetailDataResponse> {
    return apiClient.get(`/api/v1/org-types/${orgTypeCode}/permissions/data`, { params });
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
      recordType?: string; // 变更记录类型，可选值：PERMISSION, DATA_ORGANIZATION, DATA_USER, DATA_PLANT
    },
  ): Promise<OrganizationTypeRecordResponse> {
    return apiClient.get(`/api/v1/organization/organization-types/${typeCode}/records`, { params });
  }

  /**
   * 更新组织类型权限配置
   * @param orgTypeCode 组织类型编码
   * @param data 权限配置数据
   */
  async updateOrganizationTypePermissions(orgTypeCode: string, data: any): Promise<any> {
    return apiClient.put(`/api/v1/org-types/${orgTypeCode}/permissions`, data);
  }

  /**
   * 上传组织类型图片
   * @param typeId 组织类型ID
   * @param image 图片文件
   */
  async uploadOrganizationTypeImage(typeId: string, image: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', image);

    return apiClient.post(`/api/v1/organization/organization-types/${typeId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 获取组织类型功能权限
   * @param orgTypeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypeFunctionalPermissions(
    orgTypeCode: string,
    params?: {
      platform?: string; // 平台类型，可选值：WEB, APP
      permissionKeyword?: string;
    },
  ): Promise<OrganizationTypeDetailFunctionalResponse> {
    return apiClient.get(`/api/v1/org-types/${orgTypeCode}/permissions/functional`, { params });
  }

  /**
   * 获取组织类型数据权限
   * @param orgTypeCode 组织类型编码
   * @param params 查询参数
   */
  async getOrganizationTypeDataPermissions(
    orgTypeCode: string,
    params?: {
      resourceType?: string; // 资源类型，可选值：ORGANIZATION, USER, PLANT
      permissionKeyword?: string;
    },
  ): Promise<OrganizationTypeDetailDataResponse> {
    return apiClient.get(`/api/v1/org-types/${orgTypeCode}/permissions/data`, { params });
  }
}

// 创建组织 API 实例
export const organizationTypeApi = new OrganizationTypeApiImpl();

export default organizationTypeApi;
