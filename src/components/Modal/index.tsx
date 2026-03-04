import React from 'react';
import type { ModalFuncProps } from 'antd';
import { Modal } from 'antd';

import closeIcon from '@/assets/images/form/close_icon.png';
import confirmIcon from '@/assets/images/form/confirm_status.png';
import errorIcon from '@/assets/images/form/error_status.png';
import successIcon from '@/assets/images/form/success_status.png';
import warningIcon from '@/assets/images/form/warning_status.png';

import { useLanguage } from '@/shared/hooks/useLanguage';

import styles from './index.module.scss';

type ModalType = 'success' | 'error' | 'warning' | 'confirm' | 'warningConfirm';
const typeIcons = {
  success: <img src={successIcon} width={82} height={82} />,
  error: <img src={errorIcon} width={82} height={82} />,
  warning: <img src={warningIcon} width={82} height={82} />,
  confirm: <img src={confirmIcon} width={82} height={82} />,
  warningConfirm: <img src={warningIcon} width={82} height={82} />,
};

const okClassMap = {
  success: styles.okSuccess,
  error: styles.okError,
  warning: styles.okWarning,
  confirm: styles.okConfirm,
  warningConfirm: styles.okWarningConfirm,
};

const cancelClassMap: Partial<Record<ModalType, string>> = {
  confirm: styles.cancelConfirm,
  warningConfirm: styles.cancelConfirm,
};

type AppModalProps = Omit<ModalFuncProps, 'title' | 'content' | 'icon'> & {
  title?: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
};

const baseConfig: Partial<ModalFuncProps> = {
  centered: true,
  icon: null,
  className: styles.modal,
};

const renderConfig = (config: AppModalProps, modalType: ModalType, t: any) => {
  return {
    closable: true,
    closeIcon: <img src={closeIcon} width={26} height={26} />,
    okText: t('common.action.ok'),
    cancelText: t('common.action.cancel'),
    ...baseConfig,
    ...config,
    title: (
      <div className={styles.header}>
        <div className={styles.imageWrapper}>{config.icon ?? typeIcons[modalType]}</div>
        <div className={styles.title}>{config.title}</div>
      </div>
    ),
    content: <div className={styles.content}>{config.content}</div>,
    okButtonProps: {
      className: okClassMap[modalType],
      ...config.okButtonProps,
    },
    cancelButtonProps: {
      className: cancelClassMap[modalType],
      ...config.cancelButtonProps,
    },
  };
};

const useAppModal = () => {
  const { t } = useLanguage();

  const success = (config: AppModalProps) => Modal.success(renderConfig(config, 'success', t));

  const confirm = (config: AppModalProps) => Modal.confirm(renderConfig(config, 'confirm', t));

  const error = (config: AppModalProps) => Modal.error(renderConfig(config, 'error', t));

  const warning = (config: AppModalProps) => Modal.warning(renderConfig(config, 'warning', t));

  const warningConfirm = (config: AppModalProps) =>
    Modal.confirm(renderConfig(config, 'warningConfirm', t));

  return {
    success,
    confirm,
    error,
    warning,
    warningConfirm,
  };
};

export default useAppModal;
