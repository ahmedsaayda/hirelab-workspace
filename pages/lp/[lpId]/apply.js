import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Radio, Checkbox, Select, Progress, message, Form, DatePicker } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import PublicService from '../../../src/services/PublicService';
// Removed PhoneInput - using regular Input instead
// 🎨 BRANDING IMPORTS
import useTemplatePalette from '../../hooks/useTemplatePalette';

// Removed country detection since we're using regular Input instead of PhoneInput

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
  // Removed detectedCountry since we're using regular Input instead of PhoneInput

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

  // Removed country detection since we're using regular Input instead of PhoneInput

  useEffect(() => {
    if (lpId) {
      fetchData();
    }
  }, [lpId]);

  const fetchData = async () => {
    try {
      console.log('Fetching apply page data for lpId:', lpId);
      //      const res = await CrudService.getSingle("LandingPageData", lpId, "apply page");

      const res = await PublicService.getLP(lpId);
      if (res.data) {
        console.log('Apply page data loaded:', res.data?.lp);
        
        // 🎨 ENHANCED: Populate landing page data with user brand data
        const landingPage = res.data?.lp;
        
        if (true ||!landingPage.primaryColor && landingPage.user_id) {
          try {
            // Fetch public-side recruiter brand data
            const userRes = await PublicService.getRecruiterData(landingPage.user_id, "");
            console.log("userRes", userRes);

            const recruiter = userRes?.data?.recruiter;
            console.log("recruiter", recruiter);
            if (recruiter) {
              landingPage.primaryColor = recruiter.primaryColor || recruiter.themeColor;
              landingPage.secondaryColor = recruiter.secondaryColor;
              landingPage.tertiaryColor = recruiter.tertiaryColor;
              landingPage.titleFont = recruiter.titleFont;
              landingPage.bodyFont = recruiter.bodyFont;
              landingPage.subheaderFont = recruiter.subheaderFont;
              landingPage.companyLogo = recruiter.companyLogo || recruiter.logo;
            }
          } catch (error) {
            console.log('Could not fetch user brand data (public):', error);
          }
        }
        
        setLandingPageData(landingPage);
        // Filter visible fields (treat undefined as visible for backwards compatibility)
        console.log("all fieldsss", res.data?.lp?.form?.fields);
        const visibleFields = (res.data?.lp?.form?.fields || []).filter(field => field.visible !== false);
        console.log('Visible fieldsss:', visibleFields);
        
        // Always create Contact Information step as first step
        const leadCaptureFields = visibleFields.filter(field => field.isLeadCapture);
        const otherFields = visibleFields.filter(field => !field.isLeadCapture);
        
        // Define contact fields from visible fields
        const contactFields = visibleFields.filter(field => 
          field.type === 'contact' || field.type === 'email' || field.type === 'phone'
        );
        
        // CRITICAL: Contact information must come FIRST for lead capture
        // Use lead capture fields if available, otherwise use basic contact fields  
        const contactStepFields = leadCaptureFields.length > 0 ? leadCaptureFields : contactFields;
        
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
        const emailValue = formData[`${currentField.id}_email`];
        const phoneValue = formData[`${currentField.id}_phone`];
        
        if (currentField.firstName?.required && !firstNameValue?.trim()) {
          message.warning(currentField.firstName?.label ? `${currentField.firstName.label} is required` : 'First name is required');
          return;
        }
        if (currentField.lastName?.required && !lastNameValue?.trim()) {
          message.warning(currentField.lastName?.label ? `${currentField.lastName.label} is required` : 'Last name is required');
          return;
        }
        if (currentField.email?.required && !emailValue?.trim()) {
          message.warning(currentField.email?.label ? `${currentField.email.label} is required` : 'Email is required');
          return;
        }
        if (currentField.email?.visible !== false && emailValue?.trim()) {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailValue.trim())) {
            message.warning('Please enter a valid email address');
            return;
          }
        }
        if (currentField.phone?.required && !phoneValue?.trim()) {
          message.warning(currentField.phone?.label ? `${currentField.phone.label} is required` : 'Phone is required');
          return;
        }
        if (currentField.phone?.visible !== false && phoneValue?.trim()) {
          // Validate phone format
          const phoneDigits = phoneValue.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            message.warning('Please enter a valid phone number');
            return;
          }
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
        // Enhanced date field validation
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
        // Email validation
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
        // Phone validation
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
        // Multi-select validation
        const values = formData[currentField.id];
        if (!values || !Array.isArray(values) || values.length === 0) {
          message.warning('Please select at least one option');
          return;
        }
      } else {
        // General field validation
        const value = formData[currentField.id];
        if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) {
          message.warning(`${currentField.label || 'This field'} is required`);
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

      // Public endpoint – no authentication required
      await PublicService.createVacancySubmission(applicationData);
      
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
          <div className="space-y-4">
            {/* First Name and Last Name in a row */}
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
            
            {/* Email field */}
            {field.email?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.email?.label || 'Email'}
                  {field.email?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="email"
                  value={formData[`${field.id}_email`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_email`, e.target.value)}
                  placeholder={field.email?.placeholder || "Email address"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            
            {/* Phone field */}
            {field.phone?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-xs text-gray-600">
                  {field.phone?.label || 'Phone'}
                  {field.phone?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="tel"
                  value={formData[`${field.id}_phone`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_phone`, e.target.value)}
                  placeholder={field.phone?.placeholder || "Phone number"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}

            {/* Additional contact fields */}
            {field.additionalFields?.map((additionalField) => (
              (field[additionalField.key]?.visible !== false) && (
                <div key={additionalField.key}>
                  <label className="block mb-1 font-semibold text-xs text-gray-600">
                    {field[additionalField.key]?.label || additionalField.label}
                    {field[additionalField.key]?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <Input
                    value={formData[`${field.id}_${additionalField.key}`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_${additionalField.key}`, e.target.value)}
                    placeholder={field[additionalField.key]?.placeholder || additionalField.placeholder}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )
            ))}
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
          <Input
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.customPlaceholder || field.placeholder || "Phone number"}
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

    switch (field.type) {
      case 'lead-capture-group':
        return (
          <div className="space-y-6">
                         {field.fields.map((subField) => {
               // Find contact field to get proper label configuration
               const contactField = field.fields.find(f => f.type === 'contact');
               let displayLabel = subField.customLabel || subField.label;
               
               // Use appropriate labels for contact fields
               if (subField.type === 'email') {
                 displayLabel = contactField?.email?.label || subField.customLabel || subField.label || 'Email';
               } else if (subField.type === 'phone') {
                 displayLabel = contactField?.phone?.label || subField.customLabel || subField.label || 'Phone Number';
               } else if (subField.type === 'contact') {
                 displayLabel = subField.customLabel || subField.label || 'Full Name';
               }
               
               return (
                 <div key={subField.id}>
                   <label className="block mb-2 font-semibold text-sm">
                     {displayLabel}
                     {subField.required && <span className="ml-1 text-red-500">*</span>}
                   </label>
                   {renderSingleField(subField)}
                 </div>
               );
             })}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            {/* First Name and Last Name in a row */}
            <div className="grid grid-cols-2 gap-4">
              {field.firstName?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
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
                  <label className="block mb-1 font-semibold text-sm">
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
            
            {/* Email field */}
            {field.email?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.email?.label || 'Email'}
                  {field.email?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="email"
                  value={formData[`${field.id}_email`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_email`, e.target.value)}
                  placeholder={field.email?.placeholder || "Email address"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            
            {/* Phone field */}
            {field.phone?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.phone?.label || 'Phone'}
                  {field.phone?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  type="tel"
                  value={formData[`${field.id}_phone`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_phone`, e.target.value)}
                  placeholder={field.phone?.placeholder || "Phone number"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}

            {/* Additional contact fields */}
            {field.additionalFields?.map((additionalField) => (
              (field[additionalField.key]?.visible !== false) && (
                <div key={additionalField.key}>
                  <label className="block mb-1 font-semibold text-sm">
                    {field[additionalField.key]?.label || additionalField.label}
                    {field[additionalField.key]?.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  <Input
                    value={formData[`${field.id}_${additionalField.key}`] || ''}
                    onChange={(e) => handleInputChange(`${field.id}_${additionalField.key}`, e.target.value)}
                    placeholder={field[additionalField.key]?.placeholder || additionalField.placeholder}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )
            ))}
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
          <Input
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.customPlaceholder || field.placeholder || "Phone number"}
            className="rounded-lg"
            size="large"
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
        const dateValue = formData[field.id] ? dayjs(formData[field.id]) : null;
        
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