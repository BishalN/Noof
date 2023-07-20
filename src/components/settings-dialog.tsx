import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Note, RelationalIndexDBContext } from "@/db/data";
import { CogIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export function SettingsDialog() {
  const [clearLoading, setClearLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { reldb } = useContext(RelationalIndexDBContext);

  const router = useRouter();

  const handleClearDatabase = async () => {
    setClearLoading(true);
    try {
      await reldb.destroy();
      // TODO: get the database to the initial reset templated state
      router.push("/");
      // TODO: there must be a nextjs thing that does this
      await new Promise((resolve) => setTimeout(() => {}, 500));
      location.reload();
    } catch (error) {
    } finally {
      setClearLoading(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CogIcon className="h-4 w-4 mr-2 " />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Reset the database to its initial state. This will delete all your
            notes and notebooks
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={handleClearDatabase}
          className="my-4 bg-slate-400 rounded-sm p-2 text-white"
          disabled={clearLoading}
        >
          {clearLoading ? (
            <div>
              <span>Clearing Database</span>
              <div className="animate-spin">🔄</div>
            </div>
          ) : (
            "Reset Database"
          )}
        </button>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
