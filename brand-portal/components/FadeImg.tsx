"use client";

import { useState, useEffect } from "react";

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
  const [loaded, setLoaded] = useState(false);

  // Reset when src changes so the new image fades in fresh
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <img
      {...props}
      src={src}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        e.currentTarget.onerror = null;
        if (fallbackSrc) e.currentTarget.src = fallbackSrc;
        setLoaded(true);
        onError?.(e);
      }}
    />
  );
}
