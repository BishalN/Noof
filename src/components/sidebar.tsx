"use client";

import { ScrollTextIcon, BookIcon, TagsIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGetNotebooks, useGetTags } from "@/db/data";
import { CreateNotebookDialog } from "./create-notebook-dialog";
import { NotebookItemWithContextMenu } from "./notebook-item-with-context-menu";
import { TagItemWithContextMenu } from "./tag-item-with-context-menu";
import { SettingsDialog } from "./settings-dialog";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { data: notebooksData, isLoading: isNotebooksDataLoading } =
    useGetNotebooks();
  const { data: tagsData, isLoading: isTagsDataLoading } = useGetTags();
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
            <span>{notebooksData?.notebooks.length || "0"}</span>
          </h2>
        </div>

        <div className="px-3">
          <h2 className="mb-2 px-4 font-semibold tracking-tight flex justify-between items-center">
            <div className="flex items-center">
              <BookIcon className="mr-2 h-4 w-4" />
              <span>Notebooks</span>
            </div>
            <CreateNotebookDialog />
          </h2>

          <div className="space-y-1 pl-12 pr-4">
            {notebooksData?.notebooks.map((notebook) => (
              <NotebookItemWithContextMenu
                notebook={notebook}
                key={notebook.id}
              />
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
                <TagItemWithContextMenu key={tag.id} tag={tag} />
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="px-7">
        <SettingsDialog />
        {/* <h1>Bishal Neupane</h1> */}
      </div>
    </div>
  );
}
