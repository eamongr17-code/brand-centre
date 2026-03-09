"use client";

import { useEffect } from "react";

/**
 * Global error boundary — wraps the entire app including the root layout.
 * Must render its own <html> and <body> tags.
 *
 * ChunkLoadError: browser cached old HTML referencing stale JS chunk hashes
 * after a new deploy. Auto-reloading fetches fresh HTML with updated chunk refs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.name === "ChunkLoadError") {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#e8e8e8" }}>
          <p style={{ color: "#888", marginBottom: "16px", fontSize: "14px" }}>
            Something went wrong.
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "white",
                color: "black",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Reload page
            </button>
            <button
              onClick={reset}
              style={{
                background: "transparent",
                color: "#888",
                border: "1px solid #444",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
