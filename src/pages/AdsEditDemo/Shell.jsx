"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { message, Skeleton, Switch } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import CrudService from "../../services/CrudService";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";
import AdVariantCard from "../AdsEdit/components/AdVariantCard";
import AdLibraryModal from "../AdsEdit/components/AdLibraryModal";
import AdEditModal from "../AdsEdit/components/AdEditModal";
import EmptyState from "../AdsEdit/components/EmptyState";
import AdPreviewDemo from "./AdPreviewDemo";

const AD_TYPES = [
  { id: "job", label: "Job Ad", description: "Direct apply ad to drive first visits" },
  { id: "employer-brand", label: "Employer Brand", description: "Team culture and mission" },
  { id: "testimonial", label: "Testimonial", description: "Employee stories and experiences" },
  { id: "company", label: "About Company", description: "EVP pitch and benefits" },
];

const AD_FORMATS = [
  { id: "story", label: "Vertical (9:16)", aspectRatio: "9:16", width: 1080, height: 1920 },
  { id: "square", label: "Square (1:1)", aspectRatio: "1:1", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait (4:5)", aspectRatio: "4:5", width: 1080, height: 1350 },
];

const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: "/icons/facebook.svg" },
  { id: "instagram", label: "Instagram", icon: "/icons/instagram.svg" },
  { id: "linkedin", label: "LinkedIn", icon: "/icons/linkedin.svg" },
  { id: "tiktok", label: "TikTok", icon: "/icons/tiktok.svg" },
];

export default function AdsEditDemoShell({ paramsId }) {
  const router = useRouter();
  const lpId = paramsId;
  const user = useSelector(selectUser);

  const [landingPageData, setLandingPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState("job");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [selectedFormat, setSelectedFormat] = useState("story");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [editingVariant, setEditingVariant] = useState(null);

  const [userBrandData, setUserBrandData] = useState(null);

  const handleGenerateAds = useCallback(async () => {
    if (!landingPageData) return;
    setGenerating(true);
    try {
      const generated = {};
      AD_TYPES.forEach((t) => {
        const count = t.id === 'job' ? 3 : 1;
        generated[t.id] = {
          variants: Array.from({ length: count }).map((_, i) => ({
            id: `${t.id}-variant-${i + 1}`,
            title: `${t.label} Variant ${i + 1}`,
            image: landingPageData?.heroImage || "",
            template: 'template-1',
            adTypeId: t.id,
            variantNumber: i + 1,
            selected: i === 0,
            approved: false,
          })),
          enabled: t.id === 'job',
        };
      });
      setAdsData(generated);
      setIsEmpty(false);
    } finally {
      setGenerating(false);
    }
  }, [landingPageData]);

  const fetchData = useCallback(() => {
    if (!lpId) return;
    setLoading(true);
    CrudService.getSingle("LandingPageData", lpId, "ads edit demo")
      .then((res) => {
        if (res.data) {
          setLandingPageData(res.data);
          if (!res.data.adsData || Object.keys(res.data.adsData).length === 0) {
            setIsEmpty(true);
            setAdsData(null);
          } else {
            setIsEmpty(false);
            setAdsData(res.data.adsData);
            const firstAdType = AD_TYPES[0].id;
            const firstVariant = res.data.adsData[firstAdType]?.variants?.[0];
            if (firstVariant) setSelectedVariant(firstVariant.id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [lpId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (user) setUserBrandData({
      primaryColor: user.primaryColor,
      secondaryColor: user.secondaryColor,
      tertiaryColor: user.tertiaryColor,
      titleFont: user.titleFont,
      bodyFont: user.bodyFont,
      subheaderFont: user.subheaderFont,
      companyLogo: user.companyLogo,
      companyName: user.companyName,
    });
  }, [user]);

  const currentVariants = useMemo(() => adsData?.[selectedAdType]?.variants || [], [adsData, selectedAdType]);
  const variantForPreview = useMemo(() => currentVariants.find(v => v.id === selectedVariant) || currentVariants[0], [currentVariants, selectedVariant]);

  const handleVariantSelect = (variantId) => {
    setSelectedVariant(variantId);
    const updated = currentVariants.map(v => ({ ...v, selected: v.id === variantId }));
    setAdsData({ ...adsData, [selectedAdType]: { ...adsData[selectedAdType], variants: updated } });
  };

  const toggleAdType = (adTypeId) => {
    setAdsData({ ...adsData, [adTypeId]: { ...adsData[adTypeId], enabled: !adsData[adTypeId].enabled } });
  };

  if (loading || !landingPageData) return (<div className="flex items-center justify-center min-h-screen"><Skeleton active /></div>);

  if (isEmpty) {
    return (
      <>
        <ApplyCustomFont landingPageData={{ ...landingPageData, ...userBrandData }} />
        <div className="flex flex-col h-screen bg-[#f8f8f8]">
          <div className="bg-white px-8 py-6 border-b border-[#eaecf0] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => router.push(`/lp-editor/${lpId}/form`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#98a2b3] rounded-full" />
                  <span className="font-semibold text-base text-[#475467]">{landingPageData?.vacancyTitle}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1"><EmptyState onGenerate={handleGenerateAds} loading={generating} /></div>
        </div>
      </>
    );
  }

  return (
    <>
      <ApplyCustomFont landingPageData={{ ...landingPageData, ...userBrandData }} />
      <div className="flex flex-col h-screen bg-[#f8f8f8]">
        <div className="bg-white px-8 py-6 border-b border-[#eaecf0] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push(`/lp-editor/${lpId}/form`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0a8f63] rounded-full" />
                <span className="font-semibold text-base text-[#475467]">{landingPageData?.vacancyTitle}</span>
              </div>
              <Switch checked={adsData?.[selectedAdType]?.enabled} onChange={() => toggleAdType(selectedAdType)} size="small" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a8f63] hover:bg-[#099152] text-white font-semibold text-sm rounded-[15px] border border-[#0a8f63] transition-colors shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect width="16" height="16" rx="8" fill="white" opacity="0.2" /><path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Approve All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-8 py-6">
          <div className="bg-white border border-[#eaecf0] rounded-xl h-full overflow-hidden flex">
            {/* Left types and middle variant list are identical to AdsEdit */}
            <div className="bg-white border-r border-[#eceef5] flex flex-col items-center pt-8 pb-6 px-4 gap-6 flex-shrink-0">
              <h2 className="font-semibold text-xl text-black leading-5">Ad Types</h2>
              <div className="flex flex-col gap-2">
                {AD_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setSelectedAdType(t.id)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedAdType === t.id ? 'bg-[#eff8ff]' : 'hover:bg-gray-50'}`}>
                    <span className="text-xs font-semibold text-[#667085]">{t.label[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-[486px] bg-white border-r border-[#eceef5] flex flex-col h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <h2 className="font-semibold text-xl text-black leading-5">{selectedAdType.toString()}</h2>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#0a8f63] rounded-full" /><span className="font-semibold text-sm text-[#475467] leading-5">{currentVariants.length} variants</span></div>
                </div>
                <div className="h-[1px] bg-[#eaecf0] mb-5 flex-shrink-0" />
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
                  {currentVariants.map((variant) => (
                    <AdVariantCard key={variant.id} variant={variant} selected={variant.selected || variant.id === selectedVariant} isEditing={editingVariant?.id === variant.id} onSelect={() => handleVariantSelect(variant.id)} onEdit={() => { }} onSave={() => { }} onDelete={() => { }} onReplace={() => { }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Live preview using demo preview */}
            <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="font-semibold text-xl text-black leading-5 capitalize">Live preview</h2>
                    <button className="flex items-center gap-2 hover:bg-gray-50 px-0 py-1 rounded transition-colors w-fit">
                      <img src={PLATFORMS.find(p => p.id === selectedPlatform)?.icon} alt="" className="w-[18px] h-[18px]" />
                      <span className="font-semibold text-sm text-[#475467] leading-5">{PLATFORMS.find(p => p.id === selectedPlatform)?.label}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {AD_FORMATS.map((f) => (
                      <button key={f.id} onClick={() => setSelectedFormat(f.id)} className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border ${selectedFormat === f.id ? 'bg-[#5207CD] text-white border-[#5207CD]' : 'bg-white text-[#344054] border-[#d0d5dd] hover:bg-gray-50'}`}>{f.label}</button>
                    ))}
                  </div>
                </div>
                <div className="h-[1px] bg-[#eaecf0] mb-8 flex-shrink-0" />
                <div className="flex-1 overflow-y-auto flex items-start justify-center min-h-0">
                  {variantForPreview && (
                    <AdPreviewDemo variant={variantForPreview} format={AD_FORMATS.find(f => f.id === selectedFormat)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use existing modals to keep UI parity; they can be no-ops in demo */}
      <AdLibraryModal open={isLibraryModalOpen} onClose={() => setIsLibraryModalOpen(false)} onSelect={() => setIsLibraryModalOpen(false)} platform={selectedPlatform} format={selectedFormat} adType={selectedAdType} />
      <AdEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} variant={variantForPreview} onSave={() => setIsEditModalOpen(false)} />
    </>
  );
}


