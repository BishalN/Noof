import { Note, Tag, useDeleteTag, useGetTag, useGetTags } from "@/db/data";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface DisplayTagsProps {
  tagIds: string[];
}

export function DisplayTags({ tagIds }: DisplayTagsProps) {
  const { data: tagsData, isLoading } = useGetTags();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const handleDeleteTag = async (tag: Tag) => {
    await deleteTag(tag);
  };
  const tags = tagsData?.tags.filter((tag) =>
    tagIds.includes(tag.id as string)
  );
  return (
    <div className="flex flex-wrap gap-2 cursor-pointer">
      {tags!.map((tag) => (
        <Menubar className="" key={tag.id}>
          <MenubarMenu>
            <MenubarTrigger className="outline-none">{tag.name}</MenubarTrigger>
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
