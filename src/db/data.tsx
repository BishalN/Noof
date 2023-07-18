import { useParams, usePathname } from "next/navigation";
import { queryClient } from "@/app/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import PouchDB from "pouchdb-browser";

import find from "pouchdb-find";
import rel from "relational-pouch";
// @ts-ignore
import indexDBAdapter from "pouchdb-adapter-indexeddb";

import React, { ReactNode, useContext } from "react";

PouchDB.plugin(indexDBAdapter).plugin(find).plugin(rel);

const db = new PouchDB("noof-dev", { adapter: "indexeddb" });
const reldb = db.setSchema([
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

export const RelationalIndexDBContext = React.createContext({
  reldb,
});

export default function DBProvider({ children }: { children: ReactNode }) {
  return (
    <RelationalIndexDBContext.Provider
      value={{
        reldb,
      }}
    >
      {children}
    </RelationalIndexDBContext.Provider>
  );
}

export type Note = {
  id?: string;
  rev?: string;
  name: string;
  excerpt?: string;
  date?: string;
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
  const { reldb } = useContext(RelationalIndexDBContext);
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
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

  return useQuery<null, Error, GetNoteBookResponse>({
    //@ts-ignore
    queryKey: ["notebook", id],
    queryFn: async () => {
      const res = await reldb.rel.find("notebook", id);
      const actualResp = {
        notebook: res.notebooks[0],
      };
      return actualResp;
    },
    enabled: !!id,
  });
};

export const useUpdateNotebook = () => {
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

  const path = usePathname();
  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.save("note", note);
      // TODO: Associate it with the notebook of current selection
      // console.log("selection", JSON.stringify(selection, null, 2));
      // await reldb.rel.save(selection.type, {
      //   ...selection,
      //   notes: [...selection.notes, res.id],
      // });
      return res;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: [path.includes("tag") ? "tag" : "notebook", id],
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
  const { reldb } = useContext(RelationalIndexDBContext);

  return useQuery<null, Error, GetNotesResponse>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await reldb.rel.find("note");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return res;
    },
  });
};

type GetNoteResponse = {
  note: Note;
  notebook: Notebook;
};
export const useGetNote = (id: string) => {
  const { reldb } = useContext(RelationalIndexDBContext);

  return useQuery<null, Error, GetNoteResponse>({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await reldb.rel.find("note", id);
      console.log(`UseGetNote Query`, JSON.stringify(res, null, 2));
      return res;
    },
  });
};

export const useUpdateNote = () => {
  const { reldb } = useContext(RelationalIndexDBContext);

  return useMutation({
    mutationFn: async (note: Note) => {
      const res = await reldb.rel.save("note", note);
      return res;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
};

export const useDeleteNote = () => {
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

  return useQuery<null, Error, GetTagResponse>({
    //@ts-ignore
    queryKey: ["tag", id],
    queryFn: async () => {
      const res = await reldb.rel.find("tag", id);
      const actualResp = {
        tag: res?.tags[0],
      };
      return actualResp;
    },
  });
};

export const useUpdateTag = () => {
  const { reldb } = useContext(RelationalIndexDBContext);

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
  const { reldb } = useContext(RelationalIndexDBContext);

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

export const useGetNoteByParams = () => {
  const { reldb } = useContext(RelationalIndexDBContext);

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
