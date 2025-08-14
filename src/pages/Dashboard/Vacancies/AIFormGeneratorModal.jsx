import React, { useState } from "react";
import { Modal, Input, Button, Radio, Select, message, Spin, Divider, Alert } from "antd";
import { RobotOutlined, LinkOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import AiService from "../../../services/AiService";
import languages from "./lang.json";
import { getTranslation } from "../../../utils/translations";

const { TextArea } = Input;
const { Option } = Select;

// Convert the language object to array of options and remove duplicates (consistent with FromScratchModal)
const languageOptions = Array.from(new Set(Object.values(languages)))
  .map((name) => ({ value: name, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));

const AIFormGeneratorModal = ({ 
  visible, 
  onCancel, 
  onFormGenerated, 
  initialData = null,
  defaultLanguage
}) => {
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false);
  
  // Form inputs
  const [url, setUrl] = useState("");
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || "");
  const [location, setLocation] = useState(initialData?.location || []);
  const [companyInfo, setCompanyInfo] = useState(initialData?.companyInfo || "");
  const [language, setLanguage] = useState(defaultLanguage || "English");
  const [formComplexity, setFormComplexity] = useState("standard");
  const [generatedForm, setGeneratedForm] = useState(null);
  const [languageChanged, setLanguageChanged] = useState(false);

  // Sync language with page language when modal opens or defaultLanguage changes
  React.useEffect(() => {
    if (visible) {
      setLanguage(defaultLanguage || "English");
      setLanguageChanged(false);
    }
  }, [visible, defaultLanguage]);

  // Track language changes to show regeneration notice
  React.useEffect(() => {
    if (generatedForm && language !== (generatedForm.metadata?.language || defaultLanguage)) {
      setLanguageChanged(true);
    }
  }, [language, generatedForm, defaultLanguage]);
  
  // Chatbot state
  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotResponses, setChatbotResponses] = useState({});

  // Robust helper to ensure contact fields with proper translations
  const ensureContactSection = (formData) => {
    if (!formData?.form?.fields) {
      return formData;
    }

    const fields = formData.form.fields;
    
    // Find existing contact field
    const contactFieldIndex = fields.findIndex(field => 
      field.type === 'contact' || 
      field.type === 'email' || 
      (field.label && field.label.toLowerCase().includes('contact'))
    );

    if (contactFieldIndex === -1) {
      // No contact field exists, create one with proper language support
      console.log("⚠️ No contact section found in AI-generated form - creating one with translations");
      
      const contactField = {
        id: `contact_${Date.now()}`,
        type: 'contact',
        label: getTranslation(language, 'contactInformation') || 'Contact Information',
        placeholder: '',
        required: true,
        visible: true,
        isLeadCapture: true,
        firstName: { 
          visible: true, 
          required: true,
          label: getTranslation(language, 'firstName') || 'First Name',
          placeholder: getTranslation(language, 'firstNamePlaceholder') || 'Enter your first name'
        },
        lastName: { 
          visible: true, 
          required: true,
          label: getTranslation(language, 'lastName') || 'Last Name',
          placeholder: getTranslation(language, 'lastNamePlaceholder') || 'Enter your last name'
        },
        email: { 
          visible: true, 
          required: true,
          label: getTranslation(language, 'email') || 'Email',
          placeholder: getTranslation(language, 'emailPlaceholder') || 'Enter your email address'
        },
        phone: { 
          visible: true, 
          required: false,
          label: getTranslation(language, 'phone') || 'Phone',
          placeholder: getTranslation(language, 'phonePlaceholder') || 'Enter your phone number'
        }
      };
      
      return {
        ...formData,
        form: {
          ...formData.form,
          fields: [contactField, ...fields]
        }
      };
    } else if (contactFieldIndex !== 0) {
      // Contact field exists but not first, move it to first position and update translations
      console.log("✅ Contact section exists but not first - moving to top and updating translations");
      
      const contactField = fields[contactFieldIndex];
      const otherFields = fields.filter((_, index) => index !== contactFieldIndex);
      
      // Update contact field with proper translations
      const updatedContactField = {
        ...contactField,
        label: getTranslation(language, 'contactInformation') || contactField.label || 'Contact Information',
        firstName: {
          ...contactField.firstName,
          label: getTranslation(language, 'firstName') || contactField.firstName?.label || 'First Name',
          placeholder: getTranslation(language, 'firstNamePlaceholder') || contactField.firstName?.placeholder || 'Enter your first name'
        },
        lastName: {
          ...contactField.lastName,
          label: getTranslation(language, 'lastName') || contactField.lastName?.label || 'Last Name',
          placeholder: getTranslation(language, 'lastNamePlaceholder') || contactField.lastName?.placeholder || 'Enter your last name'
        },
        email: {
          ...contactField.email,
          label: getTranslation(language, 'email') || contactField.email?.label || 'Email',
          placeholder: getTranslation(language, 'emailPlaceholder') || contactField.email?.placeholder || 'Enter your email address'
        },
        phone: {
          ...contactField.phone,
          label: getTranslation(language, 'phone') || contactField.phone?.label || 'Phone',
          placeholder: getTranslation(language, 'phonePlaceholder') || contactField.phone?.placeholder || 'Enter your phone number'
        }
      };
      
      return {
        ...formData,
        form: {
          ...formData.form,
          fields: [updatedContactField, ...otherFields]
        }
      };
    } else {
      // Contact field is already first, just update translations
      console.log("✅ Contact section exists and is first - updating translations");
      
      const contactField = fields[0];
      const updatedContactField = {
        ...contactField,
        label: getTranslation(language, 'contactInformation') || contactField.label || 'Contact Information',
        firstName: {
          ...contactField.firstName,
          label: getTranslation(language, 'firstName') || contactField.firstName?.label || 'First Name',
          placeholder: getTranslation(language, 'firstNamePlaceholder') || contactField.firstName?.placeholder || 'Enter your first name'
        },
        lastName: {
          ...contactField.lastName,
          label: getTranslation(language, 'lastName') || contactField.lastName?.label || 'Last Name',
          placeholder: getTranslation(language, 'lastNamePlaceholder') || contactField.lastName?.placeholder || 'Enter your last name'
        },
        email: {
          ...contactField.email,
          label: getTranslation(language, 'email') || contactField.email?.label || 'Email',
          placeholder: getTranslation(language, 'emailPlaceholder') || contactField.email?.placeholder || 'Enter your email address'
        },
        phone: {
          ...contactField.phone,
          label: getTranslation(language, 'phone') || contactField.phone?.label || 'Phone',
          placeholder: getTranslation(language, 'phonePlaceholder') || contactField.phone?.placeholder || 'Enter your phone number'
        }
      };
      
      return {
        ...formData,
        form: {
          ...formData.form,
          fields: [updatedContactField, ...fields.slice(1)]
        }
      };
    }
  };

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
        // 🔥 ENSURE CONTACT SECTION: Double-check that contact info is included
        const generatedFormData = response.data.data;
        let ensuredForm = ensureContactSection(generatedFormData);
        
        // 🚨 FINAL VALIDATION: Check if contact field is properly structured
        if (!ensuredForm?.form?.fields?.[0] || ensuredForm.form.fields[0].type !== 'contact') {
          console.error('⚠️ AI Form Generator: Contact field validation failed, applying comprehensive fallback');
          
          // Create a complete fallback form structure
          const fallbackForm = {
            form: {
              title: getTranslation(language, 'applicationForm') || `Application Form - ${inputData.jobTitle || 'Position'}`,
              description: getTranslation(language, 'applicationFormDescription') || 'Please fill out the form below to apply for this position.',
              submitText: getTranslation(language, 'submitApplication') || 'Submit Application',
              fields: [
                {
                  id: `contact_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                  type: 'contact',
                  label: getTranslation(language, 'contactInformation') || 'Contact Information',
                  placeholder: '',
                  required: true,
                  visible: true,
                  isLeadCapture: true,
                  firstName: { 
                    visible: true, 
                    required: true,
                    label: getTranslation(language, 'firstName') || 'First Name',
                    placeholder: getTranslation(language, 'firstNamePlaceholder') || 'Enter your first name'
                  },
                  lastName: { 
                    visible: true, 
                    required: true,
                    label: getTranslation(language, 'lastName') || 'Last Name',
                    placeholder: getTranslation(language, 'lastNamePlaceholder') || 'Enter your last name'
                  },
                  email: { 
                    visible: true, 
                    required: true,
                    label: getTranslation(language, 'email') || 'Email',
                    placeholder: getTranslation(language, 'emailPlaceholder') || 'Enter your email address'
                  },
                  phone: { 
                    visible: true, 
                    required: false,
                    label: getTranslation(language, 'phone') || 'Phone',
                    placeholder: getTranslation(language, 'phonePlaceholder') || 'Enter your phone number'
                  }
                },
                // Add any additional fields from the original response if they exist
                ...(ensuredForm?.form?.fields || []).filter(field => field.type !== 'contact')
              ]
            },
            metadata: {
              jobTitle: inputData.jobTitle || 'Position',
              jobLocation: inputData.location || [],
              generatedAt: new Date().toISOString(),
              inputType,
              language,
              formComplexity,
              fallbackApplied: true
            }
          };
          
          ensuredForm = fallbackForm;
        }
        
        // Store the generated form and mark language as synchronized
        setGeneratedForm(ensuredForm);
        setLanguageChanged(false);
        
        message.success("Application form generated successfully!");
        onFormGenerated(ensuredForm);
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
    setGeneratedForm(null);
    setLanguageChanged(false);
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

        {/* Language Change Notice */}
        {languageChanged && (
          <Alert
            message="Language Changed"
            description="You've changed the language after generating a form. Please regenerate the form to apply the new language settings."
            type="warning"
            showIcon
            className="mb-4"
            action={
              <Button size="small" type="primary" onClick={handleGenerateForm} loading={loading}>
                Regenerate Now
              </Button>
            }
          />
        )}

        {/* AI Generation Notice */}
        <Alert
          message="AI-Generated Form"
          description="The AI will generate a complete application form including contact information and job-specific questions in your selected language."
          type="info"
          showIcon
          className="mb-4"
        />

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
              showSearch
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              options={languageOptions}
            />
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
              <Option value="simple">Simple (3-5 fields + Contact Info)</Option>
              <Option value="standard">Standard (6-10 fields + Contact Info)</Option>
              <Option value="comprehensive">Comprehensive (10-15 fields + Contact Info)</Option>
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