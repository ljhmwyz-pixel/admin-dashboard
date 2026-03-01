import type { Organization, OrganizationTreeNode } from '../../../shared/types/organization';
import { apiClient } from '../../api/client';
import { ORGANIZATION_ENDPOINTS } from '../../api/endpoints';

// 组织管理API接口定义
export interface OrganizationApi {
  // 获取组织列表
  getList: (params?: OrganizationListParams) => Promise<OrganizationListResponse>;

  // 获取组织树
  getTree: () => Promise<OrganizationTreeNode[]>;

  // 获取组织详情
  getDetail: (id: string | number) => Promise<Organization>;

  // 创建组织
  create: (data: CreateOrganizationData) => Promise<Organization>;

  // 更新组织
  update: (id: string | number, data: UpdateOrganizationData) => Promise<Organization>;

  // 删除组织
  delete: (id: string | number) => Promise<void>;

  // 获取组织类型
  getTypes: () => Promise<OrganizationType[]>;
}

// 请求参数类型
export interface OrganizationListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  parentId?: string | number;
  status?: 'active' | 'inactive';
}

// 响应数据类型
export interface OrganizationListResponse {
  data: Organization[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateOrganizationData {
  name: string;
  code: string;
  parentId?: string | number;
  type: string;
  description?: string;
  sort?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> {
  id?: string | number;
}

export interface OrganizationType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

// 组织管理API实现
class OrganizationApiImpl implements OrganizationApi {
  async getList(params?: OrganizationListParams): Promise<OrganizationListResponse> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.LIST, { params });
  }

  async getTree(): Promise<OrganizationTreeNode[]> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.TREE);
  }

  async getDetail(id: string | number): Promise<Organization> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.DETAIL(id));
  }

  async create(data: CreateOrganizationData): Promise<Organization> {
    return apiClient.post(ORGANIZATION_ENDPOINTS.CREATE, data);
  }

  async update(id: string | number, data: UpdateOrganizationData): Promise<Organization> {
    return apiClient.put(ORGANIZATION_ENDPOINTS.UPDATE(id), data);
  }

  async delete(id: string | number): Promise<void> {
    return apiClient.delete(ORGANIZATION_ENDPOINTS.DELETE(id));
  }

  async getTypes(): Promise<OrganizationType[]> {
    return apiClient.get(ORGANIZATION_ENDPOINTS.TYPES);
  }
}

// 创建组织API实例
export const organizationApi = new OrganizationApiImpl();

export default organizationApi;
