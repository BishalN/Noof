import { Note, Tag, useDeleteTag, useGetTags } from "@/db/data";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useMemo } from "react";

interface DisplayTagsProps {
  tagIds: string[];
}

export function DisplayTags({ tagIds }: DisplayTagsProps) {
  const { data: tagsData, isLoading } = useGetTags();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const handleDeleteTag = async (tag: Tag) => {
    await deleteTag(tag);
  };

  const tags = useMemo(() => {
    return tagsData?.tags.filter((tag) => tagIds?.includes(tag.id as string));
  }, [tagsData, tagIds]);

  return (
    <div className="flex flex-wrap gap-2 cursor-pointer">
      {tags?.map((tag) => (
        <Menubar className="bg-pink-300 rounded-full" key={tag.id}>
          <MenubarMenu>
            <MenubarTrigger className="bg-transparent">
              {tag.name}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                className="outline-none"
                onClick={() => handleDeleteTag(tag)}
              >
                Remove Tag
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ))}
    </div>
  );
}

export const DisplayTagsOnNoteCard = ({ tagIds }: DisplayTagsProps) => {
  const { data: tagsData, isLoading } = useGetTags();

  const tags = useMemo(() => {
    return tagsData?.tags.filter((tag) => tagIds?.includes(tag.id as string));
  }, [tagsData, tagIds]);

  return (
    <div className="flex flex-wrap space-x-2">
      {tags?.map((tag) => (
        <p key={tag.id} className="bg-pink-300 text-black px-2 rounded-full">
          {tag.name}
        </p>
      ))}
    </div>
  );
};
