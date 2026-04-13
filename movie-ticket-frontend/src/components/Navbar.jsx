import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/30">
              <Film className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">
              TicketMovie
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/login"
              className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:text-blue-600 ${
                isActive('/login') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Link>
            
            <Link 
              to="/register" 
              className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
