// 组织树相关类型定义

export interface TreeNodeData {
  key: string;
  title: string;
  children?: TreeNodeData[];
  isLeaf?: boolean;
  type?: 'company' | 'dealer' | 'installer';
  canAdd?: boolean;
  canDelete?: boolean;
  [key: string]: any;
}

export interface OrganizationFormData {
  organizationName: string;
  organizationType: 'company' | 'dealer' | 'installer';
  organizationAddress?: string;
  postalCode?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
}

// 组织实体类型
export interface Organization {
  id: string | number;
  name: string;
  code: string;
  parentId?: string | number;
  type: string;
  description?: string;
  sort?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  children?: Organization[];
}

// 组织树节点类型
export interface OrganizationTreeNode {
  key: string | number;
  title: string;
  value: string | number;
  children?: OrganizationTreeNode[];
  isLeaf?: boolean;
  disabled?: boolean;
  selectable?: boolean;
}

// 组织类型枚举
export type OrganizationType = 'company' | 'department' | 'team' | 'branch';
