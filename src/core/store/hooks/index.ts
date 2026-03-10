import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../index';

// 类型化的useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 类型化的useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default {
  useAppDispatch,
  useAppSelector,
};
