import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import BaseLayout from './components/layouts/BaseLayout';
import AntdThemeProvider from './core/providers/AntdThemeProvider';
import { ThemeProvider } from './core/providers/ThemeContext';
import AppRoutes from './core/router/AppRoutes';
import { store } from './core/store';
import i18n from './i18n/i18n';
import ErrorTracker from './shared/utils/ErrorTracker';
import PerformanceMonitor from './shared/utils/PerformanceMonitor';

import './App.css';

const App: React.FC = () => {
  // 初始化监控工具
  useEffect(() => {
    // 应用启动时记录性能指标
    PerformanceMonitor.recordMetric('app_init', performance.now());

    // 清理函数
    return () => {
      PerformanceMonitor.destroy();
      ErrorTracker.destroy();
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AntdThemeProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <BaseLayout>
                <AppRoutes />
              </BaseLayout>
            </BrowserRouter>
          </I18nextProvider>
        </AntdThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
