import React from 'react';
import { Badge, Button } from 'antd';
import { 
  SpeakerWaveIcon, 
  ChartBarIcon, 
  CursorArrowRaysIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  BoltIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdsPublishing = () => {
  const platforms = [
    {
      name: "LinkedIn Jobs",
      logo: "🔵",
      features: ["Professional targeting", "Industry-specific reach", "Premium placements"]
    },
    {
      name: "Indeed",
      logo: "🟦", 
      features: ["Global reach", "Pay-per-click", "Sponsored listings"]
    },
    {
      name: "Google for Jobs",
      logo: "🔴",
      features: ["Search visibility", "Local targeting", "Rich snippets"]
    },
    {
      name: "Glassdoor",
      logo: "🟢",
      features: ["Company reviews", "Salary insights", "Targeted posting"]
    }
  ];

  const features = [
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: "One-Click Multi-Platform Publishing",
      description: "Publish your job postings to multiple job boards simultaneously with a single click. Save hours of manual work."
    },
    {
      icon: <CursorArrowRaysIcon className="w-6 h-6" />,
      title: "Smart Audience Targeting",
      description: "AI-powered targeting recommendations based on job requirements, location, salary, and industry best practices."
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Real-Time Performance Analytics",
      description: "Track views, applications, and conversion rates across all platforms with detailed performance insights."
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: "Budget Optimization",
      description: "Automated budget allocation and bid management to maximize your recruitment ROI across platforms."
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Candidate Quality Scoring",
      description: "AI-driven quality scoring to identify which platforms deliver the best candidates for your roles."
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Scheduled Publishing",
      description: "Schedule job postings for optimal times and manage campaign duration automatically."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Header Section */}
         <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              <SpeakerWaveIcon className="w-4 h-4" />
              Coming Soon
            </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ads Publishing
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Supercharge your recruitment reach with automated job ad publishing. 
            Distribute your vacancies across multiple platforms, optimize performance, 
            and attract the best talent with intelligent campaign management.
          </p>
        </div>

                 {/* Main Visual */}
         <div className="relative mb-12">
                     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-8">
                             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                 <SpeakerWaveIcon className="w-12 h-12 text-white" />
               </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Multi-Platform Job Distribution
              </h2>
              
                             {/* Platform Grid */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
                {platforms.map((platform, index) => (
                                     <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                     <div className="text-2xl mb-2">{platform.logo}</div>
                     <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                       {platform.name}
                     </h3>
                     <ul className="text-xs text-gray-700 dark:text-gray-200 space-y-1">
                      {platform.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

                 {/* Features Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
                         <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 text-white">
                {feature.icon}
              </div>
                             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                 {feature.title}
               </h3>
               <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

                 {/* Benefits Section */}
         <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Automated Ads Publishing?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">75%</div>
                             <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Time Saved</div>
               <div className="text-gray-700 dark:text-gray-200">
                Reduce manual posting time by automating distribution across platforms
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">3x</div>
                             <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">More Reach</div>
               <div className="text-gray-700 dark:text-gray-200">
                Increase candidate visibility across multiple job boards simultaneously
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">40%</div>
                             <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Better ROI</div>
               <div className="text-gray-700 dark:text-gray-200">
                Optimize ad spend with intelligent budget allocation and performance tracking
              </div>
            </div>
          </div>
        </div>



                 
      </div>
    </div>
  );
};

export default AdsPublishing; 