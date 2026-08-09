import { clienteService } from '@/services/cliente.service.js';

export const clienteApi = {
  listar: (params) => clienteService.listar(params),
  obtener: (id) => clienteService.obtener(id),
  crear: (data) => clienteService.crear(data),
  editar: (id, data) => clienteService.editar(id, data),
};
