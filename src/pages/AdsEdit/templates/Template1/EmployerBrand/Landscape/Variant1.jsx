import React from 'react';

export default function EmployerBrandLandscapeVariant1({ variant, brandData, landingPageData }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center border-2 border-dashed border-green-300"
      style={{
        width: '640px',
        height: '800px',
      }}
    >
      <div className="text-center p-6">
        <div className="mb-4">
          <svg className="w-16 h-16 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">
          Employer Brand Ad
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
