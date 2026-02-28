import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

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
