import type { ApiOrganization, TreeNodeData } from '@/shared/types/organization';

/**
 * 将API组织数据转换为 antd 树形结构数据
 * @param apiData API返回的组织列表数据
 * @returns antd 树形结构数据
 */
export function transformOrganizationToTreeData(apiData: ApiOrganization[]): TreeNodeData[] {
  // 创建节点映射表
  const nodeMap = new Map<string, TreeNodeData>();

  // 第一步：创建所有节点
  apiData.forEach((org) => {
    const node: TreeNodeData = {
      key: org.orgId, // 使用 orgId 作为 key
      title: org.orgName, // 使用 orgName 作为 title
      children: [],
      type: org.orgType,
      canAdd: org.status === 'ACTIVE',
      canDelete: org.status === 'ACTIVE' && org.parentOrgId !== null && org.orgType !== 'Pylontech',
      description: org.description,
      status: org.status, // 保持原始状态值
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      // 扩展字段，用于构建树形结构
      parentOrgId: org.parentOrgId,
    };
    nodeMap.set(org.orgId, node);
  });

  // 第二步：构建树形结构
  const treeData: TreeNodeData[] = [];

  apiData.forEach((org) => {
    const currentNode = nodeMap.get(org.orgId)!;
    const parentNodeId = org.parentOrgId;

    if (parentNodeId) {
      // 有父组织，添加到父组织的 children 中
      const parentNode = nodeMap.get(parentNodeId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    } else {
      // 没有父组织（根节点），直接添加到结果数组
      treeData.push(currentNode);
    }
  });

  return treeData;
}

/**
 * 生成兜底的组织树数据（当 API 调用失败时使用）
 * @param count 生成的节点数量
 * @returns 兜底的树形数据
 */
export function generateFallbackTreeData(count: number = 10): TreeNodeData[] {
  const rootNode: TreeNodeData = {
    key: 'fallback-root',
    title: 'Pylontech',
    children: [],
    type: 'Pylontech',
    canAdd: true,
    canDelete: false,
    description: '这是兜底数据，API 调用失败时显示',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentOrgId: null,
  };

  // 生成子节点
  for (let i = 1; i <= count; i++) {
    const nodeType = i % 3 === 0 ? 'Installer' : i % 2 === 0 ? 'Dealer' : 'Pylontech';
    const childNode: TreeNodeData = {
      key: `fallback-${i}`,
      title: `组织${i}`,
      children: [],
      type: nodeType,
      canAdd: true,
      canDelete: nodeType !== 'Pylontech', // Pylontech 类型不允许删除
      description: `这是第${i}个组织`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentOrgId: i <= 3 ? 'fallback-root' : `fallback-${i % 3 || 3}`,
    };

    if (i <= 3) {
      // 前 3 个组织作为一级子组织
      rootNode.children?.push(childNode);
    } else {
      // 其他组织随机分配给前三级组织
      const parentIndex = i % 3;
      const parent = rootNode.children?.[parentIndex];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(childNode);
      }
    }
  }

  return [rootNode];
}
