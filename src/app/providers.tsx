"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";

import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { PouchDBProvider } from "@/db/PouchDBProvider";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Sans Serif",
  setFont: () => {},
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Sans Serif");

  return (
    <AppContext.Provider
      value={{
        font,
        setFont,
      }}
    >
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <body
          className={clsx(displayFontMapper[font], defaultFontMapper[font])}
        >
          {children}
        </body>
      </QueryClientProvider>
      <Analytics />
    </AppContext.Provider>
  );
}
