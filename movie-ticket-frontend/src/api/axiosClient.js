import axios from 'axios';

const axiosClient = axios.create({
  // Nhắc bạn Người 4 (Booking Service) cung cấp IP/Port Gateway
  baseURL: 'http://172.16.54.193:8888', 
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