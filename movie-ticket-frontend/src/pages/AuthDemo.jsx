import React, { useState } from 'react';
import { authService } from './AuthService';

export const AuthDemo = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  const [registerData, setRegisterData] = useState({ userName: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ userName: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.register(registerData.userName, registerData.email, registerData.password);
      setMessage("Đăng ký thành công: " + result);
    } catch (error) {
      setMessage("Lỗi đăng ký: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(loginData.userName, loginData.password);
      setToken(data.token);
      localStorage.setItem('token', data.token); // Lưu token cho lần truy cập sau
      setMessage(`Đăng nhập thành công! Xin chào ${data.userName}`);
    } catch (error) {
      setMessage("Lỗi đăng nhập: " + error.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await authService.getMe(token);
      setProfile(data);
      setMessage("Lấy thông tin cá nhân thành công!");
    } catch (error) {
      setMessage("Lỗi lấy thông tin: " + (error.error || error.message)); // Lỗi JSON custom từ backend
    }
  };

  const handleLogout = () => {
    setToken('');
    setProfile(null);
    localStorage.removeItem('token');
    setMessage('Đã đăng xuất.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Mô Phỏng Frontend - Authentication</h1>
      {message && <div style={{ padding: '10px', background: '#ffebee', color: '#b71c1c', marginBottom: '10px' }}>{message}</div>}

      {!token ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          <form style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }} onSubmit={handleRegister}>
            <h3>Đăng Ký</h3>
            <div><input type="text" placeholder="Username" value={registerData.userName} onChange={e => setRegisterData({...registerData, userName: e.target.value})} /></div>
            <div><input type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} /></div>
            <div><input type="password" placeholder="Mật khẩu" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} /></div>
            <button type="submit" style={{ marginTop: '10px' }}>Đăng Ký</button>
          </form>

          <form style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }} onSubmit={handleLogin}>
            <h3>Đăng Nhập</h3>
            <div><input type="text" placeholder="Username" value={loginData.userName} onChange={e => setLoginData({...loginData, userName: e.target.value})} /></div>
            <div><input type="password" placeholder="Mật khẩu" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} /></div>
            <button type="submit" style={{ marginTop: '10px' }}>Đăng Nhập</button>
          </form>
        </div>
      ) : (
        <div style={{ border: '1px solid #4CAF50', padding: '20px' }}>
          <h3>Khu vực đã đăng nhập</h3>
          <p>Trạng thái: Đã có Token hợp lệ.</p>
          <button onClick={fetchProfile} style={{ marginRight: '10px', background: '#2196F3', color: 'white', border: 'none', padding: '8px' }}>
            Xem thông tin cá nhân (Gọi /api/me)
          </button>
          <button onClick={handleLogout} style={{ background: '#f44336', color: 'white', border: 'none', padding: '8px' }}>
            Đăng xuất
          </button>

          {profile && (
            <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '10px' }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDemo;
