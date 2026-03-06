import React, { useEffect } from 'react';

import { useAppDispatch } from '@/core/store/hooks';
import { refreshToken } from '@/core/store/thunks/authThunks';
import SecurityUtils from '@/shared/utils/SecurityUtils';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = SecurityUtils.getRefreshToken();

    if (token) {
      dispatch(refreshToken());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
