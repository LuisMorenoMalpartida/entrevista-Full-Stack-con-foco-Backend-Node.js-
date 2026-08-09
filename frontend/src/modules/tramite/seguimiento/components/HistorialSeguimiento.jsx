import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ESTADOS_COLORS = {
  REGISTRADO: 'bg-blue-100 text-blue-800',
  EN_FIRMAS: 'bg-yellow-100 text-yellow-800',
  PRESENTADO: 'bg-gray-100 text-gray-800',
  OBSERVADO: 'bg-red-100 text-red-800',
  INSCRITO: 'bg-green-100 text-green-800',
  CERRADO: 'bg-gray-600 text-white',
  ANULADO: 'bg-gray-300 text-gray-600',
};

export function HistorialSeguimiento({ seguimientos = [] }) {
  if (!seguimientos.length) {
    return (
      <p className="text-sm text-gray-500">No hay registros de seguimiento.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Comentario</TableHead>
          <TableHead>Usuario</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {seguimientos.map((seg) => (
          <TableRow key={seg.id}>
            <TableCell className="text-sm">
              {new Date(seg.created_at).toLocaleString('es-ES')}
            </TableCell>
            <TableCell>
              <Badge className={ESTADOS_COLORS[seg.estado_nuevo] || 'bg-gray-100 text-gray-800'}>
                {seg.estado_nuevo}
              </Badge>
            </TableCell>
            <TableCell className="text-sm max-w-xs truncate">
              {seg.comentario || '-'}
            </TableCell>
            <TableCell className="text-sm">
              {seg.usuario?.nombre || 'Sistema'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
