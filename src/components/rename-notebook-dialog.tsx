"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notebook, useUpdateNotebook } from "@/db/data";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { ContextMenuItem } from "./ui/context-menu";

interface RenameNotebookProps {
  notebook: Notebook;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function RenameNotebook({
  notebook,
  isOpen,
  onOpenChange,
}: RenameNotebookProps) {
  const [notebookName, setNotebookName] = useState(notebook.name);
  const { mutateAsync: updateNotebook, isLoading } = useUpdateNotebook();
  const handleRenameNotebook = async () => {
    if (!notebookName) return;
    await updateNotebook({ ...notebook, name: notebookName });
    setNotebookName("");
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
              value={notebookName}
              onChange={(e) => setNotebookName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleRenameNotebook}
            type="submit"
            disabled={isLoading}
          >
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
