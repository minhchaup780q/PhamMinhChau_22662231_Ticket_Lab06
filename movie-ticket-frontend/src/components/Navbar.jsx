import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy data từ localStorage
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/users/login');
  };

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

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link 
                  to="/users/login"
                  className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:text-blue-600 ${
                    isActive('/users/login') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                
                <Link 
                  to="/users/register" 
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-bold text-gray-700 max-w-[100px] truncate">
                    {user?.username || 'User'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;