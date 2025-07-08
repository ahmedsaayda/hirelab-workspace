import { Modal, Switch, Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MegaMenu1 from "../MegaMenu1";
import { Heading, Img } from "..";
import { ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { EyeOutlined, LinkOutlined } from "@ant-design/icons";

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
  lpId,
  ...props
}) {
  const [templateMenu, setTemplateMenu] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [publishConfirmVisible, setPublishConfirmVisible] = useState(false);
  const [ctaLink, setCtaLink] = useState("");
  const [initialCtaLink, setInitialCtaLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [applyLinkModalVisible, setApplyLinkModalVisible] = useState(false);

  // Check if there are unpublished changes when component mounts or data changes
  useEffect(() => {
    if (landingPageData) {
      // Use a more generous margin to account for auto-save timing
      const marginMs = 3000; // 3 seconds margin
      const hasChanges = landingPageData.published &&
        landingPageData.publishedAt &&
        landingPageData.updatedAt &&
        new Date(landingPageData.publishedAt).getTime() + marginMs < new Date(landingPageData.updatedAt).getTime();
      
      console.log("Checking unpublished changes:", {
        published: landingPageData.published,
        publishedAt: landingPageData.publishedAt,
        updatedAt: landingPageData.updatedAt,
        hasChanges
      });
      
      setHasUnpublishedChanges(hasChanges);
      
      // Initialize CTA link from landingPageData
      setCtaLink(landingPageData.cta2Link || '#apply');
      setInitialCtaLink(landingPageData.cta2Link || '#apply');
    }
  }, [landingPageData]);

  // Function to check for differences between current state and published version
  // We keep this for the detailed change detection in the publish confirmation modal
  const checkForUnpublishedChanges = (data) => {
    if (!data.publishedVersion) return false;
    
    // List of key properties to compare
    const keysToCompare = [
      'vacancyTitle', 'heroDescription', 'heroImage', 'location',
      'jobSpecificationTitle', 'specifications', 'jobDescription',
      'recruiters', 'menuItems', 'templateId'
    ];
    
    // Check for differences in these properties
    for (const key of keysToCompare) {
      if (JSON.stringify(data[key]) !== JSON.stringify(data.publishedVersion[key])) {
        return true;
      }
    }
    
    return false;
  };

  const handleSave = async () => {
    // setIsSaving(true);
    // eventEmitter.emit("triggerSave"); // Trigger save from EditorRender
    // message.success("Saving changes...");
    // // The actual save operation happens in the editor components
    // // This will automatically trigger the changeState event with false

    // // After saving, the updatedAt timestamp will be newer than publishedAt
    // // Wait for save to complete, then check if there are unpublished changes
    // setTimeout(() => {
    //   if (landingPageData.published && landingPageData.publishedAt) {
    //     // If published, and save occurred, there will be unpublished changes
    //     setHasUnpublishedChanges(true);
    //     setIsChanged(false);
    //     reload();
    //   }
    // }, 2000);

    console.log("landingPageData", landingPageData?.companyLogo);
    console.log("landingPageData", landingPageData?.vacancyTitle);

    try {
      await CrudService.update("LandingPageData", lpId, {
        // published: true,
        // // publishedAt: new Date(),
        // // updatedAt: new Date(),
        ...landingPageData,
      });
      message.success("Landing page saved successfully!");
      // reload();
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
    
    setIsPublishing(true);

    try {
      const res = await LandingPageService.publishLandingPage(lpId);
      console.log("Publish response:", res);
      message.success("Landing page published successfully!");
      
      // Reset the unpublished changes state immediately
      setHasUnpublishedChanges(false);
      
      // Reload the data to get the updated publishedAt timestamp
      reload();
    } catch (err) {
      message.error("Failed to publish: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
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
      
      const res = await LandingPageService.publishLandingPage(lpId);
      console.log("Publish response:", res);
      message.success("Landing page published successfully!");
      
      // Reset the unpublished changes state immediately
      setHasUnpublishedChanges(false);
      
      // Reload the data to get the updated publishedAt timestamp
      reload();
      
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

  return (
    <header
      {...props}
      className={`${props.className} bg-white-A700 relative rounded-[20px] container-xs p-1 pe-2`}
    >
      <div className="flex gap-5 justify-between items-center w-full mdx:flex-col">
        <div className="flex items-center justify-left mdx:w-full">
          <Link href="/dashboard/vacancies">
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
              {hasUnpublishedChanges && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                  Unpublished changes
                </span>
              )}
            
            </Heading>
          </div>
          <Switch
            className="ml-3.5"
            size="small"
            checked={landingPageData?.published}
            onChange={(e) => setPublished(e)}
          />
          <Img
            src="/images/settings-02.svg"
            alt="check"
            className="h-[20px] w-[20px] ml-3.5 cursor-pointer settings-icon"
            onClick={handleTemplateOpen}
          />
          {(isSaving || isAutoSaving) && (
            <span className="ml-2 text-sm px-2 py-0.5  text-blue-800 rounded-full flex items-center gap-1">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Saving...
            </span>
          )}
        </div>
        <div className="flex justify-center mdx:w-full smx:hidden">
          <div className="flex flex-col flex-1 items-center smx:self-stretch">
            <div className="flex items-center gap-3">
              <ul className="flex items-center gap-4">
                {[
                  {
                    id: "copyLink",
                    label: "Copy Link",
                    action: handleCopyLink,
                    bgColor: "bg-[#0080FF]",
                    textColor: "!text-[white]",
                    icon: <LinkOutlined style={{ fontSize: '16px', color: 'white' }} />,
                    className: "rounded-lg",
                    disabled: false,
                  },
                  {
                    id: "publish",
                    label: landingPageData?.published ? (hasUnpublishedChanges ? "Publish Changes" : "Published") : "Publish",
                    action: (!landingPageData?.published || hasUnpublishedChanges) && !isPublishing ? handlePublish : handlePublish,
                    bgColor: landingPageData?.published && !hasUnpublishedChanges ?
                      "bg-[#ECFDF3]" :
                      "bg-[#5207CD]",
                    textColor: landingPageData?.published && !hasUnpublishedChanges ?
                      "!text-[#039855]" :
                      "!text-[#FFFFFF]",
                    icon: isPublishing ? <Spin color="white" size="small" /> : (landingPageData?.published && !hasUnpublishedChanges ?
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#17B26A" />
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
                        <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="white" />
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
                        <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="#5207CD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    ),
                    disabled: isPublishing,
                  },
                ].filter(item => {
                  // Only show copy link button when page is published AND there are no unpublished changes
                  if (item.id === "copyLink") {
                    return landingPageData?.published && !hasUnpublishedChanges
                  }
                  // Only show publish button if not published yet, or if there are unpublished changes
                  if (item.id === "publish") {
                    return true
                  }
                  return true;
                }).map((item) => (
                  <li key={item.id}>
                    <div
                      className={`flex items-center gap-2 rounded-lg border border-solid px-2 py-[10px] shadow-sm ${item.bgColor}`}
                    >
                      {item.link ? (
                        <Link
                        href={item.link(landingPageData?._id)}
                          className="flex gap-2 justify-center items-center cursor-pointer"
                        >
                          <Img
                            src={item.icon}
                            alt="check"
                            className="h-[16px] w-[16px]"
                          />
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
                          className={`flex gap-2 items-center ${!item.action || item.disabled ? 'cursor-default' : 'cursor-pointer'}`}
                          disabled={!item.action || item.disabled}
                          title={item.tooltip}
                        >
                          {/* <Img
                            src={item.icon}
                            alt="check"
                            className="h-[16px] w-[16px]"
                          /> */}
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
      </div>
      <Modal
        open={templateMenu}
        onCancel={() => setTemplateMenu(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Choose template"
      >
        <div className="grid grid-cols-3 gap-6 justify-center py-3 mdx:grid-cols-2">
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
                  onClick={() => {
                    setPreviewTemplate(i + 1);
                    setPreviewModalVisible(true);
                  }}
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
                        ? "bg-[#5207CD] text-[#FFFFFF]"
                        : "bg-[#FFFFFF] text-blue_gray-800_01 border rounded-full border-solid border-blue_gray-100"
                      : "bg-gray-200  cursor-not-allowed"
                  }`}
                >
                  {i === 0 ? "Choose Template" : "Coming Soonnn"}
                </Button>
              </div>
            </div>
          ))}
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
      `}</style>
    </header>
  );
}
