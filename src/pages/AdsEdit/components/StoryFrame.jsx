import React from "react";

/**
 * StoryOverlay Component
 * 
 * Provides just the UI overlay elements for a Story/Reel (Progress, Profile, Controls)
 * To be used INSIDE MobileDeviceFrame.
 */
export default function StoryOverlay({ children, brandData }) {
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
        <div className="relative z-10 px-3 pt-10">
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
              {/* More Options (3 dots) */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="1.5" fill="white"/>
                  <circle cx="12" cy="12" r="1.5" fill="white"/>
                  <circle cx="12" cy="19" r="1.5" fill="white"/>
                </svg>
              </button>
              
              {/* Close Button (X) */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay for better text readability */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" /> */}
        
        {/* Bottom Action Area (Like/Send) - hidden in editor to avoid covering CTA */}
      </div>
    </div>
  );
}