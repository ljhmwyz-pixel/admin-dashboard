import React, { useCallback, useEffect, useState } from 'react';
import { DeleteConfirmInput, TreeNodeTitle } from '@pages/organization/components';
import type { TreeNodeData } from '@pages/organization/dto';
import { deleteOrganization } from '@pages/organization/services/organizationService';
import { AntInput, AntSpin, AntTree } from '@shared/components';
import { PermissionCode } from '@shared/constants/permissions';
import { useLanguage } from '@shared/hooks';
import { usePermission } from '@shared/hooks/usePermission';
import { debounce } from 'lodash-es';

import { useThemeModal } from '@/components/Modal';

import styles from './OrganizationTree.module.scss';

interface OrganizationTreeProps {
  onSelect?: (selectedKey: string) => void;
  selectedKey?: string;
  onAdd?: (node: TreeNodeData) => void;
  onDelete?: (node: TreeNodeData, onFila: () => void, onSuccess: () => void) => void;
  onExpand?: (keys: React.Key[]) => void;
  expandedKeys?: React.Key[];
  treeData: TreeNodeData[];
  loadData: (searchKeyword?: string) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setSelectedKey: (key: string) => void;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  onSelect,
  selectedKey = '',
  onAdd,
  onDelete,
  onExpand,
  expandedKeys = [],
  treeData,
  loadData,
  loading,
  setLoading,
  setSelectedKey,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useLanguage();
  const { warning, confirm } = useThemeModal();
  const { hasPermission } = usePermission();
  // 初始化加载数据
  useEffect(() => {
    loadData().then(() => {
      setLoading(false);
    });
  }, [loadData, setLoading]);

  // 处理展开/收起（使用外部传入的回调）
  const handleExpand = useCallback(
    (keys: React.Key[]) => {
      onExpand?.(keys);
    },
    [onExpand],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (onSelect) {
        onSelect('');
      }
      setLoading(true);
      await loadData(value);
      setLoading(false);
    }, 1000),
    [],
  );

  // 处理搜索框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (hasPermission(PermissionCode.ORG_DETAIL)) {
      if (selectedKeys.length > 0) {
        const key = selectedKeys[0] as string;
        onSelect?.(key);
      }
    }
  };

  // 处理节点添加事件 - 调用外部回调
  const handleNodeAdd = (nodeData: TreeNodeData) => {
    onAdd?.(nodeData);
  };

  // 处理节点删除事件
  const handleNodeDelete = async (nodeData: TreeNodeData) => {
    onDelete?.(
      nodeData,
      () => {
        warning({
          title: 'Sub-Organizations Exists !',
          content: t('org.error.sub_org_exists.content'),
        });
      },
      () => {
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
            if (confirmValue === nodeData.key) {
              try {
                await deleteOrganization(nodeData.key);
                await loadData();
                if (selectedKey === nodeData.key) {
                  setSelectedKey('');
                }
              } catch (err) {
                console.error('Delete organization failed:', err);
              }
            }
          },
        });
      },
    );
  };

  return (
    <AntSpin spinning={loading} className={styles.organizationTreeLoading}>
      <div className={styles.organizationTree}>
        <div className={styles.treeSearch}>
          <AntInput
            className={styles.treeSearchInput}
            prefixCls={styles.treeSearchIcon}
            name="search"
            placeholder={t('org.validation.name.required')}
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
        <div className={styles.organizationTreeSearch}>
          <div className={styles.treeContainer}>
            <AntTree
              className={styles.organizationTree}
              treeData={treeData}
              onSelect={handleTreeSelect}
              selectedKeys={[selectedKey]}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
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
        </div>
      </div>
    </AntSpin>
  );
};

export default OrganizationTree;
