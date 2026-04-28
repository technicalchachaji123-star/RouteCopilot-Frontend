import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/v1' 
  : 'https://routecopilot-backend.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000, // 60 second timeout (Render cold start can take 30-50s)
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

// ── Retry Interceptor ──
// Automatically retry failed requests up to 2 times with exponential backoff.
// This handles Render cold starts, transient network errors, and 503s.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Don't retry if we've already exhausted retries, or it's a 4xx client error (except 408/429)
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    
    const status = error.response?.status;
    const isRetryable = !status || status >= 500 || status === 408 || status === 429 || error.code === 'ECONNABORTED';
    
    if (!isRetryable) {
      return Promise.reject(error);
    }
    
    config.__retryCount = (config.__retryCount || 0) + 1;
    const delayMs = config.__retryCount * 3000; // 3s, 6s backoff
    
    console.warn(`[API Retry] Attempt ${config.__retryCount}/2 after ${delayMs}ms (${error.message})`);
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return apiClient(config);
  }
);

export default apiClient;
