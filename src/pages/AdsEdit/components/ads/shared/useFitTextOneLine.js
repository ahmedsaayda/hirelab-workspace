"use client";

import { useEffect, useState } from "react";

/**
 * useFitTextOneLine
 * Shrinks font-size so that the text fits on a single line within its container.
 *
 * Usage:
 * const titleRef = React.useRef(null);
 * const fontSize = useFitTextOneLine({ ref: titleRef, text, maxFontSize: 88, minFontSize: 20 });
 * <h1 ref={titleRef} style={{ fontSize, whiteSpace: 'nowrap' }}>{text}</h1>
 */
export default function useFitTextOneLine({
  ref,
  text,
  maxFontSize = 88,
  minFontSize = 20,
  step = 1,
  lineHeight = 1.08,
}) {
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    if (!ref?.current) return;
    const el = ref.current;

    const fit = () => {
      if (!el) return;

      // Ensure single-line measurement context
      el.style.whiteSpace = "nowrap";
      el.style.overflow = "hidden";
      el.style.textOverflow = "clip";

      // Start from max and shrink until it fits
      let current = maxFontSize;
      el.style.fontSize = `${current}px`;
      el.style.lineHeight = String(lineHeight);

      // Guard: container width
      const containerWidth = el.parentElement ? el.parentElement.clientWidth : el.clientWidth;
      if (!containerWidth) return;

      // Reduce until scrollWidth fits
      // Safety iteration cap
      let iterations = 0;
      while (el.scrollWidth > containerWidth && current > minFontSize && iterations < 200) {
        current -= step;
        el.style.fontSize = `${current}px`;
        iterations += 1;
      }

      setFontSize(current);
    };

    // Initial fit after layout
    const raf = requestAnimationFrame(fit);

    // Refit on resize
    const onResize = () => requestAnimationFrame(fit);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [ref, text, maxFontSize, minFontSize, step, lineHeight]);

  return fontSize;
}




