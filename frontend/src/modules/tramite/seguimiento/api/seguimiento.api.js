import api from '@/services/api.js';

export const seguimientoApi = {
  listar: async (tramiteId) => {
    const response = await api.get(`/tramites/${tramiteId}/seguimientos`);
    return response.data;
  },
};
