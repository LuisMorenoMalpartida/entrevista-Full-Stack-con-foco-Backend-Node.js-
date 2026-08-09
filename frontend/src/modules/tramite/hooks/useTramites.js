import { useQuery } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';

export function useTramites({ estado, search, page, limit = 10 } = {}) {
  return useQuery({
    queryKey: ['tramites', { estado, search, page, limit }],
    queryFn: () =>
      tramiteApi.listar({
        estado: estado || undefined,
        search: search || undefined,
        limit,
        page: page || 1,
      }),
  });
}
