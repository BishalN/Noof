import "@/styles/tailwind.css";
import "@/styles/prosemirror.css";
import "@/utils/polyfil";

import { ReactNode, useEffect } from "react";
import Providers from "./providers";

const title = "Noof -  A offline first, Notion like Note taking app";
const description =
  "Noof is a offline first, Notion like Note taking app. It is built with Next.js, Tailwind CSS, ProseMirror, and Vercel.";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@steventey",
  },
  metadataBase: new URL("https://noof.bishalneupane.com"),
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
