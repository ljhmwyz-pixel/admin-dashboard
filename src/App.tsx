import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App as AntdApp } from 'antd';
import { I18nextProvider } from 'react-i18next';

import AuthProvider from '@/core/providers/AuthProvider';

import AntdThemeProvider from './core/providers/AntdThemeProvider';
import { ThemeProvider } from './core/providers/ThemeContext';
import AppRoutes from './core/router/AppRoutes';
import { store } from './core/store';
import i18n, { initializeCacheWarmUp } from './i18n/i18n';
import ErrorBoundary from './shared/components/ErrorBoundary';
import modernErrorTracker from './shared/utils/ModernErrorTracker';
import logger from './shared/utils/ModernLogger';

import './App.module.scss';

const App: React.FC = () => {
  // 初始化监控工具和缓存
  useEffect(() => {
    // 应用启动时记录性能指标
    logger.info('🚀 Application initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // 初始化i18n缓存预热
    initializeCacheWarmUp();

    // 检查错误追踪是否初始化
    if (modernErrorTracker.isInitialized()) {
      logger.info('✅ Error tracking initialized successfully');
    } else {
      logger.warn('⚠️ Error tracking not initialized');
    }

    // 清理函数
    return () => {
      logger.info('👋 Application unmounting');
    };
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AntdThemeProvider>
            <AntdApp>
              <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                  <AuthProvider>
                    <AppRoutes />
                  </AuthProvider>
                </BrowserRouter>
              </I18nextProvider>
            </AntdApp>
          </AntdThemeProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
