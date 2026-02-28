import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import BaseLayout from './components/layouts/BaseLayout';
import AppRoutes from './routes/AppRoutes';
import { store } from './store';

import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <BaseLayout>
          <AppRoutes />
        </BaseLayout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
