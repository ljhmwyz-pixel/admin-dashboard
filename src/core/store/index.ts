import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import organizationReducer from './slices/organizationSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    organization: organizationReducer,
    ui: uiReducer,
    auth: authReducer,
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
