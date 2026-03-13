import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { FormDrawer } from '@/components';
import { AntForm } from '@/shared/components';

export interface AddRoleRef<T = any> {
  open: (record?: T) => Promise<T | undefined>;
  close: () => void;
  submit: () => void;
}

interface AddRoleProps<T = any> {
  title?: string;
  width?: number | string;
  onSuccess?: (values: T, record?: T) => void;
  destroyOnClose?: boolean;
}

const AddRole = forwardRef<AddRoleRef, AddRoleProps>((props, ref) => {
  const { title = '', width = '60%', onSuccess, destroyOnClose = true } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = AntForm.useForm();

  const recordRef = useRef<AddRoleRef>(null);
  const resolverRef = useRef<((val?: any) => void) | null>(null);

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

  return (
    <FormDrawer
      title={title}
      open={open}
      onClose={() => setOpen(false)}
      destroyOnHidden={destroyOnClose}
      size={width}
      loading={loading}
      //   onOk={() => form.submit()}
    >
      <AntForm form={form} onFinish={handleFinish}>
        {/* form items */}
      </AntForm>
    </FormDrawer>
  );
});
AddRole.displayName = 'AddRole';
export default AddRole;
