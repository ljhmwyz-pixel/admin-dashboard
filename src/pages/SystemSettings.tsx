import React from 'react';

interface SystemSettingsProps {
  tab?: string;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ tab = 'basic' }) => {
  return (
    <div>
      <h1>系统设置页面</h1>
      <p>当前标签页: {tab}</p>
      <p>这里将展示系统设置功能</p>
    </div>
  );
};

export default SystemSettings;