"use client";

import { useGetNotesBySelection } from "@/db/data";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection";

interface SubSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SubSidebar({ className }: SubSidebarProps) {
  const { selection } = useSelectionStore();

  const { data: notesData, isLoading: isNotesDataLoading } =
    useGetNotesBySelection(selection);

  if (isNotesDataLoading) return <div>Loading...</div>;

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
          {notesData?.notes.map((note) => {
            return (
              <NoteCard
                key={note.id}
                content={note.content}
                tags={note.tags}
                time="2 hours ago"
                title={note.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface NoteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  tags: string[];
  time: string;
}

export function NoteCard({ content, tags, time, title }: NoteCardProps) {
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
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}
