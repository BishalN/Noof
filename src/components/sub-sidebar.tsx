"use client";

import { useGetNotesFromNotebookOrTag } from "@/db/hooks/queries/useGetNotesFromNotebookOrTag";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SubSidebar({ className }: SubSidebarProps) {
  const { selection, setSelection } = useSelectionStore();
  const { data, isLoading } = useGetNotesFromNotebookOrTag({
    variables: { id: selection?.id, type: selection?.type },
    enabled: !!selection,
  });

  return (
    <div
      className={cn(
        "pb-12 bg-gray-100  min-h-screen flex flex-col justify-between",
        className
      )}
    >
      <div className="h-full w-full space-y-3 py-4">
        <div className="px-3">
          <h2 className="mb-2 px-4 text-center font-semibold tracking-tight">
            {selection?.name}
          </h2>
        </div>

        <div className="space-y-1">
          <NoteCard
            description="This is a description, long enough to be a description"
            tags={["tag1", "tag2"]}
            time="2 hours ago"
            title="This is a title"
          />
          <NoteCard
            description="This is a description, long enough to be a description"
            tags={["tag1", "tag2"]}
            time="2 hours ago"
            title="This is a title"
          />
          <NoteCard
            description="This is a description, long enough to be a description"
            tags={["tag1", "tag2"]}
            time="2 hours ago"
            title="This is a title"
          />
        </div>
      </div>
    </div>
  );
}

interface NoteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  tags: string[];
  time: string;
}

export function NoteCard({ description, tags, time, title }: NoteCardProps) {
  return (
    <div className="px-3 py-2 cursor-pointer hover:bg-gray-200">
      <p className=" font-semibold">{title}</p>
      <div className="flex space-x-2 text-muted-foreground">
        <p>{time}</p>
        <p className="space-x-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-300 text-gray-600 rounded-sm px-1"
            >
              {tag}
            </span>
          ))}
        </p>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
