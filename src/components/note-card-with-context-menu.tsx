import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Note } from "@/db/data";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RenameNoteDialog } from "./rename-note-dialog";
import { DeleteNoteAlertDialog } from "./delete-note-alert-dialog";
import { DisplayTagsOnNoteCard } from "./display-tags";
import { useParams, useRouter } from "next/navigation";

interface NotebookItemWithContextMenuProps {
  note: Note;
}

export function NoteCardWithContextMenu({
  note,
}: NotebookItemWithContextMenuProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { noteId } = useParams();
  const router = useRouter();

  return (
    <>
      <RenameNoteDialog
        note={note}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />

      <DeleteNoteAlertDialog
        note={note}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "px-3 py-2 cursor-pointer hover:bg-gray-200",
              noteId === note.id && "bg-gray-300"
            )}
            onClick={() => {
              // push to new page
              router.push(`/note/${note.id}`);
            }}
          >
            <p className=" font-semibold">{note.name}</p>
            <div className="flex space-x-2 text-muted-foreground">
              <p>2 hours ago</p>
              <p className="space-x-3">
                <DisplayTagsOnNoteCard tagIds={note.tags} />
              </p>
            </div>
            {/* <p className="text-muted-foreground">{note.content}</p> */}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={() => setIsRenameDialogOpen(true)}>
            Rename Note Title
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setIsDeleteDialogOpen(true)}>
            Delete Note
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
