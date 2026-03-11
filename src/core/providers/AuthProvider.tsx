import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { ReactNode } from 'react';

import { fetchUserInfo } from '@/core/store/thunks/authThunks';
import GlobalLoading from '@/shared/components/GlobalLoading';
import SecurityUtils from '@/shared/utils/SecurityUtils';

import type { AppDispatch } from '../store';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = SecurityUtils.getToken();
    if (!token) {
      // 使用微任务避免在 effect 中同步调用 setState
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
      return;
    }
    // 获取用户信息
    dispatch(fetchUserInfo()).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  // 加载期间显示 loading，避免路由闪烁
  if (isLoading) {
    return <GlobalLoading visible={isLoading} tip="加载中..." />;
  }
  return <>{children}</>;
};

export default AuthProvider;
