import React from "react";
import { Button } from "antd";

export default function EmptyState({ onGenerate, loading }) {
  return (
    <div className="flex items-center justify-center h-full bg-[#f9fafb]">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-[#eff8ff] rounded-full flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 8.33334V31.6667M8.33337 20H31.6667M28.3334 11.6667L11.6667 28.3333M11.6667 11.6667L28.3334 28.3333"
              stroke="#0e87fe"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-[#101828] mb-3">
          No Ads Created Yet
        </h3>

        {/* Description */}
        <p className="text-[#475467] text-base mb-6 leading-relaxed">
          Generate ad variants automatically from your landing page content. 
          We'll create multiple versions optimized for different platforms and audiences.
        </p>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="px-6 py-3 bg-[#0e87fe] hover:bg-[#0c76e5] text-white font-semibold text-base rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4.16666V15.8333M4.16663 10H15.8333"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Generate Ads
            </>
          )}
        </button>

        {/* Info Text */}
        <div className="mt-6 flex items-start gap-2 text-left bg-[#eff8ff] p-4 rounded-lg">
          <svg className="w-5 h-5 text-[#0e87fe] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-[#344054]">
            <strong className="font-semibold">Smart Generation:</strong> We'll extract images, text, and branding from your landing page to create professional ads in multiple formats.
          </div>
        </div>
      </div>
    </div>
  );
}




