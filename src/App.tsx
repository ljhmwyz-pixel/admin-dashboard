import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from './store';
import BaseLayout from './components/layouts/BaseLayout';
import AppRoutes from './routes/AppRoutes';
import i18n from './i18n/i18n';
import { Provider } from 'react-redux';

import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <BaseLayout>
            <AppRoutes />
          </BaseLayout>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
