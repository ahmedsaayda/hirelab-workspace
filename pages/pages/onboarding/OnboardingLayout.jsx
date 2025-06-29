// OnboardingLayout.jsx
import React from "react";



const OnboardingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <header className="z-20 flex flex-col items-center justify-between px-6 pb-6 bg-white border-b border-gray-200 md:px-16 md:pb-0 md:h-16 md:top-0 md:flex-row">
        <div className="text-xl font-semibold font-inter">
          {/* <img height="32" className="" src="/assets/logo.png" /> */}
        </div>
        <div className="flex flex-col items-center justify-between w-full gap-3 md:flex-row">
          <div className="mx-auto">
            {/* <Stepper /> */}
          </div>
          {/* <InviteModal /> */}
        </div>
      </header>
      {/* <Stepper /> */}
      <main className="flex-grow px-6 md:px-16">{children}</main>
    </div>
  );
};

export default OnboardingLayout;
