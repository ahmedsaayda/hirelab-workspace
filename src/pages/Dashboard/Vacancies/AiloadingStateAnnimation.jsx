import React, { useState, useEffect, FC } from "react";



const AiLoadingStateAnimation = ({
  title = "Creating Your Vacancy",
  subtitle = "Our AI is working to create the perfect vacancy for you. This may take a minute...",
  onCancel,
  loadingSteps = [
    "Analyzing job requirements...",
    "Crafting compelling job description...",
    "Designing the perfect landing page...",
    "Adding company branding...",
    "Finalizing your vacancy...",
  ],
  currentStep = 0,
  showTips = true,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Collection of hiring facts to display as tips
  const hiringFacts = [
    "The average corporate job opening receives 250 resumes, but only 4-6 candidates get interviewed.",
    "75% of hiring managers have caught a lie on a resume.",
    "Nearly 85% of jobs are filled through networking rather than job postings.",
    "Companies with diverse workforces are 35% more likely to outperform their competitors.",
    "It costs an average of $4,000 to hire a new employee.",
    "The best candidates are often hired within 10 days of becoming available in the job market.",
    "Employee referrals have the highest ROI of any recruiting source, with a 40% conversion rate.",
    "Candidates who are hired via video interviews are 2x less likely to quit within 90 days.",
    "Companies with strong employer brands receive 50% more qualified applicants.",
    "The cost of a bad hire can reach up to 30% of the employee's first-year earnings.",
  ];

  // Rotate tips every 6 seconds
  useEffect(() => {
    if (showTips) {
      const interval = window.setInterval(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % hiringFacts.length);
      }, 6000);

      return () => window.clearInterval(interval);
    }
  }, [showTips, hiringFacts.length]);

  // Animate progress bar
  useEffect(() => {
    // Calculate target progress based on current step
    const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100;

    // Animate progress from current to target
    let animProgress = progress;
    const animInterval = window.setInterval(() => {
      if (animProgress >= targetProgress) {
        window.clearInterval(animInterval);
      } else {
        animProgress += 0.5;
        setProgress(animProgress);
      }
    }, 50);

    return () => window.clearInterval(animInterval);
  }, [currentStep, loadingSteps.length, progress]);

  return (
    <div className="flex flex-col justify-center items-center px-8 py-10 mx-auto max-w-xl text-center">
      {/* Title and subtitle */}
      <h3 className="mb-6 text-2xl font-bold">{title}</h3>
      <p className="mb-6 text-gray-600">{subtitle}</p>

      {/* Progress steps */}
      <div className="mb-6 w-full max-w-md">
        <div className="overflow-hidden mb-2 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-3 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{loadingSteps[currentStep]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips section */}
      {showTips && (
        <div className="p-4 mt-6 max-w-md bg-[#E0FFFF] rounded-lg">
          <h4 className="mb-2 text-sm font-semibold text-blue-800">
            Did you know?
          </h4>
          <p className="text-sm text-gray-700 min-h-[3rem] transition-opacity duration-500">
            {hiringFacts[tipIndex]}
          </p>
        </div>
      )}

      {/* Cancel button */}
      {onCancel && (
        <div className="mt-8">
          <button
            onClick={onCancel}
            className="px-8 py-2 text-gray-700 bg-gray-200 rounded-md transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AiLoadingStateAnimation;
