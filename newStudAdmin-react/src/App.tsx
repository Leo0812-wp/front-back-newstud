import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import CompaniesList from './components/CompaniesList';
import VouchersList from './components/VouchersList';
import EditVoucher from './components/EditVoucher';
import CreateProduct from './components/CreateProduct';
import CreateCompany from './components/CreateCompany';
import EditProduct from './components/EditProduct';
import EditCompany from './components/EditCompany';
import VueDB4 from './components/VueDB4';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Navigate to="/vouchers" replace />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/vouchers" element={<VouchersList />} />
          <Route path="/edit-voucher/:id" element={<EditVoucher />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/edit-company/:id" element={<EditCompany />} />
          <Route path="/vue-db4" element={<VueDB4 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

