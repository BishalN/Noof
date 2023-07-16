"use client";
import { useParams, useRouter } from "next/navigation";

import {
  Note,
  RelationalIndexDBContext,
  useCreateNote,
  useGetNotes,
} from "@/db/data";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection";
import { Button } from "./ui/button";
import { CopyPlus } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { DisplayTags, DisplayTagsOnNoteCard } from "./display-tags";
import { NoteCardWithContextMenu } from "./note-card-with-context-menu";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SubSidebar({ className }: SubSidebarProps) {
  const { reldb } = useContext(RelationalIndexDBContext);

  const { selection, setSelection } = useSelectionStore();

  const { data: notesData, isLoading: isNotesDataLoading } = useGetNotes();

  const { mutateAsync: createNote, isLoading: isCreateLoading } =
    useCreateNote();

  const [clearLoading, setClearLoading] = useState(false);

  const router = useRouter();

  const notes = useMemo(() => {
    if (!selection || !notesData) return [];
    if (selection.type === "tag") {
      return notesData?.notes.filter(
        (note) =>
          note.tags.includes(selection.id) ||
          selection.notes.includes(note.id as string)
      );
    }
    return notesData?.notes.filter((note) => note.notebook === selection.id);
  }, [selection, notesData]);

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
      tags: [],
      notebook: selection?.id,
    });
    // update the selectionStore to add new note to the list
    setSelection({ ...selection, notes: [...selection.notes, newNote.id] });

    // push the new note id to the url
    router.push(`/note/${newNote.id}`);
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
          {notes.map((note) => {
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

export function NoteCard(note: Note) {
  const router = useRouter();
  const { noteId } = useParams();

  // TODO: add a new field to notes as excerpt content

  return (
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
  );
}
