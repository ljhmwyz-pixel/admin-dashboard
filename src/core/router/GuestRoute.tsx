import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@/core/store/hooks';
import { selectIsAuthenticated } from '@/core/store/slices/authSlice';

interface Props {
  children: React.ReactNode;
}

const GuestRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // 已登录不允许访问 login/register
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
