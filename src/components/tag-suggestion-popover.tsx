import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Note, useGetTags } from "@/db/data";
import { useMemo } from "react";

interface TagSuggestionPopoverProps {
  open: boolean;
  onOpenChange?: () => void;
  search: string;
  note: Note;
}

export function TagSuggestionPopover({
  note,
  onOpenChange,
  open,
  search,
}: TagSuggestionPopoverProps) {
  const { data: tagsData } = useGetTags();

  const tagsSuggestions = useMemo(() => {
    if (!tagsData?.tags) return [];
    // also filter the already existing tags
    const tags = tagsData?.tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
    return tags.filter((tag) => !note?.tags?.includes(tag.id as string));
  }, [tagsData, search, note]);
  return (
    <Popover open={true} onOpenChange={onOpenChange}>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Suggestions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
