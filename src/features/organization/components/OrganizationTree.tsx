import React, { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';

import { FormModal } from '@/components';
import { AntInput, AntTree, DeleteConfirmInput } from '@/shared/components/antd-imports';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { TreeNodeData } from '@/shared/types/organization';

import {
  deleteOrganization,
  loadOrganizationData,
  validateDeleteOrganization,
} from '../services/organizationService';
import AddOrganizationDrawer from './AddOrganizationDrawer';
import TreeNodeTitle from './TreeNodeTitle';

import styles from './OrganizationTree.module.scss';

interface OrganizationTreeProps {
  onSelect?: (selectedKey: string) => void;
  selectedKey?: string;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({ onSelect, selectedKey = '' }) => {
  const { withLoading, showLoading, hideLoading } = useGlobalLoading();
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [currentParentNode, setCurrentParentNode] = useState<TreeNodeData>({} as TreeNodeData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const initializedRef = useRef(false);
  const loadingRef = useRef(false);
  const { t } = useLanguage();
  const { warning, confirm } = FormModal();

  const loadData = useCallback(
    async (searchKeyword?: string) => {
      await loadOrganizationData({
        searchKeyword,
        withLoading,
        setData: (data) => {
          setTreeData(data);
          setExpandedKeys([]);
          initializedRef.current = true;
          loadingRef.current = false;
        },
      }).catch(() => {
        loadingRef.current = false;
      });
    },
    [withLoading],
  );

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      setCurrentParentNode({} as TreeNodeData);
      if (onSelect) {
        onSelect('');
      }
      await loadData(value);
    }, 1000),
    [loadData, onSelect],
  );

  useEffect(() => {
    if (initializedRef.current || loadingRef.current) {
      return;
    }
    loadingRef.current = true;

    loadData();
  }, []);

  // 处理搜索框变化（带防抖）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // 使用防抖函数进行搜索
    debouncedSearch(value);
  };

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    console.log('Selected Keys:', selectedKeys);
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      if (onSelect) {
        onSelect(key);
      }
    }
  };

  // 处理节点添加事件
  const handleNodeAdd = (nodeData: TreeNodeData) => {
    setCurrentParentNode(nodeData);
    setAddDrawerVisible(true);
  };

  const handleNodeDelete = async (nodeData: TreeNodeData) => {
    try {
      // 步骤 1：先进行删除验证
      const validationResult = await validateDeleteOrganization(nodeData.key, withLoading);

      if (!validationResult.canDelete) {
        warning({
          title: 'Sub-Organizations Exists !',
          content: t('org.error.sub_org_exists.content'),
        });
        return;
      }

      // 步骤 2：验证通过，显示确认对话框
      let confirmValue = '';

      const modalInstance = confirm({
        title: 'Confirm Deletion !',
        content: (
          <DeleteConfirmInput
            placeholder="Please enter organization code"
            onChange={(value) => {
              confirmValue = value;
              if (modalInstance) {
                modalInstance.update({
                  okButtonProps: {
                    danger: true,
                    disabled: value !== nodeData.key,
                    className: styles.okConfirm,
                  },
                });
              }
            }}
            confirmText="Are you sure delete this organization? This action cannot be undone."
            nodeData={nodeData}
          />
        ),
        okText: t('common.action.delete'),
        cancelText: t('common.action.cancel'),
        okButtonProps: {
          danger: true,
          disabled: true,
        },
        onOk: async () => {
          try {
            if (confirmValue === nodeData.key) {
              showLoading();
              await deleteOrganization(nodeData.key);
              await loadData();
            }
          } catch (error) {
            console.error('Delete operation failed:', error);
          } finally {
            hideLoading();
          }
        },
      });
    } catch (error) {
      console.error('Delete validation failed:', error);
    }
  };

  return (
    <div className={styles.organizationTree}>
      <div className={styles.treeSearch}>
        <AntInput
          className={styles.treeSearchInput}
          prefixCls={styles.treeSearchIcon}
          name="search"
          placeholder={t('role.placeholder.search')}
          variant="filled"
          prefix={
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.6001 13.6L10.1001 10.1M11.6001 6.1C11.6001 9.13757 9.13766 11.6 6.1001 11.6C3.06253 11.6 0.600098 9.13757 0.600098 6.1C0.600098 3.06243 3.06253 0.6 6.1001 0.6C9.13766 0.6 11.6001 3.06243 11.6001 6.1Z"
                stroke="#191B1F"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          value={searchValue}
          onChange={handleInputChange}
          allowClear
        />
      </div>
      <div className={styles.organizationTreeSearch} />
      <div className={styles.treeContainer}>
        <AntTree
          className={styles.organizationTree}
          treeData={treeData}
          onSelect={handleTreeSelect}
          selectedKeys={[selectedKey]}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          showLine
          height={(window && window?.innerHeight - 74) || 400}
          blockNode
          virtual
          titleRender={(nodeData: TreeNodeData) => (
            <TreeNodeTitle
              nodeData={nodeData}
              onNodeAdd={handleNodeAdd}
              onNodeDelete={handleNodeDelete}
            />
          )}
        />
      </div>
      {/* 添加组织抽屉 */}
      <AddOrganizationDrawer
        currentParentNode={currentParentNode}
        visible={addDrawerVisible}
        onChange={(visible) => setAddDrawerVisible(visible)}
        loadData={loadData}
      />
    </div>
  );
};

export default OrganizationTree;
