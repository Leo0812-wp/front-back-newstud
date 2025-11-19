import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import CompaniesList from './components/CompaniesList';
import VouchersList from './components/VouchersList';
import CreateVoucher from './components/CreateVoucher';
import EditVoucher from './components/EditVoucher';
import CreateProduct from './components/CreateProduct';
import CreateCompany from './components/CreateCompany';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <nav className="border-b">
          <div className="container mx-auto px-4">
            <ul className="flex gap-4">
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
                  }
                >
                  Produits
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/companies"
                  className={({ isActive }) =>
                    `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
                  }
                >
                  Entreprises
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/vouchers"
                  className={({ isActive }) =>
                    `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
                  }
                >
                  Promos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/create-voucher"
                  className={({ isActive }) =>
                    `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
                  }
                >
                  Créer une Promo
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/vouchers" replace />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/companies" element={<CompaniesList />} />
            <Route path="/vouchers" element={<VouchersList />} />
            <Route path="/create-voucher" element={<CreateVoucher />} />
            <Route path="/edit-voucher/:id" element={<EditVoucher />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/create-company" element={<CreateCompany />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

