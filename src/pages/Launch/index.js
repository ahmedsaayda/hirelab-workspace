import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { Skeleton, message, DatePicker, InputNumber, Select, Switch, Modal, Input, Slider } from "antd";
import { FaFacebook, FaGoogle, FaLinkedin, FaTiktok, FaSnapchat, FaInstagram } from "react-icons/fa";
import { Check, ChevronRight, AlertCircle, TrendingUp, Users, Target, BarChart2, RefreshCw, Calendar, Clock, DollarSign, Zap, MapPin, Search, Plus, X } from "lucide-react";
import AdsLaunchService from "../../services/AdsLaunchService";
import AdsService from "../../services/AdsService";
import Header from "../Dashboard/Vacancies/components/components/Header";
import { Heading } from "../Dashboard/Vacancies/components/components";
import dayjs from "dayjs";

export default function Launch({ paramsId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  let lpId = paramsId || router.query.lpId;
  let isDemo = router.query.demo === 'true' || searchParams?.get('demo') === 'true';
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
  const [datePreset, setDatePreset] = useState("last_7d");
  const [activeStep, setActiveStep] = useState("settings"); // settings | audience | creatives | overview
  const [launching, setLaunching] = useState(false);
  const [launchDailyBudget, setLaunchDailyBudget] = useState(null);

  const reload = async () => {
    if (!lpId) return;
    try {
      const params = { date_preset: datePreset };
      if (testId) params.test_id = testId;
      const res = await AdsLaunchService.getSummary(lpId, params);
      setSummary(res?.data?.data || null);
    } catch (e) {
      message.error("Failed to load campaign summary");
    } finally {
      setLoading(false);
    }
  };


  const [audienceLocations, setAudienceLocations] = useState([]);
  const [audienceKeywords, setAudienceKeywords] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    reload();
  }, [lpId, datePreset]);

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

  const getOverviewData = () => {
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
    const channels = summary?.adSets?.map(adSet => ({
        name: adSet.name || "Channel",
        daily: formatCurrency(adSet.daily_budget ? Number(adSet.daily_budget)/100 : 0),
        total: "—",
        color: (adSet.name?.toLowerCase().includes("google")) ? "green" : "blue", // Default to blue (Meta) as it's the primary platform
        icon: (adSet.name?.toLowerCase().includes("google")) ? <FaGoogle className="text-2xl text-green-600" /> : <FaFacebook className="text-2xl text-blue-600" />
    })) || [];

    return {
        year: new Date().getFullYear(),
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // dynamic?
        role: campaignName,
        dateRange: summary?.campaign?.start_time ? `${dayjs(summary.campaign.start_time).format('DD/MM/YYYY')} - ${summary.campaign.stop_time ? dayjs(summary.campaign.stop_time).format('DD/MM/YYYY') : 'Ongoing'}` : "—",
        totalBudget: formatCurrency(summary?.campaign?.daily_budget ? Number(summary.campaign.daily_budget)/100 : 0), // simplistic
        channels: channels,
        summary: {
           budget: "—",
           budgetNote: "",
           targetArea: "—",
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

    // Real data mapping
    return {
        optimizationGoal: summary?.campaign?.objective || "OUTCOME_TRAFFIC",
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
            total: summary?.campaign?.daily_budget ? Number(summary.campaign.daily_budget)/100 * 14 : 300, // approx
            daily: summary?.campaign?.daily_budget ? Number(summary.campaign.daily_budget)/100 : 20,
            split: []
        },
        prediction: {
            reach: reach,
            cpa: cpc
        },
        pacing: "Standard",
        suggestion: null,
        schedule: {
            start: summary?.campaign?.start_time ? dayjs(summary.campaign.start_time) : null,
            end: summary?.campaign?.stop_time ? dayjs(summary.campaign.stop_time) : null
        },
        aiInsights: {
            text: "AI insights will appear here once the campaign is active.",
            recommendations: null
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

    return {
        locations: summary?.campaign?.targeting?.geo_locations?.countries?.map(c => ({ name: c, radius: "Country", map: null })) || [],
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
    const data = getAudienceData();
    setAudienceLocations(data.locations);
    setAudienceKeywords(data.keywords);
  }, [isDemo, summary]);

  // Keep Launch header in sync with Meta campaign status and title
  useEffect(() => {
    if (!summary) return;
    const isActive = summary?.campaign?.status === "ACTIVE";
    const inferredTitle =
      summary?.vacancyTitle || summary?.campaign?.name || landingPageData?.vacancyTitle || "";
    setLandingPageData((prev) => ({
      ...(prev || {}),
      vacancyTitle: inferredTitle,
      published: isActive,
    }));
  }, [summary]);

  if (!lpId || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton active />
      </div>
    );
  }

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setAudienceLocations([...audienceLocations, { 
        name: newLocation, 
        radius: "30 KM", 
        map: `https://placehold.co/400x256/e2e8f0/94a3b8?text=${encodeURIComponent(newLocation)}+Map`
      }]);
      setNewLocation("");
      setIsLocationModalOpen(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setAudienceKeywords([...audienceKeywords, { name: newKeyword, color: "purple" }]);
      setNewKeyword("");
      setIsKeywordModalOpen(false);
    }
  };

  const handleRemoveLocation = (index) => {
    const newLocs = [...audienceLocations];
    newLocs.splice(index, 1);
    setAudienceLocations(newLocs);
  };

  const handleRemoveKeyword = (index) => {
    const newKeys = [...audienceKeywords];
    newKeys.splice(index, 1);
    setAudienceKeywords(newKeys);
  };

  const handleRadiusChange = (value, index) => {
      const newLocs = [...audienceLocations];
      newLocs[index].radius = `${value} KM`;
      setAudienceLocations(newLocs);
  };

  const audienceData = getAudienceData(); // Keep for other static parts, but use state for interactive parts
  const settingsData = getSettingsData();
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

      // Use budget & schedule from settings (or overrides) when launching
      const settings = getSettingsData();
      const effectiveDaily =
        launchDailyBudget != null ? Number(launchDailyBudget) : Number(settings?.budget?.daily || 0);
      const budgetMinor = Math.max(1, Math.floor(effectiveDaily * 100)); // Meta expects minor units

      const schedule = settings?.schedule || {};
      const startIso =
        schedule.start && schedule.start.toISOString ? schedule.start.toISOString() : null;
      const endIso =
        schedule.end && schedule.end.toISOString ? schedule.end.toISOString() : null;

      const payload = { adIds: ids, budget: budgetMinor };
      if (startIso) payload.start_time = startIso;
      if (endIso) payload.end_time = endIso;

      const res = await AdsService.publish(lpId, payload);
      if (res?.data?.success) {
        message.success("Campaign launch requested");
        await reload();
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
          setPublished={setCampaignPublished}
          setLandingPageData={setLandingPageData}
          reload={reload}
          lpId={lpId}
          customActions={
            <div className="flex gap-2 items-center">
              <span className="text-xs text-[#667085]">Meta campaign status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  summary?.campaign?.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {summary?.campaign?.status || "Not Created"}
              </span>
            </div>
          }
        />
      </div>

      <div className="overflow-y-auto flex-1 px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-gray-200 bg-white h-fit shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-4 text-lg font-semibold text-gray-800">Campaign Setup</div>
              <div className="space-y-2">
              {["settings", "audience", "creatives", "overview"].map((step, idx) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                    activeStep === step ? "bg-violet-50" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold ${
                      activeStep === step
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
                className={`flex gap-2 justify-center items-center py-3 mt-6 w-full text-base font-semibold rounded-lg transition-colors ${
                  launching
                    ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                    : "text-white bg-green-500 hover:bg-green-600"
                }`}
              >
                <span className="text-lg">🚀</span> {launching ? "Launching..." : "Launch Campaign"}
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
                      <div className="text-base font-semibold leading-tight text-gray-800">Optimization<br/>Recommendations</div>
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

                 {settingsData.aiInsights.recommendations && (
                 <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-2 items-center mb-4">
                       <TrendingUp className="w-4 h-4 text-violet-700" />
                       <div className="text-base font-semibold text-gray-700">Optimization Recommendations</div>
                    </div>
                    
                    <div className="mb-4">
                       <div className="mb-1 text-sm font-semibold text-gray-600">{settingsData.aiInsights.recommendations.title}</div>
                       <div className="text-xs leading-relaxed text-gray-400">
                          {settingsData.aiInsights.recommendations.desc}
                       </div>
                    </div>

                    <div className="space-y-3">
                       {settingsData.aiInsights.recommendations.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                             <div className="flex gap-2 items-center">
                                <span className="flex justify-center w-4">{item.icon}</span>
                                <span className="text-sm text-gray-600">{item.name}</span>
                             </div>
                             <span className="text-sm font-medium text-gray-600">{item.pct}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 )}

                 <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <div className="mb-3 text-sm font-semibold text-gray-600">Campaign Pacing</div>
                    <div className="flex flex-col gap-2">
                       {['Balanced Plan', 'Aggressive Plan', 'Lite Plan'].map((plan) => (
                          <button 
                             key={plan}
                             className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-left transition-colors border ${
                                settingsData.pacing === plan 
                                ? 'bg-violet-50 border-violet-700 text-violet-800' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                             }`}
                          >
                             {plan}
                          </button>
                       ))}
                    </div>
                 </div>

                 {settingsData.suggestion && (
                 <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <div className="mb-3 text-sm font-semibold text-gray-600">Quick Suggestions</div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">{settingsData.suggestion.text}</span>
                       <button className="px-4 py-1.5 text-sm font-semibold text-violet-700 bg-violet-50 rounded-md transition-colors hover:bg-violet-100">
                          {settingsData.suggestion.action}
                       </button>
                    </div>
                 </div>
                 )}
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
              <div className="flex gap-3 items-center">
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
              </div>
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
                            {[1,2,3,4,5,6].map(i => (
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
                 {/* Objectives */}
                 <div className="flex gap-6">
                    <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                       <div className="flex gap-3 items-center mb-4">
                          <Target className="w-4 h-4 text-violet-700" />
                          <div className="text-base font-semibold text-gray-700">Optimization Goal</div>
                       </div>
                       <Select 
                          value={settingsData.optimizationGoal}
                          className="w-full h-11"
                          options={[
                             { label: 'Apply Now (Conversion)', value: 'Apply Now (Conversion)' },
                             { label: 'Traffic', value: 'OUTCOME_TRAFFIC' },
                             { label: 'Leads', value: 'LEADS' }
                          ]}
                       />
                    </div>
                    <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                       <div className="flex gap-3 items-center mb-4">
                          <Target className="w-4 h-4 text-violet-700" />
                          <div className="text-base font-semibold text-gray-700">Optimization Goal</div>
                       </div>
                       <div className="px-4 py-3 text-base text-gray-700 bg-white rounded-lg border border-gray-200">
                          {settingsData.optimizationGoal}
                       </div>
                    </div>
                 </div>

                 {/* Platform Allocation */}
                 <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-3 items-center mb-2">
                       <Users className="w-5 h-5 text-violet-700" />
                       <div className="text-xl font-bold text-gray-800">Platform Allocation</div>
                    </div>
                    <div className="mb-6 text-sm text-gray-500">
                      Currently, only Meta platforms are supported. Other platforms are coming soon.
                    </div>
                    
                    <div className="flex overflow-x-auto gap-4 pb-2">
                       {settingsData.platforms.map((p, i) => (
                          <div
                            key={i}
                            className={`shrink-0 w-[149px] h-[112px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 border transition-all ${
                              p.disabled
                                ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                : p.selected
                                ? "bg-violet-50 border-indigo-400 shadow-sm cursor-default"
                                : "bg-white border-gray-200 hover:border-indigo-200 cursor-pointer"
                            }`}
                          >
                             <div className="text-3xl">{p.icon}</div>
                             <div className="text-sm font-medium text-gray-700">{p.name}</div>
                             {p.disabled && (
                               <div className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-500">
                                 {p.label || "Coming soon"}
                               </div>
                             )}
                          </div>
                       ))}
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
                                <div className="mb-2 text-sm font-medium text-gray-600">Total Budget (approx.)</div>
                                <div className="relative">
                                   <input 
                                      type="text" 
                                      value={`€ ${
                                        (launchDailyBudget != null
                                          ? Number(launchDailyBudget)
                                          : Number(settingsData.budget.total || 0)
                                        ).toFixed(2)
                                      }`}
                                      className="px-4 w-full h-11 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-500"
                                      readOnly
                                   />
                                </div>
                             </div>
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
                                      onChange={(val) => setLaunchDailyBudget(val)}
                                      className="w-full h-11 [&_.ant-input-number-input]:h-11 [&_.ant-input-number-input]:px-4"
                                      controls={false}
                                    />
                                </div>
                             </div>
                          </div>

                          <div>
                             <div className="mb-3 text-sm font-medium text-gray-600">Channel Split</div>
                             <div className="flex gap-4">
                                {settingsData.budget.split.map((s, i) => (
                                   <div key={i} className="flex gap-2 items-center px-3 py-2 bg-white rounded-lg border border-gray-200">
                                      {s.name === 'Meta' && <FaFacebook className="text-gray-600" />}
                                      {s.name === 'Instagram' && <FaInstagram className="text-gray-600" />}
                                      {s.name === 'Others' && <span className="text-gray-600">+</span>}
                                      <span className="text-sm text-gray-600">{s.name}</span>
                                      <span className="pl-2 ml-1 text-sm font-bold text-gray-700 border-l border-gray-200">{s.pct}%</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col justify-center items-center p-5 w-80 text-center bg-violet-50 rounded-xl">
                          <div className="mb-1 text-sm font-medium text-violet-800">Live AI Prediction</div>
                          <div className="mb-1 text-3xl font-bold text-violet-700">{settingsData.prediction.reach}</div>
                          <div className="mb-2 text-sm font-medium text-violet-800">Estimated Reach</div>
                          <div className="px-3 py-1 text-xs text-violet-600 bg-violet-100 rounded-full">
                             CPA: {settingsData.prediction.cpa}
                          </div>
                       </div>
                    </div>
                 </div>

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
                             <input 
                                type="text" 
                                value={settingsData.schedule.start ? settingsData.schedule.start.format('DD-MM-YYYY') : ''}
                                className="px-4 w-full h-11 text-gray-900 rounded-lg border border-gray-200"
                                readOnly
                             />
                             <Calendar className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
                          </div>
                       </div>
                       <div className="flex-1">
                          <div className="mb-2 text-sm font-medium text-gray-600">End Date</div>
                          <div className="relative">
                             <input 
                                type="text" 
                                value={settingsData.schedule.end ? settingsData.schedule.end.format('DD-MM-YYYY') : ''}
                                className="px-4 w-full h-11 text-gray-900 rounded-lg border border-gray-200"
                                readOnly
                             />
                             <Calendar className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
                          </div>
                       </div>
                       <div className="pb-3 w-40">
                          <div className="text-sm font-medium text-gray-600">Duration</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeStep === "audience" && (
              <div className="space-y-6">
                 {/* Location Targeting */}
                 <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                       <MapPin className="w-5 h-5 text-gray-700" />
                       <div className="text-xl font-bold text-gray-800">Location Targeting</div>
                    </div>
                    
                    <div className="flex overflow-x-auto gap-6 pb-4">
                       {audienceLocations.map((loc, i) => (
                          <div key={i} className="flex relative flex-col items-center p-4 w-56 bg-white rounded-xl border border-gray-200 shadow-sm shrink-0 group">
                             <button 
                                onClick={() => handleRemoveLocation(i)}
                                className="absolute top-2 right-2 p-1 text-gray-400 bg-white rounded-full shadow-sm opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                             >
                                <X className="w-3 h-3" />
                             </button>
                             <div className="overflow-hidden relative mb-3 w-full h-36 bg-gray-100 rounded-lg">
                                {/* Using iframe for "map integration" feeling */}
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    scrolling="no" 
                                    marginHeight="0" 
                                    marginWidth="0" 
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&marker=${encodeURIComponent(loc.name)}`} // Very basic global map if coords unknown, but shows map interface
                                    style={{ pointerEvents: 'none' }} // Disable interaction to keep it as "preview"
                                ></iframe>
                                <div className="absolute inset-0 bg-black/5"></div> {/* Overlay to make text readable if needed or just consistent look */}
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
                          className="flex flex-col justify-center items-center w-56 bg-white rounded-xl border-2 border-gray-300 border-dashed transition-colors cursor-pointer shrink-0 hover:bg-gray-50"
                          onClick={() => setIsLocationModalOpen(true)}
                       >
                          <div className="flex justify-center items-center mb-3 w-12 h-12 bg-gray-100 rounded-full">
                             <Plus className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="text-base font-semibold text-gray-600">Add location</div>
                       </div>
                    </div>
                 </div>

                 <Modal title="Add Location" open={isLocationModalOpen} onOk={handleAddLocation} onCancel={() => setIsLocationModalOpen(false)}>
                    <Input placeholder="Enter city name (e.g. London)" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} onPressEnter={handleAddLocation} />
                 </Modal>

                 {/* Inclusive & Automated Demographics */}
                 <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex gap-3 items-center mb-2">
                       <Users className="w-5 h-5 text-gray-700" />
                       <div className="text-base font-semibold text-gray-800">Inclusive & Automated Demographics</div>
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                       Employer Ads are automatically optimized for inclusive reach. Age, gender, and personal attributes are excluded to ensure fair opportunity.
                    </div>
                    <div className="text-xs text-gray-400">Compliance with EU Equal Opportunity Laws</div>
                 </div>

                 {/* Keywords */}
                 <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex gap-2 items-center">
                          <div className="text-base font-semibold text-gray-800">Keywords</div>
                          <Search className="w-3 h-3 text-gray-400" />
                       </div>
                       <button 
                          className="flex gap-2 items-center text-sm font-semibold text-violet-700 hover:text-violet-800"
                          onClick={() => setIsKeywordModalOpen(true)}
                       >
                          <Plus className="w-3 h-3" /> Add Keyword
                       </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                       {audienceKeywords.map((k, i) => (
                          <div key={i} className="flex gap-2 items-center px-3 py-1.5 bg-gray-100 rounded-lg group">
                             <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                             <span className="text-sm font-medium text-gray-700">{k.name}</span>
                             <button onClick={() => handleRemoveKeyword(i)} className="ml-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100">
                                <X className="w-3 h-3" />
                             </button>
                          </div>
                       ))}
                       {audienceData.keywordsCount && (
                          <div className="flex justify-center items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg">
                             {audienceData.keywordsCount}
                          </div>
                       )}
                    </div>
                 </div>

                 <Modal title="Add Keyword" open={isKeywordModalOpen} onOk={handleAddKeyword} onCancel={() => setIsKeywordModalOpen(false)}>
                    <Input placeholder="Enter keyword (e.g. Leadership)" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onPressEnter={handleAddKeyword} />
                 </Modal>

                 {/* Retargeting & AI Targeting */}
                 <div className="flex gap-6">
                    <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <div className="flex gap-3 items-center mb-1">
                                <RefreshCw className="w-4 h-4 text-gray-700" />
                                <div className="text-base font-semibold text-gray-800">Retargeting Activation</div>
                             </div>
                             <div className="mb-1 text-sm text-gray-600">Activate Retargeting</div>
                             <div className="text-xs text-gray-400">
                                {audienceData.retargeting.desc} <span className="font-semibold text-gray-500">{audienceData.retargeting.threshold}</span> visitors
                             </div>
                          </div>
                          <Switch defaultChecked={audienceData.retargeting.active} className="bg-emerald-500" />
                       </div>
                    </div>

                    <div className="flex-1 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                       <div className="flex gap-3 items-center mb-4">
                          <Target className="w-4 h-4 text-gray-700" />
                          <div className="text-base font-semibold text-gray-800">AI Targeting</div>
                       </div>
                       <div className="mb-4 text-sm text-gray-600">Targeting includes people who recently interacted with:</div>
                       <div className="space-y-2">
                          {audienceData.aiTargeting.map((t, i) => (
                             <div key={i} className="flex gap-3 items-center">
                                <Check className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-700">{t.label}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Audience Layers */}
                 <div className="flex gap-8 items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col gap-4 items-center w-1/3">
                       <div className="flex gap-3 items-center">
                          <Users className="w-4 h-4 text-gray-700" />
                          <div className="text-base font-semibold text-gray-800">Audience Layers</div>
                       </div>
                       <div className="relative w-48 h-48">
                          <div className="absolute inset-0 bg-purple-100 rounded-full"></div>
                          <div className="absolute inset-4 bg-purple-300 rounded-full"></div>
                          <div className="absolute inset-8 bg-violet-700 rounded-full"></div>
                       </div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                          <div className="flex gap-3 items-center mb-1">
                             <div className="w-3 h-3 bg-violet-700 rounded-full"></div>
                             <div className="text-sm font-semibold text-gray-800">Warm Audience</div>
                          </div>
                          <div className="ml-6 text-sm text-gray-500">{audienceData.layers.warm}</div>
                       </div>
                       <div>
                          <div className="flex gap-3 items-center mb-1">
                             <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                             <div className="text-sm font-semibold text-gray-800">Lookalike Audience</div>
                          </div>
                          <div className="ml-6 text-sm text-gray-500">{audienceData.layers.lookalike}</div>
                       </div>
                       <div>
                          <div className="flex gap-3 items-center mb-1">
                             <div className="w-3 h-3 bg-purple-100 rounded-full"></div>
                             <div className="text-sm font-semibold text-gray-800">Cold Audience</div>
                          </div>
                          <div className="ml-6 text-sm text-gray-500">{audienceData.layers.cold}</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeStep === "creatives" && (
              <div>
                <div className="text-sm font-semibold text-[#101828] mb-2">Creatives (from Ads Editor)</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.keys(summary?.editorAds || {})
                    .filter((k) => k !== "_publish")
                    .map((adType) => (summary.editorAds[adType]?.variants || []).map((v) => {
                      const img = v.publishImage || v.image;
                      const isPublished = !!v?.publish?.adId;
                      return (
                        <div key={`${adType}-${v.id}`} className="rounded-lg border border-[#eaecf0] overflow-hidden">
                          <div className="bg-gray-50 aspect-square">
                            {img ? (
                              <img src={img} alt={v.title} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#98a2b3] text-xs">No image</div>
                            )}
                          </div>
                          <div className="p-2 text-xs">
                            <div className="font-medium truncate">{v.title || v.id}</div>
                            <div className={`inline-block mt-1 px-2 py-0.5 rounded-full border ${isPublished ? "text-[#0a8f63] border-[#0a8f63]" : "text-[#475467] border-[#98a2b3]"}`}>
                              {isPublished ? "Published" : "Draft"}
                            </div>
                          </div>
                        </div>
                      );
                    })) }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


