import { reldb } from "@/db/pouch-db";
import { useQuery } from "@tanstack/react-query";

export const useGetNote = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const notes = await reldb.rel.find("note");
      return notes;
    },
  });
};
