import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCambiarEstado } from "../hooks/useCambiarEstado.js";
import { toast } from "sonner";

const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ["EN_FIRMAS", "ANULADO"],
  EN_FIRMAS: ["PRESENTADO", "OBSERVADO", "ANULADO"],
  OBSERVADO: ["EN_FIRMAS", "PRESENTADO", "ANULADO"],
  PRESENTADO: ["INSCRITO", "OBSERVADO"],
  INSCRITO: ["CERRADO"],
  CERRADO: [],
  ANULADO: [],
};

const ESTADOS_LABELS = {
  REGISTRADO: "Registrado",
  EN_FIRMAS: "En Firmas",
  PRESENTADO: "Presentado",
  OBSERVADO: "Observado",
  INSCRITO: "Inscrito",
  CERRADO: "Cerrado",
  ANULADO: "Anulado",
};

const formSchema = z.object({
  estado_nuevo: z.string().min(1, "Selecciona un estado"),
  comentario: z.string().optional().default(""),
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
      estado_nuevo: "",
      comentario: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        estado_nuevo: "",
        comentario: "",
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
          nuevoEstado: data.estado_nuevo,
          comentario: data.comentario || "",
        },
      });

      onOpenChange(false);
    } catch {
      toast.error("Error al cambiar el estado");
    }
  };

  const isLoading = cambiarMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-black bg-white overflow-visible"
      >
        <SheetHeader>
          <SheetTitle>Cambiar Estado del Trámite</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 py-6 space-y-6 overflow-visible">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Trámite</p>

              <p className="font-medium">{tramite?.codigo}</p>

              <p className="text-sm text-gray-600">
                {tramite?.marca} {tramite?.modelo}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Estado actual</Label>

              <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                <span className="font-medium">
                  {ESTADOS_LABELS[tramite?.estado]}
                </span>
              </div>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
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
                    <p className="text-sm text-red-500">
                      {errors.estado_nuevo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Comentario (opcional)</Label>

                  <Input
                    {...register("comentario")}
                    placeholder="Comentario sobre el cambio de estado"
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            {transicionesDisponibles.length > 0 && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cambiando..." : "Cambiar Estado"}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
