import { useParams, useSearchParams } from "next/navigation";
import { queryClient } from "@/app/providers";
import { useSelectionStore } from "@/store/selection";
import { useMutation, useQuery } from "@tanstack/react-query";
import PouchDB from "pouchdb";

import find from "pouchdb-find";
import rel from "relational-pouch";
import React from "react";

PouchDB.plugin(find).plugin(rel);

// TODO: I need to dynamically import this to context
// so that it only gets created on frontend
const db = new PouchDB("noof-dev");
export const reldb = db.setSchema([
  {
    singular: "notebook",
    plural: "notebooks",
    relations: {
      notes: { hasMany: "note" },
    },
  },
  {
    singular: "note",
    plural: "notes",
    relations: {
      notebook: { belongsTo: "notebook" },
      tags: { hasMany: "tag" },
    },
  },
  {
    singular: "tag",
    plural: "tags",
    relations: {
      notes: { hasMany: "note" },
    },
  },
]);

// create a context for reldb and wrap your app in it
export const RelationalIndexDBContext = React.createContext({
  reldb,
});

export type Note = {
  id?: string;
  rev?: string;
  name: string;
  excerpt?: string;
  content: any;
  type: "note";
  notebook: string;
  tags: string[];
};

export type Notebook = {
  id?: string;
  rev?: string;
  name: string;
  type: "notebook";
  notes: string[];
};

export type Tag = {
  id?: string;
  rev?: string;
  name: string;
  type: "tag";
  notes: string[];
};

export const useCreateNotebook = () => {
  return useMutation({
    mutationFn: async (notebook: Partial<Notebook>) => {
      const res = await reldb.rel.save("notebook", notebook);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

type GetNoteBooksResponse = {
  notebooks: Notebook[];
};
export const useGetNotebooks = () => {
  return useQuery<null, Error, GetNoteBooksResponse>({
    queryKey: ["notebooks"],
    queryFn: async () => {
      const res = await reldb.rel.find("notebook");
      return res;
    },
  });
};

type GetNoteBookResponse = {
  notebook: Notebook;
};
export const useGetNotebook = (id: string) => {
  return useQuery<null, Error, GetNoteBookResponse>({
    queryKey: ["notebook", id],
    queryFn: async () => {
      const res = await reldb.rel.find("notebook", id);
      return res;
    },
    enabled: !!id,
  });
};

export const useUpdateNotebook = () => {
  return useMutation({
    mutationFn: async (notebook: Notebook) => {
      const res = await reldb.rel.save("notebook", notebook);
      return res;
    },
    onSuccess: () => {
      // TODO: invalidate only one notebook
      // TODO: may be even all notes as well
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

export const useDeleteNotebook = () => {
  return useMutation({
    mutationFn: async (notebook: Notebook) => {
      // TODO: what happens to the notes in the notebook?
      // May be you can't delete a notebook if it has notes in it
      const res = await reldb.rel.del("notebook", notebook);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

export const useCreateNote = () => {
  const { selection } = useSelectionStore();
  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.save("note", note);
      // Associate it with the notebook of current selection
      // console.log("selection", JSON.stringify(selection, null, 2));
      // await reldb.rel.save(selection.type, {
      //   ...selection,
      //   notes: [...selection.notes, res.id],
      // });
      return res;
    },
    onSuccess: ({ id }) => {
      // TODO: invalidate only one notebook
      queryClient.invalidateQueries({
        queryKey: [selection.type, id],
      });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

type GetNotesResponse = {
  notes: Note[];
};
export const useGetNotes = () => {
  return useQuery<null, Error, GetNotesResponse>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await reldb.rel.find("note");
      return res;
    },
  });
};

type GetNoteResponse = {
  note: Note;
  notebook: Notebook;
};

export const useGetNote = (id: string) => {
  return useQuery<null, Error, GetNoteResponse>({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await reldb.rel.find("note", id);
      return res;
    },
  });
};

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.save("note", note);
      return res;
    },
    onSuccess: ({ id }) => {
      console.log("Update successfull note", id);
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

export const useDeleteNote = () => {
  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.del("note", note);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

export const useCreateTag = () => {
  return useMutation({
    mutationFn: async (tag: Tag) => {
      const res = await reldb.rel.save("tag", tag);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

type GetTagsResponse = {
  tags: Tag[];
};
export const useGetTags = () => {
  return useQuery<null, Error, GetTagsResponse>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await reldb.rel.find("tag");
      return res;
    },
  });
};

type GetTagResponse = {
  tag: Tag;
};
export const useGetTag = (id: string) => {
  return useQuery<null, Error, GetTagResponse>({
    queryKey: ["tag", id],
    queryFn: async () => {
      const res = await reldb.rel.find("tag", id);
      return res;
    },
  });
};

export const useUpdateTag = () => {
  return useMutation({
    mutationFn: async (tag: Tag) => {
      const res = await reldb.rel.save("tag", tag);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTag = () => {
  return useMutation({
    mutationFn: async (tag: Tag) => {
      const res = await reldb.rel.del("tag", tag);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useGetNotesBySelection = () => {
  const { selection } = useSelectionStore();
  return useQuery<null, Error, GetNotesResponse>({
    queryKey: [selection.type, selection.id],
    queryFn: async () => {
      const res = await reldb.rel.find("note", selection.notes);
      console.log(
        "useGetNotesBySelection-Input",
        JSON.stringify(selection, null, 2)
      );
      console.log(
        "useGetNotesBySelection-Output",
        JSON.stringify(res, null, 2)
      );
      return res;
    },
    cacheTime: 0,
  });
};

// I don't see data immediately after creating a note
// I see it after window refocus / reload
// I don't see notes when I change the notebook

// Since the selection is stored in a local storage
// Whenever selection changes the notes array is also gone has to start from scratch
// For that reason the indexdb's notebooks should also have the ids of the notes

// react query possible issues

export const useGetNoteByQueryParam = () => {
  // We're not getting noteId or something
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId");

  return useQuery<null, Error, GetNoteResponse>({
    //@ts-ignore
    queryKey: ["note", noteId],
    queryFn: async () => {
      const res = await reldb.rel.find("note", noteId);
      // TODO: find a better way to do this
      let content = res.notes[0].content;
      try {
        content = JSON.parse(content);
      } catch (error) {
        console.log(`JSON parse error for note ${noteId} failed with ${error}`);
      }
      const data = {
        note: {
          ...res.notes[0],
          content,
        },
        notebook: res.notebooks[0],
      };
      return data;
    },
    enabled: !!noteId,
  });
};

export const useGetNoteByParams = () => {
  // We're not getting noteId or something
  const { noteId } = useParams();

  return useQuery<null, Error, GetNoteResponse>({
    //@ts-ignore
    queryKey: ["note", noteId],
    queryFn: async () => {
      const res = await reldb.rel.find("note", noteId);
      // TODO: find a better way to do this
      let content = res.notes[0].content;
      try {
        content = JSON.parse(content);
      } catch (error) {
        console.log(`JSON parse error for note ${noteId} failed with ${error}`);
      }
      const data = {
        note: {
          ...res.notes[0],
          content,
        },
        notebook: res.notebooks[0],
      };
      return data;
    },
    enabled: !!noteId,
  });
};
