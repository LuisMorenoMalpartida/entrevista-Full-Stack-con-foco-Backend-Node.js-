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
import { useCrearTramite } from '../hooks/useCrearTramite.js';
import { useEditarTramite } from '../hooks/useEditarTramite.js';

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

const tramiteSchema = z.object({
  placa: z.string().max(10).optional().default(''),
  marca: z.string().min(1, 'La marca es requerida').max(50),
  modelo: z.string().min(1, 'El modelo es requerido').max(50),
  anio: z.coerce.number().int().min(1990).max(2027),
  monto: z.coerce.number().positive('El monto debe ser mayor a 0').optional().default(0),
});

const formSchema = z.object({
  cliente: clienteSchema,
  tramite: tramiteSchema,
});

export function TramiteForm({ open, onOpenChange, tramite = null }) {
  const isEditing = !!tramite;
  const crearMutation = useCrearTramite();
  const editarMutation = useEditarTramite();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: {
        tipo_doc: 'DNI',
        num_doc: '',
        nombres: '',
        ap_paterno: '',
        ap_materno: '',
        email: '',
        telefono: '',
        fecha_nac: '',
      },
      tramite: {
        placa: '',
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        monto: 0,
      },
    },
  });

  useEffect(() => {
    if (tramite && open) {
      reset({
        cliente: {
          tipo_doc: tramite.tipo_doc || 'DNI',
          num_doc: tramite.num_doc || '',
          nombres: tramite.nombres || '',
          ap_paterno: tramite.ap_paterno || '',
          ap_materno: tramite.ap_materno || '',
          email: tramite.email || '',
          telefono: tramite.telefono || '',
          fecha_nac: tramite.fecha_nac || '',
        },
        tramite: {
          placa: tramite.placa || '',
          marca: tramite.marca || '',
          modelo: tramite.modelo || '',
          anio: tramite.anio || new Date().getFullYear(),
          monto: tramite.monto || 0,
        },
      });
    } else if (!tramite && open) {
      reset({
        cliente: {
          tipo_doc: 'DNI',
          num_doc: '',
          nombres: '',
          ap_paterno: '',
          ap_materno: '',
          email: '',
          telefono: '',
          fecha_nac: '',
        },
        tramite: {
          placa: '',
          marca: '',
          modelo: '',
          anio: new Date().getFullYear(),
          monto: 0,
        },
      });
    }
  }, [tramite, open, reset]);

  const onSubmit = async (data) => {
    if (isEditing) {
      await editarMutation.mutateAsync({ id: tramite.id, data });
    } else {
      await crearMutation.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isLoading = crearMutation.isPending || editarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Trámite' : 'Crear Nuevo Trámite'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Datos del Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Controller
                  name="cliente.tipo_doc"
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
                {errors.cliente?.tipo_doc && (
                  <p className="text-sm text-red-500">{errors.cliente.tipo_doc.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Número de Documento</Label>
                <Input {...register('cliente.num_doc')} placeholder="12345678" />
                {errors.cliente?.num_doc && (
                  <p className="text-sm text-red-500">{errors.cliente.num_doc.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Nombres</Label>
                <Input {...register('cliente.nombres')} placeholder="Juan Carlos" />
                {errors.cliente?.nombres && (
                  <p className="text-sm text-red-500">{errors.cliente.nombres.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Apellido Paterno</Label>
                <Input {...register('cliente.ap_paterno')} placeholder="Pérez" />
                {errors.cliente?.ap_paterno && (
                  <p className="text-sm text-red-500">{errors.cliente.ap_paterno.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Apellido Materno</Label>
                <Input {...register('cliente.ap_materno')} placeholder="García" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register('cliente.email')} type="email" placeholder="correo@ejemplo.com" />
                {errors.cliente?.email && (
                  <p className="text-sm text-red-500">{errors.cliente.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input {...register('cliente.telefono')} placeholder="999888777" />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Nacimiento</Label>
                <Input {...register('cliente.fecha_nac')} type="date" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Datos del Trámite</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Placa</Label>
                <Input {...register('tramite.placa')} placeholder="ABC-123" />
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input {...register('tramite.marca')} placeholder="Toyota" />
                {errors.tramite?.marca && (
                  <p className="text-sm text-red-500">{errors.tramite.marca.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input {...register('tramite.modelo')} placeholder="Corolla" />
                {errors.tramite?.modelo && (
                  <p className="text-sm text-red-500">{errors.tramite.modelo.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Año</Label>
                <Controller
                  name="tramite.anio"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="number" min="1990" max="2027" />
                  )}
                />
                {errors.tramite?.anio && (
                  <p className="text-sm text-red-500">{errors.tramite.anio.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Monto</Label>
                <Controller
                  name="tramite.monto"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="number" step="0.01" placeholder="0.00" />
                  )}
                />
                {errors.tramite?.monto && (
                  <p className="text-sm text-red-500">{errors.tramite.monto.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
