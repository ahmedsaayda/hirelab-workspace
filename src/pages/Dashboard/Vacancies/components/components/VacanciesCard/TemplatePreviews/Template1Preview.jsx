import React from 'react'



import { MapPin, Clock, Coins } from 'lucide-react'; 

import {HireLabLogo} from '../../Logo/logo';
// hirelab-frontend\public\images\VacancyPreviewThumbnail\Hero Banner.svg
import { Img } from '../../Img';
import JobCard from './JobCard';
export default function Template1Preview  ({ landingPageData }){

    // const JobCard = () =>{
    //   return (
    //     <div className="">
    //     {/* Job Card */}
    //     <div className="h-full   flex gap-0 overflow-hidden">
    //       {/* Left Content */}
    //       <div className="flex-1 min-w-0 flex flex-col">
    //         <h6 className="text-xs font-semibold text-gray-900 truncate">
    //           {landingPageData.vacancyTitle.substring(0,20)}{"..."}
    //         </h6>
    //         <p className="text-gray-600 text-[10px] line-clamp-2 mb-2">
    //           {landingPageData.heroDescription.substring(0,20)}{"..."}
    //         </p>
    //         {/* Job Details */}
    //         <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-auto">
    //           <div className="flex items-center text-[6px] gap-1">
    //             <span className="font-medium">
    //               {landingPageData.salaryMin}-{landingPageData.salaryMax}{landingPageData.salaryCurrency}
    //             </span>
    //             <span className="text-gray-500">/{landingPageData.salaryTime}</span>
    //           </div>
    //           <div className="flex items-center text-[6px] gap-1">
    //             <MapPin className="w-3 h-3" />
    //             <span>{landingPageData.location[0]}</span>
    //           </div>
    //           <div className="flex items-center text-[6px] gap-1">
    //             <Clock className="w-3 h-3" />
    //             <span>{landingPageData.hoursMin}-{landingPageData.hoursMax} / {landingPageData.hoursUnit}</span>
    //           </div>
    //         </div>
    //         {/* Action Buttons */}
    //         <div className="flex gap-2 mt-2">
    //           <a
    //             href={landingPageData.cta1Link}
    //             className="  text-[8px] px-1 py-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    //           >
    //             {landingPageData.cta1Title}
    //           </a>
    //           <a
    //             href={landingPageData.cta2Link}
    //             className="  text-[8px] px-1 py-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    //           >
    //             {landingPageData.cta2Title}
    //           </a>
    //         </div>
    //       </div>
    //       <div className="relative w-[120px] h-full">
    //         <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden z-50">
    //           <img
    //             src={landingPageData.heroImage}
    //             alt={landingPageData.vacancyTitle}
    //             className="w-full h-full object-cover"
    //           />
    //         </div>
    //         <div className="absolute inset-0 pointer-events-none">
    //           <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-200 rounded-full opacity-50"></div>
    //           <div className="absolute top-0 right-8 w-4 h-4 bg-blue-300 rounded-full opacity-40"></div>
    //           <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-300 rounded-full opacity-50"></div>
    //           <div className="absolute top-4 -left-1 w-3 h-3 bg-blue-100 rounded-full opacity-40"></div>
    //           <div className="absolute bottom-8 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-30"></div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   )
  
    // }

      
  
  const SmallJobCard = ({ landingPageData }) => {
    return (
      <div className="w-[96px] h-[110px] bg-white shadow flex flex-col justify-between  overflow-hidden px-2 py-1">
        <h6 className="text-[12px] font-semibold text-gray-900 truncate">
          {landingPageData.vacancyTitle.substring(0, 10)}...
        </h6>
        <div className="text-gray-600 text-[8px] truncate">
          {landingPageData.heroDescription.substring(0, 7)}...
        </div>
        <div className="text-[5px] text-gray-600">
          <span className="font-medium">
            {landingPageData.salaryMin}-{landingPageData.salaryMax}
            {landingPageData.salaryCurrency}
          </span>
          <span>/{landingPageData.salaryTime}</span>
        </div>
        <div className="flex justify-start gap-1">
          <div className="flex items-center gap-1 text-[5px] text-gray-600">
            <MapPin className="w-1.5 h-1.5" />
            <span>{landingPageData.location[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-[5px] text-gray-600">
            <Clock className="w-1.5 h-1.5" />
            <span>
              {landingPageData.hoursMin}-{landingPageData.hoursMax}/
              {landingPageData.hoursUnit}
            </span>
          </div>
        </div>
        <div>
        <div className="flex gap-2 mt-2">
              <a
                href={landingPageData.cta1Link}
                className=" text-[4px] px-[2px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {landingPageData.cta1Title}
              </a>
              <a
                href={landingPageData.cta2Link}
                className=" text-[4px] px-[2px] bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {landingPageData.cta2Title}
              </a>
            </div>
        </div>
        <div className="relative w-[30px] h-[30px] mx-auto rounded-full overflow-hidden">
          <img
            src={landingPageData.heroImage}
            alt={landingPageData.vacancyTitle}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };


  return (
    <div className=" h-[auto] w-full ">


      {/* Website Mockups */}
      <div className="">
        <div className="relative">
          {/* Desktop Mockup */}
          <div className="bg-gray-100 shadow-lg rounded-lg">
            <div className="bg-white rounded-lg  overflow-hidden">
              {/* Browser Bar */}
              <div className="hidden bg-gray-50 border-b px-4 py-1 flex items-center justify-between gap-2">
                <HireLabLogo />

                <div>
                  <div className="ml-4 flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className=" p-1">
                <JobCard  landingPageData={landingPageData}/>
                {/*  
                img path // hirelab-frontend\public\images\VacancyPreviewThumbnail\Hero Banner.svg
                curr file path hirelab-frontend\src\pages\Dashboard\Vacancies\components\VacanciesCard\TemplatePreviews\Template1Preview.jsx
                add below image with svg correct path 
                */}
                {/* <Img src="/images/VacancyPreviewThumbnail/Hero Banner.svg" alt="Hero Banner" className="w-full h-auto rounded-lg" /> */}


              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
