import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const clienteSchema = z.object({
  tipo_doc: z.enum(['DNI', 'CE', 'RUC'], { required_error: 'Selecciona un tipo de documento' }),
  num_doc: z.string().min(1, 'El número de documento es requerido').max(20),
  nombres: z.string().min(1, 'Los nombres son requeridos').max(100),
  ap_paterno: z.string().min(1, 'El apellido paterno es requerido').max(100),
  ap_materno: z.string().max(100).optional().default(''),
  email: z.string().email('Email inválido').optional().default(''),
  telefono: z.string().max(20).optional().default(''),
  fecha_nac: z.string().optional().default(''),
});

export function ClienteForm({ open, onOpenChange, cliente = null, onSuccess }) {
  const isEditing = !!cliente;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo_doc: 'DNI',
      num_doc: '',
      nombres: '',
      ap_paterno: '',
      ap_materno: '',
      email: '',
      telefono: '',
      fecha_nac: '',
    },
  });

  useEffect(() => {
    if (cliente && open) {
      reset({
        tipo_doc: cliente.tipo_doc || 'DNI',
        num_doc: cliente.num_doc || '',
        nombres: cliente.nombres || '',
        ap_paterno: cliente.ap_paterno || '',
        ap_materno: cliente.ap_materno || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        fecha_nac: cliente.fecha_nac || '',
      });
    } else if (!cliente && open) {
      reset({
        tipo_doc: 'DNI',
        num_doc: '',
        nombres: '',
        ap_paterno: '',
        ap_materno: '',
        email: '',
        telefono: '',
        fecha_nac: '',
      });
    }
  }, [cliente, open, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        // For simplicity in inline use, just call onSuccess with the updated data
        // In a real app, you'd call clienteApi.editar here
        onSuccess?.(data);
      } else {
        onSuccess?.(data);
      }
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Controller
                name="tipo_doc"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_doc && (
                <p className="text-sm text-red-500">{errors.tipo_doc.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Número de Documento</Label>
              <Input {...register('num_doc')} placeholder="12345678" />
              {errors.num_doc && (
                <p className="text-sm text-red-500">{errors.num_doc.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Nombres</Label>
              <Input {...register('nombres')} placeholder="Juan Carlos" />
              {errors.nombres && (
                <p className="text-sm text-red-500">{errors.nombres.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Apellido Paterno</Label>
              <Input {...register('ap_paterno')} placeholder="Pérez" />
              {errors.ap_paterno && (
                <p className="text-sm text-red-500">{errors.ap_paterno.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Apellido Materno</Label>
              <Input {...register('ap_materno')} placeholder="García" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register('email')} type="email" placeholder="correo@ejemplo.com" />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input {...register('telefono')} placeholder="999888777" />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input {...register('fecha_nac')} type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
