import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCambiarEstado } from '../hooks/useCambiarEstado.js';
import { toast } from 'sonner';

const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ['EN_FIRMAS', 'ANULADO'],
  EN_FIRMAS: ['PRESENTADO', 'OBSERVADO', 'ANULADO'],
  OBSERVADO: ['EN_FIRMAS', 'PRESENTADO', 'ANULADO'],
  PRESENTADO: ['INSCRITO', 'OBSERVADO'],
  INSCRITO: ['CERRADO'],
  CERRADO: [],
  ANULADO: [],
};

const ESTADOS_LABELS = {
  REGISTRADO: 'Registrado',
  EN_FIRMAS: 'En Firmas',
  PRESENTADO: 'Presentado',
  OBSERVADO: 'Observado',
  INSCRITO: 'Inscrito',
  CERRADO: 'Cerrado',
  ANULADO: 'Anulado',
};

const formSchema = z.object({
  estado_nuevo: z.string().min(1, 'Selecciona un estado'),
  comentario: z.string().optional().default(''),
});

export function CambiarEstadoModal({ open, onOpenChange, tramite }) {
  const cambiarMutation = useCambiarEstado();

  const estadoActual = tramite?.estado;
  const transicionesDisponibles = useMemo(() => {
    if (!estadoActual) return [];
    return TRANSICIONES_PERMITIDAS[estadoActual] || [];
  }, [estadoActual]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado_nuevo: '',
      comentario: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        estado_nuevo: '',
        comentario: '',
      });
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) {
      cambiarMutation.reset();
    }
  }, [open, cambiarMutation]);

  const onSubmit = async (data) => {
    try {
      await cambiarMutation.mutateAsync({
        id: tramite.id,
        data: {
          estado_nuevo: data.estado_nuevo,
          comentario: data.comentario || '',
        },
      });
      onOpenChange(false);
    } catch {
      toast.error('Error al cambiar el estado');
    }
  };

  const isLoading = cambiarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Trámite</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Trámite</Label>
            <p className="text-sm text-gray-600">
              {tramite?.codigo} - {tramite?.marca} {tramite?.modelo}
            </p>
            <p className="text-xs text-gray-500">
              Estado actual: <span className="font-medium">{ESTADOS_LABELS[tramite?.estado]}</span>
            </p>
          </div>

          {transicionesDisponibles.length === 0 ? (
            <div className="space-y-2">
              <Label>Nuevo Estado</Label>
              <p className="text-sm text-gray-500">
                No hay transiciones disponibles desde el estado actual.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Nuevo Estado</Label>
                <Controller
                  name="estado_nuevo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {transicionesDisponibles.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {ESTADOS_LABELS[estado]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.estado_nuevo && (
                  <p className="text-sm text-red-500">{errors.estado_nuevo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Comentario (opcional)</Label>
                <Input {...register('comentario')} placeholder="Comentario sobre el cambio de estado" />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {transicionesDisponibles.length > 0 && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Cambiando...' : 'Cambiar Estado'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


