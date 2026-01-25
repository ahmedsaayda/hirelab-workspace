import React, { useState, useEffect } from "react";

/**
 * FeedContext
 * 
 * Wraps ad content with a Facebook/Instagram Feed style UI.
 */
export default function FeedContext({ children, brandData, text, title, description, ctaText }) {
  const brandName = brandData?.companyName || "Company Name";
  // Priority: Facebook Page logo (metaPageLogo) > companyLogo > logo > fallback
  const brandLogo = brandData?.metaPageLogo || brandData?.companyLogo || brandData?.logo;

  // Facebook/Instagram truncates primary text to ~125 characters initially
  const MAX_VISIBLE_CHARS = 125;
  const fullText = text || "";
  const canTruncate = fullText.length > MAX_VISIBLE_CHARS;
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when text changes (e.g., switching variants or formats)
  useEffect(() => {
    setIsExpanded(false);
  }, [text]);

  const showTruncated = canTruncate && !isExpanded;
  const displayText = showTruncated
    ? fullText.substring(0, MAX_VISIBLE_CHARS).trim()
    : fullText;

  return (
    <div className="w-full h-full bg-[#f0f2f5] flex flex-col overflow-y-auto hide-scrollbar">
      {/* Fake App Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10 pt-12">
        <h1 className="text-[#1877F2] font-bold text-xl tracking-tight">facebook</h1>
        <div className="flex gap-4 text-gray-600">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
          </div>
        </div>
      </div>

      {/* Feed Item */}
      <div className="bg-white mt-2 mb-4">
        {/* Header */}
        <div className="p-3 flex items-start justify-between">
          <div className="flex gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 flex-shrink-0">
              {brandLogo ? (
                <img 
                  src={brandLogo} 
                  alt={brandName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial letter if image fails to load
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent && !parent.querySelector('.fallback-initial')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-lg fallback-initial';
                      fallback.textContent = brandName.charAt(0).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-lg">
                  {brandName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-[15px] text-gray-900 leading-tight">
                {brandName}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <span>Sponsored</span>
                <span>•</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
            </div>
          </div>
          <button className="text-gray-500">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
          </button>
        </div>

        {/* Caption - Truncated to 125 chars like FB/Instagram */}
        <div className="px-3 pb-3 text-[15px] text-gray-900 leading-normal">
          <span className="whitespace-pre-wrap">{displayText}</span>
          {showTruncated && (
            <span
              className="text-gray-400 cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              ... <span className="text-gray-500 hover:underline">Read more</span>
            </span>
          )}
        </div>

        {/* Media Content - The Ad */}
        <div className="w-full bg-gray-100 overflow-hidden border-y border-gray-100 relative">
          {children}
        </div>

        {/* CTA Bar (Headline + Button) */}
        <div className="bg-[#F0F2F5] p-3 flex justify-between items-center">
          <div className="flex-1 min-w-0 pr-3">
            <div className="text-xs text-gray-500 uppercase truncate">
              {brandData?.website || "HIRELAB.COM"}
            </div>
            <div className="font-semibold text-[16px] text-gray-900 truncate">
              {title || ""}
            </div>
            {description && (
              <div className="text-[13px] text-gray-600 truncate">
                {description}
              </div>
            )}
          </div>
          <button className="bg-[#EBF5FF] text-[#0064D1] px-4 py-2 rounded-[6px] text-[15px] font-semibold whitespace-nowrap">
            {ctaText || "Learn More"}
          </button>
        </div>

        {/* Engagement Bar */}
        <div className="px-3 py-2 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center border border-white z-10">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.48 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 2.14-1.17l4.35-10.16c.12-.28.19-.58.19-.87V10z" /></svg>
              </div>
            </div>
            <span className="text-gray-500 text-[13px]">245</span>
          </div>
          <div className="text-gray-500 text-[13px] flex gap-3">
            <span>12 Comments</span>
            <span>5 Shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 py-1 flex items-center justify-between h-11">
          <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-[14px] h-full rounded hover:bg-gray-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
            Like
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-[14px] h-full rounded hover:bg-gray-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
            Comment
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-[14px] h-full rounded hover:bg-gray-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}



















