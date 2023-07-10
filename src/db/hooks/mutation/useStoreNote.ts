import { Note } from "../../types";
import { reldb } from "../../PouchDBProvider";
import { useMutation } from "@tanstack/react-query";

export const useStoreNote = () => {
  return useMutation({
    mutationFn: async (notes: Pick<Note, "name" & "content">) => {
      console.log(JSON.stringify(notes, null, 2));
      await reldb.rel.save("note", {
        ...notes,
      });
    },
  });
};
