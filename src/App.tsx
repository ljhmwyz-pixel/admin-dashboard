import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import BaseLayout from './components/layouts/BaseLayout';
import AntdThemeProvider from './contexts/AntdThemeProvider';
import ThemeProvider from './contexts/ThemeContext';
import i18n from './i18n/i18n';
import AppRoutes from './routes/AppRoutes';
import { store } from './store';

import './App.css';

const App: React.FC = () => {
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
