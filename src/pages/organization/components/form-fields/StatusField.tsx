import type { FieldProps } from '@pages/organization/dto';
import { AntCol } from '@shared/components';

// import { useLanguage } from '@shared/hooks';
import { FormSelect } from '@/components';

type StatusFieldProps = FieldProps & {
  canEdit?: boolean;
};

const StatusField: React.FC<StatusFieldProps> = ({ form, canEdit = true }) => {
  // const { t } = useLanguage();

  return (
    <AntCol span={12}>
      <FormSelect
        name="status"
        label="Status"
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.59961 13.3996H12.3996M7.49961 5.49963H10.4996M2.59961 10.3996H11.3996C12.5042 10.3996 13.3996 9.50418 13.3996 8.39961V2.59961C13.3996 1.49504 12.5042 0.599609 11.3996 0.599609H2.59961C1.49504 0.599609 0.599609 1.49504 0.599609 2.59961V8.39961C0.599609 9.50418 1.49504 10.3996 2.59961 10.3996ZM5.49961 5.49963C5.49961 6.05192 5.0519 6.49963 4.49961 6.49963C3.94733 6.49963 3.49961 6.05192 3.49961 5.49963C3.49961 4.94735 3.94733 4.49963 4.49961 4.49963C5.0519 4.49963 5.49961 4.94735 5.49961 5.49963Z"
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
          options: [],
          placeholder: 'status',
          onChange: (value) => {
            form.setFieldsValue({ role: value });
          },
        }}
      />
    </AntCol>
  );
};

export default StatusField;
