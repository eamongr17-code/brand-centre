"use client";

import { useState, useRef, useLayoutEffect } from "react";

interface FadeImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function FadeImg({
  src,
  fallbackSrc,
  className,
  onLoad,
  onError,
  ...props
}: FadeImgProps) {
  // prevSrc lets us detect when the src prop changes so we can reset display/loaded
  // synchronously during render — no useEffect, no race condition with onLoad
  const [prevSrc, setPrevSrc] = useState(src);
  const [displaySrc, setDisplaySrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setDisplaySrc(src);
    setLoaded(false);
  }

  // Cached images may already be complete before onLoad fires (or onLoad may
  // not fire at all for same-URL re-renders). useLayoutEffect runs synchronously
  // before the browser paints, so we can mark it loaded with no visible flash.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [displaySrc]);

  return (
    <img
      {...props}
      ref={imgRef}
      src={displaySrc}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        if (fallbackSrc && displaySrc !== fallbackSrc) {
          // Switch to fallback via state (not DOM mutation) so React stays in control.
          // loaded stays false; will become true once the fallback fires onLoad.
          setDisplaySrc(fallbackSrc);
        } else {
          // No fallback, or fallback itself failed — show whatever is there.
          setLoaded(true);
        }
        onError?.(e);
      }}
    />
  );
}
