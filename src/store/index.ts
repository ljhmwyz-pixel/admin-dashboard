import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    users: userReducer,
    orders: orderReducer,
    products: productReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;