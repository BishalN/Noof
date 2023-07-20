"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";

import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RelationalIndexDBContext, handleOnboarding } from "@/db/data";

import { setCookie, hasCookie } from "cookies-next";

const DBProvider = dynamic(() => import("@/db/data"), { ssr: false });

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      localStorage.setItem("lastLocation", window.location.href);
      // Chrome requires the returnValue property to be set
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const router = useRouter();
  useEffect(() => {
    // get last location from localstorage and redirect there
    const lastLocation = localStorage.getItem("lastLocation");
    if (lastLocation) {
      router.replace(lastLocation);
    }
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        font,
        setFont,
      }}
    >
      <Toaster />
      <DBProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <OnBoardingSetup />
          <main
            // TODO: fix this typescript issue here
            // @ts-ignore
            className={clsx(displayFontMapper[font], defaultFontMapper[font])}
          >
            {children}
          </main>
        </QueryClientProvider>
      </DBProvider>
    </AppContext.Provider>
  );
}

const OnBoardingSetup = () => {
  const { reldb } = useContext(RelationalIndexDBContext);
  const router = useRouter();
  useEffect(() => {
    if (!hasCookie("onboarding")) {
      handleOnboarding(reldb).then((data) => {
        router.push(`/notebook/${data.notebook.id}/note/${data.note.id}`);
        setCookie("onboarding", "true");
      });
    }
  }, []);

  return null;
};
