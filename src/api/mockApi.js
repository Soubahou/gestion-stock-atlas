import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const articlesApi = {
  getAll: () => api.get("/articles"),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post("/articles", data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const bonsApi = {
  getAll: () => api.get("/bons"),
  create: (data) => api.post("/bons", data),
  delete: (id) => api.delete(`/bons/${id}`),
};

export default api;