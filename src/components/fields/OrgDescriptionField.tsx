import React from 'react';

import { FormTextArea } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgDescriptionFieldProps = FieldProps & { canEdit: boolean };

const OrgDescriptionField: React.FC<OrgDescriptionFieldProps> = ({ form, canEdit = true }) => {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value || '';

    // 长度限制：最多 400 个字符
    if (value.length <= 400) {
      form.setFieldValue('orgDescription', value);
    }
  };

  return (
    <AntCol span={24}>
      <FormTextArea
        name="orgDescription"
        label={t('org.field.comment')}
        inputProps={{
          disabled: !canEdit,
          autoSize: { minRows: 6, maxRows: 8 },
          placeholder: t('org.placeholder.enter_comment'),
          maxLength: 400,
          onChange: handleChange,
        }}
      />
    </AntCol>
  );
};

export default OrgDescriptionField;
