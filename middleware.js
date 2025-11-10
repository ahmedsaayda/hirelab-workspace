import { NextResponse } from 'next/server';

// Simple in-memory cache for user validation (reduces API calls)
const userValidationCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Cache pretty-url mappings per host
const prettyUrlCache = new Map(); // host -> { ts, userId, map: {slug:id}, reverse: {id:slug} }

// Cleanup expired cache entries (only in non-serverless environments)
if (typeof process !== 'undefined' && !process.env.VERCEL) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of userValidationCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        userValidationCache.delete(key);
      }
    }
  }, CACHE_DURATION); // Clean up every 30 seconds
}

// Define paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/register', 
  '/auth/forgot',
  '/auth/passwordreset',
  '/auth/reset',
  '/lp/',
  '/funnel',
  '/cv',
  '/jobportal',
  '/survey',
  '/candidate-chat/', // Public candidate chat access via tokenized links
  '/test', // Your test page
  '/_next', // Next.js assets
  '/favicon.ico',
  '/api', // API routes
  "/workspace-invitation" // Workspace invitation page
];

// Define static file extensions that should be publicly accessible
const staticExtensions = [
  '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.css', '.js', '.json', '.xml', '.txt', '.pdf',
  '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.webm', '.mp3', '.wav'
];

// Define onboarding paths to avoid redirect loops
const onboardingPaths = [
  '/auth/otpemail',
  '/auth/partneronboarding', 
  '/dashboard/partnerActivation',
  '/auth/subscription',
  '/dashboard/billing',
  '/auth/otpphone',
  '/auth/kyc',
  '/dashboard/settings',
  '/dashboard/partnerSettings',
  '/onboarding'
];

function isPublicPath(pathname) {
  // Check if it's a public route
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return true;
  }
  
  // Check if it's a static file by extension
  if (staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext))) {
    return true;
  }
  
  // Check if it's from the public folder (Next.js serves these from root)
  // Common public folder assets
  const publicAssetPatterns = [
    '/images/',
    '/icons/',
    '/assets/',
    '/img/',
    '/fonts/',
    '/videos/',
    '/audio/',
    '/documents/',
    '/uploads/',
    '/static/',
    '/public/'
  ];
  
  if (publicAssetPatterns.some(pattern => pathname.startsWith(pattern))) {
    return true;
  }
  
  return false;
}

function isOnboardingPath(pathname) {
  return onboardingPaths.some(path => pathname.startsWith(path));
}

// Clean expired cache entries before each request (for serverless)
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of userValidationCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      userValidationCache.delete(key);
    }
  }
}

async function fetchUserData(accessToken) {
  // Clean expired entries first
  cleanExpiredCache();
  
  // Check cache first
  const cacheKey = accessToken;
  const cached = userValidationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const backendUrl = process.env.NODE_ENV !== "production" 
      ? "http://localhost:5155/api" 
      : process.env.NEXT_PUBLIC_BACKEND_URL;
      
    // Ensure backend URL is configured in production
    if (!backendUrl) {
      console.error('Backend URL not configured');
      throw new Error('Backend URL not configured');
    }
      
    const response = await fetch(`${backendUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      // Add timeout to prevent hanging requests
      signal: (() => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000); // 5 second timeout
        return controller.signal;
      })()
    });
    
    if (!response.ok) {
      // Treat 400/401/403 as auth failures (invalid/expired token)
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        const authError = { authError: true };
        // Cache auth errors briefly to avoid repeated calls
        userValidationCache.set(cacheKey, { data: authError, timestamp: Date.now() });
        return authError;
      }
      // Other errors (500, network issues) shouldn't log user out
      throw new Error(`Server error: ${response.status}`);
    }
    
    const userData = await response.json();
    // Cache successful responses
    userValidationCache.set(cacheKey, { data: userData, timestamp: Date.now() });
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // If it's an auth error, return that specifically
    if (error.name === 'AbortError') {
      console.warn('Request timed out - allowing user to continue');
      return { networkError: true };
    }
    
    // For connection errors, treat as network issue
    if (error.message?.includes('ECONNREFUSED') || 
        error.message?.includes('ENOTFOUND') || 
        error.message?.includes('Network request failed')) {
      console.warn('Network connectivity issue - allowing user to continue');
      return { networkError: true };
    }
    
    // For other errors, log them but don't log user out unless it's clearly auth-related
    console.error('Unexpected error in user validation:', error);
    return { networkError: true };
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = process.env.NEXT_PUBLIC_DEV_CUSTOM_HOST ? process.env.NEXT_PUBLIC_DEV_CUSTOM_HOST : request.headers.get('host')?.replace('www.', '');

  // Custom-domain mode: bypass auth entirely and rewrite root to the public careers page
  const isCustomHost = process.env.NEXT_PUBLIC_DEV_CUSTOM_HOST ? true : host && !host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('hirelab');
  console.log('[CDM] middleware enter', { host, pathname, isCustomHost });
  if (isCustomHost) {
    // Helper to fetch pretty URL map for this host (cached)
    const getPrettyMap = async () => {
      const now = Date.now();
      const cached = prettyUrlCache.get(host);
      if (cached && now - cached.ts < CACHE_DURATION) return cached;
      try {
        const backendUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:5155/api' : process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) return null;
        // 1) Resolve user/workspace by hostname
        const r1 = await fetch(`${backendUrl}/domains/by-hostname?hostname=${encodeURIComponent(host)}`, { method: 'GET' });
        if (!r1.ok) throw new Error('host not found');
        const info = await r1.json();
        const userId = info?.user_id;
        const workspaceId = info?.workspaceId || null;
        if (!userId) return null;
        // 2) Fetch settings (public) for that user or workspace
        const settingsUrl = workspaceId
          ? `${backendUrl}/domains/global-settings/workspace/${encodeURIComponent(workspaceId)}`
          : `${backendUrl}/domains/global-settings/${encodeURIComponent(userId)}`;
        const r2 = await fetch(settingsUrl, { method: 'GET' });
        if (!r2.ok) throw new Error('settings not found');
        const settings = await r2.json();
        const list = Array.isArray(settings?.prettyUrls) ? settings.prettyUrls : [];
        const map = {};
        const reverse = {};
        for (const it of list) {
          if (it?.active !== false && it?.slug && it?.landingPageId) {
            const slug = String(it.slug).trim().replace(/^\//, '').toLowerCase();
            map[slug] = String(it.landingPageId);
            reverse[String(it.landingPageId)] = slug;
          }
        }
        const packed = { ts: now, userId, map, reverse };
        prettyUrlCache.set(host, packed);
        return packed;
      } catch (_) {
        return null;
      }
    };

    // Allow internal assets and API calls untouched
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
      console.log('[CDM] pass-through asset/api', { pathname });
      return NextResponse.next();
    }
    // Rewrite root to our public careers page using the owner userId resolved by backend
    if (pathname === '/') {
      // In dev we avoid relying on a backend call here; resolve on the page itself
      const url = request.nextUrl.clone();
      url.pathname = `/custom-domain/main`;
      console.log('[CDM] rewrite root →', url.pathname);
      return NextResponse.rewrite(url);
    }
    // Pretty URL handling for custom domains only
    try {
      const pack = await getPrettyMap();
      const url = request.nextUrl.clone();
      const segments = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean);

      // Redirect standard /lp/:id routes to pretty slug if available
      if (segments[0] === 'lp' && segments[1]) {
        const id = segments[1];
        const suffix = segments.slice(2).join('/'); // '', 'apply', 'thank-you', etc
        const slug = pack?.reverse?.[id];
        if (slug) {
          url.pathname = `/${slug}${suffix ? '/' + suffix : ''}`;
          console.log('[CDM] redirect standard → pretty', { from: pathname, to: url.pathname });
          return NextResponse.redirect(url, 308);
        }
        return NextResponse.next();
      }

      // Rewrite pretty slug to internal /lp/:id
      const reserved = new Set(['custom-domain', 'sitemap.xml', 'robots.txt']);
      if (segments.length >= 1 && !reserved.has(segments[0])) {
        const slug = segments[0];
        const id = pack?.map?.[slug];
        if (id) {
          const suffix = segments.slice(1).join('/');
          url.pathname = `/lp/${id}${suffix ? '/' + suffix : ''}`;
          console.log('[CDM] rewrite pretty → standard', { from: pathname, to: url.pathname });
          return NextResponse.rewrite(url);
        }
      }
    } catch (e) {
      console.log('[CDM] pretty url handling error', e?.message);
    }

    // For any other path (including static pages), bypass auth
    console.log('[CDM] allow custom-domain path', { pathname });
    return NextResponse.next();
  }
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Production error handling wrapper
  try {

  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // If no access token, redirect to login and save the intended destination
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Store the intended destination as a query parameter
    loginUrl.searchParams.set('returnUrl', request.url);
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  // Fetch user data and onboarding status
  const userData = await fetchUserData(accessToken);
  
  // Only log out for actual auth errors, not network issues
  if (userData?.authError || (!userData?.me && !userData?.networkError)) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    return response;
  }
  
  // If there's a network error, allow the request to continue
  // (user stays logged in but might see cached/stale data)
  if (userData?.networkError) {
    console.warn('Network error in middleware - allowing request to continue');
    return NextResponse.next();
  }

  const onboardingStatus = userData.onboardingStatus;
  
  // If user has incomplete onboarding, redirect to appropriate step
  if (onboardingStatus?.actionRequired) {
    const step = onboardingStatus.step;
    
    // Don't redirect if already on the correct onboarding page
    if (isOnboardingPath(pathname)) {
      return NextResponse.next();
    }
    
    let redirectPath = null;
    
    console.log("the step is",step)
    switch (step) {
      case 'isEmailVerified':
        redirectPath = '/auth/otpemail';
        break;
      case 'isPartnerOnboarded':
        redirectPath = '/auth/partneronboarding';
        break;
      case 'isPartnerActivated':
        redirectPath = '/dashboard/partnerActivation';
        break;
      case 'subscription':
        // redirectPath = '/auth/subscription';
        // redirectPath = '/dashboard/billing';

        break;
      case 'billingPlanSelection':
        //redirectPath = '/dashboard/billing';
        redirectPath = null;
        break;
      case 'isPhoneVerified':
        redirectPath = '/auth/otpphone';
        break;
      case 'kycVerified':
        redirectPath = '/auth/kyc';
        break;
      case 'profileCompletion':
        redirectPath = '/dashboard/settings';
        break;
      case 'partnerCompletion':
        redirectPath = '/dashboard/partnerSettings';
        break;
      case 'isOnboardingCompleted':
        // if current path is workspace-invitation ignore the redirect
        if (!pathname.startsWith('/workspace-invitation')) {
          redirectPath = '/onboarding';
        } 
        break;
    }
    
    if (redirectPath && !pathname.startsWith(redirectPath)) {
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  } else {

    
    // If accessing root or login while authenticated, redirect to dashboard
    if (pathname === '/' || pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
  
  } catch (error) {
    // Critical error in middleware - log and redirect to login for safety
    console.error('Critical middleware error:', error);
    const loginUrl = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    return response;
  }
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for Next.js internals and static files
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)',
  ],
}; 