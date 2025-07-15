import React, { useState } from "react";
import { Modal, Input, Button, Radio, Select, message, Spin, Divider, Alert } from "antd";
import { RobotOutlined, LinkOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import AiService from "../../../services/AiService";

const { TextArea } = Input;
const { Option } = Select;

const AIFormGeneratorModal = ({ 
  visible, 
  onCancel, 
  onFormGenerated, 
  initialData = null 
}) => {
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false);
  
  // Form inputs
  const [url, setUrl] = useState("");
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || "");
  const [location, setLocation] = useState(initialData?.location || []);
  const [companyInfo, setCompanyInfo] = useState(initialData?.companyInfo || "");
  const [language, setLanguage] = useState("en");
  const [formComplexity, setFormComplexity] = useState("standard");
  
  // Chatbot state
  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotResponses, setChatbotResponses] = useState({});

  const chatbotQuestions = [
    {
      key: "jobTitle",
      question: "What is the job title or position name?",
      type: "text",
      placeholder: "e.g., Senior Software Engineer, Marketing Manager"
    },
    {
      key: "jobType",
      question: "What type of position is this?",
      type: "select",
      options: [
        { value: "full-time", label: "Full-time" },
        { value: "part-time", label: "Part-time" },
        { value: "contract", label: "Contract" },
        { value: "internship", label: "Internship" },
        { value: "freelance", label: "Freelance" }
      ]
    },
    {
      key: "experienceLevel",
      question: "What experience level are you looking for?",
      type: "select",
      options: [
        { value: "entry", label: "Entry Level (0-2 years)" },
        { value: "mid", label: "Mid Level (2-5 years)" },
        { value: "senior", label: "Senior Level (5+ years)" },
        { value: "executive", label: "Executive Level" }
      ]
    },
    {
      key: "keySkills",
      question: "What are the most important skills for this role?",
      type: "textarea",
      placeholder: "List the key skills, technologies, or qualifications required"
    },
    {
      key: "jobDescription",
      question: "Provide a brief description of the role and responsibilities:",
      type: "textarea",
      placeholder: "Describe what the person will be doing day-to-day"
    },
    {
      key: "location",
      question: "Where is this position located?",
      type: "text",
      placeholder: "e.g., New York, NY / Remote / Hybrid"
    }
  ];

  const handleGenerateForm = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      let inputData = {};

      if (inputType === "url") {
        inputData = { url: url.trim() };
      } else if (inputType === "text") {
        inputData = {
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
          location: location,
          companyInfo: companyInfo.trim()
        };
      } else if (inputType === "chatbot") {
        inputData = {
          responses: {
            ...chatbotResponses,
            jobTitle: chatbotResponses.jobTitle,
            jobDescription: chatbotResponses.jobDescription,
            location: chatbotResponses.location ? [chatbotResponses.location] : []
          }
        };
      }

      const response = await AiService.generateApplicationForm({
        inputType,
        inputData,
        language,
        formComplexity
      });

      if (response.data.success) {
        message.success("Application form generated successfully!");
        onFormGenerated(response.data.data);
        resetForm();
      } else {
        throw new Error(response.data.error || "Failed to generate form");
      }

    } catch (error) {
      console.error("Error generating form:", error);
      message.error("Failed to generate application form: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    if (inputType === "url" && !url.trim()) {
      message.warning("Please enter a valid URL");
      return false;
    }
    
    if (inputType === "text" && (!jobTitle.trim() || !jobDescription.trim())) {
      message.warning("Please provide both job title and description");
      return false;
    }

    if (inputType === "chatbot" && (!chatbotResponses.jobTitle || !chatbotResponses.jobDescription)) {
      message.warning("Please complete the chatbot questionnaire");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setUrl("");
    setJobTitle("");
    setJobDescription("");
    setLocation([]);
    setCompanyInfo("");
    setChatbotStep(0);
    setChatbotResponses({});
    onCancel();
  };

  const handleChatbotNext = () => {
    const currentQuestion = chatbotQuestions[chatbotStep];
    const response = chatbotResponses[currentQuestion.key];
    
    if (!response || (typeof response === 'string' && !response.trim())) {
      message.warning("Please answer the current question before proceeding");
      return;
    }

    if (chatbotStep < chatbotQuestions.length - 1) {
      setChatbotStep(chatbotStep + 1);
    }
  };

  const handleChatbotPrevious = () => {
    if (chatbotStep > 0) {
      setChatbotStep(chatbotStep - 1);
    }
  };

  const updateChatbotResponse = (key, value) => {
    setChatbotResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderInputTypeContent = () => {
    if (inputType === "url") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Posting URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              prefix={<LinkOutlined />}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL of an existing job posting to extract requirements
            </p>
          </div>
        </div>
      );
    }

    if (inputType === "text") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <TextArea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <Input
              value={location.join(", ")}
              onChange={(e) => setLocation(e.target.value.split(",").map(l => l.trim()).filter(l => l))}
              placeholder="e.g., New York, NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Information (Optional)
            </label>
            <TextArea
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              placeholder="Brief information about your company..."
              rows={3}
            />
          </div>
        </div>
      );
    }

    if (inputType === "chatbot") {
      const currentQuestion = chatbotQuestions[chatbotStep];
      const progress = ((chatbotStep + 1) / chatbotQuestions.length) * 100;

      return (
        <div className="space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {chatbotStep + 1} of {chatbotQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current question */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === "text" && (
              <Input
                value={chatbotResponses[currentQuestion.key] || ""}
                onChange={(e) => updateChatbotResponse(currentQuestion.key, e.target.value)}
                placeholder={currentQuestion.placeholder}
                size="large"
              />
            )}

            {currentQuestion.type === "textarea" && (
              <TextArea
                value={chatbotResponses[currentQuestion.key] || ""}
                onChange={(e) => updateChatbotResponse(currentQuestion.key, e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                size="large"
              />
            )}

            {currentQuestion.type === "select" && (
              <Select
                value={chatbotResponses[currentQuestion.key]}
                onChange={(value) => updateChatbotResponse(currentQuestion.key, value)}
                placeholder="Select an option"
                size="large"
                className="w-full"
              >
                {currentQuestion.options.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handleChatbotPrevious}
              disabled={chatbotStep === 0}
            >
              Previous
            </Button>
            
            <Button
              type="primary"
              onClick={handleChatbotNext}
              disabled={chatbotStep === chatbotQuestions.length - 1}
            >
              Next
            </Button>
          </div>

          {/* Summary when complete */}
          {chatbotStep === chatbotQuestions.length - 1 && (
            <Alert
              message="Questionnaire Complete!"
              description="All questions have been answered. You can now generate your application form."
              type="success"
              showIcon
            />
          )}
        </div>
      );
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-blue-600" />
          <span>AI Form Generator</span>
        </div>
      }
      open={visible}
      onCancel={resetForm}
      width={700}
      footer={null}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Input type selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            How would you like to create your application form?
          </h3>
          
          <Radio.Group 
            value={inputType} 
            onChange={(e) => setInputType(e.target.value)}
            className="w-full"
          >
            <div className="space-y-3">
              <Radio value="url" className="flex items-start">
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <LinkOutlined />
                    <span className="font-medium">From URL</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Extract requirements from an existing job posting URL
                  </div>
                </div>
              </Radio>
              
              <Radio value="text" className="flex items-start">
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <FileTextOutlined />
                    <span className="font-medium">From Text</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Provide job description and requirements manually
                  </div>
                </div>
              </Radio>
              
              <Radio value="chatbot" className="flex items-start">
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <MessageOutlined />
                    <span className="font-medium">Interactive Chatbot</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Answer guided questions to build your form step-by-step
                  </div>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </div>

        <Divider />

        {/* Input content based on type */}
        {renderInputTypeContent()}

        <Divider />

        {/* Form settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <Select
              value={language}
              onChange={setLanguage}
              className="w-full"
            >
              <Option value="en">English</Option>
              <Option value="de">German</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Complexity
            </label>
            <Select
              value={formComplexity}
              onChange={setFormComplexity}
              className="w-full"
            >
              <Option value="simple">Simple (3-5 fields)</Option>
              <Option value="standard">Standard (6-10 fields)</Option>
              <Option value="comprehensive">Comprehensive (10-15 fields)</Option>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={resetForm}>
            Cancel
          </Button>
          
          <Button
            type="primary"
            onClick={handleGenerateForm}
            loading={loading}
            disabled={
              inputType === "chatbot" && 
              chatbotStep < chatbotQuestions.length - 1
            }
            icon={<RobotOutlined />}
          >
            {loading ? "Generating Form..." : "Generate Form with AI"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIFormGeneratorModal; 