import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { TreeNodeData } from '@pages/organization/dto';
import { getParentNode } from '@pages/organization/utils';
import { Tag, Tooltip } from 'antd';

import { FormButton, FormDrawer, FormInput, FormTabs, FormTextArea, Table } from '@/components';
import {
  type GetOrgRoleDetailReq,
  type GetOrgRoleDetailRes,
  type GetOrgRolePermissionReq,
  type GetOrgRolePermissionRes,
  OrgRoleApi,
} from '@/services/modules/organization/organizationRoleApi';
import { AntTag, AntTooltip } from '@/shared/components';
import { AntCol, AntForm, AntRow } from '@/shared/components';
import { useLanguage } from '@/shared/hooks';

import OrganizationInfo from '../../organization-info/OrganizationInfo';
import RolePermissions from './RolePermissions';

import styles from './AddRole.module.scss';

export interface AddRoleRef<T = any> {
  open: (record?: T, opt?: 'add' | 'edit' | 'view') => Promise<T | undefined>;
  close: () => void;
  submit: () => void;
}

interface AddRoleProps<T = any> {
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  title?: string;
  width?: number | string;
  destroyOnClose?: boolean;
  onOk?: (values: any, record?: T) => void;
}

const AddRole = forwardRef<AddRoleRef, AddRoleProps>((props, ref) => {
  const { currentParentNode, treeData, width = '1130', destroyOnClose = true, onOk } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opt, setOpt] = useState<'add' | 'edit' | 'view'>('add');
  const [form] = AntForm.useForm();
  const [activeTabKey, setActiveTabKey] = useState<string>('Infomation');
  const recordRef = useRef<AddRoleRef>(null);
  const [currentRecord, setCurrentRecord] = useState<{ roleId?: string } | null>(null);
  const resolverRef = useRef<((val?: any) => void) | null>(null);
  const { t } = useLanguage();
  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;
  // 获取角色权限
  const getRolePermission = async () => {
    setLoading(true);
    try {
      // const reqParams: GetOrgRolePermissionReq = {
      //   roleId,
      // };
      // const {
      //   data: { current, records, size },
      // }: GetOrgRolePermissionRes = await OrgRoleApi.getOrgRolePermission(reqParams);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取角色详情
  const getRoleDetail = async (roleId: string) => {
    setLoading(true);
    try {
      const reqParams: GetOrgRoleDetailReq = {
        roleId,
      };
      const { data }: GetOrgRoleDetailRes = await OrgRoleApi.getOrgRoleDetail(reqParams);
      setActiveTabKey('Infomation');
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    open(record = null, opt = 'add') {
      setOpt(opt);
      if (record) {
        recordRef.current = record;
        setCurrentRecord(record);
        // 获取角色详情
        getRoleDetail(record.roleId);
      }
      // 获取角色权限
      getRolePermission();
      setOpen(true);
      return new Promise((resolve) => {
        resolverRef.current = resolve;
      });
    },

    close() {
      setOpen(false);
    },

    submit() {
      form.submit();
    },
  }));

  /**
   * 保存提交
   */
  const handleFinish = async () => {
    form.validateFields().then((values) => {
      onOk?.(values);
    });
  };

  /**
   * 表单内容
   */
  const formFields = () => (
    <div className={styles.formFields}>
      <AntRow gutter={30}>
        <AntCol span={12}>
          <FormInput
            name="roleName"
            label={t('role.col.name')}
            rules={[{ required: true, message: 'Please enter a role name' }]}
            inputProps={{
              placeholder: 'Please enter a role name',
              disabled: opt === 'view',
            }}
            prefixIcon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3996 8.82512H3.74961C2.00991 8.82512 0.599609 10.2354 0.599609 11.9751C0.599609 12.845 1.30476 13.5501 2.17461 13.5501H11.9746C12.8445 13.5501 13.5496 12.845 13.5496 11.9751C13.5496 11.1762 13.2522 10.4467 12.762 9.89144M10.1371 3.6626C10.1371 5.35397 8.76598 6.7251 7.07461 6.7251C5.38324 6.7251 4.01211 5.35397 4.01211 3.6626C4.01211 1.97123 5.38324 0.600098 7.07461 0.600098C8.76598 0.600098 10.1371 1.97123 10.1371 3.6626Z"
                  stroke="#191B1F"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </AntCol>
        {(opt === 'view' || opt === 'edit') && (
          <AntCol span={12}>
            <FormInput
              name="status"
              label={t('role.col.status')}
              inputProps={{
                disabled: opt === 'view' || opt === 'edit',
              }}
              prefixIcon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.59961 13.4001H12.3996M7.49961 5.50012H10.4996M2.59961 10.4001H11.3996C12.5042 10.4001 13.3996 9.50467 13.3996 8.4001V2.6001C13.3996 1.49553 12.5042 0.600098 11.3996 0.600098H2.59961C1.49504 0.600098 0.599609 1.49553 0.599609 2.6001V8.4001C0.599609 9.50467 1.49504 10.4001 2.59961 10.4001ZM5.49961 5.50012C5.49961 6.05241 5.0519 6.50012 4.49961 6.50012C3.94733 6.50012 3.49961 6.05241 3.49961 5.50012C3.49961 4.94784 3.94733 4.50012 4.49961 4.50012C5.0519 4.50012 5.49961 4.94784 5.49961 5.50012Z"
                    stroke="#191B1F"
                    strokeOpacity="0.6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </AntCol>
        )}
      </AntRow>
      {(opt === 'view' || opt === 'edit') && (
        <AntRow gutter={30}>
          <AntCol span={12}>
            <FormInput
              name="memberCount"
              label={t('role.col.members')}
              inputProps={{
                disabled: opt === 'view' || opt === 'edit',
              }}
              prefixIcon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.99961 12.2001V12.8001H9.19961V12.2001H8.59961H7.99961ZM0.99961 12.2001V12.8001H2.19961V12.2001H1.59961H0.99961ZM11.7996 12.2001V12.8001H12.9996V12.2001H12.3996H11.7996ZM4.79961 4.40012C4.79961 4.73149 5.06824 5.00012 5.39961 5.00012C5.73098 5.00012 5.99961 4.73149 5.99961 4.40012H5.39961H4.79961ZM0.599609 12.8001C0.268239 12.8001 -0.000390649 13.0687 -0.000390649 13.4001C-0.000390649 13.7315 0.268239 14.0001 0.599609 14.0001V13.4001V12.8001ZM13.3996 14.0001C13.731 14.0001 13.9996 13.7315 13.9996 13.4001C13.9996 13.0687 13.731 12.8001 13.3996 12.8001V13.4001V14.0001ZM8.59961 10.3001H7.99961V12.2001H8.59961H9.19961V10.3001H8.59961ZM1.59961 12.2001H2.19961V10.3001H1.59961H0.99961V12.2001H1.59961ZM5.09961 6.80013V7.40013C6.70124 7.40013 7.99961 8.6985 7.99961 10.3001H8.59961H9.19961C9.19961 8.03576 7.36398 6.20013 5.09961 6.20013V6.80013ZM5.09961 6.80013V6.20013C2.83524 6.20013 0.99961 8.03576 0.99961 10.3001H1.59961H2.19961C2.19961 8.6985 3.49798 7.40013 5.09961 7.40013V6.80013ZM12.3996 4.1001H11.7996V12.2001H12.3996H12.9996V4.1001H12.3996ZM5.39961 4.40012H5.99961V4.1001H5.39961H4.79961V4.40012H5.39961ZM8.89961 0.600098V1.2001C10.5012 1.2001 11.7996 2.49847 11.7996 4.1001H12.3996H12.9996C12.9996 1.83573 11.164 9.76324e-05 8.89961 9.76324e-05V0.600098ZM8.89961 0.600098V9.76324e-05C6.63524 9.76324e-05 4.79961 1.83573 4.79961 4.1001H5.39961H5.99961C5.99961 2.49847 7.29798 1.2001 8.89961 1.2001V0.600098ZM0.599609 13.4001V14.0001H13.3996V13.4001V12.8001H0.599609V13.4001Z"
                    fill="#191B1F"
                    fillOpacity="0.6"
                  />
                </svg>
              }
            />
          </AntCol>
        </AntRow>
      )}
      <AntRow gutter={30}>
        <AntCol span={24}>
          <FormTextArea
            name="description"
            label={t('role.col.description')}
            inputProps={{
              placeholder: 'Please enter description',
              disabled: opt === 'view',
            }}
            prefixIcon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.599609 13.4001H13.3995M4.38626 11.3704L7.26394 9.76071C7.42117 9.67277 7.55172 9.54398 7.64179 9.38797L10.9813 3.60385C11.5335 2.64726 11.2058 1.42408 10.2492 0.871799C9.29262 0.319514 8.06944 0.647265 7.51715 1.60385L4.17769 7.38797C4.08761 7.54398 4.04136 7.72143 4.04381 7.90156L4.08864 11.1985C4.0907 11.3501 4.25399 11.4444 4.38626 11.3704Z"
                  stroke="#191B1F"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </AntCol>
      </AntRow>
      <AntRow gutter={30}>
        <RolePermissions />
      </AntRow>
    </div>
  );
  // 获取更新记录
  const getRoleLog = async () => {
    setLoading(true);
    try {
      const reqParams: any = {
        roleId: currentRecord?.roleId,
      };
      // const { data }: any = await OrgRoleApi.getOrgRoleDetail(reqParams);
      //   setActiveTabKey('Infomation');
      //   if (data) {
      //     form.setFieldsValue(data);
      //   } else {
      //     form.resetFields();
      //   }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTabKey === 'Record' && currentRecord?.roleId) {
      getRoleLog();
    }
  }, [activeTabKey, currentRecord?.roleId]);

  // Tab内容配置
  const tabItems = [
    {
      key: 'Infomation',
      label: <div className={styles.tabItems}>{t('role.info.title')}</div>,
      children: formFields(),
    },
    {
      key: 'Record',
      label: <div className={styles.tabItems}>{t('role.record.title')}</div>,
      children: (
        <div className={styles.recordContainer}>
          <Table
            rowKey="key"
            columns={[
              {
                title: 'No.',
                dataIndex: 'no',
                width: 70,
              },
              {
                title: 'Change Type',
                dataIndex: 'type',
                width: 140,
                render: (type: any) => {
                  const map: any = {
                    add: { color: 'green', text: 'Add' },
                    modify: { color: 'blue', text: 'Modify' },
                    delete: { color: 'red', text: 'Deleted' },
                  };

                  return <AntTag color={map[type].color}>{map[type].text}</AntTag>;
                },
              },
              {
                title: 'Changed By',
                dataIndex: 'changedBy',
                width: 180,
              },
              {
                title: 'Changed Content',
                dataIndex: 'content',
                ellipsis: true,
                render: (text: string) => (
                  <AntTooltip title={text}>
                    <div style={{ maxWidth: 420 }}>{text}</div>
                  </AntTooltip>
                ),
              },
              {
                title: 'Changed Time',
                dataIndex: 'time',
                width: 200,
                render: (_: any, record) => (
                  <div>
                    <div>{record.time}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>{record.date}</div>
                  </div>
                ),
              },
            ]}
            dataSource={[
              {
                key: '1',
                no: 1,
                type: 'delete',
                changedBy: 'USR-H6Q8-T9W3',
                content: 'Delete Role',
                time: '09:11:12 UTC+08:00',
                date: '2026/01/22',
              },
              {
                key: '2',
                no: 2,
                type: 'modify',
                changedBy: 'USR-H6Q8-T9W3',
                content: 'Update: Role Name, [Organization Admin] → [Admin]; Add Permissions: ...',
                time: '09:11:12 UTC+08:00',
                date: '2026/01/22',
              },
              {
                key: '3',
                no: 3,
                type: 'add',
                changedBy: 'USR-H6Q8-T9W3',
                content:
                  'Update: Role Name, [Organization Admin] → [Admin]\nAdd Permissions: [Web] → [Role Management]\nRemove Permissions: [App] → [All]',
                time: '09:11:12 UTC+08:00',
                date: '2026/01/22',
              },
              {
                key: '4',
                no: 4,
                type: 'delete',
                changedBy: 'USR-H6Q8-T9W3',
                content: 'Delete Role',
                time: '09:11:12 UTC+08:00',
                date: '2026/01/22',
              },
            ]}
            pagination={false}
          />
        </div>
      ),
    },
  ];

  return (
    <FormDrawer
      title={
        opt === 'view'
          ? t('role.info.title')
          : opt === 'edit'
            ? t('role.edit.title')
            : t('role.add.title')
      }
      open={open}
      onClose={() => setOpen(false)}
      destroyOnHidden={destroyOnClose}
      size={width}
      loading={loading}
      styles={() => {
        return {
          body: { padding: 0 },
        };
      }}
      footer={
        <div className={styles.footer}>
          <FormButton color="default" onClick={() => setOpen(false)}>
            {t('common.action.cancel')}
          </FormButton>
          <FormButton color="primary" variant="solid" onClick={handleFinish}>
            {t('common.action.confirm')}
          </FormButton>
        </div>
      }
    >
      <AntForm form={form} layout="vertical">
        {/* 组织基本信息 */}
        {parentNode && (
          <OrganizationInfo
            orgName={parentNode?.title}
            orgType={parentNode?.type}
            orgId={parentNode?.key}
          />
        )}
        {/* Infomation和Record */}
        {opt === 'view' ? (
          <FormTabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={tabItems}
            className={styles.antTabs}
          />
        ) : (
          <div className={styles.formContainer}>{formFields()}</div>
        )}
      </AntForm>
    </FormDrawer>
  );
});
AddRole.displayName = 'AddRole';
export default AddRole;
