import { Sidebar } from "@/components/sidebar";
import { SubSidebar } from "@/components/sub-sidebar";
import { Editor } from "@/components/ui/editor";
import { Metadata } from "next/types";

const APP_NAME = "Noof App";
const APP_DESCRIPTION = "Notion but offline simple note taking app";

export const metadata: Metadata = {
  title: "Noof",
  description: APP_DESCRIPTION,
  twitter: {
    card: "summary_large_image",
    creator: "@imamdev_",
    images: "https://example.com/og.png",
  },
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#FFFFFF",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  keywords: ["nextjs", "pwa", "next-pwa"],
};

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
