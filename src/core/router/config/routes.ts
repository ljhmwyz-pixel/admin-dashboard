import { lazy } from 'react';
import { PermissionCode } from '@shared/constants/permissions';

// 路由配置接口
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  auth?: boolean;
  permissions?: string[];
  roles?: string[];
  children?: RouteConfig[];
  meta?: {
    title?: string;
    icon?: string;
    breadcrumb?: boolean;
    hidden?: boolean;
  };
}

// 懒加载组件
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const OrganizationList = lazy(() => import('@pages/organization'));
const OrganizationType = lazy(() => import('@pages/organization-type/index'));
const RoleManagement = lazy(() => import('@pages/role/RoleManagement'));
const UserManagement = lazy(() => import('@pages/user/UserManagement'));
// 路由配置
export const routesConfig: RouteConfig[] = [
  {
    path: '/',
    element: Dashboard,
    auth: true,
    meta: {
      title: '仪表板',
      icon: 'dashboard',
      breadcrumb: true,
    },
  },
  {
    path: '/dashboard',
    element: Dashboard,
    auth: true,
    meta: {
      title: '仪表板',
      icon: 'dashboard',
      breadcrumb: true,
    },
  },
  {
    path: '/organization/list',
    element: OrganizationList,
    permissions: [PermissionCode.ORG_LIST],
    auth: true,
    meta: {
      title: '组织列表',
      icon: 'apartment',
      breadcrumb: true,
    },
  },
  {
    path: '/organization/type',
    element: OrganizationType,
    auth: true,
    permissions: [PermissionCode.ORG_TYPE_CFG],
    meta: {
      title: '组织类型',
      icon: 'setting',
      breadcrumb: true,
    },
  },
  {
    path: '/role',
    element: RoleManagement,
    auth: true,
    permissions: [PermissionCode.ROLE_MANAGE],
    meta: {
      title: '角色管理',
      icon: 'usergroup-add',
      breadcrumb: true,
    },
  },
  {
    path: '/user',
    element: UserManagement,
    auth: true,
    permissions: [PermissionCode.USER_MANAGE],
    meta: {
      title: '用户管理',
      icon: 'user',
      breadcrumb: true,
    },
  },
];

// 扁平化路由配置（用于生成菜单）
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const result: RouteConfig[] = [];

  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach((route) => {
      result.push(route);
      if (route.children) {
        traverse(route.children);
      }
    });
  };

  traverse(routes);
  return result;
};

// 根据权限过滤路由（纯函数）
export const filterRoutesByPermission = (
  routes: RouteConfig[],
  permissions: string[],
  roles?: string[],
): RouteConfig[] => {
  return routes
    .filter((route) => {
      // 如果没有设置权限要求，则允许访问
      if (!route.permissions || route.permissions.length === 0) {
        return true;
      }

      // 检查权限 - 满足任一权限即可访问
      // ✅ 使用 some 检查所有权限
      const hasAnyPermission = route.permissions.some((permission) =>
        permissions.includes(permission),
      );

      return hasAnyPermission;
    })
    .map((route) => ({
      ...route,
      children: route.children
        ? filterRoutesByPermission(route.children, permissions, roles)
        : undefined,
    }));
};

export default {
  routesConfig,
  flattenRoutes,
  filterRoutesByPermission,
};
