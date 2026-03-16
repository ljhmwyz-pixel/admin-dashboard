import React from 'react';
import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';
import { useLanguage } from '@shared/hooks';

import { FormInput } from '@/components';

type ApplyReasonFieldProps = FieldProps & { canEdit?: boolean; span?: number };

const ApplyReasonField: React.FC<ApplyReasonFieldProps> = ({ canEdit = true, span = 12 }) => {
  const { t } = useLanguage();

  return (
    <AntCol span={span}>
      <FormInput
        name="applyReason"
        label={'Request Description'}
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.599609 13.4001H13.3995M4.38626 11.3704L7.26394 9.76071C7.42117 9.67277 7.55172 9.54398 7.64179 9.38797L10.9813 3.60385C11.5335 2.64726 11.2058 1.42408 10.2492 0.871799C9.29262 0.319514 8.06944 0.647265 7.51715 1.60385L4.17769 7.38797C4.08761 7.54398 4.04136 7.72143 4.04381 7.90156L4.08864 11.1985C4.0907 11.3501 4.25399 11.4444 4.38626 11.3704Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        inputProps={{
          disabled: !canEdit,
          placeholder: 'On site service',
        }}
      />
    </AntCol>
  );
};

export default ApplyReasonField;
