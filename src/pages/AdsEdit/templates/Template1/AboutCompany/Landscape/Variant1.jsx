import React from 'react';

export default function AboutCompanyLandscapeVariant1({ variant, brandData, landingPageData }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center border-2 border-dashed border-indigo-300"
      style={{
        width: '640px',
        height: '800px',
      }}
    >
      <div className="text-center p-6">
        <div className="mb-4">
          <svg className="w-16 h-16 text-indigo-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">
          About Company Ad
        </div>
        <div className="text-base font-medium text-gray-600 mb-3">
          Landscape (4:5)
        </div>
        <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
          Coming Soon
        </div>
        <div className="mt-4 text-xs text-gray-500">
          640 × 800px
        </div>
      </div>
    </div>
  );
}

