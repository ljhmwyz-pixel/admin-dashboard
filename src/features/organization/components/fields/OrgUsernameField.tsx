import React from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { containsEmoji } from '@/shared/utils/organizationUtil';

import type { FieldProps } from './types';

type OrgUsernameFieldProps = FieldProps;

const OrgUsernameField: React.FC<OrgUsernameFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormInput
        name="orgUsername"
        label={t('org.field.username')}
        required
        prefixIcon={
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3996 8.82503H3.74961C2.00991 8.82503 0.599609 10.2353 0.599609 11.975C0.599609 12.8449 1.30476 13.55 2.17461 13.55H11.9746C12.8445 13.55 13.5496 12.8449 13.5496 11.975C13.5496 11.1761 13.2522 10.4466 12.762 9.89135M10.1371 3.66251C10.1371 5.35388 8.76598 6.72501 7.07461 6.72501C5.38324 6.72501 4.01211 5.35388 4.01211 3.66251C4.01211 1.97113 5.38324 0.600006 7.07461 0.600006C8.76598 0.600006 10.1371 1.97113 10.1371 3.66251Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          placeholder: t('org.placeholder.enter_username'),
          maxLength: 254,
          required: true,
          disabled: true,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgUsername') || '';
              if (value.trim() && !containsEmoji(value)) {
                form.validateFields(['orgUsername']);
              } else {
                form.setFields([
                  {
                    name: 'orgUsername',
                    errors: [t('org.placeholder.enter_username')],
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

export default OrgUsernameField;
