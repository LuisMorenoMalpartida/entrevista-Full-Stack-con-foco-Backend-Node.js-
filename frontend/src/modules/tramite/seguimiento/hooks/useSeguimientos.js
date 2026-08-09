import { useQuery } from '@tanstack/react-query';
import { seguimientoApi } from '../api/seguimiento.api.js';

export function useSeguimientos(tramiteId) {
  return useQuery({
    queryKey: ['seguimientos', tramiteId],
    queryFn: () => seguimientoApi.listar(tramiteId),
    enabled: !!tramiteId,
  });
}
