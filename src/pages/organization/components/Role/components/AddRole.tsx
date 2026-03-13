import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { TreeNodeData } from '@pages/organization/dto';
import { getParentNode } from '@pages/organization/utils';

import { FormDrawer, FormInput, FormTabs } from '@/components';
import { AntCol, AntForm, AntRow } from '@/shared/components';

import OrganizationInfo from '../../organization-info/OrganizationInfo';

import styles from './AddRole.module.scss';

export interface AddRoleRef<T = any> {
  open: (record?: T) => Promise<T | undefined>;
  close: () => void;
  submit: () => void;
}

interface AddRoleProps<T = any> {
  currentParentNode: TreeNodeData;
  treeData: TreeNodeData[];
  title?: string;
  width?: number | string;
  onSuccess?: (values: T, record?: T) => void;
  destroyOnClose?: boolean;
}

const AddRole = forwardRef<AddRoleRef, AddRoleProps>((props, ref) => {
  const {
    currentParentNode,
    treeData,
    title = '',
    width = '60%',
    onSuccess,
    destroyOnClose = true,
  } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = AntForm.useForm();
  const [activeTabKey, setActiveTabKey] = useState<string>('Infomation');
  const recordRef = useRef<AddRoleRef>(null);
  const resolverRef = useRef<((val?: any) => void) | null>(null);
  // 获取父节点信息
  const parentNode =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  useImperativeHandle(ref, () => ({
    open(record) {
      recordRef.current = record;

      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }

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

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);

      // 这里可以放请求
      await new Promise((r) => setTimeout(r, 800));

      onSuccess?.(values, recordRef.current);

      resolverRef.current?.(values);

      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Tab内容配置
  const tabItems = [
    {
      key: 'Infomation',
      label: <div className={styles.tabItems}>Infomation</div>,
      children: (
        <div className={styles.formFields}>
          <AntRow gutter={30}>
            <AntCol span={12}>
              <FormInput
                name="xx"
                label="Role Name"
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
            <AntCol span={12}>
              <FormInput
                name="xxx"
                label="Status"
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
          </AntRow>
        </div>
      ),
    },
    {
      key: 'Record',
      label: <div className={styles.tabItems}>Record</div>,
      children: <div>Record</div>,
    },
  ];

  return (
    <FormDrawer
      title={title}
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
      // onOk={() => form.submit()}
    >
      <AntForm form={form} layout="vertical" onFinish={handleFinish}>
        {/* 组织基本信息 */}
        {parentNode && (
          <OrganizationInfo
            orgName={parentNode?.title}
            orgType={parentNode?.type}
            orgId={parentNode?.key}
          />
        )}
        {/* Infomation和Record */}
        <FormTabs
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          items={tabItems}
          className={styles.antTabs}
        />
      </AntForm>
    </FormDrawer>
  );
});
AddRole.displayName = 'AddRole';
export default AddRole;
