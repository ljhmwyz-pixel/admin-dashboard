import React from 'react';
import { AntModal } from '@shared/components';
import type { ModalFuncProps } from 'antd';
import { App } from 'antd';

import closeIcon from '@/assets/images/form/close_icon.png';
import confirmIcon from '@/assets/images/form/confirm_status.png';
import errorIcon from '@/assets/images/form/error_status.png';
import successIcon from '@/assets/images/form/success_status.png';
import warningIcon from '@/assets/images/form/warning_status.png';

import { i18n } from '@/i18n';

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

const renderConfig = (config: AppModalProps, modalType: ModalType) => {
  return {
    closable: true,
    closeIcon: <img src={closeIcon} width={26} height={26} />,
    okText: i18n.t('common.action.ok'),
    cancelText: i18n.t('common.action.cancel'),
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

//静态
const appModal = {
  success: (config: AppModalProps) => AntModal.success(renderConfig(config, 'success')),

  confirm: (config: AppModalProps) => AntModal.confirm(renderConfig(config, 'confirm')),

  error: (config: AppModalProps) => AntModal.error(renderConfig(config, 'error')),

  warning: (config: AppModalProps) => AntModal.warning(renderConfig(config, 'warning')),

  warningConfirm: (config: AppModalProps) =>
    AntModal.confirm(renderConfig(config, 'warningConfirm')),
};

// 动态
export const useThemeModal = () => {
  const { modal } = App.useApp();
  const { success, confirm, error, warning } = modal;

  return {
    success: (config: AppModalProps) => success(renderConfig(config, 'success')),

    confirm: (config: AppModalProps) => confirm(renderConfig(config, 'confirm')),

    error: (config: AppModalProps) => error(renderConfig(config, 'error')),

    warning: (config: AppModalProps) => warning(renderConfig(config, 'warning')),

    warningConfirm: (config: AppModalProps) => confirm(renderConfig(config, 'warningConfirm')),
  };
};

// 保持原来的调用方式
const useAppModal = () => appModal;

export default useAppModal;
