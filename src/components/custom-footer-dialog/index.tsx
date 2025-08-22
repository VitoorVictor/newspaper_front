import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

interface CustomFooterDialogProps {
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  isUpdate: boolean;
  label: string;
}

export function CustomFooterDialog({ onOpenChange, isSubmitting, isUpdate, label }: CustomFooterDialogProps) {
  return (
    <DialogFooter className="flex-shrink-0 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-2 inline-block text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {isUpdate ? "Atualizando..." : "Criando..."} {label}
          </>
        ) : (
          <>{isUpdate ? "Atualizar" : "Criar"} {label}</>
        )}
      </Button>
    </DialogFooter>
  );
}
