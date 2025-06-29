import { NextResponse } from 'next/server';

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
  try {
    const backendUrl = process.env.NODE_ENV !== "production" 
      ? "http://localhost:5055/api" 
      : process.env.NEXT_PUBLIC_BACKEND_URL;
      
    const response = await fetch(`${backendUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
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
    response.cookies.set('lastVisit', request.url);
    return response;
  }

  // Fetch user data and onboarding status
  const userData = await fetchUserData(accessToken);
  
  if (!userData || !userData.me) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    return response;
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
    // User is fully onboarded
    // Check if they were trying to access a specific page before login
    const lastVisit = request.cookies.get('lastVisit')?.value;
    
    if (lastVisit && pathname === '/dashboard' && lastVisit !== request.url) {
      const response = NextResponse.redirect(new URL(lastVisit, request.url));
      response.cookies.delete('lastVisit');
      return response;
    }
    
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