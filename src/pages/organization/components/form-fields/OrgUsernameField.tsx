import React, { useEffect } from 'react';
import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';
import { useLanguage } from '@shared/hooks';

import { FormInput } from '@/components';

type OrgUsernameFieldProps = FieldProps & {
  existingUsername?: string;
  canEdit?: boolean;
  required?: boolean;
};

const OrgUsernameField: React.FC<OrgUsernameFieldProps> = ({
  form,
  existingUsername,
  canEdit,
  required = true,
}) => {
  const { t } = useLanguage();

  const handleBlur = () => {
    setTimeout(() => {
      const value = form.getFieldValue('orgUsername') || '';

      form.setFieldValue('orgUsername', value);
    }, 0);
  };
  useEffect(() => {
    if (existingUsername) {
      form.setFieldValue('orgUsername', existingUsername);
    } else {
      form.setFieldValue('orgUsername', '');
    }
  }, [existingUsername, form]);

  return (
    <AntCol span={12}>
      <FormInput
        name="orgUsername"
        label={t('org.field.username')}
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
        rules={required ? [{ required: true, message: t('org.placeholder.enter_username') }] : []}
        inputProps={{
          placeholder: t('org.placeholder.enter_username'),
          maxLength: 100,
          disabled: !!existingUsername || !canEdit,
          onBlur: handleBlur,
        }}
      />
    </AntCol>
  );
};

export default OrgUsernameField;
