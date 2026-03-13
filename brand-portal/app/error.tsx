"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#888] mb-2">Something went wrong.</p>
        <p className="text-xs text-red-400 mb-4 max-w-md font-mono break-all">
          {error.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-4 py-2 rounded text-sm font-medium"
          >
            Reload page
          </button>
          <button
            onClick={reset}
            className="border border-[#444] text-[#888] px-4 py-2 rounded text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
