import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEliminarTramite } from "../hooks/useEliminarTramite.js";

export function EliminarTramiteModal({
  open,
  onOpenChange,
  tramite,
  onSuccess,
}) {
  const eliminarMutation = useEliminarTramite();

  const handleDelete = async () => {
    try {
      await eliminarMutation.mutateAsync(tramite.id);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Error is handled by the hook via toast
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-black bg-white !opacity-100">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar trámite?</AlertDialogTitle>

          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            trámite{" "}
            <span className="font-medium">{tramite?.codigo}</span> y todos sus
            datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border border-black">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={eliminarMutation.isPending}
            className="border border-black bg-red-600 hover:bg-red-700"
          >
            {eliminarMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}