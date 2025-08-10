import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { CheckCircle } from 'lucide-react';
import CrudService from '../../../src/services/CrudService';
import PublicService from '../../../src/services/PublicService';
import MetaPixel from '../../../src/pages/Landingpage/MetaPixel.jsx';

export default function ThankYouPage() {
  const router = useRouter();
  const { lpId } = router.query;
  
  const [landingPageData, setLandingPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lpId) {
      fetchData();
    }
  }, [lpId]);

  // Fire Meta Pixel events after data loads
  useEffect(() => {
    if (!landingPageData?.metaPixelId) return;
    
        // Wait for pixel to be ready, then fire events
    const fireEvents = () => {
      try {
        if (window.fbq) {
          // Check if CompleteRegistration was already fired for this funnel
          const completeKey = `metaCompleteFired_${lpId}`;
          const alreadyComplete = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(completeKey) === '1';
          
          if (!alreadyComplete) {
            console.log('Firing CompleteRegistration from thank-you page');
            window.fbq('track', 'CompleteRegistration', {
              content_name: landingPageData?.vacancyTitle || '',
              funnel_id: lpId || '',
              brand: landingPageData?.companyName || '',
              job_category: landingPageData?.department || ''
            });
            try { 
              sessionStorage.setItem(completeKey, '1');
              console.log('CompleteRegistration marked as fired for funnel:', lpId);
            } catch (_) {}
          } else {
            console.log('CompleteRegistration already fired for this funnel');
          }
        } else {
          console.warn('fbq not available on thank-you page');
        }
      } catch (e) { 
        console.warn('Pixel events failed on thank-you', e); 
      }
    };

    // Try immediately, then retry after a short delay
    fireEvents();
    const timeout = setTimeout(fireEvents, 500);
    
    return () => clearTimeout(timeout);
  }, [landingPageData?.metaPixelId, lpId]);

  const fetchData = async () => {
    try {
      // const res = await CrudService.getSingle("LandingPageData", lpId, "thank you page");
      const res = await PublicService.getLP(lpId);
      if (res.data?.lp) {
        console.log("res.data?.lp",res.data?.lp)
        setLandingPageData(res.data?.lp);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Load Meta Pixel */}
      <MetaPixel metaPixelId={landingPageData?.metaPixelId} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {landingPageData?.companyLogo && (
              <img 
                src={landingPageData.companyLogo} 
                alt="Company Logo" 
                className="h-8 w-auto"
              />
            )}
            <h1 className="text-lg font-semibold text-gray-900">
              {landingPageData?.vacancyTitle || 'Job Application'}
            </h1>
          </div>
        </div>
      </div>

      {/* Thank You Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {landingPageData?.thankYouTitle || "Application Submitted Successfully!"}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {landingPageData?.thankYouMessage 
              ? landingPageData.thankYouMessage
                  .replace('{vacancyTitle}', landingPageData?.vacancyTitle || 'this position')
                  .replace('{companyName}', landingPageData?.companyName || 'our company')
              : `Thank you for applying to ${landingPageData?.vacancyTitle} at ${landingPageData?.companyName || 'our company'}. We've received your application and will review it carefully.`
            }
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              {landingPageData?.thankYouNextStepsTitle || "What happens next?"}
            </h3>
            <ul className="text-left text-blue-800 space-y-2">
              {landingPageData?.thankYouNextSteps && landingPageData.thankYouNextSteps.length > 0
                ? landingPageData.thankYouNextSteps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))
                : (
                  <>
                    <li>• Our team will review your application within 2-3 business days</li>
                    <li>• If you're a good fit, we'll reach out to schedule an interview</li>
                    <li>• You'll receive email updates about your application status</li>
                  </>
                )
              }
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="large"
              onClick={() => router.push(`/lp/${lpId}`)}
              className="px-8"
            >
              {landingPageData?.thankYouBackButtonText || "Back to Job Posting"}
            </Button>
            
            {landingPageData?.companyUrl && (
              <Button 
                type="primary"
                size="large"
                onClick={() => {
                  const url = landingPageData.companyUrl.startsWith('https://') || landingPageData.companyUrl.startsWith('http://') 
                    ? landingPageData.companyUrl 
                    : `https://${landingPageData.companyUrl}`;
                  window.open(url, '_blank');
                }}
                className="bg-[#5207CD] hover:bg-[#0C7CE6] px-8"
              >
                {landingPageData?.thankYouLearnMoreButtonText || "Learn More"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 