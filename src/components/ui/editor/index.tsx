"use client";

import { use, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { EditorBubbleMenu } from "./components";
import { useGetNoteByParams, useUpdateNote } from "@/db/data";
import { NotebookSelectionMenu } from "@/components/notebook-selection-menu";
import { AddTagInput } from "@/components/add-tag-input";
import { DisplayTags } from "@/components/display-tags";
import { useParams } from "next/navigation";

// TODO: first time application open may be create some template notes for the user
// Instead of blank screen

export function Editor() {
  const {
    data: selectedNoteData,
    isLoading: isSelectedNoteLoading,
    error,
  } = useGetNoteByParams();

  const { mutateAsync: updateNote, isLoading: isUpdateNoteLoading } =
    useUpdateNote();

  // TODO: make a call to rename note book name should be debounced
  const [title, setTitle] = useState(
    selectedNoteData?.note?.name ?? "Untitled"
  );

  const { noteId } = useParams();

  const debouncedTitleUpdates = useDebouncedCallback(async () => {
    await updateNote({
      name: title,
      content: selectedNoteData?.note?.content,
      id: selectedNoteData?.note?.id,
      notebook: selectedNoteData?.note?.notebook as string,
      tags: selectedNoteData?.note?.tags as string[],
      type: "note",
      rev: selectedNoteData?.note?.rev,
    });
  }, 750);

  const handleNoteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedTitleUpdates();
  };

  const [saveStatus, setSaveStatus] = useState("Saved");

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    // setContent(json);
    await updateNote({
      name: title as string,
      content: JSON.stringify(json),
      id: selectedNoteData?.note?.id,
      notebook: selectedNoteData?.note?.notebook as string,
      tags: selectedNoteData?.note?.tags as string[],
      type: "note",
      rev: selectedNoteData?.note?.rev as string,
    });
    setSaveStatus("Saved");
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      const selection = e.editor.state.selection;
      const lastTwo = e.editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n"
      );
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        complete(e.editor.getText());
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
        debouncedUpdates(e);
      }
    },
    autofocus: "end",
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate Limit Reached");
        return;
      }
    },
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

  // Hydrate the editor with the content from indexdb.
  useEffect(() => {
    if (editor && selectedNoteData?.note.content && !hydrated) {
      editor.commands.setContent(selectedNoteData?.note.content);
      setHydrated(true);
    }
  }, [editor, selectedNoteData, hydrated]);

  if (!noteId) {
    // TODO: make a proper empty state for this
    return <div>Please select or create a new note to start editing</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={handleNoteNameChange}
          placeholder="Untitled"
          className="w-full text-2xl font-bold text-stone-500 bg-transparent border-none outline-none"
        />
        <div className="flex space-x-1 items-center">
          <NotebookSelectionMenu
            currentNotebookName={selectedNoteData?.notebook?.name!}
            note={selectedNoteData?.note!}
          />
          <DisplayTags tagIds={selectedNoteData?.note.tags!} />
          <AddTagInput note={selectedNoteData?.note!} />
        </div>
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="relative min-h-full w-full max-w-screen-lg "
      >
        <div className="absolute right-5 top-1 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
          {saveStatus}
        </div>
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
