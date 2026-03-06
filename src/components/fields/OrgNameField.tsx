import React, { useEffect } from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { VerifyOrganization } from '@/shared/types/organization';
import { containsEmoji } from '@/shared/utils/organizationUtil';

import type { FieldProps } from './types';

type OrgNameFieldProps = FieldProps & { verifyResult: VerifyOrganization };

const OrgNameField: React.FC<OrgNameFieldProps> = ({
  form,
  verifyResult = {} as VerifyOrganization,
}) => {
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value || '';
    form.setFields([
      {
        name: 'orgName',
        errors: [],
      },
    ]);

    // 前端拦截超长输入（超过 254 字符不允许继续输入）
    if (value.length > 254) {
      value = value.slice(0, 254);
    }

    form.setFieldValue('orgName', value);
  };

  useEffect(() => {
    if (verifyResult?.isOrganizationExists) {
      form.setFields([
        {
          name: 'orgName',
          errors: [t('org.validation.name.required')],
        },
      ]);
    }
    if (verifyResult?.isOrganizationSimilar)
      form.setFields([
        {
          name: 'orgName',
          errors: [t('org.dialog.similar_org.content')],
        },
      ]);
  }, [verifyResult]);

  return (
    <AntCol span={12}>
      <FormInput
        name="orgName"
        label={t('org.field.name')}
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
        rules={[{ required: true, message: t('org.validation.name.required') }]}
        inputProps={{
          placeholder: t('org.placeholder.search_org'),
          maxLength: 254,
          onChange: handleInputChange,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgName') || '';

              // 未输入或为空，显示错误
              if (!value || value.trim() === '') {
                form.setFields([
                  {
                    name: 'orgName',
                    errors: [t('org.validation.name.invalid_chars')],
                  },
                ]);
                return;
              }

              // 检查是否包含 emoji
              const hasEmoji = containsEmoji(value);
              if (hasEmoji) {
                form.setFields([
                  {
                    name: 'orgName',
                    errors: [t('org.validation.name.invalid_chars')],
                  },
                ]);
                return;
              }

              // 所有校验通过，清除错误状态
              form.setFields([
                {
                  name: 'orgName',
                  errors: [],
                },
              ]);
            }, 0);
          },
        }}
      />
    </AntCol>
  );
};

export default OrgNameField;
