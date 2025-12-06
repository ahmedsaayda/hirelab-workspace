import Head from "next/head";
import LandingpagePage from "../../../src/pages/Landingpage";

export default function Page({ landingPageData, lpId, error, errorMessage }) {
  // Graceful error UI for unpublished/missing or server issues
  if (error || !landingPageData) {
    const title =
      error === "NOT_FOUND" ? "Page Not Found" : "Something went wrong";
    const description =
      error === "NOT_FOUND"
        ? errorMessage ||
          "The page you are looking for does not exist or is not published."
        : errorMessage ||
          "We encountered an error while loading this page. Please try again later.";

    return (
      <>
        <Head>
          <title>{title} - Hirelab</title>
          <meta name="description" content={description} />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-600 mb-6">{description}</p>
            <button
              onClick={() =>
                typeof window !== "undefined"
                  ? window.location.assign("/")
                  : null
              }
              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Go back to homepage
            </button>
          </div>
        </div>
      </>
    );
  }

  // Default SEO metadata for published landing pages
  const seoTitle = landingPageData?.vacancyTitle
    ? `${landingPageData.vacancyTitle} - ${
        landingPageData?.companyName || "Hirelab"
      }`
    : "Job Opportunity - Hirelab";

  const rawDescription =
    landingPageData?.metaDescription ||
    landingPageData?.heroDescription ||
    `Join ${
      landingPageData?.companyName || "our team"
    } and take your career to the next level. Apply now for this exciting opportunity.`;

  const seoDescription =
    typeof rawDescription === "string"
      ? `${rawDescription.slice(0, 160)}${
          rawDescription.length > 160 ? "..." : ""
        }`
      : "Discover your next career opportunity with Hirelab.";

  const canonicalBase =
    process.env.NEXT_PUBLIC_LIVE_URL || "https://hirelab.com";
  const canonicalUrl = `${canonicalBase.replace(/\/+$/, "")}/lp/${lpId}`;
  const heroImageUrl =
    landingPageData?.heroImage ||
    landingPageData?.heroPicture ||
    landingPageData?.companyLogo ||
    null;

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
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                title: landingPageData.vacancyTitle || "Job Opportunity",
                description:
                  landingPageData.heroDescription || seoDescription,
                hiringOrganization: {
                  "@type": "Organization",
                  name: landingPageData.companyName || "Company",
                  ...(landingPageData.companyLogo && {
                    logo: landingPageData.companyLogo,
                  }),
                },
                jobLocation: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: landingPageData.location || "Remote",
                  },
                },
                employmentType:
                  landingPageData.employmentType || "FULL_TIME",
                datePosted:
                  landingPageData.createdAt || new Date().toISOString(),
                ...(landingPageData.department && {
                  industry: landingPageData.department,
                }),
                url: canonicalUrl,
              }),
            }}
          />
        )}

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta
          name="author"
          content={landingPageData?.companyName || "Hirelab"}
        />
        {landingPageData?.department && (
          <meta
            name="keywords"
            content={`${landingPageData.vacancyTitle}, ${landingPageData.companyName}, ${landingPageData.department}, job, career, hiring`}
          />
        )}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingpagePage paramsId={lpId} defaultLandingPageData={landingPageData} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const lpId = params?.lpId || context.query?.lpId;

  if (!lpId) {
    res.statusCode = 404;
    return {
      props: {
        error: "NOT_FOUND",
        lpId: null,
        landingPageData: null,
        errorMessage: "Missing landing page identifier.",
      },
    };
  }

  // Resolve backend URL
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV !== "production"
      ? "http://localhost:5155/api"
      : null);

  if (!backendUrl) {
    res.statusCode = 500;
    return {
      props: {
        error: "SERVER_ERROR",
        lpId,
        landingPageData: null,
        errorMessage: "Backend URL is not configured.",
      },
    };
  }

  try {
    const host =
      req?.headers?.["x-forwarded-host"] ||
      req?.headers?.host ||
      undefined;

    const base = backendUrl.replace(/\/+$/, "");
    let url = `${base}/public/getLP?id=${encodeURIComponent(lpId)}`;
    if (host) {
      url += `&domain=${encodeURIComponent(host)}`;
    }

    const apiRes = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    let payload = null;
    try {
      payload = await apiRes.json();
    } catch (_) {
      // ignore JSON parse errors, we'll handle below
    }

    if (!apiRes.ok) {
      const msg =
        (payload && (payload.message || payload.error)) ||
        `Upstream error (${apiRes.status})`;

      if (apiRes.status === 404) {
        res.statusCode = 404;
        return {
          props: {
            error: "NOT_FOUND",
            lpId,
            landingPageData: null,
            errorMessage: msg,
          },
        };
      }

      res.statusCode = apiRes.status || 500;
      return {
        props: {
          error: "SERVER_ERROR",
          lpId,
          landingPageData: null,
          errorMessage: msg,
        },
      };
    }

    const landingPageData = payload?.lp || payload || null;

    if (!landingPageData || landingPageData.published === false) {
      res.statusCode = 404;
      return {
        props: {
          error: "NOT_FOUND",
          lpId,
          landingPageData: null,
          errorMessage: "Page not found or not published.",
        },
      };
    }

    // Light edge caching for successful responses
    try {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
    } catch (_) {
      // ignore header errors
    }

    return {
      props: {
        landingPageData,
        lpId,
        error: null,
        errorMessage: null,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps /lp/[lpId]:", err);
    res.statusCode = 500;
    return {
      props: {
        error: "SERVER_ERROR",
        lpId,
        landingPageData: null,
        errorMessage: "An unexpected error occurred while loading this page.",
      },
    };
  }
}