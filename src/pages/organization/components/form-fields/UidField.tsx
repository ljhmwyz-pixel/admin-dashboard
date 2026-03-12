import React from 'react';
import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';

// import { useLanguage } from '@shared/hooks';
import { FormInput } from '@/components';

type UidFieldProps = FieldProps & { canEdit?: boolean };

const UidField: React.FC<UidFieldProps> = ({ canEdit = true }) => {
  return (
    <AntCol span={12}>
      <FormInput
        name="uid"
        label="Uid"
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.59961 8.39961L2.8925 13.1067C2.70497 13.2943 2.45061 13.3996 2.1854 13.3996H0.699609C0.644381 13.3996 0.599609 13.3548 0.599609 13.2996V11.8138C0.599609 11.5486 0.704966 11.2943 0.892503 11.1067L5.59961 6.39961M3.99961 7.99961L2.99961 6.99961M1.99961 9.99961L0.999611 8.99961M13.3996 4.59961C13.3996 6.80875 11.6088 8.59961 9.39961 8.59961C7.19047 8.59961 5.39961 6.80875 5.39961 4.59961C5.39961 2.39047 7.19047 0.599609 9.39961 0.599609C11.6088 0.599609 13.3996 2.39047 13.3996 4.59961ZM9.89961 4.59961C9.89961 4.87575 9.67575 5.09961 9.39961 5.09961C9.12347 5.09961 8.89961 4.87575 8.89961 4.59961C8.89961 4.32347 9.12347 4.09961 9.39961 4.09961C9.67575 4.09961 9.89961 4.32347 9.89961 4.59961Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          placeholder: 'Uid',
          maxLength: 254,
          disabled: !canEdit,
        }}
      />
    </AntCol>
  );
};

export default UidField;
