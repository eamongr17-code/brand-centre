"use client";

import { AuthProvider } from "@/lib/auth-context";
import { EditStoreProvider } from "@/lib/edit-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EditStoreProvider>{children}</EditStoreProvider>
    </AuthProvider>
  );
}
