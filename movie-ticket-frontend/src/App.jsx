import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MovieList from './pages/MovieList';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    // nếu chưa đăng nhập sẽ cho bay về trang login
    if (!token || !user) {
      return <Navigate to="/users/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      alert("Bạn không có quyền truy cập vào đây!");
      return <Navigate to="/movies" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route
              path="/users/login"
              element={
                localStorage.getItem('accessToken')
                  ? <Navigate to="/movies" replace />
                  : <Login />
              }
            />
            <Route path="/users/register" element={<Register />} />

            {/* --- PROTECTED ROUTES (Yêu cầu ROLE_USER hoặc ROLE_ADMIN) --- */}
            <Route path="/movies" element={
              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                <MovieList onSelectMovie={(movie) => setSelectedMovie(movie)} />
              </ProtectedRoute>
            } />

            <Route path="/booking/:movieId" element={
              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                <BookingPage />
              </ProtectedRoute>
            } />

            <Route path="/payment" element={
              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                <PaymentPage />
              </ProtectedRoute>
            } />

            {/* --- ADMIN ROUTES (Chỉ ROLE_ADMIN) --- */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* --- LOGIC TRANG CHỦ --- */}
            <Route path="/" element={<Navigate to="/movies" replace />} />

            {/* Redirect tất cả các path lạ về trang chủ */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;