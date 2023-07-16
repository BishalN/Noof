"use client";
import { useParams, usePathname, useRouter } from "next/navigation";

import {
  RelationalIndexDBContext,
  useCreateNote,
  useGetNotes,
} from "@/db/data";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection";
import { Button } from "./ui/button";
import { CopyPlus } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { NoteCardWithContextMenu } from "./note-card-with-context-menu";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// TODO: use the params to determine which notebook is selected
// so that means we need to change our structure a little as
// /notebook/[notebookId]/note/[noteId]
// /tag/[tagsId]/note/[noteId]

// current navigation structure:
// /note/[noteId]
export function SubSidebar({ className }: SubSidebarProps) {
  const { reldb } = useContext(RelationalIndexDBContext);

  const { notebookId, noteId, tagsId } = useParams();

  const { selection, setSelection } = useSelectionStore();

  const { data: notesData, isLoading: isNotesDataLoading } = useGetNotes();

  const { mutateAsync: createNote, isLoading: isCreateLoading } =
    useCreateNote();

  const [clearLoading, setClearLoading] = useState(false);

  const router = useRouter();

  const notes = useMemo(() => {
    // for path /tag/[tagsId]/note/[noteId]
    if (tagsId) {
      return notesData?.notes.filter((note) => note.tags.includes(tagsId));
    }

    // for path /notebook/[notebookId]/note/[noteId]
    return notesData?.notes.filter((note) => note.notebook === notebookId);
  }, [notebookId, notesData, tagsId]);

  if (isNotesDataLoading) return <div>Loading...</div>;

  const handleCreateNote = async () => {
    const newNote = await createNote({
      name: "Untitled",
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
      type: "note",
      tags: [tagsId ? tagsId : ""],
      notebook: selection?.id,
    });
    // update the selectionStore to add new note to the list
    setSelection({ ...selection, notes: [...selection.notes, newNote.id] });

    // push the new note id to the url
    // handle the case where we are in the tagsId path
    if (tagsId) {
      router.push(`/tag/${tagsId}/note/${newNote.id}`);
      return;
    }
    router.push(`/notebook/${notebookId}/note/${newNote.id}`);
  };

  const handleClearDatabase = async () => {
    setClearLoading(true);
    await reldb.destroy();
    setClearLoading(false);
  };

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
            {selection?.name}
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

        <button
          onClick={handleClearDatabase}
          className="my-4 bg-slate-400 rounded-sm p-2 text-white"
          disabled={clearLoading}
        >
          {clearLoading ? (
            <div>
              <span>Clearing Database</span>
              <div className="animate-spin">🔄</div>
            </div>
          ) : (
            "Reset Database"
          )}
        </button>
      </div>
    </div>
  );
}

// TODO: add a new field to notes as excerpt content
