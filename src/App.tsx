import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import GlobalLoading from './components/GlobalLoading/GlobalLoading';
import BaseLayout from './components/layouts/BaseLayout';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <BaseLayout>
          <AppRoutes />
        </BaseLayout>
        <GlobalLoading />
      </BrowserRouter>
    </Provider>
  );
};

export default App;