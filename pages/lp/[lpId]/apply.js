import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Radio, Checkbox, Select, Progress, message, Form } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CrudService from '../../../src/services/CrudService';
import PublicService from '../../../src/services/PublicService';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
// 🎨 BRANDING IMPORTS
import useTemplatePalette from '../../hooks/useTemplatePalette';

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

// Custom components to match preview styling
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

export default function ApplyPage() {
  const router = useRouter();
  const { lpId } = router.query;
  
  const [landingPageData, setLandingPageData] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [detectedCountry, setDetectedCountry] = useState('us');

  // 🎨 DYNAMIC BRAND COLORS - NO HARDCODING!
  const [stableColors, setStableColors] = useState({
    primary: landingPageData?.primaryColor || null  // NO hardcoded colors!
  });
  
  // Update colors when landing page data changes
  useEffect(() => {
    if (landingPageData?.primaryColor) {
      const realPrimary = landingPageData.primaryColor;
      
      console.log("🎨 APPLY: USING REAL USER COLOR:", {
        realPrimary,
        landingPageData: !!landingPageData
      });
      
      setStableColors({
        primary: realPrimary
      });
    }
  }, [landingPageData]);
  
  // Use real user colors - NO defaults if not loaded yet
  const primaryColor = stableColors.primary || landingPageData?.primaryColor;
  const secondaryColor = primaryColor; // SAME as primary!
  const tertiaryColor = primaryColor;
  
  // 🎨 ENHANCED DEBUG: Log all color sources in apply page
  console.log("🎨 APPLY PAGE REAL COLORS FROM DATABASE:", {
    "FINAL_USED": { primaryColor, secondaryColor, tertiaryColor },
    "landingPageData": !!landingPageData,
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
  
  // 🔥 APPLY COLORS ONLY WHEN WE HAVE REAL USER COLORS
  useEffect(() => {
    // ONLY apply if we have real user colors - NO defaults!
    if (!primaryColor) {
      console.log("⏳ APPLY: Waiting for real user colors...");
      return;
    }
    
    console.log("🔥 APPLY: APPLYING REAL USER COLOR:", {
      primaryColor,
      timestamp: new Date().toISOString()
    });
    
    // Function to apply ONLY real user primary color
    const applyRealUserColor = () => {
      const applyContainer = document.querySelector('.apply-form-container');
      if (!applyContainer) {
        console.log('❌ Apply container not found');
        return;
      }
      
      const allButtons = applyContainer.querySelectorAll('button, .ant-btn, [class*="ant-btn"]');
      console.log(`🎯 APPLY: FOUND ${allButtons.length} BUTTONS - APPLYING REAL COLOR: ${primaryColor}`);
      
      allButtons.forEach((btn, i) => {
        const text = btn.textContent?.trim() || '';
        console.log(`🔥 APPLY: REAL COLOR on "${text}": ${primaryColor}`);
        
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
    if (lpId) {
      fetchData();
    }
  }, [lpId]);

  const fetchData = async () => {
    try {
      console.log('Fetching apply page data for lpId:', lpId);
      const res = await CrudService.getSingle("LandingPageData", lpId, "apply page");
      if (res.data) {
        console.log('Apply page data loaded:', res.data);
        
        // 🎨 ENHANCED: Populate landing page data with user brand data
        const landingPage = res.data;
        
        // If landing page doesn't have brand data, try to get it from user
        if (!landingPage.primaryColor && landingPage.user_id) {
          try {
            const userRes = await CrudService.getSingle("User", landingPage.user_id, "brand data");
            if (userRes.data) {
              landingPage.primaryColor = userRes.data.primaryColor;
              landingPage.secondaryColor = userRes.data.secondaryColor;
              landingPage.tertiaryColor = userRes.data.tertiaryColor;
              landingPage.titleFont = userRes.data.titleFont;
              landingPage.bodyFont = userRes.data.bodyFont;
              landingPage.subheaderFont = userRes.data.subheaderFont;
              landingPage.companyLogo = userRes.data.companyLogo;
            }
          } catch (error) {
            console.log('Could not fetch user brand data:', error);
          }
        }
        
        setLandingPageData(landingPage);
        // Filter visible fields (treat undefined as visible for backwards compatibility)
        const visibleFields = (res.data?.form?.fields || []).filter(field => field.visible !== false);
        console.log('Visible fields:', visibleFields);
        
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
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleNext = () => {
    // Validate current step
    const currentField = formFields[currentStep - 1]; // -1 because step 0 is intro
    if (currentStep > 0 && currentField?.required) {
      // Special validation for lead capture group
      if (currentField.type === 'lead-capture-group') {
        let hasError = false;
        let errorMessage = '';
        
        currentField.fields.forEach(field => {
          if (field.type === 'contact') {
            const firstNameValue = formData[`${field.id}_firstName`];
            const lastNameValue = formData[`${field.id}_lastName`];
            
            if (field.firstName?.required && !firstNameValue?.trim()) {
              hasError = true;
              errorMessage = 'First name is required';
            }
            if (field.lastName?.required && !lastNameValue?.trim()) {
              hasError = true;
              errorMessage = 'Last name is required';
            }
          } else if (field.required && !formData[field.id]?.trim()) {
            hasError = true;
            errorMessage = `${field.label || field.type} is required`;
          }
        });
        
        if (hasError) {
          message.warning(errorMessage);
          return;
        }
      } else if (currentField.type === 'contact') {
        const firstNameValue = formData[`${currentField.id}_firstName`];
        const lastNameValue = formData[`${currentField.id}_lastName`];
        
        if (currentField.firstName?.required && !firstNameValue?.trim()) {
          message.warning('First name is required');
          return;
        }
        if (currentField.lastName?.required && !lastNameValue?.trim()) {
          message.warning('Last name is required');
          return;
        }
      } else if (currentField.type === 'address') {
        // Validate at least one address field is filled
        const line1 = formData[`${currentField.id}_line1`];
        const city = formData[`${currentField.id}_city`];
        const country = formData[`${currentField.id}_country`];
        
        if (!line1?.trim() && !city?.trim() && !country?.trim()) {
          message.warning('Please fill in at least address line 1, city, or country');
          return;
        }
      } else if (currentField.type === 'date') {
        // Validate date fields
        const month = formData[`${currentField.id}_month`];
        const day = formData[`${currentField.id}_day`];
        const year = formData[`${currentField.id}_year`];
        
        if (!month?.trim() && !day?.trim() && !year?.trim()) {
          message.warning('Please fill in the date');
          return;
        }
      } else {
        const value = formData[currentField.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          message.warning('This field is required');
          return;
        }
      }
    }

    if (currentStep < formFields.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Process form data to match expected format
      const processedFormData = { ...formData };
      
      // Process form fields to match the expected format
      formFields.forEach(field => {
        if (field.type === 'lead-capture-group') {
          // Process each field in the lead capture group
          field.fields.forEach(subField => {
            if (subField.type === 'contact') {
              processedFormData[`firstname`] = formData[`${subField.id}_firstName`] || "";
              processedFormData[`lastname`] = formData[`${subField.id}_lastName`] || "";
            } else if (subField.type === 'email') {
              processedFormData[`email`] = formData[subField.id] || "";
            } else if (subField.type === 'phone') {
              processedFormData[`phone`] = formData[subField.id] || "";
            }
          });
        } else if (field.type === 'address') {
          processedFormData[`line1`] = formData[`${field.id}_line1`] || "";
          processedFormData[`line2`] = formData[`${field.id}_line2`] || "";
          processedFormData[`city`] = formData[`${field.id}_city`] || "";
          processedFormData[`state`] = formData[`${field.id}_state`] || "";
          processedFormData[`zip`] = formData[`${field.id}_zip`] || "";
          processedFormData[`country`] = formData[`${field.id}_country`] || "";
        } else if (field.type === 'contact') {
          processedFormData[`firstname`] = formData[`${field.id}_firstName`] || "";
          processedFormData[`lastname`] = formData[`${field.id}_lastName`] || "";
        } else if (field.type === 'email') {
          processedFormData[`email`] = formData[field.id] || "";
        } else if (field.type === 'phone') {
          processedFormData[`phone`] = formData[field.id] || "";
        } else if (field.type === 'date') {
          // Combine date fields into a formatted date string
          const month = formData[`${field.id}_month`] || "";
          const day = formData[`${field.id}_day`] || "";
          const year = formData[`${field.id}_year`] || "";
          const dateFormat = field.dateFormat || "MMDDYYYY";
          const dateSeparator = field.dateSeparator || "/";
          
          let formattedDate = "";
          if (month && day && year) {
            if (dateFormat === 'MMDDYYYY') {
              formattedDate = [month, day, year].join(dateSeparator);
            } else if (dateFormat === 'DDMMYYYY') {
              formattedDate = [day, month, year].join(dateSeparator);
            } else if (dateFormat === 'YYYYMMDD') {
              formattedDate = [year, month, day].join(dateSeparator);
            }
          }
          processedFormData[field.id] = formattedDate;
        } else {
          // Handle other field types
          processedFormData[field.id] = formData[field.id] || "";
        }
      });

      // Submit to your backend/ATS using the correct model name
      const applicationData = {
        LandingPageDataId: lpId,
        formData: processedFormData,
        form: landingPageData?.form,
        searchIndex: `${processedFormData.firstname || ''} ${processedFormData.lastname || ''} ${processedFormData.email || ''}`.trim()
      };

      console.log('Submitting application data:', applicationData);

      // Use the correct model name: VacancySubmission
      await CrudService.create("VacancySubmission", applicationData);
      
      message.success('Application submitted successfully!');
      // Redirect to thank you page or success message
      router.push(`/lp/${lpId}/thank-you`);
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSingleField = (field) => {
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
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.customPlaceholder || field.placeholder || "Email address"}
            className="rounded-lg"
            size="large"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            defaultCountry={detectedCountry}
            inputClassName="rounded-lg w-full !h-10"
            placeholder={field.customPlaceholder || field.placeholder || "Phone number"}
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
            {field.fields.map((subField) => (
              <div key={subField.id}>
                <label className="block mb-2 font-semibold text-sm">
                  {subField.customLabel || subField.label}
                  {subField.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                {renderSingleField(subField)}
              </div>
            ))}
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
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.customPlaceholder || field.placeholder || "Email address"}
            className="rounded-lg"
            size="large"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            defaultCountry={detectedCountry}
            inputClassName="rounded-lg w-full !h-10"
            placeholder={field.customPlaceholder || field.placeholder || "Phone number"}
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
            onChange={(newValue) => handleInputChange(field.id, newValue)}
          />
        );

      case 'website':
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="rounded-lg"
            size="large"
            addonBefore={<span style={{ fontSize: 14, color: '#000000' }}>https://</span>}
            placeholder={field.placeholder || "example.com"}
          />
        );

      case 'address':
        return (
          <div className="space-y-2">
            <Input
              value={formData[`${field.id}_line1`] || ''}
              onChange={(e) => handleInputChange(`${field.id}_line1`, e.target.value)}
              placeholder="Address Line 1"
              className="rounded-lg"
              size="large"
            />
            <Input
              value={formData[`${field.id}_line2`] || ''}
              onChange={(e) => handleInputChange(`${field.id}_line2`, e.target.value)}
              placeholder="Address Line 2"
              className="rounded-lg"
              size="large"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData[`${field.id}_city`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_city`, e.target.value)}
                placeholder="City"
                className="rounded-lg"
                size="large"
              />
              <Input
                value={formData[`${field.id}_state`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_state`, e.target.value)}
                placeholder="State/Province"
                className="rounded-lg"
                size="large"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData[`${field.id}_zip`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_zip`, e.target.value)}
                placeholder="ZIP/Postal Code"
                className="rounded-lg"
                size="large"
              />
              <Input
                value={formData[`${field.id}_country`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_country`, e.target.value)}
                placeholder="Country"
                className="rounded-lg"
                size="large"
              />
            </div>
          </div>
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="rounded-lg"
            size="large"
          />
        );

      case 'date':
        // Enhanced date field with separate inputs like in preview
        const dateFormat = field.dateFormat || "MMDDYYYY";
        const dateSeparator = field.dateSeparator || "/";
        
        const renderDateInput = (type) => {
          if (type === 'month') {
            return (
              <div key="month" className="flex flex-col">
                <label className="block mb-1 text-sm">Month</label>
                <Input
                  value={formData[`${field.id}_month`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_month`, e.target.value)}
                  placeholder="MM"
                  maxLength={2}
                  className="w-[70px] h-[42px] text-xl bg-transparent border-b border-gray-400 rounded-lg text-gray-400"
                />
              </div>
            );
          } else if (type === 'day') {
            return (
              <div key="day" className="flex flex-col">
                <label className="block mb-1 text-sm">Day</label>
                <Input
                  value={formData[`${field.id}_day`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_day`, e.target.value)}
                  placeholder="DD"
                  maxLength={2}
                  className="w-16 text-xl h-[42px] bg-transparent border-b border-gray-400 rounded-lg text-gray-400"
                />
              </div>
            );
          } else if (type === 'year') {
            return (
              <div key="year" className="flex flex-col">
                <label className="block mb-1 text-sm">Year</label>
                <Input
                  value={formData[`${field.id}_year`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_year`, e.target.value)}
                  placeholder="YYYY"
                  maxLength={4}
                  className="w-[80px] text-xl h-[42px] bg-transparent border-b border-gray-400 rounded-lg text-gray-400"
                />
              </div>
            );
          }
          return null;
        };

        let order = [];
        if (dateFormat === 'MMDDYYYY') order = ['month', 'day', 'year'];
        else if (dateFormat === 'DDMMYYYY') order = ['day', 'month', 'year'];
        else if (dateFormat === 'YYYYMMDD') order = ['year', 'month', 'day'];

        return (
          <div className="flex space-x-4 items-end">
            {order.map((type, idx) => (
              <React.Fragment key={type}>
                {renderDateInput(type)}
                {idx < order.length - 1 && (
                  <span className="text-2xl text-gray-400 pb-[8px]">{dateSeparator}</span>
                )}
              </React.Fragment>
            ))}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!landingPageData || landingPageData.applyType !== 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Available</h1>
          <p className="text-gray-600 mb-6">This position uses an external application system.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const totalSteps = formFields.length + 1; // +1 for intro step
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 apply-form-container">{/* UNIQUE APPLY CLASS */}
      {/* 🎨 APPLY-ONLY BRAND STYLES - ONLY REAL USER COLORS */}
      {primaryColor && (
        <style jsx key={`brand-${primaryColor}`}>{`
          /* Progress bar */
          .ant-progress-bg {
            background-color: ${primaryColor} !important;
          }
          
          /* ONLY BUTTONS INSIDE APPLY CONTAINER - ONLY REAL USER COLOR */
          .apply-form-container button,
          .apply-form-container .ant-btn,
          .apply-form-container .ant-btn-primary {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border: 1px solid ${primaryColor} !important;
            border-color: ${primaryColor} !important;
            color: white !important;
            background-image: none !important;
            box-shadow: none !important;
          }
          
          /* NO HOVER EFFECTS - KEEP USER COLOR ALWAYS */
          .apply-form-container button:hover,
          .apply-form-container .ant-btn:hover,
          .apply-form-container .ant-btn-primary:hover {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
        `}</style>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {landingPageData.companyLogo && (
                <img 
                  src={landingPageData.companyLogo} 
                  alt="Company Logo" 
                  className="h-8 w-auto"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {landingPageData.vacancyTitle || 'Job Application'}
                </h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <Button 
              type="text" 
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {currentStep === 0 ? (
            // Intro Step
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {landingPageData.form?.title || "Let's get started"}
              </h2>
              <p className="text-gray-600 mb-8">
                {landingPageData.form?.description || "We'll ask you a few questions to learn more about you."}
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
            <div>
              {formFields[currentStep - 1] && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {formFields[currentStep - 1].label}
                    {formFields[currentStep - 1].required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h2>
                  
                  <div className="mb-8">
                    {renderField(formFields[currentStep - 1])}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {currentStep > 0 && (
            <div className="flex justify-between items-center pt-6 border-t">
              <Button 
                onClick={handlePrevious}
                className="flex items-center space-x-2"
                disabled={currentStep === 0}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </Button>

              <Button 
                type="primary"
                onClick={handleNext}
                loading={submitting}
                className="brand-button flex items-center space-x-2 !border-0"
                style={{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  color: 'white',
                  background: primaryColor, 
                  border: `1px solid ${primaryColor}`
                }}
              >
                <span>{currentStep === formFields.length ? 'Submit Application' : 'Next'}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 