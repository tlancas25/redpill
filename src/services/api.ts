import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  getFeatured: () => api.get('/products/featured'),
};

// Blog API
export const blogAPI = {
  getAll: (page: number = 1) => api.get(`/blog?page=${page}`),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getByCategory: (category: string) => api.get(`/blog/category/${category}`),
  getFeatured: () => api.get('/blog/featured'),
  search: (query: string) => api.get(`/blog/search?q=${query}`),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getBySlug: (slug: string) => api.get(`/courses/${slug}`),
  getByCategory: (category: string) => api.get(`/courses/category/${category}`),
  getFeatured: () => api.get('/courses/featured'),
  getProgress: (courseId: string) => api.get(`/courses/${courseId}/progress`),
  updateProgress: (courseId: string, lessonId: string) =>
    api.post(`/courses/${courseId}/progress`, { lessonId }),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/me'),
};

// Contact API
export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
};

// Search API
export const searchAPI = {
  search: (query: string, type?: string) =>
    api.get(`/search?q=${query}${type ? `&type=${type}` : ''}`),
};

export default api;
