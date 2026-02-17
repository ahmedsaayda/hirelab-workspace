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

// ----------------------
// Conditional Logic Utils (mirrors apply.js)
// ----------------------
const evaluateCondition = (cond, formData) => {
  if (!cond) return true;
  const { fieldId, operator, value } = cond;
  const answer = formData?.[fieldId];
  switch (operator) {
    case 'equals':
      if (Array.isArray(answer)) return answer.includes(value);
      return String(answer ?? '').trim() === String(value ?? '').trim();
    case 'not_equals':
      if (Array.isArray(answer)) return !answer.includes(value);
      return String(answer ?? '').trim() !== String(value ?? '').trim();
    case 'contains':
      if (Array.isArray(answer)) return answer.includes(value);
      return String(answer ?? '').toLowerCase().includes(String(value ?? '').toLowerCase());
    case 'not_contains':
      if (Array.isArray(answer)) return !answer.includes(value);
      return !String(answer ?? '').toLowerCase().includes(String(value ?? '').toLowerCase());
    case 'is_filled':
      return Array.isArray(answer) ? answer.length > 0 : !!String(answer ?? '').trim();
    case 'is_empty':
      return Array.isArray(answer) ? answer.length === 0 : !String(answer ?? '').trim();
    case 'gt':
      return Number(answer) > Number(value);
    case 'lt':
      return Number(answer) < Number(value);
    default:
      return true;
  }
};

const isFieldVisibleByLogic = (field, formData) => {
  if (field?.visible === false) return false;
  const visibleWhen = field?.logic?.visibleWhen;
  if (!visibleWhen || !Array.isArray(visibleWhen.conditions) || visibleWhen.conditions.length === 0) {
    return true;
  }
  const all = visibleWhen.all !== false;
  const results = visibleWhen.conditions.map((c) => evaluateCondition(c, formData));
  return all ? results.every(Boolean) : results.some(Boolean);
};

const getVisibleFieldsForFlow = (fields, formData) => {
  return (fields || []).filter((f) => isFieldVisibleByLogic(f, formData));
};

const getAnswerValue = (field, formData) => {
  if (!field) return undefined;
  if (field.type === 'contact') return undefined;
  if (field.type === 'address') return undefined;
  return formData?.[field.id];
};

const resolveJumpTarget = (field, formData) => {
  const jump = field?.logic?.jump;
  if (!jump) return null;
  const answer = getAnswerValue(field, formData);
  const normalizedAnswer = Array.isArray(answer) ? answer : String(answer ?? '').trim();
  if (Array.isArray(jump.on)) {
    for (const rule of jump.on) {
      const ruleValue = rule?.value;
      const match = Array.isArray(normalizedAnswer)
        ? normalizedAnswer.includes(ruleValue)
        : String(normalizedAnswer).toLowerCase() === String(ruleValue ?? '').toLowerCase();
      if (match) return rule?.goTo || null; // 'end' | fieldId | null
    }
  }
  const ALLOWED_JUMP_TYPES = new Set(['yesno', 'boolean', 'multichoice', 'dropdown', 'multiselect']);
  if (!ALLOWED_JUMP_TYPES.has(field?.type)) return null;
  return jump.default || null; // 'next' | 'end' | null
};

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
            <p className={`text-sm  flex-1
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
            ${value === 'yes'
              ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
              : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-25 hover:text-green-600'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${value === 'yes'
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
            ${value === 'no'
              ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
              : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25 hover:text-red-600'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${value === 'no'
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

const FileUpload = ({ value, onChange, placeholder, isVideo = false }) => (
  <div className="relative border-2 border-dashed border-gray-300 rounded-[15px] p-8 text-center hover:border-gray-400 transition-colors">
    <div className="space-y-4">
      <div className="text-blue-500">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-medium text-blue-600">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-1">
          {isVideo ? 'Videos up to 100MB (MP4, WEBM, OGG, AVI, MOV, WMV, FLV)' : 'Videos up to 100MB; other files up to 10MB'}
        </p>
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
        accept={isVideo ? '.mp4,.webm,.ogg,.avi,.mov,.wmv,.flv' : '.pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.gif,.svg,.webp,.bmp,.mp4,.webm,.ogg,.avi,.mov,.wmv,.flv,.mp3,.wav,.aac,.flac,.wma,.zip,.rar,.7z,.tar,.gz,.xls,.xlsx,.csv,.ppt,.pptx'}
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
  const [previewOptInAccepted, setPreviewOptInAccepted] = useState(false);
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
  const secondaryColor = landingPageData?.secondaryColor || primaryColor;
  const tertiaryColor = landingPageData?.tertiaryColor || primaryColor;

  // 🎨 Check if we have brand data loaded
  const hasBrandData = !!(landingPageData?.primaryColor);

  // 🎨 ENHANCED DEBUG: Log ALL color sources in preview
  console.log("🎨 PREVIEW REAL COLORS FROM DATABASE:", {
    "FINAL_USED": { primaryColor, secondaryColor, tertiaryColor },
    "hasBrandData": hasBrandData,
    "landingPageColors": {
      primary: landingPageData?.primaryColor,
      secondary: landingPageData?.secondaryColor,
      tertiary: landingPageData?.tertiaryColor
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

      // Exclude WhatsApply button from brand color styling
      const allButtons = previewContainer.querySelectorAll('button:not(.whatsapply-btn), .ant-btn, [class*="ant-btn"]');
      console.log(`🎯 PREVIEW: FOUND ${allButtons.length} BUTTONS - APPLYING REAL COLOR: ${primaryColor}`);

      allButtons.forEach((btn, i) => {
        // Skip WhatsApply button
        if (btn.classList.contains('whatsapply-btn')) return;
        
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

  const [previewLogicEnabled, setPreviewLogicEnabled] = useState(false);

  const hasAnyLogic = (landingPageData?.form?.fields || []).some((f) => (f.logic && ((f.logic.visibleWhen && Array.isArray(f.logic.visibleWhen.conditions) && f.logic.visibleWhen.conditions.length) || (f.logic.jump && ((f.logic.jump.on && f.logic.jump.on.length) || f.logic.jump.default)))));

  useEffect(() => {
    if (landingPageData) {
      // Filter visible fields (treat undefined as visible for backwards compatibility)
      const rawFields = (landingPageData?.form?.fields || []);
      // Always keep full list for stable indexing with sidebar and editor
      setFormFields(rawFields);

      // Reset form data if form structure changed dramatically
      if (!formFields.length) {
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
    const flowFields = previewLogicEnabled ? getVisibleFieldsForFlow(formFields, formData) : formFields;
    if (isPreviewMode) {
      if (flowFields.length === 0) {
        message.success('Preview: would submit (no questions visible)');
        setFormData({});
        if (onStepChange) onStepChange(1);
        return;
      }
      // Step 1 is now the first step (no intro step)
      const currentIndex = currentStep - 1;
      const currentField = formFields[currentIndex];
      const jumpTarget = previewLogicEnabled ? resolveJumpTarget(currentField, formData) : null;
      if (jumpTarget === 'end') {
        message.success('Preview: would submit here (jump to end)');
        setFormData({});
        if (onStepChange) onStepChange(0);
        return;
      }
      const findFieldIndexById = (id) => formFields.findIndex(f => f.id === id);
      const findNextIndex = (startIdx) => {
        for (let i = startIdx + 1; i < formFields.length; i++) {
          if (!previewLogicEnabled || isFieldVisibleByLogic(formFields[i], formData)) return i;
        }
        return -1;
      };

      if (jumpTarget && jumpTarget !== 'next') {
        const targetIndexInFull = findFieldIndexById(jumpTarget);
        if (targetIndexInFull > currentIndex) {
          if (onStepChange) onStepChange(targetIndexInFull + 1);
          return;
        }
      }

      const nextIdx = previewLogicEnabled ? findNextIndex(currentIndex) : currentIndex + 1;
      if (nextIdx !== -1 && nextIdx < formFields.length) {
        if (onStepChange) onStepChange(nextIdx + 1);
      } else {
        message.success('This is a preview - form would be submitted here');
        setFormData({});
        if (onStepChange) onStepChange(0);
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
        // Phone is ALWAYS required when visible (regardless of stored required flag)
        if (currentField.phone?.visible !== false && !formData[`${currentField.id}_phone`]?.trim()) hasError = true;

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
      if (onStepChange) onStepChange(currentStep + 1);
    } else {
      // Preview "submission"
      message.success('This is a preview - form would be submitted here');
      if (onStepChange) onStepChange(1);
      setFormData({});
    }
  };

  const handlePrevious = () => {
    console.log('🔄 handlePrevious: currentStep =', currentStep);

    if (currentStep > 1) {
      const newStep = currentStep - 1;
      console.log('🔄 handlePrevious: Moving from step', currentStep, 'to step', newStep);

      // Notify parent about step change
      if (onStepChange) {
        onStepChange(newStep);
      }
    } else {
      console.log('🔄 handlePrevious: Already at step 1, cannot go back further');
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
                  <span className="ml-1 text-red-500">*</span>
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
                <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
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
            onChange={(e) => {
              handleInputChange(field.id, e.target.value);
              if (settings.autoJumpToNext && isPreviewMode) setTimeout(() => handleNext(), 0);
            }}
          />
        );

      case 'dropdown':
        return (
          <CustomDropdown
            field={field}
            value={value}
            onChange={(selectedValue) => {
              handleInputChange(field.id, selectedValue);
              if (settings.autoJumpToNext && isPreviewMode) setTimeout(() => handleNext(), 0);
            }}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectChoice
            field={field}
            value={Array.isArray(value) ? value : []}
            onChange={(selectedValues) => {
              handleInputChange(field.id, selectedValues);
              if (settings.autoJumpToNext && isPreviewMode) setTimeout(() => handleNext(), 0);
            }}
          />
        );

      case 'yesno':
      case 'boolean':
        return (
          <YesNoQuestion
            field={field}
            value={value}
            onChange={(selectedValue) => {
              handleInputChange(field.id, selectedValue);
              if (settings.autoJumpToNext && isPreviewMode) setTimeout(() => handleNext(), 0);
            }}
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
            isVideo={!!field.videoOnly}
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

  const flowFields = previewLogicEnabled ? getVisibleFieldsForFlow(formFields, formData) : formFields;
  const totalSteps = formFields.length + 1; // keep sidebar/editor alignment
  const settings = landingPageData?.form?.settings || {};
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  console.log("formFields[currentStep - 1] ", formFields[currentStep - 1])
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
          .preview-form-container button:not(.whatsapply-btn),
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
          .preview-form-container button:not(.whatsapply-btn):hover,
          .preview-form-container .ant-btn:hover,
          .preview-form-container .ant-btn-primary:hover {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
          
          /* WhatsApply button - Always WhatsApp green */
          .preview-form-container .whatsapply-btn {
            background: #25D366 !important;
            background-color: #25D366 !important;
            border: 1px solid #25D366 !important;
            border-color: #25D366 !important;
            color: white !important;
          }
          
          .preview-form-container .whatsapply-btn:hover {
            background: #20bd5a !important;
            background-color: #20bd5a !important;
            border-color: #20bd5a !important;
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
            {hasAnyLogic && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Apply logic</span>
                <input
                  type="checkbox"
                  checked={previewLogicEnabled}
                  onChange={(e) => setPreviewLogicEnabled(e.target.checked)}
                  className="h-4 w-4"
                  title="Toggle conditional logic in preview"
                />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {settings.showProgressBar !== false && (
            <div className="mt-3">
              <Progress
                percent={progressPercentage}
                showInfo={false}
                strokeColor={primaryColor}
                className="mb-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border p-6 flex-1 flex flex-col overflow-auto">
          <div className="flex-1 flex flex-col">
            {/* Question Step - Show form fields directly (no intro step) */}
            <div className="flex-1 flex flex-col">
              {flowFields[currentStep - 1] && (
                <div className="flex-1 flex flex-col">
                  {/* WhatsApply Button - shown on first step when enabled AND phone number is configured */}
                  {currentStep === 1 && settings?.whatsApply?.enabled && settings?.whatsApply?.phoneNumber && (
                    <div className="mb-4">
                      <div
                        onClick={() => {
                          // Build the WhatsApp message with variables replaced
                          // Clean phone number: remove spaces, dashes, and non-digit chars except leading +
                          const rawPhone = settings?.whatsApply?.phoneNumber || '';
                          const cleanPhone = rawPhone.replace(/[^\d+]/g, '').replace(/^\+/, '');
                          const messageTemplate = settings?.whatsApply?.messageTemplate || 'Hi, I saw the vacancy {{url}} and I want to apply for {{jobTitle}} at {{companyName}}.';
                          const currentUrl = typeof window !== 'undefined' ? window.location.href.replace('/form-editor', '/lp').replace(/\/apply.*$/, '') : '';
                          
                          const message = messageTemplate
                            .replace('{{url}}', currentUrl)
                            .replace('{{jobTitle}}', landingPageData?.vacancyTitle || '')
                            .replace('{{companyName}}', landingPageData?.companyName || '');
                          
                          const encodedMessage = encodeURIComponent(message);
                          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer"
                        style={{ backgroundColor: '#25D366', color: 'white' }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApply
                      </div>
                      
                      {/* OR Separator */}
                      <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-xs font-medium">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {flowFields[currentStep - 1].label}
                    {flowFields[currentStep - 1].required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h2>

                  <div className="flex-1 mb-6">
                    {renderField(flowFields[currentStep - 1])}
                  </div>
                  {settings?.optIn?.enabled && settings?.optIn?.showMessage !== false && settings?.optIn?.messagePlacement === "last" && (
                    <div className="mt-2 p-3 rounded border bg-gray-50">
                      <div className="font-medium text-sm">{settings.optIn.header || "Subscribe for SMS Alerts"}</div>
                      {settings.optIn.description && (
                        <div className="text-xs text-gray-600 mt-1">{settings.optIn.description}</div>
                      )}
                      <label className="flex items-center gap-2 mt-2 text-sm">
                        <input
                          type="checkbox"
                          checked={previewOptInAccepted}
                          onChange={(e) => setPreviewOptInAccepted(e.target.checked)}
                        />
                        <span>
                          I agree to opt-in {settings.optIn.required ? "(required)" : "(optional)"}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Always show navigation (no intro step anymore) */}
          <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
            <Button
              onClick={handlePrevious}
              className="flex items-center space-x-2 text-sm"
              disabled={currentStep <= 1}
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
              <span>{currentStep === flowFields.length ? (landingPageData.form?.submitText || getTranslation(landingPageData?.lang || 'en', 'submit')) : (landingPageData.form?.nextText || getTranslation(landingPageData?.lang || 'en', 'next'))}</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 