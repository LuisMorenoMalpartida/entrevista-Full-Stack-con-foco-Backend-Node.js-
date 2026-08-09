import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api.js';
import { toast } from 'sonner';

export function useCrearTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tramiteApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tramites'] });
      toast.success('Trámite creado correctamente');
    },
    onError: (error) => {
      toast.error(error.mensaje || 'Error al crear el trámite');
    },
  });
}
