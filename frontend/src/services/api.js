import axios from 'axios';

const API_BASE = 'const API_BASE = 'https://smart-grocery-bxvt.onrender.com/api';';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const productAPI = {
  getAll: () => api.get('/products/public/available'),
  getById: (id) => api.get(`/products/public/${id}`),
  getByCategory: (cat) => api.get(`/products/public/category/${cat}`),
  getFeatured: () => api.get('/products/public/featured'),
  search: (q) => api.get(`/products/public/search?q=${q}`),
  add: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
  updateStock: (id, stock) => api.patch(`/admin/products/${id}/stock`, { stock }),
  adminGetAll: () => api.get('/products/public/all'),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (cartId, quantity) => api.put(`/cart/update/${cartId}`, { quantity }),
  remove: (cartId) => api.delete(`/cart/remove/${cartId}`),
  clear: () => api.delete('/cart/clear'),
};

export const orderAPI = {
  place: (data) => api.post('/orders/place', data),
  myOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders/admin/all'),
  getToday: () => api.get('/orders/admin/today'),
  getStats: () => api.get('/orders/admin/stats'),
  updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, { status }),
};

export const adminAPI = {
  getCustomers: () => api.get('/admin/customers'),
};

export default api;
