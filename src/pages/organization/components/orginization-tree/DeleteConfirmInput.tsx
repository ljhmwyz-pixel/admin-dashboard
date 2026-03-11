import React, { useState } from 'react';
import type { TreeNodeData } from '@pages/organization/dto';
import { AntInput } from '@shared/components';
import { useLanguage } from '@shared/hooks';
import classNames from 'classnames';

import styles from './DeleteConfirmInput.module.scss';

interface DeleteConfirmInputProps {
  /** 输入值变化时的回调 */
  onChange?: (value: string) => void;
  /** 输入框的 placeholder */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;

  confirmText?: string;
  nodeData?: TreeNodeData;
}

/**
 * 删除确认输入框组件
 * 用户需要输入组织名称来确认删除操作
 */
const DeleteConfirmInput: React.FC<DeleteConfirmInputProps> = ({
  onChange,
  placeholder,
  disabled = false,
  className = '',
  confirmText = '',
  nodeData = {} as TreeNodeData,
}) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange?.(value);
  };

  return (
    <div className={classNames(styles.deleteConfirmInput, className)}>
      <div className={styles.confirmText}>{confirmText}</div>
      <div className={styles.confirmContent}>
        <div className={styles.confirmItems}>
          <div className={styles.confirmItem}>
            <span>{t('org.field.name')}</span>
            <span className={styles.confirmItemValue}>{nodeData.title}</span>
          </div>
          <div className={styles.confirmItem}>
            <span>{t('org.field.code')}</span>
            <span className={styles.confirmItemValue}>{nodeData.key}</span>
          </div>
        </div>
      </div>
      <AntInput
        value={inputValue}
        name="confirmCode"
        onChange={handleChange}
        placeholder={placeholder || t('org.dialog.confirm_delete.placeholder.code')}
        disabled={disabled}
        className={styles.input}
        size="large"
      />
    </div>
  );
};

export default DeleteConfirmInput;
