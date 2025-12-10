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
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-[#D73738]">NewStud</span>
          
          {/* Navigation Links */}
          <ul className="flex items-center">
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200
                   ${isActive 
                     ? 'text-[#D73738]' 
                     : 'text-[#0C0C0C] hover:text-[#D73738]'
                   }
                   after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                   after:h-0.5 after:bg-[#D73738] after:transition-all after:duration-200
                   ${isActive ? 'after:w-6' : 'after:w-0 hover:after:w-6'}`
                }
              >
                Promos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200
                   ${isActive 
                     ? 'text-[#D73738]' 
                     : 'text-[#0C0C0C] hover:text-[#D73738]'
                   }
                   after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                   after:h-0.5 after:bg-[#D73738] after:transition-all after:duration-200
                   ${isActive ? 'after:w-6' : 'after:w-0 hover:after:w-6'}`
                }
              >
                Entreprises
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200
                   ${isActive 
                     ? 'text-[#D73738]' 
                     : 'text-[#0C0C0C] hover:text-[#D73738]'
                   }
                   after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                   after:h-0.5 after:bg-[#D73738] after:transition-all after:duration-200
                   ${isActive ? 'after:w-6' : 'after:w-0 hover:after:w-6'}`
                }
              >
                Clients
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-[#D73738] bg-white
                     border border-[#D73738] rounded-xl
                     hover:bg-[#D73738] hover:text-white
                     transition-all duration-200 ease-in-out"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Header;