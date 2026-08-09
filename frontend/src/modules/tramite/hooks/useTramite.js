import { useQuery } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';

export function useTramite(id) {
  return useQuery({
    queryKey: ['tramite', id],
    queryFn: () => tramiteApi.obtener(id),
    enabled: !!id,
  });
}
