import React from 'react';
import { AntAvatar } from '../antd-imports';

interface UserInfoProps {
  name: string;
  role: string;
  avatar?: string;
  collapsed?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, role, avatar = '', collapsed = false }) => {
  return (
    <div className={`user-info ${collapsed ? 'collapsed' : ''}`}>
      <div className="user-info-content">
        <AntAvatar 
          src={avatar} 
          size={32}
          style={{ backgroundColor: '#1890ff' }}
        >
          {name.charAt(0)}
        </AntAvatar>
        {!collapsed && (
          <div className="user-info-text">
            <div className="user-name">{name}</div>
            <div className="user-role">{role}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;