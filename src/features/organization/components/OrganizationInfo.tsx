import React from 'react';

import { ImageIcons } from '@/components';

import styles from './OrganizationInfo.module.scss';

interface OrganizationInfoProps {
  orgName?: string;
  tag?: string;
  label?: string;
  orgCode?: string;
  extra?: React.ReactNode; // 支持自定义 extra 内容
  showExtra?: boolean; // 控制是否显示 extra
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  orgName = 'Pylontech',
  tag = 'Parent',
  label = 'Pylontech',
  orgCode = 'ROOT-PYL5-T9W3',
  extra = (
    <>
      <div className={styles.actionLabel}>Update Record</div>
      <img src={ImageIcons.form.recordIcon} width={14} height={14} />
    </>
  ),
  showExtra = true,
}) => {
  return (
    <div className={styles.orgInfo}>
      <div className={styles.orgBase}>
        <div className={styles.orgName}>{orgName}</div>
        <div className={styles.tag}>{tag}</div>
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.orgCode}>{orgCode}</div>
      {showExtra && <div className={styles.extraStyle}>{extra}</div>}
    </div>
  );
};

export default OrganizationInfo;
