import React from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { containsEmoji } from '@/shared/utils/organizationUtil';

import type { FieldProps } from './types';

type OrgPostalCodeFieldProps = FieldProps;

const OrgPostalCodeField: React.FC<OrgPostalCodeFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormInput
        name="orgPostalCode"
        label={t('org.field.postal_code')}
        required
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.99951 9.33939C1.12347 9.7671 0.599609 10.3097 0.599609 10.9C0.599609 12.2807 3.46499 13.4 6.99961 13.4C10.5342 13.4 13.3996 12.2807 13.3996 10.9C13.3996 10.3096 12.8757 9.76702 11.9995 9.33929M10.9996 4.60001C10.9996 6.80915 6.99963 11 6.99963 11C6.99963 11 2.99963 6.80915 2.99963 4.60001C2.99963 2.39087 4.79049 0.600006 6.99963 0.600006C9.20877 0.600006 10.9996 2.39087 10.9996 4.60001ZM7.39961 4.40003C7.39961 4.62094 7.22052 4.80003 6.99961 4.80003C6.7787 4.80003 6.59961 4.62094 6.59961 4.40003C6.59961 4.17912 6.7787 4.00003 6.99961 4.00003C7.22052 4.00003 7.39961 4.17912 7.39961 4.40003Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          placeholder: t('org.placeholder.enter_postal_code'),
          maxLength: 254,
          required: true,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgPostalCode') || '';
              if (value.trim() && !containsEmoji(value)) {
                form.validateFields(['orgPostalCode']);
              } else {
                form.setFields([
                  {
                    name: 'orgPostalCode',
                    errors: [t('org.placeholder.enter_postal_code')],
                  },
                ]);
              }
            }, 0);
          },
        }}
      />
    </AntCol>
  );
};

export default OrgPostalCodeField;
