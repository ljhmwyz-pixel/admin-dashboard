import React from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { containsEmoji } from '@/shared/utils/organizationUtil';

import type { FieldProps } from './types';

type OrgEmailFieldProps = FieldProps;

const OrgEmailField: React.FC<OrgEmailFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormInput
        name="orgEmail"
        label={t('org.field.email')}
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
              d="M1.49951 2.49999L6.29241 7.49295C6.68293 7.88348 7.31609 7.88348 7.70662 7.49295L12.4995 2.49999M2.59961 12.2H11.3996C12.5042 12.2 13.3996 11.3046 13.3996 10.2V3.79999C13.3996 2.69542 12.5042 1.79999 11.3996 1.79999H2.59961C1.49504 1.79999 0.599609 2.69542 0.599609 3.79999V10.2C0.599609 11.3046 1.49504 12.2 2.59961 12.2Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          placeholder: t('org.placeholder.enter_email'),
          maxLength: 254,
          required: true,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgEmail') || '';
              if (value.trim() && !containsEmoji(value)) {
                form.validateFields(['orgEmail']);
              } else {
                form.setFields([
                  {
                    name: 'orgEmail',
                    errors: [t('org.placeholder.enter_email')],
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

export default OrgEmailField;
