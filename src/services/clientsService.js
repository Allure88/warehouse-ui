import api from './api';

export const getClients = () => api.get('api/Clients');
export const createClient = (data) => api.post('api/Clients/add', data);
export const updateClient = (data) => api.put('api/Clients/update', data);
export const archiveClient = (data) => api.put('api/Clients/archive', data);
export const returnToWorkClient = (data) => api.put('api/Clients/returntowork', data);
export const deleteClient = (data) => api.delete('api/Clients/delete', { data });