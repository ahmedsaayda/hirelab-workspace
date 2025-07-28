import React from 'react';
import { Badge, Button } from 'antd';
import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const CustomDomains = () => {
  const features = [
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: "Custom Domain Setup",
      description: "Connect your own domain (e.g., careers.yourcompany.com) to create a professional branded experience for all your job postings."
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "SSL Security & Performance",
      description: "Automatic SSL certificates and global CDN integration for fast, secure job page loading worldwide."
    },
    {
      icon: <CogIcon className="w-6 h-6" />,
      title: "DNS Management",
      description: "Simple DNS configuration with automated health checks and failover protection for maximum uptime."
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Domain Analytics",
      description: "Track domain performance, visitor analytics, and SEO metrics to optimize your recruitment reach."
    },
    {
      icon: <LockClosedIcon className="w-6 h-6" />,
      title: "Advanced Security",
      description: "HTTPS enforcement, DDoS protection, and security headers to protect your brand and candidates' data."
    },
    {
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: "SEO Optimization",
      description: "Custom meta tags, structured data, and search engine optimization to improve job posting visibility."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Header Section */}
         <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GlobeAltIcon className="w-4 h-4" />
            Coming Soon
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Custom Domains
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transform your recruitment presence with professional custom domains. 
            Create a seamless branded experience that builds trust and improves your company's 
            professional image in the job market.
          </p>
        </div>

                 {/* Main Visual */}
         <div className="relative mb-12">
                     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-8">
                             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6">
                 <GlobeAltIcon className="w-12 h-12 text-white" />
               </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Domain Management
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto">
                                 <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Instead of:</div>
                 <div className="text-gray-700 dark:text-gray-200 mb-4 font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  hirelab.app/company/yourjob123
                </div>
                
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">You'll have:</div>
                <div className="text-purple-700 dark:text-purple-300 font-mono bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 font-semibold">
                  careers.yourcompany.com/senior-developer
                </div>
              </div>
            </div>
          </div>
        </div>

                 {/* Features Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
                         <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4 text-white">
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

     
      </div>
    </div>
  );
};

export default CustomDomains; 