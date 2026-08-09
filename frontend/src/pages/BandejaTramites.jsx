import { useEffect, useState } from "react";
import { useTramites } from "@/modules/tramite/hooks/useTramites.js";
import {
  TramiteForm,
  CambiarEstadoModal,
  EliminarTramiteModal,
  TramiteDetalle,
} from "@/modules/tramite/index.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreHorizontal,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";

const ESTADOS = [
  "REGISTRADO",
  "EN_FIRMAS",
  "PRESENTADO",
  "OBSERVADO",
  "INSCRITO",
  "CERRADO",
  "ANULADO",
];

const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ["EN_FIRMAS", "ANULADO"],
  EN_FIRMAS: ["PRESENTADO", "OBSERVADO", "ANULADO"],
  OBSERVADO: ["EN_FIRMAS", "PRESENTADO", "ANULADO"],
  PRESENTADO: ["INSCRITO", "OBSERVADO"],
  INSCRITO: ["CERRADO"],
  CERRADO: [],
  ANULADO: [],
};

const getEstadoColor = (estado) => {
  const colors = {
    REGISTRADO: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    EN_FIRMAS: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    PRESENTADO: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    OBSERVADO: "bg-red-100 text-red-800 hover:bg-red-100",
    INSCRITO: "bg-green-100 text-green-800 hover:bg-green-100",
    CERRADO: "bg-gray-600 text-white hover:bg-gray-600",
    ANULADO: "bg-gray-300 text-gray-600 hover:bg-gray-300",
  };
  return colors[estado] || "bg-gray-100 text-gray-800";
};

export function BandejaTramites() {
  const [filtroEstado, setFiltroEstado] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();

      setPage(1);
      setSearch(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleNuevo = () => {
    setSelectedTramite(null);
    setOpenForm(true);
  };

  const handleEditar = (tramite) => {
    console.log("EDITAR:", tramite);
    console.log("FECHA:", tramite.cliente?.fecha_nac);

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

  const canEdit = (estado) => !["CERRADO", "ANULADO"].includes(estado);
  const canCambiarEstado = (estado) => !["CERRADO", "ANULADO"].includes(estado);
  const canEliminar = (estado) =>
    !["INSCRITO", "CERRADO", "ANULADO"].includes(estado);

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
          <p className="text-sm">{error.mensaje || "Intenta nuevamente"}</p>
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
        <h1 className="text-2xl font-bold text-gray-900">
          Bandeja de Trámites
        </h1>
        <Button className="flex items-center gap-2" onClick={handleNuevo}>
          <Plus className="h-4 w-4" />
          Nuevo Trámite
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Buscar por código, documento o nombre..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

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
              <TableHead>Fecha de nacimiento</TableHead>
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
                    {tramite.cliente?.fecha_nac
                      ? new Date(tramite.cliente.fecha_nac).toLocaleDateString(
                          "es-ES",
                          {
                            timeZone: "UTC",
                          },
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir acciones</span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-48 border border-black bg-white shadow-md"
                      >
                        <DropdownMenuItem onClick={() => handleVer(tramite)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalle
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleEditar(tramite)}
                          disabled={!canEdit(tramite.estado)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleCambiarEstado(tramite)}
                          disabled={
                            !canCambiarEstado(tramite.estado) ||
                            TRANSICIONES_PERMITIDAS[tramite.estado]?.length ===
                              0
                          }
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Cambiar estado
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleEliminar(tramite)}
                          disabled={!canEliminar(tramite.estado)}
                          className="border border-black text-red-600 bg-white focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, total)} de {total} trámites
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
