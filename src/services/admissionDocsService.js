import api from './api';

export const getAdmissionDocs = () => api.get('/AdmissionDocs');
export const createAdmissionDoc = (data) => api.post('/AdmissionDocs/add', data);
export const updateAdmissionDoc = (data) => api.post('/AdmissionDocs/update', data);
export const deleteAdmissionDoc = (data) => api.delete('/AdmissionDocs/delete', { data });