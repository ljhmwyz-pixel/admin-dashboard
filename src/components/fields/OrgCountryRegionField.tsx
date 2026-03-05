import React, { useEffect, useState } from 'react';
import { Form } from 'antd';

import { FormSelect } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgCountryRegionFieldProps = FieldProps;

const OrgCountryRegionField: React.FC<OrgCountryRegionFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  // 使用 Form.useWatch 监听字段变化
  const country = Form.useWatch('country', form);
  const city = Form.useWatch('city', form);

  useEffect(() => {
    if (country && city) {
      form.setFieldValue('orgCountryRegion', `${country}/${city}`);
    }
  }, [country, city, form]);

  return (
    <AntCol span={12}>
      <FormSelect
        name="orgCountryRegion"
        label={t('org.field.country_region')}
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.99951 1.99997L4.44742 3.44788C4.77189 3.77235 4.83389 4.276 4.59781 4.66948L4.10364 5.49309C3.7868 6.02115 4.01797 6.70735 4.58974 6.93606L4.788 7.01536C5.39896 7.25975 5.61142 8.01742 5.21661 8.54384L2.99951 11.5M8.99951 0.999969L8.24441 2.88774C8.09584 3.25915 8.18291 3.68337 8.46578 3.96623L9.30365 4.80411C9.43181 4.93227 9.52273 5.09285 9.56669 5.26868L9.7756 6.10434C9.90205 6.61013 10.3959 6.93391 10.9101 6.8482L12.9995 6.49997M6.49951 13L7.30962 10.9747C7.42887 10.6766 7.68404 10.4538 7.99556 10.376L9.03775 10.1154C9.32989 10.0424 9.63939 10.1049 9.88029 10.2856L11.4995 11.5M13.3996 6.99998C13.3996 10.5346 10.5342 13.4 6.99961 13.4C3.46499 13.4 0.599609 10.5346 0.599609 6.99998C0.599609 3.46535 3.46499 0.599976 6.99961 0.599976C10.5342 0.599976 13.3996 3.46535 13.3996 6.99998Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        required
        selectProps={{
          disabled: true,
          placeholder: t('org.placeholder.select_country_region'),
        }}
      />
    </AntCol>
  );
};

export default OrgCountryRegionField;
