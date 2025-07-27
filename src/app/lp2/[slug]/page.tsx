import { notFound } from 'next/navigation';
import LandingpagePage from '../../../pages/Landingpage';

// Define interfaces for type safety
interface LandingPageData {
  _id: string;
  published: boolean;
  publishedAt?: string;
  publishedVersion?: any;
  [key: string]: any;
}

interface BrandData {
  color?: string;
}

interface LandingPageResponse {
  lp: LandingPageData;
}

interface BrandResponse {
  color?: string;
}

// Server-side data fetching functions
async function getLandingPageData(slug: string): Promise<LandingPageData | null> {
  try {
    console.log("slug",slug);
    if(!slug){
      return null;
    }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log("backendUrl",backendUrl);
    const response = await fetch(`${backendUrl}/public/getLP?id=${slug}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch landing page data:', response.status);
      return null;
    }

    const data: LandingPageResponse = await response.json();
    console.log("data",data);
    return data.lp;
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return null;
  }
}


// Server Component
export default async function LandingPage2({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  console.log("params",params);
  const { slug } = await params;
  console.log(slug)

const landingPageData:any = await getLandingPageData(slug);

  // If landing page data is not found, show 404
  if (!landingPageData) {
    notFound();
  }



  return (
    <LandingpagePage paramsId={slug} defaultLandingPageData={landingPageData} setFullscreen={null} />
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landingPageData = await getLandingPageData(slug);
  
  if (!landingPageData) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: landingPageData.title || 'Landing Page',
    description: landingPageData.description || 'Landing page description',
    // Add more metadata as needed
  };
}
