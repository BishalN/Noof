import { create } from "zustand";

// TODO: may be just using query params is good
export type SelectionStore = {
  selection: {
    id: string;
    name: string;
    notes: string[];
    type: "notebook" | "tag";
  };
  setSelection: (data: SelectionStore["selection"]) => void;
};

const getLocalStorage = (key: string) =>
  JSON.parse(
    window.localStorage.getItem(key) as string
  ) as SelectionStore["selection"];
const setLocalStorage = (key: string, value: SelectionStore["selection"]) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const useSelectionStore = create<SelectionStore>((set) => ({
  selection: getLocalStorage("selection") || {},
  setSelection: (selection) =>
    set(() => {
      setLocalStorage("selection", selection);
      return { selection };
    }),
}));
