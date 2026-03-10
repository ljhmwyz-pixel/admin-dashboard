import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BaseLayout from '@/components/layouts/BaseLayout';
import type { RootState } from '@/core/store';

import Login from '../../features/login/Login';
import Register from '../../features/register/Register';
import { filterRoutesByPermission, routesConfig } from './config/routes';
import { ProtectedRoute } from './guards/AuthGuard';
import GuestRoute from './GuestRoute';

// 懒加载 fallback 组件
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    }}
  >
    <div>页面加载中...</div>
    {/* TODO: 替换为统一的加载组件 */}
  </div>
);

const AppRoutes: React.FC = () => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  // 根据用户权限过滤可访问的路由
  const accessibleRoutes = React.useMemo(() => {
    return filterRoutesByPermission(routesConfig, permissions);
  }, [permissions]);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 登录页（独立） */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        {/* 注册页（独立） */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route element={<BaseLayout />}>
          {accessibleRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.auth ? (
                  <ProtectedRoute
                    permissions={(route.permissions as any) || []}
                    roles={(route.roles as any) || []}
                  >
                    <route.element />
                  </ProtectedRoute>
                ) : (
                  <route.element />
                )
              }
            />
          ))}
        </Route>
        {/* 404 页面 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
