import React, { useEffect } from 'react';

import { FormInput } from '@/components';
import { AntCol } from '@/shared/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import type { FieldProps } from './types';

type OrgEmailFieldProps = FieldProps & {
  onCheckEmailExists?: (email: string, withGlobalLoading?: boolean) => void;
  userExists?: boolean;
};
// 邮箱格式正则：^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const OrgEmailField: React.FC<OrgEmailFieldProps> = ({ form, onCheckEmailExists, userExists }) => {
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';

    form.setFieldValue('orgEmail', value);
  };

  const handleCheckEmailExists = (e: React.MouseEvent) => {
    e.stopPropagation();
    const value = form.getFieldValue('orgEmail') || '';

    // 先进行基础格式校验
    const hasInvalidChars = /[^A-Za-z0-9._%+\-@]/.test(value);
    const isValidFormat = EMAIL_PATTERN.test(value);

    if (hasInvalidChars || !isValidFormat || !value || value.trim() === '') {
      form.setFields([
        {
          name: 'orgEmail',
          errors: [t('org.placeholder.enter_email')],
        },
      ]);
      return;
    }

    // 格式校验通过后才调用外部验证
    if (onCheckEmailExists) {
      onCheckEmailExists(value, true);
    }
  };

  useEffect(() => {
    if (userExists) {
      form.setFields([
        {
          name: 'orgEmail',
          errors: [t('org.validation.email.exists')],
        },
      ]);
    }
  }, [userExists]);

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
        rules={[
          { required: true, message: t('org.validation.email.required') },
          { pattern: EMAIL_PATTERN, message: t('org.validation.email.required') },
        ]}
        inputProps={{
          suffix: (
            <span
              onClick={handleCheckEmailExists}
              style={{ color: '#33C2C8', fontSize: '14px', cursor: 'pointer' }}
            >
              Check Email
            </span>
          ),
          placeholder: t('org.placeholder.enter_email'),
          maxLength: 254,
          onChange: handleInputChange,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgEmail') || '';

              // 检查是否包含不允许的字符
              const hasInvalidChars = /[^A-Za-z0-9._%+\-@]/.test(value);
              // 检查邮箱格式是否正确
              const isValidFormat = EMAIL_PATTERN.test(value);
              if (hasInvalidChars || !isValidFormat || !value || value.trim() === '') {
                form.setFields([
                  {
                    name: 'orgEmail',
                    errors: [t('org.placeholder.enter_email')],
                  },
                ]);
                return;
              }
              form.setFields([
                {
                  name: 'orgEmail',
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

export default OrgEmailField;
