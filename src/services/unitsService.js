import api from './api';

export const getUnits = () => api.get('/Units');
export const createUnit = (data) => api.post('/Units/add', data);
export const updateUnit = (data) => api.put('/Units/update', data);
export const archiveUnit = (data) => api.post('/Units/archive', data);
export const returnToWorkUnit = (data) => api.put('/Units/returntowork', data);
export const deleteUnit = (data) => api.delete('/Units/delete', { data });