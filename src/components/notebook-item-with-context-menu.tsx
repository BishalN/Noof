import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Notebook } from "@/db/data";
import { cn } from "@/lib/utils";
import { RenameNotebook } from "./rename-notebook-dialog";
import { useState } from "react";
import { DeleteNotebookAlertDialog } from "./delete-notebook-alert-dialog";
import { useParams, useRouter } from "next/navigation";

interface NotebookItemWithContextMenuProps {
  notebook: Notebook;
}

export function NotebookItemWithContextMenu({
  notebook,
}: NotebookItemWithContextMenuProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const { notebookId } = useParams();

  return (
    <>
      <RenameNotebook
        notebook={notebook}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />

      <DeleteNotebookAlertDialog
        notebook={notebook}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <ContextMenu>
        <ContextMenuTrigger>
          <p
            key={notebook.id}
            onClick={() => {
              router.push(`/notebook/${notebook.id}`);
            }}
            className={cn(
              "flex justify-between hover:bg-slate-300 rounded-md px-2 py-1 cursor-pointer",
              notebookId === notebook.id && "bg-slate-300"
            )}
          >
            <span>{notebook.name}</span>
            <span>{notebook.notes?.length || "0"}</span>
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={() => setIsRenameDialogOpen(true)}>
            Rename Notebook
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setIsDeleteDialogOpen(true)}>
            Delete Notebook
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
