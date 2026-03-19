import React, { useState } from 'react';

import { AntTree } from '@/shared/components';
import type { TreeProps } from '@/shared/components/antd-imports';

import styles from './TreeCheckList.module.scss';

export interface TreeItem {
  permissionId: string;
  permissionName: string;
  children?: TreeItem[];
  checked?: boolean;
  indeterminate?: boolean;
}

interface TreeCheckListProps {
  data: TreeItem[];
  checkedKeys?: string[]; // 支持受控模式
  hideCheckbox?: boolean; // 是否隐藏复选框
  onChange?: (checkedKeys: string[]) => void;
}

const TreeCheckList: React.FC<TreeCheckListProps> = ({
  data,
  checkedKeys: parentCheckedKeys,
  hideCheckbox = false,
  onChange,
}) => {
  const [internalCheckedKeys, setInternalCheckedKeys] = useState<string[]>([]);
  const [userExpandedKeys, setUserExpandedKeys] = useState<string[]>([]);

  // 如果父组件传递了 checkedKeys，则使用父组件的值（受控模式），否则使用内部状态
  const checkedKeys = parentCheckedKeys !== undefined ? parentCheckedKeys : internalCheckedKeys;

  // 计算所有需要展开的 key
  const getAllKeys = (items: TreeItem[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodes: TreeItem[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          keys.push(node.permissionId);
          traverse(node.children);
        }
      });
    };
    traverse(items);
    return keys;
  };

  // 首次渲染时展开所有节点，之后使用用户控制的状态
  const expandedKeys = userExpandedKeys.length > 0 ? userExpandedKeys : getAllKeys(data);

  // 将数据转换为 Ant Design Tree 需要的格式
  const transformData = (items: TreeItem[]): any[] => {
    return items.map((item) => ({
      key: item.permissionId,
      title: <span className={styles.treeNodeTitle}>{item.permissionName}</span>,
      children: item.children ? transformData(item.children) : null,
      isLeaf: !item.children || item.children.length === 0,
    }));
  };

  const handleCheck: TreeProps['onCheck'] = (checkedKeys) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys.map(String) : [];
    if (parentCheckedKeys === undefined) {
      // 非受控模式，更新内部状态
      setInternalCheckedKeys(keys);
    }
    onChange?.(keys);
  };

  const handleExpand: TreeProps['onExpand'] = (expanded) => {
    // 用户手动展开/折叠后，保存用户的选择
    setUserExpandedKeys(expanded as string[]);
  };

  const treeData = transformData(data);

  return (
    <div className={`${styles.treeCheckList} ${hideCheckbox ? styles.hideCheckbox : ''}`}>
      <AntTree
        checkable={!hideCheckbox}
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
        onExpand={handleExpand}
        treeData={treeData}
        showIcon={false}
        blockNode
        showLine
        expandedKeys={expandedKeys}
      />
    </div>
  );
};

export default TreeCheckList;
