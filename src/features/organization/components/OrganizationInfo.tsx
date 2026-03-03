import React from 'react';

import styles from './OrganizationInfo.module.scss';

const OrganizationInfo: React.FC = () => {
  return (
    <div className={styles.orgInfo}>
      <div className={styles.orgBase}>
        <div className={styles.orgName}>Pylontech</div>
        <div className={styles.tag}>Parent</div>
        <div className={styles.label}>Pylontech</div>
      </div>
      <div className={styles.orgCode}>ROOT-PYL5-T9W3</div>
    </div>
  );
};

export default OrganizationInfo;
