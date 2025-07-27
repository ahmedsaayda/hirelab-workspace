import React from 'react';

/**
 * Converts URLs in text to clickable links
 * @param {string} text - The text to parse for URLs
 * @returns {React.ReactNode[]} - Array of text and link components
 */
export const parseLinksInText = (text, linkClassName = "text-blue-300 hover:text-blue-100 underline") => {
  if (!text) return [text];

  // URL regex pattern to match http/https URLs
  const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
  
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

/**
 * Component to render text with clickable links
 * @param {Object} props
 * @param {string} props.text - The text to render with links
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.linkClassName - CSS classes for link styling
 */
export const LinkifiedText = ({ text, className = "", linkClassName }) => {
  // Filter out any debug/system content
  const cleanText = text && typeof text === 'string' 
    ? text.replace(/\{[^}]*\}/g, '') // Remove JSON objects
           .replace(/ObjectId\([^)]*\)/g, '') // Remove ObjectId
           .replace(/console\.log[^;]*;?/g, '') // Remove console.log
           .replace(/DEBUG[^\n]*/g, '') // Remove debug lines
           .replace(/Creating message[^\n]*/g, '') // Remove creation logs
           .replace(/Request body[^\n]*/g, '') // Remove request logs
           .replace(/middleware[^\n]*/g, '') // Remove middleware logs
           .replace(/connect ECONNREFUSED[^\n]*/g, '') // Remove connection errors
           .trim()
    : text;

  // Don't render if the cleaned text is empty or contains only debug content
  if (!cleanText || cleanText.length === 0) {
    return null;
  }

  const parsedContent = parseLinksInText(cleanText, linkClassName);
  
  return (
    <span className={className} style={{ 
      wordBreak: 'break-word', 
      overflowWrap: 'break-word',
      maxWidth: '100%',
      display: 'block'
    }}>
      {parsedContent}
    </span>
  );
}; 