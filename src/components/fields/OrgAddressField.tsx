import React, { useEffect } from 'react';
import { Col, Form, Input } from 'antd';

import type { VerifyOrganization } from '@/shared/types/organization';

import AddressPickerAutoComplete from './AddressPickerAutoComplete';
// import { useLanguage } from '@/shared/hooks/useLanguage';
import type { FieldProps } from './types';

type OrgAddressFieldProps = FieldProps & {
  verifyResult: VerifyOrganization;
};

export default function OrgAddressField({ form, verifyResult }: OrgAddressFieldProps) {
  // const { t } = useLanguage();
  useEffect(() => {
    if (verifyResult?.isScope) {
      form.setFields([
        {
          name: 'orgAddress',
          errors: ['Please select correct country/region to create organization.'],
        },
      ]);
    }
  }, [verifyResult]);
  return (
    <Col span={12}>
      <AddressPickerAutoComplete
        form={form}
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
        onResolved={(loc) => {
          console.log('resolved location:', loc);
          form.setFields([
            {
              name: 'orgAddress',
              value: loc.formattedAddress,
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
      <Form.Item name="lat" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="lng" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="country" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="countryCode" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="province" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="city" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="district" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="postalCode" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="route" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="streetNumber" hidden>
        <Input />
      </Form.Item>
    </Col>
  );
}
