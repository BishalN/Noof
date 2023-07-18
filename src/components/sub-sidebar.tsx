"use client";
import { useParams, useRouter } from "next/navigation";

import {
  useCreateNote,
  useGetNotebook,
  useGetNotes,
  useGetTag,
  useUpdateNotebook,
  useUpdateTag,
} from "@/db/data";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { CopyPlus } from "lucide-react";
import { useMemo } from "react";
import { NoteCardWithContextMenu } from "./note-card-with-context-menu";
import { SubSidebarSkeleton } from "./subsidebar-skeleton";
import LoadingCircle from "./ui/icons/loading-circle";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SubSidebar({ className }: SubSidebarProps) {
  const router = useRouter();
  const { notebookId, tagsId } = useParams();

  const { data: notesData, isLoading: isNotesDataLoading } = useGetNotes();
  const { data: notebooksData, isLoading: isNotebookDataLoading } =
    useGetNotebook(notebookId);
  const { data: tagsData, isLoading: isTagsDataLoading } = useGetTag(tagsId);

  const { mutateAsync: updateNotebook, isLoading: isUpdateNotebookLoading } =
    useUpdateNotebook();
  const { mutateAsync: updateTag, isLoading: isUpdateTagLoading } =
    useUpdateTag();
  const { mutateAsync: createNote, isLoading: isCreateNoteLoading } =
    useCreateNote();

  const notes = useMemo(() => {
    // for path /tag/[tagsId]/note/[noteId]
    if (tagsId) {
      return notesData?.notes.filter((note) => note.tags.includes(tagsId));
    }

    // for path /notebook/[notebookId]/note/[noteId]
    return notesData?.notes.filter((note) => note.notebook === notebookId);
  }, [notebookId, notesData, tagsId]);

  const handleCreateNote = async () => {
    const newNote = await createNote({
      name: "Untitled",
      type: "note",
      tags: [tagsId ? tagsId : ""],
      notebook: notebookId,
      date: new Date().toISOString(),
      content: `{
          "type": "doc",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "Just type"
                }
              ]
            }
          ]
        }`,
    });

    // update the notebooks side as well if not in tags page
    if (tagsId) {
      await updateTag({
        name: tagsData?.tag?.name as string,
        notes: [tagsData?.tag.notes, newNote.id],
        type: "tag",
        id: tagsData?.tag.id,
        rev: tagsData?.tag.rev,
      });
    } else {
      await updateNotebook({
        name: notebooksData?.notebook.name as string,
        notes: [...notebooksData?.notebook?.notes!, newNote.id],
        type: "notebook",
        id: notebooksData?.notebook.id,
        rev: notebooksData?.notebook.rev,
      });
    }

    // push the new note id to the url
    // handle the case where we are in the tagsId path
    if (tagsId) {
      router.push(`/tag/${tagsId}/note/${newNote.id}`);
      return;
    }
    router.push(`/notebook/${notebookId}/note/${newNote.id}`);
  };

  const isTagsPage = tagsId ? true : false;
  if (isTagsPage) {
    if (isNotesDataLoading || isTagsDataLoading) {
      return <SubSidebarSkeleton />;
    }
  } else if (isNotebookDataLoading || isNotesDataLoading || isTagsDataLoading) {
    return <SubSidebarSkeleton />;
  }

  return (
    <div
      className={cn(
        "pb-12 bg-gray-100  min-h-screen flex flex-col justify-between",
        className
      )}
    >
      <div className="h-full w-full space-y-3 py-4">
        <div className="px-3 flex items-center justify-between">
          <h2 className="px-4 text-center font-semibold tracking-tight">
            {notebooksData?.notebook?.name || tagsData?.tag.name}
          </h2>
          <Button onClick={handleCreateNote} variant="ghost" size="icon">
            <CopyPlus className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        <div className="space-y-1">
          {notes?.map((note) => {
            return <NoteCardWithContextMenu key={note.id} note={note} />;
          })}
        </div>

        {isUpdateNotebookLoading ||
        isUpdateTagLoading ||
        isCreateNoteLoading ? (
          <LoadingCircle />
        ) : null}
      </div>
    </div>
  );
}
