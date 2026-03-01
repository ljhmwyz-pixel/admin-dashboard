import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { routesConfig } from './config/routes';
import { ProtectedRoute } from './guards/AuthGuard';

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
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routesConfig.map((route) => (
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

        {/* 404 页面 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
