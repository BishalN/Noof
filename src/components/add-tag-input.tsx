"use client";

import { Note, useCreateTag, useUpdateNote } from "@/db/data";
import { FormEventHandler, useState } from "react";
import { TagSuggestionPopover } from "./tag-suggestion-popover";

interface AddTagInputProps {
  note: Note;
}

// TODO: show a list of tags that are already available before creating new one
// as soon as user starts typing, show a list of tags that match the input
// if user selects one of the tags, then add that tag to the note
// if user presses enter, then create a new tag and add it to the note
// if user presses esc, then close the tag input

export function AddTagInput({ note }: AddTagInputProps) {
  const [tag, setTag] = useState<string>("");

  // First create tag
  const { mutateAsync: createTag } = useCreateTag();
  // associate tag with note
  const { mutateAsync: updateNote } = useUpdateNote();

  const handleAddTag = async (e: any) => {
    e.preventDefault();
    if (tag.trim() === "") return;
    const tagRes = await createTag({
      name: tag,
      type: "tag",
      notes: [note.id as string],
    });
    await updateNote({
      name: note.name,
      content: note.content,
      id: note.id,
      notebook: note.notebook,
      tags: [...note.tags, tagRes.id],
      rev: note.rev,
      type: "note",
    });
    setTag("");
  };
  return (
    <form className=" px-2" onSubmit={handleAddTag}>
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Add tag"
        className="inline-block max-w-[150px] border-none outline-none ring-0 focus:ring-0 focus:outline-none"
      />
      <TagSuggestionPopover
        open={tag.trim().length > 0}
        search={tag.trim()}
        note={note}
      />
    </form>
  );
}
