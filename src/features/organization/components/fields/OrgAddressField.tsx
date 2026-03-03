import React from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgAddressFieldProps = FieldProps;

const OrgAddressField: React.FC<OrgAddressFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormInput
        name="orgAddress"
        label={t('org.field.address')}
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
              d="M5.49963 7H3.49951C2.39494 7 1.49951 7.89543 1.49951 9V13.4H5.49963M7.99963 4.5H10.4995M0.599609 13.4H13.3995M12.4995 13.4V2.60001C12.4995 1.49544 11.6041 0.600006 10.4995 0.600006H7.99963C6.89506 0.600006 5.99963 1.49544 5.99963 2.60001V13.4H12.4995Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          placeholder: t('org.placeholder.select_org_address'),
          maxLength: 254,
          required: true,
          suffix: (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.99951 9.33939C1.12347 9.7671 0.599609 10.3097 0.599609 10.9C0.599609 12.2807 3.46499 13.4 6.99961 13.4C10.5342 13.4 13.3996 12.2807 13.3996 10.9C13.3996 10.3096 12.8757 9.76702 11.9995 9.33929"
                stroke="#33C2C8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M11 4.60001C11 6.80915 7 11 7 11C7 11 3 6.80915 3 4.60001C3 2.39087 4.79086 0.600006 7 0.600006C9.20914 0.600006 11 2.39087 11 4.60001Z"
                stroke="#191B1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M7.39961 4.40003C7.39961 4.62094 7.22052 4.80003 6.99961 4.80003C6.7787 4.80003 6.59961 4.62094 6.59961 4.40003C6.59961 4.17912 6.7787 4.00003 6.99961 4.00003C7.22052 4.00003 7.39961 4.17912 7.39961 4.40003Z"
                stroke="#191B1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgAddress') || '';
              if (value.trim()) {
                form.validateFields(['orgAddress']);
              } else {
                form.setFields([
                  {
                    name: 'orgAddress',
                    errors: [t('org.placeholder.select_org_address')],
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

export default OrgAddressField;
