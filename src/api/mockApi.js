import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articlesApi = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const mouvementsApi = {
  getAll: () => api.get('/mouvements'),
  getByArticle: (articleId) => api.get(`/mouvements?articleId=${articleId}`),
  create: (data) => api.post('/mouvements', data),
  delete: (id) => api.delete(`/mouvements/${id}`),
};

export default api;