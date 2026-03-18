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
import type { FormularDocument } from "@/data/formular-types";

interface DeleteConfirmDialogProps {
  document: FormularDocument | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ document, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={!!document} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="rounded-sm shadow-modal sm:max-w-[440px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold">Dokument löschen</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Möchten Sie das Dokument <span className="font-semibold text-foreground">{document?.id}</span> für
            Fahrgestell-Nr. <span className="font-mono text-foreground">{document?.vin}</span> unwiderruflich löschen?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-sm">Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm"
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
