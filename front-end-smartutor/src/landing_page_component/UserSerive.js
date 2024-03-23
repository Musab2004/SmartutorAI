// UserService.js (a separate file to manage API requests)

import axios from 'axios';

const userService = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

userService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default userService;
