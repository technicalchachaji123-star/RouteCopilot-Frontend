import apiClient from './client';

export const telematicsAPI = {
  getLiveDashboard: (routeId) => apiClient.get('/telematics/live', { params: { routeId } }),
};
