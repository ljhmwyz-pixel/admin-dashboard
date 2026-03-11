import { useSelector } from 'react-redux';

import type { RootState } from '@/core/store';

export const usePermission = () => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const permissionSet = new Set(permissions);

  // 查看是否有权限
  const hasPermission = (permission: string) => {
    return permissionSet.has(permission);
  };

  // 需要同时满足多个权限
  const hasAllPermissions = (permissionList: string[]) => {
    return permissionList.every((p) => permissionSet.has(p));
  };

  // 满足任一权限即可
  const hasAnyPermission = (permissionList: string[]) => {
    return permissionList.some((p) => permissionSet.has(p));
  };

  // 检查是否没有任何权限（用于空状态判断）
  const hasNoPermission = (permissionList: string[]) => {
    return !permissionList.some((p) => permissionSet.has(p));
  };

  // 获取有权限的列表（用于批量过滤）
  const filterPermissions = (permissionList: string[]) => {
    return permissionList.filter((p) => permissionSet.has(p));
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasNoPermission,
    filterPermissions,
    permissions,
  };
};

// 新增：便捷的权限检查 Hook
export const useHasPermission = (permission: string) => {
  const { hasPermission } = usePermission();
  return hasPermission(permission);
};

// 新增：批量权限检查 Hook
export const useHasAllPermissions = (permissions: Array<string>) => {
  const { hasAllPermissions } = usePermission();
  return hasAllPermissions(permissions);
};
