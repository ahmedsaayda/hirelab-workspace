"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { message, Modal, Tooltip, Skeleton, Switch, Dropdown, Input, Drawer } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import CrudService from "../../services/CrudService";
import LandingPageService from "../../services/landingPageService";
import AdsService from "../../services/AdsService";
import AdsLaunchService from "../../services/AdsLaunchService";
import MetaService from "../../services/MetaService";
import { toBlob } from "html-to-image";
import UploadService from "../../services/UploadService";
import Header from "../Dashboard/Vacancies/components/components/Header";
import { Button, Heading, Text } from "../Dashboard/Vacancies/components/components";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";
import AdVariantCard from "./components/AdVariantCard";
import AdPreview from "./components/AdPreview";
import AdEditModal from "./components/AdEditModal";
import InlineEditor from "./components/InlineEditor";
import EmptyState from "./components/EmptyState";
import VariantPickerModal, { getVariantMediaType } from "./components/VariantPickerModal";
import { generateVariants } from "./utils/adGenerationUtils";
import ImageSelectionModal from "../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";
import AiService from "../../services/AiService";
import DevBrandControls from "./components/DevBrandControls.jsx";

// Ad type icons as inline SVGs
const AdTypeIcon = ({ type, active }) => {
  const color = active ? "#5207CD" : "#667085";

  const icons = {
    job: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75M12 5.25C12 6.90685 10.6569 8.25 9 8.25C7.34315 8.25 6 6.90685 6 5.25C6 3.59315 7.34315 2.25 9 2.25C10.6569 2.25 12 3.59315 12 5.25Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "employer-brand": (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 11.25C11.0711 11.25 12.75 9.57107 12.75 7.5C12.75 5.42893 11.0711 3.75 9 3.75C6.92893 3.75 5.25 5.42893 5.25 7.5C5.25 9.57107 6.92893 11.25 9 11.25Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.17188 10.5469L5.25 15.75L9 13.5L12.75 15.75L11.8266 10.5422" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    testimonial: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.75 11.25L13.5 9M13.5 9L15.75 6.75M13.5 9H16.5M11.25 3.75H3C2.58579 3.75 2.25 4.08579 2.25 4.5V13.5C2.25 13.9142 2.58579 14.25 3 14.25H11.25M11.25 3.75C11.6642 3.75 12 4.08579 12 4.5V13.5C12 13.9142 11.6642 14.25 11.25 14.25M11.25 3.75V2.25M11.25 14.25V15.75M5.25 7.5H8.25M5.25 10.5H8.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    company: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10.5 7.5H14.25V15.75H10.5M10.5 7.5V3.75H3.75V15.75H10.5M10.5 7.5V15.75M6.75 6.75H6.7575M6.75 9.75H6.7575M6.75 12.75H6.7575" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    retargeting: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14.25 7.5C14.25 10.3995 11.8995 12.75 9 12.75M14.25 7.5C14.25 4.60051 11.8995 2.25 9 2.25M14.25 7.5H15.75M9 12.75C6.10051 12.75 3.75 10.3995 3.75 7.5M9 12.75V14.25M3.75 7.5C3.75 4.60051 6.10051 2.25 9 2.25M3.75 7.5H2.25M9 2.25V0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  const [launchSummary, setLaunchSummary] = useState(null);
  const [launchSummaryLoading, setLaunchSummaryLoading] = useState(false);
  const [activeAdSetId, setActiveAdSetId] = useState(null);
  const [creatingAdSet, setCreatingAdSet] = useState(false);
  const [adSetActionLoading, setAdSetActionLoading] = useState({ id: null, action: null });
  const [metaConfigModalOpen, setMetaConfigModalOpen] = useState(false);
  const [adsSettingsDrawerOpen, setAdsSettingsDrawerOpen] = useState(false);
  // Media picker (Replace) - use the real media library instead of the placeholder template modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerVariantId, setMediaPickerVariantId] = useState(null);

  // Variant template picker for adding new creatives
  const [variantPickerOpen, setVariantPickerOpen] = useState(false);
  // Track variant being edited for template change (null = new creative, variant = change template)
  const [templateChangeVariant, setTemplateChangeVariant] = useState(null);

  // 🔥 Required setup: Meta Pixel ID before creating ad sets
  const [metaPixelDraft, setMetaPixelDraft] = useState("");
  const [metaPixelSaving, setMetaPixelSaving] = useState(false);

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
  const isDev = process.env.NODE_ENV === "development";
  const previewLandingPageData = isDev
    ? { ...(landingPageData || {}), ...(userBrandData || {}) }
    : landingPageData;

  // Generate ads from landing page content
  const handleGenerateAds = useCallback(async () => {
    if (!landingPageData) return;

    setGenerating(true);
    try {
      const generatedAds = initializeAdsData(landingPageData);
      // Preserve existing meta/ad-set scaffolding stored in lp.ads (e.g. _adSets, _launch, _assets)
      let nextAds = { ...(adsData || {}), ...generatedAds };

      // AI: fill copy for all generated variants (after list is decided)
      try {
        const allVariants = [];
        Object.keys(generatedAds || {}).forEach((adTypeId) => {
          const vars = generatedAds?.[adTypeId]?.variants || [];
          vars.forEach((v) => {
            allVariants.push({
              id: v?.id,
              adTypeId: v?.adTypeId || adTypeId,
              variantNumber: v?.variantNumber,
              source: v?.source,
            });
          });
        });

        if (allVariants.length) {
          message.loading({
            key: "ai-ads-copy",
            content: "Generating ad copy with AI…",
            duration: 0,
          });
          const lang = landingPageData?.language || landingPageData?.lang;
          const resp = await AiService.generateAdsCopy({ lpId, variants: allVariants, language: lang });
          const filled = resp?.data?.data?.variants || [];
          const filledById = new Map(filled.map((v) => [String(v?.id || ""), v]));

          // Merge AI copy back into ads payload
          const merged = { ...nextAds };
          Object.keys(generatedAds || {}).forEach((adTypeId) => {
            const group = merged?.[adTypeId];
            if (!group?.variants) return;
            group.variants = group.variants.map((v) => {
              const ai = filledById.get(String(v?.id || ""));
              if (!ai) return v;
              return {
                ...v,
                // Image overlay fields
                title: ai.title ?? v.title,
                linkDescription: ai.linkDescription ?? v.linkDescription,
                callToAction: ai.callToAction ?? v.callToAction,
                // Meta ad copy fields
                description: ai.description ?? v.description,
                metaHeadline: ai.metaHeadline ?? v.metaHeadline,
                metaDescription: ai.metaDescription ?? v.metaDescription,
              };
            });
          });
          nextAds = merged;
        }
      } catch (e) {
        console.warn("AI ad copy generation failed, using local defaults.", e);
      } finally {
        message.destroy("ai-ads-copy");
      }
      setAdsData(nextAds);
      setIsEmpty(false);

      // Auto-select first variant of first ad type
      const firstAdType = AD_TYPES[0].id;
      const firstVariant = generatedAds[firstAdType]?.variants?.[0];
      if (firstVariant) {
        setSelectedVariant(firstVariant.id);
      }

      // Save to backend (embedded under LandingPageData.ads)
      await AdsService.saveAds(lpId, nextAds);
      const savedHash = serializeAdsData(nextAds);
      lastSavedAdsHashRef.current = savedHash;

      message.success("Ads generated successfully!");
    } catch (error) {
      console.error("Error generating ads:", error);
      message.error("Failed to generate ads");
    } finally {
      setGenerating(false);
    }
  }, [landingPageData, lpId, adsData, serializeAdsData, detectHasMetaPublish]);

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
          setMetaPixelDraft(lpRes.data?.metaPixelId || "");
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

  const saveMetaPixelId = useCallback(async () => {
    const value = (metaPixelDraft || "").trim();
    if (!value) {
      message.error("Meta Pixel ID is required");
      return;
    }
    if (!/^\d{6,20}$/.test(value)) {
      message.error("Meta Pixel ID should be a numeric ID (e.g., 1234567890123456)");
      return;
    }
    if (!lpId) return;
    try {
      setMetaPixelSaving(true);
      await CrudService.update("LandingPageData", lpId, { metaPixelId: value });
      setLandingPageData((prev) => ({ ...(prev || {}), metaPixelId: value }));
      message.success("Meta Pixel ID saved");
    } catch (e) {
      message.error("Failed to save Meta Pixel ID");
    } finally {
      setMetaPixelSaving(false);
    }
  }, [metaPixelDraft, lpId]);

  const loadLaunchSummary = useCallback(async () => {
    if (!lpId) return;
    setLaunchSummaryLoading(true);
    try {
      const res = await AdsLaunchService.getSummary(lpId, {});
      setLaunchSummary(res?.data?.data || null);
    } catch (e) {
      // Ignore summary errors to keep Ads editor usable offline
    } finally {
      setLaunchSummaryLoading(false);
    }
  }, [lpId]);

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



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    loadLaunchSummary();
  }, [loadLaunchSummary]);

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

  const handleCreateAdSet = async () => {
    // Create ad set on both HireLab and Meta (shallow campaign + ad set).
    // Also generate FRESH creatives for this ad set.
    try {
      if (!landingPageData?.metaPixelId) {
        setAdsSettingsDrawerOpen(true);
        message.warning("Add your Meta Pixel ID in Ads settings before creating an ad set");
        return;
      }
      setCreatingAdSet(true);
      setGenerating(true);
      message.loading({ key: "create-adset", content: "Creating ad set & generating creatives...", duration: 0 });

      // Generate fresh creatives for this ad set
      const freshCreatives = initializeAdsData(landingPageData);

      // Try to enhance with AI copy
      try {
        const allVariants = [];
        Object.keys(freshCreatives || {}).forEach((adTypeId) => {
          const vars = freshCreatives?.[adTypeId]?.variants || [];
          vars.forEach((v) => {
            allVariants.push({
              id: v?.id,
              adTypeId: v?.adTypeId || adTypeId,
              variantNumber: v?.variantNumber,
              source: v?.source,
            });
          });
        });
        if (allVariants.length) {
          const lang = landingPageData?.language || landingPageData?.lang;
          const resp = await AiService.generateAdsCopy({ lpId, variants: allVariants, language: lang });
          const filled = resp?.data?.data?.variants || [];
          const filledById = new Map(filled.map((v) => [String(v?.id || ""), v]));
          // Merge AI copy into creatives
          Object.keys(freshCreatives || {}).forEach((adTypeId) => {
            const group = freshCreatives?.[adTypeId];
            if (!group?.variants) return;
            group.variants = group.variants.map((v) => {
              const ai = filledById.get(String(v?.id || ""));
              if (!ai) return v;
              return {
                ...v,
                title: ai.title ?? v.title,
                description: ai.description ?? v.description,
                linkDescription: ai.linkDescription ?? v.linkDescription,
                callToAction: ai.callToAction ?? v.callToAction,
              };
            });
          });
        }
      } catch (aiErr) {
        console.warn("AI copy generation for ad set failed, using defaults:", aiErr);
      }

      // Pass creatives to backend to store on ad set
      const response = await AdsService.createAdSet(lpId, freshCreatives);
      const { adSet, metaCampaignId } = response?.data?.data || {};
      if (!adSet?.id) {
        throw new Error("Failed to create ad set");
      }
      // Update local state with the new ad set (which now has creatives)
      const nextData = {
        ...(adsData || {}),
        _adSets: [...(Array.isArray(adsData?._adSets) ? adsData._adSets : []), adSet],
        _publish: {
          ...(adsData?._publish || {}),
          campaignId: metaCampaignId,
        },
      };
      setAdsData(nextData);
      lastSavedAdsHashRef.current = serializeAdsData(nextData);
      message.destroy("create-adset");
      message.success("Ad set created with fresh creatives!");
      // Refresh launch summary so the table updates immediately
      await loadLaunchSummary();
      // Immediately open the newly created ad set so the user lands in the editor flow.
      setActiveAdSetId(adSet.id);
    } catch (e) {
      message.destroy("create-adset");
      const errorMsg = e?.response?.data?.message || "Failed to create ad set";
      // Check if it's a Meta credentials error
      if (errorMsg.toLowerCase().includes("meta") &&
        (errorMsg.toLowerCase().includes("credential") ||
          errorMsg.toLowerCase().includes("configured") ||
          errorMsg.toLowerCase().includes("missing"))) {
        setMetaConfigModalOpen(true);
      } else {
        message.error(errorMsg);
      }
    } finally {
      setCreatingAdSet(false);
      setGenerating(false);
    }
  };

  const runAdSetAction = async (adSetId, action, payload) => {
    if (!adSetId) return;
    try {
      setAdSetActionLoading({ id: adSetId, action });
      await AdsLaunchService.updateAdSet(lpId, { id: adSetId, ...payload });
      message.success(
        action === "delete"
          ? "Ad set deleted"
          : action === "pause"
            ? "Ad set paused"
            : "Ad set resumed"
      );
      await loadLaunchSummary();
    } catch (e) {
      message.error(e?.response?.data?.message || "Failed to update ad set");
    } finally {
      setAdSetActionLoading({ id: null, action: null });
    }
  };

  const pauseAdSet = (adSetId) => runAdSetAction(adSetId, "pause", { status: "PAUSED" });
  const resumeAdSet = (adSetId) => runAdSetAction(adSetId, "resume", { status: "ACTIVE" });
  const deleteAdSet = (adSetId) => {
    Modal.confirm({
      title: "Delete ad set",
      content:
        "This will delete the ad set in Meta as well. This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: () => runAdSetAction(adSetId, "delete", { status: "DELETED" }),
    });
  };

  const deleteHireLabAdSet = async (adSetId) => {
    if (!adSetId) return;
    Modal.confirm({
      title: "Delete ad set",
      content: "This will remove the ad set from HireLab. (Not yet launched to Meta.)",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          const nextData = {
            ...(adsData || {}),
            _adSets: (Array.isArray(adsData?._adSets) ? adsData._adSets : []).filter(
              (s) => s.id !== adSetId
            ),
          };
          setAdsData(nextData);
          await AdsService.saveAds(lpId, nextData);
          lastSavedAdsHashRef.current = serializeAdsData(nextData);
          message.success("Ad set deleted");
          // Refresh launch summary so the table updates
          await loadLaunchSummary();
        } catch (e) {
          message.error("Failed to delete ad set");
        }
      },
    });
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
    return generateVariants(lpData);
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

  const isLikelyVideoUrl = (u) => /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(String(u || ""));
  const cloudinaryVideoToPoster = (url, seconds = 0) => {
    const u = String(url || "");
    if (!u.includes("res.cloudinary.com") || !u.includes("/video/upload/")) return "";
    const sec = Number.isFinite(seconds) ? seconds : 0;
    const withTransform = u.replace("/video/upload/", `/video/upload/so_${sec}/`);
    return withTransform.replace(/\.(mp4|mov|webm|mkv)(\?.*)?$/i, ".jpg$2");
  };

  // Append a short status line to the Approve & Prepare activity log
  const appendPrepareMessage = useCallback((msg) => {
    setPrepareMessages((prev) => {
      const next = [...prev, msg];
      return next.length > 6 ? next.slice(next.length - 6) : next;
    });
  }, []);

  // Wait until preview has content (and optionally matches expected aspect ratio)
  const waitForPreviewRender = async (timeoutMs = 3000, expectedFormat = null) => {
    const start = Date.now();
    let lastNodeInfo = null;
    
    while (Date.now() - start < timeoutMs) {
      const node = captureRef.current;
      if (node && node.childNodes && node.childNodes.length > 0 && node.clientWidth > 0 && node.clientHeight > 0) {
        const actualW = node.clientWidth;
        const actualH = node.clientHeight;
        lastNodeInfo = { actualW, actualH };
        
        // If expected format provided, verify dimensions match (not just aspect ratio)
        if (expectedFormat?.width && expectedFormat?.height) {
          // Check if the actual dimensions match the expected format
          // The ref div should have explicit width/height style matching the format
          const widthMatch = Math.abs(actualW - expectedFormat.width) < 10; // 10px tolerance
          const heightMatch = Math.abs(actualH - expectedFormat.height) < 10;
          
          if (widthMatch && heightMatch) {
            console.log(`[waitForPreviewRender] Format ${expectedFormat.id} ready: ${actualW}x${actualH}`);
            return true;
          }
          // Wrong dimensions - keep waiting for React to re-render
        } else {
          return true;
        }
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 100));
    }
    
    // Timeout - DO NOT proceed if we expected a specific format but got wrong dimensions
    if (expectedFormat && lastNodeInfo) {
      const expected = `${expectedFormat.width}x${expectedFormat.height}`;
      const actual = `${lastNodeInfo.actualW}x${lastNodeInfo.actualH}`;
      console.error(`[waitForPreviewRender] TIMEOUT: Expected ${expectedFormat.id} (${expected}) but got ${actual}. NOT capturing.`);
      return false; // Signal to caller not to capture
    }
    console.warn("[waitForPreviewRender] Timeout with no node info");
    return false;
  };

  // Render the current preview node to Cloudinary and return URL
  const renderCurrentPreviewToCloudinary = async (format) => {
    const node = captureRef.current;
    if (!node) throw new Error("Preview not mounted");

    // Let templates know we're rendering for export (html-to-image can't reliably capture <video>).
    // Templates should render static poster images in this mode.
    try {
      window.__HL_ADS_CAPTURE__ = true;
    } catch {
      // ignore
    }
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
    try {
      window.__HL_ADS_CAPTURE__ = false;
    } catch {
      // ignore
    }
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
      // Meta requires ad sets to have a non-zero daily budget.
      // Prefer the saved Launch settings; backend also enforces a safe minimum if omitted.
      const launchBudgetMajor = Number(launchSummary?.launchSettings?.budgetDaily);
      const budgetMinor =
        Number.isFinite(launchBudgetMajor) && launchBudgetMajor > 0
          ? Math.floor(launchBudgetMajor * 100)
          : 0;
      const body = { adIds: ids, budget: budgetMinor, reuseCampaign, reuseAdSet };
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

  // Get current variants for selected ad type
  // When viewing an ad set, use its own creatives instead of campaign-level
  const currentVariants = useMemo(() => {
    // Find the active ad set if one is selected
    const activeSet = activeAdSetId
      ? (Array.isArray(adsData?._adSets) ? adsData._adSets : []).find((s) => s.id === activeAdSetId)
      : null;

    // If ad set has its own creatives, use those
    if (activeSet?.creatives?.[selectedAdType]?.variants) {
      return activeSet.creatives[selectedAdType].variants;
    }

    // Otherwise fall back to campaign-level creatives
    return adsData?.[selectedAdType]?.variants || [];
  }, [adsData, selectedAdType, activeAdSetId]);

  const hasAnyVariants = useMemo(() => {
    try {
      // Check ad set creatives if viewing an ad set
      const activeSet = activeAdSetId
        ? (Array.isArray(adsData?._adSets) ? adsData._adSets : []).find((s) => s.id === activeAdSetId)
        : null;

      if (activeSet?.creatives) {
        return Object.keys(activeSet.creatives || {}).some((k) =>
          (activeSet.creatives?.[k]?.variants || []).length > 0
        );
      }

      return Object.keys(adsData || {}).some((k) => (adsData?.[k]?.variants || []).length > 0);
    } catch {
      return false;
    }
  }, [adsData, activeAdSetId]);

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

  const hasApprovedCreatives = useMemo(() => {
    try {
      return Object.keys(adsData || {}).some((adType) =>
        (adsData?.[adType]?.variants || []).some((v) => v?.approved)
      );
    } catch {
      return false;
    }
  }, [adsData]);

  const adSetsList = useMemo(() => {
    // Primary source: launchSummary.editorAds._adSets (contains backend-cleaned data)
    // Secondary source: adsData._adSets (contains newly created ad sets that may not be in launchSummary yet)
    const editorAdSets = Array.isArray(launchSummary?.editorAds?._adSets)
      ? launchSummary.editorAds._adSets : [];
    const localAdSets = Array.isArray(adsData?._adSets) ? adsData._adSets : [];
    const metaSets = Array.isArray(launchSummary?.adSets) ? launchSummary.adSets : [];
    
    // Check if localAdSets has been initialized (adsData._adSets exists, even if empty)
    // If initialized, localAdSets is the source of truth for which ad sets exist
    const localAdSetsInitialized = adsData?._adSets !== undefined;

    // Create a map of Meta ad sets by ID for quick lookup
    const metaSetMap = new Map();
    metaSets.forEach((set) => {
      const id = set.id || set.adset_id;
      if (id) metaSetMap.set(id, set);
    });

    // Merge both sources: prioritize localAdSets (adsData) over editorAdSets (launchSummary)
    // because adsData contains the most recent local changes (e.g., state set to "ready" after approval)
    // while launchSummary may be stale until refetched.
    const localMap = new Map(localAdSets.map((s) => [s.id, s]));
    const mergedAdSets = [
      // For ad sets that exist in both, prefer the localAdSets version (most recent local state)
      // If localAdSets has been initialized, only include editorAdSets items that also exist in localAdSets
      // (this handles the deletion case where an ad set was removed from localAdSets)
      ...editorAdSets
        .filter((s) => !localAdSetsInitialized || localMap.has(s.id))
        .map((s) => {
          const local = localMap.get(s.id);
          if (local) {
            // Merge: use local state but keep other fields from editor if not in local
            return { ...s, ...local };
          }
          return s;
        }),
      // Add any ad sets that are ONLY in localAdSets (newly created, not yet in launchSummary)
      ...localAdSets.filter((s) => !editorAdSets.some((e) => e.id === s.id)),
    ];

    // Track which Meta ad set IDs are covered by HireLab ad sets
    const coveredMetaIds = new Set();

    // Filter out HireLab ad sets whose Meta ad set was deleted (client-side cleanup)
    // Keep ad sets that: 1) don't have a metaAdSetId yet, or 2) have a metaAdSetId that still exists on Meta
    // Only apply filter if we have Meta data loaded (metaSetMap not empty)
    const validLocalSets = metaSetMap.size > 0
      ? mergedAdSets.filter((s) => {
        if (!s.metaAdSetId) return true; // Not yet synced to Meta
        return metaSetMap.has(s.metaAdSetId); // Meta ad set still exists
      })
      : mergedAdSets;

    // Map HireLab ad sets, enriching with Meta data if available
    const mappedLocal = validLocalSets.map((s) => {
      const metaAdSetId = s.metaAdSetId || null;
      const metaSet = metaAdSetId ? metaSetMap.get(metaAdSetId) : null;

      if (metaAdSetId) coveredMetaIds.add(metaAdSetId);

      // Get budget/schedule from launchSettings or Meta
      const ls = s.launchSettings || {};
      const budget = ls.budgetDaily != null ? Number(ls.budgetDaily) :
        (metaSet?.daily_budget ? Number(metaSet.daily_budget) / 100 : null);
      const start = ls.scheduleStart || metaSet?.start_time || null;
      const end = ls.scheduleEnd || metaSet?.end_time || null;

      return {
        id: s.id,
        // Always prefer Meta name (correct format like "19.12.25 | Barista at Starbucks | LON-AMS")
        name: metaSet?.name || s.name || "Ad set",
        budget,
        start,
        end,
        state: s.state || "draft",
        source: "hirelab",
        metaAdSetId,
        rawStatus: metaSet?.status || null,
        effectiveStatus: metaSet?.effective_status || null,
      };
    });

    // Only include Meta ad sets that DON'T have a corresponding HireLab ad set
    // (i.e., ad sets created directly in Meta or from previous system)
    const mappedMeta = metaSets
      .filter((set) => !coveredMetaIds.has(set.id || set.adset_id))
      .map((set, idx) => ({
        id: set.id || set.adset_id || `meta-${idx}`,
        name: set.name || "Ad set",
        budget: set.daily_budget ? Number(set.daily_budget) / 100 : null,
        start: set.start_time || null,
        end: set.end_time || null,
        rawStatus: set.status || null,
        effectiveStatus: set.effective_status || null,
        state: "launched",
        source: "meta",
      }));

    return [...mappedLocal, ...mappedMeta];
  }, [adsData, launchSummary]);

  const activeAdSet = useMemo(
    () => adSetsList.find((a) => a.id === activeAdSetId) || null,
    [adSetsList, activeAdSetId]
  );

  const activeAdSetState = activeAdSet?.state || "draft";

  useEffect(() => {
    if (activeAdSetId && !activeAdSet) {
      setActiveAdSetId(null);
    }
  }, [activeAdSetId, activeAdSet]);

  // If user opens an ad set that is "ready" (creatives approved but not launched yet),
  // we always send them to the per-ad-set Launch page (no intermediate "open launch settings" view).
  useEffect(() => {
    if (!activeAdSetId) return;
    if (activeAdSetState !== "ready") return;
    router.push(`/launch/${lpId}?adset=${encodeURIComponent(activeAdSetId)}`);
  }, [activeAdSetId, activeAdSetState, lpId, router]);

  // Support deep-linking back from Launch (e.g. /lp-editor/:lpId/ads?adset=XYZ)
  useEffect(() => {
    if (!router?.isReady) return;
    const q = router.query?.adset;
    const id = q ? (Array.isArray(q) ? q[0] : q) : null;
    // Sync URL to state - but only if URL has an adset param
    // (if URL has no adset, we don't force activeAdSetId to null - that's handled by goBackToAdSets)
    if (id && activeAdSetId !== id) {
      setActiveAdSetId(id);
    }
  }, [router?.isReady, router.query?.adset, activeAdSetId]);

  // Helper to go back to ad sets table (clears activeAdSetId AND updates URL)
  const goBackToAdSets = () => {
    setActiveAdSetId(null);
    // Remove ?adset from URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.delete("adset");
    window.history.replaceState({}, "", url.pathname + url.search);
  };

  // Helper to update variants in the correct location (campaign-level or ad set-level)
  const updateVariantsInData = useCallback((updatedVariants, adType = selectedAdType) => {
    if (activeAdSetId) {
      // Update ad set's creatives
      const adSets = Array.isArray(adsData?._adSets) ? [...adsData._adSets] : [];
      const setIdx = adSets.findIndex((s) => s.id === activeAdSetId);
      if (setIdx >= 0 && adSets[setIdx]?.creatives) {
        adSets[setIdx] = {
          ...adSets[setIdx],
          creatives: {
            ...adSets[setIdx].creatives,
            [adType]: {
              ...adSets[setIdx].creatives[adType],
              variants: updatedVariants,
            },
          },
        };
        return { ...adsData, _adSets: adSets };
      }
    }
    // Fall back to campaign-level
    return {
      ...adsData,
      [adType]: {
        ...adsData[adType],
        variants: updatedVariants,
      },
    };
  }, [adsData, activeAdSetId, selectedAdType]);

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

    setAdsData(updateVariantsInData(updatedVariants));
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
      onOk: async () => {
        const updatedVariants = currentVariants.filter(v => v.id !== variantId);
        const nextData = updateVariantsInData(updatedVariants);
        setAdsData(nextData);
        
        // Save to backend
        try {
          await AdsService.saveAds(lpId, nextData);
          lastSavedAdsHashRef.current = serializeAdsData(nextData);
          message.success("Variant deleted");
        } catch (err) {
          console.error("Failed to save after delete:", err);
          message.error("Variant deleted locally but failed to save to server");
        }
      },
    });
  };

  // Handle variant replace (open library)
  const handleVariantReplace = (variantId) => {
    setSelectedVariant(variantId);
    setMediaPickerVariantId(variantId);
    setMediaPickerOpen(true);
  };

  // Render preview to blob (for download - similar to renderCurrentPreviewToCloudinary but returns blob)
  const renderPreviewToBlob = async (format) => {
    const node = captureRef.current;
    if (!node) throw new Error("Preview not mounted");

    try {
      window.__HL_ADS_CAPTURE__ = true;
    } catch {
      // ignore
    }

    const blob = await toBlob(node, {
      width: format?.width,
      height: format?.height,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#ffffff",
      skipFonts: true,
      imagePlaceholder: TRANSPARENT_PNG,
      fetchRequestInit: {
        mode: "cors",
        credentials: "omit",
      },
    });

    try {
      window.__HL_ADS_CAPTURE__ = false;
    } catch {
      // ignore
    }

    if (!blob) throw new Error("Failed to render preview");
    return blob;
  };

  // Handle variant download - renders the full creative preview (same as approval flow)
  const handleVariantDownload = async (variant) => {
    if (!variant) return;

    try {
      message.loading({ content: "Rendering creative...", key: "download" });

      // Get current format
      const format = AD_FORMATS.find((f) => f.id === selectedFormat);

      // Ensure the variant is selected and showing in preview
      // The variant is from the current ad type, so selectedAdType should already be correct
      setSelectedVariant(variant.id);

      // Wait for preview to render (same timeout as approval flow)
      await waitForPreviewRender(4000);

      // Render to blob
      const blob = await renderPreviewToBlob(format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename from variant title and format
      const safeName = (variant.title || "creative")
        .replace(/[^a-z0-9]/gi, "_")
        .substring(0, 40);
      const formatName = format?.id || "ad";
      link.download = `${safeName}_${formatName}_${Date.now()}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: "Downloaded!", key: "download" });
    } catch (error) {
      console.error("Download failed:", error);
      message.error({ content: "Download failed: " + error.message, key: "download" });
      try {
        window.__HL_ADS_CAPTURE__ = false;
      } catch {
        // ignore
      }
    }
  };

  // Add Creative: opens template picker so user can choose a fresh variant template
  const handleAddVariant = () => {
    if (!adsData) return;
    setVariantPickerOpen(true);
  };

  // Handle selection from variant picker modal
  const handleVariantPickerSelect = (newCreative) => {
    if (!adsData || !newCreative) return;

    // If we're changing template for an existing variant
    if (templateChangeVariant) {
      const updatedVariants = currentVariants.map((v) => {
        if (v.id === templateChangeVariant.id) {
          // Keep existing content but update template/variantNumber
          return {
            ...v,
            variantNumber: newCreative.variantNumber,
            template: newCreative.template,
            mediaType: newCreative.mediaType,
          };
        }
        return v;
      });
      const nextData = updateVariantsInData(updatedVariants);
      setAdsData(nextData);
      setTemplateChangeVariant(null);
      message.success("Template changed");
      return;
    }

    // Otherwise, add as new creative
    const updatedVariants = [
      ...currentVariants.map((v) => ({ ...v, selected: false })),
      newCreative,
    ];
    const nextData = updateVariantsInData(updatedVariants);
    setAdsData(nextData);
    setSelectedVariant(newCreative.id);
    setEditingVariant(newCreative); // Open editor immediately for the new creative
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

  const approveCreativesForAdSet = async (adSetId) => {
    if (!adsData) return;
    if (!adSetId) return;
    try {
      setPrepareMessages(["Starting: approving creatives & generating images..."]);
      setPreparingLaunch(true);

      const updatedAds = { ...(adsData || {}) };

      // Find the ad set and determine which creatives to use
      const adSets = Array.isArray(updatedAds._adSets) ? [...updatedAds._adSets] : [];
      const adSetIdx = adSets.findIndex((s) => s.id === adSetId);
      const adSet = adSetIdx >= 0 ? adSets[adSetIdx] : null;

      // Use ad set-specific creatives if available, otherwise campaign-level
      const creativesSource = adSet?.creatives || updatedAds;

      // Mark variants approved + collect them for image rendering
      const variantsToPrepare = [];
      Object.keys(creativesSource).forEach((adType) => {
        if (adType.startsWith('_')) return; // Skip meta fields like _adSets, _publish
        const group = creativesSource[adType];
        if (!group?.variants || !Array.isArray(group.variants)) return;
        group.variants = group.variants.map((v) => {
          const approvedVariant = { ...v, approved: true };
          variantsToPrepare.push({ ...approvedVariant, adTypeId: adType });
          return approvedVariant;
        });
      });

      // Update the creatives source back to ad set if applicable
      if (adSet?.creatives && adSetIdx >= 0) {
        adSets[adSetIdx] = { ...adSets[adSetIdx], creatives: creativesSource };
        updatedAds._adSets = adSets;
      }

      if (variantsToPrepare.length === 0) {
        message.warning("No creatives found to approve");
        return;
      }

      setAdsData(updatedAds);

      // Render each approved variant for ALL formats (story, square, portrait)
      // Each format gets its own image stored in publishImages object
      const totalSteps = variantsToPrepare.length * AD_FORMATS.length;
      let currentStep = 0;
      
      for (let index = 0; index < variantsToPrepare.length; index += 1) {
        const v = variantsToPrepare[index];
        const stepLabel = `${v.adTypeId} · ${v.title || v.id}`;
        
        setSelectedAdType(v.adTypeId);
        setSelectedVariant(v.id);
        
        // Initialize publishImages object for this variant
        const publishImages = {};
        
        // Render each format for this variant
        for (const format of AD_FORMATS) {
          currentStep += 1;
          appendPrepareMessage(`Preparing ${currentStep}/${totalSteps}: ${stepLabel} (${format.label})`);
          
          // Switch to this format
          setSelectedFormat(format.id);
          
          // IMPORTANT: Wait for React to process the format change before rendering.
          // This needs to be long enough for:
          // 1. React to schedule and apply the state update
          // 2. The AdPreview component to re-render with new format dimensions
          // 3. Any lazy-loaded template to load and render
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 1200));
          
          // Now wait for the preview to be fully rendered with correct dimensions
          // eslint-disable-next-line no-await-in-loop
          const formatReady = await waitForPreviewRender(8000, format);
          
          if (!formatReady) {
            // Format dimensions don't match - try once more with extra delay
            appendPrepareMessage(`⚠ ${format.label} dimensions not ready, retrying...`);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 2000));
            // eslint-disable-next-line no-await-in-loop
            const retryReady = await waitForPreviewRender(5000, format);
            if (!retryReady) {
              appendPrepareMessage(`❌ ${format.label} failed for ${stepLabel} - skipping`);
              console.error(`[approveCreatives] Format ${format.id} failed to render correctly for variant ${v.id}`);
              // Continue to next format instead of failing entirely
              // eslint-disable-next-line no-continue
              continue;
            }
          }
          
          // Additional small delay to ensure all paint operations are complete
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 400));
          
          // eslint-disable-next-line no-await-in-loop
          const url = await renderCurrentPreviewToCloudinary(format);
          
          publishImages[format.id] = url;
          appendPrepareMessage(`✓ ${format.label} ready for ${stepLabel}`);
        }
        
        // Update in the correct creatives source (ad set or campaign level)
        const group = creativesSource[v.adTypeId];
        if (group?.variants) {
          const idx = group.variants.findIndex((x) => x.id === v.id);
          if (idx >= 0) {
            group.variants[idx] = { 
              ...group.variants[idx], 
              publishImages,
              // Keep publishImage for backwards compatibility (use square as default)
              publishImage: publishImages.square || publishImages.story || publishImages.portrait,
            };
          }
        }
      }

      // Make sure ad set creatives are updated in the main data object
      if (adSet?.creatives && adSetIdx >= 0) {
        const finalAdSets = Array.isArray(updatedAds._adSets) ? [...updatedAds._adSets] : [];
        finalAdSets[adSetIdx] = { ...finalAdSets[adSetIdx], creatives: creativesSource };
        updatedAds._adSets = finalAdSets;
      }

      // Update ad set state to "ready" and persist
      const localSets = Array.isArray(updatedAds?._adSets) ? [...updatedAds._adSets] : [];
      const setIdx = localSets.findIndex((s) => s.id === adSetId);
      if (setIdx >= 0) {
        localSets[setIdx] = {
          ...localSets[setIdx],
          state: "ready",
          approvedAt: new Date().toISOString(),
          approvedFormat: selectedFormat,
          approvedVariantIds: variantsToPrepare.map((v) => v.id),
        };
      }
      updatedAds._adSets = localSets;

      appendPrepareMessage("Saving approved creatives...");
      await AdsService.saveAds(lpId, updatedAds);
      lastSavedAdsHashRef.current = serializeAdsData(updatedAds);
      setAdsData(updatedAds);

      // Create ads on Meta (PAUSED) - this ensures they exist under the ad set
      appendPrepareMessage("Creating ads on Meta (paused)...");
      try {
        // Get ad set's launch settings for budget/schedule
        const adSetRecord = localSets.find((s) => s.id === adSetId);
        const ls = adSetRecord?.launchSettings || {};

        await AdsService.publish(lpId, {
          hirelabAdSetId: adSetId,
          budget: (ls.budgetDaily || 5) * 100, // Convert to minor units
          start_time: ls.scheduleStart || null,
          end_time: ls.scheduleEnd || null,
          placements: ["facebook_feed", "instagram_story"],
          audienceLocations: ls.audienceLocations || [],
          launch: false, // Keep PAUSED - don't activate yet
        });
        appendPrepareMessage("✓ Ads created on Meta (paused)");
      } catch (publishErr) {
        console.error("Error creating ads on Meta:", publishErr);
        appendPrepareMessage(`⚠ Warning: Ads not created on Meta: ${publishErr?.response?.data?.message || publishErr?.message || "Unknown error"}`);
        // Don't throw - still allow user to proceed to launch page
      }

      setPreparedOnce(true);
      setPreparedVariants(variantsToPrepare);
      // Don't open modal - we're navigating away immediately
      message.success("Creatives approved! Redirecting to launch settings...");

      // Route user to Launch settings for this specific ad set
      // Use window.location for reliable navigation (router.push can fail with pending state updates)
      window.location.href = `/launch/${lpId}?adset=${encodeURIComponent(adSetId)}`;
    } catch (err) {
      console.error("Error approving creatives", err);
      message.error("Failed to approve creatives");
      appendPrepareMessage("Error: something went wrong while approving creatives.");
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

  const renderStatusBadge = (state) => {
    const styles = {
      draft: "bg-amber-50 text-amber-800 border-amber-200",
      ready: "bg-blue-50 text-blue-700 border-blue-200",
      launched: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const label =
      state === "launched"
        ? "Launched"
        : state === "ready"
          ? "Creatives approved"
          : "Creatives needed";
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full border font-semibold ${styles[state] || styles.draft}`}
      >
        {label}
      </span>
    );
  };

  const renderAdSetsTable = () => (
    <div className="bg-white border border-[#eaecf0] rounded-xl h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
        <div>
          <h2 className="text-xl font-semibold text-[#101828]">Ad Sets</h2>
          <div className="text-sm text-[#667085]">
            Overview of campaign ad sets and their states.
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {launchSummaryLoading && (
            <span className="text-xs text-[#667085]">Refreshing…</span>
          )}
          <button
            onClick={handleCreateAdSet}
            disabled={creatingAdSet}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md flex items-center gap-2 ${creatingAdSet
              ? "bg-[#5207CD]/70 cursor-not-allowed"
              : "bg-[#5207CD] hover:bg-[#4506A6]"
              }`}
          >
            {creatingAdSet && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {creatingAdSet ? "Creating..." : "Create ad set"}
          </button>
        </div>
      </div>
      {!landingPageData?.metaPixelId && (
        <div className="px-6 py-4 border-b border-[#eaecf0] bg-amber-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-amber-900">
                Meta Pixel ID required
              </div>
              <div className="text-xs text-amber-800 mt-1">
                Add your Meta Pixel ID before creating ad sets so we can optimize for conversions
                (hirelab.FormSubmitted).
              </div>
            </div>
            <button
              onClick={() => setAdsSettingsDrawerOpen(true)}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
            >
              Add Pixel ID
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eaecf0]">
          <thead className="bg-[#f8f8f8]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#475467] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#475467] uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#475467] uppercase tracking-wider">
                Daily budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#475467] uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#475467] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f2f4f7]">
            {adSetsList.map((set) => (
              <tr key={set.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setActiveAdSetId(set.id)}
                    className="text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="text-sm font-semibold text-[#101828] hover:text-[#5207CD]">{set.name}</div>
                    <div className="text-xs text-[#667085]">
                      {set.source === "meta" ? "Synced from Meta" : "HireLab"}
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(set.state)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                  {set.budget != null ? `€${Number(set.budget).toFixed(2)}` : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                  {set.start
                    ? `${new Date(set.start).toLocaleDateString()} - ${set.end ? new Date(set.end).toLocaleDateString() : "Ongoing"
                    }`
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Dropdown
                    menu={{
                      items: (() => {
                        // Show Meta controls if it's a Meta ad set OR a HireLab ad set synced to Meta
                        const isMeta = (set.source === "meta" && !!set.id) || (set.source === "hirelab" && !!set.metaAdSetId);
                        const isHireLab = set.source === "hirelab" && !!set.id;
                        // Meta effective_status can be "CAMPAIGN_PAUSED", "ADSET_PAUSED", etc.
                        // For pause/resume controls we must use the raw ad set status,
                        // otherwise the UI can get stuck showing only "Resume".
                        const raw = String(set.rawStatus || "").toUpperCase();
                        const isRawActive = raw === "ACTIVE";
                        const isRawPaused = raw === "PAUSED";
                        const isBusy =
                          adSetActionLoading.id === set.id && !!adSetActionLoading.action;
                        // Use Meta ad set ID for API calls (for HireLab ad sets synced to Meta)
                        const metaId = set.metaAdSetId || set.id;
                        const pauseItem = {
                          key: "pause",
                          label: "Pause ad set",
                          disabled: !isMeta || !isRawActive || isBusy,
                          onClick: () => pauseAdSet(metaId),
                        };
                        const resumeItem = {
                          key: "resume",
                          label: "Resume ad set",
                          disabled: !isMeta || !isRawPaused || isBusy,
                          onClick: () => resumeAdSet(metaId),
                        };
                        const deleteItem = {
                          key: "delete",
                          label: "Delete ad set",
                          danger: true,
                          disabled: !isMeta || isBusy,
                          onClick: () => deleteAdSet(metaId),
                        };
                        const deleteLocalItem = {
                          key: "delete_local",
                          label: "Delete ad set",
                          danger: true,
                          disabled: !isHireLab,
                          onClick: () => deleteHireLabAdSet(set.id),
                        };
                        // Show "Open creatives editor" for draft state, "Open ad launcher" for ready/launched
                        const openLauncherItem = set.state === "draft" || set.state === "creatives_needed"
                          ? {
                              key: "open_creatives",
                              label: "Open creatives editor",
                              onClick: () => {
                                setActiveAdSetId(set.id);
                              },
                            }
                          : {
                              key: "open_launcher",
                              label: "Open ad launcher",
                              onClick: () => {
                                router.push(`/launch/${lpId}?adset=${encodeURIComponent(set.id)}`);
                              },
                            };
                        const openResultsItem = {
                          key: "open_results",
                          label: "Open ad results",
                          onClick: () => {
                            setActiveAdSetId(set.id);
                          },
                        };
                        return [
                          openLauncherItem,
                          openResultsItem,
                          ...(isMeta ? [pauseItem, resumeItem, deleteItem] : []),
                          // Only show local delete for HireLab ad sets NOT synced to Meta
                          ...(isHireLab && !set.metaAdSetId ? [deleteLocalItem] : []),
                        ];
                      })(),
                    }}
                    trigger={["click"]}
                  >
                    <button className="px-3 py-1.5 text-sm font-semibold text-[#475467] border rounded-md hover:bg-[#f8f8f8]">
                      Actions <DownOutlined className="align-middle text-[10px]" />
                    </button>
                  </Dropdown>
                </td>
              </tr>
            ))}
            {!adSetsList.length && (
              <tr>
                <td className="px-6 py-6 text-sm text-[#667085]" colSpan={5}>
                  No ad sets yet. Click “Create ad set” to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLaunchReadyView = () => {
    const approvedCount = Object.keys(adsData || {}).reduce((acc, adType) => {
      const group = adsData?.[adType];
      if (!group?.variants) return acc;
      return acc + group.variants.filter((v) => v.approved).length;
    }, 0);
    const totalCount = Object.keys(adsData || {}).reduce((acc, adType) => {
      const group = adsData?.[adType];
      if (!group?.variants) return acc;
      return acc + group.variants.length;
    }, 0);

    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <button
            onClick={goBackToAdSets}
            className="text-sm text-[#5207CD] hover:underline"
          >
            ← Back to ad sets
          </button>
          <div className="text-xs text-[#667085]">
            Redirecting to launch settings…
          </div>
        </div>
        <div className="bg-white border border-[#eaecf0] rounded-xl p-6 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#101828]">Launch prep</h2>
              <div className="text-sm text-[#667085]">
                Review settings before launching this ad set.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8f8f8] rounded-lg border border-[#eceef5]">
              <div className="text-xs text-[#667085] mb-1">Creatives</div>
              <div className="text-lg font-semibold text-[#101828]">
                {approvedCount}/{totalCount || 1} approved
              </div>
              <div className="text-xs text-[#667085] mt-1">
                Approved creatives will be used for this ad set.
              </div>
            </div>
            <div className="p-4 bg-[#f8f8f8] rounded-lg border border-[#eceef5]">
              <div className="text-xs text-[#667085] mb-1">Budget</div>
              <div className="text-lg font-semibold text-[#101828]">
                {launchSummary?.launchSettings?.budgetDaily != null
                  ? `€${Number(launchSummary.launchSettings.budgetDaily).toFixed(2)} / day`
                  : "Set in launch"}
              </div>
              <div className="text-xs text-[#667085] mt-1">Daily budget for this ad set.</div>
            </div>
            <div className="p-4 bg-[#f8f8f8] rounded-lg border border-[#eceef5]">
              <div className="text-xs text-[#667085] mb-1">Schedule</div>
              <div className="text-lg font-semibold text-[#101828]">
                {launchSummary?.launchSettings?.scheduleStart
                  ? `${new Date(launchSummary.launchSettings.scheduleStart).toLocaleDateString()} - ${launchSummary.launchSettings.scheduleEnd
                    ? new Date(launchSummary.launchSettings.scheduleEnd).toLocaleDateString()
                    : "Ongoing"
                  }`
                  : "Select dates in launch step"}
              </div>
              <div className="text-xs text-[#667085] mt-1">
                Start and end dates for this ad set.
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#fdfaf6] text-sm text-[#92400e]">
            Need a different setup? Adjust budget, schedule, and audience in the launch step
            before publishing.
          </div>
        </div>
      </div>
    );
  };

  const renderLaunchedView = () => {
    const insight = Array.isArray(launchSummary?.insights)
      ? launchSummary.insights[0]
      : null;
    const metric = (value) => (value === undefined || value === null ? "—" : value);
    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <button
            onClick={goBackToAdSets}
            className="text-sm text-[#5207CD] hover:underline"
          >
            ← Back to ad sets
          </button>
          <div className="text-xs text-[#667085]">Live performance for this ad set.</div>
        </div>
        <div className="bg-white border border-[#eaecf0] rounded-xl p-6 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#101828]">Ad set overview</h2>
            <div className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Running
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#f9fafb]">
              <div className="text-xs text-[#667085]">Impressions</div>
              <div className="text-xl font-semibold text-[#101828]">
                {metric(insight?.impressions)}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#f9fafb]">
              <div className="text-xs text-[#667085]">Clicks</div>
              <div className="text-xl font-semibold text-[#101828]">
                {metric(insight?.clicks || insight?.inline_link_clicks)}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#f9fafb]">
              <div className="text-xs text-[#667085]">Spend</div>
              <div className="text-xl font-semibold text-[#101828]">
                {insight?.spend ? `€${Number(insight.spend).toFixed(2)}` : "—"}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[#eaecf0] bg-[#f8f8f8] text-sm text-[#475467]">
            Performance data updates as Meta reports back. Use the ad set Actions menu to pause or
            resume.
          </div>
        </div>
      </div>
    );
  };

  const renderDraftView = () => {
    if (isEmpty || !hasAnyVariants) {
      return (
        <div className="flex flex-col gap-4 h-full">
          <button
            onClick={goBackToAdSets}
            className="self-start text-sm text-[#5207CD] hover:underline"
          >
            ← Back to ad sets
          </button>
          <div className="flex-1 bg-white border border-[#eaecf0] rounded-xl flex flex-col">
            <div className="p-6 border-b border-[#eaecf0]">
              <h2 className="text-xl font-semibold text-[#101828]">Prepare creatives</h2>
              <div className="text-sm text-[#667085]">
                Generate and approve creatives for this ad set.
              </div>
            </div>
            <div className="flex-1">
              <EmptyState onGenerate={handleGenerateAds} loading={generating} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBackToAdSets}
            className="text-sm text-[#5207CD] hover:underline"
          >
            ← Back to ad sets
          </button>
          <button
            onClick={() => approveCreativesForAdSet(activeAdSetId)}
            disabled={preparingLaunch}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${preparingLaunch ? "bg-emerald-300 cursor-not-allowed" : "bg-[#16A34A] hover:bg-[#15803D]"
              }`}
            title="Approves creatives and generates final images. Next you’ll configure launch settings."
          >
            {preparingLaunch ? "Approving…" : "Approve creatives"}
          </button>
        </div>
        <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-4 flex items-center justify-between">
          <div className="text-xs text-emerald-900">
            <span className="font-semibold">Next step:</span> Click{" "}
            <span className="font-semibold">“Approve creatives”</span> to freeze the creatives and generate final images.
          </div>
          {hasUnsavedAdsChanges && (
            <div className="text-[11px] text-emerald-800">
              Your latest edits will be saved automatically during approval.
            </div>
          )}
        </div>
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
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedAdType === adType.id
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
          <div className="w-[600px] bg-white border-r border-[#eceef5] flex flex-col h-full">
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
                      const nextData = updateVariantsInData(updatedVariants);
                      setAdsData(nextData);
                      try {
                        await AdsService.saveAds(lpId, nextData);
                        lastSavedAdsHashRef.current = serializeAdsData(nextData);
                        message.success("Variant saved");
                      } catch {
                        message.error("Failed to save variant");
                      }
                    }}
                    onDraftChange={(draftVariant) => {
                      // Local-only update for realtime preview. Persist happens on explicit save.
                      const updatedVariants = currentVariants.map((v) =>
                        v.id === draftVariant.id ? { ...v, ...draftVariant } : v
                      );
                      setAdsData(updateVariantsInData(updatedVariants));
                    }}
                    onDelete={() => handleVariantDelete(variant.id)}
                    onDownload={() => handleVariantDownload(variant)}
                    onReplace={() => handleVariantReplace(variant.id)}
                    onChangeTemplate={(v) => {
                      setTemplateChangeVariant(v);
                      setVariantPickerOpen(true);
                    }}
                    landingPageData={landingPageData}
                    mediaType={variant.mediaType || getVariantMediaType(variant.adTypeId || selectedAdType, variant.variantNumber)}
                  />
                ))}

                <button
                  onClick={handleAddVariant}
                  className="w-full p-4 border-2 border-dashed border-[#d0d5dd] rounded-xl hover:border-[#5207CD] hover:bg-[#eff8ff] transition-colors flex items-center justify-center gap-2 text-[#475467] hover:text-[#5207CD] font-semibold text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Creative
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
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors border ${isActive
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
                    landingPageData={previewLandingPageData}
                    adType={selectedAdType}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !landingPageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton active />
      </div>
    );
  }

  const renderActiveContent =
    !activeAdSetId
      ? renderAdSetsTable()
      : activeAdSetState === "draft"
        ? renderDraftView()
        : activeAdSetState === "ready"
          ? renderLaunchReadyView()
          : renderLaunchedView();

  return (
    <>
      <ApplyCustomFont landingPageData={{ ...landingPageData, ...userBrandData }} />
      {isDev && (
        <DevBrandControls
          brandData={userBrandData || {}}
          onChange={(next) => setUserBrandData(next)}
          onReset={() => {
            if (!user) return;
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
          }}
        />
      )}

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
            hideSettings={false}
            hideLaunchNav
            onOpenSettings={() => setAdsSettingsDrawerOpen(true)}
            onNavigateAttempt={(targetUrl) => {
              setActiveAdSetId(null);
            }}
            customActions={<>
            </>}

          />
        </div>

        <div className="overflow-hidden flex-1 px-8 py-6">
          {renderActiveContent}
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

      {/* Replace Media Modal (real media library) */}
      <ImageSelectionModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerVariantId(null);
        }}
        type="all"
        accept="image/*,video/*"
        multiple={false}
        existingFiles={[]}
        onImageSelected={(files = []) => {
          const first = files?.[0];
          const url = (typeof first === "string" ? first : (first?.url || first?.secure_url || first?.thumbnail || ""));
          if (!url || !mediaPickerVariantId) {
            setMediaPickerOpen(false);
            setMediaPickerVariantId(null);
            return;
          }
          const updatedVariants = currentVariants.map((v) => {
            if (v.id !== mediaPickerVariantId) return v;
            if (isLikelyVideoUrl(url) || String(url).includes("/video/upload/")) {
              const poster = cloudinaryVideoToPoster(url);
              return { ...v, videoUrl: url, image: poster || v.image || "" };
            }
            return { ...v, image: url, videoUrl: "" };
          });
          const nextData = updateVariantsInData(updatedVariants);
          setAdsData(nextData);
          setMediaPickerOpen(false);
          setMediaPickerVariantId(null);
          message.success("Media replaced");
        }}
      />

      {/* Variant Template Picker Modal */}
      <VariantPickerModal
        visible={variantPickerOpen}
        onClose={() => {
          setVariantPickerOpen(false);
          setTemplateChangeVariant(null);
        }}
        onSelect={handleVariantPickerSelect}
        adTypeId={templateChangeVariant?.adTypeId || selectedAdType}
        formatId={selectedFormat}
        landingPageData={landingPageData}
        isTemplateChange={!!templateChangeVariant}
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
          const nextData = updateVariantsInData(updatedVariants);
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
              className="text-[#5207CD] text-sm hover:underline"
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
        title="Approved creatives"
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
                    <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eff8ff] text-[#5207CD] capitalize">
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
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eff8ff] text-[#5207CD] capitalize">
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

      {/* Meta Configuration Required Modal */}
      <Modal
        open={metaConfigModalOpen}
        onCancel={() => setMetaConfigModalOpen(false)}
        footer={null}
        centered
        width={480}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                fill="#1877F2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Meta Ads
          </h3>
          <p className="text-gray-500 mb-6">
            To create ad campaigns, you need to connect your Meta Business account
            and configure your Ad Account and Page in Integrations.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setMetaConfigModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setMetaConfigModalOpen(false);
                const returnUrl = encodeURIComponent(window.location.href);
                window.location.href = `/dashboard/integrations?returnUrl=${returnUrl}`;
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Integrations
            </button>
          </div>
        </div>
      </Modal>

      {/* Ads Settings Drawer (Meta Pixel and other ads settings) */}
      <Drawer
        open={adsSettingsDrawerOpen}
        onClose={() => setAdsSettingsDrawerOpen(false)}
        width={690}
        title={<span className="text-lg font-semibold text-gray-900">Ads Settings</span>}
        bodyStyle={{ padding: 24 }}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdsSettingsDrawerOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-[#d0d5dd] text-[#344054] hover:bg-gray-50"
              disabled={metaPixelSaving}
            >
              Back
            </button>
            <button
              type="button"
              onClick={saveMetaPixelId}
              className={`px-4 py-2 text-sm font-semibold rounded-md text-white ${metaPixelSaving ? "bg-[#5207CD]/70 cursor-not-allowed" : "bg-[#5207CD] hover:bg-[#4506A6]"
                }`}
              disabled={metaPixelSaving}
            >
              {metaPixelSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        <div className="divide-y divide-gray-200">
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Pixel</h3>
            {!landingPageData?.metaPixelId && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Meta Pixel ID is required before creating ad sets.
              </div>
            )}
            <div className="text-xs text-gray-500 mb-3">
              Used to track and optimize conversions for your ads (hirelab.FormSubmitted).
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Pixel ID (Facebook Pixel)
            </label>
            <Input
              value={metaPixelDraft}
              onChange={(e) => setMetaPixelDraft(e.target.value)}
              placeholder="e.g., 1234567890123456"
              inputMode="numeric"
            />
            <div className="text-xs text-gray-500 mt-2">
              Find this in Meta Ads Manager → Events Manager → Pixels.
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

