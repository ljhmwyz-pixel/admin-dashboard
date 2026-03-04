import React from 'react';

import { FormSelect } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgCountryRegionFieldProps = FieldProps & {
  countryOptions?: Array<{ value: string; label: string }>;
};

const OrgCountryRegionField: React.FC<OrgCountryRegionFieldProps> = ({
  form,
  countryOptions = [],
}) => {
  const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormSelect
        name="orgCountryRegion"
        label={t('org.field.country_region')}
        required
        // rules={[{ required: true, message: t('org.validation.country.required') }]}
        selectProps={{
          disabled: true,
          options: countryOptions,
          placeholder: t('org.placeholder.select_country_region'),
        }}
      />
    </AntCol>
  );
};

export default OrgCountryRegionField;
