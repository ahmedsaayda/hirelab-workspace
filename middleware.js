import { NextResponse } from 'next/server';

// Simple in-memory cache for user validation (reduces API calls)
const userValidationCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Cleanup expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userValidationCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      userValidationCache.delete(key);
    }
  }
}, CACHE_DURATION); // Clean up every 30 seconds

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
  '/test', // Your test page
  '/_next', // Next.js assets
  '/favicon.ico',
  '/api' // API routes
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

async function fetchUserData(accessToken) {
  // Check cache first
  const cacheKey = accessToken;
  const cached = userValidationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const backendUrl = process.env.NODE_ENV !== "production" 
      ? "http://localhost:5055/api" 
      : process.env.NEXT_PUBLIC_BACKEND_URL;
      
    const response = await fetch(`${backendUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      // Only treat 401/403 as actual auth failures
      if (response.status === 401 || response.status === 403) {
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
    }
    
    // Don't log out for network/timeout errors, only for auth errors
    const networkError = { networkError: true };
    // Don't cache network errors - allow retry on next request
    return networkError;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // If no access token, redirect to login and save the intended destination
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Store the intended destination
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
        redirectPath = '/auth/subscription';
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
        redirectPath = '/onboarding';
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