class TrackingService {
  static META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '244408738381890';
  static LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_TRACKING_ID || process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '6744898';
  static META_SCRIPT_LOADED = false;
  static LINKEDIN_SCRIPT_LOADED = false;

  /**
   * Track sign-up conversion for both Meta and LinkedIn platforms
   * @param {Object} userData - User data for tracking
   * @param {string} userData.email - User email
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} userData.registration_method - How user registered (email, social, etc.)
   * @param {string} userData.user_id - User ID after registration
   */
  static async trackSignUpConversion(userData = {}) {
    console.log('🎯 TrackingService: Tracking sign-up conversion (loading scripts dynamically)', userData);

    // Load and track Meta Pixel - CompleteRegistration event
    await this.trackMetaConversion(userData);
    
    // Load and track LinkedIn Insight Tag - signup conversion
    await this.trackLinkedInConversion(userData);
  }

  /**
   * Load Meta Pixel script dynamically only when needed for registration
   */
  static async loadMetaPixelScript() {
    if (typeof window === 'undefined') return false;
    
    // Check if already loaded
    if (this.META_SCRIPT_LOADED && window.fbq) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        // Set up fbq function first
        if (!window.fbq) {
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

        // Load script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        
        script.onload = () => {
          console.log('✅ Meta Pixel: Script loaded dynamically for registration');
          // Initialize pixel for registration tracking
          window.fbq('init', this.META_PIXEL_ID);
          this.META_SCRIPT_LOADED = true;
          resolve(true);
        };
        
        script.onerror = () => {
          console.error('❌ Meta Pixel: Failed to load script');
          resolve(false);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ Meta Pixel: Error loading script', error);
        resolve(false);
      }
    });
  }

  /**
   * Load LinkedIn Insight Tag script dynamically only when needed for registration
   */
  static async loadLinkedInScript() {
    if (typeof window === 'undefined') return false;
    
    // Check if already loaded
    if (this.LINKEDIN_SCRIPT_LOADED && window.lintrk) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        // Set up LinkedIn
        window._linkedin_partner_id = this.LINKEDIN_PARTNER_ID;
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        if (!window._linkedin_data_partner_ids.includes(this.LINKEDIN_PARTNER_ID)) {
          window._linkedin_data_partner_ids.push(this.LINKEDIN_PARTNER_ID);
        }

        // Initialize lintrk function if not present
        if (!window.lintrk) {
          window.lintrk = function(a, b) {
            window.lintrk.q.push([a, b]);
          };
          window.lintrk.q = [];
        }

        // Load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
        
        script.onload = () => {
          console.log('✅ LinkedIn Insight Tag: Script loaded dynamically for registration');
          this.LINKEDIN_SCRIPT_LOADED = true;
          resolve(true);
        };
        
        script.onerror = () => {
          console.error('❌ LinkedIn Insight Tag: Failed to load script');
          resolve(false);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ LinkedIn Insight Tag: Error loading script', error);
        resolve(false);
      }
    });
  }

  /**
   * Track Meta Pixel CompleteRegistration event (loads script if needed)
   */
  static async trackMetaConversion(userData = {}) {
    try {
      // Load script dynamically if not already loaded
      const loaded = await this.loadMetaPixelScript();
      
      if (!loaded || !window.fbq) {
        console.warn('⚠️ Meta Pixel: Script not available, skipping conversion tracking');
        return;
      }
      
      const eventData = {
        content_name: 'User Registration',
        content_category: 'Sign Up',
        value: 0,
        currency: 'USD',
        // Add user data for better tracking
        ...(userData.email && { email: userData.email }),
        ...(userData.firstName && { first_name: userData.firstName }),
        ...(userData.lastName && { last_name: userData.lastName }),
        ...(userData.registration_method && { registration_method: userData.registration_method }),
        ...(userData.user_id && { user_id: userData.user_id }),
      };

      window.fbq('track', 'CompleteRegistration', eventData);
      console.log('✅ Meta Pixel: CompleteRegistration event fired', eventData);
    } catch (error) {
      console.error('❌ Meta Pixel: Error tracking conversion', error);
    }
  }

  /**
   * Track LinkedIn Insight Tag signup conversion (loads script if needed)
   */
  static async trackLinkedInConversion(userData = {}) {
    try {
      // Load script dynamically if not already loaded
      const loaded = await this.loadLinkedInScript();
      
      if (!loaded || !window.lintrk) {
        console.warn('⚠️ LinkedIn Insight Tag: Script not available, skipping conversion tracking');
        return;
      }
      
      // LinkedIn conversion tracking - multiple methods with retry logic
      
      const trackWithRetry = (trackingMethod, methodName, params) => {
        let attempts = 0;
        const maxAttempts = 3;
        
        const attemptTracking = () => {
          attempts++;
          try {
            window.lintrk('track', params);
            console.log(`✅ LinkedIn Insight Tag: ${methodName} fired (attempt ${attempts})`, userData);
          } catch (error) {
            console.warn(`⚠️ LinkedIn Insight Tag: ${methodName} failed (attempt ${attempts})`, error);
            if (attempts < maxAttempts) {
              setTimeout(attemptTracking, 1000 * attempts); // Exponential backoff
            }
          }
        };
        
        attemptTracking();
      };
      
      // Method 1: Standard conversion tracking with retry
      if (window.lintrk) {
        trackWithRetry('standard', 'signup conversion', { conversion_id: 'signup' });
      }
      
      // Method 2: Alternative conversion tracking format with retry
      if (window.lintrk) {
        trackWithRetry('url', 'conversion_url tracking', { conversion_url: window.location.href });
      }
      
      // Method 3: Basic tracking without specific conversion with retry
      if (window.lintrk) {
        trackWithRetry('basic', 'basic tracking', {});
      }
    } catch (error) {
      console.error('❌ LinkedIn Insight Tag: Error tracking conversion', error);
    }
  }

  /**
   * Track page views for both platforms
   * @param {string} pageName - Optional page name for tracking
   */
  static trackPageView(pageName = '') {
    if (typeof window !== 'undefined') {
      // Meta Pixel PageView
      if (window.fbq) {
        try {
          window.fbq('track', 'PageView');
          console.log('📊 Meta Pixel: PageView tracked', pageName || window.location.pathname);
        } catch (error) {
          console.error('❌ Meta Pixel: Error tracking page view', error);
        }
      }
      
      // LinkedIn automatically tracks page views when script loads
      console.log(`📊 Page view tracked: ${pageName || window.location.pathname}`);
    }
  }

  /**
   * Track custom events for Meta Pixel
   * @param {string} eventName - Custom event name
   * @param {Object} eventData - Event parameters
   */
  static trackCustomEvent(eventName, eventData = {}) {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('trackCustom', eventName, eventData);
        console.log(`✅ Meta Pixel: Custom event '${eventName}' fired`, eventData);
      } catch (error) {
        console.error(`❌ Meta Pixel: Error tracking custom event '${eventName}'`, error);
      }
    } else {
      console.warn('⚠️ Meta Pixel: fbq not available, skipping custom event tracking');
    }
  }

  /**
   * Get Facebook Browser ID and Click ID for server-side tracking
   * @returns {Object} Object containing fbp and fbc values
   */
  static getFacebookIdentifiers() {
    if (typeof window !== 'undefined') {
      // Try to get Facebook Browser ID from cookie
      const fbp = this.getCookie('_fbp');
      
      // Try to get Facebook Click ID from URL or cookie
      const fbc = this.getCookie('_fbc') || this.getUrlParameter('fbclid');
      
      return { fbp, fbc };
    }
    return { fbp: null, fbc: null };
  }

  /**
   * Helper function to get cookie value
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null
   */
  static getCookie(name) {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null;
  }

  /**
   * Helper function to get URL parameter
   * @param {string} name - Parameter name
   * @returns {string|null} Parameter value or null
   */
  static getUrlParameter(name) {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
    return null;
  }

  /**
   * Debug function to check if tracking is properly loaded
   * @returns {Object} Status of all tracking platforms
   */
  static checkTrackingStatus() {
    const status = {
      metaPixel: typeof window !== 'undefined' && !!window.fbq,
      linkedIn: typeof window !== 'undefined' && !!window.lintrk,
      metaPixelId: this.META_PIXEL_ID,
      linkedInPartnerId: this.LINKEDIN_PARTNER_ID,
      facebookIdentifiers: this.getFacebookIdentifiers(),
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    };
    
    console.log('🔍 Tracking Status:', status);
    return status;
  }

  /**
   * Initialize tracking for the current page
   * Should be called once when the app loads
   */
  static initialize() {
    console.log('🎯 TrackingService: Initializing tracking...');
    
    // Check if tracking is properly loaded
    setTimeout(() => {
      this.checkTrackingStatus();
    }, 2000); // Wait 2 seconds for scripts to load
  }
}

export default TrackingService;
