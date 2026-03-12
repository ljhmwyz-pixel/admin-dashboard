import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// import type { RootState } from '../../store';
import { useAppSelector } from '../../store/hooks';
import {
  selectIsAuthenticated,
  selectUserPermissions,
  selectUserRoles,
} from '../../store/slices/userSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
}

/**
 * 认证守卫组件
 * 检查用户是否已登录，未登录则重定向到登录页
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectPath = '/login' }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

import type { UserPermission } from '../../store/slices/userSlice';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: UserPermission;
  fallback?: React.ReactNode;
}

/**
 * 权限守卫组件
 * 检查用户是否具有指定权限
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback = null,
}) => {
  const userPermissions = useAppSelector(selectUserPermissions);

  // 检查用户是否有该权限
  const hasPermission = userPermissions.includes(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

import SecurityUtils from '@shared/utils/SecurityUtils';

import type { UserRole } from '../../store/slices/userSlice';

interface RoleGuardProps {
  children: React.ReactNode;
  role: UserRole;
  fallback?: React.ReactNode;
}

/**
 * 角色守卫组件
 * 检查用户是否具有指定角色
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ children, role, fallback = null }) => {
  const userRoles = useAppSelector(selectUserRoles);

  // 检查用户是否有该角色
  const hasRole = userRoles.includes(role);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// 组合守卫组件
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  permissions?: UserPermission[];
  roles?: UserRole[];
  redirectPath?: string;
}

/**
 * 受保护的路由组件
 * 组合多种保护机制
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  // permissions = [],
  roles = [],
  redirectPath = '/login',
}) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRoles = useAppSelector(selectUserRoles);
  const refreshToken = SecurityUtils.getRefreshToken();

  // 使用 useMemo 优化权限检查，避免不必要的重新计算
  const authCheckResult = useMemo(() => {
    // 没有 refreshToken → 直接认为未登录
    if (requireAuth && !refreshToken) {
      return { authenticated: false, authorized: false, reason: 'no_refresh_token' };
    }
    // 检查认证状态
    if (requireAuth && !isAuthenticated) {
      return { authenticated: false, authorized: false, reason: 'unauthenticated' };
    }

    // 检查权限
    // if (permissions.length > 0) {
    //   const hasAllPermissions = permissions.every((permission) =>
    //     userPermissions.includes(permission),
    //   );
    //   if (!hasAllPermissions) {
    //     return { authenticated: true, authorized: false, reason: 'insufficient_permissions' };
    //   }
    // }

    // 检查角色
    if (roles.length > 0) {
      const hasAnyRole = roles.some((role) => userRoles.includes(role));
      if (!hasAnyRole) {
        return { authenticated: true, authorized: false, reason: 'insufficient_roles' };
      }
    }

    return { authenticated: true, authorized: true, reason: null };
  }, [requireAuth, isAuthenticated, roles, userRoles, refreshToken]);

  // 根据检查结果决定渲染什么
  if (!authCheckResult.authenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!authCheckResult.authorized) {
    // 对于未授权的情况，显示友好的错误页面而不是简单文本
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h2>访问受限</h2>
        <p>您没有足够的权限访问此页面</p>
        <button onClick={() => window.history.back()}>返回上一页</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default {
  AuthGuard,
  PermissionGuard,
  RoleGuard,
  ProtectedRoute,
};
