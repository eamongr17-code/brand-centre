"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 600);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#111111] flex items-center justify-center transition-all duration-600 ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        <img
          src="/atlas-wordmark.svg"
          alt="Atlas"
          className="h-7 w-auto opacity-90"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <div className="w-16 h-[1.5px] bg-[#1e1e1e] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#f77614]/40 via-[#f77614] to-[#f77614]/40 rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
