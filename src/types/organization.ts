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
