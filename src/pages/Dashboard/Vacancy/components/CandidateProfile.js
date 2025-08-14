import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Tabs, 
  Avatar, 
  Button, 
  Tag, 
  Rate, 
  Divider,
  Space,
  Typography,
  message,
  Input,
  List,
  Card,
  Progress,
  Upload,
  Select
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  EditOutlined,
  FileTextOutlined,
  StarOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  NumberOutlined,
  GlobalOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import CrudService from '../../../../services/CrudService';
import UploadService from '../../../../services/UploadService';
import CandidateChatService from '../../../../services/CandidateChatService';
import ATSService from '../../../../services/ATSService';
import { useRouter } from 'next/router';

// Add custom styles for the drawer
const drawerStyles = `
  .candidate-profile-drawer .ant-drawer-body {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    max-height: 100% !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer {
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-drawer-wrapper-body {
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-drawer-content {
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-tabs {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-tabs-nav {
    background: #f8fafc;
    margin: 0;
    padding: 0 16px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .candidate-profile-drawer .ant-tabs-tab {
    font-weight: 500;
    font-size: 13px;
    padding: 10px 16px;
    border: none;
    margin: 0 4px 0 0;
    border-radius: 0;
    color: #64748b;
    position: relative;
  }
  
  .candidate-profile-drawer .ant-tabs-tab-active {
    background: transparent;
    color: #5207cd;
    font-weight: 600;
  }
  
  .candidate-profile-drawer .ant-tabs-tab-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #5207cd;
  }
  
  .candidate-profile-drawer .ant-tabs-content-holder {
    background: white !important;
    flex: 1 !important;
    overflow: hidden !important;
    height: 100% !important;
  }
  
  .candidate-profile-drawer .ant-tabs-content {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-tabs-tabpane {
    flex: 1 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 0 !important;
    height: 100% !important;
    max-height: 100% !important;
  }
  
  /* Tab content padding - specific handling for each tab */
  .candidate-profile-drawer .overview-tab-content,
  .candidate-profile-drawer .resume-tab-content {
    padding: 16px;
  }
  
  /* Notes tab has its own internal padding structure */
  
  .candidate-profile-drawer .ant-progress-bg {
    transition: all 0.3s ease;
  }
  
  /* Prevent body scroll when drawer is open */
  body.drawer-open {
    overflow: hidden !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }
  
  /* Additional failsafe for any page-level scroll */
  body.drawer-open, 
  body.drawer-open html,
  body.drawer-open #__next {
    overflow: hidden !important;
  }
  
  /* Ensure smooth scrolling in content area */
  .candidate-profile-drawer .ant-tabs-tabpane {
    scroll-behavior: smooth;
  }
  
  /* Hide horizontal scrollbar if it appears */
  .candidate-profile-drawer .ant-tabs-tabpane::-webkit-scrollbar {
    width: 6px;
  }
  
  .candidate-profile-drawer .ant-tabs-tabpane::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  .candidate-profile-drawer .ant-tabs-tabpane::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .candidate-profile-drawer .ant-tabs-tabpane::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Force specific height calculation */
  .candidate-profile-drawer .ant-drawer {
    /* Let Ant Design handle drawer height */
  }
  
  .candidate-profile-drawer .ant-drawer-content-wrapper {
    overflow: hidden !important;
  }
  
  /* Ensure no background scroll */
  .candidate-profile-drawer .ant-drawer-mask {
    position: fixed !important;
  }
  
  /* Override any default overflow behavior */
  .candidate-profile-drawer * {
    box-sizing: border-box !important;
  }
  
  /* Ensure header doesn't contribute to scroll issues */
  .candidate-profile-drawer .candidate-header {
    flex-shrink: 0 !important;
    overflow: hidden !important;
  }
  
  /* Make sure tab navigation doesn't scroll */
  .candidate-profile-drawer .ant-tabs-nav-wrap {
    overflow: hidden !important;
  }
  
  /* Specific override for any remaining scroll conflicts */
  .candidate-profile-drawer .ant-tabs-nav,
  .candidate-profile-drawer .ant-tabs-nav-list {
    overflow: visible !important;
  }
  
  /* Final failsafe - prevent any scroll context except for tab pane */
  .candidate-profile-drawer > * {
    overflow: hidden !important;
  }
  
  .candidate-profile-drawer .ant-tabs-tabpane {
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }
  
  /* Make sure drawer positioning is correct */
  .candidate-profile-drawer {
    /* Remove fixed positioning to let Ant Design handle drawer positioning */
  }
  
  /* Compact action buttons */
  .candidate-actions .ant-btn {
    height: 32px;
    padding: 4px 12px;
    font-size: 13px;
    border-radius: 6px;
    font-weight: 500;
  }
  
  .candidate-actions .ant-btn-primary {
    background: #5207cd;
    border-color: #5207cd;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .candidate-actions .ant-btn-primary:hover {
    background: #4a06b9;
    border-color: #4a06b9;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  /* Compact header styles */
  .candidate-header {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .candidate-header .ant-typography {
    color: white !important;
    margin: 0;
  }
  
  .candidate-header .ant-tag {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 12px;
    font-size: 11px;
    padding: 2px 8px;
    font-weight: 500;
  }
  
  .candidate-header .ant-rate {
    color: #fbbf24 !important;
  }
  
  .candidate-header .ant-rate-star {
    font-size: 14px !important;
  }
  
  /* Close button */
  .candidate-close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
  }
  
  .candidate-close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#candidate-profile-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'candidate-profile-styles';
  styleSheet.textContent = drawerStyles;
  document.head.appendChild(styleSheet);
}

const { TabPane } = Tabs;
const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const CandidateProfile = ({ 
  candidateId, 
  onClose, 
  onUpdate, 
  stages = [],
  allCandidateIds = [],
  onEmail,
}) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allCandidates, setAllCandidates] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [lastCommunication, setLastCommunication] = useState(null);
  const [updatingCommunication, setUpdatingCommunication] = useState(false);
  
  const router = useRouter();

  // Handle starting chat with candidate
  const handleStartChat = async () => {
    if (!candidate?.email) {
      message.warning('Cannot start chat: No email address available for this candidate');
      return;
    }

    try {
      // Start a new chat with the candidate
      const response = await CandidateChatService.startChat(candidate.id);
      
      if (response.data.chatId) {
        message.success('Chat started! Redirecting to chat interface...');
        
        // Close the modal and redirect to chat interface
        onClose();
        router.push(`/dashboard/candidate-chat?chatId=${response.data.chatId}`);
      }
    } catch (error) {
      console.error('Error starting chat with candidate:', error);
      message.error('Failed to start chat with candidate. Please try again.');
    }
  };

  useEffect(() => {
    if (candidateId) {
      loadCandidateData();
      loadAllCandidates();
    }
  }, [candidateId]);

  // Prevent resume URL from being reset on data reload if we have a local value
  useEffect(() => {
    console.log('📄 Resume URL state changed:', resumeUrl);
  }, [resumeUrl]);

  // Manage body scroll when drawer is open/closed
  useEffect(() => {
    if (candidateId) {
      // Lock body scroll
      document.body.classList.add('drawer-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      
      // Also lock any potential page containers
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        nextRoot.style.overflow = 'hidden';
      }
    } else {
      // Restore body scroll
      document.body.classList.remove('drawer-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        nextRoot.style.overflow = '';
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('drawer-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        nextRoot.style.overflow = '';
      }
    };
  }, [candidateId]);

  const loadCandidateData = async () => {
    setLoading(true);
    try {
      const response = await CrudService.getSingle('VacancySubmission', candidateId);
      if (response.data) {
        // Transform VacancySubmission data to match expected candidate structure
        const formData = response.data.formData || {};
        
        // Extract name using same logic as NewATS.js
        let fullname = '';
        if (formData.fullname) {
          fullname = formData.fullname;
        } else if (formData.firstname && formData.lastname) {
          fullname = `${formData.firstname} ${formData.lastname}`;
        } else {
          // Handle dynamic contact field structure
          const contactFirstName = Object.keys(formData).find(key => key.includes('firstName'));
          const contactLastName = Object.keys(formData).find(key => key.includes('lastName'));
          if (contactFirstName && contactLastName) {
            const firstName = formData[contactFirstName];
            const lastName = formData[contactLastName];
            if (firstName && lastName) {
              fullname = `${firstName} ${lastName}`;
            }
          }
        }
        
        // Extract email
        let email = formData.email || '';
        if (!email) {
          const emailField = Object.keys(formData).find(key => key.includes('email'));
          if (emailField) email = formData[emailField];
        }
        
        // Extract phone
        let phone = formData.phone || '';
        if (!phone) {
          const phoneField = Object.keys(formData).find(key => key.includes('phone'));
          if (phoneField) phone = formData[phoneField];
        }

        // Extract avatar - for form submissions, there usually isn't an avatar
        let avatar = null;
        if (formData.avatar && formData.avatar.trim()) {
          avatar = formData.avatar;
        } else {
          // Check for image upload field
          const imageField = Object.keys(formData).find(key => 
            key.includes('image') || key.includes('photo') || key.includes('avatar')
          );
          if (imageField && formData[imageField] && formData[imageField].trim()) {
            avatar = formData[imageField];
          }
        }

        console.log('👤 Avatar extraction:', {
          formDataAvatar: formData.avatar,
          foundImageField: Object.keys(formData).find(key => 
            key.includes('image') || key.includes('photo') || key.includes('avatar')
          ),
          finalAvatar: avatar
        });

        const transformedCandidate = {
          ...response.data,
          fullname: fullname || 'Unknown',
          email: email,
          phone: phone,
          avatar: avatar, // null instead of empty string prevents broken image
          position: formData.position || 'Position',
          stage: stages.find(stage => stage.id === response.data.stageId)?.title || 'Applied'
        };
        setCandidate(transformedCandidate);
        
        // Set last communication date
        const communicationDate = response.data.lastCommunication 
          ? moment(response.data.lastCommunication) 
          : null;
        setLastCommunication(communicationDate);
        
        // Debug resume URL loading
        let resumeUrlFromResponse = response.data.resumeUrl || formData.resumeUrl || null;
        
        // Also check for file uploads in formData with form field structure
        if (!resumeUrlFromResponse && formData && response.data.form?.fields) {
          // Look for file type fields in the form structure
          const fileFields = response.data.form.fields.filter(field => field.type === 'file');
          for (const fileField of fileFields) {
            const fileUrl = formData[fileField.id];
            if (fileUrl && fileUrl.startsWith('http')) {
              resumeUrlFromResponse = fileUrl;
              console.log('📄 Found resume in form field:', fileField.label, '→', fileUrl);
              break;
            }
          }
        }
        
        console.log('📄 Loading resume URL:', {
          fromResponse: response.data.resumeUrl,
          fromFormData: formData.resumeUrl,
          fromFileFields: resumeUrlFromResponse !== (response.data.resumeUrl || formData.resumeUrl),
          current: resumeUrl,
          final: resumeUrlFromResponse
        });
        
        // Only update resumeUrl if we found one, or if we don't have one currently
        if (resumeUrlFromResponse || !resumeUrl) {
          setResumeUrl(resumeUrlFromResponse);
        }
        loadCandidateNotes(candidateId);
      }
    } catch (error) {
      console.error('Error loading candidate:', error);
      message.error('Failed to load candidate data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllCandidates = async () => {
    try {
      // Use the passed allCandidateIds prop
      setAllCandidates(allCandidateIds);
      const currentIndex = allCandidateIds.findIndex(id => id === candidateId);
      setCurrentIndex(currentIndex >= 0 ? currentIndex : 0);
    } catch (error) {
      console.error('Error loading candidates list:', error);
    }
  };

  const loadCandidateNotes = async (candidateId) => {
    try {
      const response = await CrudService.search('CandidateNote', 100, 1, {
        filters: { vacancySubmission: candidateId },
        populate: 'loggedBy'
      });
      console.log('📝 Notes response:', response);
      
      // Sort notes by creation date - newest first
      const sortedNotes = (response.data?.items || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      await CrudService.create('CandidateNote', {
        vacancySubmission: candidateId,
        note: newNote,
        createdAt: new Date().toISOString(),
        // loggedBy set on backend using current user/team member
      });
      setNewNote('');
      loadCandidateNotes(candidateId);
      message.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      message.error('Failed to add note');
    }
  };

  const updateRating = async (rating) => {
    try {
      await CrudService.update('VacancySubmission', candidateId, { stars: rating });
      setCandidate(prev => ({ ...prev, stars: rating }));
      message.success('Rating updated');
      
      // Notify parent component to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      message.error('Failed to update rating');
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevCandidateId = allCandidates[currentIndex - 1];
      onClose(); // Close current
      // The parent component should handle opening the new candidate
      setTimeout(() => {
        if (onUpdate) {
          onUpdate(prevCandidateId);
        }
      }, 100);
    }
  };

  const goToNext = () => {
    if (currentIndex < allCandidates.length - 1) {
      const nextCandidateId = allCandidates[currentIndex + 1];
      onClose(); // Close current
      // The parent component should handle opening the new candidate
      setTimeout(() => {
        if (onUpdate) {
          onUpdate(nextCandidateId);
        }
      }, 100);
    }
  };

  const calculateStageProgress = () => {
    if (!candidate || !stages || stages.length === 0) {
      return 0;
    }

    // Find the current stage index
    const currentStageIndex = stages.findIndex(stage => 
      stage.id === candidate.stageId || 
      stage.title === candidate.stage ||
      stage.name === candidate.stage
    );

    if (currentStageIndex === -1) {
      // If stage not found, assume it's the first stage (Applied)
      return Math.round(100 / stages.length);
    }

    // Calculate progress: (current stage position + 1) / total stages * 100
    const progress = Math.round(((currentStageIndex + 1) / stages.length) * 100);
    
    console.log('📊 Stage progress calculation:', {
      candidateStage: candidate.stage,
      candidateStageId: candidate.stageId,
      currentStageIndex,
      totalStages: stages.length,
      progress
    });

    return progress;
  };

  const getCurrentStagePosition = () => {
    if (!candidate || !stages || stages.length === 0) {
      return 1;
    }

    const currentStageIndex = stages.findIndex(stage => 
      stage.id === candidate.stageId || 
      stage.title === candidate.stage ||
      stage.name === candidate.stage
    );

    return currentStageIndex === -1 ? 1 : currentStageIndex + 1;
  };

  const getProgressColor = () => {
    const progress = calculateStageProgress();
    
    if (progress <= 25) {
      return '#ef4444'; // red-500 - just started
    } else if (progress <= 50) {
      return '#f59e0b'; // amber-500 - in progress
    } else if (progress <= 75) {
      return '#5207cd'; // blue-500 - making good progress
    } else {
      return '#10b981'; // emerald-500 - almost complete/hired
    }
  };

  const handleResumeUpload = async ({ file }) => {
    if (file.status === 'uploading') return;

    setUploadingResume(true);
    try {
      console.log('📄 Uploading resume using UploadService...');
      
      // Use the existing UploadService
      const response = await UploadService.upload(file, 5); // 5MB max for documents
      
      if (response && response.data && response.data.secure_url) {
        const uploadedUrl = response.data.secure_url;
        console.log('✅ Resume upload successful:', uploadedUrl);
        
        // Update the candidate in database first
        await CrudService.update('VacancySubmission', candidateId, { 
          resumeUrl: uploadedUrl 
        });
        console.log('✅ Database updated with resume URL');
        
        // Then update local state
        setResumeUrl(uploadedUrl);
        
        message.success('Resume uploaded successfully');
        
        // Reload candidate data to get the updated resume URL from database
        setTimeout(async () => {
          await loadCandidateData();
          // Also notify parent component
          if (onUpdate) {
            onUpdate();
          }
        }, 500);
      } else {
        console.warn('❌ Resume upload response missing URL:', response);
        message.warning('Resume upload completed but no URL returned');
      }
    } catch (error) {
      console.error('❌ Resume upload error:', error);
      message.error('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const updateLastCommunication = async (date) => {
    setUpdatingCommunication(true);
    try {
      const dateToSave = date ? date.toISOString() : null;
      
      console.log('🔄 Updating last communication:', {
        candidateId,
        date: date ? date.format('YYYY-MM-DD') : null,
        dateToSave
      });
      
      const response = await CrudService.update('VacancySubmission', candidateId, { 
        lastCommunication: dateToSave 
      });
      
      console.log('✅ Last communication update response:', response);
      
      setLastCommunication(date);
      message.success('Last communication date updated');
      
      // Notify parent component to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('❌ Error updating last communication:', error);
      console.error('Error details:', {
        candidateId,
        error: error.message,
        response: error.response?.data
      });
      message.error('Failed to update last communication date');
    } finally {
      setUpdatingCommunication(false);
    }
  };

  const renderHeader = () => (
    <div className="candidate-header relative">
      {/* Close Button */}
      <Button 
        type="text" 
        icon={<CloseOutlined />} 
        onClick={onClose}
        className="candidate-close-btn"
        size="small"
      />
      
      {/* Compact Header Content */}
      <div className="flex items-center gap-4">
        <Avatar 
          size={56} 
          src={candidate?.avatar} 
          icon={<UserOutlined />}
          className="border-2 border-white/30 shadow-md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Title level={4} className="text-white m-0 font-semibold text-lg">
              {candidate?.fullname || 'Unnamed Candidate'}
            </Title>
            <Tag className="bg-white/20 border-white/30 text-white">
              {candidate?.stage || 'Applied'}
            </Tag>
          </div>
          
          <div className="flex items-center gap-4">
            <Text className="text-white/90 text-sm">
              {candidate?.position || 'des'}
            </Text>
            <div className="flex items-center gap-2">
              <Rate 
                value={candidate?.stars || 0}
                onChange={updateRating}
                size="small"
                className="text-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact Action Buttons */}
      <div className="candidate-actions flex items-center gap-2 mt-4">
        <Button 
          icon={<MailOutlined />}
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
          onClick={() => {
            // Debug log for diagnosing modal open issue
      
            if (candidate?.email) {
              if (onEmail) {
                onEmail(candidate._id);
              }
            } else {
              message.warning('No email address available');
            }
          }}
          size="small"
        >
          Send Email
        </Button>
        
        <Button 
          icon={<PhoneOutlined />}
          onClick={() => {
            if (candidate?.phone) {
              window.open(`tel:${candidate.phone}`, '_blank');
            } else {
              message.warning('No phone number available');
            }
          }}
          size="small"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
        >
          Call
        </Button>
        
        <Button 
          icon={<MessageOutlined />}
          onClick={handleStartChat}
          size="small"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
        >
          Start Chat
        </Button>

      </div>
    </div>
  );

  const renderApplicationFormCard = () => {
    if (!candidate?.formData || !candidate?.form) {
      console.log('📝 No form data available:', {
        hasFormData: !!candidate?.formData,
        hasForm: !!candidate?.form,
        candidate: candidate
      });
      return null;
    }

    const formData = candidate.formData;
    const formFields = candidate.form?.fields || [];
    
    console.log('📝 Form data loaded:', {
      formData,
      formFields,
      formTitle: candidate.form?.title
    });
    
    // Parse form answers
    const formAnswers = [];
    
    formFields.forEach(field => {
      let answer = null;
      let label = field.label || field.id;

      // Handle different field types
      switch (field.type) {
        case 'contact':
          // Contact fields have firstName and lastName
          const firstNameKey = `${field.id}_firstName`;
          const lastNameKey = `${field.id}_lastName`;
          const firstName = formData[firstNameKey];
          const lastName = formData[lastNameKey];
          if (firstName || lastName) {
            answer = `${firstName || ''} ${lastName || ''}`.trim();
          }
          break;
          
        case 'email':
        case 'phone':
        case 'text':
        case 'textarea':
        case 'longtext':
        case 'motivation':
          answer = formData[field.id];
          break;
          
        case 'file':
          answer = formData[field.id];
          break;
          
        case 'boolean':
        case 'yesno':
          const boolValue = formData[field.id];
          answer = boolValue === 'yes' || boolValue === true ? 'Yes' : 
                   boolValue === 'no' || boolValue === false ? 'No' : 
                   boolValue || 'Not answered';
          break;
          
        case 'multichoice':
        case 'dropdown':
        case 'multiselect':
        case 'select':
        case 'radio':
          answer = formData[field.id];
          break;
          
        case 'number':
        case 'date':
        case 'website':
        case 'address':
          answer = formData[field.id];
          break;
          
        default:
          answer = formData[field.id];
      }

      if (answer && answer.toString().trim()) {
        formAnswers.push({
          label,
          answer: answer.toString(),
          type: field.type,
          required: field.required
        });
      }
    });

    // Also check for any additional formData keys not covered by form fields
    const coveredKeys = new Set();
    formFields.forEach(field => {
      coveredKeys.add(field.id);
      if (field.type === 'contact') {
        coveredKeys.add(`${field.id}_firstName`);
        coveredKeys.add(`${field.id}_lastName`);
      }
    });

    // Add any uncovered form data
    Object.keys(formData).forEach(key => {
      if (!coveredKeys.has(key) && formData[key] && !['firstname', 'lastname', 'email', 'phone'].includes(key)) {
        formAnswers.push({
          label: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase()),
          answer: formData[key].toString(),
          type: 'text',
          required: false
        });
      }
    });

    if (formAnswers.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FileTextOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={5} className="m-0 text-gray-900">
                {candidate.form?.title || 'Application Form'}
              </Title>
              <Text className="text-gray-500">
                {formAnswers.length} answer{formAnswers.length !== 1 ? 's' : ''} submitted
              </Text>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {moment(candidate.createdAt).format('MMM DD, YYYY')}
          </div>
        </div>

        {candidate.form?.description && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <Text className="text-indigo-700 text-sm">
              {candidate.form.description}
            </Text>
          </div>
        )}
        
        <div className="space-y-4">
          {formAnswers.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                {item.type === 'email' ? (
                  <MailOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'phone' ? (
                  <PhoneOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'contact' ? (
                  <UserOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'file' ? (
                  <FileTextOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'boolean' || item.type === 'yesno' ? (
                  <span className="text-indigo-600 text-xs font-bold">?</span>
                ) : item.type === 'multichoice' || item.type === 'dropdown' || item.type === 'multiselect' ? (
                  <CheckCircleOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'date' ? (
                  <CalendarOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'number' ? (
                  <NumberOutlined className="text-indigo-600 text-sm" />
                ) : item.type === 'website' ? (
                  <GlobalOutlined className="text-indigo-600 text-sm" />
                ) : (
                  <EditOutlined className="text-indigo-600 text-sm" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Text className="text-sm font-medium text-gray-700">
                    {item.label}
                  </Text>
                  {item.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
                {item.type === 'file' && item.answer && item.answer.startsWith('http') ? (
                  <div className="flex items-center gap-2">
                    <a 
                      href={item.answer} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <DownloadOutlined className="text-sm" />
                      {(() => {
                        // Extract filename from URL
                        const urlParts = item.answer.split('/');
                        const lastPart = urlParts[urlParts.length - 1];
                        const decodedPart = decodeURIComponent(lastPart);
                        // Remove Cloudinary transformations and get clean filename
                        const cleanName = decodedPart.split('_').pop() || decodedPart;
                        return cleanName.length > 30 ? cleanName.substring(0, 30) + '...' : cleanName;
                      })()}
                    </a>
                  </div>
                ) : item.type === 'website' && item.answer && item.answer.startsWith('http') ? (
                  <a 
                    href={item.answer} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium break-words"
                  >
                    {item.answer}
                  </a>
                ) : (
                  <Text className="text-gray-900 font-medium break-words">
                    {item.answer}
                  </Text>
                )}
              </div>
              
              {(item.type === 'email' || item.type === 'phone' || (item.type === 'file' && item.answer && item.answer.startsWith('http'))) && (
                <div className="flex gap-1">
                  {item.type === 'email' && (
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<MailOutlined />}
                      onClick={() => window.open(`mailto:${item.answer}`, '_blank')}
                      className="hover:bg-indigo-100 hover:text-indigo-600"
                      title="Send email"
                    />
                  )}
                  {item.type === 'phone' && (
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<PhoneOutlined />}
                      onClick={() => window.open(`tel:${item.answer}`, '_blank')}
                      className="hover:bg-indigo-100 hover:text-indigo-600"
                      title="Call phone"
                    />
                  )}
                  {item.type === 'file' && item.answer && item.answer.startsWith('http') && (
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(item.answer, '_blank')}
                      className="hover:bg-indigo-100 hover:text-indigo-600"
                      title="Download file"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {candidate.form?.submitText && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-xs text-gray-500">
              Form submitted with: "{candidate.form.submitText}"
            </Text>
          </div>
        )}
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* Application Info Card */}

      {/* Stage Progress Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <StarOutlined className="text-white text-sm" />
            </div>
            <div className="space-y-1 flex gap-4">
              <Text className="text-sm font-medium text-gray-900">Hiring Progress</Text>
              <Text className="text-xs text-gray-500">
                Stage {getCurrentStagePosition()} of {stages.length}
              </Text>
            </div>
          </div>
            <div className="flex items-center gap-3">
              <Select
                size="small"
                value={candidate?.stageId || stages.find(s => s.title === candidate?.stage || s.name === candidate?.stage)?.id}
                style={{ minWidth: 180 }}
                onChange={async (targetStageId) => {
                  try {
                    await ATSService.moveCandidate({
                      targetStage: targetStageId,
                      candidateId: candidateId,
                      destinationCol: [String(candidateId)],
                    });
                    message.success('Stage updated');
                    // Refresh local candidate data and notify parent to refresh board
                    await loadCandidateData();
                    if (onUpdate) onUpdate();
                  } catch (e) {
                    message.error('Failed to update stage');
                  }
                }}
                options={stages.map(s => ({ label: s.title || s.name, value: s.id }))}
              />
              <Text className="text-lg font-bold" style={{ color: getProgressColor() }}>
                {calculateStageProgress()}%
              </Text>
            </div>
        </div>
        
        <div className="space-y-3">
          <Progress 
            percent={calculateStageProgress()} 
            strokeColor={getProgressColor()}
            strokeWidth={6}
            showInfo={false}
            size="small"
          />
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getProgressColor() }}
              ></div>
              <Text className="text-sm font-medium text-gray-700">
                {candidate?.stage || 'Applied'}
              </Text>
            </div>
            <Text className="text-xs text-gray-500">
              {stages.length - getCurrentStagePosition()} phases in pipeline remaining
            </Text>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <UserOutlined className="text-white text-xs" />
          </div>
          <Text className="text-sm font-medium text-gray-900">Contact Information</Text>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <MailOutlined className="text-blue-500 text-sm" />
            <div className="flex-1 min-w-0">
              <div className='min-w-[100px] inline flex flex-1'><Text className="text-xs text-gray-500 ">Email</Text></div>
              <Text className="text-sm font-medium text-gray-900 truncate">{candidate?.email || 'Not provided'}</Text>
            </div>
            {candidate?.email && (
              <Button 
                size="small" 
                type="text" 
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
                className="w-6 h-6 p-0 hover:bg-blue-100 hover:text-blue-600"
              />
            )}
          </div>
          
          {candidate?.phone && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <PhoneOutlined className="text-green-500 text-sm" />
              <div className="flex-1">
                <div className='min-w-[100px] inline flex flex-1'><Text className="text-xs text-gray-500 ">Phone</Text></div>
                <Text className="text-sm font-medium text-gray-900">{candidate.phone}</Text>
              </div>
              <Button 
                size="small" 
                type="text" 
                icon={<PhoneOutlined />}
                onClick={() => window.open(`tel:${candidate.phone}`, '_blank')}
                className="w-6 h-6 p-0 hover:bg-green-100 hover:text-green-600"
              />
            </div>
          )}
          
          {/* Last Communication Field */}
          <div className="flex items-center gap-3 p-2 bg-orange-50 rounded hover:bg-orange-100 transition-colors border border-orange-200">
            <ClockCircleOutlined className="text-orange-500 text-sm" />
            <div className="flex-1">
              <div className='min-w-[100px] inline flex flex-1'>
                <Text className="text-xs text-orange-600 font-medium">Last Communication</Text>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={lastCommunication ? lastCommunication.format('YYYY-MM-DD') : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      updateLastCommunication(moment(dateValue));
                    } else {
                      updateLastCommunication(null);
                    }
                  }}
                  disabled={updatingCommunication}
                  className="border-none bg-transparent text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 p-0 cursor-pointer"
                  style={{
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '14px',
                    background: 'transparent',
                    border: 'none'
                  }}
                />
                {lastCommunication && (
                  <Text className="text-xs text-orange-600">
                    ({moment().diff(lastCommunication, 'days')} days ago)
                  </Text>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                size="small" 
                type="text" 
                icon={<CalendarOutlined />}
                onClick={() => {
                  // Quick action to set today's date
                  updateLastCommunication(moment());
                }}
                className="w-6 h-6 p-0 hover:bg-orange-100 hover:text-orange-600"
                title="Mark as contacted today"
              />
              {lastCommunication && (
                <Button 
                  size="small" 
                  type="text" 
                  icon={<CloseOutlined />}
                  onClick={() => {
                    updateLastCommunication(null);
                  }}
                  className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
                  title="Clear date"
                />
              )}
            </div>
          </div>
         
        </div>
      </div>

      {/* Application Form Answers Card */}
      {renderApplicationFormCard()}

   
    </div>
  );

  const renderResumeTab = () => (
    <div className="space-y-4">
      {resumeUrl ? (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileTextOutlined className="text-blue-500 text-xl" />
                <div>
                  <Text strong>Resume</Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    Uploaded on {moment().format('MMM DD, YYYY')}
                  </Text>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => window.open(resumeUrl, '_blank')}
                >
                  View
                </Button>
                {/* Download removed per request */}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Upload
              accept=".pdf,.doc,.docx"
              showUploadList={false}
              customRequest={handleResumeUpload}
              beforeUpload={(file) => {
                const isPdf = file.type === 'application/pdf';
                const isDoc = file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
                if (!isPdf && !isDoc) {
                  message.error('You can only upload PDF or Word documents!');
                  return false;
                }
                return true;
              }}
            >
              <Button loading={uploadingResume}>
                Replace Resume
              </Button>
            </Upload>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
          <Text className="text-gray-500">No resume uploaded</Text>
          <div className="mt-4">
            <Upload
              accept=".pdf,.doc,.docx"
              showUploadList={false}
              customRequest={handleResumeUpload}
              beforeUpload={(file) => {
                const isPdf = file.type === 'application/pdf';
                const isDoc = file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
                if (!isPdf && !isDoc) {
                  message.error('You can only upload PDF or Word documents!');
                  return false;
                }
                return true;
              }}
            >
              <Button type="primary" loading={uploadingResume}>
                Upload Resume
              </Button>
            </Upload>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotesTab = () => (
    <div className="space-y-6 p-4">
      {/* Add Note */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="space-y-3">
          <div>
            <Text className="text-sm font-medium text-gray-700 mb-2 block">Add Internal Note</Text>
            <TextArea
              placeholder="Add a note about this candidate..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="primary" 
              onClick={addNote}
              disabled={!newNote.trim()}
              size="small"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <Text className="text-sm font-medium text-gray-700 mb-3 block">Notes History</Text>
        <List
          dataSource={notes}
          renderItem={(note) => (
            <List.Item className="!border-b-gray-200 !px-0">
              <div className="w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Text strong className="text-gray-800">
                    {note?.loggedBy?.firstName || note?.loggedBy?.lastName
                      ? `${note.loggedBy.firstName ?? ''} ${note.loggedBy.lastName ?? ''}`.trim()
                      : 'Internal Note'}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {moment(note.createdAt).format('MMM DD, YYYY HH:mm')}
                  </Text>
                </div>
                <Paragraph className="m-0 text-gray-700">{note.note}</Paragraph>
              </div>
            </List.Item>
          )}
          locale={{ 
            emptyText: (
              <div className="text-center py-8">
                <Text className="text-gray-500">No notes yet</Text>
              </div>
            )
          }}
        />
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button 
          icon={<LeftOutlined />}
          disabled={currentIndex === 0 || allCandidates.length <= 1}
          onClick={goToPrevious}
          size="small"
          className="text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 h-8"
        >
          Previous Candidate
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <Text className="text-xs text-gray-500">Viewing</Text>
            <Text className="text-sm font-medium text-gray-900 block">
              {currentIndex + 1} of {allCandidates.length}
            </Text>
          </div>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(allCandidates.length, 5) }, (_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-500 w-4'
                    : index < currentIndex
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
            {allCandidates.length > 5 && (
              <Text className="text-xs text-gray-400 ml-1">
                +{allCandidates.length - 5}
              </Text>
            )}
          </div>
        </div>
        
        <Button 
          icon={<RightOutlined />}
          disabled={currentIndex === allCandidates.length - 1 || allCandidates.length <= 1}
          onClick={goToNext}
          size="small"
          className="text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 h-8"
        >
          Next Candidate
        </Button>
      </div>
    </div>
  );

  if (!candidateId) return null;

  return (
    <Drawer
      title={null}
      placement="right"
      onClose={onClose}
      open={!!candidateId}
      width={680}
      className="candidate-profile-drawer"
      bodyStyle={{ 
        padding: 0, 
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
      headerStyle={{ display: 'none' }}
      maskClosable={true}
      destroyOnClose={false}
      getContainer={() => document.body}
      style={{ 
        overflow: 'hidden'
      }}
    >
      {/* Custom Header */}
      {renderHeader()}

      {/* Tabs Content */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'overview',
            label: (
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Overview</span>
              </div>
            ),
            children: (
              <div className="overview-tab-content">
                {renderOverviewTab()}
              </div>
            ),
          },
          {
            key: 'resume',
            label: (
              <div className="flex items-center gap-2">
                <FileTextOutlined />
                <span>Resume</span>
              </div>
            ),
            children: (
              <div className="resume-tab-content">
                {renderResumeTab()}
              </div>
            ),
          },
          {
            key: 'notes',
            label: (
              <div className="flex items-center gap-2">
                <EditOutlined />
                <span>Notes</span>
              </div>
            ),
            children: (
              <div className="notes-tab-content">
                {renderNotesTab()}
              </div>
            ),
          },
        ]}
      />

      {/* Navigation Footer */}
      {renderNavigation()}
    </Drawer>
  );
};

export default CandidateProfile; 