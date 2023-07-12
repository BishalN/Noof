import { reldb } from "@/db/pouch-db";
import { Note, Notebook } from "@/db/types";
import { SelectionStore } from "@/store/selection";

import { createQuery } from "react-query-kit";

type Response = {
  data: SelectionStore["selection"];
  notes: Note[];
};

type Variable = {
  type: "notebook" | "tag";
  id: string;
};

export const useGetNotesFromNotebookOrTag = createQuery<
  Response,
  Variable,
  Error
>({
  primaryKey: "notes",
  queryFn: async ({ queryKey: [primaryKey, variables] }) => {
    const noteOrTag = await reldb.rel.find(`${variables.type}`);
    console.log(JSON.stringify(noteOrTag, null, 2));

    const data = await reldb.rel.find("notebook");

    const note = await reldb.rel.find("note");
    console.log("note", JSON.stringify(note, null, 2));

    // const noteIds: string[] =
    //   noteOrTag?.notebooks[0]?.notes || noteOrTag?.tags[0]?.notes;
    // console.log("noteIds", noteIds);
    return noteOrTag;
  },
});
