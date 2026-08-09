import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTramite } from '../hooks/useTramite.js';
import { HistorialSeguimiento } from '../seguimiento/index.js';

const getEstadoColor = (estado) => {
  const colors = {
    REGISTRADO: 'bg-blue-100 text-blue-800',
    'EN_FIRMAS': 'bg-yellow-100 text-yellow-800',
    PRESENTADO: 'bg-gray-100 text-gray-800',
    OBSERVADO: 'bg-red-100 text-red-800',
    INSCRITO: 'bg-green-100 text-green-800',
    CERRADO: 'bg-gray-600 text-white',
    ANULADO: 'bg-gray-300 text-gray-600',
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};

export function TramiteDetalle({ open, onOpenChange, tramiteId }) {
  const { data, isLoading, error } = useTramite(tramiteId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Cargando detalles...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="text-center text-red-600">
            <p>Error al cargar los detalles</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const tramite = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Trámite</DialogTitle>
        </DialogHeader>

        {tramite && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Código</p>
                <p className="font-medium">{tramite.codigo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge className={getEstadoColor(tramite.estado)}>{tramite.estado}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">
                  {new Date(tramite.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Datos del Vehículo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Marca</p>
                  <p className="font-medium">{tramite.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="font-medium">{tramite.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Año</p>
                  <p className="font-medium">{tramite.anio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="font-medium">{tramite.placa || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto</p>
                  <p className="font-medium">
                    {tramite.monto ? `S/ ${Number(tramite.monto).toFixed(2)}` : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo Doc.</p>
                  <p className="font-medium">{tramite.cliente?.tipo_doc}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número</p>
                  <p className="font-medium">{tramite.cliente?.num_doc}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">
                    {tramite.cliente?.nombres} {tramite.cliente?.ap_paterno}{' '}
                    {tramite.cliente?.ap_materno}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{tramite.cliente?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{tramite.cliente?.telefono || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Nac.</p>
                  <p className="font-medium">
                    {tramite.cliente?.fecha_nac
                      ? new Date(tramite.cliente.fecha_nac).toLocaleDateString('es-ES')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Historial de Seguimiento
              </h3>
              <HistorialSeguimiento seguimientos={tramite.seguimientos || []} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
