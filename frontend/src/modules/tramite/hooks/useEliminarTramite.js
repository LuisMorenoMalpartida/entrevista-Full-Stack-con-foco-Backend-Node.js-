import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';
import { toast } from 'sonner';

export function useEliminarTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tramiteApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tramites'] });
      toast.success('Trámite eliminado correctamente');
    },
    onError: (error) => {
      toast.error(error.mensaje || 'Error al eliminar el trámite');
    },
  });
}
