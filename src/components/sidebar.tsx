"use client";

import { ScrollTextIcon, BookIcon, TagsIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGetNoteBooks } from "@/db/hooks/queries/useGetNoteBooks";
import { reldb } from "@/db/PouchDBProvider";
import { useState } from "react";
import { useGetTags } from "@/db/hooks/queries/useGetTags";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { data, isLoading } = useGetNoteBooks({ variables: null });
  const { data: tagsData, isLoading: tagsLoading } = useGetTags({
    variables: null,
  });
  if (isLoading || tagsLoading) return <div>Loading...</div>;
  return (
    <div
      className={cn(
        "pb-12 min-h-screen flex flex-col justify-between",
        className
      )}
    >
      <div className="h-full w-full space-y-3 py-4">
        <div className="px-3">
          <h2 className="mb-2 px-4  font-semibold tracking-tight flex justify-between">
            <div className="flex items-center">
              <ScrollTextIcon className="mr-2 h-4 w-4" />
              <span>All Notes</span>
            </div>
            <span>{data?.notebooks.length || "0"}</span>
          </h2>
        </div>

        <div className="px-3">
          <h2 className="mb-2 px-4 font-semibold tracking-tight flex justify-between">
            <div className="flex items-center">
              <BookIcon className="mr-2 h-4 w-4" />
              <span>Notebooks</span>
            </div>
          </h2>

          <div className="space-y-1 pl-12 pr-4">
            {data?.notebooks.map((notebook) => (
              <p key={notebook.id} className="flex justify-between">
                <span>{notebook.name}</span>
                <span>{notebook.notes?.length || "0"}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="px-3">
          <h2 className="mb-2 px-4 font-semibold tracking-tight flex justify-between">
            <div className="flex items-center">
              <TagsIcon className="mr-2 h-4 w-4" />
              <span>Tags</span>
            </div>
          </h2>

          <div className="space-y-1 pl-12 pr-4">
            <ol className="list-disc">
              {tagsData?.tags.map((tag) => (
                <li key={tag.id} className="flex justify-between">
                  <span>{tag.name}</span>
                  <span>{tag.notes?.length || "0"}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="px-7">
        <SeedPouchDB />
        <h1>Bishal Neupane</h1>
      </div>
    </div>
  );
}

export const SeedPouchDB = () => {
  const [loading, setLoading] = useState(false);
  const handleClear = () => {
    setLoading(true);
    reldb.destroy().then(() => {
      setLoading(false);
    });
  };
  const handleSeed = () => {
    for (let i = 0; i < 5; i++) {
      reldb.rel.save("notebook", {
        name: `Notebook ${i}`,
        id: i,
        notes: [i, i + 1, i + 2],
      });
    }

    for (let i = 0; i < 15; i++) {
      reldb.rel.save("note", {
        title: `Note ${i}`,
        content: "We are going to have markdown here <h1>hello</h1>",
        notebook: i % 5,
        tags: [i % 5, (i + 5) % 5, (i + 10) % 5],
      });
    }

    for (let i = 0; i < 5; i++) {
      reldb.rel.save("tag", {
        name: `Tag ${i}`,
        notes: [i, i + 1, i + 2],
        id: i,
      });
    }
  };
  return (
    <div className="space-x-3 text-lg mb-10">
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleSeed}>Seed</button>
    </div>
  );
};
