import React from 'react';
import clsx from 'classnames';

import styles from './OrganizationInfo.module.scss';

interface OrganizationInfoProps {
  orgName?: string;
  orgType?: string;
  orgId?: string;
  className?: string;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  orgName = '',
  orgType = '',
  orgId = '',
  className = '',
}) => {
  return (
    <div className={clsx(styles.orgInfo, className)}>
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
