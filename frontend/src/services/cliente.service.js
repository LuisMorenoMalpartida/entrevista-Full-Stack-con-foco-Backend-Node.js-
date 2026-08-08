import api from './api.js';

export const clienteService = {
  listar: async (params) => {
    const response = await api.get('/clientes', { params });
    return response.data;
  },

  obtener: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  crear: async (data) => {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  editar: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },
};