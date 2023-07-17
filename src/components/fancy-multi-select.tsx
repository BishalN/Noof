"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  Note,
  Tag,
  useCreateTag,
  useGetTags,
  useUpdateNote,
  useUpdateTag,
} from "@/db/data";

interface FancyMultiSelectProps {
  note: Note;
}

export function FancyMultiSelect({ note }: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: updateTag } = useUpdateTag();

  const { data: tagsData } = useGetTags();

  const tagsSuggestions = React.useMemo(() => {
    if (!tagsData?.tags) return [];
    return tagsData?.tags.filter((tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [tagsData, inputValue]);

  const selectedTags = React.useMemo(() => {
    if (!tagsData?.tags) return [];
    return tagsData?.tags.filter((tag) => note?.tags.includes(tag.id!));
  }, [tagsData, note?.tags]);

  const [selected, setSelected] = React.useState<Tag[]>(selectedTags);

  const handleSelect = async (selectedTag: Tag) => {
    setInputValue("");
    await updateNote({
      name: note.name,
      content: note.content,
      id: note.id,
      notebook: note.notebook,
      tags: [...note.tags, selectedTag?.id!],
      rev: note.rev,
      type: "note",
    });
    setSelected((prev) => [...prev, selectedTag]);
    setInputValue("");
  };

  const handleCreateAndAddTagToNote = async () => {
    console.log("create and add tag to note");
    if (inputRef?.current?.value.trim() === "") {
      console.log("input value is empty");
      return;
    }

    console.log(`note is`, JSON.stringify(note, null, 2));

    const tagRes = await createTag({
      name: inputRef?.current?.value!,
      type: "tag",
      notes: [note?.id as string],
    });

    // TODO: fix document update conflict here
    // await updateNote({
    //   name: note.name,
    //   content: note.content,
    //   id: note.id,
    //   notebook: note.notebook,
    //   tags: [...note?.tags, tagRes.id],
    //   rev: note.rev,
    //   type: "note",
    // });
    setInputValue("");
  };

  const handleUnselect = async (tag: Tag) => {
    await updateNote({
      name: note.name,
      content: note.content,
      id: note.id,
      notebook: note.notebook,
      tags: note.tags.filter((t) => t !== tag.id),
      rev: note.rev,
      type: "note",
    });

    // also update the tags side
    await updateTag({
      name: tag.name,
      id: tag.id,
      notes: tag.notes.filter((n) => n !== note.id),
      rev: tag.rev,
      type: "tag",
    });

    setSelected((prev) => prev.filter((s) => s.id !== tag.id));
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            // Update this from here as well
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }

        if (e.key === "Enter") {
          handleCreateAndAddTagToNote();
        }
      }
    },
    []
  );

  const selectables = React.useMemo(() => {
    return tagsSuggestions.filter((tag) => {
      return !selected.find((s) => s.id === tag.id);
    });
  }, [tagsSuggestions, selected]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="border-none max-w-xl overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((tag) => {
            return (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(tag);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(tag)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select or Create tags.."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((tag) => {
                return (
                  <CommandItem
                    key={tag.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      handleSelect(tag);
                    }}
                    className={"cursor-pointer"}
                  >
                    {tag.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
