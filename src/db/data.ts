import { queryClient } from "@/app/providers";
import { SelectionStore } from "@/store/selection";
import { useMutation, useQuery } from "@tanstack/react-query";
import PouchDB from "pouchdb-browser";

import find from "pouchdb-find";
import rel from "relational-pouch";

PouchDB.plugin(find).plugin(rel);

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

export type Note = {
  id?: string;
  name: string;
  content: any;
  type: "note";
  notebook: string;
  tags: string[];
};

export type Notebook = {
  id?: string;
  name: string;
  type: "notebook";
  notes: string[];
};

export type Tag = {
  id?: string;
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
  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.save("note", note);
      return res;
    },
    onSuccess: () => {
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
    onSuccess: () => {
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

export const useGetNotesBySelection = (
  selection: SelectionStore["selection"]
) => {
  return useQuery<null, Error, GetNotesResponse>({
    queryKey: [selection.type, selection.id],
    queryFn: async () => {
      const res = await reldb.rel.find("note", selection.notes);
      return res;
    },
  });
};
