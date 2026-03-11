import React from 'react';

import { usePermission } from '@/shared/hooks/usePermission';

type PermissionMode = 'all' | 'any' | 'none';

interface PermissionProps {
  /** 权限值，可以是单个权限字符串或权限数组 */
  value: string | string[];
  /**
   * 权限检查模式
   * - 'all': 需要满足所有权限（默认）
   * - 'any': 满足任一权限即可
   * - 'none': 没有任何权限时显示
   */
  mode?: PermissionMode;
  /** 无权限时的回退内容，默认为 null */
  fallback?: React.ReactNode;
  /** 有权限时显示的内容 */
  children: React.ReactNode;
}

export const Permission: React.FC<PermissionProps> = ({
  value,
  mode = 'all',
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, hasNoPermission } = usePermission();

  let hasAuth = false;

  // 单个权限检查
  if (typeof value === 'string') {
    switch (mode) {
      case 'all':
      case 'any':
        hasAuth = hasPermission(value);
        break;
      case 'none':
        hasAuth = !hasPermission(value);
        break;
      default:
        hasAuth = hasPermission(value);
    }
  }
  // 多个权限检查
  else {
    switch (mode) {
      case 'all':
        // 需要同时满足所有权限
        hasAuth = hasAllPermissions(value);
        break;
      case 'any':
        // 满足任一权限即可
        hasAuth = hasAnyPermission(value);
        break;
      case 'none':
        // 没有任何权限时才显示
        hasAuth = hasNoPermission(value);
        break;
      default:
        hasAuth = hasAllPermissions(value);
    }
  }

  // 无权限时显示回退内容
  if (!hasAuth) return <>{fallback}</>;

  // 有权限时显示子内容
  return <>{children}</>;
};

// 导出便捷的权限检查组件
interface SinglePermissionProps extends Omit<PermissionProps, 'value' | 'mode'> {
  permission: string;
}

/**
 * 单个权限检查组件（简化版）
 * @example
 * <Permission.Single permission="ORG_CREATE">内容</Permission.Single>
 */
export const SinglePermission: React.FC<SinglePermissionProps> = ({ permission, ...props }) => {
  return <Permission value={permission} mode="all" {...props} />;
};

// 导出类型定义
export type { PermissionProps, SinglePermissionProps };
export type { PermissionMode };
