"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";

import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Note,
  Notebook,
  RelationalIndexDBContext,
  Tag,
  useGetNotebooks,
} from "@/db/data";

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
      <Analytics />
    </AppContext.Provider>
  );
}

const OnBoardingSetup = () => {
  const { data: notebooksData, isLoading: isGetNotebooksLoading } =
    useGetNotebooks();
  const { reldb } = useContext(RelationalIndexDBContext);
  const [lastLocation, setLastLocation] = useState<string | null>(null);
  useEffect(() => {
    setLastLocation(localStorage.getItem("lastLocation") ?? null);
  }, []);

  const [isHandleOnboardingLoading, setHandleOnboardingLoading] =
    useState(false);

  const handleOnboarding = async () => {
    setHandleOnboardingLoading(true);
    const onBoardingNotebook: Notebook = {
      name: "Recipe",
      notes: [],
      type: "notebook",
    };
    const createNotebookResponse = await reldb.rel.save(
      "notebook",
      onBoardingNotebook
    );

    const onBoardingNote: Note = {
      name: "How to make a sandwich",
      notebook: createNotebookResponse.id,
      tags: [],
      type: "note",
      date: new Date().toISOString(),
      content: `# How to make a sandwich`,
    };

    const createNoteResponse = await reldb.rel.save("note", onBoardingNote);

    const onBoardingTag: Tag = {
      name: "Tutorial",
      notes: [createNoteResponse.id],
      type: "tag",
    };

    const createTagResponse = await reldb.rel.save("tag", onBoardingTag);

    // update the notebook with notes and note with tags array
    await reldb.rel.save("notebook", {
      ...onBoardingNotebook,
      notes: [createNoteResponse.id],
    });

    await reldb.rel.save("note", {
      ...onBoardingNote,
      tags: [createTagResponse.id],
    });

    setHandleOnboardingLoading(false);
  };

  if (
    !isGetNotebooksLoading &&
    notebooksData?.notebooks.length === 0 &&
    !lastLocation
  ) {
    handleOnboarding();
  }

  // May be show a loading screen here
  return null;
};
