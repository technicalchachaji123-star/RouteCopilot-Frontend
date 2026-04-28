import apiClient from './client';

export const mapsAPI = {
  getAvailable: () => apiClient.get('/maps'),
  registerDownload: (mapId) => apiClient.post('/maps/download', { mapId }),
};
