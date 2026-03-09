import { useMemo } from 'react';

import { FormSelect } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgTypeFieldProps = FieldProps & {
  parentOrgType?: string;
  canEdit?: boolean;
};

const OrgTypeField: React.FC<OrgTypeFieldProps> = ({ form, parentOrgType, canEdit = true }) => {
  const { t } = useLanguage();

  const availableOptions = useMemo(() => {
    let options: { value: string; label: string }[] = [];
    switch (parentOrgType) {
      case 'PYLONTECH':
        options = [
          { value: 'Dealer', label: 'Dealer' },
          { value: 'Installer', label: 'Installer' },
          { value: 'Owner', label: 'Owner' },
          { value: 'Guest', label: 'Guest' },
        ];
        break;
      case 'DEALER':
      case 'INSTALLER':
        options = [
          { value: 'Dealer', label: 'Dealer' },
          { value: 'Installer', label: 'Installer' },
        ];
        break;
      case 'OWNER':
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
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.4993 8.14587H8.99789C8.51445 8.14587 8.12255 8.53793 8.12255 9.02156V12.5243C8.12255 13.0079 8.51445 13.4 8.99789 13.4H12.4993C12.9827 13.4 13.3746 13.0079 13.3746 12.5243V10.7729M1.47495 9.64204H4.97632C5.45976 9.64204 5.85166 9.24998 5.85166 8.76636V5.26362C5.85166 4.77999 5.45976 4.38794 4.97632 4.38794H1.47495C0.991513 4.38794 0.599609 4.77999 0.599609 5.26362V8.76636C0.599609 9.00583 0.695703 9.22286 0.85142 9.38095C1.01017 9.54212 1.2309 9.64204 1.47495 9.64204ZM9.0229 5.85408H12.5243C13.0077 5.85408 13.3996 5.46202 13.3996 4.9784V1.47566C13.3996 0.992033 13.0077 0.599976 12.5243 0.599976H9.0229C8.53946 0.599976 8.14756 0.992033 8.14756 1.47566V4.9784C8.14756 5.46202 8.53946 5.85408 9.0229 5.85408Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        rules={[{ required: true, message: t('org.validation.type.required') }]}
        selectProps={{
          disabled: !canEdit,
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
