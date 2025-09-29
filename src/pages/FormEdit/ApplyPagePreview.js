import React, { useState, useEffect } from 'react';
import { Button, Input, Radio, Checkbox, Select, Progress, message, DatePicker } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
// Removed PhoneInput - using regular Input instead
// 🎨 BRANDING IMPORTS
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";
import { getTranslation } from "../../utils/translations";
// Import custom styled components
import {
  Button as CustomButton,
  Heading,
  Img,
  Input as CustomInput,
  Text,
  Radio as CustomRadio,
  CheckBox as CustomCheckBox,
} from "../Dashboard/Vacancies/components/components";

// Removed country detection since we're using regular Input instead of PhoneInput

const { TextArea } = Input;
const { Option } = Select;

// Import the same custom components from apply page
const MultipleChoice = ({ field, value, onChange }) => (
  <div className="w-full space-y-3">
    {field.options?.map((option, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D...
      // Handle both string format ["HTML", "CSS"] and object format [{text: "HTML", isNegative: false}]
      const optionText = typeof option === 'string' ? option : option.text;
      const isSelected = value === optionText;
      
      return (
        <div 
          key={index} 
          className={`
            border-2 rounded-xl cursor-pointer transition-all duration-200
           
          `}
          onClick={() => onChange({ target: { value: optionText } })}
        >
          <div className="flex items-center p-4">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0
              ${isSelected 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {letter}
            </div>
            <p 
             className={`text-sm  flex-1
              ${isSelected ? 'text-blue-500' : 'text-gray-800'}
            `}>
              {optionText}
            </p>
            <CustomRadio
              name={field.id}
              value={optionText}
              checked={isSelected}
              onChange={() => onChange({ target: { value: optionText } })}
              className="ml-3 opacity-0"
            />
          </div>
        </div>
      );
    })}
  </div>
);

const MultiSelectChoice = ({ field, value, onChange }) => (
  <div className="w-full space-y-3">
    {field.options?.map((option, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D...
      // Handle both string format ["HTML", "CSS"] and object format [{text: "HTML", isNegative: false}]
      const optionText = typeof option === 'string' ? option : option.text;
      const isSelected = value?.includes(optionText);
      
      return (
        <div 
          key={index} 
          className={`
            border-2 rounded-xl cursor-pointer transition-all duration-200
          
          `}
          onClick={() => {
            const newValue = value || [];
            if (isSelected) {
              onChange(newValue.filter(v => v !== optionText));
            } else {
              onChange([...newValue, optionText]);
            }
          }}
        >
          <div className="flex items-center p-4">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0
              ${isSelected 
                ? 'bg-blue-500 text-white' 
                : ' border-2 border-gray-200'
              }
            `}>
              {letter}
            </div>
            <p  className={`text-sm  flex-1
              ${isSelected ? 'text-blue-500' : 'text-gray-800'}
            `}>
              {optionText}
            </p>
            <CustomCheckBox
              name={field.id}
              value={optionText}
              checked={isSelected}
              onChange={(checked) => {
                const newValue = value || [];
                if (checked) {
                  onChange([...newValue, optionText]);
                } else {
                  onChange(newValue.filter(v => v !== optionText));
                }
              }}
              className="ml-3 opacity-0"
            />
          </div>
        </div>
      );
    })}
  </div>
);

const CustomDropdown = ({ field, value, onChange }) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder={field.placeholder || "Select an option"}
    size="large"
    className="w-full"
    style={{ borderRadius: '8px' }}
  >
    {field.options?.map((option, index) => {
      // Handle both string format ["HTML", "CSS"] and object format [{text: "HTML", isNegative: false}]
      const optionText = typeof option === 'string' ? option : option.text;
      return (
        <Option key={index} value={optionText}>
          {optionText}
        </Option>
      );
    })}
  </Select>
);

const YesNoQuestion = ({ field, value, onChange }) => {
  const yesLabel = field?.yesLabel || 'Yes';
  const noLabel = field?.noLabel || 'No';
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('yes')}
          className={`
            relative flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm
            ${
              value === 'yes'
                ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-25 hover:text-green-600'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${
                value === 'yes'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }
            `}>
              {value === 'yes' && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{yesLabel}</span>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onChange('no')}
          className={`
            relative flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm
            ${
              value === 'no'
                ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25 hover:text-red-600'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${
                value === 'no'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }
            `}>
              {value === 'no' && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{noLabel}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const FileUpload = ({ value, onChange, placeholder }) => (
  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
    <div className="space-y-4">
      <div className="text-blue-500">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-medium text-blue-600">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        {value && <p className="text-sm text-green-600 mt-2">✓ {value}</p>}
      </div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            onChange(file.name);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.svg"
      />
    </div>
  </div>
);

export default function ApplyPagePreview({ landingPageData, currentStep = 0, isPreviewMode = true, onStepChange }) {
  // 🎨 BRAND COLORS FROM DATABASE  
  const user = useSelector(selectUser);
  
  // STATE DECLARATIONS (MOVED UP TO MATCH APPLY.JS)
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);
  // Note: currentStep is now controlled by parent component
  // Removed detectedCountry since we're using regular Input instead of PhoneInput
  
  // 🎨 DYNAMIC BRAND COLORS - NO HARDCODING!
  const [stableColors, setStableColors] = useState({
    primary: landingPageData?.primaryColor || null  // NO hardcoded colors!
  });
  
  // Update colors when landing page data changes (SAME AS APPLY.JS)
  useEffect(() => {
    if (landingPageData?.primaryColor) {
      const realPrimary = landingPageData.primaryColor;
      
      console.log("🎨 PREVIEW: USING REAL USER COLOR:", {
        realPrimary,
        landingPageData: !!landingPageData
      });
      
      setStableColors({
        primary: realPrimary
      });
    }
  }, [landingPageData]);
  
  // Use real user colors - NO defaults if not loaded yet (SAME AS APPLY.JS)
  const primaryColor = stableColors.primary || landingPageData?.primaryColor;
  const secondaryColor = primaryColor; // SAME as primary!
  const tertiaryColor = primaryColor;
  
  // 🎨 Check if we have brand data loaded
  const hasBrandData = !!(landingPageData?.primaryColor);
  
  // 🎨 ENHANCED DEBUG: Log ALL color sources in preview
  console.log("🎨 PREVIEW REAL COLORS FROM DATABASE:", {
    "FINAL_USED": { primaryColor, secondaryColor, tertiaryColor },
    "hasBrandData": hasBrandData,
    "landingPageColors": {
      primary: landingPageData?.primaryColor,
      secondary: landingPageData?.primaryColor,
      tertiary: landingPageData?.primaryColor
    },
    "expectedTurquoise": "#11dade",
    "expectedPink": "#e0237e",
    "isUsingCorrectColors": primaryColor === "#11dade" && secondaryColor === "#e0237e",
    "hasColors": !!(landingPageData?.primaryColor)
  });
  
  // 🔥 APPLY COLORS ONLY WHEN WE HAVE REAL USER COLORS (SAME AS APPLY.JS)
  useEffect(() => {
    // ONLY apply if we have real user colors - NO defaults!
    if (!primaryColor) {
      console.log("⏳ PREVIEW: Waiting for real user colors...");
      return;
    }
    
    console.log("🔥 PREVIEW: APPLYING REAL USER COLOR:", {
      primaryColor,
      timestamp: new Date().toISOString()
    });
    
    // Function to apply ONLY real user primary color
    const applyRealUserColor = () => {
      const previewContainer = document.querySelector('.preview-form-container');
      if (!previewContainer) {
        console.log('❌ Preview container not found');
        return;
      }
      
      const allButtons = previewContainer.querySelectorAll('button, .ant-btn, [class*="ant-btn"]');
      console.log(`🎯 PREVIEW: FOUND ${allButtons.length} BUTTONS - APPLYING REAL COLOR: ${primaryColor}`);
      
      allButtons.forEach((btn, i) => {
        const text = btn.textContent?.trim() || '';
        console.log(`🔥 PREVIEW: REAL COLOR on "${text}": ${primaryColor}`);
        
        // Force ONLY real user color
        btn.style.setProperty('background', primaryColor, 'important');
        btn.style.setProperty('background-color', primaryColor, 'important');
        btn.style.setProperty('border-color', primaryColor, 'important');
        btn.style.setProperty('border', `1px solid ${primaryColor}`, 'important');
        btn.style.setProperty('color', 'white', 'important');
        btn.style.setProperty('background-image', 'none', 'important');
        btn.style.setProperty('box-shadow', 'none', 'important');
        
        // NO hover effects
        btn.onmouseenter = null;
        btn.onmouseleave = null;
      });
    };
    
    // Apply immediately and with delays
    applyRealUserColor();
    setTimeout(applyRealUserColor, 100);
    setTimeout(applyRealUserColor, 500);
    setTimeout(applyRealUserColor, 1000);
    
  }, [primaryColor, landingPageData, currentStep]);
  
  // Template palette hook for consistent color application
  const { getColor, getPrimary } = useTemplatePalette(
    {
      primaryColor: "#5207CD",
      secondaryColor: "#0C7CE6", 
      tertiaryColor: "#6B46C1",
    },
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Removed country detection since we're using regular Input instead of PhoneInput

  useEffect(() => {
    if (landingPageData) {
      // Filter visible fields (treat undefined as visible for backwards compatibility)
      const visibleFields = (landingPageData?.form?.fields || []).filter(field => field.visible !== false);
      
      // Simple 1:1 mapping - use form fields as they are
      // Each field becomes one step in the preview
      setFormFields(visibleFields);
      
      // Reset form data if we're at step 0 or form structure changed dramatically
      if (currentStep === 0 || !formFields.length) {
        setFormData({});
      }
    }
  }, [landingPageData]);

  // No longer needed - currentStep is controlled by parent

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleNext = () => {
    console.log('🔄 handleNext: currentStep =', currentStep, 'formFields.length =', formFields.length);
    
    // Skip validation in preview mode for form building
    if (isPreviewMode) {
      if (currentStep < formFields.length) {
        const newStep = currentStep + 1;
        console.log('🔄 handleNext: Moving from step', currentStep, 'to step', newStep);
        
        // Notify parent about step change
        if (onStepChange) {
          onStepChange(newStep);
        }
      } else {
        // Preview "submission"
        console.log('🔄 handleNext: Submitting form, going back to intro');
        message.success('This is a preview - form would be submitted here');
        setFormData({});
        
        if (onStepChange) {
          onStepChange(0); // Go back to intro
        }
      }
      return;
    }

    // Basic validation for preview (simplified)
    const currentField = formFields[currentStep - 1];
    if (currentStep > 0 && currentField?.required) {
      if (currentField.type === 'contact') {
        // Validate contact field (first name, last name, email, phone)
        let hasError = false;
        if (currentField.firstName?.required && !formData[`${currentField.id}_firstName`]?.trim()) hasError = true;
        if (currentField.lastName?.required && !formData[`${currentField.id}_lastName`]?.trim()) hasError = true;
        if (currentField.email?.required && !formData[`${currentField.id}_email`]?.trim()) hasError = true;
        if (currentField.phone?.required && !formData[`${currentField.id}_phone`]?.trim()) hasError = true;
        
        if (hasError) {
          message.warning('Please fill in all required contact fields');
          return;
        }
      } else if (currentField.type === 'date') {
        // Enhanced date field validation for preview
        const dateValue = formData[currentField.id];
        
        if (!dateValue?.trim()) {
          message.warning('Please select a date');
          return;
        }
        
        // Validate the date format and value
        const date = dayjs(dateValue);
        if (!date.isValid()) {
          message.warning('Please enter a valid date');
          return;
        }
      } else if (currentField.type === 'email') {
        // Email validation for preview
        const email = formData[currentField.id];
        if (!email?.trim()) {
          message.warning('Email is required');
          return;
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          message.warning('Please enter a valid email address');
          return;
        }
      } else if (currentField.type === 'phone') {
        // Phone validation for preview
        const phone = formData[currentField.id];
        if (!phone?.trim()) {
          message.warning('Phone number is required');
          return;
        }
        
        // Basic phone format validation (at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          message.warning('Please enter a valid phone number');
          return;
        }
      } else if (currentField.type === 'multiselect') {
        // Multi-select validation for preview
        const values = formData[currentField.id];
        if (!values || !Array.isArray(values) || values.length === 0) {
          message.warning('Please select at least one option');
          return;
        }
      } else {
        // General field validation for preview
        const value = formData[currentField.id];
        if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) {
          message.warning(`${currentField.label || 'This field'} is required in the actual form`);
          return;
        }
      }
    }

    if (currentStep < formFields.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Preview "submission"
      message.success('This is a preview - form would be submitted here');
      setCurrentStep(0);
      setFormData({});
    }
  };

  const handlePrevious = () => {
    console.log('🔄 handlePrevious: currentStep =', currentStep);
    
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      console.log('🔄 handlePrevious: Moving from step', currentStep, 'to step', newStep);
      
      // Notify parent about step change
      if (onStepChange) {
        onStepChange(newStep);
      }
    } else {
      console.log('🔄 handlePrevious: Already at step 0, cannot go back further');
    }
  };

  const renderSingleField = (field, contactField = null) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'contact':
        return (
          <div className="space-y-4">
            {/* First Name and Last Name in a row */}
            <div className="grid grid-cols-2 gap-4">
              {field.firstName?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-xs text-gray-600">
                    {field.firstName?.label || getTranslation(landingPageData?.lang || 'en', 'firstName') || 'First Name'}
                    {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <Input
                    value={formData[`${field.id}_firstName`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_firstName`, e.target.value)}
                    placeholder={field.firstName?.placeholder || getTranslation(landingPageData?.lang || 'en', 'firstName') || "First name"}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
              {field.lastName?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-xs text-gray-600">
                    {field.lastName?.label || getTranslation(landingPageData?.lang || 'en', 'lastName') || 'Last Name'}
                    {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <Input
                    value={formData[`${field.id}_lastName`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_lastName`, e.target.value)}
                    placeholder={field.lastName?.placeholder || getTranslation(landingPageData?.lang || 'en', 'lastName') || "Last name"}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
            </div>
            
            {/* Email field */}
            {field.email?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.email?.label || getTranslation(landingPageData?.lang || 'en', 'email') || 'Email'}
                  {field.email?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="email"
                  value={formData[`${field.id}_email`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_email`, e.target.value)}
                  placeholder={field.email?.placeholder || getTranslation(landingPageData?.lang || 'en', 'email') || "Email address"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            
            {/* Phone field */}
            {field.phone?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.phone?.label || getTranslation(landingPageData?.lang || 'en', 'phone') || 'Phone'}
                  {field.phone?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="tel"
                  value={formData[`${field.id}_phone`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_phone`, e.target.value)}
                  placeholder={field.phone?.placeholder || getTranslation(landingPageData?.lang || 'en', 'phone') || "Phone number"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}

            {/* Additional contact fields */}
            {field.additionalFields?.map((additionalField) => {
              console.log("🔍 PREVIEW: Rendering additional field in renderSingleField:", additionalField.key, field[additionalField.key]);
              
              // Show the field if it exists and is not explicitly hidden
              const fieldData = field[additionalField.key] || additionalField;
              const isVisible = fieldData?.visible !== false;
              
              return isVisible && (
                <div key={additionalField.key}>
                  <label className="block mb-1 font-semibold text-xs text-gray-600">
                    {fieldData?.label || additionalField.label || 'Custom Field'}
                    {fieldData?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_${additionalField.key}`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_${additionalField.key}`, value)}
                      placeholder={fieldData?.placeholder || additionalField.placeholder || 'Enter value'}
                      className="border-none focus:ring-0 text-sm"
                      shape="round"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'email':
        const emailPlaceholder = contactField?.email?.placeholder || field.placeholder || field.customPlaceholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address";
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={emailPlaceholder}
            className="rounded-lg"
            size="large"
          />
        );

      case 'phone':
        const phonePlaceholder = contactField?.phone?.placeholder || field.placeholder || field.customPlaceholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number";
        return (
          <Input
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={phonePlaceholder}
            className="rounded-lg"
            size="large"
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
            size="large"
          />
        );
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';
    console.log("field", field)

    switch (field.type) {

      case 'contact':
        console.log("🔍 PREVIEW CONTACT FIELD:", field);
        console.log("🔍 PREVIEW ADDITIONAL FIELDS:", field.additionalFields);
        return (
          <div className="space-y-4 ">
            {/* First Name and Last Name in a row */}
            <div className="grid grid-cols-2 gap-4">
              {field.firstName?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.firstName?.label || getTranslation(landingPageData?.lang || 'en', 'firstName') || 'First Name'}
                    {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_firstName`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_firstName`, value)}
                      placeholder={field.firstName?.placeholder || getTranslation(landingPageData?.lang || 'en', 'firstName') || "First name"}
                      className="border-none focus:ring-0 text-sm placeholder:text-xs"
                      shape="round"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
              {field.lastName?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.lastName?.label || getTranslation(landingPageData?.lang || 'en', 'lastName') || 'Last Name'}
                    {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_lastName`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_lastName`, value)}
                      placeholder={field.lastName?.placeholder || getTranslation(landingPageData?.lang || 'en', 'lastName') || "Last name"}
                      className="border-none focus:ring-0 text-sm"
                      shape="round"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Email field */}
            {field.email?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.email?.label || getTranslation(landingPageData?.lang || 'en', 'email') || 'Email'}
                  {field.email?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                  <CustomInput
                    type="email"
                    value={formData[`${field.id}_email`] || ''}
                    onChange={(value) => handleInputChange(`${field.id}_email`, value)}
                    placeholder={field.email?.placeholder || getTranslation(landingPageData?.lang || 'en', 'email') || "Email address"}
                    className="border-none focus:ring-0 text-sm"
                    shape="round"
                  />
                </div>
              </div>
            )}
            
            {/* Phone field */}
            {field.phone?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.phone?.label || getTranslation(landingPageData?.lang || 'en', 'phone') || 'Phone'}
                  {field.phone?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                  <CustomInput
                    type="tel"
                    value={formData[`${field.id}_phone`] || ''}
                    onChange={(value) => handleInputChange(`${field.id}_phone`, value)}
                    placeholder={field.phone?.placeholder || getTranslation(landingPageData?.lang || 'en', 'phone') || "Phone number"}
                    className="border-none focus:ring-0 text-sm"
                    shape="round"
                  />
                </div>
              </div>
            )}

            {/* Additional contact fields */}
            {field.additionalFields?.map((additionalField) => {
              console.log("🔍 PREVIEW: Rendering additional field:", additionalField.key, field[additionalField.key]);
              console.log("🔍 PREVIEW: Field object:", field);
              console.log("🔍 PREVIEW: Additional fields array:", field.additionalFields);
              
              // Show the field if it exists and is not explicitly hidden
              const fieldData = field[additionalField.key] || additionalField;
              const isVisible = fieldData?.visible !== false;
              
              return isVisible && (
                <div key={additionalField.key}>
                  <label className="block mb-1 font-semibold text-sm">
                    {fieldData?.label || additionalField.label || 'Custom Field'}
                    {fieldData?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_${additionalField.key}`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_${additionalField.key}`, value)}
                      placeholder={fieldData?.placeholder || additionalField.placeholder || 'Enter value'}
                      className="border-none focus:ring-0 text-sm"
                      shape="round"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'email':
        const emailPlaceholder2 = field.placeholder || field.customPlaceholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address";
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="email"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={emailPlaceholder2}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'phone':
        const phonePlaceholder2 = field.placeholder || field.customPlaceholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number";
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="tel"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={phonePlaceholder2}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'text':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder || "Your answer"}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'longtext':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder}
              textarea={true}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'motivation':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder || "Write your motivation letter"}
              textarea={true}
              className="border-none focus:ring-0 text-sm h-32"
              shape="round"
            />
          </div>
        );

      case 'number':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="number"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder || "Enter a number"}
              min={field.min}
              max={field.max}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'multichoice':
        return (
          <MultipleChoice
            field={field}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'dropdown':
        return (
          <CustomDropdown
            field={field}
            value={value}
            onChange={(selectedValue) => handleInputChange(field.id, selectedValue)}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectChoice
            field={field}
            value={Array.isArray(value) ? value : []}
            onChange={(selectedValues) => handleInputChange(field.id, selectedValues)}
          />
        );

      case 'yesno':
      case 'boolean':
        return (
          <YesNoQuestion
            field={field}
            value={value}
            onChange={(selectedValue) => handleInputChange(field.id, selectedValue)}
          />
        );

      case 'address':
        return (
          <div className="space-y-4">
            {field.line1?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">{field.line1?.label || 'Address Line 1'}</label>
                <Input
                  value={formData[`${field.id}_line1`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_line1`, e.target.value)}
                  placeholder={field.line1?.placeholder || 'Address Line 1'}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            {field.line2?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">{field.line2?.label || 'Address Line 2'}</label>
                <Input
                  value={formData[`${field.id}_line2`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_line2`, e.target.value)}
                  placeholder={field.line2?.placeholder || 'Address Line 2'}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {field.city?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">{field.city?.label || 'City'}</label>
                  <Input
                    value={formData[`${field.id}_city`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_city`, e.target.value)}
                    placeholder={field.city?.placeholder || 'City'}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
              {field.state?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">{field.state?.label || 'State/Province'}</label>
                  <Input
                    value={formData[`${field.id}_state`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_state`, e.target.value)}
                    placeholder={field.state?.placeholder || 'State/Province'}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field.zip?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">{field.zip?.label || 'ZIP/Postal Code'}</label>
                  <Input
                    value={formData[`${field.id}_zip`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_zip`, e.target.value)}
                    placeholder={field.zip?.placeholder || 'ZIP/Postal Code'}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
              {field.country?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">{field.country?.label || 'Country'}</label>
                  <Input
                    value={formData[`${field.id}_country`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_country`, e.target.value)}
                    placeholder={field.country?.placeholder || 'Country'}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'date':
        const dateValue = formData[field.id] ? dayjs(formData[field.id]) : null;
        const currentYear = new Date().getFullYear();
        
        return (
          <DatePicker
            value={dateValue}
            onChange={(date) => {
              const dateString = date ? date.format('YYYY-MM-DD') : '';
              handleInputChange(field.id, dateString);
            }}
            placeholder={field.placeholder || field.customPlaceholder || "Select date"}
            className="rounded-lg w-full"
            size="large"
            format={field.dateFormat === 'DDMMYYYY' ? 'DD/MM/YYYY' : field.dateFormat === 'YYYYMMDD' ? 'YYYY/MM/DD' : 'MM/DD/YYYY'}
            disabledDate={(current) => {
              // Disable dates more than 100 years ago or 10 years in the future
              return current && (
                current < dayjs().subtract(100, 'years') || 
                current > dayjs().add(10, 'years')
              );
            }}
          />
        );

      case 'file':
        return (
          <FileUpload
            value={value}
            onChange={(fileName) => handleInputChange(field.id, fileName)}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
            size="large"
          />
        );
    }
  };

  if (!landingPageData || landingPageData.applyType !== 'form') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Preview Not Available</h3>
          <p className="text-gray-600 text-sm">Set Apply Type to "Custom Application Form" to see preview</p>
        </div>
      </div>
    );
  }

  const totalSteps = formFields.length + 1; // +1 for intro step
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  console.log("formFields[currentStep - 1] ",formFields[currentStep - 1])
  return (
    <div className=" bg-gray-50 preview-form-container">{/* UNIQUE PREVIEW CLASS */}
      {/* 🎨 APPLY CUSTOM FONTS */}
      <ApplyCustomFont landingPageData={{
        ...landingPageData,
        titleFont: landingPageData?.titleFont || user?.titleFont,
        bodyFont: landingPageData?.bodyFont || user?.bodyFont,
        subheaderFont: landingPageData?.subheaderFont || user?.subheaderFont,
      }} />
      
      {/* 🎨 PREVIEW-ONLY BRAND STYLES - ONLY REAL USER COLORS */}
      {primaryColor && (
        <style jsx key={`brand-${primaryColor}`}>{`
          /* Progress bar */
          .ant-progress-bg {
            background-color: ${primaryColor} !important;
          }
          
          /* ONLY BUTTONS INSIDE PREVIEW CONTAINER - ONLY REAL USER COLOR */
          .preview-form-container button,
          .preview-form-container .ant-btn,
          .preview-form-container .ant-btn-primary {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border: 1px solid ${primaryColor} !important;
            border-color: ${primaryColor} !important;
            color: white !important;
            background-image: none !important;
            box-shadow: none !important;
          }
          
          /* NO HOVER EFFECTS - KEEP USER COLOR ALWAYS */
          .preview-form-container button:hover,
          .preview-form-container .ant-btn:hover,
          .preview-form-container .ant-btn-primary:hover {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
        `}</style>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {landingPageData.companyLogo && (
                <img 
                  src={landingPageData.companyLogo} 
                  alt="Company Logo" 
                  className="h-6 w-auto"
                />
              )}
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  {landingPageData.vacancyTitle || 'Job Application'}
                </h1>
                <p className="text-xs text-gray-500">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress 
              percent={progressPercentage} 
              showInfo={false}
              strokeColor={primaryColor}
              className="mb-2"
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border p-6 flex-1 flex flex-col overflow-auto">
          <div className="flex-1 flex flex-col">
            {currentStep === 0 ? (
              // Intro Step
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {landingPageData.form?.title || "Application Form"}
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  {landingPageData.form?.description || "Please fill out the form below to apply!"}
                </p>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleNext}
                  className="brand-button !border-0"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    color: 'white',
                    background: primaryColor,
                    border: `1px solid ${primaryColor}`
                  }}
                >
                  {landingPageData.form?.startApplicationText || getTranslation(landingPageData?.lang || 'en', 'startApplication')}
                </Button>
              </div>
            ) : (
              // Question Step
              <div className="flex-1 flex flex-col">
                {formFields[currentStep - 1] && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {formFields[currentStep - 1].label}
                      {formFields[currentStep - 1].required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h2>
                    
                    <div className="flex-1 mb-6">
                      {renderField(formFields[currentStep - 1])}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStep > 0 && (
            <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
              <Button 
                onClick={handlePrevious}
                className="flex items-center space-x-2 text-sm"
                disabled={currentStep === 0}
              >
                <ArrowLeft size={14} />
                                  <span>{landingPageData.form?.previousText || getTranslation(landingPageData?.lang || 'en', 'previous')}</span>
              </Button>

              <Button 
                type="primary"
                onClick={handleNext}
                className="brand-button flex items-center space-x-2 text-sm !border-0"
                style={{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  color: 'white',
                  background: primaryColor, 
                  border: `1px solid ${primaryColor}`
                }}
              >
                <span>{currentStep === formFields.length ? (landingPageData.form?.submitText || getTranslation(landingPageData?.lang || 'en', 'submit')) : (landingPageData.form?.nextText || getTranslation(landingPageData?.lang || 'en', 'next'))}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 