import { useEffect } from 'react';
import { AddressPickerAutoComplete } from '@pages/organization/components';
import type { FieldProps, VerifyOrganization } from '@pages/organization/dto';
import { AntCol, AntForm, AntInput } from '@shared/components';
import { useLanguage } from '@shared/hooks';

type OrgAddressFieldProps = FieldProps & {
  verifyResult: VerifyOrganization;
  canEdit?: boolean;
};

export default function OrgAddressField({
  form,
  verifyResult,
  canEdit = true,
}: OrgAddressFieldProps) {
  const { t } = useLanguage();
  useEffect(() => {
    if (!verifyResult?.isCountryInScope) {
      form.setFields([
        {
          name: 'orgAddress',
          errors: ['Please select correct country/region to create organization.'],
        },
      ]);
    }
  }, [verifyResult, form]);
  return (
    <AntCol span={12}>
      <AddressPickerAutoComplete
        form={form}
        placeholder={t('org.placeholder.select_org_address')}
        fieldMap={{
          address: 'orgAddress',
          lat: 'lat',
          lng: 'lng',
          country: 'country',
          countryCode: 'countryCode',
          province: 'province',
          city: 'city',
          district: 'district',
          postalCode: 'postalCode',
          route: 'route',
          streetNumber: 'streetNumber',
        }}
        canEdit={canEdit}
        onResolved={(loc) => {
          form.setFields([
            {
              name: 'orgAddress',
              value: loc.displayAddress,
            },
            {
              name: 'lat',
              value: loc.lat,
            },
            {
              name: 'lng',
              value: loc.lng,
            },
            {
              name: 'country',
              value: loc.country,
            },
            {
              name: 'countryCode',
              value: loc.countryCode,
            },
            {
              name: 'province',
              value: loc.province,
            },
            {
              name: 'city',
              value: loc.city,
            },
            {
              name: 'district',
              value: loc.district,
            },
            {
              name: 'postalCode',
              value: loc.postalCode,
            },
            {
              name: 'route',
              value: loc.route,
            },
            {
              name: 'streetNumber',
              value: loc.streetNumber,
            },
          ]);
        }}
      />

      {/* 隐藏字段：按需保留 */}
      <AntForm.Item name="lat" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="lng" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="country" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="countryCode" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="province" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="city" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="district" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="postalCode" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="route" hidden>
        <AntInput />
      </AntForm.Item>
      <AntForm.Item name="streetNumber" hidden>
        <AntInput />
      </AntForm.Item>
    </AntCol>
  );
}
