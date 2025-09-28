import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Select, Tag, message as antdMessage, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import languages from "./lang.json";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";
import { useRouter } from "next/router";
import { Button, Img, Text, Heading } from "./components/components";
import AiLoadingStateAnimation from "./AiloadingStateAnnimation";
import VacacnySchema from "./vacacnyExemple.json";
import AiRules from "./aiRules.json";
import ChooseTemplate from "./ChooseTemplate";
import AiService from "../../../services/AiService";
import { departmentOptions } from "./departmentOptions";

// Convert the language object to array of options and remove duplicates
const languageOptions = Array.from(
  new Set(Object.values(languages))
).map(name => ({
  value: name,
  label: name,
})).sort((a, b) => a.label.localeCompare(b.label));

const FromScratchModal = ({ onClose ,ongoBack ,onRefresh}) => {
  console.log("FromScratchModal");
  const user = useSelector(selectUser);
  console.log("user", user);
  const brandingDetails = {
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
  const [open, setOpen] = useState(true);
  console.log("open", open);
  const [step, setStep] = useState(1);
  console.log("step", step);
  const [jobTitleModal, setJobTitleModal] = useState(false);
  const [jobTitle, setJobTitle] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    console.log('FromScratchModal - Loading saved progress:', savedProgress);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('FromScratchModal - Parsed data:', data);
      return data?.jobTitle || "";
    }
    return "";
  });
  const [department, setDepartment] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.department || "";
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [vacancyDescription, setVacancyDescription] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.vacancyDescription || "";
    }
    return "";
  });
  const [perksAndBenefits, setPerksAndBenefits] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.perksAndBenefits || "";
    }
    return "";
  });
  const [tags, setTags] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.tags || [];
    }
    return [];
  });
  const [tagInput, setTagInput] = useState("");
  const [tone, setTone] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.tone || "Professional";
    }
    return "Professional";
  });
  const [language, setLanguage] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.language || "English";
    }
    return "English";
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Our AI is working  to create the perfect vacancy for you. This may take a minute..."
  );
  const socket = useRef(null);
  const socketPing = useRef(null);
  const loadingIntervalRef = useRef(null);
  console.log("Generated content:", generatedContent);
  const [showDebugLogs, setShowDebugLogs] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(-1);
  const [isCreatingWithoutAI, setIsCreatingWithoutAI] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      return data?.selectedLanguages || [];
    }
    return [];
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);


  // Load saved progress when modal opens
  useEffect(() => {
    const savedProgress = sessionStorage.getItem('vacancy_scratch_progress');
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      console.log('FromScratchModal - Loading saved progress:', data);
      // Step 1 data
      if (data.jobTitle) setJobTitle(data.jobTitle);
      if (data.department) setDepartment(data.department);
      if (data.selectedLanguages) setSelectedLanguages(data.selectedLanguages);
      if (data.step) setStep(data.step);
      if (data.selectedTemplate !== undefined) setSelectedTemplate(data.selectedTemplate);
      // Step 2 data
      if (data.vacancyDescription) setVacancyDescription(data.vacancyDescription);
      if (data.perksAndBenefits) setPerksAndBenefits(data.perksAndBenefits);
      if (data.tags && Array.isArray(data.tags)) setTags(data.tags);
      if (data.tone) setTone(data.tone);
      if (data.language) setLanguage(data.language);
    }
  }, []);

  // Save progress effect
  useEffect(() => {
    if (step === 1) return; // Don't save on initial render
    const saveProgress = () => {
      const dataToSave = {
        // Step 1 data
        jobTitle,
        department,
        selectedLanguages,
        step,
        selectedTemplate,
        // Step 2 data
        vacancyDescription,
        perksAndBenefits,
        tags,
        tone,
        language
      };
      console.log('FromScratchModal - Saving progress:', dataToSave);
      sessionStorage.setItem('vacancy_scratch_progress', JSON.stringify(dataToSave));
    };

    saveProgress();
  }, [
    // Step 1 dependencies
    jobTitle, 
    department, 
    selectedLanguages, 
    step, 
    selectedTemplate,
    // Step 2 dependencies
    vacancyDescription,
    perksAndBenefits,
    tags,
    tone,
    language
  ]);

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (!jobTitle && !department && selectedLanguages.length === 0 &&
          !vacancyDescription && !perksAndBenefits && (!tags || tags.length === 0)) {
        console.log('FromScratchModal - Cleaning up empty form data');
        sessionStorage.removeItem('vacancy_scratch_progress');
      }
    };
  }, [jobTitle, department, selectedLanguages, vacancyDescription, perksAndBenefits, tags]);

  // Autosave effect
  useEffect(() => {
    const saveProgress = () => {
      const dataToSave = {
        jobTitle,
        department,
        selectedLanguages,
        currentStep
      };
      console.log('FromScratchModal - Saving progress:', dataToSave);
      sessionStorage.setItem('vacancy_scratch_progress', JSON.stringify(dataToSave));
      console.log('FromScratchModal - Verification - Just saved:', sessionStorage.getItem('vacancy_scratch_progress'));
    };

    saveProgress();
  }, [jobTitle, department, selectedLanguages, currentStep]);

  // Add cleanup function for socket and intervals
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (socket.current) {
        socket.current.close();
      }
      if (socketPing.current) {
        clearInterval(socketPing.current);
      }
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("run");
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!jobTitle) return antdMessage.error("Job title is required");
      if (!department) return antdMessage.error("Department is required");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const router = useRouter();;

  const handleCreateWithoutAI = async () => {
    if (selectedTemplate === -1) {
      antdMessage.error("Please select a template");
      return;
    }

    setIsCreatingWithoutAI(true);
    const formData = {
      jobTitle,
      department,
      description: vacancyDescription,
      useAI: false,
      templateId: selectedTemplate,
    };

    try {
      // setBackendLoading(true);
      console.log("Creating vacancy without AI");
      // For non-AI path, use company info directly if available
      const companyFactsData = user?.companyInfo
        ? {
            companyFactsTitle: "About Our Company",
            companyFactsDescription:
              user.companyInfo.length > 120
                ? user.companyInfo.substring(0, 117) + "..."
                : user.companyInfo,
            companyFacts: [
              {
                headingText: user?.companyName || "Our Company",
                descriptionText:
                  user?.companyInfo?.substring(0, 80) ||
                  "Leading company in our industry",
                icon: "lucide-react:bar-chart-square",
              },
            ],
          }
        : {};

      // Non-AI path - also default to custom form
      const res = await AiService.createVacancy({
        vacancyTitle: formData.jobTitle,
        heroDescription: formData.description,
        department: formData.department,
        lang: language,
        menuItems:    [
          {
            "key": "Job Specifications",
            "label": "Summary",
            "active": false,
            "visible": true,
            "sort": 1
          },
          {
            "key": "Recruiter Contact",
            "label": "Contacts",
            "active": false,
            "visible": true,
            "sort": 2
          },
          {
            "key": "Job Description",
            "label": "Description",
            "active": false,
            "visible": true,
            "sort": 3
          },
          {
            "key": "Agenda",
            "label": "Agenda",
            "active": false,
            "visible": true,
            "sort": 4
          },
          {
            "key": "Company Facts",
            "label": "Company Facts",
            "active": false,
            "visible": true,
            "sort": 5
          },
          {
            "key": "About The Company",
            "label": "About Us",
            "active": false,
            "visible": true,
            "sort": 6
          },
          {
            "key": "Employee Testimonials",
            "label": "Testimonials",
            "active": false,
            "visible": false,
            "sort": 7
          },
          {
            "key": "Text Box",
            "label": "Text Box",
            "active": false,
            "visible": false,
            "sort": 8
          },
          {
            "key": "Video",
            "label": "Video",
            "active": false,
            "visible": false,
            "sort": 9
          },
          {
            "key": "Growth Path",
            "label": "Growth Path",
            "active": false,
            "visible": false,
            "sort": 10
          },
          {
            "key": "Candidate Process",
            "label": "Application Process",
            "active": false,
            "visible": false,
            "sort": 11
          },
          {
            "key": "Image Carousel",
            "label": "Images",
            "active": false,
            "visible": false,
            "sort": 12
          },
          {
            "key": "EVP / Mission",
            "label": "EVP / Mission",
            "active": false,
            "visible": false,
            "sort": 13
          },
          {
            "key": "Leader Introduction",
            "label": "Leader Intro",
            "active": false,
            "visible": false,
            "sort": 14
          }],
        ...brandingDetails,
        ...companyFactsData,
        templateId: selectedTemplate,
        user_id: user?._id,
        applyType: 'form', // 🚀 Always default to custom form
        cta2Link: '#apply' // 🚀 Always default to apply action
      });
      
      // Clear session storage on successful creation
      sessionStorage.removeItem('vacancy_scratch_progress');
      
      console.log("Vacancy created without AI:", res);
      router.push(`/edit-page/${res.data.data.result._id}?from=scratch`);
    } catch (error) {
      console.log("Error creating vacancy without AI:", error);
      antdMessage.error("Error creating vacancy without AI");
      setIsCreatingWithoutAI(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const renderButtons = () => {
    console.log("backendLoading", backendLoading);
    if (backendLoading) {
      return null;
    }
    if (loading) {
      return (
        <button
          disabled
          className="w-full py-2 text-white bg-[#5207CD] rounded-md flex justify-center items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
          Generating...
        </button>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            handleCreateNewVacancy({
              jobTitle,
              department,
              description: vacancyDescription,
              useAI: true,
              language: language,
              tone: tone,
              templateId: selectedTemplate,
            });
          }}
          className="w-full py-2 text-white bg-[#5207CD] rounded-md hover:bg-blue-600"
        >
          Generate Content
        </button>
        <button
          onClick={() => {
            // setUseAI(false);
            handleCreateWithoutAI();
          }}
          className="w-full text-center text-gray-600 hover:underline"
        >
          {isCreatingWithoutAI ? "Creating..." : "Create without AI"}
        </button>
      </div>
    );
  };

  console.log("backendLoading", backendLoading);
  const renderStepContent = () => {
    // Debug loading state
    console.log("Loading state:", {
      backendLoading,
      useAI,
      loadingSteps,
      currentLoadingStep,
    });

    // Add loading animation when backend is processing
    if (backendLoading && useAI) {
      return (
        <AiLoadingStateAnimation
          onCancel={() => {
            setBackendLoading(false);
          }}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">Job Title</label>
              </div>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter the job title"
                className="p-2 w-full text-sm rounded-lg border border-gray-300 dark:bg-gray-900 outline-gray-300"
                type="text"
                
              />
            </div>

            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">Department</label>
              </div>
              <Select
                style={{ width: "100%" }}
                value={department}
                onChange={(value) => setDepartment(value)}
                placeholder="Select a department"
                options={departmentOptions}
              />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">Choose Template</label>
              </div>
              <ChooseTemplate
                onChooseTemplate={(template) => {
                  setSelectedTemplate(template);
                }}
                selectedTemplate={selectedTemplate}
              />
            </div>
          </div>
        );

      case 2:
        return useAI ? (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="mb-2 text-base font-medium">Brief our AI Agent</h3>
              <p className="mb-4 text-sm text-gray-600">
                Write a short description about the vacancy in the first field
                and list your perks and benefits in the second field. Hit
                generate and let our DesignAI get to work.
              </p>
            </div>

            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">
                  Vacancy description
                </label>
                <div className="flex justify-center items-center w-4 h-4 rounded-full border cursor-help">
                  <Tooltip title="Describe the vacancy in one or two sentences. Mention the role, key responsibilities, and what kind of candidate you're looking for. E.g. 'Write a technical job description for a medium experienced Python Developer for our Core App dev team.">
                  ?
                  </Tooltip>
                </div>
              </div>
              <Input.TextArea
                value={vacancyDescription}
                onChange={(e) => setVacancyDescription(e.target.value)}
                placeholder="E.g. Write a technical job description for a medium experienced Python Developer for our Core App dev team."
                rows={3}
              />
            </div>

            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">
                  List perks/benefits
                </label>
                <div className="flex justify-center items-center w-4 h-4 rounded-full border cursor-help">
                  <Tooltip title="List all perks and benefits the role offers, separated by commas. E.g. '30 holidays, 70/30 Pension Arrangement, Daycare allowance children, 2500,- Euro Education Budget, Remote Working promoted.' The more detailed, the better.">
                  ?
                  </Tooltip>
                </div>
              </div>
              <Input.TextArea
                value={perksAndBenefits}
                onChange={(e) => setPerksAndBenefits(e.target.value)}
                placeholder="E.g. 30 holidays, 70/30 Pension Arrangement, Daycare allowance children, 2500,- Euro Education Budget, Remote Working promoted."
                rows={3}
              />
            </div>

            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">
                  Add tags (optional)
                </label>
                <div className="flex justify-center items-center w-4 h-4 rounded-full border cursor-help">
                  <Tooltip title="Add keywords that describe the role (e.g. 'Developer', 'Sales', 'Remote'). Tags help organize and optimize your recruitment campaigns and find back relevant campaigns or pieces of content easier.">
                  ?
                  </Tooltip>
                </div>
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="E.g. Developer"
                className="p-2 w-full text-sm rounded-lg border border-gray-300 dark:bg-gray-900 outline-gray-300 mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} closable onClose={() => removeTag(tag)}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">Tone</label>
                <Select
                  value={tone}
                  onChange={setTone}
                  className="w-full"
                  options={[
                    { value: "Professional", label: "Professional" },
                    { value: "Casual", label: "Casual" },
                    { value: "Friendly", label: "Friendly" },
                  ]}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">
                  Language
                </label>
                <Select
                  value={language}
                  onChange={setLanguage}
                  className="w-full"
                  options={languageOptions}
                  showSearch
                  filterOption={(
                    input,
                    option
                  ) => {
                    return !!option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  placeholder="Select language"
                />
              </div>
            </div>


          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex gap-2 items-center mb-2">
                <label className="text-sm font-medium">Job Description</label>
              </div>
              <Input.TextArea
                value={vacancyDescription}
                onChange={(e) => setVacancyDescription(e.target.value)}
                placeholder="Describe the job position, responsibilities, and requirements"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="mb-4 text-xl font-semibold">Choose Template</h2>
            <ChooseTemplate
              onChooseTemplate={(template) => {
                setSelectedTemplate(template);
              }}
              selectedTemplate={selectedTemplate}
            />
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Description</h3>
              <button className="flex justify-center items-center w-6 h-6">
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.16797 11.9993C3.3914 11.9993 3.00311 11.9993 2.69683 11.8725C2.28845 11.7033 1.96399 11.3789 1.79484 10.9705C1.66797 10.6642 1.66797 10.2759 1.66797 9.49935V3.83268C1.66797 2.89926 1.66797 2.43255 1.84962 2.07603C2.00941 1.76243 2.26438 1.50746 2.57798 1.34767C2.9345 1.16602 3.40121 1.16602 4.33464 1.16602H10.0013C10.7779 1.16602 11.1662 1.16602 11.4724 1.29288C11.8808 1.46204 12.2053 1.7865 12.3744 2.19488C12.5013 2.50116 12.5013 2.88945 12.5013 3.66602M10.168 17.8327H15.668C16.6014 17.8327 17.0681 17.8327 17.4246 17.651C17.7382 17.4912 17.9932 17.2363 18.153 16.9227C18.3346 16.5661 18.3346 16.0994 18.3346 15.166V9.66602C18.3346 8.73259 18.3346 8.26588 18.153 7.90937C17.9932 7.59576 17.7382 7.34079 17.4246 7.18101C17.0681 6.99935 16.6014 6.99935 15.668 6.99935H10.168C9.23455 6.99935 8.76784 6.99935 8.41132 7.18101C8.09771 7.34079 7.84275 7.59576 7.68296 7.90937C7.5013 8.26588 7.5013 8.7326 7.5013 9.66602V15.166C7.5013 16.0994 7.5013 16.5661 7.68296 16.9227C7.84275 17.2363 8.09771 17.4912 8.41132 17.651C8.76784 17.8327 9.23455 17.8327 10.168 17.8327Z"
                    stroke="#344054"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-700">{generatedContent?.description}</p>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-base font-medium">Perks & Benefits</h3>
              <button className="flex justify-center items-center w-6 h-6">
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.16797 11.9993C3.3914 11.9993 3.00311 11.9993 2.69683 11.8725C2.28845 11.7033 1.96399 11.3789 1.79484 10.9705C1.66797 10.6642 1.66797 10.2759 1.66797 9.49935V3.83268C1.66797 2.89926 1.66797 2.43255 1.84962 2.07603C2.00941 1.76243 2.26438 1.50746 2.57798 1.34767C2.9345 1.16602 3.40121 1.16602 4.33464 1.16602H10.0013C10.7779 1.16602 11.1662 1.16602 11.4724 1.29288C11.8808 1.46204 12.2053 1.7865 12.3744 2.19488C12.5013 2.50116 12.5013 2.88945 12.5013 3.66602M10.168 17.8327H15.668C16.6014 17.8327 17.0681 17.8327 17.4246 17.651C17.7382 17.4912 17.9932 17.2363 18.153 16.9227C18.3346 16.5661 18.3346 16.0994 18.3346 15.166V9.66602C18.3346 8.73259 18.3346 8.26588 18.153 7.90937C17.9932 7.59576 17.7382 7.34079 17.4246 7.18101C17.0681 6.99935 16.6014 6.99935 15.668 6.99935H10.168C9.23455 6.99935 8.76784 6.99935 8.41132 7.18101C8.09771 7.34079 7.84275 7.59576 7.68296 7.90937C7.5013 8.26588 7.5013 8.7326 7.5013 9.66602V15.166C7.5013 16.0994 7.5013 16.5661 7.68296 16.9227C7.84275 17.2363 8.09771 17.4912 8.41132 17.651C8.76784 17.8327 9.23455 17.8327 10.168 17.8327Z"
                    stroke="#344054"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className="pl-5 list-disc">
              {generatedContent?.perks?.map((perk, index) => (
                <li key={index} className="text-gray-700">
                  {perk}
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-base font-medium">Add tags (optional)</h3>
              <div className="flex justify-center items-center w-4 h-4 rounded-full border cursor-help">
                ?
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => removeTag(tag)}
                  className="rounded-full"
                >
                  {tag}
                </Tag>
              ))}
            </div>

            {!backendLoading && renderButtons()}
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Choose Template</h2>
            <ChooseTemplate
              onChooseTemplate={(template) => {
                setSelectedTemplate(template);
              }}
              selectedTemplate={selectedTemplate}
            />
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Description</h3>
              <button className="flex justify-center items-center w-6 h-6">
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.16797 11.9993C3.3914 11.9993 3.00311 11.9993 2.69683 11.8725C2.28845 11.7033 1.96399 11.3789 1.79484 10.9705C1.66797 10.6642 1.66797 10.2759 1.66797 9.49935V3.83268C1.66797 2.89926 1.66797 2.43255 1.84962 2.07603C2.00941 1.76243 2.26438 1.50746 2.57798 1.34767C2.9345 1.16602 3.40121 1.16602 4.33464 1.16602H10.0013C10.7779 1.16602 11.1662 1.16602 11.4724 1.29288C11.8808 1.46204 12.2053 1.7865 12.3744 2.19488C12.5013 2.50116 12.5013 2.88945 12.5013 3.66602M10.168 17.8327H15.668C16.6014 17.8327 17.0681 17.8327 17.4246 17.651C17.7382 17.4912 17.9932 17.2363 18.153 16.9227C18.3346 16.5661 18.3346 16.0994 18.3346 15.166V9.66602C18.3346 8.73259 18.3346 8.26588 18.153 7.90937C17.9932 7.59576 17.7382 7.34079 17.4246 7.18101C17.0681 6.99935 16.6014 6.99935 15.668 6.99935H10.168C9.23455 6.99935 8.76784 6.99935 8.41132 7.18101C8.09771 7.34079 7.84275 7.59576 7.68296 7.90937C7.5013 8.26588 7.5013 8.7326 7.5013 9.66602V15.166C7.5013 16.0994 7.5013 16.5661 7.68296 16.9227C7.84275 17.2363 8.09771 17.4912 8.41132 17.651C8.76784 17.8327 9.23455 17.8327 10.168 17.8327Z"
                    stroke="#344054"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-700">{generatedContent?.description}</p>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-base font-medium">Perks & Benefits</h3>
              <button className="flex justify-center items-center w-6 h-6">
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.16797 11.9993C3.3914 11.9993 3.00311 11.9993 2.69683 11.8725C2.28845 11.7033 1.96399 11.3789 1.79484 10.9705C1.66797 10.6642 1.66797 10.2759 1.66797 9.49935V3.83268C1.66797 2.89926 1.66797 2.43255 1.84962 2.07603C2.00941 1.76243 2.26438 1.50746 2.57798 1.34767C2.9345 1.16602 3.40121 1.16602 4.33464 1.16602H10.0013C10.7779 1.16602 11.1662 1.16602 11.4724 1.29288C11.8808 1.46204 12.2053 1.7865 12.3744 2.19488C12.5013 2.50116 12.5013 2.88945 12.5013 3.66602M10.168 17.8327H15.668C16.6014 17.8327 17.0681 17.8327 17.4246 17.651C17.7382 17.4912 17.9932 17.2363 18.153 16.9227C18.3346 16.5661 18.3346 16.0994 18.3346 15.166V9.66602C18.3346 8.73259 18.3346 8.26588 18.153 7.90937C17.9932 7.59576 17.7382 7.34079 17.4246 7.18101C17.0681 6.99935 16.6014 6.99935 15.668 6.99935H10.168C9.23455 6.99935 8.76784 6.99935 8.41132 7.18101C8.09771 7.34079 7.84275 7.59576 7.68296 7.90937C7.5013 8.26588 7.5013 8.7326 7.5013 9.66602V15.166C7.5013 16.0994 7.5013 16.5661 7.68296 16.9227C7.84275 17.2363 8.09771 17.4912 8.41132 17.651C8.76784 17.8327 9.23455 17.8327 10.168 17.8327Z"
                    stroke="#344054"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className="pl-5 list-disc">
              {generatedContent?.perks?.map((perk, index) => (
                <li key={index} className="text-gray-700">
                  {perk}
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-base font-medium">Add tags (optional)</h3>
              <div className="flex justify-center items-center w-4 h-4 rounded-full border cursor-help">
                ?
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => removeTag(tag)}
                  className="rounded-full"
                >
                  {tag}
                </Tag>
              ))}
            </div>

            {!backendLoading && renderButtons()}
          </div>
        );
    }
  };

  console.log("user", user);
  console.log("backendLoading", backendLoading);
  /* Logic to generate the vacancy using AI */
  const handleCreateNewVacancy = async (formData) => {
    setBackendLoading(true);
    console.log("Starting vacancy creation with data:", formData);

    if (!formData.jobTitle) {
      return antdMessage.error("Job title is required");
    }

    try {
      if (formData.useAI) {
        // Initialize loading steps
        const steps = [
          "Analyzing job requirements...",
          "Crafting compelling job description...",
          "Designing the perfect landing page...",
          "Adding company branding...",
          "Finalizing your vacancy...",
        ];
        setLoadingSteps(steps);
        setCurrentLoadingStep(0);
        setLoadingMessage("Starting AI engine... Please wait while we prepare your vacancy.");

        // Set loading state after initializing steps
        setBackendLoading(true);

        // Process with AI
        const aiResponse = await AiService.processFromScratchWithAI({
          jobTitle: formData.jobTitle,
          department: formData.department,
          description: formData.description,
          perks: formData.perks,
          language: formData.language,
          tone: formData.tone,
          companyInfo: user?.companyInfo,
          userData: {
            email: user?.email,
            phone: user?.phone,
            avatar: user?.avatar,
            firstName: user?.firstName,
            lastName: user?.lastName,
          }
        });

        if (!aiResponse.data.success) {
          throw new Error(aiResponse.data.error || 'AI processing failed');
        }

        // Get the AI-processed content
        const aiResult = JSON.parse(aiResponse.data.data.content);
        console.log("FromScratchModal aiResult", aiResult);



        // Create the vacancy
        const vacancyData = {
          ...aiResult,
          specifications: aiResult.specifications?.map((spec) => ({
            ...spec,
            enabled: true
          })),
          recruiters: aiResult.recruiters?.map((recruiter) => ({
            ...recruiter,
            recruiterPhoneEnabled: recruiter.recruiterPhone ? true : false,
            recruiterEmailEnabled: recruiter.recruiterEmail ? true : false
          })),
          ...brandingDetails,
          templateId: selectedTemplate,
          user_id: user?._id,
          lang: language,
          applyType: 'form', // 🚀 Always default to custom form
          cta2Link: '#apply' // 🚀 Always default to apply action
        };

        console.log("FromScratchModal vacancyData", vacancyData);


        const res = await AiService.createVacancy(vacancyData);
        console.log("FromScratchModal res", res);
        // Clear session storage on successful creation
        sessionStorage.removeItem('vacancy_scratch_progress');
        
        onRefresh()
        setJobTitleModal(false);
        router.push(`/edit-page/${res.data.data.result._id}`);
      }
    } catch (error) {
      console.error("Error during vacancy creation:", error);
      antdMessage.error("Failed to create vacancy: " + (error.message || "Unknown error"));
      setBackendLoading(false);
    }
  };

  const handleClose = () => {
    console.log('FromScratchModal - Closing modal. Current data:', {
      jobTitle,
      department,
      selectedLanguages
    });
    if (!jobTitle && !department && selectedLanguages.length === 0) {
      console.log('FromScratchModal - Cleaning up empty form data');
      sessionStorage.removeItem('vacancy_scratch_progress');
    }
    onClose();
  };

  console.log("open", open);

  return (
    <>
      <Modal maskClosable={false} title="" open={true} onCancel={handleClose} footer={null} width={600} style={{
        maxHeight: "80vh",
        overflowY: "auto",
        top: 20,
        marginTop: 0
      }}>
        {!backendLoading && (
          <Heading
            size="7xl"
            as="h1"
            className="!text-black-900_01 text-center"
          >{`Create vacancy for ${jobTitle || "New Position"}`}</Heading>
        )}
        <div className="flex flex-col gap-6">
          {renderStepContent()}

          <div className="flex flex-col gap-2">
            {step === 1 && (
              <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2">
                <button
                  onClick={ongoBack}
                  className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline"
                >
                  Go Back
                </button>
                <button
                  onClick={handleNext}
                  className={`py-2 px-4 text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedTemplate === -1
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } rounded-md`}
                  disabled={selectedTemplate === -1||selectedTemplate !== 1}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && !backendLoading && (
              <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2 h-full">
                <button
                  onClick={handleBack}
                  className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline h-fit mt-auto"
                >
                  Back
                </button>
                {useAI ? (
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => {
                        // setUseAI(false);
                        handleCreateWithoutAI();
                      }}
                      className=" px-4 text-center text-gray-600  hover:underline"
                    >
                      {isCreatingWithoutAI ? "Creating..." : "Create without AI"}
                    </button>
                    <button
                      onClick={() => {
                        handleCreateNewVacancy({
                          jobTitle,
                          department,
                          description: vacancyDescription,
                          useAI: true,
                          perks: perksAndBenefits?.split(","),
                          language: language,
                          tone: tone,
                          templateId: selectedTemplate,
                        });
                      }}
                      className="py-2 px-4 text-white bg-[#5207CD] rounded-md hover:bg-blue-600"
                    >
                      Generate Page
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setUseAI(true)}
                      className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline h-fit"
                    >
                      Back to AI
                    </button>
                    <button
                      onClick={() => {
                        handleCreateWithoutAI();
                      }}
                      className="py-2 px-4 text-white bg-[#5207CD] rounded-md hover:bg-blue-600"
                    >
                      {isCreatingWithoutAI ? "Creating..." : "Create Vacancy"}
                    </button>
                  </>
                )}
              </div>
            )}

            {step === 3 && !backendLoading && (
              <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2 h-fit mt-auto">
                <button
                  onClick={handleBack}
                  className="py-2 px-4 text-center text-gray-600 rounded-md border border-gray-300 hover:underline h-fit"
                >
                  Back
                </button>
                {useAI ? (
                  <button
                    onClick={() => {
                      handleCreateNewVacancy({
                        jobTitle,
                        department,
                        description: vacancyDescription,
                        useAI: true,
                        perks: perksAndBenefits?.split(","),
                        language: language,
                        tone: tone,
                        templateId: selectedTemplate,
                      });
                    }}
                    className="py-2 px-4 text-white bg-[#5207CD] rounded-md hover:bg-blue-600"
                  >
                    Generate Content
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleCreateWithoutAI();
                    }}
                    className="py-2 px-4 text-white bg-[#5207CD] rounded-md hover:bg-blue-600"
                  >
                    {isCreatingWithoutAI ? "Creating..." : "Create Vacancy"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};




export default FromScratchModal;
