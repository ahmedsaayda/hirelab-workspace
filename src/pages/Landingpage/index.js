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

// Helper function to ensure pixel is ready before firing events
const waitForPixel = (callback, maxRetries = 10, retryDelay = 500) => {
  let retries = 0;
  
  const checkAndFire = () => {
    if (window.fbq && typeof window.fbq === 'function') {
      console.log('✅ PIXEL-READY: fbq is available, firing event');
      callback();
    } else if (retries < maxRetries) {
      retries++;
      console.log(`⏳ PIXEL-WAIT: Attempt ${retries}/${maxRetries}, retrying in ${retryDelay}ms...`);
      setTimeout(checkAndFire, retryDelay);
    } else {
      console.error('❌ PIXEL-TIMEOUT: fbq not available after max retries');
    }
  };
  
  checkAndFire();
};

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

  // Inactivity timer tracking (2 minutes = 120 seconds)
  const INACTIVITY_THRESHOLD = 120 * 1000; // 2 minutes in milliseconds
  const lastActivityRef = useRef(Date.now());
  const activeTimeRef = useRef(0); // Track only active time
  const sessionStartRef = useRef(Date.now());
  const isActiveRef = useRef(true);

  // Debug tool state
  const [debugLogs, setDebugLogs] = useState([]);
  const [debugExpanded, setDebugExpanded] = useState(false);
  const debugLogsRef = useRef([]);
  
  // Check for debug parameter in URL
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  
  useEffect(() => {
    // Check for debug parameter in URL (?debug=hirelab2024 or ?hldbg=true)
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');
    const hldbgParam = urlParams.get('hldbg');
    
    const isDebugMode = process.env.NODE_ENV === 'development' || 
                       debugParam === 'hirelab2024' || debugParam ==="true"||
                       hldbgParam === 'true';
    
    setIsDebugEnabled(isDebugMode);
    
    if (isDebugMode && process.env.NODE_ENV !== 'development') {
      console.log('🔧 Hirelab Analytics Debug Mode Enabled');
    }
  }, []);

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

  // Debug logging function
  const addDebugLog = useCallback((message, type = 'info') => {
    if (!isDebugEnabled) return; // Only log when debug is enabled
    
    const timestamp = new Date().toLocaleTimeString();
    const newLog = { 
      id: Date.now(), 
      timestamp, 
      message, 
      type,
      activeTime: Math.round(activeTimeRef.current / 1000),
      isActive: isActiveRef.current
    };
    
    debugLogsRef.current = [newLog, ...debugLogsRef.current.slice(0, 49)]; // Keep last 50 logs
    setDebugLogs([...debugLogsRef.current]);
    
    // Also log to console
    const icon = type === 'activity' ? '🎯' : type === 'timer' ? '⏱️' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} DEBUG: ${message}`);
  }, [isDebugEnabled]);

  // Activity detection function
  const recordActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // If user was inactive for more than threshold, we had a gap
    if (timeSinceLastActivity > INACTIVITY_THRESHOLD && isActiveRef.current) {
      const inactiveSeconds = Math.round(timeSinceLastActivity / 1000);
      addDebugLog(`User was inactive for ${inactiveSeconds}s - pausing timer`, 'warning');
      isActiveRef.current = false;
      
      // Calculate active time before the inactivity
      const sessionTime = lastActivityRef.current - sessionStartRef.current;
      if (sessionTime > 0) {
        activeTimeRef.current += sessionTime;
        const sessionSeconds = Math.round(sessionTime / 1000);
        const totalSeconds = Math.round(activeTimeRef.current / 1000);
        addDebugLog(`Added ${sessionSeconds}s to active time (total: ${totalSeconds}s)`, 'timer');
      }
    }
    
    // If user was inactive and now becomes active, restart session
    if (!isActiveRef.current) {
      addDebugLog(`User is active again - restarting timer`, 'activity');
      isActiveRef.current = true;
      sessionStartRef.current = now;
    }
    
    lastActivityRef.current = now;
  }, [addDebugLog]);

  // Send time update to backend (only active time)
  const sendTimeUpdate = useCallback(async (timeInSeconds) => {
    if (!lpId || timeInSeconds < 1) return;
    
    try {
      addDebugLog(`Sending ${timeInSeconds}s to backend...`, 'timer');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/track-time/${lpId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSpent: timeInSeconds }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addDebugLog(`✅ Sent ${timeInSeconds}s successfully (Total: ${data.totalTimeSpent}s)`, 'timer');
        lastTimeUpdateRef.current = Date.now();
        setTotalTimeSpent(prev => prev + timeInSeconds);
      } else {
        addDebugLog(`❌ Failed to send time update: ${response.status}`, 'warning');
      }
    } catch (error) {
      addDebugLog(`❌ Error sending time update: ${error.message}`, 'warning');
    }
  }, [lpId, addDebugLog]);

  // Calculate and send active time updates every 5 seconds
  useEffect(() => {
    if (!lpId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      // Check for inactivity first
      const timeSinceLastActivity = now - lastActivityRef.current;
      if (timeSinceLastActivity > INACTIVITY_THRESHOLD && isActiveRef.current) {
        // User became inactive - calculate final session time
        const sessionTime = lastActivityRef.current - sessionStartRef.current;
        if (sessionTime > 0) {
          activeTimeRef.current += sessionTime;
          const sessionSeconds = Math.round(sessionTime / 1000);
          const totalSeconds = Math.round(activeTimeRef.current / 1000);
          addDebugLog(`⏸️ Timer paused: adding final ${sessionSeconds}s (total: ${totalSeconds}s)`, 'warning');
        }
        isActiveRef.current = false;
      }
      
      // Calculate active time to send
      let activeTimeToSend = 0;
      
      if (isActiveRef.current) {
        // User is active - add current session time
        const currentSessionTime = now - sessionStartRef.current;
        const totalActiveTime = activeTimeRef.current + currentSessionTime;
        const timeSinceLastUpdate = Math.floor((now - lastTimeUpdateRef.current) / 1000);
        
        // Only send if we have at least 5 seconds of active time
        if (timeSinceLastUpdate >= 5) {
          activeTimeToSend = Math.floor(totalActiveTime / 1000) - Math.floor(activeTimeRef.current / 1000);
          
          if (activeTimeToSend > 0) {
            // Update our tracked active time
            activeTimeRef.current = totalActiveTime;
            sessionStartRef.current = now; // Reset session start
          }
        }
      }
      
      if (activeTimeToSend > 0) {
        sendTimeUpdate(activeTimeToSend);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lpId, sendTimeUpdate, addDebugLog]);

  // Track visit on page load and initialize time tracking
  useEffect(() => {
    if (landingPageData) {
      trackVisit();
      // Initialize time tracking
      const now = Date.now();
      lastTimeUpdateRef.current = now;
      lastActivityRef.current = now;
      sessionStartRef.current = now;
      activeTimeRef.current = 0;
      isActiveRef.current = true;
      
      addDebugLog('🚀 Analytics tracking initialized (2min inactivity threshold)', 'activity');
    }
  }, [landingPageData, trackVisit, addDebugLog]);

  // Send final active time update when page becomes hidden (tab switch, etc)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isActiveRef.current) {
        const now = Date.now();
        
        // Calculate final session time and send only active time
        const currentSessionTime = now - sessionStartRef.current;
        const totalActiveTime = activeTimeRef.current + currentSessionTime;
        const activeTimeToSend = Math.floor(totalActiveTime / 1000) - Math.floor(activeTimeRef.current / 1000);
        
        if (activeTimeToSend >= 1) {
          console.log(`👋 VISIBILITY: Sending final active time: ${activeTimeToSend}s`);
          sendTimeUpdate(activeTimeToSend);
          activeTimeRef.current = totalActiveTime;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendTimeUpdate]);

  // Activity listeners - detect user interaction to track activity
  useEffect(() => {
    if (!lpId) return;

    // List of events that indicate user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'touchmove', 'click', 'focus'
    ];

    // Throttle activity recording to avoid excessive calls
    let activityTimeout;
    const throttledRecordActivity = () => {
      if (activityTimeout) return;
      
      activityTimeout = setTimeout(() => {
        recordActivity();
        activityTimeout = null;
      }, 1000); // Maximum once per second
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, throttledRecordActivity, true);
    });

    return () => {
      // Clean up event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, throttledRecordActivity, true);
      });
      
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
    };
  }, [lpId, recordActivity]);

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
      })
      .catch((err) => {
        console.log("error fetching data",err)
      })
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

  // Fire PageView event when landing page loads
  useEffect(() => {
    if (!landingPageData?.metaPixelId || !lpId) return;

    const fireLandingPageView = () => {
      
      waitForPixel(() => {
        console.log('🎯 LANDING: Starting to fire PageView event');
        try {
          window.fbq('trackCustom', 'Hirelab.PageView', {
            content_name: landingPageData?.vacancyTitle || '',
            funnel_id: lpId || '',
            company: landingPageData?.companyName || '',
            job_category: landingPageData?.department || ''
          });
          console.log('✅ LANDING: Hirelab.PageView event fired successfully');
        } catch (e) {
          console.error('❌ LANDING: Hirelab.PageView event failed:', e);
        }
      });
    };

    // Fire PageView event
    fireLandingPageView();
  }, [landingPageData?.metaPixelId, lpId]);

  useEffect(() => {
    const handleApply = () => {
      try {
        if (landingPageData?.metaPixelId) {
          console.log('🎯 LANDING: Firing Hirelab.FormView event (Apply button clicked)');
          waitForPixel(() => {
            try {
              fbq('trackCustom', 'Hirelab.FormView', {
                content_name: landingPageData?.vacancyTitle || '',
                funnel_id: lpId || '',
                company: landingPageData?.companyName || '',
                job_category: landingPageData?.department || ''
              });
              try { sessionStorage.setItem(`metaLeadFired_${lpId}`, '1'); } catch (_) {}
              console.log('✅ LANDING: Hirelab.FormView event fired successfully');
            } catch (e) {
              console.error('❌ LANDING: Hirelab.FormView event failed:', e);
            }
          });
        } else {
          console.warn('⚠️ LANDING: No pixel ID provided');
        }
      } catch (e) { 
        console.error('❌ LANDING: Hirelab.FormView event failed:', e);
      }
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

      
      {/* Debug Panel - show in development or with secret parameter */}
      {isDebugEnabled && (
        <div className="fixed top-40 right-4 bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-lg z-50 max-w-md">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-2 rounded-t-lg flex justify-between items-center">
            <h3 className="text-sm font-semibold">
              🔧 Analytics Debug Tool
              {process.env.NODE_ENV !== 'development' && (
                <span className="ml-2 text-xs bg-orange-500 px-1 rounded">PROD</span>
              )}
            </h3>
            <button 
              onClick={() => setDebugExpanded(!debugExpanded)}
              className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded"
            >
              {debugExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          
          {/* Always visible stats */}
          <div className="p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-bold ${isActiveRef.current ? 'text-green-400' : 'text-red-400'}`}>
                {isActiveRef.current ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Time:</span>
              <span className="font-mono text-yellow-300">
                {Math.floor((activeTimeRef.current + (isActiveRef.current ? Date.now() - sessionStartRef.current : 0)) / 1000)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sent to Backend:</span>
              <span className="font-mono text-green-300">{totalTimeSpent}s</span>
            </div>
            <div className="flex justify-between">
              <span>Last Activity:</span>
              <span className="font-mono text-blue-300">
                {Math.floor((Date.now() - lastActivityRef.current) / 1000)}s ago
              </span>
            </div>
          </div>

          {/* Expanded section */}
          {debugExpanded && (
            <>
              {/* Test buttons */}
              <div className="px-3 pb-3 border-t border-gray-700 pt-3">
                <div className="text-xs font-semibold mb-2 text-blue-300">🧪 Test Scenarios:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      // Simulate 2+ minutes of inactivity
                      const oldActivity = lastActivityRef.current;
                      lastActivityRef.current = Date.now() - (INACTIVITY_THRESHOLD + 5000);
                      recordActivity();
                      addDebugLog('🧪 Simulated 2+ min inactivity', 'warning');
                    }}
                    className="bg-orange-600 hover:bg-orange-500 px-2 py-1 rounded text-xs"
                  >
                    Simulate Inactivity
                  </button>
                  <button 
                    onClick={() => {
                      recordActivity();
                      addDebugLog('🧪 Simulated user activity', 'activity');
                    }}
                    className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs"
                  >
                    Simulate Activity
                  </button>
                  <button 
                    onClick={() => {
                      const testTime = 10;
                      sendTimeUpdate(testTime);
                      addDebugLog(`🧪 Manually sent ${testTime}s`, 'timer');
                    }}
                    className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs"
                  >
                    Test Backend Send
                  </button>
                  <button 
                    onClick={() => {
                      debugLogsRef.current = [];
                      setDebugLogs([]);
                      addDebugLog('🧹 Debug logs cleared', 'info');
                    }}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                  >
                    Clear Logs
                  </button>
                </div>
                
                {/* Disable Debug Button for Production */}
                {process.env.NODE_ENV !== 'development' && (
                  <div className="mt-2">
                    <button 
                      onClick={() => {
                        setIsDebugEnabled(false);
                        console.log('🔧 Debug mode disabled');
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs"
                    >
                      🚫 Disable Debug Mode
                    </button>
                  </div>
                )}
              </div>

              {/* Debug logs */}
              <div className="border-t border-gray-700">
                <div className="px-3 py-2 text-xs font-semibold text-blue-300 bg-gray-800">
                  📋 Debug Logs (Last 10):
                </div>
                <div className="max-h-48 overflow-y-auto text-xs">
                  {debugLogs.slice(0, 10).map((log) => (
                    <div 
                      key={log.id} 
                      className={`px-3 py-1 border-b border-gray-800 ${
                        log.type === 'warning' ? 'bg-orange-900 bg-opacity-30' :
                        log.type === 'activity' ? 'bg-green-900 bg-opacity-30' :
                        log.type === 'timer' ? 'bg-blue-900 bg-opacity-30' :
                        'bg-gray-800 bg-opacity-30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-gray-300 text-xs">{log.timestamp}</span>
                        <span className={`text-xs px-1 rounded ${
                          log.isActive ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {log.isActive ? 'A' : 'I'}
                        </span>
                      </div>
                      <div className="text-white mt-1">{log.message}</div>
                      <div className="text-gray-400 text-xs">Active: {log.activeTime}s</div>
                    </div>
                  ))}
                  {debugLogs.length === 0 && (
                    <div className="px-3 py-2 text-gray-400 text-xs">No logs yet...</div>
                  )}
                </div>
              </div>

              {/* Configuration */}
              <div className="px-3 py-2 border-t border-gray-700 text-xs">
                <div className="text-blue-300 font-semibold mb-1">⚙️ Configuration:</div>
                <div>Mode: {process.env.NODE_ENV === 'development' ? 'Development' : 'Production (Debug Enabled)'}</div>
                <div>Inactivity Threshold: {INACTIVITY_THRESHOLD / 1000}s</div>
                <div>Update Interval: 5s</div>
                <div>LP ID: {lpId}</div>
                {process.env.NODE_ENV !== 'development' && (
                  <div className="mt-2 text-orange-300 text-xs">
                    ⚠️ Debug mode active in production via URL parameter
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col justify-between items-center">
        <NavBar
          landingPageData={landingPageData}
          onClickApply={() => {
            try {
              if (landingPageData?.metaPixelId) {
                console.log('🎯 NAVBAR: Firing Hirelab.FormView event (Navbar Apply clicked)');
                waitForPixel(() => {
                  try {
                    fbq('trackCustom', 'Hirelab.FormView', {
                      content_name: landingPageData?.vacancyTitle || '',
                      funnel_id: lpId || '',
                      company: landingPageData?.companyName || '',
                      job_category: landingPageData?.department || ''
                    });
                    console.log('✅ NAVBAR: Hirelab.FormView event fired successfully');
                  } catch (e) {
                    console.error('❌ NAVBAR: Hirelab.FormView event failed:', e);
                  }
                });
              } else {
                console.warn('⚠️ NAVBAR: No pixel ID provided');
              }
            } catch (e) { 
              console.error('❌ NAVBAR: Hirelab.FormView event failed:', e);
            }
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
          ?.filter(section => section.active && section.visible !== false)
          ?.sort((a, b) => a.sort - b.sort)
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
