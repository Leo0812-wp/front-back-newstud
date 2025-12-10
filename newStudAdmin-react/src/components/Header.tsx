import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/auth';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authUtils.removeToken();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <ul className="flex gap-4">
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-3 block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`
              }
            >
              Promos
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
        </ul>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-md border border-red-200 hover:border-red-300"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Header;

