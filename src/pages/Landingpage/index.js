"use client"

import { Skeleton } from "antd";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import PublicService from "../../services/PublicService.js";
import { changeIndigoShades, generateTailwindPalette } from "../Dashboard/index.js";
import { renderSection } from "../LandingpageEdit/renderSection.js";
import { Button } from "./components/index.jsx";
import Footer from "./Footer.js";
import Form from "./Form.js"; // Import the new FormEditor component
import HeroSection from "./HeroSection.js";
import NavBar from "./NavBar.jsx";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import MetaPixel from "./MetaPixel.jsx";
import { useFocus } from "../../contexts/FocusContext.js";
import { useHover } from "../../contexts/HoverContext.js";
import CrudService from "../../services/CrudService.js";

export default function LandingpagePage({ paramsId, overrideParamId = null, fullscreen = false, showBackToEditButton = false, setFullscreen,defaultLandingPageData = null }) {
  const lpId = overrideParamId ?? paramsId;
  const [landingPageData, setLandingPageData] = useState(defaultLandingPageData);
  console.log(landingPageData);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [showFormEditor, setShowFormEditor] = useState(false); // New state for form editor visibility

  // Analytics tracking
  const startTimeRef = useRef(Date.now());
  const hasTrackedVisitRef = useRef(false);
  const lastTimeUpdateRef = useRef(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Track visit to landing page
  const trackVisit = useCallback(async () => {
    if (!lpId || hasTrackedVisitRef.current) return;
    
    try {
      hasTrackedVisitRef.current = true;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/track-visit/${lpId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Visit tracked for landing page:", lpId, data);
      } else {
        throw new Error('Failed to track visit');
      }
    } catch (error) {
      console.error("Error tracking visit:", error);
      hasTrackedVisitRef.current = false;
    }
  }, [lpId]);

  // Send time update to backend
  const sendTimeUpdate = useCallback(async (timeInSeconds) => {
    if (!lpId || timeInSeconds < 1) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/track-time/${lpId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSpent: timeInSeconds }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Time update sent:", timeInSeconds, "seconds", data);
        lastTimeUpdateRef.current = Date.now();
        setTotalTimeSpent(prev => prev + timeInSeconds);
      }
    } catch (error) {
      console.error("Error sending time update:", error);
    }
  }, [lpId]);

  // Send time updates every 5 seconds
  useEffect(() => {
    if (!lpId) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastUpdate = Math.floor((currentTime - lastTimeUpdateRef.current) / 1000);
      
      if (timeSinceLastUpdate >= 5) {
        sendTimeUpdate(timeSinceLastUpdate);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lpId, sendTimeUpdate]);

  // Track visit on page load and initialize time tracking
  useEffect(() => {
    if (landingPageData) {
      trackVisit();
      // Initialize time tracking
      lastTimeUpdateRef.current = Date.now();
    }
  }, [landingPageData, trackVisit]);

  // Send final time update when page becomes hidden (tab switch, etc)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const currentTime = Date.now();
        const timeSinceLastUpdate = Math.floor((currentTime - lastTimeUpdateRef.current) / 1000);
        
        // Send any remaining time if it's been more than 1 second
        if (timeSinceLastUpdate >= 1) {
          sendTimeUpdate(timeSinceLastUpdate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendTimeUpdate]);

  // Add navbar height adjustment
  useEffect(() => {
    const navbarHeight = 128;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    document.documentElement.style.setProperty('scroll-padding-top', `${navbarHeight}px`);
    
    // Add styles for scroll behavior
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: var(--navbar-height, 128px);
      }
      body {
        padding-top: var(--navbar-height, 128px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchData = useCallback(() => {
    if (lpId && !defaultLandingPageData) {
      PublicService.getLP(lpId).then((res) => {
        if (res.data?.lp) setLandingPageData(res.data.lp);
      });
      // PublicService.getLPBrand(lpId).then((res) => {
      //   if (res.data?.color) {
      //     // changeIndigoShades(generateTailwindPalette(res.data?.color));
      //   }
      // });
    }
  }, [lpId]);

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowApplyButton(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  useEffect(() => {
    const handleApply = () => {
      try {
        if (landingPageData?.metaPixelId && window.fbq) {
          fbq('track', 'Lead', {
            content_name: landingPageData?.vacancyTitle || '',
            funnel_id: lpId || '',
            brand: landingPageData?.companyName || '',
            job_category: landingPageData?.department || ''
          });
          try { sessionStorage.setItem(`metaLeadFired_${lpId}`, '1'); } catch (_) {}
        }
      } catch (e) { console.warn('Pixel Lead (APPLY event) failed', e); }
      setShowFormEditor(true);
    };
    const handleApplyButtonClick = (event) => {
      if (event.target?.href?.includes?.("#apply")) {
        handleApply();
      }
      if (event.target?.href?.includes?.("#share")) {
        // handle share (modal to allow user choose from a list of social media to share this job)
      }
    };

    document.addEventListener("click", handleApplyButtonClick);
    document.addEventListener("APPLY", handleApply);

    return () => {
      document.removeEventListener("click", handleApplyButtonClick);
      document.removeEventListener("APPLY", handleApply);
    };
  }, []);

  if (!landingPageData) return <Skeleton active />;
  // if (!landingPageData?.published) return <></>;

  return (
    <div className="w-full">
      <ApplyCustomFont landingPageData={landingPageData} />
      <MetaPixel metaPixelId={landingPageData?.metaPixelId} />
      {/* Meta Pixel PageView + Lead (on open form) */}
      {landingPageData?.metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.fbq) {
                  fbq('track', 'PageView', {
                    content_name: ${JSON.stringify(landingPageData?.vacancyTitle || '')},
                    funnel_id: ${JSON.stringify(lpId || '')},
                    brand: ${JSON.stringify(landingPageData?.companyName || '')},
                    job_category: ${JSON.stringify(landingPageData?.department || '')}
                  });
                }
              } catch (e) { console.warn('Pixel PageView failed', e); }
            `,
          }}
        />
      )}
      
      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
          <div>Total Time: {totalTimeSpent}s</div>
          <div>LP ID: {lpId}</div>
        </div>
      )}

      <div className="flex flex-col justify-between items-center">
        <NavBar
          landingPageData={landingPageData}
          onClickApply={() => {
            try {
              if (landingPageData?.metaPixelId && window.fbq) {
                fbq('track', 'Lead', {
                  content_name: landingPageData?.vacancyTitle || '',
                  funnel_id: lpId || '',
                  brand: landingPageData?.companyName || '',
                  job_category: landingPageData?.department || ''
                });
              }
            } catch (e) { console.warn('Pixel Lead failed', e); }
            setShowFormEditor(true);
          }}
          fullscreen={fullscreen}
          showBackToEditButton={showBackToEditButton}
          setFullscreen={setFullscreen}
          lpId={lpId}
          isEdit={false}
          setLandingPageData={setLandingPageData}
        />

        <HeroSection landingPageData={landingPageData} fetchData={fetchData} />

        {(landingPageData?.menuItems ?? [])
          ?.filter(section => section.visible !== false)
          ?.map((section, idx) =>
            renderSection({ section, landingPageData, fetchData, key: idx })
          )}

        <Footer 
          landingPageData={landingPageData} 
          fetchData={fetchData}
          onClickApply={() => setShowFormEditor(true)}
          lpId={lpId}
          isEdit={false}
        />

        <Form
          landingPageData={landingPageData}
          setLandingPageData={setLandingPageData}
          showFormEditor={showFormEditor}
          setShowFormEditor={setShowFormEditor}
        />
      </div>
    </div>
  );
}
