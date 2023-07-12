import { Note } from "@/db/data";
import { create } from "zustand";

export type SelectedNoteStore = {
  selectedNote: Note;
  setSelectedNote: (data: SelectedNoteStore["selectedNote"]) => void;
};

export const useSelectedNoteStore = create<SelectedNoteStore>((set) => ({
  selectedNote: {
    id: "",
    name: "",
    type: "note",
    content: "",
    tags: [],
    notebook: "",
    rev: "",
  },
  setSelectedNote: (selectedNote) =>
    set(() => {
      return { selectedNote };
    }),
}));
