import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';

// import { useLanguage } from '@shared/hooks';
import { FormSelect } from '@/components';

type RoleFieldProps = FieldProps & {
  canEdit?: boolean;
  required?: boolean;
  options?: { value: string; label: string }[];
  span?: number;
  onChange?: (value: string[]) => void;
};

const RoleField: React.FC<RoleFieldProps> = ({
  form,
  canEdit = true,
  required = false,
  options = [],
  span = 12,
  onChange,
}) => {
  // const { t } = useLanguage();

  return (
    <AntCol span={span}>
      <FormSelect
        name="role"
        label="Role"
        required={required}
        rules={required ? [{ required: true, message: 'Please select a role!' }] : []}
        prefixIcon={
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3996 8.82463H3.74961C2.00991 8.82463 0.599609 10.2349 0.599609 11.9746C0.599609 12.8445 1.30476 13.5496 2.17461 13.5496H11.9746C12.8445 13.5496 13.5496 12.8445 13.5496 11.9746C13.5496 11.1757 13.2522 10.4463 12.762 9.89095M10.1371 3.66211C10.1371 5.35348 8.76598 6.72461 7.07461 6.72461C5.38324 6.72461 4.01211 5.35348 4.01211 3.66211C4.01211 1.97074 5.38324 0.599609 7.07461 0.599609C8.76598 0.599609 10.1371 1.97074 10.1371 3.66211Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        selectProps={{
          disabled: !canEdit,
          mode: 'multiple',
          options: options,
          placeholder: 'role',
          onChange: (value) => {
            if (value?.length) {
              form.setFields([
                {
                  name: 'role',
                  errors: [],
                },
              ]);
              form.setFieldsValue({ role: value });
              onChange?.(value);
            } else {
              form.setFields([
                {
                  name: 'role',
                  errors: ['Please select at least one role'],
                },
              ]);
            }
          },
        }}
      />
    </AntCol>
  );
};

export default RoleField;
