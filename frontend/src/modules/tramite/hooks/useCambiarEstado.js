import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';
import { toast } from 'sonner';

export function useCambiarEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tramiteApi.cambiarEstado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tramites'] });
      queryClient.invalidateQueries({ queryKey: ['tramite'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error.mensaje || 'Error al cambiar el estado');
    },
  });
}
