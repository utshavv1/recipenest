import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const uploadAvatar = (file) => {
  const fd = new FormData();
  fd.append('avatar', file);
  return API.patch('/users/avatar', fd);
};
export const changePassword = (data) => API.post('/users/change-password', data);

// Recipes
export const getRecipes = (params) => API.get('/recipes', { params });
export const getRecipe = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const uploadRecipeImage = (id, file) => {
  const fd = new FormData();
  fd.append('image', file);
  return API.patch(`/recipes/${id}/thumbnail`, fd);
};

// Admin
export const getAllUsers = () => API.get('/users');
export const deactivateUser = (id) => API.delete(`/users/${id}`);
export const adminGetAllRecipes = () => API.get('/recipes/admin/all');

// Public chefs
export const getChefs = () => API.get('/users/chefs');
export const getChefById = (id) => API.get(`/users/${id}`);