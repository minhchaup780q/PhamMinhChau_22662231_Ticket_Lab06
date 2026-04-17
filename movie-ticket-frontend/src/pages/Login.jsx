import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, Film, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Attempting login with:', {
      userName: formData.username,
      password: formData.password
    });

    try {
      const res = await axiosClient.post('/users/login', {
        userName: formData.username,
        password: formData.password
      });

      console.log('Login response:', res.data);

      const { token, role, userName } = res.data;

      if (!token) {
        throw new Error('Không nhận được token từ server');
      }

      // 🔥 Chuyển đổi role
      let userRole;
      let redirectPath;
      
      if (role === 'ADMIN') {
        userRole = 'ROLE_ADMIN';
        redirectPath = '/admin';  // ADMIN vào dashboard
      } else {
        userRole = 'ROLE_USER';
        redirectPath = '/movies';  // USER vào movies
      }

      const userData = {
        username: userName,
        role: userRole,
      };

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Saved to localStorage:', {
        accessToken: localStorage.getItem('accessToken'),
        user: localStorage.getItem('user'),
        redirectTo: redirectPath
      });

      // Chuyển hướng dựa trên role
      navigate(redirectPath);

    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error ||
                      `Lỗi ${err.response.status}: Đăng nhập thất bại`;
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 p-8 border border-white">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-blue-500/30 transform -rotate-6">
              <Film className="w-8 h-8 text-white transform rotate-6" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Chào mừng trở lại</h1>
            <p className="text-gray-500 font-medium">Đăng nhập để đặt vé phim ngay!</p>
          </div>

          {infoMessage && !error && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium rounded-2xl">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3.5 px-4 mt-8 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/users/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;