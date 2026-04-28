import apiClient from './client';

export const routesAPI = {
  calculate: (params) => apiClient.post('/routes/calculate', params),
  plan: (routeData) => apiClient.post('/routes/plan', routeData),
  getMyRoutes: () => apiClient.get('/routes/my-routes'),
  updateStatus: (id, status) => apiClient.patch(`/routes/${id}/status`, { status }),
};
