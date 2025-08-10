import api from './api';

export const getShippingDocs = () => api.get('api/ShippingDocs');
export const createShippingDoc = (data) => api.post('api/ShippingDocs/add', data);
export const updateShippingDoc = (data) => api.put('api/ShippingDocs/update', data);
export const signShippingDoc = (number) => api.put(`api/ShippingDocs/sign?number=${number}`);
export const revocateShippingDoc = (number) => api.put(`api/ShippingDocs/revocate?number=${number}`);
export const deleteShippingDoc = (data) => api.delete('api/ShippingDocs/delete', { data });