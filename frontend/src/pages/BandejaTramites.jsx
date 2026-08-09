import { useState } from 'react';
import { useTramites } from '@/modules/tramite/hooks/useTramites.js';
import {
  TramiteForm,
  CambiarEstadoModal,
  EliminarTramiteModal,
  TramiteDetalle,
} from '@/modules/tramite/index.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Eye, Edit, Trash2, ArrowRight, Loader2 } from 'lucide-react';

const ESTADOS = ['REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO'];

const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ['EN_FIRMAS', 'ANULADO'],
  EN_FIRMAS: ['PRESENTADO', 'OBSERVADO', 'ANULADO'],
  OBSERVADO: ['EN_FIRMAS', 'PRESENTADO', 'ANULADO'],
  PRESENTADO: ['INSCRITO', 'OBSERVADO'],
  INSCRITO: ['CERRADO'],
  CERRADO: [],
  ANULADO: [],
};

const getEstadoColor = (estado) => {
  const colors = {
    REGISTRADO: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    'EN_FIRMAS': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    PRESENTADO: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    OBSERVADO: 'bg-red-100 text-red-800 hover:bg-red-100',
    INSCRITO: 'bg-green-100 text-green-800 hover:bg-green-100',
    CERRADO: 'bg-gray-600 text-white hover:bg-gray-600',
    ANULADO: 'bg-gray-300 text-gray-600 hover:bg-gray-300',
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};

export function BandejaTramites() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [openForm, setOpenForm] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openCambiarEstado, setOpenCambiarEstado] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);

  const { data, isLoading, error, refetch } = useTramites({
    estado: filtroEstado,
    search,
    page,
    limit,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleNuevo = () => {
    setSelectedTramite(null);
    setOpenForm(true);
  };

  const handleEditar = (tramite) => {
    setSelectedTramite(tramite);
    setOpenForm(true);
  };

  const handleVer = (tramite) => {
    setSelectedTramite(tramite);
    setOpenDetalle(true);
  };

  const handleCambiarEstado = (tramite) => {
    setSelectedTramite(tramite);
    setOpenCambiarEstado(true);
  };

  const handleEliminar = (tramite) => {
    setSelectedTramite(tramite);
    setOpenEliminar(true);
  };

  const canEdit = (estado) => !['CERRADO', 'ANULADO'].includes(estado);
  const canCambiarEstado = (estado) => !['CERRADO', 'ANULADO'].includes(estado);
  const canEliminar = (estado) => !['INSCRITO', 'CERRADO', 'ANULADO'].includes(estado);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando trámites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error al cargar los trámites</p>
          <p className="text-sm">{error.mensaje || 'Intenta nuevamente'}</p>
        </div>
      </div>
    );
  }

  const tramites = data?.data?.tramites || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bandeja de Trámites</h1>
        <Button className="flex items-center gap-2" onClick={handleNuevo}>
          <Plus className="h-4 w-4" />
          Nuevo Trámite
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por código, documento o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los estados</SelectItem>
            {ESTADOS.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tramites.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-gray-500">
                  No se encontraron trámites
                </TableCell>
              </TableRow>
            ) : (
              tramites.map((tramite) => (
                <TableRow key={tramite.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {tramite.codigo}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {tramite.cliente?.nombres} {tramite.cliente?.ap_paterno}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tramite.cliente?.tipo_doc}: {tramite.cliente?.num_doc}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {tramite.marca} {tramite.modelo}
                    </div>
                    <div className="text-xs text-gray-500">{tramite.anio}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(tramite.estado)}>
                      {tramite.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(tramite.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleVer(tramite)}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditar(tramite)}
                        disabled={!canEdit(tramite.estado)}
                        title={!canEdit(tramite.estado) ? 'No editable en este estado' : 'Editar'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCambiarEstado(tramite)}
                        disabled={!canCambiarEstado(tramite.estado) || TRANSICIONES_PERMITIDAS[tramite.estado]?.length === 0}
                        title={!canCambiarEstado(tramite.estado) ? 'No se puede cambiar estado' : 'Cambiar estado'}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleEliminar(tramite)}
                        disabled={!canEliminar(tramite.estado)}
                        title={!canEliminar(tramite.estado) ? 'No se puede eliminar en este estado' : 'Eliminar'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} de {total} trámites
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      <TramiteForm
        open={openForm}
        onOpenChange={setOpenForm}
        tramite={selectedTramite}
      />

      <TramiteDetalle
        open={openDetalle}
        onOpenChange={setOpenDetalle}
        tramiteId={selectedTramite?.id}
      />

      <CambiarEstadoModal
        open={openCambiarEstado}
        onOpenChange={setOpenCambiarEstado}
        tramite={selectedTramite}
      />

      <EliminarTramiteModal
        open={openEliminar}
        onOpenChange={setOpenEliminar}
        tramite={selectedTramite}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
