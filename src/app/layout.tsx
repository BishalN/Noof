import "@/styles/tailwind.css";
import "@/styles/prosemirror.css";
import "@/utils/polyfil";

import { ReactNode, useEffect } from "react";
import Providers from "./providers";

const title = "Noof -  A Notion like Note taking app";
const description =
  "Noof is a Notion like note taking app. It is a free and open source.";

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
    creator: "@bishaln",
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
