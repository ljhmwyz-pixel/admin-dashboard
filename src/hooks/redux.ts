import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { showLoading as showLoadingAction, hideLoading as hideLoadingAction, clearAllLoading as clearAllLoadingAction } from '../store/slices/loadingSlice';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Loading hooks
export const useLoading = () => {
  const dispatch = useAppDispatch();
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);

  const showLoading = (key: string) => {
    dispatch(showLoadingAction(key));
  };

  const hideLoading = (key: string) => {
    dispatch(hideLoadingAction(key));
  };

  const clearAllLoading = () => {
    dispatch(clearAllLoadingAction());
  };

  return {
    globalLoading,
    showLoading,
    hideLoading,
    clearAllLoading,
  };
};

// Loading wrapper hook for async operations
export const useAsyncLoading = () => {
  const { showLoading: showLoadingFn, hideLoading: hideLoadingFn } = useLoading();

  const withLoading = async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    showLoadingFn(key);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      hideLoadingFn(key);
    }
  };

  return { withLoading };
};