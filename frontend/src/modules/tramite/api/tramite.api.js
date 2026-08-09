import { tramiteService } from '@/services/tramite.service.js';

export const tramiteApi = {
  listar: (params) => tramiteService.listar(params),
  obtener: (id) => tramiteService.obtener(id),
  crear: (data) => tramiteService.crear(data),
  editar: (id, data) => tramiteService.editar(id, data),
  cambiarEstado: (id, data) => tramiteService.cambiarEstado(id, data),
  eliminar: (id) => tramiteService.eliminar(id),
};
