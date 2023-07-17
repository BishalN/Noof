"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Note, Tag, useCreateTag, useGetTags, useUpdateNote } from "@/db/data";

interface FancyMultiSelectProps {
  note: Note;
}

export function FancyMultiSelect({ note }: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: updateNote } = useUpdateNote();

  const { data: tagsData } = useGetTags();

  const tagsSuggestions = React.useMemo(() => {
    if (!tagsData?.tags) return [];
    return tagsData?.tags.filter((tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [tagsData, inputValue]);

  const [selected, setSelected] = React.useState<Tag[]>(tagsSuggestions);

  // Do this if user selects tag from selection menu
  const handleAddTagToNote = async (selectedTag: Tag) => {
    await updateNote({
      name: note.name,
      content: note.content,
      id: note.id,
      notebook: note.notebook,
      tags: [...note.tags, selectedTag?.id!],
      rev: note.rev,
      type: "note",
    });
    setInputValue("");
  };

  const handleCreateAndAddTagToNote = async () => {
    console.log("create and add tag to note");
    if (inputValue === "") return;
    const tagRes = await createTag({
      name: inputValue,
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
    setInputValue("");
  };

  const handleUnselect = React.useCallback((tag: Tag) => {
    // TODO: remove it from db as well
    setSelected((prev) => prev.filter((s) => s.id !== tag.id));
  }, []);

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

  // TODO: using id is better than using the name
  const selectables = tagsSuggestions.filter((tag) => !selected.includes(tag));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
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
            placeholder="Select tags.."
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
                    onSelect={(value) => {
                      setInputValue("");
                      setSelected((prev) => [...prev, tag]);
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