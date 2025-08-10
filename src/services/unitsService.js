import api from './api';

export const getUnits = () => api.get('api/Units');
export const createUnit = (data) => api.post('api/Units/add', data);
export const updateUnit = (data) => api.put('api/Units/update', data);
export const archiveUnit = (data) => api.post('api/Units/archive', data);
export const returnToWorkUnit = (data) => api.put('api/Units/returntowork', data);
export const deleteUnit = (data) => api.delete('api/Units/delete', { data });