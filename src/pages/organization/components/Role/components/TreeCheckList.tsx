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
  onChange?: (checkedKeys: string[]) => void;
}

const TreeCheckList: React.FC<TreeCheckListProps> = ({
  data,
  checkedKeys: parentCheckedKeys,
  onChange,
}) => {
  const [internalCheckedKeys, setInternalCheckedKeys] = useState<string[]>([]);

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

  const expandedKeys = getAllKeys(data);

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

  const treeData = transformData(data);

  return (
    <div className={`${styles.treeCheckList} ${styles.customCheckbox}`}>
      <AntTree
        checkable
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
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
