import apiClient from './client';

export const usersAPI = {
  getProfile: () => apiClient.get('/users/me'),
};
