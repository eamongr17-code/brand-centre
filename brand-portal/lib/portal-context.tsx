"use client";

import { createContext, useContext, useMemo } from "react";

export type PortalMode = "owner" | "internal" | "public";

export interface PortalContextValue {
  mode: PortalMode;
  /** null = all brands accessible; a brand slug = locked to that brand only */
  brandScope: string | null;
  /** true only in owner portal — enables edit mode UI */
  canEdit: boolean;
  /** true in owner + internal portals — shows assets/categories marked visibility:"internal" */
  showInternal: boolean;
  /** Prefixes a root-relative path with the portal's base (e.g. /owner or /internal).
   *  Public portal returns the path unchanged. */
  portalPath: (path: string) => string;
}

const PortalContext = createContext<PortalContextValue>({
  mode: "public",
  brandScope: null,
  canEdit: false,
  showInternal: false,
  portalPath: (p) => p,
});

export function usePortal(): PortalContextValue {
  return useContext(PortalContext);
}

interface PortalProviderProps {
  mode: PortalMode;
  brandScope?: string | null;
  children: React.ReactNode;
}

export function PortalProvider({ mode, brandScope = null, children }: PortalProviderProps) {
  const value = useMemo<PortalContextValue>(() => {
    const prefix = mode === "owner" ? "/owner" : mode === "internal" ? "/internal" : "";
    return {
      mode,
      brandScope,
      canEdit: mode === "owner",
      showInternal: mode === "owner" || mode === "internal",
      portalPath: (path: string) => {
        // Ensure path starts with /
        const p = path.startsWith("/") ? path : `/${path}`;
        // For public portal with brandScope, home is /[brand]/
        if (mode === "public" && brandScope && p === "/") {
          return `/${brandScope}/`;
        }
        return prefix ? `${prefix}${p}` : p;
      },
    };
  }, [mode, brandScope]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}
