import React from 'react';

import styles from './OrganizationInfo.module.scss';

interface OrganizationInfoProps {
  orgName?: string;
  orgType?: string;
  orgId?: string;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  orgName = '',
  orgType = '',
  orgId = '',
}) => {
  return (
    <div className={styles.orgInfo}>
      <div className={styles.orgBase}>
        <div className={styles.orgName}>{orgName}</div>
        <div className={styles.tag}>Parent</div>
        {orgType && <div className={styles.label}>{orgType}</div>}
      </div>
      <div className={styles.orgCode}>{orgId}</div>
    </div>
  );
};

export default OrganizationInfo;
