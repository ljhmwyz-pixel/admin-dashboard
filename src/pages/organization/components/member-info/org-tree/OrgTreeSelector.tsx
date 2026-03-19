import React, { useCallback } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { OrgTreeSelectorProps, PlantTreeDatum } from '@pages/organization/dto';
import { AntButton, AntCheckbox, AntEmpty, AntInput, AntSpin, AntTree } from '@shared/components';
import type { DataNode, TreeProps } from 'antd/es/tree';
import clx from 'classnames';

import styles from './OrgTreeSelector.module.scss';

/**
 * 获取节点的所有后代节点
 */
const getAllDescendants = (node: PlantTreeDatum): PlantTreeDatum[] => {
  const descendants: PlantTreeDatum[] = [node];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      descendants.push(...getAllDescendants(child));
    });
  }
  return descendants;
};

/**
 * 在树中查找指定节点
 */
const findNodeById = (nodeId: React.Key, data: PlantTreeDatum[]): PlantTreeDatum | null => {
  for (const node of data) {
    if (node.nodeId === nodeId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(nodeId, node.children);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 组织树选择器组件
 * 支持编辑态（树形选择）和展示态（列表展示）
 *
 * 功能特性：
 * - 支持搜索过滤
 * - 支持全选操作
 * - 支持编辑态和展示态切换
 * - 支持自定义节点渲染
 * - 支持多选/单选
 * - 支持级联勾选模式（勾选父节点自动勾选所有子节点）
 */
const OrgTreeSelector: React.FC<OrgTreeSelectorProps> = ({
  treeData,
  selectedKeys,
  onChange,
  searchValue,
  onSearch,
  searchPlaceholder = 'Please enter organization name or ID',
  className = '',
  style,
  loading = false,
  selectAllCheckboxChecked,
  setSelectAllCheckboxChecked,
}) => {
  /**
   * 处理搜索变化
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onSearch?.(value);
    },
    [onSearch],
  );

  /**
   * 处理树节点勾选变化
   * 实现级联勾选逻辑：
   * 1. 勾选父节点时，自动勾选所有子节点
   * 2. 取消勾选子节点时，父节点的勾选状态也会被取消
   */
  const handleTreeCheck: TreeProps['onCheck'] = useCallback(
    (
      checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] },
      info: { checkedNodes: PlantTreeDatum[]; node: PlantTreeDatum; checked: boolean },
    ) => {
      const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
      const currentNode = info.node;
      const isChecked = info.checked;

      let newCheckedKeys: React.Key[] = [...checkedKeys];
      const newCheckedNodes: PlantTreeDatum[] = [];

      if (isChecked) {
        // 勾选操作：获取当前节点及其所有后代
        const allDescendants = getAllDescendants(currentNode);
        // 合并到已选列表（去重）
        const allKeys = new Set([...newCheckedKeys, ...allDescendants.map((d) => d.nodeId)]);
        newCheckedKeys = Array.from(allKeys).filter((key): key is React.Key => key !== undefined);
      } else {
        // 取消勾选操作：移除当前节点及其所有后代
        const allDescendants = getAllDescendants(currentNode);
        const keysToRemove = new Set(allDescendants.map((d) => d.nodeId));
        newCheckedKeys = newCheckedKeys.filter((key) => !keysToRemove.has(String(key)));
      }

      // 根据新的keys构建节点列表
      newCheckedKeys.forEach((key) => {
        const node = findNodeById(key, treeData);
        if (node) {
          newCheckedNodes.push(node);
        }
      });

      // 调用父组件的onChange，传递keys和nodes
      onChange?.(newCheckedKeys, newCheckedNodes);
    },
    [onChange, treeData],
  );

  /**
   * 处理全选
   */
  const handleSelectAll = useCallback(() => {
    const allKeys: React.Key[] = [];
    const allNodes: PlantTreeDatum[] = [];

    const traverse = (nodes: PlantTreeDatum[]) => {
      nodes.forEach((node) => {
        allKeys.push(node.nodeId || '');
        allNodes.push(node);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(treeData);
    onChange?.(allKeys, allNodes);
    setSelectAllCheckboxChecked?.(true);
  }, [treeData, onChange, setSelectAllCheckboxChecked]);

  /**
   * 默认标题渲染
   */
  const defaultTitleRender = useCallback((node: PlantTreeDatum) => {
    return (
      <span className={styles.treeNode}>
        <span className={styles.treeNodeTitle}>{node.nodeName}</span>
      </span>
    );
  }, []);

  return (
    <div className={clx(styles.editableContainer, className)} style={style}>
      <div className={styles.searchHeader}>
        <AntInput
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          className={styles.searchInput}
          allowClear
        />
      </div>
      <div className={styles.treeContainer}>
        <AntSpin spinning={loading}>
          {treeData?.length === 0 ? (
            <AntEmpty />
          ) : (
            <AntTree
              checkable
              showLine
              checkStrictly={true}
              treeData={treeData as unknown as DataNode[]}
              checkedKeys={selectedKeys}
              onCheck={handleTreeCheck}
              height={window?.innerHeight - 430 || 550}
              fieldNames={{
                title: 'nodeName',
                children: 'children',
                key: 'nodeId',
              }}
              titleRender={(node) => defaultTitleRender(node)}
              className={styles.tree}
            />
          )}
        </AntSpin>
      </div>
      <div className={styles.footer}>
        <span>Select All</span>
        <AntCheckbox
          onClick={handleSelectAll}
          className={styles.selectAllCheckbox}
          checked={selectAllCheckboxChecked}
        />
      </div>
    </div>
  );
};

export default OrgTreeSelector;
