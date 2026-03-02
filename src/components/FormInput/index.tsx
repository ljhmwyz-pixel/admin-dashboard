import React from 'react';
import { Form, Input } from 'antd';
import type { Rule } from 'antd/es/form';

import styles from './index.module.scss';

interface FormInputProps {
  name: string;
  label: string;
  icon?: React.ReactNode;
  mode?: 'view' | 'edit';
  rules?: Rule[];
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  icon,
  mode = 'view',
  rules = [],
  placeholder,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </div>

      {mode === 'edit' ? (
        <Form.Item name={name} rules={rules} noStyle>
          <Input className={styles.input} placeholder={placeholder} />
        </Form.Item>
      ) : (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => (
            <div className={styles.valueBox}>{getFieldValue(name) || '-'}</div>
          )}
        </Form.Item>
      )}
    </div>
  );
};

export default FormInput;
