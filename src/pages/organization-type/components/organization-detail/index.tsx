import React, { useCallback, useState } from 'react';
import { useLanguage } from '@shared/hooks/useLanguage';
import type { OrganizationTypeItem } from '@shared/types/organizationType';
import { message, Modal } from 'antd';

import { FormTabs } from '@/components';
import { FormButton, FormDrawer } from '@/components';
import { useThemeModal } from '@/components/Modal';
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import OrganizationDataTable from '../organization-data-table';
import OrganizationPermissionTable from '../organization-permission-table';
import OrganizationRecordTable from '../organization-record-table';

import styles from './index.module.scss';

interface OrganizationTypeDetailProps {
  visible: boolean;
  organizationType: OrganizationTypeItem;
  isDefaultEditMode: boolean;
  onCancel: () => void;
}

const OrganizationTypeDetail: React.FC<OrganizationTypeDetailProps> = ({
  visible,
  organizationType,
  isDefaultEditMode,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState('permissions'); // 当前选中的Tab
  const [isEditMode, setIsEditMode] = useState(isDefaultEditMode);
  const [hasChanges, setHasChanges] = useState(false); // 是否有未保存的修改
  const [functionalPermissions, setFunctionalPermissions] = useState<any[]>([]); // 功能权限修改数据
  const [dataPermissions, setDataPermissions] = useState<any[]>([]); // 数据权限修改数据
  const [loading, setLoading] = useState(false); // 保存时的loading状态
  const { t } = useLanguage();

  // 处理功能权限修改数据
  const handleFunctionalPermissionsChange = useCallback((data: any) => {
    // 转换数据格式为API需要的格式
    const formattedData = Object.entries(data)
      .map(([key, value]: [string, any]) => {
        // 从key中提取permissionCode
        const permissionCode = key.split('-').pop() || key;

        // 根据实际data中给的scope来处理
        return Object.entries(value).map(([scope, accessLevel]) => ({
          permissionCode,
          scope,
          accessLevel,
        }));
      })
      .flat();

    setFunctionalPermissions(formattedData);
  }, []);

  // 处理数据权限修改数据
  const handleDataPermissionsChange = useCallback((data: any) => {
    // 转换数据格式为API需要的格式
    const formattedData = Object.entries(data).map(([dataPermissionCode, levels]) => ({
      dataPermissionCode,
      levels,
    }));

    setDataPermissions(formattedData);
  }, []);
  const { success: ModalSuccess } = useThemeModal();
  // 处理保存
  const handleSave = async () => {
    if (!organizationType) return;
    try {
      setLoading(true);

      // 构建请求数据
      const requestData = {
        functionalPermissions,
        dataPermissions,
      };

      // 调用API保存权限配置
      await organizationTypeApi.updateOrganizationTypePermissions(
        organizationType.typeCode,
        requestData,
      );
      ModalSuccess({
        content: '保存成功',
      });
      message.success('保存成功');
      setHasChanges(false);
      setIsEditMode(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消修改
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };
  // 处理修改
  const handleModify = () => {
    setIsEditMode(true);
  };

  // 处理取消
  const handleCancel = () => {
    if (hasChanges) {
      // 提示用户有未保存的数据
      Modal.confirm({
        title: '确认取消',
        content: '您有未保存的修改，确定要取消吗？',
        onOk: () => {
          onCancel();
        },
        onCancel: () => {},
      });
    } else {
      onCancel();
    }
  };

  // 处理子组件的修改通知
  const handleHasChanges = useCallback((changes: boolean) => {
    // 只要有一个子组件有修改，就设置为有修改
    setHasChanges(changes);
  }, []);
  // Tab内容配置
  const tabItems = [
    {
      key: 'permissions',
      label: <div className={styles.tabItems}>Permissions</div>,
      children: (
        <OrganizationPermissionTable
          isEditMode={isEditMode}
          typeCode={organizationType.typeCode}
          onHasChanges={handleHasChanges}
          onGetModifiedData={handleFunctionalPermissionsChange}
        />
      ),
    },
    {
      key: 'data',
      label: <div className={styles.tabItems}>Data</div>,
      children: (
        <OrganizationDataTable
          isEditMode={isEditMode}
          typeCode={organizationType.typeCode}
          onHasChanges={handleHasChanges}
          onGetModifiedData={handleDataPermissionsChange}
        />
      ),
    },
    {
      key: 'record',
      label: <div className={styles.tabItems}>Record</div>,
      children: <OrganizationRecordTable typeCode={organizationType.typeCode} />,
    },
  ];

  return (
    <FormDrawer
      title={organizationType.typeName}
      className={styles.drawer}
      size="60%"
      placement="right"
      closable={{ placement: 'end' }}
      open={visible}
      onClose={onCancel}
      styles={{
        body: { padding: '0px', display: 'flex', flexDirection: 'column' },
      }}
      footerAbsolute={true}
      footer={
        <div className={styles.footerDiv}>
          {isEditMode ? (
            <>
              <FormButton color="default" onClick={handleCancelEdit}>
                {t('common.action.cancel')}
              </FormButton>
              <FormButton color="primary" variant="solid" onClick={handleSave} loading={loading}>
                {t('common.action.save')}
              </FormButton>
            </>
          ) : (
            <>
              <FormButton color="default" onClick={handleCancel}>
                {t('common.action.cancel')}
              </FormButton>
              <FormButton color="primary" onClick={handleModify}>
                {t('common.action.modify')}
              </FormButton>
            </>
          )}
        </div>
      }
    >
      <FormTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className={styles.antTabs}
      />
    </FormDrawer>
  );
};

export default OrganizationTypeDetail;
