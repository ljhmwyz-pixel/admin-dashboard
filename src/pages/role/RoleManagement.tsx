import React from 'react';

import Role from '../organization/components/Role';

import styles from './RoleManagement.module.scss';

const RoleManagement: React.FC = () => {
  return (
    <div className={styles.roleManagementContainer}>
      <Role />
    </div>
  );
};

export default RoleManagement;
