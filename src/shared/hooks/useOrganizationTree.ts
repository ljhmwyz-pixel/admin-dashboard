import { useCallback, useState } from 'react';

import {
  loadOrganizationData as loadOrganizationDataService,
  validateDeleteOrganization,
} from '@/features/organization/services/organizationService';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';
import type { TreeNodeData } from '@/shared/types/organization';
import { getNodeByKey } from '@/shared/utils/dataTransformer';

/**
 * 组织树自定义 Hook
 * 封装组织树的核心业务逻辑
 */
export function useOrganizationTree() {
  // 状态管理
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [currentParentNode, setCurrentParentNode] = useState<TreeNodeData>({} as TreeNodeData);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const { withLoading } = useGlobalLoading();

  // 加载组织树数据
  const loadTreeData = useCallback(
    async (searchKeyword?: string) => {
      await loadOrganizationDataService({
        searchKeyword,
        withLoading,
        setData: setTreeData,
      });
    },
    [withLoading],
  );

  // 处理节点选择
  const handleSelect = useCallback(
    (key: string) => {
      setSelectedKey(key);
      setCurrentParentNode(getNodeByKey(treeData, key) as TreeNodeData);
    },
    [treeData],
  );

  // 处理添加组织
  const handleAdd = useCallback((parentNode: TreeNodeData) => {
    setCurrentParentNode(parentNode);
    setAddDrawerVisible(true);
  }, []);

  // 处理删除组织
  const handleDelete = useCallback(
    async (nodeData: TreeNodeData, onFail?: () => void, onSuccess?: () => void) => {
      try {
        const validationResult = await validateDeleteOrganization(nodeData.key, withLoading);

        if (!validationResult.canDelete) {
          onFail?.();
          return;
        }

        onSuccess?.();
      } catch (error) {
        console.error('Delete validation failed:', error);
      }
    },
    [withLoading],
  );

  // 关闭添加抽屉
  const closeAddDrawer = useCallback(() => {
    setAddDrawerVisible(false);
    setCurrentParentNode({} as TreeNodeData);
  }, []);

  // 展开/收起节点
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys);
  }, []);

  return {
    // 状态
    treeData,
    currentParentNode,
    selectedKey,
    addDrawerVisible,
    expandedKeys,

    // 方法
    loadTreeData,
    handleSelect,
    handleAdd,
    handleDelete,
    closeAddDrawer,
    handleExpand,
    setTreeData,
  };
}
