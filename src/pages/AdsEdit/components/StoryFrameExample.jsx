/**
 * StoryFrameExample
 * 
 * Example demonstrating how StoryFrame wraps ad content
 * This file is for reference/documentation purposes
 */

import React from "react";
import StoryFrame from "./StoryFrame";

// Example 1: Simple text ad
export function SimpleTextAdExample() {
  const brandData = {
    companyName: "TechCorp",
    logo: "/images/company-logo.png"
  };

  return (
    <StoryFrame brandData={brandData}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            We're Hiring!
          </h1>
          <p className="text-xl mb-8">
            Join our amazing team
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold">
            Apply Now
          </button>
        </div>
      </div>
    </StoryFrame>
  );
}

// Example 2: Image-based ad
export function ImageAdExample() {
  const brandData = {
    companyName: "DesignStudio",
    logo: "/images/studio-logo.png"
  };

  return (
    <StoryFrame brandData={brandData}>
      <div className="w-full h-full relative">
        <img 
          src="/images/team-photo.jpg" 
          alt="Our Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-white text-3xl font-bold mb-2">
            Creative Director
          </h2>
          <p className="text-white/90 text-lg mb-4">
            Lead our design team in London
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </StoryFrame>
  );
}

// Example 3: Testimonial ad
export function TestimonialAdExample() {
  const brandData = {
    companyName: "InnovateCo",
    logo: "/images/innovate-logo.png"
  };

  return (
    <StoryFrame brandData={brandData}>
      <div className="w-full h-full bg-white flex flex-col items-center justify-center p-12">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-6">
          <img 
            src="/images/employee.jpg" 
            alt="Employee"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="text-4xl mb-6">⭐⭐⭐⭐⭐</div>
        <p className="text-center text-xl text-gray-800 mb-4 italic">
          "Best decision of my career. The team is incredible and the work is meaningful."
        </p>
        <p className="text-gray-600 font-semibold">
          Sarah Johnson, Senior Developer
        </p>
      </div>
    </StoryFrame>
  );
}

// Example 4: Without StoryFrame (for comparison)
export function WithoutFrameExample() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">
          Raw Ad Content
        </h1>
        <p className="text-xl mb-8">
          This is what exports to the platform
        </p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-full font-bold">
          Apply Now
        </button>
      </div>
    </div>
  );
}

// Comparison Demo Component
export function StoryFrameComparison() {
  const brandData = {
    companyName: "Demo Company",
    logo: "/logo.png"
  };

  const adContent = (
    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">
          Same Ad Content
        </h1>
        <p className="text-xl">
          With and without frame
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-8 p-8 bg-gray-100">
      {/* With Frame */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center">With StoryFrame (Preview)</h3>
        <div className="w-[375px] h-[667px] mx-auto">
          <StoryFrame brandData={brandData}>
            {adContent}
          </StoryFrame>
        </div>
        <p className="text-sm text-center text-gray-600">
          What users see in the editor
        </p>
      </div>

      {/* Without Frame */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center">Without Frame (Export)</h3>
        <div className="w-[375px] h-[667px] mx-auto">
          {adContent}
        </div>
        <p className="text-sm text-center text-gray-600">
          What gets exported to platforms
        </p>
      </div>
    </div>
  );
}

export default {
  SimpleTextAdExample,
  ImageAdExample,
  TestimonialAdExample,
  WithoutFrameExample,
  StoryFrameComparison
};



