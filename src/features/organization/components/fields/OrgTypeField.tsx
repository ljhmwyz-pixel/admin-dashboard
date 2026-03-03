import React, { useEffect, useMemo, useState } from 'react';

import { FormSelect } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgTypeFieldProps = FieldProps & {
  parentOrgType?: string;
};

const OrgTypeField: React.FC<OrgTypeFieldProps> = ({ form, parentOrgType }) => {
  const { t } = useLanguage();

  const availableOptions = useMemo(() => {
    let options: { value: string; label: string }[] = [];
    switch (parentOrgType) {
      case 'Pylontech':
        options = [
          { value: 'Dealer', label: 'Dealer' },
          { value: 'Installer', label: 'Installer' },
          { value: 'Owner', label: 'Owner' },
          { value: 'Guest', label: 'Guest' },
          { value: 'BD', label: 'BD' },
        ];
        break;
      case 'Dealer':
      case 'Installer':
        options = [
          { value: 'Dealer', label: 'Dealer' },
          { value: 'Installer', label: 'Installer' },
        ];
        break;
      case 'Owner':
        options = [{ value: 'Owner', label: 'Owner' }];
        break;
      default:
        options = [{ value: 'Installer', label: 'Installer' }];
    }
    return options;
  }, [parentOrgType]);

  return (
    <AntCol span={12}>
      <FormSelect
        name="orgType"
        label={t('org.field.type')}
        required
        selectProps={{
          options: availableOptions,
          placeholder: t('org.placeholder.select_org_type'),
          onChange: (value) => {
            form.setFieldsValue({ orgType: value });
          },
        }}
      />
    </AntCol>
  );
};

export default OrgTypeField;
