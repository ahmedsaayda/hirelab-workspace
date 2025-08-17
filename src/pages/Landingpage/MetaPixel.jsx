import { useEffect } from 'react';

// Keep track of initialized pixels to prevent duplicate initialization
const initializedPixels = new Set();

const MetaPixel = ({ metaPixelId }) => {
  useEffect(() => {
    console.log('MetaPixel: Starting initialization for ID:', metaPixelId);
    if (!metaPixelId) {
      console.warn('⚠️ MetaPixel: No pixel ID provided');
      return;
    }

    // // Check if this pixel has already been initialized
    // if (initializedPixels.has(metaPixelId)) {
    //   console.log('📊 MetaPixel: Pixel already initialized for ID:', metaPixelId);
    //   return;
    // }

    console.log('📊 MetaPixel: Starting initialization for ID:', metaPixelId);

    // Function to initialize the pixel
    const initializePixel = () => {
      // ALWAYS set up fbq function first (even if script fails to load)
      if (!window.fbq) {
        console.log('📊 MetaPixel: Setting up fbq function...');
        window.fbq = function() {
          window.fbq.callMethod ? 
            window.fbq.callMethod.apply(window.fbq, arguments) : 
            window.fbq.queue.push(arguments);
        };
        if (!window._fbq) window._fbq = window.fbq;
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
      }

      // Load the Facebook Pixel script
      const existingScript = document.querySelector('script[src*="fbevents.js"]');
      
      if (!existingScript) {
        console.log('📊 MetaPixel: Loading Facebook Pixel script...');
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.id = 'facebook-pixel-script';
        
        script.onload = () => {
          console.log('✅ MetaPixel: Script loaded successfully');
          // Initialize this pixel ID only if not already initialized
          if (!initializedPixels.has(metaPixelId)) {
            window.fbq('init', metaPixelId);
            initializedPixels.add(metaPixelId);
            console.log('✅ MetaPixel: Pixel initialized for ID:', metaPixelId);
          }
          // Fire a standard PageView ONCE per page load so helpers detect the pixel
          try {
            const key = `${metaPixelId}:${window.location.pathname}`;
            if (!window.__hirelab_pageviews_fired) {
              window.__hirelab_pageviews_fired = new Set();
            }
            if (!window.__hirelab_pageviews_fired.has(key)) {
              // Fire ONLY the custom event per requirements
              window.fbq('trackCustom', 'Hirelab.PageView', {
                page_path: window.location.pathname,
                page_title: document?.title || ''
              });
              window.__hirelab_pageviews_fired.add(key);
              console.log('✅ MetaPixel: Hirelab.PageView fired', key);
            } else {
              console.log('ℹ️ MetaPixel: PageView already fired for', key);
            }
          } catch (e) {
            console.warn('⚠️ MetaPixel: Failed to manage standard PageView', e);
          }
          console.log('✅ MetaPixel: Pixel initialized and ready for custom events');
        };
        
        script.onerror = (error) => {
          console.error('❌ MetaPixel: Script failed to load:', error);
        };
        
        document.head.appendChild(script);
      } else {
        console.log('📊 MetaPixel: Script already exists, initializing pixel...');
        // Script already loaded, just initialize this pixel if not already done
        if (!initializedPixels.has(metaPixelId)) {
          window.fbq('init', metaPixelId);
          initializedPixels.add(metaPixelId);
          console.log('✅ MetaPixel: Pixel initialized for existing script, ID:', metaPixelId);
        }
        // Fire a standard PageView ONCE per page load so helpers detect the pixel
        try {
          const key = `${metaPixelId}:${window.location.pathname}`;
          if (!window.__hirelab_pageviews_fired) {
            window.__hirelab_pageviews_fired = new Set();
          }
          if (!window.__hirelab_pageviews_fired.has(key)) {
            // Fire ONLY the custom event per requirements
            window.fbq('trackCustom', 'Hirelab.PageView', {
              page_path: window.location.pathname,
              page_title: document?.title || ''
            });
            window.__hirelab_pageviews_fired.add(key);
            console.log('✅ MetaPixel: Hirelab.PageView fired (existing script)', key);
          } else {
            console.log('ℹ️ MetaPixel: PageView already fired for (existing script)', key);
          }
        } catch (e) {
          console.warn('⚠️ MetaPixel: Failed to manage standard PageView (existing script)', e);
        }
      }

      // Add noscript fallback (only once per pixel ID)
      const noscriptId = `fb-noscript-${metaPixelId}`;
      if (!document.getElementById(noscriptId)) {
        const noscript = document.createElement('noscript');
        noscript.id = noscriptId;
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
        console.log('✅ MetaPixel: Noscript fallback added');
      }
    };

    // Initialize immediately
    initializePixel();

    // Cleanup function
    return () => {
      // Remove only the noscript for this specific pixel ID
      const noscriptElement = document.getElementById(`fb-noscript-${metaPixelId}`);
      if (noscriptElement) {
        noscriptElement.remove();
      }
    };
  }, [metaPixelId]);

  return null;
};

export default MetaPixel; 