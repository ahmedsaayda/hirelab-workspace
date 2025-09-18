import LandingpagePage from "../../../src/pages/Landingpage";
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

export default function Page({ landingPageData, lpId, error }) {
  const router = useRouter();

  // If there's an error or no data, show error page
  if (error || !landingPageData) {
    return (
      <>
        <Head>
          <title>Page Not Found - Hirelab</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'NOT_FOUND' ? 'Page Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 mb-4">
              {error === 'NOT_FOUND' 
                ? 'The page you are looking for does not exist or has been removed.'
                : 'We encountered an error loading this page.'
              }
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // Generate SEO meta data
  const seoTitle = landingPageData?.vacancyTitle 
    ? `${landingPageData.vacancyTitle} - ${landingPageData?.companyName || 'Hirelab'}`
    : 'Job Opportunity - Hirelab';
    
  const seoDescription = landingPageData?.heroDescription 
    ? landingPageData.heroDescription.substring(0, 160) + (landingPageData.heroDescription.length > 160 ? '...' : '')
    : `Join ${landingPageData?.companyName || 'our team'} and take your career to the next level. Apply now for this exciting opportunity.`;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_LIVE_URL || 'https://hirelab.com'}/lp/${lpId}`;
  const heroImageUrl = landingPageData?.heroImage || landingPageData?.heroPicture || landingPageData?.companyLogo || null;
  
  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Performance: Preconnect/DNS-prefetch for common CDNs */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {heroImageUrl && (
          <link rel="preload" as="image" href={heroImageUrl} />
        )}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Hirelab" />
        {landingPageData?.companyLogo && (
          <meta property="og:image" content={landingPageData.companyLogo} />
        )}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {landingPageData?.companyLogo && (
          <meta name="twitter:image" content={landingPageData.companyLogo} />
        )}
        
        {/* Job Posting Structured Data */}
        {landingPageData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                "title": landingPageData.vacancyTitle || "Job Opportunity",
                "description": landingPageData.heroDescription || seoDescription,
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": landingPageData.companyName || "Company",
                  ...(landingPageData.companyLogo && { "logo": landingPageData.companyLogo })
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": landingPageData.location || "Remote"
                  }
                },
                "employmentType": landingPageData.employmentType || "FULL_TIME",
                "datePosted": landingPageData.createdAt || new Date().toISOString(),
                ...(landingPageData.department && { "industry": landingPageData.department }),
                "url": canonicalUrl
              })
            }}
          />
        )}
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={landingPageData?.companyName || 'Hirelab'} />
        {landingPageData?.department && (
          <meta name="keywords" content={`${landingPageData.vacancyTitle}, ${landingPageData.companyName}, ${landingPageData.department}, job, career, hiring`} />
        )}
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LandingpagePage 
        paramsId={lpId} 
        defaultLandingPageData={landingPageData}
      />
    </>
  );
}

// Server-side data fetching
export async function getServerSideProps(context) {
  const { lpId } = context.query;
  
  // Early return if no lpId
  if (!lpId) {
    return {
      notFound: true,
    };
  }

  try {
    // Determine backend URL for server-side requests
    const backendUrl = process.env.NODE_ENV !== "production"
      ? "http://localhost:5155/api"
      : process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch page data from backend
    const response = await axios.get(`${backendUrl}/public/getLP?id=${lpId}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'HirelabBot/1.0',
      }
    });

    // Check if page exists and is published
    if (!response.data?.lp) {
      return {
        props: {
          error: 'NOT_FOUND',
          lpId,
          landingPageData: null
        }
      };
    }

    const landingPageData = response.data.lp;

    console.log("landingPageData",landingPageData);
    
    // Check if page is published (optional check - uncomment if needed)
    if (!landingPageData.published) {
      return {
        notFound: true,
      };
    }

    // Cache SSR response at the edge for brief period to improve TTFB
    try {
      context.res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    } catch (_) {}

    return {
      props: {
        landingPageData,
        lpId,
        error: null
      }
    };

  } catch (error) {
    console.error('Error fetching page data:', error.message);
    
    // If it's a 404 from the API, return not found
    if (error.response?.status === 404) {
      return {
        props: {
          error: 'NOT_FOUND',
          lpId,
          landingPageData: null
        }
      };
    }
    
    // For other errors, return error state but don't return notFound
    // This allows the page to render with error handling
    return {
      props: {
        error: 'SERVER_ERROR',
        lpId,
        landingPageData: null
      }
    };
  }
}