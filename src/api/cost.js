import apiClient from './client';

export const costAPI = {
  add: (costData) => apiClient.post('/cost/add', costData),
  getHistory: (routeId) => apiClient.get('/cost/history', { params: { routeId } }),
};
