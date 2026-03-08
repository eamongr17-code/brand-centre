"use client";

import { EditStoreProvider } from "@/lib/edit-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <EditStoreProvider>{children}</EditStoreProvider>;
}
