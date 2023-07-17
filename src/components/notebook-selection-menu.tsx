"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, ChevronDown } from "lucide-react";
import { Note, useGetNotebooks, useUpdateNote } from "@/db/data";

interface NotebookSelectionMenuProps {
  note: Note;
  currentNotebookName: string;
}

export function NotebookSelectionMenu({
  currentNotebookName,
  note,
}: NotebookSelectionMenuProps) {
  const [notebook, setNotebook] = React.useState("");

  const { mutateAsync: updateNote, isLoading: isUpdateNotebookLoading } =
    useUpdateNote();

  const { data: notebooksData, isLoading: isNotebooksDataLoading } =
    useGetNotebooks();

  const handleNoteUpdate = async (notebookId: string) => {
    setNotebook(notebookId);
    await updateNote({
      id: note.id,
      name: note.name,
      content: note.content,
      notebook: notebookId,
      tags: note.tags,
      type: "note",
      rev: note.rev,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Book className="h-4 w-4 mr-2" />
          {currentNotebookName}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Notebooks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={notebook}
          onValueChange={handleNoteUpdate}
        >
          {notebooksData?.notebooks?.map((notebook) => {
            return (
              <DropdownMenuRadioItem
                key={notebook.id}
                value={notebook.id as string}
              >
                {notebook.name}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
