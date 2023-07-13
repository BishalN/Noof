"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";

import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { RelationalIndexDBContext, reldb } from "@/db/data";

export const AppContext = createContext<{
  font: string;
  // TODO: fix this type
  setFont: (value: string) => void;
}>({
  font: "Sans Serif",
  setFont: () => {},
});

export const queryClient = new QueryClient();

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
      <RelationalIndexDBContext.Provider
        value={{
          reldb: reldb,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <body
          // TODO: fix this typescript issue here
          // className={clsx(displayFontMapper[font], defaultFontMapper[font])}
          >
            {children}
          </body>
        </QueryClientProvider>
      </RelationalIndexDBContext.Provider>
      <Analytics />
    </AppContext.Provider>
  );
}
