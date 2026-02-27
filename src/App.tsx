import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import GlobalLoading from './components/GlobalLoading/GlobalLoading';
import AdminLayout from './components/AdminLayout';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AdminLayout>
          <AppRoutes />
        </AdminLayout>
        <GlobalLoading />
      </BrowserRouter>
    </Provider>
  );
};

export default App;