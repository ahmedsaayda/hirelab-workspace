import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { Skeleton, message, DatePicker, InputNumber, Select, Switch, Modal, Input, Slider } from "antd";
import { FaFacebook, FaGoogle, FaLinkedin, FaTiktok, FaSnapchat, FaInstagram } from "react-icons/fa";
import { Check, ChevronRight, AlertCircle, TrendingUp, Users, Target, BarChart2, RefreshCw, Calendar, Clock, DollarSign, Zap, MapPin, Search, Plus, X } from "lucide-react";
import AdsLaunchService from "../../services/AdsLaunchService";
import AdsService from "../../services/AdsService";
import MetaService from "../../services/MetaService";
import Header from "../Dashboard/Vacancies/components/components/Header";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { Heading } from "../Dashboard/Vacancies/components/components";
import dayjs from "dayjs";

export default function Launch({ paramsId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceSession, currentWorkspace } = useWorkspace();
  const workspaceId = workspaceSession?.workspaceId || currentWorkspace?._id || null;

  let lpId = paramsId || router.query.lpId;
  let isDemo = router.query.demo === 'true' || searchParams?.get('demo') === 'true';
  // Robustly resolve ad set id from URL (router.query can be empty on first render in Next pages router)
  const adSetKey =
    router.query.adset ||
    router.query.adset_id ||
    searchParams?.get('adset') ||
    searchParams?.get('adset_id') ||
    (typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("adset") ||
        new URLSearchParams(window.location.search).get("adset_id"))
      : null) ||
    null;
  const testId = router.query.test_id || searchParams?.get('test_id');

  // Handle case where query param is attached directly to the ID
  // e.g. /launch/6932...&demo=true or /launch/6932...&test_id=...
  if (typeof lpId === 'string') {
    if (lpId.includes('&demo=true') || lpId.includes('?demo=true')) {
      isDemo = true;
      lpId = lpId.split(/[&?]demo=true/)[0];
    }
    if (lpId.includes('&test_id=')) {
      lpId = lpId.split('&test_id=')[0];
    }
    if (lpId.includes('?test_id=')) {
      lpId = lpId.split('?test_id=')[0];
    }
  }

  const [loading, setLoading] = useState(true);
  const [landingPageData, setLandingPageData] = useState({ vacancyTitle: "" });
  const [summary, setSummary] = useState(null);
  console.log("summary", summary);
  const [datePreset, setDatePreset] = useState("last_7d");
  const [activeStep, setActiveStep] = useState("settings"); // settings | audience | creatives | overview

  // In ad-set mode, we intentionally skip Overview (it’s shown per ad set after launch).
  useEffect(() => {
    if (!adSetKey) return;
    if (activeStep === "overview") {
      setActiveStep("settings");
    }
  }, [adSetKey, activeStep]);

  // No automatic redirect from Launch page
  const [launching, setLaunching] = useState(false);
  const [launchDailyBudget, setLaunchDailyBudget] = useState(null);
  const [optimizationGoal, setOptimizationGoal] = useState("LEADS"); // Always optimize for conversions
  const [pacingPlan, setPacingPlan] = useState(null);
  // Pixel/Dataset selection for conversion optimization
  const [availablePixels, setAvailablePixels] = useState([]);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [pixelsLoading, setPixelsLoading] = useState(false);
  const [scheduleOverride, setScheduleOverride] = useState({ start: null, end: null });
  const [touched, setTouched] = useState({
    budget: false,
    schedule: false,
    audience: false,
    optimization: false,
    pacing: false,
    pixel: false,
  });
  const didInitFromSummaryRef = useRef(false);
  const initKeyRef = useRef("");
  const lastAutoSavePayloadRef = useRef("");
  const hydratingRef = useRef(false);
  // No "sync to Meta" concept: Launch immediately publishes on button click.

  const reload = async () => {
    if (!lpId) return;
    try {
      const params = { date_preset: datePreset };
      if (testId) params.test_id = testId;
      if (adSetKey) params.adset_id = adSetKey;
      const res = await AdsLaunchService.getSummary(lpId, params);
      const next = res?.data?.data || null;
      setSummary(next);
      // If backend resolved a different (valid) ad set id (stale URL case), fix the URL.
      if (adSetKey && next?.resolvedAdSetId && String(next.resolvedAdSetId) !== String(adSetKey)) {
        router.replace(`/launch/${lpId}?adset=${encodeURIComponent(next.resolvedAdSetId)}`);
      }
    } catch (e) {
      message.error("Failed to load campaign summary");
    } finally {
      setLoading(false);
    }
  };


  const [audienceLocations, setAudienceLocations] = useState([]);
  const [audienceKeywords, setAudienceKeywords] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    reload();
  }, [lpId, datePreset, adSetKey]);

  // Fetch available pixels for conversion optimization
  useEffect(() => {
    const fetchPixels = async () => {
      setPixelsLoading(true);
      try {
        const resp = await MetaService.listPixels(workspaceId);
        const pixels = resp?.data?.data?.pixels || [];
        setAvailablePixels(pixels);
      } catch (e) {
        console.error("Failed to load pixels:", e);
      } finally {
        setPixelsLoading(false);
      }
    };
    fetchPixels();
  }, [workspaceId]);

  // Auto-select pixel when pixels are loaded AND summary is available
  // Uses a ref to track whether we've done initial selection to avoid overwriting user changes
  const pixelInitializedRef = useRef(false);
  useEffect(() => {
    // Reset initialization flag when adset changes
    pixelInitializedRef.current = false;
  }, [adSetKey]);
  
  useEffect(() => {
    // Only auto-select if user hasn't manually changed the pixel
    if (touched.pixel) return;
    if (availablePixels.length === 0) return;
    
    // Priority: 1. Saved in launchSettings, 2. LP's saved pixel, 3. Hirelab pixel, 4. First available
    const savedPixelId = summary?.launchSettings?.metaPixelId;
    const lpPixelId = summary?.metaPixelId;
    const savedPixel = savedPixelId ? availablePixels.find(p => p.id === savedPixelId) : null;
    const lpPixel = lpPixelId ? availablePixels.find(p => p.id === lpPixelId) : null;
    const hirelabPixel = availablePixels.find(p => p.name?.toLowerCase().includes('hirelab'));
    
    // If we have a saved pixel from launchSettings, always use that
    if (savedPixel) {
      setSelectedPixel(savedPixel.id);
      pixelInitializedRef.current = true;
      return;
    }
    
    // Only do the fallback selection once (to avoid overwriting when summary loads later)
    if (pixelInitializedRef.current) return;
    
    const fallbackPixel = lpPixel?.id || hirelabPixel?.id || availablePixels[0]?.id;
    if (fallbackPixel) {
      setSelectedPixel(fallbackPixel);
      pixelInitializedRef.current = true;
    }
  }, [availablePixels, summary?.metaPixelId, summary?.launchSettings?.metaPixelId, touched.pixel]);

  // Keep format functions but don't return early yet if we want hooks to run consistently
  // The early return "if (!lpId || loading)" causes issues if other hooks come after it.
  // We need to move ALL hooks before any conditional return.

  const last = Array.isArray(summary?.insights) ? summary.insights[0] : null;

  const formatNumber = (n) => {
    if (n === undefined || n === null || n === "") return "—";
    const num = Number(n);
    if (!Number.isFinite(num)) return "—";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return `${num}`;
  };
  const formatPct = (n) => {
    if (n === undefined || n === null || n === "") return "—";
    const num = Number(n);
    if (!Number.isFinite(num)) return "—";
    // Meta API often returns string percentage; keep 2 decimals
    return `${num.toFixed(2)}%`;
  };
  const formatCurrency = (n) => {
    if (n === undefined || n === null || n === "") return "—";
    const num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return `€${num.toFixed(2)}`;
  };

  const getKpis = () => {
    // These fields are straight from insights
    const impressions = formatNumber(last?.impressions);
    const reach = formatNumber(last?.reach);
    const clicks = formatNumber(last?.clicks || last?.inline_link_clicks);
    const ctr = last?.ctr ? formatPct(Number(last.ctr)) : "—";
    const cpc = last?.cpc ? formatCurrency(Number(last.cpc)) : "—";
    const spend = last?.spend ? formatCurrency(Number(last.spend)) : "—";
    return { impressions, reach, clicks, ctr, cpc, spend };
  };
  const { impressions, reach, clicks, ctr, cpc, spend } = getKpis();

  const getOverviewData = (settingsOverride, locationsOverride) => {
    if (isDemo) {
      return {
        year: "2025",
        months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        role: "Project Manager - Amsterdam",
        dateRange: "23/10/2025 - 23/11/2025",
        totalBudget: "$4,300",
        channels: [
          { name: "Facebook", daily: "$35", total: "$2,500", color: "blue", icon: <FaFacebook className="w-5 h-5 text-blue-600" /> },
          { name: "Google", daily: "$25", total: "$1,800", color: "green", icon: <FaGoogle className="w-4 h-4 text-green-600" /> }
        ],
        summary: {
          budget: "€300 over 14 days",
          budgetNote: "(Balanced plan)",
          targetArea: "30km radius around Rotterdam",
          adTypes: { total: 6, jobAds: 4, employerBrand: 1, testimonial: 1 },
          optimization: "Meta Advantage+ Audience"
        },
        predictions: {
          reach: "8,500",
          reachDelta: "+15% vs benchmark",
          ctr: "2.4%",
          ctrNote: "Above industry avg",
          applicants: "12-18",
          applicantsNote: "Quality score: High",
          cpa: "€38",
          cpaDelta: "16% below benchmark"
        },
        benchmarks: {
          ctr: "2.1%",
          cpa: "€45",
          competition: "Medium"
        },
        insights: "HireLab AI selected these settings based on your job type (Technician) and past similar campaigns.",
        optimization: {
          title: "Audience Targeting",
          badge: "Enhanced",
          desc: "Meta Advantage+ with technical skills overlay"
        }
      };
    }

    const campaignName = summary?.campaign?.name || summary?.vacancyTitle || "Campaign";
    const channels = summary?.adSets?.map((adSet) => ({
      name: adSet.name || "Channel",
      daily: formatCurrency(
        adSet.daily_budget ? Number(adSet.daily_budget) / 100 : 0
      ),
      total: "—",
      color: adSet.name?.toLowerCase().includes("google") ? "green" : "blue", // Default to blue (Meta) as it's the primary platform
      icon: adSet.name?.toLowerCase().includes("google") ? (
        <FaGoogle className="text-2xl text-green-600" />
      ) : (
        <FaFacebook className="text-2xl text-blue-600" />
      ),
    })) || [];

    // Effective schedule for overview:
    // - If campaign exists → provider start/stop
    // - Else fall back to current settings from Launch
    const hasCampaign = !!summary?.campaign;
    const settingsSchedule = settingsOverride?.schedule || {};
    const firstAdSet = Array.isArray(summary?.adSets) ? summary.adSets[0] : null;
    const providerStart = summary?.campaign?.start_time || firstAdSet?.start_time || null;
    const providerEnd = summary?.campaign?.stop_time || firstAdSet?.end_time || null;
    const startMoment = hasCampaign
      ? providerStart
        ? dayjs(providerStart)
        : settingsSchedule.start || null
      : settingsSchedule.start || null;
    const endMoment = hasCampaign
      ? providerEnd
        ? dayjs(providerEnd)
        : settingsSchedule.end || null
      : settingsSchedule.end || null;

    const dateRange = startMoment
      ? `${startMoment.format("DD/MM/YYYY")} - ${endMoment ? endMoment.format("DD/MM/YYYY") : "Ongoing"
      }`
      : "—";

    // Effective daily budget:
    // - Prefer provider campaign daily budget
    // - Else first ad set daily budget
    // - Else current settings daily budget
    let providerDaily = null;
    if (hasCampaign && summary?.campaign?.daily_budget) {
      providerDaily = Number(summary.campaign.daily_budget) / 100;
    } else if (hasCampaign && Array.isArray(summary?.adSets)) {
      const withBudget = summary.adSets.find((s) => s.daily_budget);
      if (withBudget?.daily_budget) {
        providerDaily = Number(withBudget.daily_budget) / 100;
      }
    }
    const rawSettingsDaily = settingsOverride?.budget?.daily;
    const settingsDaily =
      rawSettingsDaily != null && Number.isFinite(Number(rawSettingsDaily)) && Number(rawSettingsDaily) > 0
        ? Number(rawSettingsDaily)
        : null;
    const effectiveDaily =
      providerDaily != null
        ? providerDaily
        : settingsDaily != null
          ? settingsDaily
          : 0;

    const totalBudgetLabel = formatCurrency(effectiveDaily || 0);

    // Target area overview: from audience locations or LP location
    let targetArea = "—";
    if (Array.isArray(locationsOverride) && locationsOverride.length > 0) {
      targetArea = locationsOverride.map((l) => l.name).join(", ");
    } else if (
      Array.isArray(landingPageData?.location) &&
      landingPageData.location.length > 0
    ) {
      targetArea = landingPageData.location.join(", ");
    }

    return {
      year: new Date().getFullYear(),
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // dynamic?
      role: campaignName,
      dateRange,
      totalBudget: totalBudgetLabel,
      channels: channels,
      summary: {
        budget: totalBudgetLabel,
        budgetNote: "",
        targetArea,
        adTypes: { total: 0, jobAds: 0, employerBrand: 0, testimonial: 0 },
        optimization: summary?.campaign?.objective || "—"
      },
      predictions: {
        reach: reach,
        reachDelta: "",
        ctr: ctr,
        ctrNote: "",
        applicants: "—",
        applicantsNote: "",
        cpa: cpc,
        cpaDelta: ""
      },
      benchmarks: {
        ctr: "—",
        cpa: "—",
        competition: "—"
      },
      insights: "AI insights will appear here once the campaign is active.",
      optimization: {
        title: "Optimization",
        badge: "Standard",
        desc: "Standard delivery"
      }
    };
  };

  const getSettingsData = () => {
    if (isDemo) {
      return {
        optimizationGoal: "Apply Now (Conversion)",
        platforms: [
          { name: "Facebook", icon: <FaFacebook className="text-2xl text-blue-600" />, selected: true, disabled: false },
          { name: "Instagram", icon: <FaInstagram className="text-2xl text-pink-500" />, selected: true, disabled: false },
          { name: "LinkedIn", icon: <FaLinkedin className="text-2xl text-blue-700" />, selected: false, disabled: true, label: "Coming soon" },
          { name: "Google", icon: <FaGoogle className="text-2xl text-red-500" />, selected: false, disabled: true, label: "Coming soon" },
          { name: "TikTok", icon: <FaTiktok className="text-2xl text-black" />, selected: false, disabled: true, label: "Coming soon" },
          { name: "Snapchat", icon: <FaSnapchat className="text-2xl text-yellow-400" />, selected: false, disabled: true, label: "Coming soon" }
        ],
        budget: {
          total: 300,
          daily: 21.43,
          split: [
            { name: "Meta", pct: 60, color: "blue" },
            { name: "Instagram", pct: 20, color: "pink" },
            { name: "Others", pct: 20, color: "gray" }
          ]
        },
        prediction: {
          reach: "~8,500",
          cpa: "~€38"
        },
        pacing: "Balanced Plan",
        suggestion: {
          text: "Extend campaign by 7 days?",
          action: "Approve"
        },
        schedule: {
          start: dayjs("2025-11-10"),
          end: dayjs("2025-11-24")
        },
        aiInsights: {
          text: "HireLab AI selected these settings based on your job type (Technician) and past similar campaigns.",
          recommendations: {
            title: "Budget Distribution",
            desc: "Recommended channel split for maximum applications.",
            items: [
              { name: "Meta", pct: "60%", icon: <FaFacebook className="text-gray-600" /> },
              { name: "Instagram", pct: "20%", icon: <FaInstagram className="text-gray-600" /> },
              { name: "Remarketing", pct: "20%", icon: <RefreshCw className="w-3 h-3 text-gray-600" /> }
            ]
          }
        }
      };
    }

    // In per-ad-set mode we always treat this screen as "pre-launch" draft setup.
    // Even if there is an existing Meta campaign (from other ad sets), we should use per-ad-set draft settings here.
    const hasCampaign = !!summary?.campaign && !adSetKey;
    // Single source of truth from backend:
    // - in ad-set mode: summary.launchSettings is the per-ad-set settings
    // - otherwise: summary.launchSettings is campaign-level settings
    const draft = summary?.launchSettings || {};

    // Real data mapping
    // Map Meta objective to UI-friendly optimization label
    // Default to "Leads" for new campaigns or drafts
    let optimizationGoalValue = "LEADS";
    const rawObjective = summary?.campaign?.objective;
    if (rawObjective === "OUTCOME_LEADS" || rawObjective === "LEAD_GENERATION" || rawObjective === "LEADS") {
      optimizationGoalValue = "LEADS";
    } else if (rawObjective === "OUTCOME_TRAFFIC") {
      optimizationGoalValue = "OUTCOME_TRAFFIC";
    }
    if (!hasCampaign && draft.optimizationGoal) {
      optimizationGoalValue = draft.optimizationGoal;
    }

    // Derive budget (campaign → ad set → saved draft → default):
    let providerDailyBudget = null;
    if (hasCampaign && summary?.campaign?.daily_budget) {
      providerDailyBudget = Number(summary.campaign.daily_budget) / 100;
    } else if (hasCampaign && Array.isArray(summary?.adSets)) {
      const withBudget = summary.adSets.find((s) => s.daily_budget);
      if (withBudget?.daily_budget) {
        providerDailyBudget = Number(withBudget.daily_budget) / 100;
      }
    }

    const draftDaily = draft.budgetDaily != null ? Number(draft.budgetDaily) : null;

    const effectiveDailyBudget =
      providerDailyBudget != null
        ? providerDailyBudget
        : draftDaily != null
          ? draftDaily
          : 20;

    const approxTwoWeekTotal = effectiveDailyBudget * 14;

    // Schedule: Always use saved launchSettings (draft) as the source of truth.
    // The Launch page is for planning/editing settings, not displaying live Meta status.
    // Users can adjust dates here and then push updates to Meta via "Launch" or "Update".
    const scheduleStart = draft.scheduleStart
      ? dayjs(draft.scheduleStart)
      : null;

    const scheduleEnd = draft.scheduleEnd
      ? dayjs(draft.scheduleEnd)
      : null;

    return {
      optimizationGoal: optimizationGoalValue,
      platforms: ["Facebook", "Instagram", "LinkedIn", "Google", "TikTok", "Snapchat"].map(p => ({
        name: p,
        icon: p === "Facebook" ? <FaFacebook className="text-2xl text-blue-600" /> :
          p === "Instagram" ? <FaInstagram className="text-2xl text-pink-500" /> :
            p === "LinkedIn" ? <FaLinkedin className="text-2xl text-blue-700" /> :
              p === "Google" ? <FaGoogle className="text-2xl text-red-500" /> :
                p === "TikTok" ? <FaTiktok className="text-2xl text-black" /> :
                  <FaSnapchat className="text-2xl text-yellow-400" />,
        selected: p === "Facebook" || p === "Instagram",
        disabled: !(p === "Facebook" || p === "Instagram"),
        label: !(p === "Facebook" || p === "Instagram") ? "Coming soon" : undefined
      })),
      budget: {
        total: approxTwoWeekTotal,
        daily: effectiveDailyBudget,
        split: [
          { name: "Meta", pct: 70, color: "blue" },
          { name: "Instagram", pct: 30, color: "pink" },
        ]
      },
      prediction: {
        reach: reach,
        cpa: cpc
      },
      pacing: hasCampaign ? "Standard" : draft.pacing || "Standard",
      suggestion: summary?.campaign
        ? null
        : {
          text: "Start with a 14-day run and review performance after the first week.",
          action: "Apply suggestion",
        },
      schedule: {
        start: scheduleStart,
        end: scheduleEnd,
      },
      aiInsights: {
        text: landingPageData?.vacancyTitle
          ? `HireLab AI will optimize this campaign for “${landingPageData.vacancyTitle}” based on similar roles and markets.`
          : "HireLab AI will optimize this campaign based on similar jobs and markets.",
        recommendations: {
          title: "Suggested Budget & Platforms",
          desc: "Meta Feed + Instagram are recommended to maximize applications for this role.",
          items: [
            { name: "Meta", pct: "70%", icon: <FaFacebook className="text-gray-600" /> },
            { name: "Instagram", pct: "30%", icon: <FaInstagram className="text-gray-600" /> },
          ],
        },
      }
    };
  };

  const getAudienceData = () => {
    if (isDemo) {
      return {
        locations: [
          { name: "Berlin", radius: "30 KM", map: "https://placehold.co/400x256/e2e8f0/94a3b8?text=Berlin+Map" },
          { name: "Tokyo", radius: "30 KM", map: "https://placehold.co/400x256/e2e8f0/94a3b8?text=Tokyo+Map" },
          { name: "Amsterdam", radius: "30 KM", map: "https://placehold.co/400x256/e2e8f0/94a3b8?text=Amsterdam+Map" }
        ],
        keywords: [
          { name: "Project Management", color: "purple" },
          { name: "Management", color: "purple" },
          { name: "Leadership", color: "purple" },
          { name: "Team Coordination", color: "purple" },
          { name: "Planning & Execution", color: "purple" },
          { name: "Stakeholder Management", color: "purple" },
          { name: "Budget Control", color: "purple" },
          { name: "Process Improvement", color: "purple" },
          { name: "Cross-Functional Teams", color: "purple" }
        ],
        keywordsCount: "+3",
        retargeting: {
          active: true,
          threshold: "1,000",
          desc: "when reach >"
        },
        aiTargeting: [
          { label: "Similar job content" },
          { label: "Company career pages" },
          { label: "Related professional roles" }
        ],
        layers: {
          warm: "People who visited your page",
          lookalike: "Based on past applicants",
          cold: "New potential reach"
        },
        aiInsights: {
          text: "HireLab AI selected these settings based on your job type (Technician) and past similar campaigns.",
          recommendations: {
            title: "Audience Targeting",
            badge: "Enhanced",
            desc: "Meta Advantage+ with technical skills overlay"
          }
        }
      };
    }

    // Prefer LP-level saved selections (draft or last chosen) so locations "come from the page"
    let locations = [];
    const saved = summary?.launchSettings?.audienceLocations;
    if (Array.isArray(saved) && saved.length > 0) {
      locations = saved.map((loc) => ({
        name: loc?.name || "City",
        radius: `${Number(loc?.radiusKm) || 25} KM`,
        lat: typeof loc?.lat === "number" ? loc.lat : loc?.lat != null ? Number(loc.lat) : undefined,
        lon: typeof loc?.lon === "number" ? loc.lon : loc?.lon != null ? Number(loc.lon) : undefined,
        countryCode: loc?.countryCode || null,
        map: null,
      }));
    } else if (Array.isArray(summary?.adSets) && summary.adSets.length > 0) {
      // After publish: hydrate from Meta ad set targeting if available
      const t = summary.adSets[0]?.targeting;
      const targetingObj =
        typeof t === "string"
          ? (() => {
            try { return JSON.parse(t); } catch { return null; }
          })()
          : t;
      const geo = targetingObj?.geo_locations;
      const customs = Array.isArray(geo?.custom_locations) ? geo.custom_locations : [];
      if (customs.length > 0) {
        locations = customs.map((c) => ({
          name: "Selected location",
          radius: `${Number(c.radius) || 25} KM`,
          lat: typeof c.latitude === "number" ? c.latitude : c.latitude != null ? Number(c.latitude) : undefined,
          lon: typeof c.longitude === "number" ? c.longitude : c.longitude != null ? Number(c.longitude) : undefined,
          countryCode: null,
          map: null,
        }));
      }
    } else if (Array.isArray(landingPageData?.location) && landingPageData.location.length > 0) {
      locations = landingPageData.location.map((loc) => ({
        name: loc,
        radius: "25 KM",
        map: null,
      }));
    }

    return {
      locations,
      keywords: summary?.campaign?.targeting?.interests?.map(i => ({ name: i.name, color: "purple" })) || [],
      keywordsCount: "",
      retargeting: {
        active: false,
        threshold: "1,000",
        desc: "when reach >"
      },
      aiTargeting: [],
      layers: {
        warm: "—",
        lookalike: "—",
        cold: "—"
      },
      aiInsights: {
        text: "AI insights will appear here once the campaign is active.",
        recommendations: null
      }
    };
  };

  useEffect(() => {
    // Only hydrate audience from backend if user hasn't started editing it.
    if (touched.audience) return;
    const data = getAudienceData();
    setAudienceLocations(data.locations);
    setAudienceKeywords(data.keywords);
  }, [isDemo, summary, touched.audience]);

  // Initialize / sync editable settings state from Meta or draft defaults once summary / LP data are available
  useEffect(() => {
    if (!summary) return;
    const base = getSettingsData();

    // Only (re)initialize when the underlying summary/adset context changes.
    // Avoid re-initializing on unrelated state changes (e.g. landingPageData updates),
    // which was causing a second autosave to overwrite user edits (3 -> 5).
    // Include launchSettings.updatedAt so we re-init when the persisted settings change.
    const nextInitKey = `${lpId || ""}::${adSetKey || ""}::${summary?.campaignId || ""}::${summary?.launchSettings?.updatedAt || ""}`;
    if (initKeyRef.current !== nextInitKey) {
      initKeyRef.current = nextInitKey;
      didInitFromSummaryRef.current = true;
      hydratingRef.current = true;
      setTouched({
        budget: false,
        schedule: false,
        audience: false,
        optimization: false,
        pacing: false,
        pixel: false,
      });
      // Release hydration lock after React applies the state updates.
      setTimeout(() => {
        hydratingRef.current = false;
      }, 0);
    }

    if (optimizationGoal === null && base.optimizationGoal) setOptimizationGoal(base.optimizationGoal);
    if (pacingPlan === null && base.pacing) setPacingPlan(base.pacing);

    // Only hydrate fields the user hasn't touched.
    setScheduleOverride((prev) => {
      if (touched.schedule) return prev;
      return { start: base.schedule?.start || null, end: base.schedule?.end || null };
    });
    setLaunchDailyBudget((prev) => {
      if (touched.budget) return prev;
      return base.budget?.daily != null ? Number(base.budget.daily) : null;
    });
  }, [summary, isDemo, lpId, adSetKey, optimizationGoal, pacingPlan, touched.budget, touched.schedule]);

  // Keep Launch header in sync with Meta campaign status and title
  useEffect(() => {
    if (!summary) return;
    const isActive = summary?.campaign?.status === "ACTIVE";
    const inferredTitle =
      summary?.vacancyTitle || summary?.campaign?.name || landingPageData?.vacancyTitle || "";
    setLandingPageData((prev) => ({
      ...(prev || {}),
      vacancyTitle: inferredTitle,
      published: summary?.published,
    }));
  }, [summary]);

  // Auto-save draft settings to our DB for this ad set (or campaign-level if not in ad-set mode).
  useEffect(() => {
    if (!lpId) return;
    // Only autosave after the page has been initialized and the user has interacted.
    if (!didInitFromSummaryRef.current) return;
    if (
      !touched.budget &&
      !touched.schedule &&
      !touched.audience &&
      !touched.optimization &&
      !touched.pacing &&
      !touched.pixel
    ) return;
    // Only send fields the user actually changed; otherwise we accidentally overwrite stored values
    // with null/defaults on unrelated edits.
    const payload = {
      ...(adSetKey ? { adset_id: adSetKey } : {}),
      clientUpdatedAt: new Date().toISOString(),
      ...(touched.optimization ? { optimizationGoal } : {}),
      ...(touched.pacing ? { pacing: pacingPlan } : {}),
      ...(touched.pixel ? { metaPixelId: selectedPixel } : {}),
      ...(touched.budget
        ? {
          budgetDaily:
            launchDailyBudget != null ? Number(launchDailyBudget) : null,
        }
        : {}),
      ...(touched.schedule
        ? {
          scheduleStart: scheduleOverride.start
            ? scheduleOverride.start.toISOString()
            : null,
          scheduleEnd: scheduleOverride.end
            ? scheduleOverride.end.toISOString()
            : null,
        }
        : {}),
      ...(touched.audience
        ? {
          audienceLocations: (audienceLocations || []).map((loc) => ({
            name: loc?.name,
            radiusKm: parseInt(loc?.radius, 10) || 25,
            lat: loc?.lat,
            lon: loc?.lon,
            countryCode: loc?.countryCode || null,
          })),
        }
        : {}),
    };
    // Prevent duplicate / out-of-order autosaves from overwriting newer values.
    const payloadKey = JSON.stringify(payload);
    if (lastAutoSavePayloadRef.current === payloadKey) return;
    const timer = setTimeout(() => {
      lastAutoSavePayloadRef.current = payloadKey;
      AdsLaunchService.saveLaunchSettings(lpId, payload).catch(() => {
        // Silent fail; user will still be able to launch using current in-memory values
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [
    lpId,
    adSetKey,
    optimizationGoal,
    pacingPlan,
    launchDailyBudget,
    selectedPixel,
    scheduleOverride.start,
    scheduleOverride.end,
    audienceLocations,
    touched.budget,
    touched.schedule,
    touched.audience,
    touched.optimization,
    touched.pacing,
    touched.pixel,
  ]);

  if (!lpId || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton active />
      </div>
    );
  }

  const searchCities = async (query) => {
    if (!query || query.trim().length < 2) {
      setLocationSearchResults([]);
      return;
    }
    try {
      setLocationSearchLoading(true);
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
          query.trim()
        )}`
      );
      const data = await resp.json();
      setLocationSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setLocationSearchResults([]);
    } finally {
      setLocationSearchLoading(false);
    }
  };

  const handleSelectSearchLocation = (result) => {
    if (!result) return;
    if (hydratingRef.current) return;
    const address = result.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      (result.display_name || "").split(",")[0];
    const countryCode = (address.country_code || "").toUpperCase() || null;
    const name = countryCode ? `${city}, ${countryCode}` : city;
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    if (!name || Number.isNaN(lat) || Number.isNaN(lon)) return;
    setAudienceLocations((prev) => [
      ...prev,
      {
        name,
        radius: "25 KM",
        lat,
        lon,
        countryCode,
      },
    ]);
    setTouched((t) => ({ ...t, audience: true }));
    setIsLocationModalOpen(false);
    setLocationSearchTerm("");
    setLocationSearchResults([]);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setAudienceKeywords([...audienceKeywords, { name: newKeyword, color: "purple" }]);
      setNewKeyword("");
      setIsKeywordModalOpen(false);
    }
  };

  const handleRemoveLocation = (index) => {
    if (hydratingRef.current) return;
    const newLocs = [...audienceLocations];
    newLocs.splice(index, 1);
    setAudienceLocations(newLocs);
    setTouched((t) => ({ ...t, audience: true }));
  };

  const handleRemoveKeyword = (index) => {
    const newKeys = [...audienceKeywords];
    newKeys.splice(index, 1);
    setAudienceKeywords(newKeys);
  };

  const handleRadiusChange = (value, index) => {
    if (hydratingRef.current) return;
    const newLocs = [...audienceLocations];
    newLocs[index].radius = `${value} KM`;
    setAudienceLocations(newLocs);
    setTouched((t) => ({ ...t, audience: true }));
  };

  const handleApplyQuickSuggestion = () => {
    const base = getSettingsData();
    const now = dayjs();
    const start = base.schedule?.start || now;
    const end = base.schedule?.end || now.add(14, "day");
    setScheduleOverride({ start, end });
    if (base.budget?.daily) {
      setLaunchDailyBudget(Number(base.budget.daily));
    }
    setPacingPlan("Balanced Plan");
    message.success("Suggestion applied to schedule and pacing.");
  };

  const audienceData = getAudienceData(); // Keep for other static parts, but use state for interactive parts
  const baseSettingsData = getSettingsData();
  const settingsData = {
    ...baseSettingsData,
    optimizationGoal: optimizationGoal ?? baseSettingsData.optimizationGoal,
    pacing: pacingPlan ?? baseSettingsData.pacing,
    schedule: {
      ...(baseSettingsData.schedule || {}),
      start: scheduleOverride.start || baseSettingsData.schedule?.start || null,
      end: scheduleOverride.end || baseSettingsData.schedule?.end || null,
    },
    budget: {
      ...(baseSettingsData.budget || {}),
      daily:
        launchDailyBudget != null
          ? Number(launchDailyBudget)
          : Number(baseSettingsData.budget?.daily || 0),
    },
  };

  const scheduleDurationDays =
    settingsData.schedule?.start && settingsData.schedule?.end
      ? settingsData.schedule.end.diff(settingsData.schedule.start, "day") + 1
      : null;

  const effectiveDailyBudget =
    Number.isFinite(Number(settingsData.budget.daily)) ?
      Number(settingsData.budget.daily) :
      0;

  const approxTotalBudget = scheduleDurationDays
    ? (effectiveDailyBudget * scheduleDurationDays).toFixed(2)
    : (effectiveDailyBudget * 14).toFixed(2);

  const durationLabel = scheduleDurationDays ? `${scheduleDurationDays} days` : "—";

  const overviewData = getOverviewData();

  const setCampaignPublished = async (next) => {
    try {
      if (!summary?.campaignId && !summary?.campaign?.id) return;
      const id = summary.campaignId || summary.campaign.id;
      await AdsLaunchService.updateCampaign(lpId, { id, status: next ? "ACTIVE" : "PAUSED" });
      await reload();
      message.success(next ? "Campaign resumed" : "Campaign paused");
    } catch {
      message.error("Failed to update campaign");
    }
  };

  const toggleAd = async (adId, status) => {
    try {
      await AdsLaunchService.updateAd(lpId, { id: adId, status });
      await reload();
      message.success(`Ad ${status.toLowerCase()}`);
    } catch {
      message.error("Failed to update ad");
    }
  };

  const toggleAdSet = async (adSetId, status) => {
    try {
      await AdsLaunchService.updateAdSet(lpId, { id: adSetId, status });
      await reload();
      message.success(`Ad set ${status.toLowerCase()}`);
    } catch {
      message.error("Failed to update ad set");
    }
  };
  const updateAdSetBudget = async (adSetId, value) => {
    try {
      const minor = Math.max(1, Math.floor(Number(value) * 100));
      await AdsLaunchService.updateAdSet(lpId, { id: adSetId, daily_budget: String(minor) });
      await reload();
      message.success("Budget updated");
    } catch {
      message.error("Failed to update budget");
    }
  };
  const updateCampaignBudget = async (value) => {
    try {
      if (!summary?.campaignId && !summary?.campaign?.id) return;
      const id = summary.campaignId || summary.campaign.id;
      const minor = Math.max(1, Math.floor(Number(value) * 100));
      await AdsLaunchService.updateCampaign(lpId, {
        id,
        daily_budget: String(minor),
      });
      await reload();
      message.success("Campaign budget updated");
    } catch {
      message.error("Failed to update campaign budget");
    }
  };
  const updateAdSetSchedule = async (adSetId, start, end) => {
    try {
      await AdsLaunchService.updateAdSet(lpId, {
        id: adSetId,
        start_time: start ? dayjs(start).toISOString() : undefined,
        end_time: end ? dayjs(end).toISOString() : undefined,
      });
      await reload();
      message.success("Schedule updated");
    } catch {
      message.error("Failed to update schedule");
    }
  };
  const toggleCampaign = async () => {
    const isActive = summary?.campaign?.status === "ACTIVE";
    await setCampaignPublished(!isActive);
  };

  const handleLaunchCampaign = async () => {
    if (!summary) {
      message.error("Launch data is still loading. Please wait a moment and try again.");
      return;
    }
    // Require either a selected pixel OR a default pixel from the landing page
    if (!selectedPixel && !summary?.metaPixelId) {
      message.error(
        "Please select a Meta Pixel / Dataset for conversion tracking before launching."
      );
      return;
    }
    if (!summary?.adAccountId || !summary?.pageId) {
      message.error(
        "Meta Ad Account and Page are not configured. Please open the Ads Editor Meta settings and select an Ad Account & Page before launching."
      );
      return;
    }
    if (!summary?.editorAds) {
      message.warning("No creatives available to launch");
      return;
    }
    try {
      setLaunching(true);
      const ads = summary.editorAds;
      const ids = [];
      Object.keys(ads || {}).forEach((adType) => {
        if (adType === "_publish") return;
        const group = ads[adType];
        (group?.variants || []).forEach((v) => {
          if (v.approved) {
            ids.push(v.id);
          }
        });
      });
      if (ids.length === 0) {
        message.warning("Approve creatives in Ads Editor before launching");
        return;
      }

      // Use budget & schedule from current settings state (or overrides) when launching
      const settings = settingsData;
      const effectiveDaily = Number(settings?.budget?.daily || 0);
      if (!Number.isFinite(effectiveDaily) || effectiveDaily <= 0) {
        message.error("Daily budget must be greater than 0 before launching.");
        return;
      }
      const budgetMinor = Math.max(1, Math.floor(effectiveDaily * 100)); // Meta expects minor units

      const schedule = settings?.schedule || {};
      if (!schedule.start || !schedule.end) {
        message.error("Please select both a start date and an end date in Schedule & Duration before launching.");
        return;
      }
      const startIso =
        schedule.start && schedule.start.toISOString ? schedule.start.toISOString() : null;
      const endIso =
        schedule.end && schedule.end.toISOString ? schedule.end.toISOString() : null;

      // Always try to reuse the same Meta campaign instead of creating a new one
      const existingCampaignId =
        summary?.campaignId || summary?.campaign?.id || null;

      const payload = {
        adIds: ids,
        budget: budgetMinor,
        // Be explicit so backend never creates a second campaign for this LP
        reuseCampaign: true,
        // This is a launch request - activate the ad set
        launch: true,
      };
      if (adSetKey) {
        payload.hirelabAdSetId = adSetKey;
        // If this HireLab ad set already has a Meta ad set id, reuse it (retry / relaunch scenario).
        // Check both _adSets (current) and _adSetsMeta (legacy)
        const localSets = Array.isArray(summary?.editorAds?._adSets) && summary.editorAds._adSets.length > 0
          ? summary.editorAds._adSets
          : Array.isArray(summary?.editorAds?._adSetsMeta) ? summary.editorAds._adSetsMeta : [];
        const local = localSets.find((s) => s?.id === adSetKey) || null;
        if (local?.metaAdSetId) {
          payload.reuseAdSet = true;
          payload.existingAdSetId = local.metaAdSetId;
        }
        if (local?.metaCampaignId) {
          payload.existingCampaignId = local.metaCampaignId;
        }
      }
      if (existingCampaignId) {
        payload.existingCampaignId = existingCampaignId;
      }
      if (startIso) payload.start_time = startIso;
      if (endIso) payload.end_time = endIso;

      // Audience locations (cities + radius) from Launch Audience step
      const audiencePayload = (audienceLocations || []).map((loc) => ({
        name: loc.name,
        radiusKm: parseInt(loc.radius, 10) || 25,
        lat: typeof loc.lat === "number" ? loc.lat : null,
        lon: typeof loc.lon === "number" ? loc.lon : null,
        countryCode: loc.countryCode || null,
      }));
      if (audiencePayload.length) {
        payload.audienceLocations = audiencePayload;
      }

      // Include pixel for conversion optimization
      // Use selected pixel first, fallback to LP's saved pixel
      const effectivePixel = selectedPixel || summary?.metaPixelId;
      console.log("[Launch] Pixel selection:", {
        selectedPixel,
        summaryMetaPixelId: summary?.metaPixelId,
        effectivePixel,
      });
      if (effectivePixel) {
        payload.metaPixelId = effectivePixel;
        payload.conversionEvent = "LEAD"; // Meta standard event for lead optimization
      } else {
        console.warn("[Launch] No pixel selected - ad set will use LINK_CLICKS instead of CONVERSIONS");
      }

      console.log("[Launch] Full payload:", JSON.stringify(payload, null, 2));
      const res = await AdsService.publish(lpId, payload);
      if (res?.data?.success) {
        message.success(adSetKey ? "Ad set launched successfully!" : "Campaign launched successfully!");
        // Redirect to the Ads overview page after successful launch
        router.push(`/lp-editor/${lpId}/ads`);
      } else {
        message.error(res?.data?.message || "Failed to launch campaign");
      }
    } catch (err) {
      console.error("Launch error", err);
      message.error(err?.response?.data?.message || err.message || "Failed to launch campaign");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f8f8]">
      <div className="px-8 pt-6">
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
          }} setLandingPageData={setLandingPageData}
          reload={reload}
          lpId={lpId}
          backLinkOverride={`/lp-editor/${lpId}/ads`}
          hideSettings
          customActions={<>
          </>}
        />
      </div>

      <div className="overflow-y-auto flex-1 px-8 py-6">
        {/* Back to ad sets link */}
        <button
          onClick={() => router.push(`/lp-editor/${lpId}/ads`)}
          className="text-sm text-[#5207CD] hover:underline mb-4"
        >
          ← Back to ad sets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-gray-200 bg-white h-fit shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-4 text-lg font-semibold text-gray-800">Campaign Setup</div>
              <div className="space-y-2">
                {(adSetKey ? ["settings", "audience", "creatives"] : ["settings", "audience", "creatives", "overview"]).map((step, idx) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${activeStep === step ? "bg-violet-50" : "bg-white hover:bg-gray-50"
                      }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold ${activeStep === step
                        ? "bg-[#5207CD] text-white"
                        : "bg-[#F3E8FF] text-[#6B21A8]"
                        }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={`font-medium ${activeStep === step ? "text-violet-700 font-semibold" : "text-gray-600"}`}>
                      {step === "overview" && "Overview"}
                      {step === "settings" && "Campaign Settings"}
                      {step === "audience" && "Audience"}
                      {step === "creatives" && "Creatives"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleLaunchCampaign}
                disabled={launching}
                className={`flex gap-2 justify-center items-center py-3 mt-6 w-full text-base font-semibold rounded-lg transition-colors ${launching
                  ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                  : "text-white bg-green-500 hover:bg-green-600"
                  }`}
              >
                <span className="text-lg">🚀</span> {launching ? "Launching..." : adSetKey ? "Launch Ad Set" : "Launch Campaign"}
              </button>
            </div>

            {activeStep === 'overview' && (
              <>
                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="flex justify-center items-center w-8 h-8 text-violet-600 bg-violet-50 rounded-lg">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="text-base font-semibold text-gray-800">AI Insights</div>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-600">
                    {overviewData.insights}
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
                  <div className="flex relative z-10 gap-3 items-center mb-6">
                    <div className="flex justify-center items-center w-8 h-8 text-violet-600 bg-violet-50 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-base font-semibold leading-tight text-gray-800">Optimization<br />Recommendations</div>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{overviewData.optimization.title}</span>
                      <span className="px-2 py-0.5 text-xs font-bold text-green-600 bg-green-100 rounded-full">{overviewData.optimization.badge}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {overviewData.optimization.desc}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-3 items-center mb-6">
                    <div className="flex justify-center items-center w-8 h-8 text-violet-600 bg-violet-50 rounded-lg">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div className="text-base font-semibold text-gray-800">Industry Benchmarks</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. CTR (Technical)</span>
                      <span className="text-sm font-semibold text-gray-800">{overviewData.benchmarks.ctr}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. CPA (Rotterdam)</span>
                      <span className="text-sm font-semibold text-gray-800">{overviewData.benchmarks.cpa}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Competition Level</span>
                      <span className="text-sm font-semibold text-orange-600">{overviewData.benchmarks.competition}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeStep === 'settings' && (
              <>
                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
                  <div className="flex absolute top-6 left-1/2 justify-center items-center w-12 h-12 bg-violet-50 rounded-full -translate-x-1/2">
                    <Zap className="w-5 h-5 text-violet-700" />
                  </div>
                  <div className="mt-12 text-center">
                    <div className="mb-2 text-base font-semibold text-gray-700">AI Insights</div>
                    <div className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                      {settingsData.aiInsights.text}
                    </div>
                  </div>
                </div>






              </>
            )}
          </div>

          {/* Content */}
          <div className="bg-white border border-[#eaecf0] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Heading size="3xl" as="h2" className="!text-[#101828]">
                {activeStep === "overview" && "Overview"}
                {activeStep === "settings" && "Campaign Settings"}
                {activeStep === "audience" && "Audience"}
                {activeStep === "creatives" && "Creatives"}
              </Heading>
              {activeStep === "overview" && <div className="flex gap-3 items-center">
                <button
                  className="text-xs px-3 py-1 rounded-md border text-[#475467] hover:bg-gray-50"
                  onClick={toggleCampaign}
                  title="Pause/Resume campaign"
                  disabled={!summary?.campaign && !summary?.campaignId}
                >
                  {summary?.campaign?.status === "ACTIVE" ? "Pause Campaign" : "Resume Campaign"}
                </button>
                <select
                  className="text-xs px-2 py-1 rounded-md border text-[#475467]"
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value)}
                  title="Date range"
                >
                  <option value="last_7d">Last 7 days</option>
                  <option value="last_14d">Last 14 days</option>
                  <option value="last_28d">Last 28 days</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                </select>
                <div className="text-xs px-2 py-1 rounded-full border text-[#475467]">
                  {summary?.campaign?.status || "Not Created"}
                </div>
              </div>}
            </div>

            {activeStep === "overview" && (
              <div className="space-y-6">
                {/* Timeline Section */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
                    <div className="flex gap-4 items-center">
                      <button className="p-1 rounded hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-400 rotate-180" /></button>
                      <span className="font-semibold text-gray-700">{overviewData.year}</span>
                      <button className="p-1 rounded hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="flex gap-8 px-8">
                      {overviewData.months.map((m) => (
                        <div key={m} className={`w-12 text-center text-sm font-medium ${m === 'Oct' ? 'text-violet-600' : 'text-gray-400'}`}>{m}</div>
                      ))}
                    </div>
                    <div className="w-20 text-sm font-semibold text-right text-gray-800">
                      <div>Total:</div>
                      <div>{overviewData.totalBudget}</div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    {/* Left info */}
                    <div className="pr-6 space-y-4 w-60 border-r border-gray-100 shrink-0">
                      <div>
                        <div className="font-semibold text-gray-800 truncate" title={overviewData.role}>{overviewData.role}</div>
                        <div className="mt-1 text-xs text-gray-500">{overviewData.dateRange}</div>
                      </div>

                      <div className="space-y-3">
                        {overviewData.channels.map((ch, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className={`w-8 h-8 rounded bg-${ch.color}-50 flex items-center justify-center shrink-0`}>
                              {ch.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{ch.daily} <span className="font-normal text-gray-500">Daily budget</span></div>
                              <div className="text-xs text-gray-500">{ch.total} Total budget</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className="flex gap-2 justify-center items-center px-3 py-2 w-full text-sm text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <span className="text-lg leading-none">+</span> Add new channel
                      </button>
                    </div>

                    {/* Right bars */}
                    <div className="relative flex-1 pt-2">
                      <div className="flex absolute inset-0 pointer-events-none">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="flex-1 border-r border-gray-100 border-dashed last:border-0"></div>
                        ))}
                      </div>

                      <div className="relative z-10 mt-8 space-y-2">
                        {overviewData.channels.map((ch, idx) => (
                          <div key={idx}
                            className={`flex items-center px-3 h-8 text-xs font-semibold text-white whitespace-nowrap rounded-full shadow-sm`}
                            style={{
                              backgroundColor: ch.color === 'blue' ? '#3b82f6' : '#22c55e',
                              marginLeft: `${25 + idx * 5}%`,
                              width: '40%'
                            }}
                            title={`${ch.name} Campaign`}
                          >
                            <span className="w-full truncate">{ch.name} Campaign</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* AI Campaign Summary */}
                  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-3 items-center mb-6">
                      <div className="flex justify-center items-center w-8 h-8 bg-violet-50 rounded-lg">
                        <Target className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="text-lg font-semibold text-gray-800">AI Campaign Summary</div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-500">Budget</div>
                        <div className="text-sm font-semibold text-right text-gray-800">
                          {overviewData.summary.budget} <span className="font-normal text-gray-400">{overviewData.summary.budgetNote}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-500">Target Area</div>
                        <div className="text-sm font-semibold text-right text-gray-800">{overviewData.summary.targetArea}</div>
                      </div>

                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm text-gray-500">Ad Types</div>
                          <div className="text-sm font-semibold text-gray-800">{overviewData.summary.adTypes.total} variations</div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col flex-1 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-lg font-bold text-violet-600">{overviewData.summary.adTypes.jobAds}</div>
                            <div className="mt-1 text-xs text-gray-500">Job Ads</div>
                          </div>
                          <div className="flex flex-col flex-1 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-lg font-bold text-violet-600">{overviewData.summary.adTypes.employerBrand}</div>
                            <div className="mt-1 text-xs text-center text-gray-500">Employer Brand</div>
                          </div>
                          <div className="flex flex-col flex-1 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-lg font-bold text-violet-600">{overviewData.summary.adTypes.testimonial}</div>
                            <div className="mt-1 text-xs text-gray-500">Testimonial</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-start pt-2">
                        <div className="text-sm text-gray-500">Optimization</div>
                        <div className="text-sm font-semibold text-gray-800">{overviewData.summary.optimization}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Performance Predictions */}
                  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-3 items-center mb-6">
                      <div className="flex justify-center items-center w-8 h-8 bg-violet-50 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="text-lg font-semibold text-gray-800">AI Performance Predictions</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-violet-700">{overviewData.predictions.reach}</div>
                        <div className="mt-1 text-sm font-medium text-gray-700">Expected Reach</div>
                        <div className="mt-1 text-xs text-green-600">{overviewData.predictions.reachDelta}</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{overviewData.predictions.ctr}</div>
                        <div className="mt-1 text-sm font-medium text-gray-700">Predicted CTR</div>
                        <div className="mt-1 text-xs text-gray-500">{overviewData.predictions.ctrNote}</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-700">{overviewData.predictions.applicants}</div>
                        <div className="mt-1 text-sm font-medium text-gray-700">Est. Applicants</div>
                        <div className="mt-1 text-xs text-gray-500">{overviewData.predictions.applicantsNote}</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">{overviewData.predictions.cpa}</div>
                        <div className="mt-1 text-sm font-medium text-gray-700">Predicted CPA</div>
                        <div className="mt-1 text-xs text-green-600">{overviewData.predictions.cpaDelta}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === "settings" && (
              <div className="space-y-6">
                {/* Meta sync banner for live campaigns */}
                {/* Objectives */}
                <div className="flex gap-6">
                  <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-3 items-center mb-4">
                      <Target className="w-4 h-4 text-violet-700" />
                      <div className="text-base font-semibold text-gray-700">Optimization Goal</div>
                    </div>
                    <Select
                      value="LEADS"
                      className="w-full h-11"
                      disabled
                      options={[
                        { label: "Leads", value: "LEADS" },
                      ]}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Optimized for maximum Lead conversions
                    </p>
                  </div>

                  {/* Pixel/Dataset Selection */}
                  <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-3 items-center mb-4">
                      <BarChart2 className="w-4 h-4 text-violet-700" />
                      <div className="text-base font-semibold text-gray-700">Dataset (Pixel)</div>
                    </div>
                    <Select
                      value={selectedPixel}
                      className="w-full h-11"
                      loading={pixelsLoading}
                      placeholder="Select a pixel for conversion tracking"
                      onChange={(val) => {
                        if (hydratingRef.current) return;
                        setSelectedPixel(val);
                        setTouched((t) => ({ ...t, pixel: true }));
                      }}
                      options={availablePixels.map(p => ({
                        value: p.id,
                        label: p.name || `Pixel ${p.id}`,
                      }))}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Used to track and optimize for Lead conversions
                    </p>
                  </div>

                </div>

                {/* Platform Allocation */}

                {/* Schedule & Duration */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex gap-3 items-center mb-6">
                    <Calendar className="w-4 h-4 text-violet-700" />
                    <div className="text-base font-semibold text-gray-700">Schedule & Duration</div>
                  </div>

                  <div className="flex gap-6 items-end">
                    <div className="flex-1">
                      <div className="mb-2 text-sm font-medium text-gray-600">Start Date</div>
                      <div className="relative">
                        <DatePicker
                          className="w-full h-11"
                          value={settingsData.schedule.start || null}
                          onChange={(date) => {
                            if (hydratingRef.current) return;
                            setScheduleOverride((prev) => ({ ...prev, start: date || null }));
                            setTouched((t) => ({ ...t, schedule: true }));
                          }}
                          format="DD-MM-YYYY"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 text-sm font-medium text-gray-600">End Date</div>
                      <div className="relative">
                        <DatePicker
                          className="w-full h-11"
                          value={settingsData.schedule.end || null}
                          onChange={(date) => {
                            if (hydratingRef.current) return;
                            setScheduleOverride((prev) => ({ ...prev, end: date || null }));
                            setTouched((t) => ({ ...t, schedule: true }));
                          }}
                          format="DD-MM-YYYY"
                        />
                      </div>
                    </div>
                    <div className="pb-3 w-40">
                      <div className="text-sm font-medium text-gray-600">Duration</div>
                      <div className="mt-1 text-base text-gray-800">{durationLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Budget Allocation */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex gap-3 items-center mb-6">
                    <DollarSign className="w-4 h-4 text-violet-700" />
                    <div className="text-base font-semibold text-gray-700">Budget Allocation</div>
                  </div>

                  <div className="flex gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-600">Daily Budget</div>
                          <div className="relative">
                            <InputNumber
                              min={1}
                              value={
                                launchDailyBudget != null
                                  ? Number(launchDailyBudget)
                                  : Number(settingsData.budget.daily || 0)
                              }
                              onChange={(val) => {
                                if (hydratingRef.current) return;
                                setLaunchDailyBudget(val);
                                setTouched((t) => ({ ...t, budget: true }));
                              }}
                              className="w-full h-11 [&_.ant-input-number-input]:h-11 [&_.ant-input-number-input]:px-4"
                              controls={false}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-600">Total Budget (approx.)</div>
                          <div className="relative">
                            <div
                              className="px-4 w-full h-11 text-gray-900 flex items-center"
                            >
                              {`€ ${approxTotalBudget}`}
                            </div>
                          </div>
                        </div>

                      </div>


                    </div>


                  </div>
                </div>


              </div>
            )}

            {activeStep === "audience" && (
              <div className="space-y-6">
                {/* Location Targeting */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex gap-3 items-center">
                      <MapPin className="w-5 h-5 text-gray-700" />
                      <div className="text-xl font-bold text-gray-800">Location Targeting</div>
                    </div>
                    {audienceLocations?.length > 0 && (
                      <button
                        onClick={() => setAudienceLocations([])}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white rounded-full border border-red-200 hover:bg-red-50"
                      >
                        Remove all
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {audienceLocations.map((loc, i) => (
                      <div key={i} className="flex relative flex-col items-center p-4 w-full min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm group">
                        <button
                          onClick={() => handleRemoveLocation(i)}
                          aria-label="Remove location"
                          className="absolute top-2 right-2 z-10 p-1 text-gray-400 bg-white rounded-full shadow-sm opacity-100 transition-opacity hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="overflow-hidden relative mb-3 w-full h-36 bg-gray-100 rounded-lg">
                          {/* Map preview centered on selected city when we have coordinates */}
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src={
                              typeof loc.lat === "number" && typeof loc.lon === "number"
                                ? `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lon - 0.5},${loc.lat - 0.5},${loc.lon + 0.5},${loc.lat + 0.5}&layer=mapnik&marker=${loc.lat},${loc.lon}`
                                : `https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik`
                            }
                            style={{ pointerEvents: 'none' }} // Disable interaction to keep it as "preview"
                          ></iframe>
                          <div className="absolute inset-0 bg-black/5"></div>
                        </div>
                        <div className="mb-1 text-base font-bold text-gray-800">{loc.name}</div>
                        <div className="px-2 mb-1 w-full">
                          <Slider
                            defaultValue={parseInt(loc.radius) || 30}
                            min={10}
                            max={100}
                            onChange={(val) => handleRadiusChange(val, i)}
                            tooltip={{ open: false }}
                            className="m-0"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-500">{loc.radius}</div>
                      </div>
                    ))}
                    <div
                      className="flex relative flex-col items-center p-4 w-full min-w-0 bg-white rounded-xl border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-50"
                      onClick={() => setIsLocationModalOpen(true)}
                    >
                      {/* Keep dimensions consistent with other cards */}
                      <div className="overflow-hidden relative mb-3 w-full h-36 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex absolute inset-0 justify-center items-center">
                          <div className="flex justify-center items-center w-12 h-12 bg-gray-100 rounded-full">
                            <Plus className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-1 text-base font-bold text-gray-700">Add location</div>
                      <div className="px-2 mb-1 w-full">
                        <div className="h-6"></div>
                      </div>
                      <div className="text-sm font-medium text-gray-400">—</div>
                    </div>
                  </div>
                </div>

                <Modal
                  title="Add Location"
                  open={isLocationModalOpen}
                  footer={null}
                  onCancel={() => {
                    setIsLocationModalOpen(false);
                    setLocationSearchTerm("");
                    setLocationSearchResults([]);
                  }}
                >
                  <Input
                    placeholder="Search city (e.g. Amsterdam)"
                    value={locationSearchTerm}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocationSearchTerm(val);
                      searchCities(val);
                    }}
                  />
                  <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
                    {locationSearchLoading && (
                      <div className="text-xs text-gray-500">Searching...</div>
                    )}
                    {!locationSearchLoading &&
                      locationSearchResults.map((r) => {
                        const address = r.address || {};
                        const city =
                          address.city ||
                          address.town ||
                          address.village ||
                          (r.display_name || "").split(",")[0];
                        const countryCode = (address.country_code || "")
                          .toUpperCase()
                          .trim();
                        const label = countryCode
                          ? `${city}, ${countryCode}`
                          : city;
                        return (
                          <button
                            key={`${r.place_id}`}
                            type="button"
                            className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100"
                            onClick={() => handleSelectSearchLocation(r)}
                          >
                            {label}
                          </button>
                        );
                      })}
                    {!locationSearchLoading &&
                      !locationSearchResults.length &&
                      locationSearchTerm.trim().length >= 2 && (
                        <div className="text-xs text-gray-400">
                          No results found.
                        </div>
                      )}
                  </div>
                </Modal>

        

             

                <Modal title="Add Keyword" open={isKeywordModalOpen} onOk={handleAddKeyword} onCancel={() => setIsKeywordModalOpen(false)}>
                  <Input placeholder="Enter keyword (e.g. Leadership)" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onPressEnter={handleAddKeyword} />
                </Modal>


              
              </div>
            )}

            {activeStep === "creatives" && (
              <CreativesPreview 
                editorAds={summary?.editorAds} 
                lpId={lpId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Creatives Preview Component - readonly preview of approved creatives
function CreativesPreview({ editorAds, lpId }) {
  const [selectedFormat, setSelectedFormat] = useState("square");
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  const AD_FORMATS = [
    { id: "story", label: "Story (9:16)", width: 1080, height: 1920 },
    { id: "square", label: "Square (1:1)", width: 1080, height: 1080 },
    { id: "portrait", label: "Portrait (4:5)", width: 1080, height: 1350 },
  ];

  // Flatten all variants from all ad types
  const allVariants = React.useMemo(() => {
    const variants = [];
    Object.keys(editorAds || {})
      .filter((k) => !k.startsWith('_'))
      .forEach((adType) => {
        (editorAds[adType]?.variants || []).forEach((v) => {
          variants.push({ ...v, adType });
        });
      });
    return variants;
  }, [editorAds]);

  // Auto-select first variant
  React.useEffect(() => {
    if (!selectedVariant && allVariants.length > 0) {
      setSelectedVariant(allVariants[0]);
    }
  }, [allVariants, selectedVariant]);

  const getImageForFormat = (variant, format) => {
    if (!variant) return null;
    const publishImages = variant.publishImages || {};
    return publishImages[format] || variant.publishImage || variant.image;
  };

  const currentImage = selectedVariant ? getImageForFormat(selectedVariant, selectedFormat) : null;

  const getStatusInfo = (v) => {
    const publishImages = v?.publishImages || {};
    const isPublished = !!v?.publish?.adId || !!(v?.publishByAdSet && Object.values(v.publishByAdSet).some(p => p?.adId || p?.formats));
    const hasApprovedImages = Object.keys(publishImages).length > 0 || !!v?.publishImage;
    const isApproved = !!v?.approved && hasApprovedImages;
    return { isPublished, isApproved, hasApprovedImages };
  };

  // Get preview container dimensions based on format
  const getPreviewDimensions = () => {
    const maxHeight = 480;
    const format = AD_FORMATS.find(f => f.id === selectedFormat);
    if (!format) return { width: 300, height: 300 };
    const aspectRatio = format.width / format.height;
    const height = maxHeight;
    const width = Math.round(height * aspectRatio);
    return { width, height };
  };

  const previewDims = getPreviewDimensions();

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Creatives are linked to this ad set</p>
          <p className="text-blue-700">
            These creatives were approved in the Ads Editor and are now linked to this ad set. 
            If you need different creatives, create a new ad set with its own unique creatives.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Variants List */}
        <div className="w-72 flex-shrink-0">
          <div className="text-sm font-semibold text-[#101828] mb-3">Approved Creatives</div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2">
            {allVariants.map((v) => {
              const { isPublished, isApproved } = getStatusInfo(v);
              const publishImages = v.publishImages || {};
              const thumbImg = publishImages.square || publishImages.portrait || publishImages.story || v.publishImage || v.image;
              const isSelected = selectedVariant?.id === v.id;
              const formatCount = Object.keys(publishImages).length;
              
              return (
                <div
                  key={`${v.adType}-${v.id}`}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-[#5207CD]/10 border-2 border-[#5207CD]" 
                      : "bg-white border border-[#eaecf0] hover:border-[#5207CD]/50 hover:shadow-sm"
                  }`}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                    {thumbImg ? (
                      <img src={thumbImg} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#98a2b3] text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-[#101828]">{v.title || v.id}</div>
                    <div className={`text-xs mt-0.5 ${isPublished ? "text-[#0a8f63]" : isApproved ? "text-[#5207CD]" : "text-[#98a2b3]"}`}>
                      {isPublished ? "✓ Published" : isApproved ? "✓ Approved" : "Needs approval"}
                    </div>
                    {formatCount > 0 && (
                      <div className="text-xs text-[#98a2b3] mt-1">{formatCount} format{formatCount > 1 ? 's' : ''} ready</div>
                    )}
                  </div>
                </div>
              );
            })}
            {allVariants.length === 0 && (
              <div className="text-sm text-[#98a2b3] text-center py-8 bg-gray-50 rounded-lg">
                No creatives found.<br/>
                <a href={`/ads-edit/${lpId}`} className="text-[#5207CD] underline mt-2 inline-block">Go to Ads Editor</a>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-[#101828]">Preview</div>
            {/* Format Switcher */}
            <div className="flex gap-2">
              {AD_FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    selectedFormat === format.id
                      ? "bg-[#5207CD] text-white"
                      : "bg-white text-[#344054] border border-[#d0d5dd] hover:border-[#5207CD]"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Image - Clean display */}
          <div className="flex justify-center bg-[#f8f9fa] rounded-xl p-6 min-h-[520px] items-center">
            <div 
              className="rounded-lg overflow-hidden shadow-xl bg-white flex items-center justify-center"
              style={{ width: `${previewDims.width}px`, height: `${previewDims.height}px` }}
            >
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={selectedVariant?.title || "Preview"} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-[#98a2b3]">
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{selectedVariant ? `No ${selectedFormat} preview` : "Select a creative"}</span>
                </div>
              )}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}

