"use client";

import { create } from "zustand";

export type SelectionStore = {
  selection: {
    id: string;
    name: string;
    notes: string[];
    type: "notebook" | "tag";
    rev?: string;
  };
  setSelection: (data: SelectionStore["selection"]) => void;
};

const getLocalStorage = (key: string) => {
  // check if window is defined (so if in the browser or in node.js).
  if (typeof window === "undefined") return {};
  return JSON.parse(
    window.localStorage.getItem(key) as string
  ) as SelectionStore["selection"];
};
const setLocalStorage = (key: string, value: SelectionStore["selection"]) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const useSelectionStore = create<SelectionStore>((set) => ({
  selection: getLocalStorage("selection") as SelectionStore["selection"],
  setSelection: (selection) =>
    set(() => {
      setLocalStorage("selection", selection);
      return { selection };
    }),
}));
