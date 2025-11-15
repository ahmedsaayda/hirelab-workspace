import React from "react";

/**
 * StoryFrame Component
 * 
 * Wraps ad content with realistic Instagram/Facebook Stories UI elements
 * This provides a more authentic preview experience while keeping the actual
 * ad content separate from the platform UI elements.
 * 
 * UI Elements (NOT part of the actual ad):
 * - Progress bar at the top
 * - Profile info (logo, name, time)
 * - Controls (pause, audio, more options)
 */
export default function StoryFrame({ children, brandData }) {
  // Extract brand info or use defaults
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.logo || brandData?.companyLogo || "/logo.png";
  const timePosted = "14h"; // Static for preview purposes

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Story Content (The actual ad) */}
      <div className="absolute inset-0">
        {children}
      </div>

      {/* Story UI Overlay (NOT part of the ad) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Section */}
        <div className="relative z-10 px-3 pt-3">
          {/* Progress Bar */}
          <div className="flex gap-1 mb-3">
            {/* Active progress bar - showing current story */}
            <div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full"
                style={{
                  width: '65%',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
            {/* Remaining progress bars - upcoming stories */}
            {[1, 2].map((i) => (
              <div 
                key={i}
                className="flex-1 h-0.5 bg-white/30 rounded-full"
              />
            ))}
          </div>

          {/* Header with Profile Info and Controls */}
          <div className="flex items-center justify-between">
            {/* Left: Profile Info */}
            <div className="flex items-center gap-2">
              {/* Profile Picture / Logo */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {brandLogo ? (
                    <img 
                      src={brandLogo} 
                      alt={brandName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initial letter if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-xs font-bold">${brandName.charAt(0).toUpperCase()}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold bg-gray-700">
                      {brandName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Name and Time */}
              <div className="flex items-center gap-1.5">
                <span className="text-white text-sm font-semibold drop-shadow-lg">
                  {brandName}
                </span>
                <span className="text-white/80 text-sm drop-shadow-lg">
                  {timePosted}
                </span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Pause Button */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
                  <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
                </svg>
              </button>

              {/* Audio/Volume Button */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* More Options (3 dots) */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="1.5" fill="white"/>
                  <circle cx="12" cy="12" r="1.5" fill="white"/>
                  <circle cx="12" cy="19" r="1.5" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Preview Label (optional - can be removed for production) */}
      <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
        <div className="text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
          Story Preview Frame
        </div>
      </div>
    </div>
  );
}



