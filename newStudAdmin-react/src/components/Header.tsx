import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
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
              to="/vue-db4"
              className={({ isActive }) =>
                `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
              }
            >
              Vue DB4
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;

