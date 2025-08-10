import api from './api';

export const getAdmissionDocs = () => api.get('api/AdmissionDocs');
export const createAdmissionDoc = (data) => api.post('api/AdmissionDocs/add', data);
export const updateAdmissionDoc = (data) => api.post('api/AdmissionDocs/update', data);
export const deleteAdmissionDoc = (data) => api.delete('api/AdmissionDocs/delete', { data });