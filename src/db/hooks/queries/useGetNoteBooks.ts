import { reldb } from "@/db/pouch-db";
import { Note, Notebook } from "@/db/types";

import { createQuery } from "react-query-kit";

type NoteBooksWithNote = {
  notebooks: Notebook[];
  notes: Note[];
};

export const useGetNoteBooks = createQuery<NoteBooksWithNote, unknown, Error>({
  primaryKey: "notebooks",
  queryFn: async () => {
    return reldb.rel.find("notebooks").then((res) => {
      console.log(JSON.stringify(res, null, 2));
      return res;
    });
  },
});
