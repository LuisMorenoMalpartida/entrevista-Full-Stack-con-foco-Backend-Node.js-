import api from './api.js';

export const tramiteService = {
  listar: async (params) => {
    const response = await api.get('/tramites', { params });
    return response.data;
  },

  obtener: async (id) => {
    const response = await api.get(`/tramites/${id}`);
    return response.data;
  },

  crear: async (data) => {
    const response = await api.post('/tramites', data);
    return response.data;
  },

  editar: async (id, data) => {
    const response = await api.put(`/tramites/${id}`, data);
    return response.data;
  },

  cambiarEstado: async (id, data) => {
    const response = await api.post(`/tramites/${id}/cambiar-estado`, data);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/tramites/${id}`);
    return response.data;
  },
};