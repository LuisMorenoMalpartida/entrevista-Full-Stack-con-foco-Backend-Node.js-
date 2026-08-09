import { useQuery } from '@tanstack/react-query';
import { clienteApi } from '../api/cliente.api.js';

export function useClientes({ search, page, limit = 10 } = {}) {
  return useQuery({
    queryKey: ['clientes', { search, page, limit }],
    queryFn: () =>
      clienteApi.listar({
        search: search || undefined,
        limit,
        page: page || 1,
      }),
  });
}
