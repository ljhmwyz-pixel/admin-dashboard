import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import GlobalLoading from '../components/GlobalLoading/GlobalLoading';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/Dashboard'));
const OrganizationList = lazy(() => import('../pages/OrganizationList'));
const OrganizationType = lazy(() => import('../pages/OrganizationType'));
const RoleManagement = lazy(() => import('../pages/RoleManagement'));
const UserManagement = lazy(() => import('../pages/UserManagement'));
const OrderManagement = lazy(() => import('../pages/OrderManagement'));
const ProductManagement = lazy(() => import('../pages/ProductManagement'));
const SystemSettings = lazy(() => import('../pages/SystemSettings'));

// 懒加载 fallback 组件
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <div>页面加载中...</div>
  </div>
);

const AppRoutes: React.FC = () => {
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);

  return (
    <>
      {globalLoading && <GlobalLoading />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 默认路由重定向到仪表板 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 仪表板 */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* 组织管理 */}
          <Route path="/organization/list" element={<OrganizationList />} />
          <Route path="/organization/type" element={<OrganizationType />} />
          
          {/* 角色管理 */}
          <Route path="/role" element={<RoleManagement />} />
          
          {/* 用户管理 */}
          <Route path="/user" element={<UserManagement />} />
          
          {/* 订单管理 */}
          <Route path="/orders" element={<OrderManagement />} />
          
          {/* 商品管理 */}
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/products/list" element={<ProductManagement />} />
          <Route path="/products/category" element={<ProductManagement tab="category" />} />
          <Route path="/products/brand" element={<ProductManagement tab="brand" />} />
          
          {/* 系统设置 */}
          <Route path="/system" element={<SystemSettings />} />
          <Route path="/system/basic" element={<SystemSettings tab="basic" />} />
          <Route path="/system/security" element={<SystemSettings tab="security" />} />
          <Route path="/system/notification" element={<SystemSettings tab="notification" />} />
          
          {/* 404 页面 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;