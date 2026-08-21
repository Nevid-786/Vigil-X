import { apiClient } from './client.js';

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (email, password) => apiClient.post('/auth/register', { email, password }),
};

export const eventsService = {
  getEvents: (params) => apiClient.get('/events', { params }),
  acknowledge: (id) => apiClient.patch(`/events/${id}/acknowledge`),
  triggerDemo: (data) => apiClient.post('/events/demo', data),
  getExportUrl: (params) => {
    const searchParams = new URLSearchParams(params);
    return `/api/events/export?${searchParams.toString()}`;
  },
};

export const cardsService = {
  getCards: (search) => apiClient.get('/cards', { params: { search } }),
  createCard: (data) => apiClient.post('/cards', data),
  updateCard: (id, data) => apiClient.put(`/cards/${id}`, data),
  deleteCard: (id) => apiClient.delete(`/cards/${id}`),
};

export const polesService = {
  getPoles: () => apiClient.get('/poles'),
};

export const analyticsService = {
  getAnalytics: () => apiClient.get('/analytics'),
};

export const systemService = {
  getHealth: () => apiClient.get('/system/health'),
};
