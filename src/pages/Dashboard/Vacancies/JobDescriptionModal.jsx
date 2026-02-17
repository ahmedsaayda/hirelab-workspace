import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import { Button, Heading } from "./components/components/index.jsx";
import ChooseTemplate from "./ChooseTemplate.jsx";
import AiService from "../../../services/AiService.js";
import UploadService from "../../../services/UploadService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors.js";
import useWorkspaceBranding from "../../../hooks/useWorkspaceBranding";
import { useRouter } from "next/router";
import { message as antdMessage, Select } from "antd";
import AiLoadingStateAnimation from "./AiloadingStateAnnimation.jsx";
import { departmentOptions } from "./departmentOptions";
import languages from "./lang.json";
import { getTranslation } from "../../../utils/translations";

// Convert the language object to array of options and remove duplicates
const languageOptions = Array.from(
  new Set(Object.values(languages))
).map(name => ({
  value: name,
  label: name,
})).sort((a, b) => a.label.localeCompare(b.label));

function JobDescriptionModal({ onClose, ongoBack, onRefresh }) {
  const user = useSelector(selectUser);
  const { branding: brandingDetails } = useWorkspaceBranding();
  const router = useRouter();;

  // State variables
  const [step, setStep] = useState(0);
  const [jobTitle, setJobTitle] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_description_progress');
    console.log('JobDescriptionModal - Loading saved progress:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('JobDescriptionModal - Parsed data:', data);
      return data?.jobTitle || "";
    }
    return "";
  });
  const [department, setDepartment] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_description_progress');
    console.log('JobDescriptionModal - Loading saved department:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('JobDescriptionModal - Parsed department data:', data);
      return data?.department || "";
    }
    return "";
  });
  const [language, setLanguage] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_description_progress');
    console.log('JobDescriptionModal - Loading saved language:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('JobDescriptionModal - Parsed language data:', data);
      return data?.lang || "English";
    }
    return "English";
  });
  const [jobDescription, setJobDescription] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_description_progress');
    console.log('JobDescriptionModal - Loading saved progress for description:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('JobDescriptionModal - Parsed data for description:', data);
      return data?.jobDescription || "";
    }
    return "";
  });
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_description_progress');
    console.log('JobDescriptionModal - Loading saved template:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('JobDescriptionModal - Parsed template data:', data);
      return data?.selectedTemplate ?? -1;
    }
    return -1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [backendLoading, setBackendLoading] = useState(false);

  useEffect(() => {
    const saveProgress = () => {
      const dataToSave = {
        jobTitle,
        jobDescription,
        department,
        lang: language,
        selectedTemplate
      };
      console.log('JobDescriptionModal - Saving progress:', dataToSave);
      sessionStorage.setItem('vacancy_description_progress', JSON.stringify(dataToSave));
      console.log('JobDescriptionModal - Verification - Just saved:', sessionStorage.getItem('vacancy_description_progress'));
    };

    saveProgress();
  }, [jobTitle, jobDescription, department, language, selectedTemplate]);

  // Helper function to get branding details based on workspace session
  const getBrandingDetails = async () => {
    if (user?.isWorkspaceSession && user?.workspaceId) {
      // In workspace session - fetch workspace-specific branding
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workspaces/${user.workspaceId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const workspaceData = await response.json();
          const workspace = workspaceData.workspace || workspaceData;

          return {
            companyName: workspace.companyName || user?.companyName,
            companyUrl: workspace.companyWebsite || user?.companyUrl,
            companyInfo: user?.companyInfo, // Company info stays at user level
            companyLogo: workspace.companyLogo || user?.companyLogo,
            primaryColor: workspace.primaryColor || user?.primaryColor,
            secondaryColor: workspace.secondaryColor || user?.secondaryColor,
            tertiaryColor: workspace.tertiaryColor || user?.tertiaryColor,
            heroTitleColor: workspace.heroTitleColor || user?.heroTitleColor,
            selectedFont: workspace.selectedFont || user?.selectedFont,
            titleFont: workspace.titleFont || user?.titleFont,
            subheaderFont: workspace.subheaderFont || user?.subheaderFont,
            bodyFont: workspace.bodyFont || user?.bodyFont,
          };
        }
      } catch (error) {
        console.error('Error fetching workspace branding:', error);
      }

      // Fallback to user branding if workspace fetch fails
      return {
        companyName: user?.companyName,
        companyUrl: user?.companyUrl,
        companyInfo: user?.companyInfo,
        companyLogo: user?.companyLogo,
        primaryColor: user?.primaryColor,
        secondaryColor: user?.secondaryColor,
        tertiaryColor: user?.tertiaryColor,
        heroTitleColor: user?.heroTitleColor,
        titleFont: user?.titleFont,
        subheaderFont: user?.subheaderFont,
        bodyFont: user?.bodyFont,
      };
    } else {
      // Main session - use user branding
      return {
        companyName: user?.companyName,
        companyUrl: user?.companyUrl,
        companyInfo: user?.companyInfo,
        companyLogo: user?.companyLogo,
        primaryColor: user?.primaryColor,
        secondaryColor: user?.secondaryColor,
        tertiaryColor: user?.tertiaryColor,
        heroTitleColor: user?.heroTitleColor,
        titleFont: user?.titleFont,
        subheaderFont: user?.subheaderFont,
        bodyFont: user?.bodyFont,
      };
    }
  };

  const [brandingDetailsState, setBrandingDetailsState] = useState(brandingDetails);

  useEffect(() => {
    setBrandingDetailsState(brandingDetails);
  }, [brandingDetails]);

  const isButtonDisabled =
    step === 0
      ? !jobTitle || !department || !language || !jobDescription || jobDescription.length < 1 || isLoading
      : selectedTemplate === -1 || (selectedTemplate !== 1 && selectedTemplate !== 2);

  const renderButton = () => {
    if (step === 0) {
      return (
        <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2">
          <button
            onClick={ongoBack}
            className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline"
          >
            Go Back
          </button>
          <button
            onClick={() => setStep(1)}
            className={`py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <>
                <span className="inline-block mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></span>
                Processing...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2">
          <button
            onClick={() => setStep(0)}
            className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline"
          >
            Back
          </button>
          <button
            onClick={handleCreateVacancy}
            className={`py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={isButtonDisabled}
          >
            Create Vacancy
          </button>
        </div>
      );
    }
    return null;
  };

  const handleCreateVacancy = async () => {
    const debugData = {
      startTime: new Date(),
      jobTitle: jobTitle,
      steps: [],
      errors: [],
      finalResult: null
    };

    try {
      setIsLoading(true);
      setBackendLoading(true);

      console.log("Starting vacancy creation process...");
      debugData.steps.push({
        step: 1,
        name: "Process Started",
        timestamp: new Date(),
        status: "success"
      });

      // Process content with AI
      console.log("Processing content with AI...");
      debugData.steps.push({
        step: 2,
        name: "AI Processing Started",
        timestamp: new Date(),
        status: "in_progress",
        data: {
          jobTitle,
          jobDescriptionLength: jobDescription.length,
          companyInfo: user?.companyInfo
        }
      });

      // Prepare content for AI processing
      const content = {
        jobTitle,
        jobDescription,
        companyInfo: user?.companyInfo
      };

      console.log("JobDescriptionModal: Starting parallel AI processing and Image Search");
      const searchQuery = `${jobTitle} ${department}`;
      console.log(`JobDescriptionModal: Searching images with query: "${searchQuery}"`);

      const [aiResponse, imageResponse] = await Promise.all([
        AiService.processContentWithAI({
          content: JSON.stringify(content),
          language: language
        }),
        AiService.searchUnsplash(searchQuery, 12)
      ]);

      console.log("JobDescriptionModal: Parallel requests completed");
      console.log("JobDescriptionModal: Image Response:", imageResponse?.data);

      if (!aiResponse.data.success) {
        throw new Error(aiResponse.data.error || 'AI processing failed');
      }

      // Handle Image Uploads
      let uploadedImages = [];
      if (imageResponse?.data?.success && imageResponse.data.data.length > 0) {
        try {
          const imagesToUpload = imageResponse.data.data;
          console.log(`JobDescriptionModal: Found ${imagesToUpload.length} images. Uploading them...`);

          const uploadPromises = imagesToUpload.map(async (img) => {
            try {
              const res = await UploadService.upload(img.url, 10);
              if (res?.data?.secure_url) {
                return res.data.secure_url;
              }
              return null;
            } catch (e) {
              console.error("Failed to upload image:", img.url, e);
              return null;
            }
          });

          const results = await Promise.all(uploadPromises);
          uploadedImages = results.filter(url => url !== null);
          console.log(`JobDescriptionModal: Successfully uploaded ${uploadedImages.length} images.`);

        } catch (uploadError) {
          console.error("JobDescriptionModal: Failed to upload Unsplash images:", uploadError);
        }
      } else {
        console.log("JobDescriptionModal: No images found from Unsplash search or search failed.");
      }

      console.log("AI processing completed successfully", aiResponse);
      debugData.steps.push({
        step: 2,
        name: "AI Processing Completed",
        timestamp: new Date(),
        status: "success",
        data: {
          aiResponse: aiResponse?.data?.data?.content,
          resultLength: aiResponse?.data?.data?.content?.length || 0
        }
      });

      // Use the combined result from AI processing
      const aiResult = aiResponse?.data?.data?.content;
      debugData.steps.push({
        step: 3,
        name: "AI Result Retrieved",
        timestamp: new Date(),
        status: "success",
        data: {
          method: "combined",
          rawResult: aiResponse?.data?.data?.content,
          resultType: typeof aiResult
        }
      });

      console.log("aiResult", aiResult)

      // Clean up the AI response to ensure valid JSON
      let cleanResponse = aiResult;
      if (typeof cleanResponse === 'string') {
        debugData.steps.push({
          step: 4,
          name: "JSON Cleaning Started",
          timestamp: new Date(),
          status: "in_progress",
          data: { originalResponse: cleanResponse, type: "string" }
        });

        try {
          // First try direct parsing
          cleanResponse = JSON.parse(cleanResponse);
        } catch (initialParseError) {
          console.log("Initial parse failed, attempting cleanup...", initialParseError);

          try {
            // Remove markdown code blocks if present
            cleanResponse = cleanResponse
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim();

            // Remove any text before the first { and after the last }
            const firstBrace = cleanResponse.indexOf("{");
            const lastBrace = cleanResponse.lastIndexOf("}");

            if (firstBrace >= 0 && lastBrace >= 0) {
              cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
            }

            // Try parsing again after cleanup
            cleanResponse = JSON.parse(cleanResponse);
          } catch (parseError) {
            console.error("Failed to parse AI response after cleanup:", parseError);
            debugData.errors.push({
              step: 4,
              error: "JSON Parse Error",
              timestamp: new Date(),
              details: parseError.message,
              data: { cleanResponse, parseError }
            });
            throw new Error("Invalid JSON response from AI");
          }
        }

        debugData.steps.push({
          step: 4,
          name: "JSON Cleaning Completed",
          timestamp: new Date(),
          status: "success",
          data: { cleanedResponse: cleanResponse, parseSuccess: true }
        });
      }

      debugData.finalResult = cleanResponse;

      // Ensure specifications are enabled if they exist
      if (cleanResponse?.specifications && Array.isArray(cleanResponse?.specifications)) {
        cleanResponse.specifications = cleanResponse?.specifications?.map(spec => ({
          ...spec,
          enabled: true
        }));

        debugData.steps.push({
          step: 5,
          name: "Specifications Enabled",
          timestamp: new Date(),
          status: "success",
          data: {
            specificationsCount: cleanResponse?.specifications?.length,
            enabledCount: cleanResponse?.specifications?.filter(s => s.enabled)?.length
          }
        });
      }



      // Create the vacancy
      console.log("Creating vacancy...");
      debugData.steps.push({
        step: 6,
        name: "Vacancy Creation Started",
        timestamp: new Date(),
        status: "in_progress"
      });

      console.log("cleanResponse", cleanResponse)

      const vacancyPayload = {
        ...cleanResponse,
        ...brandingDetails,
        heroImage: uploadedImages[0] || cleanResponse.heroImage,
        jobDescriptionImage: uploadedImages[1] || "",
        textBoxImage: uploadedImages[2] || "",
        evpMissionAvatar: uploadedImages[3] || "",
        leaderIntroductionAvatar: uploadedImages[4] || "",
        aboutTheCompanyImages: uploadedImages.slice(5, 8).length > 0 ? uploadedImages.slice(5, 8) : (cleanResponse.aboutTheCompanyImages || []),
        photoImages: uploadedImages.slice(8, 12).length > 0 ? uploadedImages.slice(8, 12) : (cleanResponse.photoImages || []),
        templateId: selectedTemplate,
        vacancyTitle: jobTitle,
        department: department,
        user_id: user?._id,
        applyType: 'form', // 🚀 Always default to custom form
        cta2Link: '#apply', // 🚀 Always default to apply action
        lang: language,
        workspace: user?.isWorkspaceSession ? user.workspaceId : undefined
      };



      console.log("vacancyPayload", vacancyPayload)
      const res = await AiService.createVacancy(vacancyPayload);
      console.log("Vacancy created successfully");

      debugData.steps.push({
        step: 6,
        name: "Vacancy Creation Completed",
        timestamp: new Date(),
        status: "success",
        data: {
          vacancyId: res.data.data.result._id,
          createdAt: new Date()
        }
      });

      // Clear session storage on successful creation
      sessionStorage.removeItem('vacancy_description_progress');

      onRefresh();
      router.push(`/edit-page/${res.data.data.result._id}`);

    } catch (error) {
      console.error("Error creating vacancy:", error);
      debugData.errors.push({
        step: "general",
        error: "Vacancy Creation Failed",
        timestamp: new Date(),
        details: error.message,
        stack: error.stack
      });
      debugData.endTime = new Date();

      antdMessage.error(
        "Failed to create vacancy: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
      setBackendLoading(false);
    }
  };

  const handleClose = () => {
    console.log('JobDescriptionModal - Closing modal. Current data:', {
      jobTitle,
      jobDescription,
      department,
      language,
      selectedTemplate
    });
    if (!jobTitle && !jobDescription && !department && !language && selectedTemplate === -1) {
      console.log('JobDescriptionModal - Cleaning up empty form data');
      sessionStorage.removeItem('vacancy_description_progress');
    }
    onClose();
  };

  return (
    <div>
      <Modal maskClosable={false} title="" open={true} onCancel={handleClose} footer={null} style={{
        maxHeight: "80vh",
        overflowY: "auto",
        top: 20,
        marginTop: 0
      }}>
        {backendLoading ? (
          <AiLoadingStateAnimation
            onCancel={() => {
              setBackendLoading(false);
              setIsLoading(false);
            }}
          />
        ) : (
          <>
            <Heading
              size="7xl"
              as="h1"
              className="!text-[#000000]_01 text-center"
            >
              {getTranslation(language, 'pasteJobText')}
            </Heading>
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  className="p-2 w-full text-sm rounded-[15px] border border-gray-300 dark:bg-gray-900 outline-gray-300"
                  placeholder={getTranslation(language, 'enterJobTitle')}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <label className="text-sm font-medium">{getTranslation(language, 'department')}</label>
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    value={department}
                    onChange={(value) => setDepartment(value)}
                    placeholder={getTranslation(language, 'selectDepartment')}
                    options={departmentOptions}
                  />
                </div>
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <label className="text-sm font-medium">{getTranslation(language, 'language')}</label>
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    value={language}
                    onChange={(value) => setLanguage(value)}
                    placeholder={getTranslation(language, 'selectLanguage')}
                    options={languageOptions}
                  />
                </div>
                <textarea
                  className="p-2 w-full h-64 text-sm rounded-[15px] border border-gray-300 dark:bg-gray-900 outline-gray-300"
                  placeholder={getTranslation(language, 'pasteJobDescription')}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  {getTranslation(language, 'pasteJobTip')}
                </p>
              </div>
            )}
            {step === 1 && (
              <ChooseTemplate
                onChooseTemplate={(template) => {
                  setSelectedTemplate(template);
                }}
                selectedTemplate={selectedTemplate}
              />
            )}
            {renderButton()}
          </>
        )}
      </Modal>
    </div>
  );
}

export default JobDescriptionModal;
