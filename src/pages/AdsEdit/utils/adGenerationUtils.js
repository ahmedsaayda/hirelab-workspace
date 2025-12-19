import { v4 as uuidv4 } from 'uuid';

// Safe placeholder for missing images
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

// Meta constraints
const MAX_HEADLINE_LENGTH = 40;
const MAX_DESC_LENGTH = 30;
const OPTIMAL_PRIMARY_TEXT_LENGTH = 125;

// Helper to strip placeholder boilerplate like "[Insert ...]" and "Example:"
const sanitizePlaceholderText = (text) => {
  if (!text || typeof text !== "string") return "";
  let cleaned = text;
  if (cleaned.includes("[Insert") || cleaned.includes("Example:")) {
    cleaned = cleaned
      .replace(/\[.*?\]/g, " ")
      .replace(/Example:/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return cleaned;
};

const snippetFromText = (text, maxLen = 80) => {
  const cleaned = sanitizePlaceholderText(text);
  if (!cleaned) return "";
  const oneLine = cleaned.replace(/\s+/g, " ").trim();
  if (!oneLine) return "";
  return oneLine.length > maxLen ? `${oneLine.slice(0, maxLen - 3)}...` : oneLine;
};

const pickSectionSentence = (text) => {
  if (!text || typeof text !== "string") return "";
  const cleaned = sanitizePlaceholderText(text);
  if (!cleaned) return "";
  const firstSentence = cleaned.split(/[.!?]/)[0] || cleaned;
  return firstSentence.trim();
};

const stripWrappingQuotes = (s) => {
  const t = String(s || "").trim();
  return t.replace(/^"+/, "").replace(/"+$/, "").trim();
};

/**
 * Extract images specifically for a given ad type
 */
export const extractImagesForAdType = (adType, lpData) => {
  const images = [];

  // Helper to add unique images
  const addImage = (img) => {
    if (img && typeof img === 'string' && img.length > 0 && !images.includes(img)) {
      images.push(img);
    }
  };

  switch (adType) {
    case 'job':
      // Job Ads: use as many relevant images as possible (people/role images preferred).
      // Constraint: Exclude Leader Intro / EVP Mission images (we simply don't include those fields here).
      addImage(lpData?.heroImage);
      addImage(lpData?.jobDescriptionImage);
      addImage(lpData?.textBoxImage);
      if (Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      if (Array.isArray(lpData?.aboutTheCompanyImages)) {
        lpData.aboutTheCompanyImages.forEach(addImage);
      }
      break;

    case 'employer-brand':
      // Brand Ads: Prioritize EVP and Leader avatars
      addImage(lpData?.evpMissionAvatar);
      addImage(lpData?.leaderIntroductionAvatar);
      addImage(lpData?.heroImage);
      addImage(lpData?.textBoxImage);
      if (Array.isArray(lpData?.aboutTheCompanyImages)) {
        lpData.aboutTheCompanyImages.forEach(addImage);
      }
      // Fallback to high quality photo images
      if (Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      // Fallback to company logo
      if (images.length === 0) {
        addImage(lpData?.companyLogo);
      }
      break;

    case 'company':
      // Company Ads: Prioritize About Company images
      if (Array.isArray(lpData?.aboutTheCompanyImages)) {
        lpData.aboutTheCompanyImages.forEach(addImage);
      }
      // Fallback to photo images or hero
      if (Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      addImage(lpData?.textBoxImage);
      addImage(lpData?.heroImage);
      break;

    case 'testimonial':
      // Testimonial Ads: Strictly from testimonials avatars first
      if (Array.isArray(lpData?.testimonials)) {
        lpData.testimonials.forEach(t => {
            if (t.avatar && t.avatarEnabled !== false) addImage(t.avatar);
        });
      }
      // Fallback: Use photo images (concept: generic happy team)
      if (images.length === 0 && Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      break;

    case 'retargeting':
      // Retargeting: Highest performing / most recognizable (Hero or About Company)
      addImage(lpData?.heroImage);
      addImage(lpData?.jobDescriptionImage);
      addImage(lpData?.textBoxImage);
      if (Array.isArray(lpData?.aboutTheCompanyImages)) {
        lpData.aboutTheCompanyImages.forEach(addImage);
      }
      if (Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      break;

    default:
      addImage(lpData?.heroImage);
      break;
  }

  // Final fallback to ensure at least one image exists
  if (images.length === 0) {
    if (lpData?.heroImage) addImage(lpData.heroImage);
    else if (lpData?.companyLogo) addImage(lpData.companyLogo);
    else images.push(TRANSPARENT_PNG);
  }

  return images;
};

/**
 * Generate smart copy for a given ad type
 */
export const generateCopyForAdType = (adType, lpData, variantIndex = 0) => {
  const company = lpData?.companyName || "our company";
  const vacancy = lpData?.vacancyTitle || "this role";
  const location = Array.isArray(lpData?.location) ? lpData.location[0] : (lpData?.location || "");
  const locationStr = location ? ` in ${location}` : "";

  let title = "";
  let description = "";
  let cta = "Apply Now";
  let source = "";

  switch (adType) {
    case 'job':
      // Headline: Role Title or "We're Hiring: {Role}"
      title = variantIndex === 0 
        ? vacancy 
        : `We're Hiring: ${vacancy}`;
      
      // Primary: Short, punchy hook
      // "Join {Company} in {Location}."
      const jobHook = pickSectionSentence(lpData?.heroDescription) || pickSectionSentence(lpData?.jobDescription);
      description = variantIndex === 0
        ? `Join ${company}${locationStr}. ${jobHook}`
        : jobHook || `Advance your career as a ${vacancy} at ${company}.`;
      source = "Vacancy & Job Description";
      break;

    case 'employer-brand':
      // Source: EVP or Leader
      const evp = pickSectionSentence(lpData?.evpMissionDescription);
      const leader = pickSectionSentence(lpData?.leaderIntroductionDescription);
      const mission = evp || leader || `Our mission at ${company} is to empower every employee to thrive.`;
      
      title = variantIndex === 0 ? `Life at ${company}` : `Our Mission`;
      description = mission;
      cta = "Learn More";
      source = evp ? "EVP / Mission" : (leader ? "Leader Intro" : "Brand Defaults");
      break;

    case 'company':
      // Source: Company Info, Facts
      const about = pickSectionSentence(lpData?.aboutTheCompanyDescription || lpData?.companyInfo);
      const fact = lpData?.companyFacts?.[0]?.headingText 
        ? `${lpData.companyFacts[0].headingText}: ${lpData.companyFacts[0].descriptionText}` 
        : "";
      
      title = `About ${company}`;
      description = about || fact || `${company} is a leading innovator in the sector.`;
      cta = "Learn More";
      source = about ? "About Company" : (fact ? "Company Facts" : "Company Defaults");
      break;

    case 'testimonial':
      // Source: Testimonials
      const testimonial = lpData?.testimonials?.[variantIndex % (lpData?.testimonials?.length || 1)];
      const quote = stripWrappingQuotes(snippetFromText(testimonial?.comment)) || "Working here has been an incredible experience.";
      
      title = "What our team says";
      description = `"${quote}"`;
      // If we have an author name, maybe append it? 
      // Usually description is the primary text in Feed ads.
      if (testimonial?.fullname) {
        description += ` - ${testimonial.fullname}`;
      }
      source = "Testimonials";
      break;

    case 'retargeting':
      // Urgency
      title = variantIndex === 0 ? `Still interested in ${vacancy}?` : "Applications closing soon";
      description = "Don't miss your chance to join our team. The opportunity is still available – apply now to complete your application.";
      source = "Retargeting Logic";
      break;
      
    default:
      title = vacancy;
      description = pickSectionSentence(lpData?.heroDescription);
      source = "Hero Section";
      break;
  }

  // Truncate Headline if absolutely necessary (though we prefer to warn)
  // Meta headline soft limit ~40 chars
  
  return { title, description, cta, source };
};

/**
 * Main generator function
 */
export const generateVariants = (lpData) => {
  const ads = {};
  
  const adTypes = ['job', 'employer-brand', 'company', 'testimonial', 'retargeting'];

  adTypes.forEach(adType => {
    const variants = [];
    const images = extractImagesForAdType(adType, lpData);
    
    // Determine count based on available unique images
    // We want "as many variants as we can" (based on images), but capped reasonably.
    let count = images.length;

    // For Job ads, we enforce a minimum of 2 to showcase copy variation (A/B)
    if (adType === 'job') {
      count = Math.max(count, 2);
    }

    // Cap to avoid UI clutter (but allow plenty)
    count = Math.min(count, 20);
    
    // Ensure at least 1 variant is always generated
    count = Math.max(count, 1);

    for (let i = 0; i < count; i++) {
      const copy = generateCopyForAdType(adType, lpData, i);
      // Cycle through available images
      const image = images[i % images.length];
      const variantNumber = adType === "job" ? ((i % 2) + 1) : 1; // reuse existing designs

      variants.push({
        id: `${adType}-variant-${uuidv4().slice(0, 8)}`, // Use UUID or simpler unique ID
        title: copy.title,
        description: copy.description,
        callToAction: copy.cta,
        source: copy.source,
        image: image,
        template: "template-1", // Default template
        adTypeId: adType,
        variantNumber,
        selected: i === 0, // Select first by default
        approved: false,
      });
    }

    ads[adType] = {
      variants,
      enabled: adType === 'job', // Only job enabled by default
    };
  });

  return ads;
};

