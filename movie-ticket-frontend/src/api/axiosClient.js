import axios from 'axios';

const axiosClient = axios.create({
  // Nhắc bạn Người 4 (Booking Service) cung cấp IP/Port Gateway
  baseURL: 'http://localhost:8888/api',
    // baseURL: 'http://172.20.35.147:8888/api',  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm token nếu sau này có làm phần Login
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;