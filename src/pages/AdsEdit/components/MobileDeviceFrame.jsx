import React from "react";

/**
 * MobileDeviceFrame
 * 
 * Renders a realistic mobile device frame (notch, bezel, status bar).
 * Acts as a container for any mobile content (Story, Feed, etc.)
 * 
 * @param {number} height - Optional custom height (default: 812px for standard iPhone)
 */
export default function MobileDeviceFrame({ children, mode = "light", isStory = false, height = 812 }) {
  return (
    <div 
      className={`relative w-[375px] ${isStory ? 'bg-black' : 'bg-white'} rounded-[40px] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden mx-auto flex-shrink-0 box-content`}
      style={{ height: `${height}px` }}
    >
      {/* Outer Rim / Buttons (Visual candy) */}
      <div className="absolute top-24 -left-[14px] w-[2px] h-8 bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute top-36 -left-[14px] w-[2px] h-14 bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute top-28 -right-[14px] w-[2px] h-20 bg-[#2a2a2a] rounded-r-sm" />

      {/* Status Bar Area (hide for Story/Reels to avoid fighting with Story chrome) */}
      {!isStory && (
        <div className="absolute top-0 left-0 right-0 h-11 z-[60] flex justify-between items-end px-6 pb-2 pointer-events-none select-none">
          <div className={`text-[15px] font-semibold tracking-wide ${mode === "dark" ? "text-white" : "text-black"}`}>
            9:41
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className={mode === "dark" ? "text-white" : "text-black"}>
              <path d="M1 11C0.723858 11 0.5 10.7761 0.5 10.5V1.5C0.5 1.22386 0.723858 1 1 1H3C3.27614 1 3.5 1.22386 3.5 1.5V10.5C3.5 10.7761 3.27614 11 3 11H1Z" fill="currentColor" />
              <path d="M7 11C6.72386 11 6.5 10.7761 6.5 10.5V3.5C6.5 3.22386 6.72386 3 7 3H9C9.27614 3 9.5 3.22386 9.5 3.5V10.5C9.5 10.7761 9.27614 11 9 11H7Z" fill="currentColor" />
              <path d="M13 11C12.7239 11 12.5 10.7761 12.5 10.5V6.5C12.5 6.22386 12.7239 6 13 6H15C15.2761 6 15.5 6.22386 15.5 6.5V10.5C15.5 10.7761 15.2761 11 15 11H13Z" fill="currentColor" />
            </svg>
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none" className={mode === "dark" ? "text-white" : "text-black"}>
              <rect x="1" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" />
              <path d="M24 4.5V7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <rect x="3" y="3" width="17" height="6" rx="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}

      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1a1a1a] rounded-b-[18px] z-[60] pointer-events-none" />

      {/* Content Area */}
      <div className={`w-full h-full overflow-hidden ${isStory ? 'bg-black' : 'bg-white'}`}>
        {children}
      </div>

      {/* Home Indicator */}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] ${isStory ? 'bg-white/30' : 'bg-black/20'} rounded-full z-[60] pointer-events-none backdrop-blur-md`} />
    </div>
  );
}

