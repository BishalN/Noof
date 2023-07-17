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
import { Note, useDeleteNote } from "@/db/data";
import { Loader2 } from "lucide-react";

interface DeleteNoteAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note: Note;
}

export function DeleteNoteAlertDialog({
  isOpen,
  note,
  onOpenChange,
}: DeleteNoteAlertDialogProps) {
  const { mutateAsync: deleteNote, isLoading } = useDeleteNote();
  const handleDeleteNote = async () => {
    await deleteNote(note);
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
          <AlertDialogAction onClick={handleDeleteNote} disabled={isLoading}>
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
