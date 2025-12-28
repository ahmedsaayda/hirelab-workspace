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

// If a Cloudinary video URL is provided, derive a thumbnail/poster image URL.
// Example:
// https://res.cloudinary.com/<cloud>/video/upload/v123/abc.mp4
// ->     https://res.cloudinary.com/<cloud>/video/upload/so_0/v123/abc.jpg
const cloudinaryVideoToPoster = (url, seconds = 0) => {
  const u = String(url || "");
  if (!u.includes("res.cloudinary.com") || !u.includes("/video/upload/")) return "";
  const sec = Number.isFinite(seconds) ? seconds : 0;
  const withTransform = u.replace("/video/upload/", `/video/upload/so_${sec}/`);
  return withTransform.replace(/\.(mp4|mov|webm|mkv)(\?.*)?$/i, ".jpg$2");
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const shuffle = (arr) => {
  const a = Array.isArray(arr) ? [...arr] : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getVideoUrlFromLp = (lpData) =>
  lpData?.myVideo || lpData?.video?.url || lpData?.videoUrl || "";

const isLikelyVideoUrl = (u) => /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(String(u || ""));

const truncateByWords = (text, maxLen) => {
  const s = String(text || "").trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const trimmed = cut.replace(/\s+\S*$/, "").trim();
  return (trimmed || cut).slice(0, maxLen - 1).trimEnd() + "…";
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
      // Job Ads: Images from hero from all sections - except Leader Intro / EVP Mission
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
      // Brand Ads: Specifically focused -> Intro / EVP Mission + videos
      addImage(lpData?.evpMissionAvatar);
      addImage(lpData?.leaderIntroductionAvatar);
      if (lpData?.myVideo) {
        const poster = cloudinaryVideoToPoster(lpData.myVideo);
        addImage(poster || lpData.myVideo);
      }
      // Explicitly check for video section video (sometimes under a different key like 'videoUrl' or from 'video' object)
      if (lpData?.video?.url) {
        const poster = cloudinaryVideoToPoster(lpData.video.url);
        addImage(poster || lpData.video.url);
      } else if (lpData?.videoUrl) {
        const poster = cloudinaryVideoToPoster(lpData.videoUrl);
        addImage(poster || lpData.videoUrl);
      }

      // Fallback: Use photo images
      if (images.length === 0 && Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      // Fallback: Use hero image
      if (images.length === 0 && lpData?.heroImage) {
        addImage(lpData.heroImage);
      }
      // Last resort: Fallback to company logo
      if (images.length === 0 && lpData?.companyLogo) {
        addImage(lpData.companyLogo);
      }
      break;

    case 'company':
      // Company Ads: Images from hero from all sections - but ‘about company is prioritized + videos
      if (Array.isArray(lpData?.aboutTheCompanyImages)) {
        lpData.aboutTheCompanyImages.forEach(addImage);
      }
      {
        const videoUrl = getVideoUrlFromLp(lpData);
        if (videoUrl) {
          const poster = cloudinaryVideoToPoster(videoUrl);
          addImage(poster || videoUrl);
        }
      }
      addImage(lpData?.heroImage);
      addImage(lpData?.jobDescriptionImage);
      addImage(lpData?.textBoxImage);
      if (Array.isArray(lpData?.photoImages)) {
        lpData.photoImages.forEach(addImage);
      }
      // Fallback: Use company logo if absolutely nothing else
      if (images.length === 0 && lpData?.companyLogo) {
        addImage(lpData.companyLogo);
      }
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
      // Fallback: Use company logo
      if (images.length === 0 && lpData?.companyLogo) {
        addImage(lpData.companyLogo);
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
      const jobHook = pickSectionSentence(lpData?.heroDescription) || pickSectionSentence(lpData?.jobDescription);

      if (variantIndex === 0) {
        title = vacancy;
        description = `Join ${company}${locationStr}. ${jobHook}`;
      } else if (variantIndex === 1) {
        title = `We're Hiring: ${vacancy}`;
        description = jobHook || `Advance your career as a ${vacancy} at ${company}.`;
      } else if (variantIndex === 2) {
        title = `Career Opportunity`;
        description = `Are you the ${vacancy} we are looking for? Apply now at ${company}.`;
      } else {
        title = `${company} is Hiring`;
        description = `We are looking for a talented ${vacancy} to join our team${locationStr}.`;
      }
      source = "Vacancy & Job Description";
      break;

    case 'employer-brand':
      // Source: EVP or Leader
      const evp = pickSectionSentence(lpData?.evpMissionDescription);
      const leader = pickSectionSentence(lpData?.leaderIntroductionDescription);
      const videoDesc = pickSectionSentence(lpData?.videoDescription);

      const mission = evp || leader || videoDesc || `Our mission at ${company} is to empower every employee to thrive.`;

      title = variantIndex === 0 ? `Life at ${company}` : (variantIndex === 1 ? "Our Mission" : `Meet ${company}`);
      description = mission;
      cta = "Learn More";
      source = evp ? "EVP / Mission" : (leader ? "Leader Intro" : (videoDesc ? "Video Section" : "Brand Defaults"));
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
  const finalTitle = truncateByWords(title, MAX_HEADLINE_LENGTH);
  // Primary text can be long, but keep it within Meta limits
  const finalDescription = String(description || "").slice(0, 2200);
  const finalCta = (cta === "Learn More" || cta === "Apply Now") ? cta : "Learn More";
  return { title: finalTitle, description: finalDescription, cta: finalCta, source };
};

/**
 * Main generator function
 */
export const generateVariants = (lpData) => {
  const ads = {};

  // Target total variants (UI-friendly), but keep minimums guaranteed
  const totalTarget = clamp(15 + Math.floor(Math.random() * 6), 7, 20); // 15–20

  const MIN = {
    job: 4,
    company: 1,
    testimonial: 1,
    retargeting: 1,
    "employer-brand": 3, // EVP, Leader, Video
  };
  const CAP = {
    job: 12,
    company: 6,
    testimonial: 4,
    retargeting: 3,
    "employer-brand": 3,
  };

  const jobImages = shuffle(extractImagesForAdType("job", lpData));
  const companyImages = shuffle(extractImagesForAdType("company", lpData));
  const testimonialImages = shuffle(extractImagesForAdType("testimonial", lpData));
  const retargetingImages = shuffle(extractImagesForAdType("retargeting", lpData));

  const counts = {
    job: MIN.job,
    company: MIN.company,
    testimonial: MIN.testimonial,
    retargeting: MIN.retargeting,
    "employer-brand": MIN["employer-brand"],
  };

  const baseTotal =
    counts.job +
    counts.company +
    counts.testimonial +
    counts.retargeting +
    counts["employer-brand"];
  let remaining = Math.max(totalTarget - baseTotal, 0);

  const canGrow = (type) => counts[type] < CAP[type];
  const mediaLen = {
    job: jobImages.length,
    company: companyImages.length,
    testimonial: testimonialImages.length,
    retargeting: retargetingImages.length,
  };

  // Prefer allocating extra variants to types that have extra unique imagery available.
  while (remaining > 0) {
    const candidates = ["company", "testimonial", "job", "retargeting"].filter(canGrow);
    if (candidates.length === 0) break;

    candidates.sort((a, b) => {
      const aHasNew = counts[a] < (mediaLen[a] || 0) ? 1 : 0;
      const bHasNew = counts[b] < (mediaLen[b] || 0) ? 1 : 0;
      if (aHasNew !== bHasNew) return bHasNew - aHasNew;
      // Job is usually most valuable A/B coverage once others are satisfied
      const priority = { company: 3, testimonial: 2, job: 1, retargeting: 0 };
      return (priority[b] || 0) - (priority[a] || 0);
    });

    // Add one to the best candidate (with a tiny random tie-breaker to avoid identical sets)
    const top = candidates[0];
    counts[top] += 1;
    remaining -= 1;
  }

  const createVariant = (adType, i, image, extra = {}) => {
    const copy = generateCopyForAdType(adType, lpData, i);
    const variantNumber = adType === "job" ? ((i % 3) + 1) : 1;
    return {
      id: `${adType}-variant-${uuidv4().slice(0, 8)}`,
      title: copy.title,
      description: copy.description,
      callToAction: copy.cta,
      source: copy.source,
      image,
      template: "template-1",
      adTypeId: adType,
      variantNumber,
      selected: i === 0,
      approved: false,
      ...extra,
    };
  };

  // JOB (images from hero + sections, excluding Leader/EVP)
  {
    const variants = [];
    const imgs = jobImages.length ? jobImages : [TRANSPARENT_PNG];
    for (let i = 0; i < counts.job; i++) {
      variants.push(createVariant("job", i, imgs[i % imgs.length]));
    }
    ads.job = { variants, enabled: true };
  }

  // COMPANY (About Company prioritized + video)
  {
    const variants = [];
    const imgs = companyImages.length ? companyImages : [TRANSPARENT_PNG];
    const videoUrl = getVideoUrlFromLp(lpData);
    const videoPoster = videoUrl ? (cloudinaryVideoToPoster(videoUrl) || "") : "";
    for (let i = 0; i < counts.company; i++) {
      const image = imgs[i % imgs.length];
      const withVideo = videoUrl && videoPoster && image === videoPoster;
      variants.push(createVariant("company", i, image, withVideo ? { videoUrl } : {}));
    }
    ads.company = { variants, enabled: false };
  }

  // EMPLOYER BRAND (EVP, Leader, Video)
  {
    const variants = [];
    const evp = lpData?.evpMissionAvatar || "";
    const leader = lpData?.leaderIntroductionAvatar || "";
    const videoUrl = getVideoUrlFromLp(lpData);
    const videoPoster = videoUrl ? (cloudinaryVideoToPoster(videoUrl) || "") : "";

    variants.push(
      createVariant(
        "employer-brand",
        0,
        evp || leader || videoPoster || lpData?.heroImage || lpData?.companyLogo || TRANSPARENT_PNG,
        { mediaKind: evp ? "image" : "fallback", mediaSource: evp ? "evpMissionAvatar" : "fallback" }
      )
    );
    variants.push(
      createVariant(
        "employer-brand",
        1,
        leader || evp || videoPoster || lpData?.heroImage || lpData?.companyLogo || TRANSPARENT_PNG,
        { mediaKind: leader ? "image" : "fallback", mediaSource: leader ? "leaderIntroductionAvatar" : "fallback" }
      )
    );
    variants.push(
      createVariant(
        "employer-brand",
        2,
        videoPoster || evp || leader || lpData?.heroImage || lpData?.companyLogo || TRANSPARENT_PNG,
        { mediaKind: videoUrl ? "video" : "fallback", mediaSource: videoUrl ? "myVideo" : "fallback", videoUrl: videoUrl || "" }
      )
    );

    ads["employer-brand"] = { variants, enabled: false };
  }

  // TESTIMONIAL (from testimonials; fallback to images if no avatars)
  {
    const variants = [];
    const imgs = testimonialImages.length ? testimonialImages : [TRANSPARENT_PNG];
    const testimonials = Array.isArray(lpData?.testimonials) ? lpData.testimonials : [];
    for (let i = 0; i < counts.testimonial; i++) {
      const image = imgs[i % imgs.length];
      const t = testimonials.length ? testimonials[i % testimonials.length] : null;
      const quote = stripWrappingQuotes(snippetFromText(t?.comment, 140)) || "Working here has been an incredible experience.";
      const author = stripWrappingQuotes(t?.fullname) || "";
      const role = stripWrappingQuotes(t?.role) || "";
      variants.push(
        createVariant("testimonial", i, image, {
          // Match template expected fields
          quote,
          author,
          role,
          // For feed context too
          description: `"${quote}"${author ? ` - ${author}` : ""}`,
        })
      );
    }
    ads.testimonial = { variants, enabled: false };
  }

  // RETARGETING (messaging-driven)
  {
    const variants = [];
    const imgs = retargetingImages.length ? retargetingImages : [TRANSPARENT_PNG];
    const videoUrl = ""; // can be enabled later if needed
    for (let i = 0; i < counts.retargeting; i++) {
      variants.push(createVariant("retargeting", i, imgs[i % imgs.length], videoUrl ? { videoUrl } : {}));
    }
    ads.retargeting = { variants, enabled: false };
  }

  return ads;
};

