import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../../src/pages/Dashboard/Vacancies/components/components/Header';
import CrudService from '../../../src/services/CrudService';

export default function LaunchPage() {
  const router = useRouter();
  const { lpId } = router.query;
  const [landingPageData, setLandingPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lpId) {
      fetchLandingPageData();
    }
  }, [lpId]);

  const fetchLandingPageData = async () => {
    try {
      setLoading(true);
      const response = await CrudService.getById("LandingPageData", lpId);
      setLandingPageData(response.data);
    } catch (error) {
      console.error("Error fetching landing page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    fetchLandingPageData();
  };

  const setPublished = (published) => {
    setLandingPageData(prev => ({
      ...prev,
      published
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Launch - {landingPageData?.vacancyTitle || 'HireLab'}</title>
        <meta name="description" content="Launch your hiring campaign" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <Header
              landingPageData={landingPageData}
              setPublished={setPublished}
              setLandingPageData={setLandingPageData}
              reload={reload}
              lpId={lpId}
              isFormEditor={false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              {/* Launch Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-full shadow-lg">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 2L13.09 8.26L22 9L13.09 15.74L16 22L12 19L8 22L10.91 15.74L2 9L10.91 8.26L12 2Z" 
                      fill="white" 
                      fillOpacity="0.9"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Launch Coming Soon
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get ready to launch your hiring campaign! Advanced launch features and analytics will be available here soon.
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What's Coming:
                  </h3>
                  <ul className="text-left space-y-2 text-gray-700 max-w-md mx-auto">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Campaign Analytics Dashboard
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Multi-platform Publishing
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Advanced Targeting Options
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Performance Tracking
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  
                  <p className="text-purple-600 text-sm font-medium">
                    Building the future of hiring campaigns...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
