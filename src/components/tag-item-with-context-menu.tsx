import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tag } from "@/db/data";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RenameTag } from "./rename-tag-dialog";
import { DeleteTagAlertDialog } from "./delete-tag-alert-dialog";

interface TagItemWithContextMenuProps {
  tag: Tag;
}

export function TagItemWithContextMenu({ tag }: TagItemWithContextMenuProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const { tagsId } = useParams();

  return (
    <>
      <RenameTag
        tag={tag}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />

      <DeleteTagAlertDialog
        tag={tag}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <ContextMenu>
        <ContextMenuTrigger>
          <p
            key={tag.id}
            onClick={() => {
              router.push(`/tag/${tag.id}`);
            }}
            className={cn(
              "flex justify-between hover:bg-slate-300 rounded-md px-2 py-1 cursor-pointer",
              tagsId === tag.id && "bg-slate-300"
            )}
          >
            <span>{tag.name}</span>
            <span>{tag.notes?.length || "0"}</span>
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={() => setIsRenameDialogOpen(true)}>
            Rename Tag
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setIsDeleteDialogOpen(true)}>
            Delete Tag
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
