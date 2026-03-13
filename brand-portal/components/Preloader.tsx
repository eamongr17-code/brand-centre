"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait for initial content to render, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/atlas-wordmark.svg"
          alt="Atlas"
          className="h-6 w-auto opacity-80 animate-pulse"
        />
        <div className="w-12 h-[2px] bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-[#f77614]/60 rounded-full animate-[loading-bar_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
