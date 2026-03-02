import { lazy } from 'react';

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
const Dashboard = lazy(() => import('../../../features/dashboard/Dashboard'));
const OrganizationList = lazy(() => import('../../../features/organization/OrganizationList'));
const OrganizationType = lazy(() => import('../../../features/organization/OrganizationType'));
const RoleManagement = lazy(() => import('../../../features/role/RoleManagement'));
const UserManagement = lazy(() => import('../../../features/user/UserManagement'));
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
    auth: true,
    permissions: ['organization:manage'],
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
    permissions: ['organization:type'],
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
    permissions: ['role:manage'],
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
    permissions: ['user:manage'],
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

// 根据权限过滤路由
export const filterRoutesByPermission = (
  routes: RouteConfig[],
  permissions: string[],
  roles: string[],
): RouteConfig[] => {
  return routes
    .filter((route) => {
      // 检查认证要求
      if (route.auth && permissions.length === 0 && roles.length === 0) {
        return false;
      }

      // 检查权限要求
      if (route.permissions && route.permissions.length > 0) {
        const hasPermission = route.permissions.every((permission) =>
          permissions.includes(permission),
        );
        if (!hasPermission) return false;
      }

      // 检查角色要求
      if (route.roles && route.roles.length > 0) {
        const hasRole = route.roles.some((role) => roles.includes(role));
        if (!hasRole) return false;
      }

      return true;
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
