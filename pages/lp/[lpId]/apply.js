import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Button, Input, Radio, Checkbox, Select, Progress, message, Form, DatePicker } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import PublicService from '../../../src/services/PublicService';
import UploadService from '../../../src/services/UploadService';
import MetaPixel from '../../../src/pages/Landingpage/MetaPixel.jsx';
import { getTranslation } from '../../../src/utils/translations';
// Removed PhoneInput - using regular Input instead
// 🎨 BRANDING IMPORTS
import useTemplatePalette from '../../hooks/useTemplatePalette';

// ----------------------
// Conditional Logic Utils
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
  // Respect explicit visibility flag first
  if (field?.visible === false) return false;
  const visibleWhen = field?.logic?.visibleWhen;
  if (!visibleWhen || !Array.isArray(visibleWhen.conditions) || visibleWhen.conditions.length === 0) {
    return true;
  }
  const all = visibleWhen.all !== false; // default AND
  const results = visibleWhen.conditions.map((c) => evaluateCondition(c, formData));
  return all ? results.every(Boolean) : results.some(Boolean);
};

const getVisibleFieldsForFlow = (fields, formData) => {
  return (fields || []).filter((f) => isFieldVisibleByLogic(f, formData));
};

const getAnswerValue = (field, formData) => {
  if (!field) return undefined;
  if (field.type === 'contact') return undefined; // composite
  if (field.type === 'address') return undefined; // composite
  return formData?.[field.id];
};

const resolveJumpTarget = (field, formData) => {
  const jump = field?.logic?.jump;
  if (!jump) return null;
  const answer = getAnswerValue(field, formData);
  // Support yes/no normalization
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
  // Only allow default next/end on non-free-text types
  const ALLOWED_JUMP_TYPES = new Set(['yesno', 'boolean', 'multichoice', 'dropdown', 'multiselect']);
  if (!ALLOWED_JUMP_TYPES.has(field?.type)) return null;
  return jump.default || null; // 'next' | 'end' | null
};

// Helper function to ensure pixel is ready before firing events
const waitForPixel = (callback, maxRetries = 10, retryDelay = 500) => {
  let retries = 0;

  const checkAndFire = () => {
    if (window.fbq && typeof window.fbq === 'function') {
      console.log('✅ PIXEL-READY: fbq is available, firing event');
      callback();
    } else if (retries < maxRetries) {
      retries++;
      console.log(`⏳ PIXEL-WAIT: Attempt ${retries}/${maxRetries}, retrying in ${retryDelay}ms...`);
      setTimeout(checkAndFire, retryDelay);
    } else {
      console.error('❌ PIXEL-TIMEOUT: fbq not available after max retries');
    }
  };

  checkAndFire();
};
// Import custom styled components
import {
  Button as CustomButton,
  Heading,
  Img,
  Input as CustomInput,
  Text,
  Radio as CustomRadio,
  CheckBox as CustomCheckBox,
} from '../../../src/pages/Dashboard/Vacancies/components/components';
import { CloseOutlined } from '@ant-design/icons';

// Removed country detection since we're using regular Input instead of PhoneInput

const { TextArea } = Input;
const { Option } = Select;

// Custom components to match preview styling
const MultipleChoice = ({ field, value, onChange, brandColor }) => (
  <div className="w-full space-y-3">
    {field.options?.map((option, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D...
      // Handle both string format ["HTML", "CSS"] and object format [{text: "HTML", isNegative: false}]
      const optionText = typeof option === 'string' ? option : option.text;
      const isSelected = value === optionText;

      return (
        <div
          key={index}
          className="border-2 rounded-[15px] cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300"
          onClick={() => onChange({ target: { value: optionText } })}
          style={isSelected ? { borderColor: brandColor } : {}}
        >
          <div className="flex items-center p-4">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0 ${!isSelected ? 'border-2 border-gray-200' : ''}`}
              style={isSelected ? { backgroundColor: brandColor, color: 'white' } : {}}
            >
              {letter}
            </div>
            <p
              className="text-sm flex-1"
              style={{ color: isSelected ? brandColor : '#1f2937' }}
            >
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

const MultiSelectChoice = ({ field, value, onChange, brandColor }) => (
  <div className="w-full space-y-3">
    {field.options?.map((option, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D...
      // Handle both string format ["HTML", "CSS"] and object format [{text: "HTML", isNegative: false}]
      const optionText = typeof option === 'string' ? option : option.text;
      const isSelected = value?.includes(optionText);

      return (
        <div
          key={index}
          className="border-2 rounded-[15px] cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300"
          onClick={() => {
            const newValue = value || [];
            if (isSelected) {
              onChange(newValue.filter(v => v !== optionText));
            } else {
              onChange([...newValue, optionText]);
            }
          }}
          style={isSelected ? { borderColor: brandColor } : {}}
        >
          <div className="flex items-center p-4">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0 ${!isSelected ? 'border-2 border-gray-200' : ''}`}
              style={isSelected ? { backgroundColor: brandColor, color: 'white' } : {}}
            >
              {letter}
            </div>
            <p
              className="text-sm flex-1"
              style={{ color: isSelected ? brandColor : '#1f2937' }}
            >
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
                ? 'border-red-500 bg-red-500'
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

const FileUpload = ({ value, onChange, placeholder, videoOnly = false }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  // Parse existing value to show if it's a URL or filename
  useEffect(() => {
    if (value) {
      if (typeof value === 'object' && value.filename) {
        // New format: object with filename and url
        setFileName(value.filename);
      } else if (typeof value === 'string' && value.startsWith('http')) {
        // Legacy format: URL string - extract filename from URL
        const urlParts = value.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const decodedPart = decodeURIComponent(lastPart);
        // Remove Cloudinary transformations and get clean filename
        const cleanName = decodedPart.split('_').pop() || decodedPart;
        setFileName(cleanName);
      } else if (typeof value === 'string') {
        // Legacy format: just filename
        setFileName(value);
      }
    }
  }, [value]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size based on config
    const VIDEO_EXTS = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv'];
    const NON_VIDEO_EXTS = [
      '.pdf', '.doc', '.docx', '.txt', '.rtf',
      '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp',
      '.mp3', '.wav', '.aac', '.flac', '.wma',
      '.zip', '.rar', '.7z', '.tar', '.gz',
      '.xls', '.xlsx', '.csv', '.ppt', '.pptx'
    ];
    const allowedTypes = videoOnly ? VIDEO_EXTS : [...VIDEO_EXTS, ...NON_VIDEO_EXTS];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const isVideo = VIDEO_EXTS.includes(fileExtension);

    if (!allowedTypes.includes(fileExtension)) {
      message.error(
        videoOnly
          ? 'Please upload a video file (MP4, WEBM, OGG, AVI, MOV, WMV, FLV)'
          : 'Please select a valid file type (Documents, Images, Videos, Audio, Archives, etc.)'
      );
      return;
    }

    const MAX_BYTES = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      message.error(isVideo ? 'Video size must be ≤ 100MB' : 'File size must be ≤ 10MB');
      return;
    }

    setUploading(true);
    try {
      console.log('📄 Uploading file:', file.name);

      // Upload file using UploadService (100MB limit for videos, 10MB for others)
      const response = await UploadService.upload(file, isVideo ? 100 : 10);

      if (response && response.data && response.data.secure_url) {
        const uploadedUrl = response.data.secure_url;
        console.log('✅ File upload successful:', uploadedUrl);

        setFileName(file.name);
        // Store both URL and filename as an object with additional metadata
        onChange({
          url: uploadedUrl,
          filename: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString()
        });
        message.success('File uploaded successfully');
      } else {
        console.warn('❌ File upload response missing URL:', response);
        message.error('File upload failed');
      }
    } catch (error) {
      console.error('❌ File upload error:', error);
      message.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-[15px] p-8 text-center hover:border-gray-400 transition-colors">
      <div className="space-y-4">
        <div className="text-blue-500">
          {uploading ? (
            <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        <div>
          {uploading ? (
            <p className="text-lg font-medium text-blue-600">Uploading...</p>
          ) : (
            <>
              <p className="text-lg font-medium text-blue-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">
                {videoOnly
                  ? 'Videos up to 100MB (MP4, WEBM, OGG, AVI, MOV, WMV, FLV)'
                  : 'Videos up to 100MB; other files up to 10MB'}
              </p>
            </>
          )}
          {fileName && !uploading && <p className="text-sm text-green-600 mt-2">✓ {fileName}</p>}
          {placeholder && !fileName && !uploading && <p className="text-xs text-gray-400 mt-1">{placeholder}</p>}
        </div>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          accept={videoOnly
            ? '.mp4,.webm,.ogg,.avi,.mov,.wmv,.flv'
            : '.pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.gif,.svg,.webp,.bmp,.mp4,.webm,.ogg,.avi,.mov,.wmv,.flv,.mp3,.wav,.aac,.flac,.wma,.zip,.rar,.7z,.tar,.gz,.xls,.xlsx,.csv,.ppt,.pptx'}
        />
      </div>
    </div>
  );
};

export default function ApplyPage({ defaultLandingPageData = null }) {
  const router = useRouter();
  const { lpId } = router.query;

  const [landingPageData, setLandingPageData] = useState(defaultLandingPageData);
  const settings = landingPageData?.form?.settings || {};
  console.log("settings?.redirectToUrl", settings?.redirectToUrl)
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSavedContact, setHasSavedContact] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [optInAccepted, setOptInAccepted] = useState(false);
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
  const secondaryColor = landingPageData?.secondaryColor || primaryColor;
  const tertiaryColor = landingPageData?.tertiaryColor || primaryColor;

  // 🎨 ENHANCED DEBUG: Log all color sources in apply page
  console.log("🎨 APPLY PAGE REAL COLORS FROM DATABASE:", {
    "FINAL_USED": { primaryColor, secondaryColor, tertiaryColor },
    "landingPageData": !!landingPageData,
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

      // Exclude WhatsApply button from brand color styling
      const allButtons = applyContainer.querySelectorAll('button:not(.whatsapply-btn), .ant-btn, [class*="ant-btn"]');
      console.log(`🎯 APPLY: FOUND ${allButtons.length} BUTTONS - APPLYING REAL COLOR: ${primaryColor}`);

      allButtons.forEach((btn, i) => {
        // Skip WhatsApply button
        if (btn.classList.contains('whatsapply-btn')) return;
        
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
    if (lpId && !defaultLandingPageData) {
      fetchData();
    } else if (defaultLandingPageData) {
      setLoading(false);
    }
  }, [lpId, defaultLandingPageData]);

  // Draft persistence (collect partial answers)
  useEffect(() => {
    if (!lpId || !settings?.collectPartialAnswers) return;
    try {
      const raw = localStorage.getItem(`lp:${lpId}:formDraft`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setFormData(parsed.formData || {});
          if (typeof parsed.currentStep === 'number') setCurrentStep(Math.max(1, parsed.currentStep));
          setOptInAccepted(!!parsed.optInAccepted);
        }
      }
    } catch (_) { }
  }, [lpId, settings?.collectPartialAnswers]);

  useEffect(() => {
    if (!lpId || !settings?.collectPartialAnswers) return;
    try {
      const payload = JSON.stringify({ formData, currentStep, optInAccepted });
      localStorage.setItem(`lp:${lpId}:formDraft`, payload);
    } catch (_) { }
  }, [formData, currentStep, optInAccepted, lpId, settings?.collectPartialAnswers]);

  // If SSR provided data, hydrate form fields immediately
  useEffect(() => {
    if (defaultLandingPageData && (!Array.isArray(formFields) || formFields.length === 0)) {
      const visibleFields = (defaultLandingPageData?.form?.fields || []).filter((field) => field.visible !== false);
      if (visibleFields.length > 0) {
        setFormFields(visibleFields);
      } else {
        // Fallback: if SSR data has no fields, fetch client-side
        if (lpId) {
          fetchData();
        }
      }
    }
  }, [defaultLandingPageData]);

  // Meta Pixel: fire PageView for apply page and fire Lead on first step render
  useEffect(() => {
    if (!landingPageData?.metaPixelId || !lpId) return;

    const fireApplyPageEvents = () => {
      console.log('🎯 APPLY: Starting to fire events');

      // HireLab PageView on load
      waitForPixel(() => {
        try {
          window.fbq('trackCustom', 'Hirelab.FormView', {
            content_name: landingPageData?.vacancyTitle || '',
            funnel_id: lpId || '',
            company: landingPageData?.companyName || '',
            job_category: landingPageData?.department || ''
          });
          console.log('✅ APPLY: Hirelab.FormView event fired successfully');
        } catch (e) {
          console.error('❌ APPLY: PageView event failed:', e);
        }
      });


    };

    // Fire events
    fireApplyPageEvents();
  }, [landingPageData?.metaPixelId, lpId]);

  const fetchData = async () => {
    try {
      console.log('Fetching apply page data for lpId:', lpId);
      //      const res = await CrudService.getSingle("LandingPageData", lpId, "apply page");

      const res = await PublicService.getLP(lpId);
      if (res.data) {
        console.log('Apply page data loaded:', res.data?.lp);

        // 🎨 ENHANCED: Populate landing page data with user brand data
        const landingPage = res.data?.lp;

        if (true || !landingPage.primaryColor && landingPage.user_id) {
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
        const visibleFields = ((landingPage?.form?.fields) || (res.data?.lp?.form?.fields) || []).filter(field => field.visible !== false);
        console.log('Visible fieldsss:', visibleFields);

        // Check for AI-generated contact field first
        const contactField = visibleFields.find(field => field.type === 'contact');
        const leadCaptureFields = visibleFields.filter(field => field.isLeadCapture && field.type !== 'contact');
        const otherFields = visibleFields.filter(field => !field.isLeadCapture && field.type !== 'contact');

        if (contactField) {
          // Use AI-generated contact field directly - no need for wrapper
          console.log("✅ Found AI-generated contact field:", contactField);
          setFormFields([
            contactField, // Use the AI-generated contact field directly
            ...leadCaptureFields,
            ...otherFields
          ]);
        } else {
          // Check for separate email/phone fields as fallback
          const separateContactFields = visibleFields.filter(field =>
            field.type === 'email' || field.type === 'phone'
          );
          const nonContactFields = visibleFields.filter(field =>
            field.type !== 'email' && field.type !== 'phone'
          );

          if (separateContactFields.length > 0) {
            // Use existing separate contact fields in a group
            setFormFields([
              {
                id: 'lead-capture-step',
                type: 'lead-capture-group',
                label: getTranslation(landingPageData?.lang || 'en', 'contactInformation') || 'Contact Information',
                fields: separateContactFields,
                required: true
              },
              ...nonContactFields
            ]);
          } else {
            // Last resort: create default contact field with translations
            console.log("⚠️ No contact fields found - creating default contact field");
            const defaultContactField = {
              id: 'default_contact',
              type: 'contact',
              label: getTranslation(landingPageData?.lang || 'en', 'contactInformation') || 'Contact Information',
              required: true,
              visible: true,
              isLeadCapture: true,
              firstName: {
                visible: true,
                required: true,
                label: getTranslation(landingPageData?.lang || 'en', 'firstName') || 'First Name',
                placeholder: getTranslation(landingPageData?.lang || 'en', 'firstNamePlaceholder') || 'Enter firstname'
              },
              lastName: {
                visible: true,
                required: true,
                label: getTranslation(landingPageData?.lang || 'en', 'lastName') || 'Last Name',
                placeholder: getTranslation(landingPageData?.lang || 'en', 'lastNamePlaceholder') || 'Enter lastname'
              },
              email: {
                visible: true,
                required: true,
                label: getTranslation(landingPageData?.lang || 'en', 'email') || 'Email',
                placeholder: getTranslation(landingPageData?.lang || 'en', 'emailPlaceholder') || 'Enter your email address'
              },
              phone: {
                visible: true,
                required: true,
                label: getTranslation(landingPageData?.lang || 'en', 'phone') || 'Phone',
                placeholder: getTranslation(landingPageData?.lang || 'en', 'phonePlaceholder') || 'Enter your phone number'
              }
            };

            setFormFields([
              defaultContactField,
              ...visibleFields
            ]);
          }
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
    // If email changes, allow another early save attempt
    if (String(fieldId).toLowerCase().includes('email')) {
      setHasSavedContact(false);
    }
  };

  // Auto-jump utility when setting is enabled (choice-like fields)
  const maybeAutoJump = (fieldValue) => {
    if (settings?.autoJumpToNext) {
      setTimeout(() => handleNext(fieldValue), 0);
    }
  };

  const isContactStep = (field) => {
    if (!field) return false;
    if (field.type === 'contact') return true;
    if (field.type === 'lead-capture-group' && Array.isArray(field.fields)) {
      return field.fields.some((f) => f.type === 'contact');
    }
    return false;
  };

  const buildProcessedFormData = () => {
    const processedFormData = { ...formData };

    // Process form fields to match the expected format
    formFields.forEach(field => {
      if (field.type === 'lead-capture-group') {
        // Process each field in the lead capture group
        field.fields.forEach(subField => {
          if (subField.type === 'contact') {
            processedFormData[`firstname`] = formData[`${subField.id}_firstName`] || "";
            processedFormData[`lastname`] = formData[`${subField.id}_lastName`] || "";
            // Some builders embed email inside the contact field (id_email)
            if (!processedFormData[`email`]) {
              processedFormData[`email`] = formData[`${subField.id}_email`] || "";
            }
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
        if (!processedFormData[`email`]) {
          processedFormData[`email`] = formData[`${field.id}_email`] || "";
        }
      } else if (field.type === 'email') {
        processedFormData[`email`] = formData[field.id] || "";
      } else if (field.type === 'phone') {
        processedFormData[`phone`] = formData[field.id] || "";
      } else if (field.type === 'date') {
        // Handle single DatePicker value (stored as 'YYYY-MM-DD' format)
        const dateValue = formData[field.id] || "";

        if (dateValue) {
          // Convert from 'YYYY-MM-DD' to the desired format
          const dateFormat = field.dateFormat || "MMDDYYYY";
          const dateSeparator = field.dateSeparator || "/";

          try {
            const date = dayjs(dateValue);
            if (date.isValid()) {
              let formattedDate = "";
              if (dateFormat === 'MMDDYYYY') {
                formattedDate = date.format(`MM${dateSeparator}DD${dateSeparator}YYYY`);
              } else if (dateFormat === 'DDMMYYYY') {
                formattedDate = date.format(`DD${dateSeparator}MM${dateSeparator}YYYY`);
              } else if (dateFormat === 'YYYYMMDD') {
                formattedDate = date.format(`YYYY${dateSeparator}MM${dateSeparator}DD`);
              } else {
                // Default to ISO format if format is not recognized
                formattedDate = date.format('YYYY-MM-DD');
              }
              processedFormData[field.id] = formattedDate;
            } else {
              processedFormData[field.id] = "";
            }
          } catch (error) {
            console.error('Error formatting date:', error);
            processedFormData[field.id] = dateValue; // Fallback to original value
          }
        } else {
          processedFormData[field.id] = "";
        }
      } else if (field.type === 'file') {
        // Handle file fields - store complete object for better handling
        const fileData = formData[field.id];
        if (fileData) {
          if (typeof fileData === 'object' && fileData.url) {
            // New format: store the complete object
            processedFormData[field.id] = fileData;
          } else if (typeof fileData === 'string') {
            // Legacy format: URL string - convert to object format
            processedFormData[field.id] = {
              url: fileData,
              filename: fileData.split('/').pop().split('_').pop() || 'download'
            };
          }
        } else {
          processedFormData[field.id] = "";
        }
      } else {
        // Handle other field types
        processedFormData[field.id] = formData[field.id] || "";
      }
    });

    return processedFormData;
  };

  const saveContactSnapshot = async () => {
    // Respect setting: if disabled, skip early storage
    if (settings?.storeCandidateInfoBeforeApplied === false) return;
    if (hasSavedContact) return;
    try {
      const processedFormData = buildProcessedFormData();
      const applicationData = {
        LandingPageDataId: lpId,
        formData: processedFormData,
        form: landingPageData?.form,
        searchIndex: `${processedFormData.firstname || ''} ${processedFormData.lastname || ''} ${processedFormData.email || ''}`.trim(),
        formSettings: landingPageData?.form?.settings || {},
        optInAccepted: !!optInAccepted,
        partial: true, // mark as early contact save
      };
      await PublicService.createVacancySubmission(applicationData);
      setHasSavedContact(true);
    } catch (err) {
      console.warn('Unable to save contact snapshot early:', err?.message || err);
    }
  };

  const handleNext = (providedFieldValue) => {
    // Guard: if fields are not yet loaded, don't proceed or submit
    if (!Array.isArray(formFields) || formFields.length === 0) {
      message.warning('Loading form... Please wait a moment.');
      return;
    }
    // Compute visible flow at the moment of click
    const flowFields = getVisibleFieldsForFlow(formFields, formData);
    if (flowFields.length === 0) {
      // No questions to ask -> submit immediately
      handleSubmit();
      return;
    }
    // Validate current step
    const currentField = flowFields[currentStep - 1];
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
        // Phone is ALWAYS required when visible (regardless of stored required flag)
        if (currentField.phone?.visible !== false && !phoneValue?.trim()) {
          message.warning(currentField.phone?.label ? `${currentField.phone.label} is required` : 'Phone is required');
          return;
        }
        if (currentField.phone?.visible !== false && phoneValue?.trim()) {
          // Validate phone format
          const phoneDigits = phoneValue.replace(/\D/g, '');
          if (phoneDigits.length < 3) {
            message.warning('Please enter a valid phone number');
            return;
          }
        }
      } else if (currentField.type === 'address') {
        // Validate address subfields based on visibility/required settings
        const parts = [
          { key: 'line1', cfg: currentField.line1 },
          { key: 'line2', cfg: currentField.line2 },
          { key: 'city', cfg: currentField.city },
          { key: 'state', cfg: currentField.state },
          { key: 'zip', cfg: currentField.zip },
          { key: 'country', cfg: currentField.country },
        ];

        // Check required visible parts
        const requiredVisibleParts = parts.filter(p => p.cfg?.visible !== false && p.cfg?.required);
        for (const p of requiredVisibleParts) {
          const val = formData[`${currentField.id}_${p.key}`];
          if (!val || (typeof val === 'string' && !val.trim())) {
            const label = p.cfg?.label || p.key;
            message.warning(`${label} is required`);
            return;
          }
        }

        // If no specific part is required but the whole field is required, ensure at least one visible part is filled
        if (requiredVisibleParts.length === 0 && currentField.required) {
          const visibleParts = parts.filter(p => p.cfg?.visible !== false);
          const anyFilled = visibleParts.some(p => {
            const val = formData[`${currentField.id}_${p.key}`];
            return val && (typeof val !== 'string' || val.trim());
          });
          if (!anyFilled) {
            message.warning('Please fill at least one address detail');
            return;
          }
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
        if (phoneDigits.length < 3) {
          message.warning('Please enter a valid phone number');
          return;
        }
      } else if (currentField.type === 'multiselect') {
        // Multi-select validation - use provided value for auto-jump
        const values = providedFieldValue !== undefined ? providedFieldValue : formData[currentField.id];
        if (!values || !Array.isArray(values) || values.length === 0) {
          message.warning('Please select at least one option');
          return;
        }
      } else if (currentField.type === 'multichoice' || currentField.type === 'dropdown') {
        // Choice field validation - use provided value for auto-jump
        const value = providedFieldValue !== undefined ? providedFieldValue : formData[currentField.id];
        if (!value || (typeof value === 'string' && !value.trim())) {
          message.warning(`This step is required`);
          return;
        }
      } else if (currentField.type === 'yesno' || currentField.type === 'boolean') {
        // Yes/No field validation - use provided value for auto-jump
        const value = providedFieldValue !== undefined ? providedFieldValue : formData[currentField.id];
        if (value === undefined || value === null || value === '') {
          message.warning(`This step is required`);
          return;
        }
      } else {
        // General field validation
        const value = formData[currentField.id];
        if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) {
          message.warning(`This step is required`);
          return;
        }
      }
    }

    // Determine jump logic
    const jumpTarget = resolveJumpTarget(currentField, formData);
    if (jumpTarget === 'end') {
      handleSubmit();
      return;
    }

    // Fire Lead when moving off first step
    try {
      if (currentStep === 1 && landingPageData?.metaPixelId && window.fbq) {
        const leadKey = `metaLeadFired_${lpId}`;
        const already = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(leadKey) === '1';
        if (!already) {
          waitForPixel(() => {
            try {
              window.fbq('track', 'Lead', {
                content_name: landingPageData?.vacancyTitle || '',
                funnel_id: lpId || '',
                brand: landingPageData?.companyName || '',
                job_category: landingPageData?.department || ''
              });
              try { sessionStorage.setItem(leadKey, '1'); } catch (_) { }
            } catch (e) {
              console.error('❌ APPLY-STEP: Lead event failed:', e);
            }
          });
        }
      }
    } catch (e) {
      console.error('❌ APPLY-STEP: Lead event failed:', e);
    }

    // Fire Contact event when completing a contact step
    try {
      if (currentStep > 0 && landingPageData?.metaPixelId && window.fbq) {
        const currentField = flowFields[currentStep - 1]; // the step we just completed
        const isContactGroup = currentField?.type === 'lead-capture-group';
        const isContactComposite = currentField?.type === 'contact';

        if (isContactGroup || isContactComposite) {
          // Check for actual contact data with dynamic field IDs
          const hasContactInfo = Object.keys(formData).some(key =>
            (key.includes('firstName') || key.includes('lastName') ||
              key.includes('email') || key.includes('phone')) &&
            formData[key]?.trim()
          );

          if (hasContactInfo) {
            const contactKey = `metaContactFired_${lpId}`;
            const already = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(contactKey) === '1';

            if (!already) {
              waitForPixel(() => {
                try {
                  window.fbq('trackCustom', 'Hirelab.Contact_Information', {
                    content_name: landingPageData?.vacancyTitle || '',
                    funnel_id: lpId || '',
                    company: landingPageData?.companyName || '',
                    job_category: landingPageData?.department || ''
                  });
                  try { sessionStorage.setItem(contactKey, '1'); } catch (_) { }
                } catch (fbqError) {
                  console.error('❌ CONTACT: Contact Info event failed:', fbqError);
                }
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('❌ CONTACT: Contact event logic failed:', e);
    }

    // Compute next step considering jump target
    if (jumpTarget && jumpTarget !== 'next') {
      const targetIndex = flowFields.findIndex(f => f.id === jumpTarget);
      if (targetIndex >= 0) {
        setCurrentStep(targetIndex + 1);
        return;
      }
    }

    // If this click would move from last question to submit, validate opt-in if required
    const isGoingToSubmit = currentStep === flowFields.length;
    if (isGoingToSubmit && settings?.optIn?.enabled && settings?.optIn?.required && !optInAccepted) {
      message.warning('Please accept the opt-in to continue');
      return;
    }

    // On contact step, persist a draft submission early (deduped by email on backend)
    if (isContactStep(currentField)) {
      saveContactSnapshot();
    }

    if (currentStep >= flowFields.length) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const processedFormData = buildProcessedFormData();

      // Submit to your backend/ATS using the correct model name
      const applicationData = {
        LandingPageDataId: lpId,
        formData: processedFormData,
        form: landingPageData?.form,
        searchIndex: `${processedFormData.firstname || ''} ${processedFormData.lastname || ''} ${processedFormData.email || ''}`.trim(),
        formSettings: landingPageData?.form?.settings || {},
        optInAccepted: !!optInAccepted,
        partial: false, // This is the final/complete submission
      };

      // If respondent email configured, pass it explicitly so BE can send
      if (applicationData.formSettings?.respondentEmail?.enabled) {
        applicationData.respondentEmail = applicationData.formSettings.respondentEmail;
      }

      console.log('Submitting application data:', applicationData);

      // Public endpoint – no authentication required
      await PublicService.createVacancySubmission(applicationData);

      // Clear draft once submitted
      try { if (settings?.collectPartialAnswers && lpId) localStorage.removeItem(`lp:${lpId}:formDraft`); } catch (_) { }

      message.success('Application submitted successfully!');
      // Redirect: either external redirectToUrl or fallback to thank-you
      if ((settings?.redirectToUrl || '').trim()) {
        const raw = settings.redirectToUrl.trim();
        const hasProtocol = /^(https?:)?\/\//i.test(raw);
        const cleaned = raw.replace(/\s+/g, '').replace(/^\/+/, '');
        const finalUrl = hasProtocol ? raw : `https://${cleaned}`;
        window.location.href = finalUrl;
      } else {
        router.push(`/lp/${lpId}/thank-you`);
      }
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
                  placeholder={field.email?.placeholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address"}
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
                  placeholder={field.phone?.placeholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number"}
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_${additionalField.key}`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_${additionalField.key}`, value)}
                      placeholder={field[additionalField.key]?.placeholder || additionalField.placeholder}
                      className="border-none focus:ring-0 text-sm"
                      shape="round"
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        );

      case 'email':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="email"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.customPlaceholder || field.placeholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address"}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'phone':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="tel"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.customPlaceholder || field.placeholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number"}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      default:
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
                displayLabel = contactField?.email?.label || subField.customLabel || subField.label || getTranslation(landingPageData?.lang || 'en', 'email') || 'Email';
              } else if (subField.type === 'phone') {
                displayLabel = contactField?.phone?.label || subField.customLabel || subField.label || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || 'Phone Number';
              } else if (subField.type === 'contact') {
                displayLabel = subField.customLabel || subField.label || getTranslation(landingPageData?.lang || 'en', 'fullName') || 'Full Name';
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
            <div className="grid grid-cols-2 md:gap-4 gap-1">
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
                      className="border-none focus:ring-0 text-sm"
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
                    placeholder={field.email?.placeholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address"}
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
                    placeholder={field.phone?.placeholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number"}
                    className="border-none focus:ring-0 text-sm"
                    shape="round"
                  />
                </div>
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
                  <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
                    <CustomInput
                      value={formData[`${field.id}_${additionalField.key}`] || ''}
                      onChange={(value) => handleInputChange(`${field.id}_${additionalField.key}`, value)}
                      placeholder={field[additionalField.key]?.placeholder || additionalField.placeholder}
                      className="border-none focus:ring-0 text-sm"
                      shape="round"
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        );

      case 'email':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="email"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.customPlaceholder || field.placeholder || getTranslation(landingPageData?.lang || 'en', 'emailAddress') || "Email address"}
              className="border-none focus:ring-0 text-sm"
              shape="round"
            />
          </div>
        );

      case 'phone':
        return (
          <div className="border border-solid border-blue_gray-100 rounded-[15px] overflow-hidden focus-within:border-light_blue-A700">
            <CustomInput
              type="tel"
              value={value}
              onChange={(value) => handleInputChange(field.id, value)}
              placeholder={field.customPlaceholder || field.placeholder || getTranslation(landingPageData?.lang || 'en', 'phoneNumber') || "Phone number"}
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
            onChange={(e) => { handleInputChange(field.id, e.target.value); maybeAutoJump(e.target.value); }}
            brandColor={primaryColor}
          />
        );

      case 'dropdown':
        return (
          <CustomDropdown
            field={field}
            value={value}
            onChange={(selectedValue) => { handleInputChange(field.id, selectedValue); maybeAutoJump(selectedValue); }}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectChoice
            field={field}
            value={Array.isArray(value) ? value : []}
            onChange={(selectedValues) => { handleInputChange(field.id, selectedValues); maybeAutoJump(selectedValues); }}
            brandColor={primaryColor}
          />
        );

      case 'yesno':
      case 'boolean':
        return (
          <YesNoQuestion
            field={field}
            value={value}
            onChange={(newValue) => { handleInputChange(field.id, newValue); maybeAutoJump(newValue); }}
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
          <div className="space-y-4">
            {field.line1?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">{field.line1?.label || 'Address Line 1'}</label>
                <Input
                  value={formData[`${field.id}_line1`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_line1`, e.target.value)}
                  placeholder={(typeof field.line1 === 'string' ? field.line1 : (field.line1?.placeholder || 'Address Line 1'))}
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
                  placeholder={(typeof field.line2 === 'string' ? field.line2 : (field.line2?.placeholder || 'Address Line 2'))}
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
                    placeholder={(typeof field.city === 'string' ? field.city : (field.city?.placeholder || 'City'))}
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
                    placeholder={(typeof field.state === 'string' ? field.state : (field.state?.placeholder || 'State/Province'))}
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
                    placeholder={(typeof field.zip === 'string' ? field.zip : (field.zip?.placeholder || 'ZIP/Postal Code'))}
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
                    placeholder={(typeof field.country === 'string' ? field.country : (field.country?.placeholder || 'Country'))}
                    className="rounded-lg"
                    size="large"
                  />
                </div>
              )}
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
            onChange={(fileUrl) => handleInputChange(field.id, fileUrl)}
            placeholder={field.placeholder}
            videoOnly={!!field.videoOnly}
          />
        );

      default:
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


  const flowFields = getVisibleFieldsForFlow(formFields, formData);
  const totalSteps = flowFields.length;
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const seoTitle = landingPageData?.vacancyTitle
    ? `Apply for ${landingPageData.vacancyTitle} - ${landingPageData?.companyName || 'Hirelab'}`
    : 'Job Application - Hirelab';
  const seoDescription = landingPageData?.heroDescription
    ? (landingPageData.heroDescription.substring(0, 160) + (landingPageData.heroDescription.length > 160 ? '...' : ''))
    : `Apply for this opportunity at ${landingPageData?.companyName || 'our company'}. Start your application now.`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_LIVE_URL || 'https://hirelab.com'}/lp/${lpId}/apply`;

  return (
    <div className="min-h-screen bg-gray-50 apply-form-container">{/* UNIQUE APPLY CLASS */}
      <Head>
        {/* Essential Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Hirelab" />
        {landingPageData?.companyLogo && (
          <meta property="og:image" content={landingPageData.companyLogo} />
        )}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {landingPageData?.companyLogo && (
          <meta name="twitter:image" content={landingPageData.companyLogo} />
        )}

        {/* Additional SEO Tags */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content={landingPageData?.companyName || 'Hirelab'} />
        {landingPageData?.department && (
          <meta name="keywords" content={`${landingPageData.vacancyTitle}, ${landingPageData.companyName}, ${landingPageData.department}, job, career, hiring`} />
        )}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Load Meta Pixel script */}
      <MetaPixel metaPixelId={landingPageData?.metaPixelId} />
      {/* 🎨 APPLY-ONLY BRAND STYLES - ONLY REAL USER COLORS */}
      {primaryColor && (
        <style jsx key={`brand-${primaryColor}`}>{`
          /* Progress bar */
          .ant-progress-bg {
            background-color: ${primaryColor} !important;
          }
          
          /* ONLY BUTTONS INSIDE APPLY CONTAINER - ONLY REAL USER COLOR */
          .apply-form-container button:not(.whatsapply-btn),
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
          .apply-form-container button:not(.whatsapply-btn):hover,
          .apply-form-container .ant-btn:hover,
          .apply-form-container .ant-btn-primary:hover {
            background: ${primaryColor} !important;
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
          
          /* WhatsApply button - Always WhatsApp green */
          .apply-form-container .whatsapply-btn {
            background: #25D366 !important;
            background-color: #25D366 !important;
            border: 1px solid #25D366 !important;
            border-color: #25D366 !important;
            color: white !important;
          }
          
          .apply-form-container .whatsapply-btn:hover {
            background: #20bd5a !important;
            background-color: #20bd5a !important;
            border-color: #20bd5a !important;
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
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
            <Button
              type="text"
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
              icon={<CloseOutlined />}
            >
            </Button>
          </div>

          {/* Progress Bar */}
          {settings.showProgressBar !== false && (
            <div className="mt-4">
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Question Step (intro removed; start at contact) */}
          <div>
            {flowFields[currentStep - 1] && (
              <div>
                {/* WhatsApply Button - shown on first step when enabled AND phone number is configured */}
                {currentStep === 1 && settings?.whatsApply?.enabled && settings?.whatsApply?.phoneNumber && (
                  <div className="mb-6">
                    <div
                      onClick={() => {
                        // Build the WhatsApp message with variables replaced
                        // Clean phone number: remove spaces, dashes, and non-digit chars except leading +
                        const rawPhone = settings?.whatsApply?.phoneNumber || '';
                        const cleanPhone = rawPhone.replace(/[^\d+]/g, '').replace(/^\+/, '');
                        const messageTemplate = settings?.whatsApply?.messageTemplate || 'Hi, I saw the vacancy {{url}} and I want to apply for {{jobTitle}} at {{companyName}}.';
                        const currentUrl = typeof window !== 'undefined' ? window.location.href.replace('/apply', '') : '';
                        
                        const message = messageTemplate
                          .replace('{{url}}', currentUrl)
                          .replace('{{jobTitle}}', landingPageData?.vacancyTitle || '')
                          .replace('{{companyName}}', landingPageData?.companyName || '');
                        
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg cursor-pointer"
                      style={{ backgroundColor: '#25D366', color: 'white' }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApply
                    </div>
                    
                    {/* OR Separator */}
                    <div className="flex items-center my-6">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                  </div>
                )}

                {settings?.optIn?.enabled && settings?.optIn?.showMessage !== false && settings?.optIn?.messagePlacement === "contact" && currentStep === 1 && (
                  <div className="mb-4 p-4 rounded border bg-gray-50">
                    <div className="font-medium">{settings.optIn.header || 'Subscribe for updates'}</div>
                    {settings.optIn.description && (
                      <div className="text-sm text-gray-600 mt-1">{settings.optIn.description}</div>
                    )}
                    <label className="flex items-center gap-2 mt-2 text-sm">
                      <Checkbox checked={optInAccepted} onChange={(e) => setOptInAccepted(e.target.checked)} />
                      <span>I agree to opt-in {settings.optIn.required ? '(required)' : '(optional)'}</span>
                    </label>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {flowFields[currentStep - 1].label}
                  {flowFields[currentStep - 1].required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h2>

                <div className="mb-8">
                  {renderField(flowFields[currentStep - 1])}
                </div>
              </div>
            )}
            {settings?.optIn?.enabled && settings?.optIn?.showMessage !== false && settings?.optIn?.messagePlacement === "last" && currentStep === flowFields.length && (
              <div className="mt-4 p-4 rounded border bg-gray-50">
                <div className="font-medium">{settings.optIn.header || 'Subscribe for updates'}</div>
                {settings.optIn.description && (
                  <div className="text-sm text-gray-600 mt-1">{settings.optIn.description}</div>
                )}
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <Checkbox checked={optInAccepted} onChange={(e) => setOptInAccepted(e.target.checked)} />
                  <span>I agree to opt-in {settings.optIn.required ? '(required)' : '(optional)'}</span>
                </label>
              </div>
            )}
          </div>

          {/* Navigation */}
          {flowFields.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                onClick={handlePrevious}
                className="flex items-center space-x-2"
                disabled={currentStep <= 1}
              >
                <ArrowLeft size={16} />
                <span>{landingPageData.form?.previousText || getTranslation(landingPageData?.lang, 'previous')}</span>
              </Button>

              <Button
                type="primary"
                onClick={() => handleNext()}
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
                <span>
                  {currentStep === flowFields.length
                    ? (landingPageData.form?.submitText || getTranslation(landingPageData?.lang, 'submit'))
                    : (landingPageData.form?.nextText || getTranslation(landingPageData?.lang, 'next'))}
                </span>
                {currentStep !== flowFields.length && <ArrowRight size={16} />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Server-side data fetching (minimal)
export async function getServerSideProps(context) {
  const { lpId } = context.query;
  if (!lpId) return { notFound: true };

  try {
    const backendUrl = process.env.NODE_ENV !== "production"
      ? "https://hirelab-backend-workspace.onrender.com/"
      : process.env.NEXT_PUBLIC_BACKEND_URL;

    const response = await axios.get(`${backendUrl}/public/getLP?id=${lpId}`, {
      timeout: 10000,
      headers: { 'User-Agent': 'HirelabBot/1.0' }
    });

    const landingPageData = response.data?.lp;
    if (!landingPageData?.published || landingPageData.applyType !== 'form') {
      return { notFound: true };
    }

    return {
      props: {
        defaultLandingPageData: landingPageData,
        lpId,
      }
    };

  } catch (error) {
    return { notFound: true };
  }
}