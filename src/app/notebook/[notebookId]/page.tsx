import { Sidebar } from "@/components/sidebar";
import { SubSidebar } from "@/components/sub-sidebar";
import { Editor } from "@/components/ui/editor";

export default function Home() {
  return (
    <div className="hidden md:block">
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar className="hidden lg:block" />
            <SubSidebar className="hidden lg:block" />
            <div className="col-span-2 lg:col-span-3 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Editor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
