import api from './api';

export const getResources = () => api.get('api/Resources');
export const createResource = (data) => api.post('api/Resources/add', data);
export const updateResource = (data) => api.put('api/Resources/update', data);
export const archiveResource = (data) => api.put('api/Resources/archive', data);
export const returnToWorkResource = (data) => api.put('api/Resources/returntowork', data);
export const deleteResource = (data) => api.delete('api/Resources/delete', { data });