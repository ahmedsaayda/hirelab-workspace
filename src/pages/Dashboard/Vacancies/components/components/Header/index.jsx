import { Modal, Switch, Input, Spin } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MegaMenu1 from "../MegaMenu1";
import { Heading, Img } from "..";
import { ChartPieIcon, HomeIcon, UsersIcon, UserGroupIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { EyeOutlined, LinkOutlined, LoadingOutlined } from "@ant-design/icons";

import CrudService from "../../../../../../services/CrudService";
import { message } from "antd";
import LandingPageService from "../../../../../../services/landingPageService";
import { Button } from "../../../../../Landing/Button";

export default function Header({
  landingPageData,
  setPublished,
  setLandingPageData,
  reload,
  isAutoSaving,
  lastSaved,
  lpId,
  isFormEditor = false,
  isAdsEditor = false,
  hasUnpublishedChanges = false, // 🔥 NEW: Passed from parent
  onNavigateAttempt,
  onOpenFormSettings,
  onOpenSettings,
  customActions,
  hideSettings = false,
  hideLaunchNav = false,
  backLinkOverride = null,
  ...props
}) {
  const router = useRouter();
  const [templateMenu, setTemplateMenu] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [publishConfirmVisible, setPublishConfirmVisible] = useState(false);
  const [ctaLink, setCtaLink] = useState("");
  const [initialCtaLink, setInitialCtaLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [applyLinkModalVisible, setApplyLinkModalVisible] = useState(false);
  const [formBuilderPopupVisible, setFormBuilderPopupVisible] = useState(false);

  // Initialize CTA link from landingPageData
  useEffect(() => {
    if (landingPageData) {
      setCtaLink(landingPageData.cta2Link || '#apply');
      setInitialCtaLink(landingPageData.cta2Link || '#apply');
    }
  }, [landingPageData]);

  const handleSave = async () => {
    console.log("landingPageData", landingPageData?.companyLogo);
    console.log("landingPageData", landingPageData?.vacancyTitle);

    try {
      await CrudService.update("LandingPageData", lpId, {
        ...landingPageData,
      });
      message.success("Landing page saved successfully!");
    } catch (error) {
      console.log("error", error);
      message.error("Failed to save: " + (error.message || "Unknown error"));
    }
  };

  const handlePublish = async () => {
    if (!landingPageData?.cta2Link) {
      setCtaLink(landingPageData?.cta2Link || '');
      setApplyLinkModalVisible(true);
      return;
    }
    
    // Check if this is the first time publishing (user has never published before)
    // BUT skip this modal if we're already in the form editor
    // Also skip for multi-job campaigns since they don't need application forms
    const isMultiJobCampaign = landingPageData?.campaignType === "multi" || 
      (Array.isArray(landingPageData?.linkedCampaigns) && landingPageData.linkedCampaigns.length > 0);
    
    if (!landingPageData?.published && !isFormEditor && !isMultiJobCampaign) {
      setFormBuilderPopupVisible(true);
      return;
    }
    
    setIsPublishing(true);

    try {
      const res = await LandingPageService.publishLandingPage(lpId, isFormEditor ? 'form' : 'page');
      console.log("Publish response:", res);
      
      // Wait a moment then reload to ensure we get the latest data
      setTimeout(() => {
        reload();
        // Force clear any stale unpublished changes indicator after reload completes
        setTimeout(() => {
          if (res?.data?.published) {
            // Trigger a re-render to ensure published status is reflected
            window.dispatchEvent(new CustomEvent('published-status-updated'));
          }
        }, 300);
      }, 500);
    } catch (err) {
      message.error("Failed to publish: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  // Function to handle actual publishing without form check
  const handleActualPublish = async () => {
    setIsPublishing(true);

    try {
      const res = await LandingPageService.publishLandingPage(lpId, isFormEditor ? 'form' : 'page');
      console.log("Publish response:", res);
      
      // Wait a moment then reload to ensure we get the latest data
      setTimeout(() => {
        reload();
        // Force clear any stale unpublished changes indicator after reload completes
        setTimeout(() => {
          if (res?.data?.published) {
            // Trigger a re-render to ensure published status is reflected
            window.dispatchEvent(new CustomEvent('published-status-updated'));
          }
        }, 300);
      }, 500);
    } catch (err) {
      message.error("Failed to publish: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle form builder popup actions
  const handleFormBuilderChoice = (createForm) => {
    setFormBuilderPopupVisible(false);
    
    if (createForm) {
      // Redirect to form editor
      router.push(`/form-editor/${lpId}`);
    } else {
      // Just publish without form
      handleActualPublish();
    }
  };

  const handleTemplateOpen = () => {
    setCtaLink(landingPageData.cta2Link || '');
    setInitialCtaLink(landingPageData.cta2Link || '');
    setTemplateMenu(true);
  };

  const handleSaveCtaLink = () => {
    CrudService.update("LandingPageData", lpId, {
      cta2Link: ctaLink
    }).then(() => {
      setLandingPageData((d) => ({
        ...d,
        cta2Link: ctaLink
      }));
      setInitialCtaLink(ctaLink);
      message.success("Apply button URL updated successfully");
      reload();
    }).catch(err => {
      message.error("Failed to update Apply button URL: " + (err.message || "Unknown error"));
    });
  };

  const handleSaveAndPublish = async () => {
    if (!ctaLink.trim()) {
      message.warning("Please enter a valid URL");
      return;
    }

    try {
      // Save the apply link first
      await CrudService.update("LandingPageData", lpId, {
        cta2Link: ctaLink
      });
      
      setLandingPageData((d) => ({
        ...d,
        cta2Link: ctaLink
      }));
      
      setApplyLinkModalVisible(false);
      message.success("Apply button URL updated successfully");
      
      // Now proceed with publishing
      setIsPublishing(true);
      
      const res = await LandingPageService.publishLandingPage(lpId, isFormEditor ? 'form' : 'page');
      console.log("Publish response:", res);
      
      // Wait a moment then reload to ensure we get the latest data
      setTimeout(() => {
        reload();
        // Force clear any stale unpublished changes indicator after reload completes
        setTimeout(() => {
          if (res?.data?.published) {
            // Trigger a re-render to ensure published status is reflected
            window.dispatchEvent(new CustomEvent('published-status-updated'));
          }
        }, 300);
      }, 500);
      
    } catch (err) {
      message.error("Failed to publish: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    const generatedLink = `${process.env.NEXT_PUBLIC_LIVE_URL}/lp/${lpId}`;
    navigator.clipboard.writeText(generatedLink).then(() => {
      message.success('Link copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy link to clipboard');
    });
  };

  // Function to check if a navigation item is active
  const isNavItemActive = (itemId) => {
    const currentPath = router.pathname;
    
    switch (itemId) {
      case 'pageBuilder':
        return currentPath.includes('/edit-page/');
      case 'formBuilder':
        return currentPath.includes('/form-editor/');
      case 'adsEditor':
        return currentPath.includes('/lp-editor/') && currentPath.includes('/ads');
      case 'launch':
        return currentPath.includes('/launch/');
      case 'ats':
        return currentPath.includes('/dashboard/ats');
      default:
        return false;
    }
  };

  return (
    <header
      {...props}
      className={`${props.className} bg-white-A700 relative rounded-[20px] container-xs p-1 pe-2`}
    >
      <div className="flex gap-5 justify-between items-center w-full mdx:flex-col">
        <div className="flex items-center justify-left mdx:w-full">
          <Link href={backLinkOverride || (isFormEditor ? `/edit-page/${lpId}` : "/dashboard/vacancies")} onClick={(e) => {
            if (typeof onNavigateAttempt === 'function') {
              e.preventDefault();
              onNavigateAttempt(backLinkOverride || (isFormEditor ? `/edit-page/${lpId}` : "/dashboard/vacancies"));
            }
          }}>
            <Img
              src="/images/img_arrow_right_blue_gray_400.svg"
              alt="arrowright"
              className="h-[24px] w-[24px] ml-6 cursor-pointer"
            />
          </Link>
          <div className="flex flex-1 gap-2 justify-start items-center ml-12">
            <div
              className={`h-[8px] w-[8px] rounded ${landingPageData?.published ? "bg-green-A700" : "bg-gray-400"
                }`}
            />

            <Heading
              size="3xl"
              as="h6"
              className="!text-blue_gray-700 whitespace-nowrap"
            >
              {landingPageData?.vacancyTitle}
            </Heading>
            
            {/* 🔥 SIMPLIFIED: Show unpublished changes indicator when passed from parent */}
            {landingPageData?.published && hasUnpublishedChanges && (
              <div className="ml-3 flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 border border-amber-200 shadow-sm" title="There are unpublished changes. Click Publish to update the live page.">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium whitespace-nowrap">Unpublished changes</span>
              </div>
            )}
          </div>
          <Switch
            className="ml-3.5"
            size="small"
            checked={landingPageData?.published}
            onChange={(e) => setPublished(e)}
          />
          {!hideSettings &&
            <Img
            src="/images/settings-02.svg"
            alt="settings"
            className="h-[20px] w-[20px] ml-3.5 cursor-pointer settings-icon"
            onClick={() => {
              if (onOpenSettings) {
                onOpenSettings();
              } else if (isFormEditor && typeof onOpenFormSettings === "function") {
                onOpenFormSettings();
              } else {
                handleTemplateOpen();
              }
            }}
          />
          }
          {null}
        </div>
        <div className="flex justify-between items-center w-full mdx:flex-col mdx:gap-3">
          {/* Left side - Publish button + status */}
          <div className="flex items-center mdx:w-full mdx:justify-center ml-2">
            {customActions ? customActions : (
              <>
                <div className={`flex items-center gap-2 rounded-lg border border-solid px-2 py-[10px] shadow-sm ${
                  landingPageData?.published && !hasUnpublishedChanges ? "bg-[#ECFDF3]" : "bg-[#5207CD]"
                } mdx:w-full mdx:justify-center`}>
                  <button
                    onClick={!(isPublishing || isSaving || isAutoSaving) ? handlePublish : undefined}
                    className={`flex gap-2  items-center ${(isPublishing || isSaving || isAutoSaving) ? 'cursor-default' : 'cursor-pointer'} mdx:justify-center`}
                    disabled={isPublishing || isSaving || isAutoSaving}
                  >
                    {(isSaving || isAutoSaving) ? (
                      <Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 16, color: '#FFFFFF' }} spin />} />
                    ) : isPublishing ? (
                      <Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 16, color: '#FFFFFF' }} spin />} />
                    ) : (landingPageData?.published && !hasUnpublishedChanges ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#17B26A" />
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
                        <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="white" />
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
                        <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="#5207CD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    ))}
                    <Heading
                      size="3xl"
                      as="p"
                      className={landingPageData?.published && !hasUnpublishedChanges ? "!text-[#039855]" : "!text-[#FFFFFF]"}
                    >
                      {(isSaving || isAutoSaving) ? "Saving..." : 
                      isPublishing ? "Publishing..." :
                      landingPageData?.published ? 
                        (hasUnpublishedChanges ? "Publish Changes" : "Published") : 
                        "Publish"}
                    </Heading>
                  </button>
                </div>
                {landingPageData?.published && (
                  <button
                    onClick={handleCopyLink}
                    className="ml-2 flex items-center justify-center rounded-lg border border-solid px-2 py-[10px] shadow-sm bg-[#0080FF] hover:bg-[#0C7CE6]"
                    title="Copy public link"
                  >
                    <LinkOutlined style={{ fontSize: '16px', color: 'white' }} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right side - Navigation and Copy Link buttons */}
          <div className="flex items-center gap-3 mdx:w-full mdx:justify-center">
            <ul className="flex items-center gap-2 mdx:flex-wrap mdx:justify-center">
                  {[
                {
                  id: "pageBuilder",
                  label: "Page",
                  link: (id) => `/edit-page/${id}`,
                  bgColor: isNavItemActive("pageBuilder") ? "bg-[#5207CD]" : "bg-[#F3F0FF]",
                  textColor: isNavItemActive("pageBuilder") ? "!text-[#FFFFFF]" : "!text-[#5207CD]",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7.5" fill={isNavItemActive("pageBuilder") ? "white" : "#5207CD"} stroke={isNavItemActive("pageBuilder") ? "white" : "#5207CD"}/>
                      <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke={isNavItemActive("pageBuilder") ? "#5207CD" : "white"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  className: "rounded-lg",
                  disabled: false,
                },
                {
                  id: "formBuilder", 
                  label: "Form",
                  link: (id) => `/form-editor/${id}`,
                  bgColor: isNavItemActive("formBuilder") ? "bg-[#5207CD]" : "bg-[#F3F0FF]",
                  textColor: isNavItemActive("formBuilder") ? "!text-[#FFFFFF]" : "!text-[#5207CD]",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7.5" fill={isNavItemActive("formBuilder") ? "white" : "#5207CD"} stroke={isNavItemActive("formBuilder") ? "white" : "#5207CD"}/>
                      <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke={isNavItemActive("formBuilder") ? "#5207CD" : "white"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  className: "rounded-lg",
                  disabled: false,
                },
                {
                  id: "adsEditor",
                  label: "Ads", 
                  link: (id) => `/lp-editor/${id}/ads`,
                  bgColor: isNavItemActive("adsEditor") ? "bg-[#5207CD]" : "bg-[#F3F0FF]",
                  textColor: isNavItemActive("adsEditor") ? "!text-[#FFFFFF]" : "!text-[#5207CD]",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7.5" fill={isNavItemActive("adsEditor") ? "white" : "#5207CD"} stroke={isNavItemActive("adsEditor") ? "white" : "#5207CD"}/>
                      <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke={isNavItemActive("adsEditor") ? "#5207CD" : "white"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  className: "rounded-lg",
                  disabled: false,
                },

              ].filter((item) => {
                // Hide launch nav if specified
                if (hideLaunchNav && item.id === "launch") return false;
                // Hide Form tab for multi-job campaigns (they don't need application forms)
                const isMultiJob = landingPageData?.campaignType === "multi" || 
                  (Array.isArray(landingPageData?.linkedCampaigns) && landingPageData.linkedCampaigns.length > 0);
                if (isMultiJob && item.id === "formBuilder") return false;
                return true;
              }).map((item) => (
                <li key={item.id}>
                  <div
                    className={`flex items-center gap-2 border border-solid shadow-sm ${item.bgColor} ${item.className || "rounded-lg"} px-2 py-[10px] transition-all duration-200`}
                  >
                    {item.link ? (
                      <Link
                        href={item.link(lpId || landingPageData?._id)}
                        className="flex gap-2 justify-center items-center cursor-pointer w-full"
                        onClick={(e) => {
                          if (typeof onNavigateAttempt === 'function') {
                            e.preventDefault();
                            onNavigateAttempt(item.link(lpId || landingPageData?._id));
                          }
                        }}
                      >
                        {item.icon}
                        <Heading
                          size="3xl"
                          as="p"
                          className={item.textColor}
                        >
                          {item.label}
                        </Heading>
                      </Link>
                    ) : (
                      <button
                        onClick={item.action}
                        className="flex gap-2 items-center cursor-pointer w-full"
                        disabled={item.disabled}
                        title={item.tooltip}
                      >
                        {item.icon}
                        <Heading
                          size="3xl"
                          as="p"
                          className={item.textColor}
                        >
                          {item.label}
                        </Heading>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Modal
        open={templateMenu && !isFormEditor}
        onCancel={() => setTemplateMenu(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Landing Page Settings"
        width={800}
      >
        <div className="py-4">
          {/* Meta Pixel Configuration Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Analytics & Tracking</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Pixel ID (Facebook Pixel)
                </label>
                <Input
                  value={landingPageData?.metaPixelId || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLandingPageData((d) => ({ ...d, metaPixelId: value }));
                    CrudService.update("LandingPageData", lpId, {
                      metaPixelId: value,
                    });
                  }}
                  placeholder="Enter your Meta Pixel ID (e.g., 1234567890123456)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add your Meta Pixel ID to track conversions and optimize your ads. You can find this in your Facebook Ads Manager.
                </p>
              </div>
            </div>
          </div>

          {/* Template Selection Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose Template</h3>
            <div className="grid grid-cols-3 gap-6 justify-center mdx:grid-cols-2">
          {new Array(3).fill(0).map((a, i) => (
            <div
              key={i}
              className={`flex w-full flex-col items-start gap-5 rounded-lg border px-3.5 py-4 cursor-pointer ${landingPageData?.templateId === `${i + 1}`
                  ? "border-solid border-light_blue-A700 bg-gray-100_01"
                  : ""
              }`}
            >
              <div className="relative w-full group">
                <div className="overflow-hidden rounded-md">
                  <Img
                    src={`/images/template-thumbnails/TemplateHero${i + 1}.png`}
                    alt={`Template Hero ${i + 1}`}
                    className="h-[125px] w-full object-cover mdx:h-auto transition-all duration-300 group-hover:brightness-50 group-hover:scale-105"
                  />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="p-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <EyeOutlined className="text-transparent group-hover:text-white text-3xl transition-all duration-300" />
                  </div>
                </div>
              </div>
              <Heading
                size="4xl"
                as="h2"
                className="!text-gray-900 whitespace-nowrap"
              >
                Template {i + 1}
              </Heading>
              <div className="flex flex-col gap-3 self-stretch">
                <Button
                  onClick={() => {
                    if(i !== 0) {
                      return;
                    }
                    setLandingPageData((d) => ({
                      ...d,
                      templateId: `${i + 1}`,
                    }));
                    CrudService.update("LandingPageData", lpId, {
                      templateId: `${i + 1}`,
                    });
                    setTemplateMenu(false);
                    reload();
                  }}
                  disabled={i !== 0}
                  shape="round"
                  className={`w-full font-semibold  rounded-full smx:px-5 whitespace-nowrap ${i === 0
                      ? landingPageData?.templateId === `${i + 1}`
                        ? "bg-blue-500 text-[#FFFFFF]"
                        : "bg-[#FFFFFF] text-blue_gray-800_01 border rounded-full border-solid border-blue_gray-100"
                      : "bg-gray-200  cursor-not-allowed"
                  }`}
                >
                  {i === 0 ? "Choose Template" : "Coming Soon"}
                </Button>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Apply Link Modal */}
      <Modal
        title="Set Apply Button URL"
        open={applyLinkModalVisible}
        onCancel={() => setApplyLinkModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div className="py-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Before publishing your landing page, please set the URL where candidates will be directed when they click the Apply button.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apply Button URL *
            </label>
            <Input
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="https://example.com/apply"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              This should be your application form or job posting URL
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setApplyLinkModalVisible(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndPublish}
              disabled={!ctaLink.trim() || isPublishing}
              className={`px-4 py-2 rounded-md ${ctaLink.trim() && !isPublishing
                  ? 'bg-[#5207CD] text-white hover:bg-[#0C7CE6]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPublishing ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Publishing...
                </>
              ) : (
                'Save URL & Publish'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Form Builder Popup Modal */}
      <Modal
        title=""
        open={formBuilderPopupVisible}
        onCancel={() => setFormBuilderPopupVisible(false)}
        footer={null}
        destroyOnClose
        width={600}
        style={{ maxHeight: "80vh", overflowY: "auto", top: 20, marginTop: 0 }}
      >
        <div className="py-1">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Your landing page is ready to publish! To complete the candidate experience, we recommend creating an application form.
            </p>
            <p className="text-gray-600 mb-2">You can either:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Create a custom application form using our form builder</li>
              <li>Publish now and add the form later</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => handleFormBuilderChoice(false)}
              className="px-4 py-2 rounded-md border border-gray-300 !bg-transparent !text-gray-700 hover:bg-gray-50"
            >
              Publish Without Form
            </Button>
            <Button
              type="button"
              onClick={() => handleFormBuilderChoice(true)}
              className="px-4 py-2 rounded-md !bg-[#5207CD] !text-white hover:!bg-[#0C7CE6]"
            >
              Create Application Form
            </Button>
          </div>
        </div>
      </Modal>

      {/* Template Preview Modal */}
      <Modal
        title="Template Preview"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={previewMode === "desktop" ? 1000 : 400}
        className="template-preview-modal"
      >
        {previewTemplate && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-100 p-1 rounded-full flex items-center">
                <button
                  className={`px-4 py-2 rounded-full font-medium text-sm ${previewMode === "desktop"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                  onClick={() => setPreviewMode("desktop")}
                >
                  Desktop
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-medium text-sm ${
                    previewMode === "mobile"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                  onClick={() => setPreviewMode("mobile")}
                >
                  Mobile
                </button>
              </div>
            </div>

            {previewMode === "desktop" ? (
              <div className="flex justify-center transition-all duration-300 fade-in">
                <div className="relative w-[900px] h-[600px] border-8 border-gray-800 rounded-[20px] overflow-auto shadow-xl">
                  <div className="h-full overflow-y-auto webkit-scrollbar">
                    <Img
                      src={`/images/template-thumbnails/TemplateDesktop${previewTemplate}.png`}
                      alt={`Template Desktop ${previewTemplate}`}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center transition-all duration-300 fade-in">
                <div className="relative w-[400px] h-[667px] border-8 border-gray-800 rounded-[40px] overflow-auto shadow-xl">
                  <div className="h-full overflow-y-auto webkit-scrollbar">
                    <Img
                      src={`/images/template-thumbnails/TemplateMobile${previewTemplate}.png`}
                      alt={`Template Mobile ${previewTemplate}`}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .template-preview-modal .ant-modal-content {
          padding: 24px;
        }
        .template-preview-modal .ant-modal-body {
          padding: 0;
        }
        .webkit-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .webkit-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .webkit-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        @media (max-width: 768px) {
          .template-preview-modal .ant-modal {
            max-width: 95vw;
            margin: 0 auto;
          }
        }
        @keyframes highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(14, 135, 254, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(14, 135, 254, 0);
            transform: scale(1.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(14, 135, 254, 0);
            transform: scale(1);
          }
        }
        .highlight-pulse {
          animation: highlight-pulse 0.8s ease-in-out;
          border-radius: 50%;
        }
        @keyframes pulse-subtle {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}