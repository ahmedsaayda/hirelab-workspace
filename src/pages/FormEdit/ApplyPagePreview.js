import React, { useState, useEffect } from 'react';
import { Button, Input, Radio, Checkbox, Select, Progress, message } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
// 🎨 BRANDING IMPORTS
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";

// Country detection utility
const getCountryFromLocation = async () => {
  try {
    // First try to get country from IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    if (data.country_code) {
      return data.country_code.toLowerCase();
    }
  } catch (error) {
    console.log('Geolocation detection failed, using default country');
  }
  
  // Fallback to browser locale
  try {
    const locale = navigator.language || navigator.languages[0];
    if (locale) {
      const countryCode = locale.split('-')[1];
      if (countryCode) {
        return countryCode.toLowerCase();
      }
    }
  } catch (error) {
    console.log('Locale detection failed');
  }
  
  // Default to US
  return 'us';
};

const { TextArea } = Input;
const { Option } = Select;

// Import the same custom components from apply page
const MultipleChoice = ({ field, value, onChange }) => (
  <Radio.Group value={value} onChange={onChange} className="w-full">
    <div className="space-y-3">
      {field.options?.map((option, index) => (
        <Radio key={index} value={option.text} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
          <span className="ml-2 text-sm">{option.text}</span>
        </Radio>
      ))}
    </div>
  </Radio.Group>
);

const MultiSelectChoice = ({ field, value, onChange }) => (
  <Checkbox.Group value={value} onChange={onChange} className="w-full">
    <div className="space-y-3">
      {field.options?.map((option, index) => (
        <Checkbox key={index} value={option.text} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
          <span className="ml-2 text-sm">{option.text}</span>
        </Checkbox>
      ))}
    </div>
  </Checkbox.Group>
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
    {field.options?.map((option, index) => (
      <Option key={index} value={option.text}>
        {option.text}
      </Option>
    ))}
  </Select>
);

const YesNoQuestion = ({ field, value, onChange }) => (
  <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="w-full">
    <div className="grid grid-cols-2 gap-3">
      <Radio.Button value="yes" className="text-center py-3 text-sm font-medium">
        <span>✓ Yes</span>
      </Radio.Button>
      <Radio.Button value="no" className="text-center py-3 text-sm font-medium">
        <span>✗ No</span>
      </Radio.Button>
    </div>
  </Radio.Group>
);

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

export default function ApplyPagePreview({ landingPageData }) {
  // 🎨 BRAND COLORS FROM DATABASE  
  const user = useSelector(selectUser);
  
  // STATE DECLARATIONS (MOVED UP TO MATCH APPLY.JS)
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [formFields, setFormFields] = useState([]);
  const [detectedCountry, setDetectedCountry] = useState('us');
  
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

  // Detect user's country for phone input
  useEffect(() => {
    getCountryFromLocation().then(country => {
      setDetectedCountry(country);
    });
  }, []);

  useEffect(() => {
    if (landingPageData) {
      // Filter visible fields (treat undefined as visible for backwards compatibility)
      const visibleFields = (landingPageData?.form?.fields || []).filter(field => field.visible !== false);
      
      // Always create Contact Information step as first step
      const leadCaptureFields = visibleFields.filter(field => field.isLeadCapture);
      const contactFields = visibleFields.filter(field => 
        field.type === 'contact' || field.type === 'email' || field.type === 'phone'
      );
      const otherFields = visibleFields.filter(field => 
        !field.isLeadCapture && 
        field.type !== 'contact' && 
        field.type !== 'email' && 
        field.type !== 'phone'
      );
      
      // Use lead capture fields if available, otherwise use basic contact fields
      const contactStepFields = leadCaptureFields.length > 0 ? leadCaptureFields : contactFields;
      
      // Always create Contact Information step if we have any contact-related fields
      if (contactStepFields.length > 0) {
        setFormFields([
          { 
            id: 'lead-capture-step', 
            type: 'lead-capture-group', 
            label: 'Contact Information', 
            fields: contactStepFields,
            required: true 
          },
          ...otherFields
        ]);
      } else {
        // Fallback: if no contact fields found, still create basic contact step
        setFormFields([
          { 
            id: 'lead-capture-step', 
            type: 'lead-capture-group', 
            label: 'Contact Information', 
            fields: [
              {
                id: 'default_contact',
                type: 'contact',
                label: 'Full Name',
                required: true,
                firstName: { required: true, placeholder: 'First name' },
                lastName: { required: true, placeholder: 'Last name' }
              },
              {
                id: 'default_email',
                type: 'email',
                label: 'Email',
                required: true,
                placeholder: 'Email address'
              }
            ],
            required: true 
          },
          ...visibleFields
        ]);
      }
      
      // Reset to intro step when form fields change
      setCurrentStep(0);
      setFormData({});
    }
  }, [landingPageData]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleNext = () => {
    // Basic validation for preview (simplified)
    const currentField = formFields[currentStep - 1];
    if (currentStep > 0 && currentField?.required) {
      if (currentField.type === 'lead-capture-group') {
        // Validate all lead capture fields
        let hasError = false;
        currentField.fields.forEach(field => {
          if (field.type === 'contact') {
            if (field.firstName?.required && !formData[`${field.id}_firstName`]?.trim()) hasError = true;
            if (field.lastName?.required && !formData[`${field.id}_lastName`]?.trim()) hasError = true;
          } else if (field.required && !formData[field.id]?.trim()) {
            hasError = true;
          }
        });
        if (hasError) {
          message.warning('Please fill in all required contact fields');
          return;
        }
      } else {
        const value = formData[currentField.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          message.warning('This field is required in the actual form');
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
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderSingleField = (field, contactField = null) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'contact':
        return (
          <div className="grid grid-cols-2 gap-4">
            {field.firstName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.firstName?.label || 'First Name'}
                  {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_firstName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_firstName`, e.target.value)}
                  placeholder={field.firstName?.placeholder || "First name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            {field.lastName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.lastName?.label || 'Last Name'}
                  {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_lastName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_lastName`, e.target.value)}
                  placeholder={field.lastName?.placeholder || "Last name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
          </div>
        );

      case 'email':
        const emailPlaceholder = contactField?.email?.placeholder || field.placeholder || field.customPlaceholder || "Email address";
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
        const phonePlaceholder = contactField?.phone?.placeholder || field.placeholder || field.customPlaceholder || "Phone number";
        return (
          <PhoneInput
            defaultCountry={detectedCountry}
            inputClassName="rounded-lg w-full !h-10"
            placeholder={phonePlaceholder}
            value={value}
            onChange={(phoneValue) => handleInputChange(field.id, phoneValue)}
            className="p-1"
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

    switch (field.type) {
      case 'lead-capture-group':
        return (
          <div className="space-y-6">
            {field.fields.map((subField) => {
              // 🔥 DIRECT FIX: For email/phone, read from contact field if available
              const contactField = field.fields.find(f => f.type === 'contact');
              let displayLabel = subField.label || subField.customLabel;
              
              if (subField.type === 'email' && contactField?.email?.label) {
                displayLabel = contactField.email.label;
              } else if (subField.type === 'phone' && contactField?.phone?.label) {
                displayLabel = contactField.phone.label;
              }
              
              return (
                <div key={subField.id}>
                  <label className="block mb-2 font-semibold text-sm">
                    {displayLabel}
                    {subField.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {renderSingleField(subField, contactField)}
                </div>
              );
            })}
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-2 gap-4">
            {field.firstName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  First Name
                  {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_firstName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_firstName`, e.target.value)}
                  placeholder={field.firstName?.placeholder || "First name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            {field.lastName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  Last Name
                  {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_lastName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_lastName`, e.target.value)}
                  placeholder={field.lastName?.placeholder || "Last name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
          </div>
        );

      case 'email':
        const emailPlaceholder2 = field.placeholder || field.customPlaceholder || "Email address";
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={emailPlaceholder2}
            className="rounded-lg"
            size="large"
          />
        );

      case 'phone':
        const phonePlaceholder2 = field.placeholder || field.customPlaceholder || "Phone number";
        return (
          <PhoneInput
            defaultCountry={detectedCountry}
            inputClassName="rounded-lg w-full !h-10"
            placeholder={phonePlaceholder2}
            value={value}
            onChange={(phoneValue) => handleInputChange(field.id, phoneValue)}
            className="p-1"
          />
        );

      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
            size="large"
          />
        );

      case 'longtext':
        return (
          <TextArea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="rounded-lg"
          />
        );

      case 'motivation':
        return (
          <TextArea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Write your motivation letter"}
            className="h-32 rounded-lg"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Enter a number"}
            min={field.min}
            max={field.max}
            className="rounded-lg"
            size="large"
          />
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
            <div>
              <label className="block mb-1 font-semibold text-sm">Address Line 1</label>
              <Input
                value={formData[`${field.id}_line1`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_line1`, e.target.value)}
                placeholder="Street address"
                className="rounded-lg"
                size="large"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Address Line 2 (Optional)</label>
              <Input
                value={formData[`${field.id}_line2`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_line2`, e.target.value)}
                placeholder="Apartment, suite, etc."
                className="rounded-lg"
                size="large"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">City</label>
                <Input
                  value={formData[`${field.id}_city`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_city`, e.target.value)}
                  placeholder="City"
                  className="rounded-lg"
                  size="large"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">State/Province</label>
                <Input
                  value={formData[`${field.id}_state`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_state`, e.target.value)}
                  placeholder="State"
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">ZIP/Postal Code</label>
                <Input
                  value={formData[`${field.id}_zip`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_zip`, e.target.value)}
                  placeholder="ZIP code"
                  className="rounded-lg"
                  size="large"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">Country</label>
                <Input
                  value={formData[`${field.id}_country`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_country`, e.target.value)}
                  placeholder="Country"
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">Month</label>
              <Input
                value={formData[`${field.id}_month`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_month`, e.target.value)}
                placeholder="MM"
                className="rounded-lg"
                size="large"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Day</label>
              <Input
                value={formData[`${field.id}_day`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_day`, e.target.value)}
                placeholder="DD"
                className="rounded-lg"
                size="large"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Year</label>
              <Input
                value={formData[`${field.id}_year`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_year`, e.target.value)}
                placeholder="YYYY"
                className="rounded-lg"
                size="large"
                maxLength={4}
              />
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-gray-50 preview-form-container">{/* UNIQUE PREVIEW CLASS */}
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
            <div className="text-xs text-gray-400">PREVIEW</div>
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
                  Start Application
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
                <span>Previous</span>
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
                <span>{currentStep === formFields.length ? 'Submit Application' : 'Next'}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 