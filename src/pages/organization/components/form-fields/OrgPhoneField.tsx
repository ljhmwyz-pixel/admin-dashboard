import React, { useEffect } from 'react';
import type { FieldProps, VerifyOrganization } from '@pages/organization/dto';
import { AntCol } from '@shared/components';
import { useLanguage } from '@shared/hooks';

import { FormInput } from '@/components';

type OrgPhoneFieldProps = FieldProps & {
  existingPhone?: string;
  verifyResult?: VerifyOrganization;
  canEdit?: boolean;
  span?: number;
  required?: boolean;
};

const OrgPhoneField: React.FC<OrgPhoneFieldProps> = ({
  form,
  existingPhone,
  verifyResult = {} as VerifyOrganization,
  canEdit = true,
  span = 12,
  required = false,
}) => {
  const { t } = useLanguage();

  const handleBlur = () => {
    setTimeout(() => {
      const value = form.getFieldValue('orgPhone') || '';

      // 非必填，未输入时不显示错误
      if (!value || value.trim() === '') {
        form.setFields([
          {
            name: 'orgPhone',
            errors: [],
          },
        ]);
        return;
      }

      // 检查是否包含非数字字符（只允许 0-9）
      const hasInvalidChars = /[^0-9]/.test(value);
      if (hasInvalidChars) {
        form.setFields([
          {
            name: 'orgPhone',
            errors: [t('org.validation.phone.invalid')],
          },
        ]);
        return;
      }

      // 长度限制：最多 16 个字符
      if (value.length > 16) {
        form.setFields([
          {
            name: 'orgPhone',
            errors: [t('org.validation.phone.invalid')],
          },
        ]);
        return;
      }

      // 所有校验通过，清除错误状态
      form.setFields([
        {
          name: 'orgPhone',
          errors: [],
        },
      ]);
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';

    // type="number" 可能允许输入 e、+、- 等字符，需要额外过滤
    // 只保留数字 0-9
    const onlyNumbers = value.replace(/[^0-9]/g, '');

    // 长度不超过 16 位
    if (onlyNumbers.length <= 16) {
      form.setFieldValue('orgPhone', onlyNumbers);
    }
  };

  useEffect(() => {
    if (existingPhone) {
      form.setFieldValue('orgPhone', existingPhone);
    } else {
      form.setFieldValue('orgPhone', '');
    }
  }, [existingPhone, form]);

  useEffect(() => {
    if (verifyResult.isPhoneExists) {
      form.setFields([
        {
          name: 'orgPhone',
          errors: [t('org.validation.phone.invalid')],
        },
      ]);
    }
  }, [verifyResult.isPhoneExists, form, t]);

  return (
    <AntCol span={span}>
      <FormInput
        name="orgPhone"
        label={t('org.field.phone')}
        required={required}
        prefixIcon={
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.11873 1.02108C2.68016 0.459647 3.59043 0.459647 4.15187 1.02108L4.69219 1.5614C5.33177 2.20098 5.33177 3.23795 4.69219 3.87752C4.11177 4.45795 4.05067 5.37839 4.54929 6.03043L5.20198 6.88394C5.75239 7.60371 6.39591 8.24723 7.11567 8.79764L7.96918 9.45032C8.62123 9.94894 9.54167 9.88785 10.1221 9.30743C10.7617 8.66785 11.7986 8.66785 12.4382 9.30743L12.9785 9.84775C13.54 10.4092 13.54 11.3195 12.9785 11.8809L12.7281 12.1313C11.3406 13.5188 9.19361 13.8002 7.49545 12.817C4.87578 11.3004 2.69922 9.12383 1.18257 6.50417C0.199422 4.80601 0.480769 2.65904 1.86827 1.27154L2.11873 1.02108Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        rules={
          required
            ? [
                {
                  required: true,
                  message: 'error msg',
                },
              ]
            : []
        }
        inputProps={{
          type: 'text',
          inputMode: 'numeric',
          placeholder: t('org.placeholder.enter_phone'),
          maxLength: 16,
          disabled: !!existingPhone || !canEdit,
          onChange: handleChange,
          onBlur: handleBlur,
        }}
      />
    </AntCol>
  );
};

export default OrgPhoneField;
