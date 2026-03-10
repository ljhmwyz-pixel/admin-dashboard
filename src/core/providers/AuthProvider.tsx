import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { ReactNode } from 'react';

import { fetchUserInfo } from '@/core/store/thunks/authThunks';
import SecurityUtils from '@/shared/utils/SecurityUtils';

import type { AppDispatch } from '../store';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = SecurityUtils.getToken();
    if (!token) return;
    // 获取用户信息
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
