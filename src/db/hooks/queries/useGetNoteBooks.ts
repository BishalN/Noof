import { reldb } from "@/db/PouchDBProvider";
import { Note, Notebook } from "@/db/types";
import { useQuery } from "@tanstack/react-query";

// export const useGetNoteBooks = () => {
//   return useQuery({
//     queryKey: ["notebooks"],
//     queryFn: async () => {
//       const notes = await reldb.rel.find("notebooks");
//       return notes;
//     },
//   });
// };

import { createQuery } from "react-query-kit";

type NoteBooksWithNote = {
  notebooks: Notebook[];
  notes: Note[];
};

export const useGetNoteBooks = createQuery<NoteBooksWithNote, unknown, Error>({
  primaryKey: "notebooks",
  queryFn: async () => {
    // primaryKey equals to '/posts'
    // const notes = await reldb.rel.find("notebooks");
    // use .then to get the result
    return reldb.rel.find("notebooks").then((res) => {
      console.log(JSON.stringify(res, null, 2));
      return res;
    });
  },
});
