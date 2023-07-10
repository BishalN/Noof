import { reldb } from "@/db/PouchDBProvider";
import { Tag } from "@/db/types";
import { createQuery } from "react-query-kit";

type Tags = {
  tags: Tag[];
};

export const useGetTags = createQuery<Tags, unknown, Error>({
  primaryKey: "tags",
  queryFn: async () => {
    return reldb.rel.find("tags").then((res) => {
      console.log(JSON.stringify(res, null, 2));
      return res;
    });
  },
});
