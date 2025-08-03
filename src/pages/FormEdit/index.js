"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Form, Input, Modal, Radio, Skeleton, Switch, message, Spin, Tooltip } from "antd";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import CrudService from "../../services/CrudService";
import PublicService from "../../services/PublicService";
import { changeIndigoShades, generateTailwindPalette } from "../Dashboard";
import { Button, Heading, Img, Text } from "../Dashboard/Vacancies/components/components";
import Header from "../Dashboard/Vacancies/components/components/Header";
import ApplicationformAddQuestions, {
  formItems,
} from "../Dashboard/Vacancies/modals/ApplicationformAddQuestions";
import FormE from "../Landingpage/Form";
import EditorRender from "../LandingpageEdit/EditorRender";
import ApplyPagePreview from "./ApplyPagePreview";
import {FaGripVertical,FaTrash} from "react-icons/fa6";
import { DragDropContext as BeautifulDragDropContext, Droppable as BeautifulDroppable, Draggable as BeautifulDraggable } from "@hello-pangea/dnd";
import {PlusOutlined} from "@ant-design/icons";
import AIFormGeneratorModal from "../Dashboard/Vacancies/AIFormGeneratorModal";
// 🎨 BRANDING IMPORTS
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import ApplyCustomFont from "../Landingpage/ApplyCustomFont";
import { getFonts } from "../Landingpage/getFonts";
import { getTranslation } from "../../utils/translations";

const { TextArea } = Input;

export default function FormEdit({paramsId}) {
  const router = useRouter();
  const lpId = paramsId;
  
  // 🎨 BRANDING SETUP
  const user = useSelector(selectUser);
  const [userBrandData, setUserBrandData] = useState(null);
  
  // 🎨 BRAND COLORS & FONTS - Use real user data, no forced overrides
  const primaryColor = userBrandData?.primaryColor || user?.primaryColor || "#5207CD";
  const secondaryColor = userBrandData?.secondaryColor || user?.secondaryColor || "#0C7CE6";
  const tertiaryColor = userBrandData?.tertiaryColor || user?.tertiaryColor || "#6B46C1";
  
  // 🎨 ENHANCED DEBUG: Log ALL color sources and final decision
  console.log("🔥 REAL USER COLORS FROM DATABASE:", {
    "FINAL_USED": { primaryColor, secondaryColor, tertiaryColor },
    "userBrandData": userBrandData,
    "userFromRedux": {
      primary: user?.primaryColor,
      secondary: user?.secondaryColor,
      tertiary: user?.tertiaryColor,
      fullUserObject: user
    },
    "expectedTurquoise": "#11dade",
    "expectedPink": "#e0237e",
    "isUsingCorrectColors": primaryColor === "#11dade" && secondaryColor === "#e0237e"
  });
  
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

  const [landingPageData, setLandingPageData] = useState(null);
  const [questionModal, setQuestionModal] = useState(false);
  const [formSections, setFormSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEditingForm, setIsEditingForm] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [device, setDevice] = useState('desktop');
  const previewNavigatingRef = useRef(false); // Track if preview is currently navigating

  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render key
  const [aiFormModalVisible, setAiFormModalVisible] = useState(false);
  

  console.log("formSections", formSections);

  // 🎨 FETCH USER BRAND DATA
  useEffect(() => {
    if (user) {
      console.log("🎨 BRANDING DEBUG - User data:", {
        primaryColor: user.primaryColor,
        secondaryColor: user.secondaryColor,
        tertiaryColor: user.tertiaryColor,
        userObject: user
      });
      
      setUserBrandData({
        primaryColor: user.primaryColor,
        secondaryColor: user.secondaryColor,
        tertiaryColor: user.tertiaryColor,
        titleFont: user.titleFont,
        bodyFont: user.bodyFont,
        subheaderFont: user.subheaderFont,
        companyLogo: user.companyLogo,
        companyName: user.companyName,
      });
      
      console.log("🎨 BRANDING DEBUG - Brand data set:", {
        primaryColor: user.primaryColor,
        secondaryColor: user.secondaryColor,
        tertiaryColor: user.tertiaryColor,
      });
    }
  }, [user]);

  const fetchData = useCallback(() => {
    if (lpId) {
      console.log("🔄 Fetching fresh data for lpId:", lpId);
      CrudService.getSingle("LandingPageData", lpId,"form edit").then((res) => {
        if (res.data) {
          console.log("📥 RAW DATA LOADED FROM DATABASE:", res.data);
          console.log("📥 FORM FIELDS FROM DATABASE:", res.data?.form?.fields);
          
          // DETAILED ANALYSIS OF RAW FIELDS
          console.log("🔬 ANALYZING RAW FIELDS FROM DATABASE:");
          (res.data?.form?.fields || []).forEach((field, index) => {
            console.log(`   RAW Field ${index + 1} (${field.type}):`);
            console.log(`      visible: ${field.visible} (type: ${typeof field.visible})`);
            console.log(`      required: ${field.required} (type: ${typeof field.required})`);
            console.log(`      Full field:`, field);
          });
          
          // Process fields EXACTLY as stored in database - don't modify visible states
          let fields = (res.data?.form?.fields || []).map((field, index) => {
            console.log(`🔧 PROCESSING Field ${index + 1} (${field.type}):`);
            console.log(`   Before: visible=${field.visible}, required=${field.required}`);
            
            const processedField = {
            ...field,
              // Handle undefined values but preserve explicit false values
              visible: field.visible !== undefined ? field.visible : true,
              required: field.required !== undefined ? field.required : false,
              // Special handling for contact fields
              ...(field.type === "contact" && field.firstName && field.lastName ? {
                firstName: {
                  ...field.firstName,
                  visible: field.firstName.visible !== undefined ? field.firstName.visible : true,
                  required: field.firstName.required !== undefined ? field.firstName.required : true
                },
                lastName: {
                  ...field.lastName,
                  visible: field.lastName.visible !== undefined ? field.lastName.visible : true,
                  required: field.lastName.required !== undefined ? field.lastName.required : true
                }
              } : {})
            };
            
            console.log(`   After: visible=${processedField.visible}, required=${processedField.required}`);
            return processedField;
          });

          // 🔥 SIMPLIFIED LEAD CAPTURE: Only ensure contact field exists (which includes all contact info)
          const ensureLeadCaptureFields = (fields) => {
            const existingContactField = fields.find(f => f.type === 'contact');
            
            // If no contact field exists, create one with all contact information
            if (!existingContactField) {
              const generateUniqueId = () => {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                return `contact_${timestamp}_${random}`;
              };

              const contactField = {
                id: generateUniqueId(),
                type: 'contact',
                label: 'Contact Information',
                placeholder: "",
                required: true,
                visible: true,
                isLeadCapture: true,
                firstName: { 
                  visible: true, 
                  required: true,
                  label: getTranslation(landingPageData?.lang, 'firstName') || 'First Name',
                  placeholder: ''
                },
                lastName: { 
                  visible: true, 
                  required: true,
                  label: getTranslation(landingPageData?.lang, 'lastName') || 'Last Name',
                  placeholder: ''
                },
                email: { 
                  visible: true, 
                  required: true,
                  label: getTranslation(landingPageData?.lang, 'email') || 'Email',
                  placeholder: ''
                },
                phone: { 
                  visible: true, 
                  required: false,
                  label: getTranslation(landingPageData?.lang, 'phone') || 'Phone',
                  placeholder: ''
                }
              };

              // Remove any standalone email/phone fields since they're now in contact
              const nonContactFields = fields.filter(f => !['email', 'phone'].includes(f.type));
              return [contactField, ...nonContactFields];
            }

            // If contact field exists, ensure it has all necessary subfields and remove standalone email/phone
            const updatedContactField = {
              ...existingContactField,
              isLeadCapture: true,
              required: true,
              firstName: existingContactField.firstName || { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'firstName') || 'First Name',
                placeholder: ''
              },
              lastName: existingContactField.lastName || { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'lastName') || 'Last Name',
                placeholder: ''
              },
              email: existingContactField.email || { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'email') || 'Email',
                placeholder: ''
              },
              phone: existingContactField.phone ? {
                ...existingContactField.phone
              } : { 
                visible: true, 
                required: false,
                label: getTranslation(landingPageData?.lang, 'phone') || 'Phone',
                placeholder: ''
              }
            };

            // Remove standalone email/phone fields and replace/add the unified contact field
            const otherFields = fields.filter(f => !['contact', 'email', 'phone'].includes(f.type));
            return [updatedContactField, ...otherFields];
          };

          fields = ensureLeadCaptureFields(fields);
          
          console.log("🔧 PROCESSED FIELDS FOR STATE:", fields);
          console.log("🔍 DETAILED FIELD ANALYSIS:");
          fields.forEach((field, index) => {
            console.log(`   Field ${index + 1}: ${field.type} - visible: ${field.visible}, required: ${field.required}, isLeadCapture: ${field.isLeadCapture}`);
            if (field.firstName && field.lastName) {
              console.log(`      First Name: visible: ${field.firstName.visible}, required: ${field.firstName.required}`);
              console.log(`      Last Name: visible: ${field.lastName.visible}, required: ${field.lastName.required}`);
            }
            if (field.email) {
              console.log(`      Email: visible: ${field.email.visible}, required: ${field.email.required}`);
            }
            if (field.phone) {
              console.log(`      Phone: visible: ${field.phone.visible}, required: ${field.phone.required}`);
              console.log(`      Phone field full object:`, field.phone);
            }
          });
          
          // Set both states in correct order
          setLandingPageData(res.data);
          setFormSections(fields);
          
          // Force UI re-render to ensure switches reflect new state
          setForceUpdate(prev => prev + 1);
          
          console.log("✅ BOTH STATES SET - landingPageData and formSections updated");
          console.log("🔄 FORCE UPDATE TRIGGERED - UI should re-render with new data");
        }
      }).catch(err => {
        console.error("Error fetching data:", err);
      });
      PublicService.getLPBrand(lpId).then((res) => {
        // if (res.data?.color) {
        //   changeIndigoShades(generateTailwindPalette(res.data?.color));
        // }
      });
    }
  }, [lpId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    console.log("🔄 Drag end result:", result);
    
    // Only work with draggable sections (non-lead capture)
    const draggableSections = formSections.filter(section => !section.isLeadCapture);
    const leadCaptureSections = formSections.filter(section => section.isLeadCapture);
    
    console.log("📋 Draggable sections:", draggableSections.length);
    console.log("🔒 Lead capture sections:", leadCaptureSections.length);
    
    // Reorder only the draggable sections
    const newDraggableSections = Array.from(draggableSections);
    const [reorderedItem] = newDraggableSections.splice(result.source.index, 1);
    newDraggableSections.splice(result.destination.index, 0, reorderedItem);
    
    // Combine lead capture sections (first) with reordered draggable sections
    const newSections = [...leadCaptureSections, ...newDraggableSections];
    
    console.log("✅ New sections order:", newSections.map(s => `${s.type}(${s.isLeadCapture ? 'lead' : 'regular'})`));
    
    // updateFormData will handle setFormSections - force update for structural changes
    updateFormData(newSections, true);
  };

  const updateFormData = (fields, shouldForceUpdate = false) => {
    console.log("📋 updateFormData with fields:", fields);
    
    // Update formSections state immediately and synchronously
    setFormSections(fields);
    
    // Only force UI update when structure changes (like adding/removing fields)
    if (shouldForceUpdate) {
      setForceUpdate(prev => prev + 1);
    }
    
    // Build complete updated data
    const updatedData = {
      ...landingPageData,
      form: {
        ...landingPageData.form,
        fields, // Use the latest fields
      },
      _id: undefined,
    };
    
    console.log("📤 Auto-saving form changes immediately...");
    console.log("🔍 Fields being auto-saved:", fields);
    console.log("🔄 Force update triggered after formSections update");
    
    // Update landingPageData and trigger immediate autosave
    setLandingPageData(updatedData);
    debouncedSave(updatedData); // Direct autosave call
  };



  // Robust autosave state management
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Direct autosave function that always works
  const performDirectSave = useCallback(async (dataToSave) => {
    if (!lpId || !dataToSave) {
      console.error("Missing lpId or data for save");
      return false;
    }

    setIsSaving(true);
    console.log("🔄 Starting direct save...");
    console.log("📤 COMPLETE DATA BEING SAVED:", dataToSave);
    console.log("📤 FORM FIELDS BEING SAVED:", dataToSave?.form?.fields);
    console.log("🔍 DETAILED SAVE ANALYSIS:");
    dataToSave?.form?.fields?.forEach((field, index) => {
      console.log(`   Saving Field ${index + 1}: ${field.type}`);
      console.log(`      visible: ${field.visible} (type: ${typeof field.visible})`);
      console.log(`      required: ${field.required} (type: ${typeof field.required})`);
      console.log(`      Full field being saved:`, field);
      if (field.firstName && field.lastName) {
        console.log(`      Saving First Name: visible: ${field.firstName.visible} (type: ${typeof field.firstName.visible}), required: ${field.firstName.required} (type: ${typeof field.firstName.required})`);
        console.log(`      Saving Last Name: visible: ${field.lastName.visible} (type: ${typeof field.lastName.visible}), required: ${field.lastName.required} (type: ${typeof field.lastName.required})`);
      }
    });
    
    try {
      const cleanedData = {
        ...dataToSave,
        _id: undefined
      };
      
      console.log("📡 SENDING TO DATABASE:", cleanedData);
      const response = await CrudService.update("LandingPageData", lpId, cleanedData);
      console.log("✅ Direct save successful", response);
      setLastSaved(new Date().toLocaleTimeString());
      
      // 🔥 FIX: Update landingPageData with the response to get the latest updatedAt timestamp
      if (response?.data) {
        setLandingPageData(response.data);
        console.log("📅 Updated landingPageData with latest timestamp:", response.data.updatedAt);
      }
      
      return true;
    } catch (error) {
      console.error("❌ Direct save failed:", error);
      message.error("Failed to save changes: " + (error.message || "Unknown error"));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [lpId]);

  // Debounced autosave function - reduced delay for better UX
  const debouncedSave = useCallback((dataToSave) => {
    console.log("🕒 Debounced save triggered");
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for save - reduced to 500ms for more responsive feel
    saveTimeoutRef.current = setTimeout(() => {
      performDirectSave(dataToSave);
    }, 500); // 500ms delay for snappier autosave
  }, [performDirectSave]);



  // Clean up timeouts on unmount and handle page unload
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      // Show warning if there are pending changes
      if (saveTimeoutRef.current) {
        e.preventDefault();
        console.log("⚠️ Page unload detected with pending auto-save...");
        return "You have unsaved changes that are being auto-saved. Are you sure you want to leave?";
      }
    };

    const handleUnload = async () => {
      // Final attempt to clear any pending saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      // Clean up
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  const handleAddSection = (type) => {
    console.log("type", type);

    // Generate unique ID for each field instead of using type
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `${type}_${timestamp}_${random}`;
    };

    // 🔒 LEAD CAPTURE PROTECTION: Prevent adding duplicate lead capture fields
    // If trying to add email/phone but contact field exists, prevent it
    if (type === "email" || type === "phone") {
      const contactExists = formSections.find((section) => section.type === "contact");
      if (contactExists) {
        message.error(`${type === 'email' ? 'Email' : 'Phone'} field is already included in the Contact Information section`);
        return;
      }
    }
    
    // If trying to add contact but email/phone exists, prevent it
    if (type === "contact") {
      const emailExists = formSections.find((section) => section.type === "email");
      const phoneExists = formSections.find((section) => section.type === "phone");
      if (emailExists || phoneExists) {
        message.error("Contact Information field cannot be added when separate Email or Phone fields exist. Please remove them first.");
        return;
      }
    }
    
    const leadCaptureTypes = ["email", "contact", "phone"];
    if (leadCaptureTypes.includes(type)) {
      const typeExist = formSections.find((section) => section.type === type);
      if (typeExist) {
        message.error(`${formItems.find((item) => item.type === type)?.text || type} field already exists as a lead capture field`);
        return;
      }
    }

    const newSection = {
      id: generateUniqueId(),
      type,
      label: formItems.find((item) => item.type === type)?.text || "",
      placeholder: "",
      required: leadCaptureTypes.includes(type) ? true : false,
      visible: true, // default visible
      isLeadCapture: leadCaptureTypes.includes(type), // Mark lead capture fields as non-removable
      ...(type === "multichoice"
        ? { options: [{ text: "Option 1", isNegative: false }] }
        : {}),
      ...(type === "number" ? { min: 0, max: 100 } : {}),
      ...(type === "contact"
        ? {
            firstName: { visible: true, required: true },
            lastName: { visible: true, required: true },
          }
        : {}),
    };

    // For lead capture fields, insert at the beginning (after other lead capture fields)
    // For other fields, append at the end
    let updatedSections;
    if (leadCaptureTypes.includes(type)) {
      const leadCaptureFields = formSections.filter(s => s.isLeadCapture);
      const otherFields = formSections.filter(s => !s.isLeadCapture);
      updatedSections = [...leadCaptureFields, newSection, ...otherFields];
    } else {
      updatedSections = [...formSections, newSection];
    }

    // updateFormData will handle setFormSections - force update for adding fields
    updateFormData(updatedSections, true);
    setQuestionModal(false);
  };

  const handleRemoveSection = (sectionId) => {
    // 🔒 LEAD CAPTURE PROTECTION: Prevent removal of lead capture fields
    const sectionToRemove = formSections.find(section => section.id === sectionId);
    
    if (sectionToRemove?.isLeadCapture) {
      message.error("Lead capture fields (Name, Email, Phone) cannot be removed. They are essential for collecting contact information.");
      return;
    }

    const updatedSections = formSections.filter(
      (section) => section.id !== sectionId
    );
    // updateFormData will handle setFormSections - force update for removing fields
    updateFormData(updatedSections, true);
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
      setIsEditingForm(true);
    }
  };

  const handleUpdateSection = (sectionId, updates) => {
    console.log("🔄 AUTO-SAVE TRIGGER - Section:", sectionId, "Updates:", updates);
    
    // Find the current section for debugging
    const currentSection = formSections.find(s => s.id === sectionId);
    console.log("🔍 BEFORE UPDATE - Section state:", currentSection);
    
    const updatedSections = formSections.map((section) => {
      if (section.id !== sectionId) return section;
      
      let updatedSection = { ...section, ...updates };
      
      // If updating visible and setting to false, also set required to false
      if (updates.hasOwnProperty('visible') && updates.visible === false) {
        updatedSection.required = false;
        console.log("⚠️ Auto-setting required to false because visible is false");
      }
      
      // Special handling for contact section subfields
      if (updates.firstName && updates.firstName.visible === false) {
        updatedSection.firstName = { ...section.firstName, ...updates.firstName, required: false };
        console.log("⚠️ Auto-setting firstName required to false because visible is false");
      }
      if (updates.lastName && updates.lastName.visible === false) {
        updatedSection.lastName = { ...section.lastName, ...updates.lastName, required: false };
        console.log("⚠️ Auto-setting lastName required to false because visible is false");
      }
      
      console.log("🔍 AFTER UPDATE - Section state:", updatedSection);
      return updatedSection;
    });

    // 🔥 SPECIAL HANDLING: When updating email/phone properties from contact editor,
    // also update the separate email/phone fields
    if (currentSection && currentSection.type === 'contact') {
      console.log("🔍 SYNC DEBUG - Contact section updates:", updates);
      
      if (updates.email) {
        console.log("🔄 Contact editor updated email properties, syncing to separate email field");
        console.log("🔍 Looking for email field in sections:", updatedSections.map(s => ({id: s.id, type: s.type, isLeadCapture: s.isLeadCapture})));
        
        const emailField = updatedSections.find(s => s.type === 'email' && s.isLeadCapture);
        console.log("🔍 Found email field:", emailField);
        
        if (emailField) {
          const emailFieldIndex = updatedSections.findIndex(s => s.id === emailField.id);
          console.log("🔍 Email field index:", emailFieldIndex);
          
          updatedSections[emailFieldIndex] = {
            ...emailField,
            label: updates.email.label || emailField.label,
            placeholder: updates.email.placeholder || emailField.placeholder
          };
          console.log("✅ Updated separate email field:", updatedSections[emailFieldIndex]);
        } else {
          console.log("❌ No email field found!");
        }
      }
      
      if (updates.phone) {
        console.log("🔄 Contact editor updated phone properties, syncing to separate phone field");
        console.log("🔍 Looking for phone field in sections:", updatedSections.map(s => ({id: s.id, type: s.type, isLeadCapture: s.isLeadCapture})));
        
        const phoneField = updatedSections.find(s => s.type === 'phone' && s.isLeadCapture);
        console.log("🔍 Found phone field:", phoneField);
        
        if (phoneField) {
          const phoneFieldIndex = updatedSections.findIndex(s => s.id === phoneField.id);
          console.log("🔍 Phone field index:", phoneFieldIndex);
          
          updatedSections[phoneFieldIndex] = {
            ...phoneField,
            label: updates.phone.label || phoneField.label,
            placeholder: updates.phone.placeholder || phoneField.placeholder
          };
          console.log("✅ Updated separate phone field:", updatedSections[phoneFieldIndex]);
        } else {
          console.log("❌ No phone field found!");
        }
      }
    } else {
      console.log("🔍 SYNC DEBUG - Not a contact section, currentSection:", currentSection?.type);
    }
    
    console.log("📊 ALL UPDATED SECTIONS:", updatedSections);
    console.log("💾 AUTO-SAVING CHANGES IMMEDIATELY");
    
    // Trigger immediate autosave - no force update for property changes
    updateFormData(updatedSections, false);

    // Update the selectedSection state
    if (selectedSection && selectedSection.id === sectionId) {
      setSelectedSection({ ...selectedSection, ...updates });
    }
  };

  const handleFieldUpdate = (updatedField) => {
    const updatedSections = formSections.map((section) =>
      section.id === updatedField.id ? updatedField : section
    );
    // updateFormData will handle setFormSections - no force update for field value changes
    updateFormData(updatedSections, false);
  };

  // Handle AI-generated form data with auto-save
  const handleAIFormGenerated = (aiData) => {
    console.log("🤖 AI Form Generated:", aiData);
    
    const { form, metadata } = aiData;
    
    // Update form title and description if provided
    const updatedLandingPageData = {
      ...landingPageData,
      form: {
        ...landingPageData.form,
        title: form.title || landingPageData.form?.title,
        description: form.description || landingPageData.form?.description,
        submitText: form.submitText || landingPageData.form?.submitText
      }
    };
    
    // Set the AI-generated form fields
    const aiFormFields = form.fields || [];
    console.log("🤖 Auto-saving AI-generated fields:", aiFormFields);
    
    // Update both landing page data and form sections with auto-save
    setLandingPageData(updatedLandingPageData);
    updateFormData(aiFormFields, true); // Force update for AI-generated fields
    
    // Show success message
    message.success(`AI generated ${aiFormFields.length} form fields and auto-saved them!`);
    
    // Force UI update
    setForceUpdate(prev => prev + 1);
  };

  const renderFieldEditor = () => {
    if (!selectedSection) return null;

    // Find the current section from formSections
    const currentSection = formSections.find(
      (section) => section.id === selectedSection.id
    );

    if (!currentSection) return null;

    // Handle contact fields with clean vertical layout
    if (currentSection.type === "contact") {
      return (
        <Form layout="vertical" className="space-y-4">
          <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">Field Label</span>}>
            <Input
              value={currentSection.label}
              onChange={(e) =>
                handleUpdateSection(currentSection.id, { label: e.target.value })
              }
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">Placeholder</span>}>
            <Input
              value={currentSection.placeholder}
              onChange={(e) =>
                handleUpdateSection(currentSection.id, {
                  placeholder: e.target.value,
                })
              }
              className="rounded-lg"
            />
          </Form.Item>

          {/* Core contact fields with borders and separation */}
          {[
            { key: 'firstName', label: 'First Name', required: true },
            { key: 'lastName', label: 'Last Name', required: true },
            { key: 'email', label: 'Email', required: true },
            { key: 'phone', label: 'Phone Number', required: false }
          ].map((contactField) => (
            <div key={contactField.key} className="p-4 border border-gray-200 rounded-lg bg-gray-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px] text-[#475647]">{contactField.label} Field</span>
                {contactField.required && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px]">Required</span>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1">Label</label>
                  <Input
                    value={currentSection[contactField.key]?.label || contactField.label}
                    onChange={(e) => {
                      handleUpdateSection(currentSection.id, {
                        [contactField.key]: {
                          ...currentSection[contactField.key],
                          label: e.target.value
                        }
                      });
                    }}
                    className="rounded-lg"
                    placeholder={contactField.label}
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1">Placeholder</label>
                  <Input
                    value={currentSection[contactField.key]?.placeholder || ''}
                    onChange={(e) => {
                      handleUpdateSection(currentSection.id, {
                        [contactField.key]: {
                          ...currentSection[contactField.key],
                          placeholder: e.target.value
                        }
                      });
                    }}
                    className="rounded-lg"
                    placeholder={`${contactField.label.toLowerCase()}`}
                  />
                </div>

              </div>
            </div>
          ))}

          {/* Additional contact fields with borders */}
          {currentSection.additionalFields?.map((field, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-[#475647]">{field.label} Field</span>
                <Button
                  size="small"
                  onClick={() => {
                    const newAdditionalFields = (currentSection.additionalFields || []).filter((_, i) => i !== index);
                    handleUpdateSection(currentSection.id, {
                      additionalFields: newAdditionalFields,
                      [field.key]: undefined
                    });
                  }}
                  className="p-0 bg-transparent border-none shadow-none text-red-500 hover:text-red-700"
                  type="text"
                >
                  <img
                    src="/images2/img_trash_01_red_700.svg"
                    alt="remove"
                    className="h-[16px] w-[16px]"
                  />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1">Label</label>
                  <Input
                    value={field.label}
                    onChange={(e) => {
                      const newAdditionalFields = [...(currentSection.additionalFields || [])];
                      newAdditionalFields[index] = { ...field, label: e.target.value };
                      handleUpdateSection(currentSection.id, {
                        additionalFields: newAdditionalFields,
                        [field.key]: { ...currentSection[field.key], label: e.target.value }
                      });
                    }}
                    className="rounded-lg"
                    placeholder="Field label"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] text-gray-600 mb-1">Placeholder</label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => {
                      const newAdditionalFields = [...(currentSection.additionalFields || [])];
                      newAdditionalFields[index] = { ...field, placeholder: e.target.value };
                      handleUpdateSection(currentSection.id, {
                        additionalFields: newAdditionalFields,
                        [field.key]: { ...currentSection[field.key], placeholder: e.target.value }
                      });
                    }}
                    className="rounded-lg"
                    placeholder="Placeholder text"
                  />
                </div>

              </div>
            </div>
          ))}
          
          <Button
            size="large"
            onClick={() => {
              // Generate a unique key for the new field
              const timestamp = Date.now();
              const randomId = Math.random().toString(36).substr(2, 5);
              const newFieldKey = `custom_${timestamp}_${randomId}`;
              
              const newField = {
                key: newFieldKey,
                label: 'Custom Field',
                placeholder: 'Enter value'
              };
              
              const newAdditionalFields = [
                ...(currentSection.additionalFields || []),
                newField
              ];
              
              handleUpdateSection(currentSection.id, {
                additionalFields: newAdditionalFields,
                [newFieldKey]: {
                  visible: true,
                  required: false,
                  label: 'Custom Field',
                  placeholder: 'Enter value'
                }
              });
            }}
            className="mt-4 w-full text-[14px] text-[#475647] font-bold border-dashed"
            disabled={(currentSection.additionalFields || []).length >= 10}
            type="dashed"
          >
            <PlusOutlined /> Add Custom Field
          </Button>
        </Form>
      );
    }

    // Default field editor for all other field types
    return (
      <Form layout="vertical" className="space-y-4">
        {/* Visible/Required Settings at top right */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <span className="font-bold text-[14px] text-[#475647]">Field Settings</span>
          </div>
          <div className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                checked={currentSection.visible !== false}
                onChange={(checked) => {
                  handleUpdateSection(currentSection.id, {
                    visible: checked
                  });
                }}
              />
              <span className="text-sm text-gray-700">Visible</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={currentSection.required || false}
                onChange={(checked) => {
                  handleUpdateSection(currentSection.id, {
                    required: checked
                  });
                }}
              />
              <span className="text-sm text-gray-700">Required</span>
            </div>
          </div>
        </div>

        <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">Label</span>}>
          <Input
            value={currentSection.label}
            onChange={(e) =>
              handleUpdateSection(currentSection.id, { label: e.target.value })
            }
            className="rounded-lg"
          />
        </Form.Item>

        {/* <Form.Item label="Placeholder"> */}
      <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">
        Placeholder
      </span>}>

          <Input
            value={currentSection.placeholder}
            onChange={(e) =>
              handleUpdateSection(currentSection.id, {
                placeholder: e.target.value,
              })
            }
            className="rounded-lg"
          />
        </Form.Item>

        {currentSection.type === "number" && (
          <div className="flex gap-4">
            <Form.Item label="Min Value" className="flex-1">
              <Input
                type="number"
                value={currentSection.min}
                onChange={(e) =>
                  handleUpdateSection(currentSection.id, {
                    min: e.target.value,
                  })
                }
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item label="Max Value" className="flex-1">
              <Input
                type="number"
                value={currentSection.max}
                placeholder="Enter Answers"
                onChange={(e) =>
                  handleUpdateSection(currentSection.id, {
                    max: e.target.value,
                  })
                }
                className="rounded-lg"
              />
            </Form.Item>
          </div>
        )}

        {/* Multichoice, Dropdown, Multiselect Option Editors */}
        {(currentSection.type === "multichoice" || currentSection.type === "dropdown" || currentSection.type === "multiselect") && (
          <Form.Item label={<span className="font-bold text-[16px] text-[#475647]">Options</span>}>
            <div className="space-y-2">
              {currentSection.options?.map((option, index) => (
                <div key={index} className="relative flex items-center w-full mb-2">
                  <Input
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...currentSection.options];
                      newOptions[index] = { ...option, text: e.target.value };
                      handleUpdateSection(currentSection.id, {
                        options: newOptions,
                      });
                    }}
                    className="rounded-lg  w-full mt-2"
                    placeholder="Enter Option"
                  />
                  <Button
                    size="xl"
                    onClick={() => {
                      const newOptions = currentSection.options.filter(
                        (_, i) => i !== index
                      );
                      handleUpdateSection(currentSection.id, {
                        options: newOptions,
                      });
                    }}
                    className="!absolute right-2 top-1/2 -translate-y-1/2 p-0  bg-transparent border-none shadow-none"
                    style={{ lineHeight: 0, minWidth: 0 }}
                    type="text"
                  >
                    <img
                      src="/images2/img_trash_01_red_700.svg"
                      alt="trash-01"
                      className="h-[20px] w-[20px] cursor-pointer mt-2"
                    />
                  </Button>
                </div>
              ))}
              <Button
                size="xl"
                onClick={() => {
                  const newOptions = [
                    ...(currentSection.options || []),
                    { text: "", isNegative: false },
                  ];
                  handleUpdateSection(currentSection.id, {
                    options: newOptions,
                  });
                }}
                className="mt-2 text-[14px] text-[#475647] font-bold"
              >
                <PlusOutlined /> Add More
              </Button>
            </div>
          </Form.Item>
        )}



   
        {/* Date Field Editor */}
        {currentSection.type === "date" && (
          <div className="flex gap-4">
            <Form.Item label="Date Format" className="flex-1">
              <select
                value={currentSection.dateFormat || "MMDDYYYY"}
                onChange={e => handleUpdateSection(currentSection.id, { dateFormat: e.target.value })}
                className="rounded-lg w-full border pl-2 py-1"
              >
                <option value="MMDDYYYY">MM/DD/YYYY</option>
                <option value="DDMMYYYY">DD/MM/YYYY</option>
                <option value="YYYYMMDD">YYYY/MM/DD</option>
                
              </select>
            </Form.Item>
            <Form.Item label="Separator" className="flex-1">
              <select
                value={currentSection.dateSeparator || "/"}
                onChange={e => handleUpdateSection(currentSection.id, { dateSeparator: e.target.value })}
                className="rounded-lg w-16 border pl-4 py-1"
              >
                <option value="/">/</option>
                <option value="-">-</option>
                <option value=".">.</option>
              </select>
            </Form.Item>
          </div>
        )}


      </Form>
    );
  };

  if (!landingPageData) return <Skeleton active />;     

  return (
    <>
      {/* 🎨 APPLY CUSTOM FONTS */}
      <ApplyCustomFont landingPageData={{
        ...landingPageData,
        titleFont: userBrandData?.titleFont || user?.titleFont,
        bodyFont: userBrandData?.bodyFont || user?.bodyFont,
        subheaderFont: userBrandData?.subheaderFont || user?.subheaderFont,
      }} />
      
      <div className="h-screen overflow-hidden">
        <div className="w-full bg-gray-50_01 h-full flex flex-col">
        <div className="flex flex-col pt-6 smx:pt-5 h-full">
          <Header
            className="p-[20px] mdx:w-full mdx:p-5"
            landingPageData={landingPageData}
            isAutoSaving={isSaving}
            lastSaved={lastSaved}
            isFormEditor={true}
            lpId={lpId}
            setPublished={async (e) => {
              console.log("🚀 Publishing changes...");
              
              try {
                // Build complete current state with all form sections
                const currentCompleteState = {
                  ...landingPageData,
                  form: {
                    ...landingPageData.form,
                    fields: formSections,
                  },
                  published: e,
                  _id: undefined
                };
                
                console.log("📤 Publishing with auto-saved state:", currentCompleteState);
                
                await CrudService.update("LandingPageData", lpId, currentCompleteState);
                
                setLandingPageData((d) => ({
                  ...d,
                  published: e,
                }));
                
                if (e) {
                  message.success("✅ Funnel published successfully! All changes are auto-saved.");
                } else {
                  message.success("✅ Funnel unpublished successfully!");
                }
              } catch (error) {
                console.error("❌ Failed to update published status:", error);
                message.error("Failed to update published status: " + (error.message || "Unknown error"));
              }
            }}
            setLandingPageData={setLandingPageData}
            reload={fetchData}
          />
          <div className="flex-1 flex flex-col smx:pb-5 overflow-hidden main-container">
            <div className="flex gap-2 smx:gap-1 md:gap-4 justify-center items-start p-2 smx:p-1 md:p-3 container-sm h-full">
                              <div className="w-full h-full">
                  <div className="flex rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 h-full overflow-hidden">
                                      {/* Left Sidebar */}
                    <div className="flex flex-col border-r border-solid border-blue_gray-50 pl-2 py-[10px] w-[100px] smx:w-[60px] md:w-[100px] group sidebar-transition h-full overflow-hidden" 
                      style={{ transition: 'width 0.3s' }}
                      onMouseEnter={e => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.width = '140px'
                        }
                      }}
                      onMouseLeave={e => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.width = '100px'
                        }
                      }}
                    >
                                          <div className="flex flex-col items-center gap-[10px] w-full h-full">
                      <Heading
                        size="5xl"
                        as="h3"
                        className="!text-black-900_01 group-hover:!text-lg text-xs smx:text-[10px] md:text-sm text-center"
                      >
                        <span className="hidden md:inline">Questions</span>
                        <span className="md:hidden">Q</span>
                      </Heading>
                      
                      <BeautifulDragDropContext onDragEnd={handleDragEnd}>
                        <BeautifulDroppable droppableId="sections">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="w-full flex flex-col gap-2 flex-1 p-1"
                            >
                              {/* Header (not draggable) */}
                              <div
                                className="w-full flex items-center p-2 rounded-lg cursor-pointer relative sidebar-item group hover:bg-gray-50"
                                onClick={() => {
                                  setSelectedSection({ id: 'flexaligntop', type: 'header' });
                                  setIsEditingForm(true);
                                }}
                              >
                                <div className="flex-1 flex items-center justify-start transition-all pr-2" style={{width: '140px'}}>
                                  <div className="bg-gray-100 rounded-full p-1">
                                    <img src="/images/img_flex_align_top.svg" alt="flexaligntop" className="w-5 h-5" />
                                  </div>
                                </div>
                              </div>
                              {/* Lead Capture Group - Consistent with other items */}
                              {formSections.some(s => s.isLeadCapture) && (
                                <Tooltip 
                                  title="Contact Information - Essential lead capture fields (Name, Email, Phone)"
                                  placement="right"
                                  mouseEnterDelay={0.3}
                                >
                                  <div
                                    className={`w-full flex items-center p-2 rounded-lg cursor-pointer relative sidebar-item group ${
                                      selectedSection?.isLeadCapture && !isEditingForm
                                        ? "bg-gray-50" 
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => {
                                      // Select the first lead capture field for editing
                                      const firstLeadCaptureField = formSections.find(s => s.isLeadCapture);
                                      setSelectedSection(firstLeadCaptureField);
                                      setIsEditingForm(false);
                                    }}
                                  >
                                  <div className="flex-1 flex items-center justify-start transition-all pr-2" style={{width: '140px'}}>
                                    <div className={`rounded-full p-1 ${
                                      selectedSection?.isLeadCapture && !isEditingForm
                                        ? "bg-[#5207CD]"
                                        : "bg-gray-100"
                                    }`}>
                                      <img
                                        src="/icons/user-square.svg"
                                        alt="Lead Capture icon"
                                        className={`w-5 h-5 transition-all duration-200 ease-in-out ${
                                          selectedSection?.isLeadCapture && !isEditingForm
                                            ? "brightness-0 invert"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-[0.9rem] items-center transition-all duration-300 absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                                    <div
                                      className="py-1 rounded text-xs cursor-not-allowed select-none"
                                      onClick={e => e.stopPropagation()}
                                      title="Lead capture fields cannot be reordered"
                                    >
                                      <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                  </div>
                                </Tooltip>
                              )}
                              
                              {/* Regular form sections (non-lead capture) */}
                              {formSections.filter(section => !section.isLeadCapture).map((section, index) => (
                                <BeautifulDraggable
                                  key={section.id}
                                  draggableId={section.id}
                                  index={index} // Simple sequential index for draggable items only
                                >
                                  {(provided, snapshot) => {
                                    const isActive = selectedSection?.id === section.id;
                                    const isDragging = snapshot.isDragging;
                                    
                                    const tooltips = {
                                      'text': 'Text Field - Short text input',
                                      'longtext': 'Textarea - Long text input',
                                      'motivation': 'Motivation Letter - Multi-line text for motivation',
                                      'number': 'Number Field - Numeric input with min/max',
                                      'date': 'Date Field - Date picker input',
                                      'email': 'Email Field - Email address input',
                                      'phone': 'Phone Field - Phone number input',
                                      'address': 'Address Field - Location/address input',
                                      'file': 'File Upload - Document/image upload',
                                      'multichoice': 'Multiple Choice - Radio buttons',
                                      'dropdown': 'Dropdown - Select from list',
                                      'multiselect': 'Multi-Select - Multiple checkboxes',
                                      'yesno': 'Yes/No Question - Boolean choice',
                                      'boolean': 'Boolean Field - True/false toggle',
                                      'website': 'Website Field - URL input',
                                      'contact': 'Contact Information - Name, email, phone fields'
                                    };
                                    
                                    return (
                                      <Tooltip 
                                        title={tooltips[section.type] || `${section.type} field`}
                                        placement="right"
                                        mouseEnterDelay={0.3}
                                        open={isDragging ? false : undefined} // Hide tooltip when dragging
                                      >
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                            opacity: 1,
                                            width: '140px', // Match sidebar width
                                            ...(isDragging
                                              ? {
                                                  padding: "8px",
                                                  background: "#f5faff",
                                                  borderRadius: "8px",
                                                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                                                  zIndex: 9999,
                                                  height: "auto !important",
                                                  minWidth: "40px",
                                                  minHeight: "40px",
                                                  overflow: "visible",
                                                  border: "1.5px solid #e0e7ef",
                                                }
                                              : {}),
                                          }}
                                          className={`w-full flex items-center p-2 rounded-lg cursor-pointer relative sidebar-item group${isDragging ? " dragging" : ""} ${
                                            isActive 
                                              ? "bg-gray-50" 
                                              : "hover:bg-gray-50"
                                          }`}
                                          onClick={() => {
                                            console.log('🖱️ Editor click: Selecting section from sidebar:', section?.label || section?.id);
                                            previewNavigatingRef.current = false; // Editor is driving navigation
                                            setSelectedSection(section);
                                            setIsEditingForm(false);
                                          }}
                                        >
                                        {/* Icon area only, no label */}
                                        <div className="flex-1 flex items-center justify-start group-hover:justify-start transition-all pr-2" style={{width: '140px'}}>
                                          <div className={isActive ? "bg-[#5207CD] rounded-full p-1" : "bg-gray-100 rounded-full p-1"}>
                                            <img
                                              src={
                                                formItems.find(item => item.type === section.type)?.icon
                                                  ? `/icons/${formItems.find(item => item.type === section.type)?.icon}`
                                                  : "/images/default-icon.svg"
                                              }
                                              alt={`${section.type} icon`}
                                              className={`w-5 h-5 transition-all duration-200 ease-in-out ${isActive ? "brightness-0 invert" : ""}`}
                                            />
                                          </div>
                                        </div>
                                        {/* Action buttons area */}
                                        <div className={`flex gap-[0.9rem] items-center transition-all duration-300 absolute right-5 top-1/2 -translate-y-1/2 ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                          {section.isLeadCapture ? (
                                            // Lead capture: Show lock icon instead of drag handle
                                            <div
                                              className="py-1 rounded text-xs cursor-not-allowed select-none"
                                              onClick={e => e.stopPropagation()}
                                              title="Lead capture fields cannot be reordered"
                                            >
                                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          ) : (
                                            // Regular fields: Show drag handle
                                            <div
                                              {...provided.dragHandleProps}
                                              className="py-1 rounded text-xs cursor-grab select-none"
                                              onClick={e => e.stopPropagation()}
                                              tabIndex={0}
                                              role="button"
                                              style={{ userSelect: 'none' }}
                                            >
                                              <FaGripVertical className="text-gray-600" />
                                            </div>
                                          )}
                                          <button
                                            onClick={e => {
                                              e.stopPropagation();
                                              handleRemoveSection(section.id);
                                            }}
                                            className={`px-2 py-1 rounded text-xs ${
                                              section.isLeadCapture 
                                                ? "cursor-not-allowed opacity-50" 
                                                : "hover:bg-red-200 cursor-pointer"
                                            }`}
                                            title={section.isLeadCapture ? "Lead capture fields cannot be removed" : "Remove field"}
                                            disabled={section.isLeadCapture}
                                          >
                                            <img
                                              src="/images2/img_trash_01_red_700.svg"
                                              alt="trash-01"
                                              className={`h-[20px] w-[20px] ${section.isLeadCapture ? "opacity-50" : ""}`}
                                            />
                                          </button>
                                        </div>
                                        </div>
                                      </Tooltip>
                                    );
                                  }}
                                </BeautifulDraggable>
                              ))}
                              {provided.placeholder}
                              
                              {/* Add Button - Consistent with other items */}
                              <Tooltip 
                                title="Add new field"
                                placement="right"
                                mouseEnterDelay={0.3}
                              >
                                <div
                                  className="w-full flex items-center p-2 rounded-lg cursor-pointer relative sidebar-item group hover:bg-gray-50"
                                  onClick={() => setQuestionModal(true)}
                                >
                                <div className="flex-1 flex items-center justify-start transition-all pr-2" style={{width: '140px'}}>
                                  <div className="bg-gray-100 rounded-full p-1 group-hover:bg-purple-100 transition-colors">
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </div>
                                </div>
                                </div>
                              </Tooltip>
                              
                              {/* Footer (not draggable) */}
                            
                            </div>
                          )}
                        </BeautifulDroppable>
                      </BeautifulDragDropContext>
                    </div>
                  </div>

                  {/* Middle Section - Form Builder */}
                  <div className="flex flex-col gap-3 border-r border-solid border-blue_gray-50 p-4 smx:p-3 md:p-8 justify-between flex-1 md:w-[560px] md:flex-none h-full overflow-hidden form-builder-container">
                    <div className="flex flex-col gap-[30px] flex-1 overflow-auto">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 smx:w-6 smx:h-6 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              <svg className="w-4 h-4 smx:w-3 smx:h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                        <Heading
                          size="7xl"
                          as="h4"
                                className="!text-gray-900 !font-bold !text-lg smx:!text-base md:!text-2xl"
                        >
                          {isEditingForm
                                  ? "Application Form Builder"
                                  : `Configure ${selectedSection?.label || "Field"}`}
                        </Heading>
                              <p className="text-xs smx:text-[10px] md:text-sm text-gray-600 mt-1">
                                {isEditingForm 
                                  ? "Design the perfect application experience for your candidates"
                                  : "Customize field settings and validation rules"
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        
                      </div>

                      {isEditingForm ? (
                        <>
                    

                          {/* Form Title and Description with Custom Autosave */}
                          <div className="space-y-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Form Title
                              </label>
                              <Input
                                value={landingPageData?.form?.title || ""}
                                onChange={(e) => {
                                  const updatedData = {
                                    ...landingPageData,
                                    form: { 
                                      ...landingPageData?.form, 
                                      title: e.target.value.slice(0, 100) 
                                    }
                                  };
                                  setLandingPageData(updatedData);
                                  debouncedSave(updatedData);
                                }}
                                placeholder="e.g., Let's get started"
                                maxLength={100}
                                className="w-full"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {(landingPageData?.form?.title || "").length}/100
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Form Description
                              </label>
                              <Input.TextArea
                                value={landingPageData?.form?.description || ""}
                                onChange={(e) => {
                                  const updatedData = {
                                    ...landingPageData,
                                    form: { 
                                      ...landingPageData?.form, 
                                      description: e.target.value.slice(0, 150) 
                                    }
                                  };
                                  setLandingPageData(updatedData);
                                  debouncedSave(updatedData);
                                }}
                                placeholder="e.g., We'll ask you a few questions to learn more about you."
                                maxLength={150}
                                rows={3}
                                className="w-full"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {(landingPageData?.form?.description || "").length}/150
                              </div>
                            </div>
                                                     </div>
                          {/* Form Fields */}
                          <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
                                <p className="text-sm text-gray-500">Configure your form fields</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setQuestionModal(true)}
                                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                  ➕ Add Field
                                </button>
                                <button
                                  onClick={() => setAiFormModalVisible(true)}
                                  className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform shadow-md"
                                  style={{
                                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                  }}
                                >
                                  ⚡ {formSections.length > 0 ? "Regenerate with AI" : "Generate with AI"}
                                </button>
                              </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50/50 rounded-lg mb-3">
                              <div className="text-sm font-medium text-gray-600">{getTranslation(landingPageData?.lang, 'formFields')}</div>
                            </div>
                            
                         
                            {/* Simplified Form Creation - No AI options */}
                            {formSections.length === 0 && (
                              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="max-w-md mx-auto">
                                  <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    Ready to build your form?
                                  </h3>
                                  <p className="text-gray-600 mb-6 leading-relaxed">
                                    Let AI create the perfect application form based on your job requirements. 
                                    We'll automatically generate relevant questions and organize them in a logical flow.
                                  </p>
                                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                      onClick={() => setAiFormModalVisible(true)}
                                      className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                      style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                      }}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      Generate with AI
                                    </button>
                                    <button
                                      onClick={() => setQuestionModal(true)}
                                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                      </svg>
                                      Add Manually
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                                        {/* Contact Information */}
            {formSections.some(s => s.isLeadCapture) && (
              <Tooltip title="Configure contact information fields (First Name, Last Name, Email, Phone)" placement="right">
                <div className="flex items-center gap-3 p-4 rounded-lg mb-3 bg-blue-50/30 border border-blue-100 cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => {
                    const firstLeadCaptureField = formSections.find(s => s.isLeadCapture);
                    setSelectedSection(firstLeadCaptureField);
                    setIsEditingForm(false);
                  }}
                >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">
                                  👤
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-sm">{getTranslation(landingPageData?.lang, 'contactInformation')}</div>
                                  <div className="text-xs text-gray-500">{getTranslation(landingPageData?.lang, 'firstName')}, {getTranslation(landingPageData?.lang, 'email')}, {getTranslation(landingPageData?.lang, 'phone')} • {getTranslation(landingPageData?.lang, 'required')} • {getTranslation(landingPageData?.lang, 'clickToConfigure')}</div>
                                </div>
                                                  <div className="text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Tooltip>
            )}
                            
                            {/* Regular fields (non-lead capture) */}
                            {formSections.filter(section => !section.isLeadCapture).map((section, sectionIndex) => {
                              const formItem = formItems.find(item => item.type === section.type);
                              const actualIndex = formSections.findIndex(f => f.id === section.id);
                              const baseKey = section.id; // Stable key to prevent unnecessary re-mounting
                              
                              console.log(`🔍 RENDERING SWITCH - Section: ${section.type}, visible: ${section.visible}, required: ${section.required}`);
                              
                              if (section.type === "contact") {
                                return (
                                  <React.Fragment key={baseKey}>
                                  <div 
                                    key={`${baseKey}-firstName`} 
                                    className={`grid grid-cols-3 gap-4 items-center p-3 rounded-lg mb-2 transition-all duration-200 ${
                                      selectedSection?.id === section.id
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200' 
                                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                                        {section.isLeadCapture && (
                                          <svg className="w-3 h-3 text-blue-600 absolute -top-1 -right-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                        <span className="text-lg">👤</span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-900">First Name</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Contact field
                                          {section.isLeadCapture && " • Required for all forms"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-center">
                                      <div className="text-green-500 text-lg">✅</div>
                                    </div>
                                    <div className="flex justify-center">
                                      <div className="text-amber-500 text-lg">⚠️</div>
                                    </div>
                                  </div>,
                                  <div 
                                    key={`${baseKey}-lastName`} 
                                    className={`grid grid-cols-3 gap-4 items-center p-3 rounded-lg mb-2 transition-all duration-200 ${
                                      selectedSection?.id === section.id
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200' 
                                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                                        {section.isLeadCapture && (
                                          <svg className="w-3 h-3 text-blue-600 absolute -top-1 -right-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                        <span className="text-lg">👤</span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-900">Last Name</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Contact field
                                          {section.isLeadCapture && " • Required for all forms"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-center">
                                      <div className="text-green-500 text-lg">✅</div>
                                    </div>
                                    <div className="flex justify-center">
                                      <div className="text-amber-500 text-lg">⚠️</div>
                                    </div>
                                  </div>
                                  </React.Fragment>
                                );
                              }
                              return (
                                <React.Fragment key={baseKey}>
                                  <Tooltip
                                    title={`Click to configure ${section.label || formItem?.text || section.type} field settings`}
                                    placement="right"
                                  >
                                    <div 
                                    key={baseKey} 
                                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 cursor-pointer ${
                                      selectedSection?.id === section.id
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200' 
                                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                    onClick={() => {
                                      console.log('🖱️ Editor click: Selecting section from main area:', section?.label || section?.id);
                                      previewNavigatingRef.current = false; // Editor is driving navigation
                                      setSelectedSection(section);
                                      setIsEditingForm(false);
                                    }}
                                  >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  section.isLeadCapture ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                  {section.isLeadCapture && (
                                        <svg className="w-3 h-3 text-blue-600 absolute top-1 right-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                      <span className="text-lg">
                                        {(() => {
                                          const iconMap = {
                                            'text': '📝',
                                            'longtext': '📄',
                                            'motivation': '💭',
                                            'number': '🔢',
                                            'date': '📅',
                                            'email': '✉️',
                                            'phone': '📱',
                                            'address': '📍',
                                            'file': '📎',
                                            'multichoice': '◉',
                                            'dropdown': '📋',
                                            'multiselect': '☑️',
                                            'yesno': '❓',
                                            'boolean': '🔘',
                                            'website': '🌐'
                                          };
                                          return iconMap[section.type] || '📝';
                                        })()}
                                      </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{section.label || formItem?.text || section.type}</span>
                                    {section.isLeadCapture && (
                                          <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-blue-600 font-medium">Lead Capture</span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 capitalize">
                                        {section.type} field • {getTranslation(landingPageData?.lang, 'clickToConfigure')}
                                      </p>
                                    </div>
                                    <div className="text-gray-400">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                  </Tooltip>
                                </React.Fragment>
                              );
                            })}
                            
                            {/* Add Field Button - At the bottom */}
                            <div className="mt-4">
                              <Tooltip title="Add a new form field to your application form" placement="right">
                                <button
                                  onClick={() => setQuestionModal(true)}
                                  className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  ➕ {getTranslation(landingPageData?.lang, 'addField')}
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </>
                      ) : (
                        renderFieldEditor()
                      )}

                      <div className="h-px bg-blue_gray-50" />
                    </div>
                    
                    {/* Mobile Preview Button - Only visible on mobile */}
                    <button
                      onClick={() => setFullscreen(true)}
                      className="md:hidden fixed bottom-6 right-6 w-12 h-12 smx:w-10 smx:h-10 rounded-full shadow-lg flex items-center justify-center text-white z-50 transition-all duration-200 hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                      title="Preview Form"
                    >
                      <svg className="w-5 h-5 smx:w-4 smx:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Preview Section - Hidden on mobile, shown in fullscreen */}
                  <div
                    className={`${fullscreen ? 'flex' : 'hidden md:flex'} flex-1 flex-col gap-[10px] border-r border-solid border-blue_gray-50 px-[15px] pb-[3px] pt-[15px]`}
                    style={fullscreen ? {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      zIndex: 9999,
                      background: 'white',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                    } : { height: '100%', flexDirection: 'column' }}
                  >
                    <div className="flex gap-4 justify-between items-center mb-2 relative">
                      {/* Close Button for Fullscreen - Mobile */}
                      {fullscreen && (
                        <button
                          onClick={() => setFullscreen(false)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-50"
                          title="Close Preview"
                        >
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      
                      <Heading
                        size="7xl"
                        as="h5"
                        className="!text-black-900_01 !text-lg md:!text-xl"
                        style={{ marginLeft: fullscreen ? '40px' : '0' }}
                      >
                        Preview
                      </Heading>
                      {/* Centered Preview Toggle */}
                      <div className="flex-1 flex justify-center">
                        <div className="flex p-1 rounded-lg bg-gray-100">
                          <button
                            onClick={() => setDevice("mobile")}
                            className={`h-[24px] px-2 rounded-md flex items-center justify-center font-medium transition text-xs ${
                              device === "mobile"
                                ? "bg-[#5207CD] text-[#EFF8FF]"
                                : "text-[#5207CD]"
                            }`}
                          >
                            Mobile
                          </button>
                          <button
                            onClick={() => setDevice("desktop")}
                            className={`h-[24px] px-2 rounded-md flex items-center justify-center font-medium transition text-xs ${
                              device === "desktop"
                                ? "bg-[#5207CD] text-[#EFF8FF]"
                                : "text-[#5207CD]"
                            }`}
                          >
                            Form
                          </button>
                        </div>
                      </div>
                      {/* Expand/Collapse Button */}
                      <button
                        className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-gray-100"
                        onClick={() => setFullscreen(f => !f)}
                        style={{ marginLeft: 8 }}
                      >
                        <img
                          src="/images/expand-06.svg"
                          alt={fullscreen ? "collapse" : "expand"}
                          className="h-[20px] w-[20px]"
                        />
                      </button>
                    </div>
                    <div
                      className="flex flex-col items-start justify-center gap-[2px] mdx:pb flex-1"
                      style={
                        device === "mobile"
                          ? { width: 390, background: "white", margin: "0 auto", borderRadius: 12, boxShadow: "0 2px 12px #0001", height: "100%", maxHeight: fullscreen ? 'calc(100vh - 100px)' : '100%' }
                          : { width: "100%", height: "100%", maxHeight: fullscreen ? 'calc(100vh - 100px)' : '100%' }
                      }
                    >
                      {formSections.length > 0 ? (
                        <div className="w-full h-full">
                          <ApplyPagePreview
                            landingPageData={{
                              ...landingPageData,
                              form: {
                                ...landingPageData?.form,
                                fields: formSections
                              },
                              // 🎨 PASS BRAND DATA TO PREVIEW
                              primaryColor: userBrandData?.primaryColor || user?.primaryColor,
                              secondaryColor: userBrandData?.secondaryColor || user?.secondaryColor,
                              tertiaryColor: userBrandData?.tertiaryColor || user?.tertiaryColor,
                              titleFont: userBrandData?.titleFont || user?.titleFont,
                              bodyFont: userBrandData?.bodyFont || user?.bodyFont,
                              subheaderFont: userBrandData?.subheaderFont || user?.subheaderFont,
                              companyLogo: userBrandData?.companyLogo || user?.companyLogo,
                            }}
                            isPreviewMode={true}
                            onStepChange={(step, field) => {
                              console.log('🔄 Preview navigation: step', step, 'field:', field?.label || field?.id);
                              previewNavigatingRef.current = true; // Preview is driving navigation
                              
                              if (step === 0) {
                                // Step 0 = intro step - clear selection
                                console.log('📝 Editor sync: Going to intro step, clearing selection');
                                setSelectedSection(null);
                                setIsEditingForm(true);
                              } else if (field) {
                                // Step > 0 - select the corresponding field
                                console.log('📝 Editor sync: Selecting field from preview:', field?.label || field?.id);
                                setSelectedSection(field);
                                setIsEditingForm(false);
                              }
                              
                              // Reset the flag after a short delay to allow for editor-driven navigation
                              setTimeout(() => {
                                previewNavigatingRef.current = false;
                              }, 100);
                            }}
                            initialStep={(() => {
                              // Don't recalculate if preview is currently navigating (prevents circular updates)
                              if (previewNavigatingRef.current) {
                                console.log('🔄 Preview is navigating, not recalculating initialStep');
                                return undefined; // Let preview maintain its current step
                              }
                              
                              // Simple 1:1 mapping: Step 0 = intro, Step 1 = first field, Step 2 = second field, etc.
                              if (!selectedSection || isEditingForm) {
                                console.log('🎯 Editor driving: Going to intro step (0)');
                                return 0;
                              }
                              
                              // Find the step for the selected field (simple array index + 1)
                              const fieldIndex = formSections.findIndex(field => field.id === selectedSection.id);
                              if (fieldIndex >= 0) {
                                const step = fieldIndex + 1; // +1 because step 0 is intro
                                console.log('🎯 Editor driving: Going to step', step, 'for field:', selectedSection.label);
                                return step;
                              }
                              
                              console.log('🎯 Editor driving: Field not found, defaulting to intro step');
                              return 0;
                            })()}
                          />
                        </div>
                      ) : (
                        <div className="self-stretch py-6 smx:py-5">
                          <div className="flex flex-col gap-4 items-center">
                            <img
                              src="/images/img_illustration_empty_content.png"
                              alt="illustration"
                              className="h-[135px] w-[180px] object-cover"
                            />
                            <div className="flex flex-col items-center gap-[7px]">
                              <Heading
                                size="4xl"
                                as="h6"
                                className="!text-gray-900"
                              >
                                Please add questions
                              </Heading>
                              <Text
                                as="p"
                                className="!font-normal !text-blue_gray-500"
                              >
                                No data found, please select blocks.
                              </Text>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={questionModal}
        footer={null}
        onCancel={() => setQuestionModal(false)}
        closable={false}
        destroyOnClose
      >
        <ApplicationformAddQuestions
          onClickAdd={handleAddSection}
          onClose={() => setQuestionModal(false)}
          disabledTypes={
            // Only disable unique field types that already exist
            formSections
              .filter(section => ["email", "contact", "phone"].includes(section.type))
              .map(section => section.type)
          }
        />
      </Modal>

      <AIFormGeneratorModal
        visible={aiFormModalVisible}
        onCancel={() => setAiFormModalVisible(false)}
        onFormGenerated={handleAIFormGenerated}
        initialData={{
          jobTitle: landingPageData?.vacancyTitle,
          jobDescription: landingPageData?.heroDescription,
          location: landingPageData?.location,
          companyInfo: landingPageData?.companyInfo
        }}
      />

      <style jsx>{`
        .hello-pangea-dnd-draggable {
          transition: transform 0.2s ease;
        }
        [data-rbd-draggable-context-id] {
          outline: none;
        }
        
        /* Mobile responsive fixes */
        @media (max-width: 767px) {
          .sidebar-transition {
            min-width: 60px !important;
            max-width: 60px !important;
          }
          
          .sidebar-item .flex-1 {
            width: auto !important;
            min-width: 0 !important;
          }
          
          /* Hide sidebar text on mobile */
          .sidebar-item span:not(.md\\:hidden) {
            display: none;
          }
          
          /* Ensure form builder doesn't overflow */
          .form-builder-container {
            min-width: 0;
            overflow-x: auto;
          }
          
          /* Mobile fullscreen adjustments */
          .mobile-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: white !important;
            padding: 8px !important;
          }
        }
        
        /* Desktop hover expansion */
        @media (min-width: 768px) {
          .sidebar-transition:hover {
            width: 140px !important;
          }
        }
        
        /* Prevent horizontal overflow */
        .main-container {
          overflow-x: hidden;
        }
      `}</style>
      </div>
    </>
  );
}
