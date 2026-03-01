// 组织服务API
import { organizationTreeData } from '../mocks/organizationData';

// 模拟API接口 - 实际项目中应替换为真实的HTTP请求
export const searchOrganizations = async (keyword: string): Promise<any[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!keyword.trim()) {
    return organizationTreeData;
  }

  // 模拟后端搜索逻辑
  const searchKeyword = keyword.toLowerCase();

  const filterNodes = (nodes: any[]): any[] => {
    return nodes.reduce((acc: any[], node) => {
      // 检查当前节点是否匹配
      const matches = node.title.toLowerCase().includes(searchKeyword);

      // 如果当前节点匹配，添加到结果中
      if (matches) {
        acc.push({
          ...node,
          children: node.children ? filterNodes(node.children) : undefined,
        });

        return acc;
      }

      // 如果有子节点，递归检查子节点
      if (node.children && node.children.length > 0) {
        const filteredChildren = filterNodes(node.children);
        // 如果有子节点匹配，添加当前节点（带过滤后的子节点）到结果中
        if (filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }
      }

      return acc;
    }, []);
  };

  return filterNodes(organizationTreeData);
};

// 获取组织树数据
export const getOrganizationTree = async (): Promise<any[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 200));

  return organizationTreeData;
};
