import api from './api';

export const getResources = () => api.get('/Resources');
export const createResource = (data) => api.post('/Resources/add', data);
export const updateResource = (data) => api.put('/Resources/update', data);
export const archiveResource = (data) => api.put('/Resources/archive', data);
export const returnToWorkResource = (data) => api.put('/Resources/returntowork', data);
export const deleteResource = (data) => api.delete('/Resources/delete', { data });