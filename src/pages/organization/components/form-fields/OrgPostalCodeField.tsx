import React from 'react';
import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';
import { useLanguage } from '@shared/hooks';

import { FormInput } from '@/components';

type OrgPostalCodeFieldProps = FieldProps & { canEdit?: boolean };

const OrgPostalCodeField: React.FC<OrgPostalCodeFieldProps> = ({ form, canEdit = true }) => {
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value || '';
    value = value.toUpperCase();

    // 前端拦截超长输入（超过 12 字符不允许继续输入）
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    form.setFieldValue('orgPostalCode', value);
  };

  return (
    <AntCol span={12}>
      <FormInput
        name="orgPostalCode"
        label={t('org.field.postal_code')}
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
        rules={[
          {
            pattern: /^[0-9A-Z\s-]{3,12}$/,
            message: t('org.validation.postal.required'),
          },
        ]}
        inputProps={{
          disabled: !canEdit,
          placeholder: t('org.placeholder.enter_postal_code'),
          maxLength: 12,
          onChange: handleInputChange,
          onBlur: () => {
            setTimeout(() => {
              const value = form.getFieldValue('orgPostalCode') || '';

              // 完全没输入（空字符串），设置为空
              if (!value || value.trim() === '') {
                form.setFieldValue('orgPostalCode', '');
                return;
              }

              // 输入了但长度<3，显示格式错误
              if (value.length < 3) {
                form.setFields([
                  {
                    name: 'orgPostalCode',
                    errors: [t('org.validation.postal.required')],
                  },
                ]);
                return;
              }

              // 检查是否包含不允许的字符（只允许数字 0-9，大写字母 A-Z，空格，-）
              const hasInvalidChars = /[^0-9A-Z\s-]/.test(value);
              if (hasInvalidChars) {
                form.setFields([
                  {
                    name: 'orgPostalCode',
                    errors: [t('org.validation.postal.required')],
                  },
                ]);
                return;
              }

              // 所有校验通过，清除错误状态
              form.setFields([
                {
                  name: 'orgPostalCode',
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

export default OrgPostalCodeField;
