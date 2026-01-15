import React, { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import CompaniesList from './components/CompaniesList';
import ClientsList from './components/ClientsList';
import CreateProduct from './components/CreateProduct';
import CreateCompany from './components/CreateCompany';
import EditProduct from './components/EditProduct';
import EditCompany from './components/EditCompany';
import Login from './components/Login';
import { authService } from './services/api';
import Header from './components/Header';

const RequireAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    let active = true;
    authService.me()
      .then(() => {
        if (active) setStatus('authenticated');
      })
      .catch(() => {
        if (active) setStatus('unauthenticated');
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === 'checking') {
    return <div className="p-6 text-gray-600">Chargement...</div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<Navigate to="/vouchers" replace />}
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <Header />
                <ProductsList />
              </RequireAuth>
            }
          />
          <Route
            path="/companies"
            element={
              <RequireAuth>
                <Header />
                <CompaniesList />
              </RequireAuth>
            }
          />
          <Route
            path="/clients"
            element={
              <RequireAuth>
                <Header />
                <ClientsList />
              </RequireAuth>
            }
          />
          <Route
            path="/create-product"
            element={
              <RequireAuth>
                <Header />
                <CreateProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <RequireAuth>
                <Header />
                <EditProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/create-company"
            element={
              <RequireAuth>
                <Header />
                <CreateCompany />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-company/:id"
            element={
              <RequireAuth>
                <Header />
                <EditCompany />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/products" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
