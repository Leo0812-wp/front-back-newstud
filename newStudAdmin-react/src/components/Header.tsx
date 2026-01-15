import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate("/login", { replace: true });
    }
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
          </ul>
        </div>

        {/* RIGHT SIDE — USER + LOGOUT */}
        <div className="flex items-center gap-6">

          {/* User (avatar + info) */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-xl transition">
            {/* Avatar / Initiales */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D73738] to-[#b82829] flex justify-center items-center text-white font-bold">
              AD
            </div>

            {/* Nom + rôle (masqué en mobile) */}
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[14px] font-bold text-[#0C0C0C]">Admin</span>
              <span className="text-[12px] text-gray-500">Administrateur</span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-[#D73738] border-2 border-[#D73738] rounded-xl bg-white
                      hover:bg-[#D73738] hover:text-white transition-all shadow-sm"
          >
            Déconnexion
          </button>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 items-center justify-center w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-6 h-[3px] bg-[#0C0C0C] rounded transition ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-[3px] bg-[#0C0C0C] rounded transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-[3px] bg-[#0C0C0C] rounded transition ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <nav
        className={`lg:hidden bg-white shadow-md transition-all overflow-hidden ${menuOpen ? "max-h-40 py-4" : "max-h-0"
          }`}
      >
        <ul className="flex flex-col gap-4 px-6">

          <NavLink
            to="/products"
            onClick={() => setMenuOpen(false)}
            className={`text-[16px] font-medium border-b pb-2`}
          >
            Promos
          </NavLink>

          <NavLink
            to="/companies"
            onClick={() => setMenuOpen(false)}
            className={`text-[16px] font-medium border-b pb-2`}
          >
            Entreprises
          </NavLink>

        </ul>
      </nav>
    </nav>
  );
};

export default Header;
