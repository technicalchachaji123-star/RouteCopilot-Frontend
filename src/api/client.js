import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/v1' 
  : 'https://routecopilot-backend.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Automatically add the Access Token to every request header if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
