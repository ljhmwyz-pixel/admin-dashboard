import React, { useState } from 'react';
import type { CheckboxProps, TreeProps } from 'antd';
import { Checkbox, Tree } from 'antd';

import styles from './TreeCheckList.module.scss';

export interface TreeItem {
  id: string;
  title: string;
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

  // 将数据转换为 Ant Design Tree 需要的格式
  const transformData = (items: TreeItem[]): any[] => {
    return items.map((item) => ({
      key: item.id,
      title: <span className={styles.treeNodeTitle}>{item.title}</span>,
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
      <Tree
        checkable
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
        treeData={treeData}
        showIcon={false}
        blockNode
        showLine
        defaultExpandAll
      />
    </div>
  );
};

export default TreeCheckList;
