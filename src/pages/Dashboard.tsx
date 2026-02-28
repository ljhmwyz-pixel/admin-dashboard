import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="dashboard">
      <h1>{t('sidebar.dashboard')}</h1>
    </div>
  );
};

export default Dashboard;
