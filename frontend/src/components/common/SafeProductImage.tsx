"use client";

import { useState, type CSSProperties } from "react";

const fallbackImage = "/images/atelier/jewelry-collection.png";

type SafeProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  ariaHidden?: boolean;
};

export default function SafeProductImage({
  src,
  alt,
  className,
  style,
  width,
  height,
  ariaHidden,
}: SafeProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      aria-hidden={ariaHidden || undefined}
      onError={() => setImageSrc(fallbackImage)}
    />
  );
}
