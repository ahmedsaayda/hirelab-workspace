"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { message, Modal, Tooltip, Skeleton, Switch } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import CrudService from "../../services/CrudService";
import LandingPageService from "../../services/landingPageService";
import AdsService from "../../services/AdsService";
import MetaService from "../../services/MetaService";
import Header from "../Dashboard/Vacancies/components/components/Header";
import { Button, Heading, Text } from "../Dashboard/Vacancies/components/components";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";
import AdVariantCard from "./components/AdVariantCard";
import AdPreview from "./components/AdPreview";
import AdLibraryModal from "./components/AdLibraryModal";
import AdEditModal from "./components/AdEditModal";
import InlineEditor from "./components/InlineEditor";
import EmptyState from "./components/EmptyState";

// Ad type icons as inline SVGs
const AdTypeIcon = ({ type, active }) => {
  const color = active ? "#0e87fe" : "#667085";
  
  const icons = {
    job: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75M12 5.25C12 6.90685 10.6569 8.25 9 8.25C7.34315 8.25 6 6.90685 6 5.25C6 3.59315 7.34315 2.25 9 2.25C10.6569 2.25 12 3.59315 12 5.25Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "employer-brand": (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 11.25C11.0711 11.25 12.75 9.57107 12.75 7.5C12.75 5.42893 11.0711 3.75 9 3.75C6.92893 3.75 5.25 5.42893 5.25 7.5C5.25 9.57107 6.92893 11.25 9 11.25Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.17188 10.5469L5.25 15.75L9 13.5L12.75 15.75L11.8266 10.5422" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    testimonial: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.75 11.25L13.5 9M13.5 9L15.75 6.75M13.5 9H16.5M11.25 3.75H3C2.58579 3.75 2.25 4.08579 2.25 4.5V13.5C2.25 13.9142 2.58579 14.25 3 14.25H11.25M11.25 3.75C11.6642 3.75 12 4.08579 12 4.5V13.5C12 13.9142 11.6642 14.25 11.25 14.25M11.25 3.75V2.25M11.25 14.25V15.75M5.25 7.5H8.25M5.25 10.5H8.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    company: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10.5 7.5H14.25V15.75H10.5M10.5 7.5V3.75H3.75V15.75H10.5M10.5 7.5V15.75M6.75 6.75H6.7575M6.75 9.75H6.7575M6.75 12.75H6.7575" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    retargeting: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14.25 7.5C14.25 10.3995 11.8995 12.75 9 12.75M14.25 7.5C14.25 4.60051 11.8995 2.25 9 2.25M14.25 7.5H15.75M9 12.75C6.10051 12.75 3.75 10.3995 3.75 7.5M9 12.75V14.25M3.75 7.5C3.75 4.60051 6.10051 2.25 9 2.25M3.75 7.5H2.25M9 2.25V0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  
  return icons[type] || icons.job;
};

// Ad type configurations
const AD_TYPES = [
  {
    id: "job",
    label: "Job Ad",
    description: "Direct apply ad to drive first visits",
  },
  {
    id: "employer-brand",
    label: "Employer Brand",
    description: "Team culture and mission",
  },
  {
    id: "company",
    label: "About Company",
    description: "EVP pitch and benefits",
  },
  {
    id: "testimonial",
    label: "Testimonial",
    description: "Employee stories and experiences",
  },
  {
    id: "retargeting",
    label: "Retargeting",
    description: "Re-engage visitors",
  },
];

// Ad format configurations
const AD_FORMATS = [
  { id: "story", label: "Story (9:16)", aspectRatio: "9:16", width: 1080, height: 1920 },
  { id: "square", label: "Square (1:1)", aspectRatio: "1:1", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait (4:5)", aspectRatio: "4:5", width: 1080, height: 1350 },
];

// Platform configurations
const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: "/icons/facebook.svg" },
  { id: "instagram", label: "Instagram", icon: "/icons/instagram.svg" },
  { id: "linkedin", label: "LinkedIn", icon: "/icons/linkedin.svg" },
  { id: "tiktok", label: "TikTok", icon: "/icons/tiktok.svg" },
];

export default function AdsEdit({ paramsId }) {
  const router = useRouter();
  const lpId = paramsId;
  const user = useSelector(selectUser);

  // State management
  const [landingPageData, setLandingPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState("job");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [selectedFormat, setSelectedFormat] = useState("story");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [editingVariant, setEditingVariant] = useState(null); // Track which variant is being edited
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [metaStatus, setMetaStatus] = useState({ connected: false });

  // Brand data
  const [userBrandData, setUserBrandData] = useState(null);
  const primaryColor = userBrandData?.primaryColor || user?.primaryColor || "#5207CD";
  const secondaryColor = userBrandData?.secondaryColor || user?.secondaryColor || "#0C7CE6";
  const tertiaryColor = userBrandData?.tertiaryColor || user?.tertiaryColor || "#6B46C1";

  // Generate ads from landing page content
  const handleGenerateAds = useCallback(async () => {
    if (!landingPageData) return;

    setGenerating(true);
    try {
      const generatedAds = initializeAdsData(landingPageData);
      setAdsData(generatedAds);
      setIsEmpty(false);

      // Auto-select first variant of first ad type
      const firstAdType = AD_TYPES[0].id;
      const firstVariant = generatedAds[firstAdType]?.variants?.[0];
      if (firstVariant) {
        setSelectedVariant(firstVariant.id);
      }

      // Save to backend (embedded under LandingPageData.ads)
      await AdsService.saveAds(lpId, generatedAds);

      message.success("Ads generated successfully!");
    } catch (error) {
      console.error("Error generating ads:", error);
      message.error("Failed to generate ads");
    } finally {
      setGenerating(false);
    }
  }, [landingPageData, lpId]);

  // Fetch landing page data
  const fetchData = useCallback(() => {
    if (!lpId) return;

    setLoading(true);
    // Fetch LP shell
    const lpPromise = CrudService.getSingle("LandingPageData", lpId, "ads edit");
    // Fetch ads
    const adsPromise = AdsService.getAds(lpId);

    Promise.all([lpPromise, adsPromise])
      .then(([lpRes, adsRes]) => {
        if (lpRes?.data) {
          setLandingPageData(lpRes.data);
          // Capture workspace for Meta connect state
          if (lpRes.data?.workspace) setWorkspaceId(lpRes.data.workspace);
        }
        const adsPayload = adsRes?.data?.data || {};
        if (!adsPayload || Object.keys(adsPayload).length === 0) {
          setIsEmpty(true);
          setAdsData(null);
        } else {
          setIsEmpty(false);
          setAdsData(adsPayload);

          // Auto-select first variant
          const firstAdType = AD_TYPES[0].id;
          const firstVariant = adsPayload[firstAdType]?.variants?.[0];
          if (firstVariant) {
            setSelectedVariant(firstVariant.id);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        message.error("Failed to load ads data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lpId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch Meta connect status (workspace-based if available)
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await MetaService.getStatus(workspaceId || undefined);
        if (res?.data?.success) setMetaStatus(res.data.data);
      } catch (e) {
        // ignore
      }
    };
    loadMeta();
  }, [workspaceId]);

  const openAssetModal = async () => {
    try {
      const res = await MetaService.listAssets(workspaceId || undefined);
      const data = res?.data?.data || {};
      setAdAccounts(data.adAccounts || []);
      setPages(data.pages || []);
      setAssetModalOpen(true);
    } catch (e) {
      message.error("Failed to load Meta assets");
    }
  };

  const saveAssets = async () => {
    if (!selectedAdAccountId || !selectedPageId) {
      message.warning("Select an Ad Account and a Page");
      return;
    }
    try {
      await MetaService.saveAssets({
        workspaceId: workspaceId || undefined,
        adAccountId: selectedAdAccountId,
        pageId: selectedPageId,
      });
      setAssetModalOpen(false);
      const res = await MetaService.getStatus(workspaceId || undefined);
      if (res?.data?.success) setMetaStatus(res.data.data);
      message.success("Meta assets saved");
    } catch (e) {
      message.error("Failed to save Meta assets");
    }
  };
  
  const refreshAssets = async () => {
    try {
      const res = await MetaService.listAssets(workspaceId || undefined);
      const data = res?.data?.data || {};
      setAdAccounts(data.adAccounts || []);
      setPages(data.pages || []);
      message.success("Assets refreshed");
    } catch (e) {
      message.error("Failed to refresh assets");
    }
  };

  // Set brand data
  useEffect(() => {
    if (user) {
      setUserBrandData({
        primaryColor: user.primaryColor,
        secondaryColor: user.secondaryColor,
        tertiaryColor: user.tertiaryColor,
        titleFont: user.titleFont,
        bodyFont: user.bodyFont,
        subheaderFont: user.subheaderFont,
        companyLogo: user.companyLogo,
        companyName: user.companyName,
      });
    }
  }, [user]);

  // Initialize ads data from landing page content
  const initializeAdsData = (lpData) => {
    const ads = {};
    
    AD_TYPES.forEach((adType) => {
      ads[adType.id] = {
        variants: generateVariantsForAdType(adType.id, lpData),
        enabled: adType.id === "job", // Job ads enabled by default
      };
    });

    return ads;
  };

  // Publish to Meta (MVP)
  const publishToMeta = async () => {
    try {
      // Collect approved or currently selected variants as defaults
      const ids = [];
      Object.keys(adsData || {}).forEach((adType) => {
        const group = adsData[adType];
        (group?.variants || []).forEach((v) => {
          if (v.approved || v.id === selectedVariant) {
            ids.push(v.id);
          }
        });
      });
      if (ids.length === 0) {
        message.warning("No approved variants to publish");
        return;
      }
      // For safety at this stage, push creatives only (no campaign/adset/ad)
      const res = await AdsService.publish(lpId, { adIds: ids, budget: 0, assetsOnly: true });
      if (res?.data?.success) {
        message.success("Publish request submitted");
        // Refresh to pick up publish metadata
        fetchData();
      } else {
        message.error(res?.data?.message || "Failed to publish");
      }
    } catch (err) {
      console.error("Publish error", err);
      message.error(err?.response?.data?.message || err.message || "Failed to publish");
    }
  };

  // Generate variants for a specific ad type
  const generateVariantsForAdType = (adTypeId, lpData) => {
    const variants = [];
    const images = extractImagesFromLandingPage(lpData);

    // Job ads get 2 variants, all other ad types get 1 variant
    const variantCount = adTypeId === "job" ? 2 : 1;

    for (let i = 0; i < variantCount; i++) {
      variants.push({
        id: `${adTypeId}-variant-${i + 1}`,
        title: getDefaultTitle(adTypeId, i, lpData),
        description: getDefaultDescription(adTypeId, i, lpData),
        image: images[i % images.length],
        template: "template-1", // We'll use template 1 for now
        adTypeId: adTypeId, // Required for component loading
        variantNumber: i + 1, // Required for component loading
        selected: i === 0, // First variant selected by default
        approved: false,
      });
    }

    return variants;
  };

  // Extract images from landing page
  const extractImagesFromLandingPage = (lpData) => {
    const images = [];
    
    // Extract from hero section
    if (lpData?.heroImage) {
      images.push(lpData.heroImage);
    }
    
    // Extract from job description
    if (lpData?.jobDescriptionImage) {
      images.push(lpData.jobDescriptionImage);
    }
    
    // Extract from about company images
    if (lpData?.aboutTheCompanyImages && lpData.aboutTheCompanyImages.length > 0) {
      images.push(...lpData.aboutTheCompanyImages);
    }
    
    // Extract from photo carousel
    if (lpData?.photoImages && lpData.photoImages.length > 0) {
      images.push(...lpData.photoImages);
    }
    
    // Extract from testimonials
    if (lpData?.testimonials) {
      lpData.testimonials.forEach((t) => {
        if (t.avatar) images.push(t.avatar);
      });
    }
    
    // Extract from recruiters
    if (lpData?.recruiters) {
      lpData.recruiters.forEach((r) => {
        if (r.recruiterAvatar) images.push(r.recruiterAvatar);
      });
    }
    
    // Extract from leader introduction
    if (lpData?.leaderIntroductionAvatar) {
      images.push(lpData.leaderIntroductionAvatar);
    }
    
    // Extract from EVP mission
    if (lpData?.evpMissionAvatar) {
      images.push(lpData.evpMissionAvatar);
    }

    // Fallback to company logo if no images
    if (images.length === 0 && lpData?.companyLogo) {
      images.push(lpData.companyLogo);
    }

    // Extract from agenda/benefits
    if (lpData?.agenda?.items) {
      lpData.agenda.items.forEach((item) => {
        if (item.image) images.push(item.image);
      });
    }

    return images.length > 0 ? images : ["/images/default-ad-image.jpg"];
  };

  // Get default title based on ad type
  const getDefaultTitle = (adTypeId, variantIndex, lpData) => {
    const titles = {
      job: [
        lpData?.vacancyTitle || "Join Our Team",
        `We're Hiring: ${lpData?.vacancyTitle || "Great Opportunity"}`,
        `${lpData?.vacancyTitle || "Career Opportunity"} at ${lpData?.companyName || "Us"}`,
      ],
      "employer-brand": [
        lpData?.evpMissionTitle || "Where Talent Thrives",
        `Life at ${lpData?.companyName || "Our Company"}`,
        lpData?.aboutTheCompanyTitle || "Build Your Future",
      ],
      testimonial: [
        lpData?.testimonials?.[0]?.comment?.substring(0, 50) || "Hear From Our Team",
        lpData?.testimonials?.[1]?.comment?.substring(0, 50) || "Real Stories",
        lpData?.testimonials?.[2]?.comment?.substring(0, 50) || "Employee Spotlight",
      ],
      company: [
        lpData?.aboutTheCompanyTitle || "People are Our Strength",
        `About ${lpData?.companyName || "Our Company"}`,
        lpData?.companyFactsTitle || "Our Culture",
      ],
      retargeting: [
        `Still Interested in ${lpData?.vacancyTitle || "This Role"}?`,
        `Don't Miss Out - ${lpData?.vacancyTitle || "Apply Now"}`,
        `Join ${lpData?.companyName || "Our Team"} Today`,
      ],
    };

    return titles[adTypeId]?.[variantIndex] || lpData?.vacancyTitle || "Join Our Team";
  };

  // Get default description
  const getDefaultDescription = (adTypeId, variantIndex, lpData) => {
    const descriptions = {
      job: [
        "Ideal for a mid-level recruiter role, highlights impact and growth.",
        "Professional tone, emphasizes seniority and responsibility.",
        "Direct and action-oriented for immediate applications.",
      ],
      "employer-brand": [
        "Showcasing our values and mission that drive success.",
        "Where innovation meets opportunity.",
        "Building careers, not just filling positions.",
      ],
      testimonial: [
        "Discover what our employees love about working here.",
        "Real experiences from real team members.",
        "See why people choose to grow their careers with us.",
      ],
      company: [
        "More people-focused and brand-aligned, appealing to candidates who value culture.",
        "Learn about our commitment to excellence and innovation.",
        "Discover the benefits and opportunities that set us apart.",
      ],
      retargeting: [
        "The opportunity is still available - apply now!",
        "Complete your application and join our team.",
        "Take the next step in your career journey.",
      ],
    };

    return descriptions[adTypeId]?.[variantIndex] || lpData?.heroDescription || "";
  };

  // Get current variants for selected ad type
  const currentVariants = useMemo(() => {
    return adsData?.[selectedAdType]?.variants || [];
  }, [adsData, selectedAdType]);

  // Sync selected variant when ad type changes or variants update
  useEffect(() => {
    if (!currentVariants.length) {
      if (selectedVariant !== null) {
        setSelectedVariant(null);
      }
      return;
    }

    const preferredVariant = currentVariants.find((v) => v.id === selectedVariant) ||
      currentVariants.find((v) => v.selected) ||
      currentVariants[0];

    if (preferredVariant && preferredVariant.id !== selectedVariant) {
      setSelectedVariant(preferredVariant.id);
    }
  }, [currentVariants, selectedVariant]);

  // Get selected variant for preview
  const variantForPreview = useMemo(() => {
    if (selectedVariant) {
      return currentVariants.find(v => v.id === selectedVariant);
    }
    return currentVariants.find(v => v.selected) || currentVariants[0];
  }, [currentVariants, selectedVariant]);

  // Save ads data
  const saveAdsData = async () => {
    try {
      await AdsService.saveAds(lpId, adsData);
      message.success("Ads saved successfully");
    } catch (error) {
      console.error("Error saving ads:", error);
      message.error("Failed to save ads");
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variantId) => {
    setSelectedVariant(variantId);
    
    // Update selected state in data
    const updatedVariants = currentVariants.map(v => ({
      ...v,
      selected: v.id === variantId,
    }));

    setAdsData({
      ...adsData,
      [selectedAdType]: {
        ...adsData[selectedAdType],
        variants: updatedVariants,
      },
    });
  };

  // Handle variant edit
  const handleVariantEdit = (variant) => {
    setEditingVariant(variant);
    setSelectedVariant(variant.id);
    // Editor shows inline instead of modal
  };

  // Handle variant delete
  const handleVariantDelete = (variantId) => {
    Modal.confirm({
      title: "Delete Variant",
      content: "Are you sure you want to delete this variant?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        const updatedVariants = currentVariants.filter(v => v.id !== variantId);
        setAdsData({
          ...adsData,
          [selectedAdType]: {
            ...adsData[selectedAdType],
            variants: updatedVariants,
          },
        });
        message.success("Variant deleted");
      },
    });
  };

  // Handle variant replace (open library)
  const handleVariantReplace = (variantId) => {
    setSelectedVariant(variantId);
    setIsLibraryModalOpen(true);
  };

  // Handle approve all
  const handleApproveAll = () => {
    const updatedAds = { ...adsData };
    Object.keys(updatedAds).forEach((adType) => {
      updatedAds[adType].variants = updatedAds[adType].variants.map(v => ({
        ...v,
        approved: true,
      }));
    });
    setAdsData(updatedAds);
    message.success("All variants approved");
  };

  // Toggle ad type
  const toggleAdType = (adTypeId) => {
    setAdsData({
      ...adsData,
      [adTypeId]: {
        ...adsData[adTypeId],
        enabled: !adsData[adTypeId].enabled,
      },
    });
  };

  if (loading || !landingPageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton active />
      </div>
    );
  }

  // Show empty state if no ads generated yet
  if (isEmpty) {
    return (
      <>
        <ApplyCustomFont landingPageData={{ ...landingPageData, ...userBrandData }} />
        
        <div className="flex flex-col h-screen bg-[#f8f8f8]">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-[#eaecf0] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/lp-editor/${lpId}/form`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#98a2b3] rounded-full" />
                  <span className="font-semibold text-base text-[#475467]">{landingPageData?.vacancyTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1">
            <EmptyState onGenerate={handleGenerateAds} loading={generating} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ApplyCustomFont landingPageData={{ ...landingPageData, ...userBrandData }} />
      
      <div className="flex flex-col h-screen bg-[#f8f8f8]">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-[#eaecf0] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/lp-editor/${lpId}/form`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0a8f63] rounded-full" />
                <span className="font-semibold text-base text-[#475467]">{landingPageData?.vacancyTitle}</span>
              </div>

              <Switch
                checked={adsData?.[selectedAdType]?.enabled}
                onChange={() => toggleAdType(selectedAdType)}
                size="small"
              />

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {!metaStatus?.connected ? (
              <button
                onClick={async () => {
                  try {
                    const res = await MetaService.getAuthUrl(workspaceId || undefined);
                    const url = res?.data?.url;
                    if (url) window.location.href = url;
                    else message.error("Failed to get Meta connect URL");
                  } catch {
                    message.error("Failed to get Meta connect URL");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0e87fe] hover:bg-[#0b6ecb] text-white font-semibold text-sm rounded-lg border border-[#0e87fe] transition-colors shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18m9-9H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Connect Meta
              </button>
            ) : (
              <>
                {metaStatus?.via === "workspace" && (!metaStatus?.adAccountId || !metaStatus?.pageId) && (
                  <button
                    onClick={openAssetModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ffb020] hover:bg-[#e09a1c] text-white font-semibold text-sm rounded-lg border border-[#ffb020] transition-colors shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v18m9-9H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Select Ad Account & Page
                  </button>
                )}
                <button
                  onClick={handleApproveAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0a8f63] hover:bg-[#099152] text-white font-semibold text-sm rounded-lg border border-[#0a8f63] transition-colors shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="8" fill="white" opacity="0.2"/>
                    <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve All
                </button>
                <button
                  onClick={publishToMeta}
                  className="ml-3 flex items-center gap-2 px-4 py-2.5 bg-[#0e87fe] hover:bg-[#0b6ecb] text-white font-semibold text-sm rounded-lg border border-[#0e87fe] transition-colors shadow-sm"
                  disabled={metaStatus?.via === "workspace" && (!metaStatus?.adAccountId || !metaStatus?.pageId)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18m9-9H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Publish (Meta)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 overflow-hidden px-8 py-6">
          <div className="bg-white border border-[#eaecf0] rounded-xl h-full overflow-hidden flex">
            {/* Left Sidebar - Ad Types */}
            <div className="bg-white border-r border-[#eceef5] flex flex-col items-center pt-8 pb-6 px-4 gap-6 flex-shrink-0">
              <h2 className="font-semibold text-xl text-black leading-5">
                Ad Types
              </h2>
              
              <div className="flex flex-col gap-2">
                {AD_TYPES.map((adType) => (
                  <Tooltip key={adType.id} title={adType.description} placement="right">
                    <button
                      onClick={() => setSelectedAdType(adType.id)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        selectedAdType === adType.id
                          ? "bg-[#eff8ff]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <AdTypeIcon type={adType.id} active={selectedAdType === adType.id} />
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

          {/* Middle Section - Variants List */}
          <div className="w-[486px] bg-white border-r border-[#eceef5] flex flex-col h-full">
            <div className="p-8 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 flex-shrink-0">
                <h2 className="font-semibold text-xl text-black leading-5">
                  Variants
                </h2>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0a8f63] rounded-full" />
                  <span className="font-semibold text-sm text-[#475467] leading-5">
                    {currentVariants.length} variants
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#eaecf0] mb-5 flex-shrink-0" />

              {/* Variants List - Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
                {currentVariants.map((variant) => (
                  <AdVariantCard
                    key={variant.id}
                    variant={variant}
                    selected={variant.selected || variant.id === selectedVariant}
                    isEditing={editingVariant?.id === variant.id}
                    onSelect={() => handleVariantSelect(variant.id)}
                    onEdit={(v) => {
                      if (v === null) {
                        setEditingVariant(null);
                      } else {
                        setEditingVariant(variant);
                      }
                    }}
                    onSave={(updatedVariant) => {
                      const updatedVariants = currentVariants.map(v =>
                        v.id === updatedVariant.id ? updatedVariant : v
                      );
                      setAdsData({
                        ...adsData,
                        [selectedAdType]: {
                          ...adsData[selectedAdType],
                          variants: updatedVariants,
                        },
                      });
                    }}
                    onDelete={() => handleVariantDelete(variant.id)}
                    onReplace={() => handleVariantReplace(variant.id)}
                    landingPageData={landingPageData}
                  />
                ))}

                <button
                  onClick={() => setIsLibraryModalOpen(true)}
                  className="w-full p-4 border-2 border-dashed border-[#d0d5dd] rounded-xl hover:border-[#0e87fe] hover:bg-[#eff8ff] transition-colors flex items-center justify-center gap-2 text-[#475467] hover:text-[#0e87fe] font-semibold text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Variant
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Live Preview */}
          <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
            <div className="p-8 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="font-semibold text-xl text-black leading-5 capitalize">
                      Live preview
                    </h2>
                    
                  
                  </div>

                  <div className="flex items-center gap-3">
                    {AD_FORMATS.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id)}
                        className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border ${
                          selectedFormat === format.id
                            ? "bg-[#0e87fe] text-white border-[#0e87fe]"
                            : "bg-white text-[#344054] border-[#d0d5dd] hover:bg-gray-50"
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#eaecf0] mb-8 flex-shrink-0" />

                {/* Preview Container - Centered and Scrollable */}
                <div className="flex-1 overflow-y-auto flex items-start justify-center min-h-0">
                  {variantForPreview && (
                    <AdPreview
                      variant={variantForPreview}
                      format={AD_FORMATS.find(f => f.id === selectedFormat)}
                      platform={selectedPlatform}
                      brandData={userBrandData}
                      landingPageData={landingPageData}
                      adType={selectedAdType}
                    />
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Ad Library Modal */}
      <AdLibraryModal
        open={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelect={(template) => {
          // Handle template selection
          setIsLibraryModalOpen(false);
          message.success("Template applied");
        }}
        platform={selectedPlatform}
        format={selectedFormat}
        adType={selectedAdType}
      />

      {/* Ad Edit Modal */}
      <AdEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        variant={variantForPreview}
        onSave={(updatedVariant) => {
          const updatedVariants = currentVariants.map(v =>
            v.id === updatedVariant.id ? updatedVariant : v
          );
          setAdsData({
            ...adsData,
            [selectedAdType]: {
              ...adsData[selectedAdType],
              variants: updatedVariants,
            },
          });
          setIsEditModalOpen(false);
          message.success("Variant updated");
        }}
        landingPageData={landingPageData}
      />

      {/* Meta Asset Selection Modal */}
      <Modal
        open={assetModalOpen}
        onCancel={() => setAssetModalOpen(false)}
        onOk={saveAssets}
        okText="Save"
        title="Select Ad Account & Page"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <a
              href="https://www.facebook.com/pages/create/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0e87fe] text-sm hover:underline"
              title="Create a Facebook Page"
            >
              Create a Facebook Page
            </a>
            <button
              type="button"
              onClick={refreshAssets}
              className="px-3 py-1.5 text-sm rounded-md border border-[#d0d5dd] hover:bg-gray-50"
              title="Refresh ad accounts and pages"
            >
              Refresh assets
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold mb-1">Ad Account</div>
            <select
              className="w-full border rounded-md p-2"
              value={selectedAdAccountId}
              onChange={(e) => setSelectedAdAccountId(e.target.value)}
            >
              <option value="">Choose an Ad Account</option>
              {adAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.account_id}) {acc.currency ? `- ${acc.currency}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm font-semibold mb-1">Page</div>
            <select
              className="w-full border rounded-md p-2"
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
            >
              <option value="">Choose a Page</option>
              {pages.map(pg => (
                <option key={pg.id} value={pg.id}>
                  {pg.name} ({pg.id})
                </option>
              ))}
            </select>
            {pages.length === 0 && (
              <div className="mt-2 text-xs text-[#667085]">
                No Pages found. Click "Create a Facebook Page", then "Refresh assets".
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

