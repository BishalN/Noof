"use client";

import {
  Note,
  useCreateNote,
  useGetNotes,
  useGetNotesBySelection,
} from "@/db/data";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection";
import { Button } from "./ui/button";
import { CopyPlus } from "lucide-react";
import { useMemo } from "react";
import { useSelectedNoteStore } from "@/store/note-editor-selection-store";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SubSidebar({ className }: SubSidebarProps) {
  const { selection, setSelection } = useSelectionStore();
  const { data: notesData, isLoading: isNotesDataLoading } = useGetNotes();

  const { mutateAsync: createNotebook, isLoading: isCreateNotebookLoading } =
    useCreateNote();

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

  const handleCreateNotebook = async () => {
    console.log("create notebook");
    const newNote = await createNotebook({
      name: "Untitled",
      content: "Just type",
      type: "note",
      tags: [],
      notebook: selection?.id,
    });
    // update the selectionStore to add new note to the list
    setSelection({ ...selection, notes: [...selection.notes, newNote.id] });

    // TODO: focus on the editor
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
          <Button onClick={handleCreateNotebook} variant="ghost" size="icon">
            <CopyPlus className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        <div className="space-y-1">
          {notes.map((note) => {
            return <NoteCard key={note.id} {...note} />;
          })}
        </div>
      </div>
    </div>
  );
}

export function NoteCard(note: Note) {
  const { selectedNote, setSelectedNote } = useSelectedNoteStore();

  return (
    <div
      className={cn(
        "px-3 py-2 cursor-pointer hover:bg-gray-200",
        selectedNote.id === note.id && "bg-gray-300"
      )}
      onClick={() => setSelectedNote(note)}
    >
      <p className=" font-semibold">{note.name}</p>
      <div className="flex space-x-2 text-muted-foreground">
        <p>2 hours ago</p>
        <p className="space-x-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-300 text-gray-600 rounded-sm px-1"
            >
              {tag}
            </span>
          ))}
        </p>
      </div>
      <p className="text-muted-foreground">{note.content}</p>
    </div>
  );
}
