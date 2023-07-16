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
import { Tag, useDeleteTag } from "@/db/data";
import { Loader2 } from "lucide-react";

interface DeleteTagAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tag: Tag;
}

export function DeleteTagAlertDialog({
  isOpen,
  tag,
  onOpenChange,
}: DeleteTagAlertDialogProps) {
  const { mutateAsync: deleteTag, isLoading } = useDeleteTag();

  const handleDeleteTag = async () => {
    await deleteTag(tag);
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
          <AlertDialogAction onClick={handleDeleteTag} disabled={isLoading}>
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
