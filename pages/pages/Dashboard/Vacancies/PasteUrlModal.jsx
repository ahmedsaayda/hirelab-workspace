import { Modal } from "antd";
import React, { useState } from "react";
import { Button, Heading } from "./components";
import ChooseTemplate from "./ChooseTemplate";
import AiService from "../../../service/AiService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";
import { useRouter } from "next/router";
import { message as antdMessage } from "antd";
import AiLoadingStateAnimation from "./AiloadingStateAnnimation";

function PasteUrlModal({ onClose, ongoBack }) {
  const user = useSelector(selectUser);
  const router = useRouter();;

  const [step, setStep] = useState<number>(0);
  const [url, setURL] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendLoading, setBackendLoading] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);

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
    if (step === 0) return !url || isLoading;
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
    setURL(newUrl);
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
        <>
          <Button
            {...({} )}
            shape="round"
            onClick={handleNextStep}
            className="min-w-[225px] mt-6 w-full gap-1.5 font-semibold bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isButtonDisabled()}
          >
            Next
          </Button>
          <button
            onClick={ongoBack}
            className="py-2 w-full text-center text-gray-600 rounded-md border border-gray-300 hover:underline mt-2"
          >
            Go Back
          </button>
        </>
      );
    }

    if (step === 1) {
      return (
        <div className="flex flex-col gap-2">
          <Button
            className="min-w-[225px] w-full gap-1.5 font-semibold bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            {...({} )}
            disabled={isButtonDisabled()}
            onClick={handleCreateVacancy}
          >
            {isLoading ? (
              <>
                <span className="inline-block mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></span>
                Creating Vacancy...
              </>
            ) : (
              "Create Vacancy"
            )}
          </Button>

          <Button
            className="min-w-[225px] w-full gap-1.5 font-semibold text-gray-600 border border-gray-300"
            {...({} )}
            onClick={() => setStep(0)}
            disabled={isLoading}
          >
            Back
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Modal title="" open={true} onCancel={onClose} footer={null}>
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
