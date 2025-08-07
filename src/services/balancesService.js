import api from './api';

export const getBalances = () => api.get('/Balances');