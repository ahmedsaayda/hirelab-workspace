import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import { Button, Heading } from "./components/components/index.jsx";
import ChooseTemplate from "./ChooseTemplate.jsx";
import AiService from "../../../services/AiService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors.js";
import { useRouter } from "next/router";
import { message as antdMessage, Select } from "antd";
import AiLoadingStateAnimation from "./AiloadingStateAnnimation.jsx";
import { departmentOptions } from "./departmentOptions";

function PasteUrlModal({ onClose, ongoBack ,onRefresh}) {
  const user = useSelector(selectUser);
  const router = useRouter();;

  const [step, setStep] = useState(0);
  const [url, setUrl] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_url_progress');
    console.log('PasteUrlModal - Loading saved progress:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('PasteUrlModal - Parsed data:', data);
      return data?.url || "";
    }
    return "";
  });
  const [department, setDepartment] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_url_progress');
    console.log('PasteUrlModal - Loading saved department:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('PasteUrlModal - Parsed department data:', data);
      return data?.department || "";
    }
    return "";
  });
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_url_progress');
    console.log('PasteUrlModal - Loading saved template:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('PasteUrlModal - Parsed template data:', data);
      return data?.selectedTemplate ?? -1;
    }
    return -1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [backendLoading, setBackendLoading] = useState(false);
  const [urlError, setUrlError] = useState(null);

  useEffect(() => {
    const saveProgress = () => {
      const dataToSave = { 
        url,
        department,
        selectedTemplate
      };
      console.log('PasteUrlModal - Saving progress:', dataToSave);
      sessionStorage.setItem('vacancy_url_progress', JSON.stringify(dataToSave));
      console.log('PasteUrlModal - Verification - Just saved:', sessionStorage.getItem('vacancy_url_progress'));
    };

    saveProgress();
  }, [url, department, selectedTemplate]);

  const brandingDetails = {
    companyName: user?.companyName,
    companyUrl: user?.companyUrl,
    companyInfo: user?.companyInfo,
    companyLogo: user?.companyLogo,
    primaryColor: user?.primaryColor,
    secondaryColor: user?.secondaryColor,
    tertiaryColor: user?.tertiaryColor,
    heroBackgroundColor: user?.heroBackgroundColor,
    heroTitleColor: user?.heroTitleColor,
    titleFont: user?.titleFont,
    subheaderFont: user?.subheaderFont,
    bodyFont: user?.bodyFont,
  };

  const isButtonDisabled = () => {
    if (step === 0) return !url || !department || isLoading;
    if (step === 1) return selectedTemplate === -1 || isLoading;
    return false;
  };

  const validateUrl = (url) => {
    try {
      const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

      if (!url || url.trim() === "") {
        setUrlError("Please enter a URL");
        return false;
      }

      if (!urlPattern.test(url)) {
        setUrlError("Please enter a valid URL");
        return false;
      }

      setUrlError(null);
      return true;
    } catch (error) {
      setUrlError("Invalid URL format");
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    console.log('PasteUrlModal - URL changed to:', newUrl);
    setUrl(newUrl);
    if (urlError) {
      setUrlError(null);
    }
  };

  const handleNextStep = () => {
    if (validateUrl(url)) {
      setStep(1);
    }
  };

  const handleCreateVacancy = async () => {
    try {
      setIsLoading(true);
      setBackendLoading(true);

      // Step 1: Scrape the URL with Firecrawl
      const scrapeResponse = await AiService.scrapeUrl(url);
      console.log("scrapeResponse", scrapeResponse);
      
      if (!scrapeResponse.data.success) {
        throw new Error(scrapeResponse.data.error || 'Failed to scrape URL');
      }

      const { markdown, metadata } = scrapeResponse.data.data.content;
      
      // Step 2: Process with AI
      const aiResponse = await AiService.processContentWithAI({
        url: url,
        content: {
          markdown,
          metadata
        }
      });

      if (!aiResponse.data.success) {
        throw new Error(aiResponse.data.error || 'AI processing failed');
      }

      // Get the AI-processed content
      const aiResult = JSON.parse(aiResponse.data.data.content);

      console.log("aiResult", aiResult);

      /* 
       "recruiters": [
    {
      "recruiterFullname": "CVS Health Talent Acquisition",
      "recruiterRole": "Recruitment Team",
      "recruiterEmail": "jobs@cvshealth.com",
      "recruiterPhone": "+1 (800) 746-7287"
    }
  ]

  ------
  add recruiterPhoneEnabled: true, and
          recruiterEmailEnabled: true, if recruiterEmail and recruiterPhone are not empty
      */
      // Step 3: Create the vacancy
      const vacancyPayload = {
        ...aiResult,
        ...brandingDetails,
        templateId: selectedTemplate,
        department: department,
        user_id: user?._id,
        specifications: aiResult.specifications?.map((spec) => ({
          ...spec,
          enabled: true
        })),
        recruiters: aiResult.recruiters?.map((recruiter) => ({
          ...recruiter,
          recruiterPhoneEnabled: recruiter.recruiterPhone ? true : false,
          recruiterEmailEnabled: recruiter.recruiterEmail ? true : false
        }))
      };

      const res = await AiService.createVacancy(vacancyPayload);
      onRefresh();
      router.push(`/edit-page/${res.data.data.result._id}`);

    } catch (error) {
      console.error("Error creating vacancy:", error);
      antdMessage.error("Failed to create vacancy: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
      setBackendLoading(false);
    }
  };

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
            onClick={handleNextStep}
            className={`py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md ${
              isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled()}
          >
            Next
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
            disabled={isLoading}
          >
            Back
          </button>
          <button
            onClick={handleCreateVacancy}
            className={`py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md ${
              isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled()}
          >
            {isLoading ? (
              <>
                <span className="inline-block mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></span>
                Creating Vacancy...
              </>
            ) : (
              "Create Vacancy"
            )}
          </button>
        </div>
      );
    }
    return null;
  };

  const handleClose = () => {
    console.log('PasteUrlModal - Closing modal. Current data:', { url, department, selectedTemplate });
    if (!url && !department && selectedTemplate === -1) {
      console.log('PasteUrlModal - Cleaning up empty form data');
      sessionStorage.removeItem('vacancy_url_progress');
    }
    onClose();
  };

  return (
    <div>
      <Modal title="" open={true} onCancel={handleClose} footer={null} style={{
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
              className="!text-black-900_01 text-center"
            >
              Paste URL
            </Heading>
            {step === 0 && (
              <>
                <input
                  type="url"
                  className={`w-full text-xs rounded-lg border ${
                    urlError ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-900 outline-gray-300 p-2 mt-4`}
                  placeholder="Enter Job Post URL"
                  value={url}
                  onChange={handleUrlChange}
                  disabled={isLoading}
                />
                {urlError && (
                  <p className="mt-1 text-xs text-red-500">{urlError}</p>
                )}
                <div className="mt-4">
                  <div className="flex gap-2 items-center mb-2">
                    <label className="text-sm font-medium">Department</label>
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    value={department}
                    onChange={(value) => setDepartment(value)}
                    placeholder="Select a department"
                    options={departmentOptions}
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Paste the complete URL of a job posting from any job board or
                  company website.
                </p>
              </>
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

export default PasteUrlModal;
