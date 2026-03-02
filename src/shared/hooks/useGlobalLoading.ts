import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { selectGlobalLoading, setGlobalLoading } from '../../core/store/slices/uiSlice';

/**
 * 全局loading状态管理hook
 * 提供简洁的API来控制全局loading状态
 */
export function useGlobalLoading() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectGlobalLoading);

  /**
   * 显示全局loading
   */
  const showLoading = useCallback(() => {
    dispatch(setGlobalLoading(true));
  }, [dispatch]);

  /**
   * 隐藏全局loading
   */
  const hideLoading = useCallback(() => {
    dispatch(setGlobalLoading(false));
  }, [dispatch]);

  /**
   * 切换loading状态
   */
  const toggleLoading = useCallback(() => {
    dispatch(setGlobalLoading(!isLoading));
  }, [dispatch, isLoading]);

  /**
   * 带有自动隐藏的loading包装器
   * @param asyncFn 异步函数
   * @param options 配置选项
   */
  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: {
        /** 是否自动隐藏loading，默认true */
        autoHide?: boolean;
        /** 错误处理回调 */
        onError?: (error: unknown) => void;
        /** 成功回调 */
        onSuccess?: (result: T) => void;
      } = {},
    ): Promise<T | undefined> => {
      const { autoHide = true, onError, onSuccess } = options;

      try {
        showLoading();
        const result = await asyncFn();
        onSuccess?.(result);
        return result;
      } catch (error) {
        onError?.(error);
        throw error;
      } finally {
        if (autoHide) {
          hideLoading();
        }
      }
    },
    [showLoading, hideLoading],
  );

  return {
    /** 当前loading状态 */
    isLoading,
    /** 显示loading */
    showLoading,
    /** 隐藏loading */
    hideLoading,
    /** 切换loading状态 */
    toggleLoading,
    /** 带loading的异步操作包装器 */
    withLoading,
  };
}
