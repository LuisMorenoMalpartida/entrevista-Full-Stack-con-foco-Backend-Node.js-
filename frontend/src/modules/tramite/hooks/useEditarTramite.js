import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';
import { toast } from 'sonner';

export function useEditarTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tramiteApi.editar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tramites'] });
      queryClient.invalidateQueries({ queryKey: ['tramite'] });
      toast.success('Trámite actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error.mensaje || 'Error al actualizar el trámite');
    },
  });
}
