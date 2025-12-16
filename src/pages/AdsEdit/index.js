"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { message, Modal, Tooltip, Skeleton, Switch } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import CrudService from "../../services/CrudService";
import LandingPageService from "../../services/landingPageService";
import AdsService from "../../services/AdsService";
import MetaService from "../../services/MetaService";
import { toBlob } from "html-to-image";
import UploadService from "../../services/UploadService";
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

// Tiny transparent PNG used as safe placeholder for missing images and html-to-image fallbacks
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmVariants, setConfirmVariants] = useState([]);
  const captureRef = useRef(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [reuseCampaign, setReuseCampaign] = useState(true);
  const [reuseAdSet, setReuseAdSet] = useState(false);
  const [preparingLaunch, setPreparingLaunch] = useState(false);
  const [preparedOnce, setPreparedOnce] = useState(false);
  const [preparedModalOpen, setPreparedModalOpen] = useState(false);
  const [preparedVariants, setPreparedVariants] = useState([]);
  const [prepareMessages, setPrepareMessages] = useState([]);
  const [hasUnsavedAdsChanges, setHasUnsavedAdsChanges] = useState(false);
  const [hasUnsyncedMetaAdsChanges, setHasUnsyncedMetaAdsChanges] = useState(false);

  // Dirty tracking baselines
  const lastSavedAdsHashRef = useRef("");
  const lastMetaSyncedAdsHashRef = useRef("");

  const serializeAdsData = useCallback((data) => {
    try {
      return JSON.stringify(data || {});
    } catch {
      return "";
    }
  }, []);

  const detectHasMetaPublish = useCallback((data) => {
    const ads = data || {};
    try {
      return Object.keys(ads).some((adType) =>
        (ads[adType]?.variants || []).some(
          (v) => v?.publish?.adId || v?.publish?.campaignId || v?.publish?.adSetId
        )
      );
    } catch {
      return false;
    }
  }, []);

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
      const savedHash = serializeAdsData(generatedAds);
      lastSavedAdsHashRef.current = savedHash;

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
          // Reset baselines from server state
          const serverHash = serializeAdsData(adsPayload);
          lastSavedAdsHashRef.current = serverHash;
          setHasUnsavedAdsChanges(false);
          if (detectHasMetaPublish(adsPayload)) {
            lastMetaSyncedAdsHashRef.current = serverHash;
            setHasUnsyncedMetaAdsChanges(false);
          }
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
  }, [lpId, serializeAdsData, detectHasMetaPublish]);

  const hasMetaPublished = useMemo(() => detectHasMetaPublish(adsData), [adsData, detectHasMetaPublish]);

  // Track unsaved draft changes + "not synced to Meta" changes (once published)
  useEffect(() => {
    if (!adsData) {
      setHasUnsavedAdsChanges(false);
      setHasUnsyncedMetaAdsChanges(false);
      return;
    }
    const currentHash = serializeAdsData(adsData);
    setHasUnsavedAdsChanges(currentHash !== lastSavedAdsHashRef.current);
    if (hasMetaPublished && lastMetaSyncedAdsHashRef.current) {
      setHasUnsyncedMetaAdsChanges(currentHash !== lastMetaSyncedAdsHashRef.current);
    } else {
      setHasUnsyncedMetaAdsChanges(false);
    }
  }, [adsData, hasMetaPublished, serializeAdsData]);

  // Prompt before leaving if there are unsaved changes or Meta-unsynced edits
  useEffect(() => {
    const shouldBlock = hasUnsavedAdsChanges || hasUnsyncedMetaAdsChanges;
    const onBeforeUnload = (e) => {
      if (!shouldBlock) return;
      e.preventDefault();
      e.returnValue = "";
    };
    const onRouteChangeStart = () => {
      if (!shouldBlock) return;
      const ok = window.confirm("You have unsaved changes to ads. Leave without saving?");
      if (ok) return;
      router.events.emit("routeChangeError");
      // eslint-disable-next-line no-throw-literal
      throw "routeChange aborted";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [router, hasUnsavedAdsChanges, hasUnsyncedMetaAdsChanges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check for OAuth success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('meta_success');
    if (success === 'true') {
      message.success("Meta connected successfully!");
      // Clean up URL by removing the success parameter
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Fetch Meta connect status (workspace-based if available)
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await MetaService.getStatus(workspaceId || undefined);
        if (res?.data?.success) {
          setMetaStatus(res.data.data);
          if (res.data.data?.via === "user") {
            if (res.data.data?.adAccountId) setSelectedAdAccountId(res.data.data.adAccountId);
            if (res.data.data?.pageId) setSelectedPageId(res.data.data.pageId);
          }
        }
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
    // If workspace is present, persist selection to workspace; otherwise keep as per-publish overrides
    if (workspaceId) {
      try {
        await MetaService.saveAssets({
          workspaceId: workspaceId || undefined,
          adAccountId: selectedAdAccountId,
          pageId: selectedPageId,
          lpId,
        });
        setAssetModalOpen(false);
        const res = await MetaService.getStatus(workspaceId || undefined);
        if (res?.data?.success) setMetaStatus(res.data.data);
        message.success("Meta assets saved");
      } catch (e) {
        message.error("Failed to save Meta assets");
      }
    } else {
      try {
        await MetaService.saveAssets({
          adAccountId: selectedAdAccountId,
          pageId: selectedPageId,
          lpId,
        });
        setAssetModalOpen(false);
        const res = await MetaService.getStatus(undefined);
        if (res?.data?.success) {
          setMetaStatus(res.data.data);
          if (res.data.data?.adAccountId) setSelectedAdAccountId(res.data.data.adAccountId);
          if (res.data.data?.pageId) setSelectedPageId(res.data.data.pageId);
        }
        message.success("Meta assets saved for your account");
      } catch (e) {
        message.error("Failed to save Meta assets");
      }
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

  // Cloudinary upload helper via shared UploadService
  const uploadToCloudinary = async (blob) => {
    // Convert Blob to File for UploadService
    const file = new File([blob], `ad-${Date.now()}.png`, { type: "image/png" });
    // Align with working uploader (ImageUploader) which uses UploadService.upload
    const res = await UploadService.upload(file, 20); // 20MB cap
    const url = res?.data?.secure_url;
    if (!url) throw new Error("Cloudinary upload failed");
    return url;
  };

  const isPublicUrl = (u) =>
    /^https?:\/\//i.test(String(u || "")) &&
    !/(localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)/i.test(
      String(u || "")
    );

  // Append a short status line to the Approve & Prepare activity log
  const appendPrepareMessage = useCallback((msg) => {
    setPrepareMessages((prev) => {
      const next = [...prev, msg];
      return next.length > 6 ? next.slice(next.length - 6) : next;
    });
  }, []);

  // Wait until preview has content
  const waitForPreviewRender = async (timeoutMs = 3000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const node = captureRef.current;
      if (node && node.childNodes && node.childNodes.length > 0 && node.clientWidth > 0 && node.clientHeight > 0) {
        return true;
      }
      // small delay
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 120));
    }
    return false;
  };

  // Render the current preview node to Cloudinary and return URL
  const renderCurrentPreviewToCloudinary = async (format) => {
    const node = captureRef.current;
    if (!node) throw new Error("Preview not mounted");
    const blob = await toBlob(node, {
      width: format?.width,
      height: format?.height,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#ffffff",
      // Avoid cross-origin stylesheet access (Google Fonts, Crisp, etc.)
      skipFonts: true,
      // Ensure failed images don't break rendering
      imagePlaceholder: TRANSPARENT_PNG,
      // CORS-friendly fetch options for assets
      fetchRequestInit: {
        mode: "cors",
        credentials: "omit",
      },
    });
    if (!blob) throw new Error("Failed to render preview");
    const url = await uploadToCloudinary(blob);
    return url;
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
      if (!landingPageData?.metaPixelId) {
        message.error(
          "Meta Pixel / hirelab.FormSubmitted conversion is not configured. Please configure it in Meta settings before publishing."
        );
        return;
      }
      // Full flow publish: campaign -> ad set -> ad (backend keeps PAUSED)
      // When connected via user token, require and pass per-publish overrides
      if (metaStatus?.via === "user" && (!selectedAdAccountId || !selectedPageId)) {
        message.warning("Select an Ad Account & Page before publishing");
        return;
      }
      const body = { adIds: ids, budget: 0, reuseCampaign, reuseAdSet };
      if (metaStatus?.via === "user") {
        body.adAccountId = selectedAdAccountId;
        body.pageId = selectedPageId;
      }
      const res = await AdsService.publish(lpId, body);
      if (res?.data?.success) {
        message.success("Publish request submitted");
        // Treat current ads snapshot as "synced to Meta" baseline for prompting.
        // After fetchData() returns, we'll also reset baselines from server data.
        lastMetaSyncedAdsHashRef.current = serializeAdsData(adsData);
        setHasUnsyncedMetaAdsChanges(false);
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

  // Open confirmation modal with selected creatives
  const openPublishConfirm = () => {
    // Build selected list (same criteria as publish)
    const selectedList = [];
    Object.keys(adsData || {}).forEach((adType) => {
      const group = adsData[adType];
      (group?.variants || []).forEach((v) => {
        if (v.approved || v.id === selectedVariant) {
          selectedList.push({ ...v, adTypeId: adType });
        }
      });
    });
    if (selectedList.length === 0) {
      message.warning("No approved variants to publish");
      return;
    }
    if (metaStatus?.via === "user" && (!selectedAdAccountId || !selectedPageId)) {
      message.warning("Select an Ad Account & Page before publishing");
      return;
    }
    setConfirmVariants(selectedList);
    setConfirmOpen(true);
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

    // Use a data URL placeholder instead of a missing local file to avoid 404s during capture
    return images.length > 0 ? images : [TRANSPARENT_PNG];
  };

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

  // Get default title based on ad type, using vacancy context
  const getDefaultTitle = (adTypeId, variantIndex, lpData) => {
    const company = lpData?.companyName || "our company";
    const vacancy = lpData?.vacancyTitle || "this role";

    const testimonialTitles = [
      snippetFromText(lpData?.testimonials?.[0]?.comment) || "Hear From Our Team",
      snippetFromText(lpData?.testimonials?.[1]?.comment) || "Real Stories From Our People",
      snippetFromText(lpData?.testimonials?.[2]?.comment) || "Employee Spotlight",
    ];

    const titles = {
      job: [
        lpData?.vacancyTitle || "Join Our Team",
        `We're Hiring: ${lpData?.vacancyTitle || "Great Opportunity"}`,
        `${lpData?.vacancyTitle || "Career Opportunity"} at ${company}`,
      ],
      "employer-brand": [
        `Life at ${company}`,
        `Our Mission at ${company}`,
        lpData?.aboutTheCompanyTitle || "Why People Love Working Here",
      ],
      testimonial: testimonialTitles,
      company: [
        lpData?.aboutTheCompanyTitle || `Inside ${company}`,
        `About ${company}`,
        lpData?.companyFactsTitle || "Our Culture & Values",
      ],
      retargeting: [
        `Still Interested in ${vacancy}?`,
        `Don't Miss Out – ${vacancy}`,
        `Join ${company} Today`,
      ],
    };

    return titles[adTypeId]?.[variantIndex] || lpData?.vacancyTitle || "Join Our Team";
  };

  // Get default description using vacancy & company sections
  const getDefaultDescription = (adTypeId, variantIndex, lpData) => {
    const evpSentence = pickSectionSentence(lpData?.evpMissionDescription);
    const aboutSentence =
      pickSectionSentence(lpData?.aboutTheCompanyDescription || lpData?.aboutTheCompanyText) ||
      pickSectionSentence(lpData?.companyInfo);
    const jobSentence =
      pickSectionSentence(lpData?.heroDescription) ||
      pickSectionSentence(lpData?.jobDescription);

    const descriptions = {
      job: [
        jobSentence || "Highlighting impact, growth and day‑to‑day responsibilities in this role.",
        "Professional tone that emphasizes ownership, responsibility and influence.",
        "Clear call-to-action for candidates who want to make a difference in this role.",
      ],
      "employer-brand": [
        evpSentence ||
          aboutSentence ||
          "Showcasing our values, mission and what makes our culture unique.",
        aboutSentence || "Where innovation, collaboration and growth come together.",
        "A workplace built around purpose, development and long‑term careers.",
      ],
      testimonial: [
        "Discover what our employees love about working here.",
        "Real experiences from real team members.",
        "See why people choose to grow their careers with us.",
      ],
      company: [
        aboutSentence ||
          "More people‑focused and brand‑aligned, appealing to candidates who value culture.",
        "Learn about our commitment to excellence, innovation and client impact.",
        "Discover the benefits and opportunities that set us apart as an employer.",
      ],
      retargeting: [
        "The opportunity is still available – apply now and complete your application.",
        "Come back and finish your application to move forward in the process.",
        "Take the next step in your career journey with us.",
      ],
    };

    return descriptions[adTypeId]?.[variantIndex] || jobSentence || lpData?.heroDescription || "";
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
      lastSavedAdsHashRef.current = serializeAdsData(adsData);
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

  // Handle approve all – now also prepares Cloudinary images for launch (but does NOT publish)
  const handleApproveAll = async () => {
    if (!adsData) return;

    try {
      setPrepareMessages([
        "Starting: marking all variants as approved...",
      ]);
      setPreparingLaunch(true);

      // 1) Mark all variants as approved in memory
      const updatedAds = { ...adsData };
      const variantsToPrepare = [];
      Object.keys(updatedAds).forEach((adType) => {
        const group = updatedAds[adType];
        if (!group?.variants) return;
        group.variants = group.variants.map((v) => {
          const approvedVariant = { ...v, approved: true };
          variantsToPrepare.push({ ...approvedVariant, adTypeId: adType });
          return approvedVariant;
        });
      });

      if (variantsToPrepare.length === 0) {
        message.warning("No variants to prepare");
        setPrepareMessages([
          "No variants found to prepare. Please generate or approve at least one variant.",
        ]);
        setPreparingLaunch(false);
        return;
      }

      setAdsData(updatedAds);

      // 2) Render each approved variant via preview and upload to Cloudinary
      const format = AD_FORMATS.find((f) => f.id === selectedFormat);
      for (let index = 0; index < variantsToPrepare.length; index += 1) {
        const v = variantsToPrepare[index];
        const stepLabel = `${v.adTypeId} · ${v.title || v.id}`;
        appendPrepareMessage(
          `Preparing ${index + 1}/${variantsToPrepare.length}: ${stepLabel}`
        );
        // Switch preview to the variant so the preview renders the correct component
        setSelectedAdType(v.adTypeId);
        setSelectedVariant(v.id);
        // eslint-disable-next-line no-await-in-loop
        await waitForPreviewRender(4000);
        // eslint-disable-next-line no-await-in-loop
        const url = await renderCurrentPreviewToCloudinary(format);
        const group = updatedAds[v.adTypeId];
        if (group?.variants) {
          const idx = group.variants.findIndex((x) => x.id === v.id);
          if (idx >= 0) {
            group.variants[idx] = { ...group.variants[idx], publishImage: url };
          }
        }
        appendPrepareMessage(`✓ Image uploaded for ${stepLabel}`);
      }

      appendPrepareMessage("Saving creatives with launch-ready images...");
      // 3) Persist updated ads with Cloudinary URLs only (no Meta publish)
      await AdsService.saveAds(lpId, updatedAds);
      lastSavedAdsHashRef.current = serializeAdsData(updatedAds);
      setAdsData(updatedAds);
      setPreparedOnce(true);
      setPreparedVariants(variantsToPrepare);
      setPreparedModalOpen(true);
      message.success("All variants approved and prepared for launch");
    } catch (err) {
      console.error("Error preparing creatives for launch", err);
      message.error("Failed to prepare creatives for launch");
      appendPrepareMessage(
        "Error: something went wrong while preparing creatives. Please try again."
      );
    } finally {
      setPreparingLaunch(false);
    }
  };

  // Toggle ad type
  const toggleAdType = (adTypeId) => {
    const nextData = {
      ...adsData,
      [adTypeId]: {
        ...adsData[adTypeId],
        enabled: !adsData[adTypeId].enabled,
      },
    };
    setAdsData(nextData);
    // Persist immediately so toggles are not lost and we can confidently prompt on real unsaved edits.
    AdsService.saveAds(lpId, nextData)
      .then(() => {
        lastSavedAdsHashRef.current = serializeAdsData(nextData);
      })
      .catch(() => {
        message.error("Failed to save ad type toggle");
      });
  };

  if (loading || !landingPageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => router.push(`/form-editor/${lpId}`)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex gap-2 items-center">
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
        <div className="px-8 py-6 bg-white border-b border-[#eaecf0] flex-shrink-0">
          <Header
            landingPageData={landingPageData}
            setPublished={(val) => {
               if (landingPageData) {
                 const newData = { ...landingPageData, published: val };
                 setLandingPageData(newData);
                 CrudService.update("LandingPageData", lpId, { published: val }).then(() => {
                    message.success(val ? "Page published" : "Page unpublished");
                 });
               }
            }}
            setLandingPageData={setLandingPageData}
            reload={fetchData}
            lpId={lpId}
            isAdsEditor={true}
            onOpenSettings={openAssetModal}
            customActions={
              <div className="flex gap-3 items-center">
                <Switch
                  checked={adsData?.[selectedAdType]?.enabled}
                  onChange={() => toggleAdType(selectedAdType)}
                  size="small"
                  className="mr-2"
                />
                {!metaStatus?.connected ? (
                  <button
                    onClick={async () => {
                      try {
                        const currentUrl = window.location.href;
                        const res = await MetaService.getAuthUrl(
                          workspaceId || undefined,
                          currentUrl
                        );
                        const url = res?.data?.url;
                        if (url) window.location.href = url;
                        else message.error("Failed to get Meta connect URL");
                      } catch {
                        message.error("Failed to get Meta connect URL");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5207CD] hover:bg-[#3b0aa1] text-white font-semibold text-sm border border-[#5207CD] transition-colors shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3v18m9-9H3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Connect Meta
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleApproveAll}
                      disabled={preparingLaunch}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm ${
                        preparingLaunch
                          ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#16A34A] hover:bg-[#15803D] text-white border-[#16A34A]"
                        }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect
                          width="16"
                          height="16"
                          rx="8"
                          fill="white"
                          opacity="0.2"
                        />
                        <path
                          d="M11.3327 5.5L6.74935 10.0833L4.66602 8"
                          stroke="white"
                          strokeWidth="1.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {preparingLaunch
                        ? "Preparing..."
                        : preparedOnce
                        ? "Approve & Prepare again"
                        : "Approve & Prepare"}
                    </button>
                    {preparedOnce && !preparingLaunch && (
                      <span className="text-xs font-medium text-[#0a8f63]">
                        ✓ Creatives ready for Launch
                      </span>
                    )}
                    <button
                      onClick={openPublishConfirm}
                      disabled={
                        (metaStatus?.via === "workspace" &&
                          (!metaStatus?.adAccountId || !metaStatus?.pageId)) ||
                        (metaStatus?.via === "user" &&
                          (!selectedAdAccountId || !selectedPageId))
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5207CD] hover:bg-[#3b0aa1] text-white font-semibold text-sm border border-[#5207CD] transition-colors shadow-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 3v18m9-9H3"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Publish (Meta)
                    </button>
                  </>
                )}
              </div>
            }
          />
        </div>

        {/* Unsaved / unsynced changes banner */}
        {(hasUnsavedAdsChanges || (hasMetaPublished && hasUnsyncedMetaAdsChanges)) && (
          <div className="flex justify-between items-center px-8 py-3 bg-amber-50 border-b border-amber-200">
            <div className="text-xs text-amber-900">
              {hasUnsavedAdsChanges
                ? "You have unsaved ad changes."
                : "You changed ads after publishing — changes are not synced to Meta yet."}
            </div>
            <div className="flex gap-2">
              {hasUnsavedAdsChanges && (
                <button
                  onClick={saveAdsData}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#5207CD] rounded-full hover:bg-[#4506A6]"
                >
                  Save changes
                </button>
              )}
              {hasMetaPublished && hasUnsyncedMetaAdsChanges && (
                <button
                  onClick={openPublishConfirm}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#16A34A] rounded-full hover:bg-[#15803D]"
                >
                  Publish updates to Meta
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="overflow-hidden flex-1 px-8 py-6">
          <div className="bg-white border border-[#eaecf0] rounded-xl h-full overflow-hidden flex">
            {/* Left Sidebar - Ad Types */}
            <div className="bg-white border-r border-[#eceef5] flex flex-col items-center pt-8 pb-6 px-4 gap-6 flex-shrink-0">
              <h2 className="text-xl font-semibold leading-5 text-black">
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
            <div className="flex flex-col p-8 h-full">
              {/* Header */}
              <div className="flex flex-shrink-0 justify-between items-center mb-5">
                <h2 className="text-xl font-semibold leading-5 text-black">
                  Variants
                </h2>
                
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-[#0a8f63] rounded-full" />
                  <span className="font-semibold text-sm text-[#475467] leading-5">
                    {currentVariants.length} variants
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#eaecf0] mb-5 flex-shrink-0" />

              {/* Variants List - Scrollable */}
              <div className="overflow-y-auto flex-1 pr-2 space-y-4 min-h-0">
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
                    onSave={async (updatedVariant) => {
                      const updatedVariants = currentVariants.map(v =>
                        v.id === updatedVariant.id ? updatedVariant : v
                      );
                      const nextData = {
                        ...adsData,
                        [selectedAdType]: {
                          ...adsData[selectedAdType],
                          variants: updatedVariants,
                        },
                      };
                      setAdsData(nextData);
                      try {
                        await AdsService.saveAds(lpId, nextData);
                        lastSavedAdsHashRef.current = serializeAdsData(nextData);
                        message.success("Variant saved");
                      } catch {
                        message.error("Failed to save variant");
                      }
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
          <div className="flex overflow-hidden flex-col flex-1 h-full bg-white">
            <div className="flex flex-col p-8 h-full">
                {/* Header */}
                <div className="flex flex-shrink-0 justify-between items-center mb-5">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl font-semibold leading-5 text-black capitalize">
                      Live preview
                    </h2>
                    
                  
                  </div>

                  <div className="flex gap-2 items-center">
                    {AD_FORMATS.map((format) => {
                      const isActive = selectedFormat === format.id;
                      return (
                        <button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors border ${
                            isActive
                              ? "bg-[#5207CD] text-white border-[#5207CD]"
                              : "bg-[#F3F0FF] text-[#5207CD] border-transparent hover:bg-[#E4D9FF]"
                          }`}
                        >
                          {format.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#eaecf0] mb-8 flex-shrink-0" />

                {/* Preview Container - Centered and Scrollable */}
                <div className="flex overflow-y-auto flex-1 justify-center items-start min-h-0">
                  {variantForPreview && (
                    <AdPreview
                      refEl={captureRef}
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

      {/* Side toast for Approve & Prepare status (non-blocking, no layout shift) */}
      {prepareMessages.length > 0 && (
        <div className="fixed right-6 bottom-24 z-50 max-w-sm">
          <div className="rounded-lg bg-white shadow-lg border border-[#e5e7eb] px-4 py-3 text-xs text-[#111827] space-y-1">
            <div className="font-semibold text-[#111827]">Preparing creatives…</div>
            {prepareMessages.slice(-3).map((msg, idx) => (
              <div key={idx} className="text-[11px] text-[#4b5563]">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

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
        onSave={async (updatedVariant) => {
          const updatedVariants = currentVariants.map(v =>
            v.id === updatedVariant.id ? updatedVariant : v
          );
          const nextData = {
            ...adsData,
            [selectedAdType]: {
              ...adsData[selectedAdType],
              variants: updatedVariants,
            },
          };
          setAdsData(nextData);
          setIsEditModalOpen(false);
          try {
            await AdsService.saveAds(lpId, nextData);
            lastSavedAdsHashRef.current = serializeAdsData(nextData);
            message.success("Variant updated");
          } catch {
            message.error("Failed to save variant");
          }
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
          <div className="flex justify-between items-center">
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
            <div className="mb-1 text-sm font-semibold">Ad Account</div>
            <select
              className="p-2 w-full rounded-md border"
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
            <div className="mb-1 text-sm font-semibold">Page</div>
            <select
              className="p-2 w-full rounded-md border"
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
      
      {/* Publish Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            setConfirmLoading(true);
            // Render & upload each variant to get a public image URL (Cloudinary)
            const format = AD_FORMATS.find((f) => f.id === selectedFormat);
            const updated = { ...adsData };
            for (const v of confirmVariants) {
              // Switch preview to the variant so the preview renders the correct component
              setSelectedAdType(v.adTypeId);
              setSelectedVariant(v.id);
              // Wait for the preview to render
              // eslint-disable-next-line no-await-in-loop
              await waitForPreviewRender(4000);
              // Render to Cloudinary
              // eslint-disable-next-line no-await-in-loop
              const url = await renderCurrentPreviewToCloudinary(format);
              const group = updated[v.adTypeId];
              if (group?.variants) {
                const idx = group.variants.findIndex((x) => x.id === v.id);
                if (idx >= 0) {
                  group.variants[idx] = { ...group.variants[idx], publishImage: url };
                }
              }
            }
            // Persist updated images
            // eslint-disable-next-line no-await-in-loop
            await AdsService.saveAds(lpId, updated);
            lastSavedAdsHashRef.current = serializeAdsData(updated);
            setConfirmOpen(false);
            await publishToMeta();
          } catch (e) {
            message.error(e?.message || "Failed to prepare creatives");
          } finally {
            setConfirmLoading(false);
          }
        }}
        okText="Confirm & Publish"
        title="Confirm creatives to publish"
        width={960}
      >
        <div className="mb-4 text-[#475467]">
          {confirmVariants.length} creative{confirmVariants.length !== 1 ? "s" : ""} will be published to Meta.
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {confirmVariants.map((v) => {
            const formatObj = AD_FORMATS.find((f) => f.id === selectedFormat);
            return (
              <div key={v.id} className="border border-[#eaecf0] rounded-lg overflow-hidden">
                <div className="overflow-hidden w-full bg-gray-50">
                  <div className="p-3">
                    <div className="w-full">
                      <AdPreview
                        variant={v}
                        format={formatObj}
                        platform={selectedPlatform}
                        brandData={userBrandData}
                        landingPageData={landingPageData}
                        adType={v.adTypeId}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eff8ff] text-[#0e87fe] capitalize">
                      {v.adTypeId}
                    </div>
                    {v.approved ? (
                      <span className="text-xs text-[#0a8f63]">Approved</span>
                    ) : (
                      <span className="text-xs text-[#667085]">Selected</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-[#101828] truncate" title={v.title}>
                    {v.title || v.id}
                  </div>
                  {v.description && (
                    <div className="text-xs text-[#667085] mt-1 line-clamp-2">
                      {v.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Prepared creatives summary modal */}
      <Modal
        open={preparedModalOpen}
        onCancel={() => setPreparedModalOpen(false)}
        footer={null}
        title="Creatives prepared for Launch"
        width={960}
      >
        <div className="mb-3 text-[#475467] text-sm">
          {preparedVariants.length} creative{preparedVariants.length !== 1 ? "s" : ""} are now
          marked approved and have launch-ready images.
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {preparedVariants.map((v) => (
            <div key={v.id} className="border border-[#eaecf0] rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eff8ff] text-[#0e87fe] capitalize">
                  {v.adTypeId}
                </span>
                {v.approved && (
                  <span className="text-[11px] text-[#0a8f63] font-medium">Approved</span>
                )}
              </div>
              <div className="text-sm font-semibold text-[#101828] truncate" title={v.title}>
                {v.title || v.id}
              </div>
              {v.description && (
                <div className="mt-1 text-xs text-[#667085] line-clamp-2">{v.description}</div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

