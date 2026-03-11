import type { ApiOrganization, TreeNodeData } from '@pages/organization/dto';

/**
 * 将API组织数据转换为 antd 树形结构数据
 * @param apiData API 返回的组织列表数据
 * @returns antd 树形结构数据
 */
export function transformOrganizationToTreeData(apiData: ApiOrganization[]): TreeNodeData[] {
  // 创建节点映射表
  const nodeMap = new Map<string, TreeNodeData>();

  // 第一步：创建所有节点
  for (const org of apiData) {
    const node: TreeNodeData = {
      key: org.orgId,
      title: org.orgName,
      children: [],
      type: org.orgType,
      canAdd: true,
      canDelete: org.orgType !== 'PYLONTECH',
      description: org.description,
      status: org.status,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      parentOrgId: org.parentOrgId,
    };
    nodeMap.set(org.orgId, node);
  }

  // 第二步：构建树形结构
  const treeData: TreeNodeData[] = [];

  for (const org of apiData) {
    const currentNode = nodeMap.get(org.orgId)!;
    const parentNodeId = org.parentOrgId;

    if (parentNodeId) {
      const parentNode = nodeMap.get(parentNodeId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      } else {
        treeData.push(currentNode);
      }
    } else {
      treeData.push(currentNode);
    }
  }

  return treeData;
}

/**
 * 构建父节点映射表（迭代方式）
 * @param treeData 树形结构数据
 * @returns 父节点映射表
 */
function buildParentMap(treeData: TreeNodeData[]): Map<string, TreeNodeData> {
  const parentMap = new Map<string, TreeNodeData>();
  const stack = [...treeData];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        parentMap.set(child.key, node);
        stack.push(child);
      }
    }
  }

  return parentMap;
}

/**
 * 构建节点映射表（迭代方式）
 * @param treeData 树形结构数据
 * @returns 节点映射表
 */
function buildNodeMap(treeData: TreeNodeData[]): Map<string, TreeNodeData> {
  const nodeMap = new Map<string, TreeNodeData>();
  const stack = [...treeData];

  while (stack.length > 0) {
    const node = stack.pop()!;
    nodeMap.set(node.key, node);
    if (node.children && node.children.length > 0) {
      stack.push(...node.children);
    }
  }

  return nodeMap;
}

/**
 * 获取指定节点的父节点信息
 * @param treeData 树形结构数据
 * @param nodeId 目标节点 ID
 * @returns 父节点信息，如果没有父节点则返回 null
 */
export function getParentNode(treeData: TreeNodeData[], nodeId: string): TreeNodeData | null {
  const parentMap = buildParentMap(treeData);
  return parentMap.get(nodeId) || null;
}

/**
 * 批量获取多个节点的父节点信息
 * @param treeData 树形结构数据
 * @param nodeIds 目标节点 ID 数组
 * @returns Map<节点 ID, 父节点>
 */
export function getParentNodesBatch(
  treeData: TreeNodeData[],
  nodeIds: string[],
): Map<string, TreeNodeData | null> {
  const parentMap = buildParentMap(treeData);
  const result = new Map<string, TreeNodeData | null>();

  for (const nodeId of nodeIds) {
    result.set(nodeId, parentMap.get(nodeId) || null);
  }

  return result;
}

/**
 * 根据节点 key获取节点完整信息
 * @param treeData 树形结构数据
 * @param key 目标节点 key
 * @returns 节点完整信息，如果未找到则返回 null
 */
export function getNodeByKey(treeData: TreeNodeData[], key: string): TreeNodeData | null {
  const nodeMap = buildNodeMap(treeData);
  return nodeMap.get(key) || null;
}

/**
 * 批量获取多个节点的完整信息
 * @param treeData 树形结构数据
 * @param keys 目标节点 key 数组
 * @returns Map<节点 key, 节点信息>
 */
export function getNodesByKeysBatch(
  treeData: TreeNodeData[],
  keys: string[],
): Map<string, TreeNodeData | null> {
  const nodeMap = buildNodeMap(treeData);
  const result = new Map<string, TreeNodeData | null>();

  for (const key of keys) {
    result.set(key, nodeMap.get(key) || null);
  }

  return result;
}
