import React, { useState } from 'react';
import type { Member, TreeNodeData } from '@pages/organization/dto';
import { AntInput } from '@shared/components';
import { useLanguage } from '@shared/hooks';
import classNames from 'classnames';

import styles from './DeleteConfirmInput.module.scss';

interface DeleteConfirmInputProps {
  /** 输入值变化时的回调 */
  onChange?: (value: string) => void;
  /** 输入值变化时的回调 */
  onTextAreaChange?: (value: string) => void;
  /** 输入框的 placeholder */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;

  confirmText?: string;
  nodeData?: TreeNodeData;
  member?: Member;
  showInput?: boolean;
  showUid?: boolean;
  showTextArea?: boolean;
  textAreaPlaceholder?: string;
}

/**
 * 删除确认输入框组件
 * 用户需要输入组织名称来确认删除操作
 */
const DeleteConfirmInput: React.FC<DeleteConfirmInputProps> = ({
  onChange,
  onTextAreaChange,
  textAreaPlaceholder,
  placeholder,
  disabled = false,
  className = '',
  confirmText = '',
  nodeData = {} as TreeNodeData,
  member,
  showInput = true,
  showUid = true,
  showTextArea = false,
}) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange?.(value);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);
    onTextAreaChange?.(value);
  };

  return (
    <div className={classNames(styles.deleteConfirmInput, className)}>
      <div className={styles.confirmText}>{confirmText}</div>
      <div className={styles.confirmContent}>
        <div className={styles.confirmItems}>
          {nodeData.title && (
            <div className={styles.confirmItem}>
              <span>{t('org.field.name')}</span>
              <span className={styles.confirmItemValue}>{nodeData.title}</span>
            </div>
          )}
          {nodeData.key && (
            <div className={styles.confirmItem}>
              <span>{t('org.field.code')}</span>
              <span className={styles.confirmItemValue}>{nodeData.key}</span>
            </div>
          )}
          {member?.username && (
            <div className={styles.confirmItem}>
              <span>{t('org.field.username')}</span>
              <span className={styles.confirmItemValue}>{member.username}</span>
            </div>
          )}
          {member?.userId && showUid && (
            <div className={styles.confirmItem}>
              <span>{'UID'}</span>
              <span className={styles.confirmItemValue}>{member.userId}</span>
            </div>
          )}
          {member?.roleList && member.roleList.length > 0 && (
            <div className={styles.confirmItem}>
              <span>{'Role'}</span>
              <span className={styles.confirmItemValue}>
                {member.roleList.map((role) => (
                  <span key={role?.roleId}>{role.roleName}</span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
      {showTextArea && (
        <AntInput.TextArea
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={textAreaValue}
          name="confirmCode"
          onChange={handleTextAreaChange}
          placeholder={textAreaPlaceholder || t('org.dialog.confirm_delete.placeholder.code')}
          disabled={disabled}
          className={styles.textArea}
        />
      )}
      {showInput && (
        <AntInput
          value={inputValue}
          name="confirmCode"
          onChange={handleChange}
          placeholder={placeholder || t('org.dialog.confirm_delete.placeholder.code')}
          disabled={disabled}
          className={styles.input}
          size="large"
        />
      )}
    </div>
  );
};

export default DeleteConfirmInput;
