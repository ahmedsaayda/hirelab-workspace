import React from "react";

/**
 * Generic masked image utility.
 * Props:
 * - src: image url
 * - alt: alt text
 * - maskSvg: SVG markup string to be used as a mask (full viewBox sized)
 * - style: outer container style overrides
 * - imageStyle: <img> style overrides
 * - overlay: optional overlay style (gradient) applied within the mask
 * - gridOverlay: optional grid style (backgroundImage) applied within the mask
 */
export default function MaskedImage({ src, alt, maskSvg, style, imageStyle, overlay, gridOverlay }) {
  const maskDataUrl = React.useMemo(() => {
    if (!maskSvg) return null;
    try {
      // base64 to avoid encoding issues with special characters
      return `data:image/svg+xml;base64,${typeof btoa === 'function' ? btoa(maskSvg) : Buffer.from(maskSvg).toString('base64')}`;
    } catch (e) {
      // fallback to utf8 encoding
      return `data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}`;
    }
  }, [maskSvg]);

  return (
    <div style={{ position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          maskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
          WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ position: "absolute", inset: 0, width: "125%", height: "125%", objectFit: "cover", ...imageStyle }}
        />
      </div>

      {overlay ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...overlay,
            maskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
            WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : null}

      {gridOverlay ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...gridOverlay,
            maskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
            WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : undefined,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : null}
    </div>
  );
}


