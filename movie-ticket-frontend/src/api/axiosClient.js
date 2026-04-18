import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://172.16.33.175:8888/api',  
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