"use client";

import {
  Note,
  Notebook,
  Tag,
  reldb,
  useCreateNote,
  useCreateNotebook,
  useCreateTag,
  useDeleteNotebook,
  useGetNotebooks,
  useGetNotes,
  useGetTags,
  useUpdateNotebook,
} from "@/db/data";
import { useState } from "react";

export default function NotesPage() {
  const [clearLoading, setClearLoading] = useState(false);
  const handleClearDatabase = async () => {
    setClearLoading(true);
    await reldb.destroy();
    setClearLoading(false);
  };
  return (
    <div className="container mx-auto my-4">
      <h1>Welcome to your note</h1>
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
      <div className="space-y-5">
        <CreateNoteBookForm />
        <DisplayNoteBookList />
        <CreateTagsForm />
        <DisplayTagList />
        <CreateNotesForm />
        <DisplayNotesList />
      </div>
    </div>
  );
}

const CreateNoteBookForm = () => {
  const [notebook, setNotebook] = useState<Notebook>({
    name: "",
    notes: [],
    type: "notebook",
  });
  const { mutateAsync: createNotebook, isLoading: isCreateNotebookLoading } =
    useCreateNotebook();

  const { data: notesData, isLoading: isNotesLoading } = useGetNotes();

  const handleCreateNotebook = async () => {
    await createNotebook(notebook);
    setNotebook({ name: "", notes: [], type: "notebook" });
  };
  return (
    <form className="flex flex-col max-w-md">
      <h1 className="my-4">Create Notebook</h1>
      <label htmlFor="author">Notebook Name</label>
      <input
        type="text"
        className="border-2 border-gray-500 rounded-md p-2"
        value={notebook?.name}
        onChange={(e) => setNotebook({ ...notebook, name: e.target.value })}
      />

      <label htmlFor="chooseNotes">Select Notes</label>
      {notesData?.notes.map((note) => {
        return (
          <div key={note.id} className="space-x-2">
            <input
              onChange={() => {
                setNotebook({
                  ...notebook,
                  notes: [...notebook.notes, note.id as string],
                });
              }}
              checked={notebook.notes.includes(note.id as string)}
              type="checkbox"
              name={note.name}
              id={note.id}
            />
            <label htmlFor={note.name}>{note.name}</label>
          </div>
        );
      })}

      <button
        type="button"
        className="border-2 border-gray-500 rounded-md p-2 my-4"
        onClick={handleCreateNotebook}
      >
        Create Notebook
      </button>
    </form>
  );
};

const DisplayNoteBookList = () => {
  const [notebookState, setNotebookState] = useState<{
    isEditing: boolean;
    id: string;
  }>({
    isEditing: false,
    id: "",
  });

  const { data: notebooksData, isLoading: isNotebooksLoading } =
    useGetNotebooks();

  const { mutateAsync: deleteNotebook, isLoading: isDeleteNotebookLoading } =
    useDeleteNotebook();

  const handleDeleteNotebook = async (notebook: Notebook) => {
    await deleteNotebook(notebook);
  };

  if (isNotebooksLoading) return <div>Loading...</div>;
  if (!isNotebooksLoading && notebooksData?.notebooks.length === 0)
    return <div>No notebooks found</div>;

  return (
    <div>
      <h1>Notebook List</h1>
      {notebooksData?.notebooks.map((notebook) => {
        return (
          <div
            key={notebook.id}
            className="my-4 max-w-xl bg-slate-400 p-2 rounded-sm"
          >
            <p>{notebook.id}</p>
            {notebookState.id === notebook.id && notebookState.isEditing ? (
              <UpdateNotebookForm {...notebook} />
            ) : (
              <div>
                <p>{notebook.name}</p>
                <p>{notebook.notes}</p>
              </div>
            )}

            <div className="space-x-4">
              <button
                onClick={() =>
                  setNotebookState({
                    id: notebook.id as string,
                    isEditing: !notebookState.isEditing,
                  })
                }
                className="bg-slate-200 rounded-md py-1 px-2"
              >
                Edit
              </button>
              <button onClick={() => handleDeleteNotebook(notebook)}>
                {isDeleteNotebookLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const UpdateNotebookForm: React.FC<Notebook> = (prop) => {
  const [notebook, setNotebook] = useState<Notebook>(prop);

  const { mutateAsync: updateNotebook, isLoading: isUpdateNotebookLoading } =
    useUpdateNotebook();

  const { data: notesData, isLoading: isNotesLoading } = useGetNotes();

  const handleUpdateNotebook = async () => {
    await updateNotebook(notebook);
    setNotebook({ name: "", notes: [], type: "notebook" });
  };

  return (
    <form className="flex flex-col max-w-md">
      <h1 className="my-4">Update Notebook</h1>
      <label htmlFor="author">Notebook Name</label>
      <input
        type="text"
        className="border-2 border-gray-500 rounded-md p-2"
        value={notebook?.name}
        onChange={(e) => setNotebook({ ...notebook, name: e.target.value })}
      />

      <label htmlFor="chooseNotes">Select Notes</label>
      {notesData?.notes.map((note) => {
        return (
          <div key={note.id} className="space-x-2">
            <input
              onChange={() => {
                setNotebook({
                  ...notebook,
                  notes: [...notebook.notes, note.id as string],
                });
              }}
              checked={notebook.notes.includes(note.id as string)}
              type="checkbox"
              name={note.name}
              id={note.id}
            />
            <label htmlFor={note.name}>{note.name}</label>
          </div>
        );
      })}

      <button
        type="button"
        className="border-2 border-gray-500 rounded-md p-2 my-4"
        onClick={handleUpdateNotebook}
      >
        {isUpdateNotebookLoading ? <div>Loading...</div> : "Update Notebook"}
      </button>
    </form>
  );
};

const CreateTagsForm = () => {
  const [tag, setTag] = useState<Tag>({
    name: "",
    notes: [],
    type: "tag",
  });
  const { mutateAsync: createTag, isLoading: isCreateTagLoading } =
    useCreateTag();

  const { data: notesData, isLoading: isNotesLoading } = useGetNotes();

  const handleCreateTag = async () => {
    await createTag(tag);
    setTag({ name: "", notes: [], type: "tag" });
  };
  return (
    <form className="flex flex-col max-w-md">
      <h1 className="my-4">Create Tag</h1>
      <label htmlFor="author">Tag Name</label>
      <input
        type="text"
        className="border-2 border-gray-500 rounded-md p-2"
        value={tag?.name}
        onChange={(e) => setTag({ ...tag, name: e.target.value })}
      />

      <label htmlFor="chooseNotes">Select Notes</label>
      {notesData?.notes.map((note) => {
        return (
          <div key={note.id} className="space-x-2">
            <input
              onChange={() => {
                setTag({
                  ...tag,
                  notes: [...tag.notes, note.id as string],
                });
              }}
              checked={tag.notes.includes(note.id as string)}
              type="checkbox"
              name={note.name}
              id={note.id}
            />
            <label htmlFor={note.name}>{note.name}</label>
          </div>
        );
      })}

      <button
        type="button"
        className="border-2 border-gray-500 rounded-md p-2 my-4"
        onClick={handleCreateTag}
      >
        {isCreateTagLoading ? "Creating..." : "Create Tag"}
      </button>
    </form>
  );
};

const DisplayTagList = () => {
  const { data: tagsData, isLoading: isTagsDataLoading } = useGetTags();
  if (isTagsDataLoading) return <div>Loading...</div>;
  if (!isTagsDataLoading && tagsData?.tags.length === 0)
    return <div>No tags found</div>;
  return (
    <div>
      <h1>Tag List</h1>
      {tagsData?.tags.map((tag) => {
        return (
          <div key={tag.id} className="my-4 bg-slate-400 p-2 rounded-sm">
            <p>{tag.id}</p>
            <p>{tag.name}</p>
            <p>{tag.notes}</p>
          </div>
        );
      })}
    </div>
  );
};

const CreateNotesForm = () => {
  const [note, setNote] = useState<Note>({
    name: "",
    content: "",
    type: "note",
    notebook: "",
    tags: [],
  });

  const { mutateAsync: createNote, isLoading: isCreateNoteLoading } =
    useCreateNote();

  const handleCreateNote = async () => {
    await createNote(note);
    setNote({
      name: "",
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
      notebook: "",
      tags: [],
    });
  };

  const { data: notebooksData, isLoading: isNotebooksDataLoading } =
    useGetNotebooks();
  const { data: tagsData, isLoading: isTagsDataLoading } = useGetTags();

  if (isNotebooksDataLoading || isTagsDataLoading) return <div>Loading...</div>;

  return (
    <form className="flex flex-col max-w-md">
      <h1 className="my-4">Create Note</h1>
      <label htmlFor="author">Note Name</label>
      <input
        type="text"
        className="border-2 border-gray-500 rounded-md p-2"
        value={note.name}
        onChange={(e) => setNote({ ...note, name: e.target.value })}
      />

      <label htmlFor="content">Content</label>
      <textarea
        name="content"
        id="content"
        className="border-2 border-gray-500 rounded-md p-2"
        cols={30}
        rows={10}
        value={note?.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />

      <label htmlFor="chooseNotes">Select Notebook</label>
      <select
        className="border-2 border-gray-500 rounded-md px-4 py-2"
        name="chooseNotes"
        id="chooseNotes"
        value={note.notebook}
        onChange={(e) =>
          setNote({
            ...note,
            notebook: e.target.value,
          })
        }
      >
        {notebooksData?.notebooks.map((notebook) => {
          return (
            <option key={notebook.id} value={notebook.id}>
              {notebook.name}
            </option>
          );
        })}
      </select>

      <label htmlFor="chooseTags">Select Tags</label>
      {tagsData?.tags.map((tag) => {
        return (
          <div key={tag.id} className="space-x-2">
            <input
              onChange={() => {
                setNote({
                  ...note,
                  tags: [...note.tags, tag.id as string],
                });
              }}
              checked={note.tags.includes(tag.id as string)}
              type="checkbox"
              name={tag.name}
              id={tag.id}
            />
            <label htmlFor={tag.name}>{tag.name}</label>
          </div>
        );
      })}

      <button
        type="button"
        className="border-2 border-gray-500 rounded-md p-2 my-4"
        onClick={handleCreateNote}
      >
        Create Notebook
      </button>
    </form>
  );
};

const DisplayNotesList = () => {
  const { data: notesData, isLoading: isNotesLoading } = useGetNotes();
  if (isNotesLoading) return <div>Loading...</div>;
  if (!isNotesLoading && notesData?.notes.length === 0)
    return <div>No notes found</div>;
  return (
    <div>
      <h1>Notes List</h1>
      {notesData?.notes.map((note) => {
        return (
          <div key={note.id} className="my-4 bg-slate-400 p-2 rounded-sm">
            <p>{note.id}</p>
            <p>{note.name}</p>
            <p>{note.content}</p>
            <p>Belongs to {note.notebook}</p>
            <p>{note.tags}</p>
          </div>
        );
      })}
    </div>
  );
};
