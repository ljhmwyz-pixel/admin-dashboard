import React from 'react';

import { FormTextArea } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgDescriptionFieldProps = FieldProps;

const OrgDescriptionField: React.FC<OrgDescriptionFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={24}>
      <FormTextArea
        name="orgDescription"
        label={t('org.field.comment')}
        inputProps={{
          placeholder: t('org.placeholder.enter_comment'),
        }}
      />
    </AntCol>
  );
};

export default OrgDescriptionField;
