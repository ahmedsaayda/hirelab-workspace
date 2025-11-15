import React from 'react';

export default function JobAdLandscapeVariant2({ variant, brandData, landingPageData }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center border-2 border-dashed border-purple-300"
      style={{
        width: '640px',
        height: '800px',
      }}
    >
      <div className="text-center p-6">
        <div className="mb-4">
          <svg className="w-16 h-16 text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">
          Job Ad - Variant 2
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
