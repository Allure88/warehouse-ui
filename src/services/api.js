import axios from 'axios';

const API_BASE_URL = 'http://localhost:5147'; // ← измените, если ваш бэкенд на другом порту

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;