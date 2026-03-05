import React, { useEffect } from 'react';
import { Col, Form, Input } from 'antd';

import type { VerifyOrganization } from '@/shared/types/organization';

import AddressPickerAutoComplete from './AddressPickerAutoComplete';
import type { FieldProps } from './types';

type OrgAddressFieldProps = FieldProps & { verifyResult: VerifyOrganization };

export default function OrgAddressField({ form, verifyResult }: OrgAddressFieldProps) {
  return (
    <Col span={12}>
      <Form.Item label="地址">
        <AddressPickerAutoComplete
          form={form}
          fieldMap={{
            address: 'address',
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
          }}
        />
      </Form.Item>

      {/* 隐藏字段：按需保留 */}
      <Form.Item name="address" hidden>
        <Input />
      </Form.Item>
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
