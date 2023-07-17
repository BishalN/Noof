"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, useUpdateTag } from "@/db/data";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface RenameTagProps {
  tag: Tag;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function RenameTag({ tag, isOpen, onOpenChange }: RenameTagProps) {
  const [tagName, setTagName] = useState(tag.name);
  const { mutateAsync: updateTag, isLoading } = useUpdateTag();

  const handleRenameTag = async () => {
    if (!tagName) return;
    await updateTag({ ...tag, name: tagName });
    setTagName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Notebook</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRenameTag} type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Rename"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
