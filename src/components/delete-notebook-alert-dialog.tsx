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
import { Notebook, useDeleteNotebook } from "@/db/data";
import { Loader2 } from "lucide-react";

interface DeleteNotebookAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  notebook: Notebook;
}

export function DeleteNotebookAlertDialog({
  isOpen,
  notebook,
  onOpenChange,
}: DeleteNotebookAlertDialogProps) {
  const { mutateAsync: deleteNotebook, isLoading } = useDeleteNotebook();
  const handleDeleteNotebook = async () => {
    await deleteNotebook(notebook);
    onOpenChange(false);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteNotebook}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> {"  "}
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
