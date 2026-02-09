import React from "react";

/**
 * Helper function to determine if a URL points to a video file
 */
export const isVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v", ".ogv"];
  const lowercaseUrl = url.toLowerCase();
  
  // Check for video file extensions
  if (videoExtensions.some((ext) => lowercaseUrl.includes(ext))) {
    return true;
  }
  
  // Check for Cloudinary video resource type
  if (lowercaseUrl.includes("/video/upload/")) {
    return true;
  }
  
  // Check for common video URL patterns
  if (lowercaseUrl.includes("resource_type=video")) {
    return true;
  }
  
  return false;
};

/**
 * MediaRenderer component that automatically renders either an image or video
 * based on the source URL
 */
const MediaRenderer = ({
  src = "",
  alt = "",
  className = "",
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  onError,
  ...restProps
}) => {
  if (!src) {
    return (
      <img
        className={className}
        src="/dhwise-images/placeholder.png"
        alt={alt || "Placeholder"}
        style={style}
        loading="lazy"
        {...restProps}
      />
    );
  }

  if (isVideoUrl(src)) {
    return (
      <video
        className={className}
        src={src}
        style={style}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        onError={onError}
        {...restProps}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={style}
      loading="lazy"
      onError={onError}
      {...restProps}
    />
  );
};

export { MediaRenderer };
export default MediaRenderer;



