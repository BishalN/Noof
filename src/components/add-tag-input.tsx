"use client";

import { Note, useCreateTag, useUpdateNote } from "@/db/data";
import { FormEventHandler, useState } from "react";

interface AddTagInputProps {
  note: Note;
}

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
    </form>
  );
}
