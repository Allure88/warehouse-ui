import api from './api';

export const getShippingDocs = () => api.get('/ShippingDocs');
export const createShippingDoc = (data) => api.post('/ShippingDocs/add', data);
export const updateShippingDoc = (data) => api.put('/ShippingDocs/update', data);
export const signShippingDoc = (number) => api.put(`/ShippingDocs/sign?number=${number}`);
export const revocateShippingDoc = (number) => api.put(`/ShippingDocs/revocate?number=${number}`);
export const deleteShippingDoc = (data) => api.delete('/ShippingDocs/delete', { data });