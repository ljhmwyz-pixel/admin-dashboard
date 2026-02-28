import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/Dashboard'));
const OrganizationList = lazy(() => import('../pages/OrganizationList'));
const OrganizationType = lazy(() => import('../pages/OrganizationType'));

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
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 默认路由重定向到仪表板 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 仪表板 */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 组织管理 */}
          <Route path="/organization/list" element={<OrganizationList />} />
          <Route path="/organization/type" element={<OrganizationType />} />

          {/* 404 页面 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
