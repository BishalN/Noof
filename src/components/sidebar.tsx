import { ScrollTextIcon, BookIcon, TagsIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
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
            <span>3</span>
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
            <p className="flex justify-between">
              <span>First Notebook</span>
              <span>2</span>
            </p>
            <p className="flex justify-between">
              <span>Engineering daybook</span>
              <span>100</span>
            </p>
            <p className="flex justify-between">
              <span>Engineering daybook</span>
              <span>100</span>
            </p>
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
              <li className="flex justify-between">
                <span>First Notebook</span>
                <span>2</span>
              </li>
              <li className="flex justify-between">
                <span>First Notebook</span>
                <span>2</span>
              </li>
              <li className="flex justify-between">
                <span>First Notebook</span>
                <span>2</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="px-7">
        <h1>Bishal Neupane</h1>
      </div>
    </div>
  );
}
