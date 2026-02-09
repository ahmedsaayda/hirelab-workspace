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
  Select,
  Tooltip,
  Modal,
  Mentions
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
  DownloadOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import CrudService from '../../../../services/CrudService';
import UploadService from '../../../../services/UploadService';
import CandidateChatService from '../../../../services/CandidateChatService';
import ATSService from '../../../../services/ATSService';
import FileViewer from '../../../../components/FileViewer';
import { extractFileName, extractFileUrl, downloadFile } from '../../../../utils/fileViewerHelper';
import { useRouter } from 'next/router';
import InterviewFormModal from './InterviewFormModal';
import InterviewTemplatesModal from './InterviewTemplatesModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';

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
  
  /* Note: We intentionally don't lock body scroll to prevent scroll-to-top issues */
  
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
    position: absolute !important;
    top: 12px !important;
    right: 12px !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    max-width: 28px !important;
    min-height: 28px !important;
    max-height: 28px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 10 !important;
    transition: all 0.2s ease !important;
    flex-shrink: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
  }
  
  .candidate-close-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    color: white !important;
    width: 28px !important;
    height: 28px !important;
  }
  
  .candidate-close-btn:focus {
    background: rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    color: white !important;
    width: 28px !important;
    height: 28px !important;
    box-shadow: none !important;
  }
  
  .candidate-close-btn .anticon {
    font-size: 12px !important;
    line-height: 1 !important;
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

// Helper functions for status phases
const getStatusPhaseLabel = (phase) => {
  const labels = {
    'new': 'New',
    'reviewing': 'Under Review',
    'waiting_for_availability': 'Waiting for Availability',
    'availability_received': 'Availability Received',
    'meeting_scheduled': 'Meeting Scheduled',
    'interview_completed': 'Interview Completed',
    'reference_check': 'Reference Check',
    'final_decision': 'Final Decision',
    'offer_sent': 'Offer Sent',
    'offer_accepted': 'Offer Accepted',
    'offer_declined': 'Offer Declined',
    'hired': 'Hired',
    'rejected': 'Rejected'
  };
  return labels[phase] || phase;
};

const getStatusPhaseColor = (phase) => {
  const colors = {
    'new': 'bg-gray-100 text-gray-700',
    'reviewing': 'bg-blue-100 text-blue-700',
    'waiting_for_availability': 'bg-yellow-100 text-yellow-700',
    'availability_received': 'bg-orange-100 text-orange-700',
    'meeting_scheduled': 'bg-purple-100 text-purple-700',
    'interview_completed': 'bg-indigo-100 text-indigo-700',
    'reference_check': 'bg-cyan-100 text-cyan-700',
    'final_decision': 'bg-pink-100 text-pink-700',
    'offer_sent': 'bg-emerald-100 text-emerald-700',
    'offer_accepted': 'bg-green-100 text-green-700',
    'offer_declined': 'bg-red-100 text-red-700',
    'hired': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700'
  };
  return colors[phase] || 'bg-gray-100 text-gray-700';
};
const { TextArea } = Input;
const { Option: MentionsOption } = Mentions;

const CandidateProfile = ({
  candidateId,
  onClose,
  onUpdate,
  stages = [],
  allCandidateIds = [],
  onEmail,
  onStatusChange,
  onShowReviewBreakdown,
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
  const [fileViewerVisible, setFileViewerVisible] = useState(false);
  const [viewingFile, setViewingFile] = useState({ url: '', fileName: '', title: '' });
  const [interviewFormVisible, setInterviewFormVisible] = useState(false);
  const [templatesModalVisible, setTemplatesModalVisible] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  const router = useRouter();
  const currentUser = useSelector(selectUser);

  // Load interview history for candidate
  const loadInterviewHistory = async () => {
    if (!candidateId) return;

    setLoadingInterviews(true);
    try {
      const response = await CrudService.search('InterviewResponse', 100, 1, {
        filters: {
          candidateId: candidateId
        },
        populate: 'templateId interviewedBy',
        deep: ['templateId.questions', 'templateId.skills'],
        sort: { interviewDate: -1 }
      });
      setInterviewHistory(response.data?.items || []);
    } catch (error) {
      console.error('Error loading interview history:', error);
      message.error('Failed to load interview history');
    } finally {
      setLoadingInterviews(false);
    }
  };

  // Handle starting chat with candidate
  const handleStartChat = async () => {
    if (!candidate?.email) {
      message.warning('Cannot start chat: No email address available for this candidate');
      return;
    }

    try {
      // Start a new chat with the candidate
      const response = await CandidateChatService.startChat(candidateId);

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
      // Reset state for new candidate to prevent stale data
      setResumeUrl(null);
      setLastCommunication(null);
      setNotes([]);
      setInterviewHistory([]);
      setCandidate(null);

      // Load fresh data for the new candidate
      loadCandidateData();
      loadAllCandidates();
      loadInterviewHistory();
      // Load team members for @ mentions
      CandidateChatService.getTeamMembers()
        .then(res => setTeamMembers(res.data?.members || []))
        .catch(() => setTeamMembers([]));
    }
  }, [candidateId]);

  // Prevent resume URL from being reset on data reload if we have a local value
  useEffect(() => {
    console.log('📄 Resume URL state changed:', resumeUrl);
  }, [resumeUrl]);

  // Manage body class when drawer is open/closed (for CSS styling only - no scroll manipulation)
  useEffect(() => {
    if (candidateId) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [candidateId]);

  const loadCandidateData = async () => {
    setLoading(true);
    try {
      // Use search with populate so we have sender user details for email logs
      const response = await CrudService.search('VacancySubmission', 1, 1, {
        filters: { _id: candidateId },
        populate: { path: 'emailSent.user_id', select: 'firstName lastName email' },
        populate2: { path: 'smsSent.user_id', select: 'firstName lastName email' },
      });
      const doc = response.data?.items?.[0];
      if (doc) {
        // Transform VacancySubmission data to match expected candidate structure
        const formData = doc.formData || {};

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
          ...doc,
          fullname: fullname || 'Unknown',
          email: email,
          phone: phone,
          avatar: avatar, // null instead of empty string prevents broken image
          position: formData.position || 'Position',
          stage: stages.find(stage => stage.id === doc.stageId)?.title || 'Applied'
        };
        setCandidate(transformedCandidate);

        // Set last communication date
        const communicationDate = doc.lastCommunication
          ? moment(doc.lastCommunication)
          : null;
        setLastCommunication(communicationDate);

        // Debug resume URL loading
        let resumeUrlFromResponse = doc.resumeUrl || formData.resumeUrl || null;

        // Also check for file uploads in formData with form field structure
        if (!resumeUrlFromResponse && formData && doc.form?.fields) {
          // Look for file type fields in the form structure
          const fileFields = doc.form.fields.filter(field => field.type === 'file');
          for (const fileField of fileFields) {
            const fileData = formData[fileField.id];
            let fileUrl = null;

            // Handle both new object format and legacy URL string
            if (typeof fileData === 'object' && fileData.url) {
              fileUrl = fileData.url;
            } else if (typeof fileData === 'string' && fileData.startsWith('http')) {
              fileUrl = fileData;
            }

            if (fileUrl) {
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

        // Always set resumeUrl to match current candidate's data (even if null)
        setResumeUrl(resumeUrlFromResponse || null);
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
      await CandidateChatService.addCandidateNote(candidateId, newNote);
      // Notify mentioned teammates via backend
      try {
        await CandidateChatService.notifyNoteMentions(candidateId, newNote);
      } catch (notifyErr) {
        // Non-blocking
        console.warn('Mention notification failed:', notifyErr?.message);
      }
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

  // Handle opening file in viewer
  const handleViewFile = (fileUrl, fileName = '', title = 'File') => {
    setViewingFile({ url: fileUrl, fileName, title });
    setFileViewerVisible(true);
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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Tooltip title="Aggregated rating from stage reviews. Click the question mark to see breakdown by stage.">
                  <Rate
                    value={candidate?.stars || 0}
                    size="small"
                    className="text-yellow-400"
                    disabled={true}
                    style={{ pointerEvents: 'none' }}
                  />
                </Tooltip>
                {onShowReviewBreakdown && (
                  <Tooltip title="View rating breakdown by stage">
                    <Button
                      type="text"
                      size="small"
                      icon={<QuestionCircleOutlined />}
                      onClick={() => onShowReviewBreakdown()}
                      className="text-white/60 hover:text-white/80 p-0 h-auto w-auto"
                      style={{ fontSize: '12px' }}
                    />
                  </Tooltip>
                )}
              </div>
              {/* Status Display */}
              {candidate?.statusPhase && candidate.statusPhase !== 'new' && (
                <div className="flex items-center gap-2">
                  <div className={`
                      px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                      ${getStatusPhaseColor(candidate.statusPhase)}
                    `}>
                    <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    {getStatusPhaseLabel(candidate.statusPhase)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Action Buttons */}
      <div className="candidate-actions flex items-center gap-2 mt-4">
        <Button
          icon={<MailOutlined />}
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 hover:text-white"
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
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 hover:text-white"
        >
          Call
        </Button>

        {/* 
        start chat button hidden as requested by Ralph (2025-10-29) , a feature to work on later.
        <Button 
          icon={<MessageOutlined />}
          onClick={handleStartChat}
          size="small"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 hover:text-white"
        >
          Start Chat
        </Button> */}

        <Button
          icon={<ClockCircleOutlined />}
          onClick={() => onStatusChange && onStatusChange(candidate)}
          size="small"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 hover:text-white"
        >
          Status
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
      let label = field.label;

      // Provide better default labels instead of showing field IDs
      if (!label || label === field.id) {
        // Generate a human-readable label from field type or ID
        switch (field.type) {
          case 'contact':
            label = 'Contact Information';
            break;
          case 'email':
            label = 'Email';
            break;
          case 'phone':
            label = 'Phone';
            break;
          case 'text':
            label = 'Text';
            break;
          case 'textarea':
          case 'longtext':
            label = 'Text Area';
            break;
          case 'motivation':
            label = 'Motivation';
            break;
          case 'number':
            label = 'Number';
            break;
          case 'date':
            label = 'Date';
            break;
          case 'website':
            label = 'Website';
            break;
          case 'multichoice':
            label = 'Multiple Choice';
            break;
          case 'boolean':
            label = 'Yes/No';
            break;
          default:
            // As a last resort, format the field ID to be more readable
            label = field.id.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
        }
      }

      // Handle different field types
      switch (field.type) {
        case 'contact':
          // Handle contact fields by breaking them into individual components
          const firstNameKey = `${field.id}_firstName`;
          const lastNameKey = `${field.id}_lastName`;
          const emailKey = `${field.id}_email`;
          const phoneKey = `${field.id}_phone`;

          const firstName = formData[firstNameKey];
          const lastName = formData[lastNameKey];
          const email = formData[emailKey];
          const phone = formData[phoneKey];

          // Add individual contact components instead of the contact field itself
          if (firstName) {
            formAnswers.push({
              label: field.firstName?.label || 'First Name',
              answer: firstName,
              type: 'text',
              required: field.firstName?.required || false
            });
          }

          if (lastName) {
            formAnswers.push({
              label: field.lastName?.label || 'Last Name',
              answer: lastName,
              type: 'text',
              required: field.lastName?.required || false
            });
          }

          if (email) {
            formAnswers.push({
              label: field.email?.label || 'Email',
              answer: email,
              type: 'email',
              required: field.email?.required || false
            });
          }

          if (phone) {
            formAnswers.push({
              label: field.phone?.label || 'Phone',
              answer: phone,
              type: 'phone',
              required: field.phone?.required || false
            });
          }

          // Skip adding the contact field itself to avoid showing the ID
          return;
          break;

        case 'email':
        case 'phone':
          answer = formData[field.id];
          break;

        case 'text':
        case 'textarea':
        case 'longtext':
        case 'motivation':
          answer = formData[field.id];
          break;

        case 'file':
          const fileData = formData[field.id];
          if (fileData) {
            // Handle both new object format {url, filename} and legacy URL string
            if (typeof fileData === 'object' && fileData.filename) {
              answer = fileData.filename;
            } else if (typeof fileData === 'string') {
              // For file fields, try to get the original filename if stored separately
              const filenameField = `${field.id}_filename`;
              if (formData[filenameField]) {
                answer = formData[filenameField];
              } else {
                answer = fileData;
              }
            }
          }
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
          required: field.required,
          fieldId: field.id // Add field ID for accessing additional data
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
        coveredKeys.add(`${field.id}_email`);
        coveredKeys.add(`${field.id}_phone`);
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



        <div className="space-y-4">
          {formAnswers.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-8 h-8 border-indigo-100 border rounded-full flex items-center justify-center mt-1">
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
                {item.type === 'file' && formData[item.fieldId] ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const fileData = formData[item.fieldId];
                        const fileUrl = extractFileUrl(fileData) || extractFileUrl(formData[item.fieldId]);
                        const fileName = extractFileName(fileData) || extractFileName(formData[`${item.fieldId}_filename`]);

                        handleViewFile(fileUrl, fileName, item.label || 'File');
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 border-0 bg-transparent cursor-pointer p-0"
                    >
                      <FileTextOutlined className="text-sm" />
                      {(() => {
                        const fileData = formData[item.fieldId];
                        const fileName = extractFileName(fileData) || extractFileName(formData[`${item.fieldId}_filename`]) || 'View File';

                        // Truncate long filenames
                        return fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName;
                      })()}
                    </button>
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
                  (['text', 'longtext', 'motivation', 'textarea'].includes(item.type) && item.answer) ? (
                    <Text className="text-gray-900 font-medium break-words">
                      {renderTextWithLinks(item.answer)}
                    </Text>
                  ) : (
                    <Text className="text-gray-900 font-medium break-words">
                      {item.answer}
                    </Text>
                  )
                )}
              </div>

              {(item.type === 'email' || item.type === 'phone') && (
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
              loading={updatingStage}
              disabled={updatingStage}
              onChange={async (targetStageId) => {
                if (updatingStage) return; // Prevent multiple simultaneous updates

                const previousStageId = candidate?.stageId;
                const newStage = stages.find(s => s.id === targetStageId);
                const newStageName = newStage?.title || newStage?.name || 'Unknown';

                setUpdatingStage(true);

                try {
                  // Optimistic update - immediately update local state
                  const updatedCandidate = {
                    ...candidate,
                    stageId: targetStageId,
                    stage: newStageName
                  };
                  setCandidate(updatedCandidate);

                  // Call parent with immediate update for optimistic UI
                  if (onUpdate) {
                    onUpdate(candidateId, targetStageId);
                  }

                  // Then sync with server in background
                  await ATSService.moveCandidate({
                    targetStage: targetStageId,
                    candidateId: candidateId,
                    destinationCol: [String(candidateId)],
                  });

                  message.success(`Moved to ${newStageName}`);

                  // Final refresh to ensure consistency (shorter delay for better UX)
                  setTimeout(() => {
                    loadCandidateData();
                    if (onUpdate) {
                      onUpdate();
                    }
                  }, 100);

                } catch (e) {
                  console.error('Stage update failed:', e);
                  message.error('Failed to update stage');

                  // Revert optimistic update on error
                  setCandidate({
                    ...candidate,
                    stageId: previousStageId,
                    stage: stages.find(s => s.id === previousStageId)?.title || 'Applied'
                  });
                } finally {
                  setUpdatingStage(false);
                }
              }}
              options={stages.map(s => ({ label: s.title || s.name, value: s.id }))}
            />
            <div className="flex items-center gap-2">
              <Text className="text-lg font-bold" style={{ color: getProgressColor() }}>
                {updatingStage ? (
                  <span className="opacity-60">Updating...</span>
                ) : (
                  `${calculateStageProgress()}%`
                )}
              </Text>
              {updatingStage && (
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
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
              <div className='min-w-[100px] flex flex-1'><Text className="text-xs text-gray-500 ">Email</Text></div>
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
                <div className='min-w-[100px] flex flex-1'><Text className="text-xs text-gray-500 ">Phone</Text></div>
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
              <div className='min-w-[100px] flex flex-1'>
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

      {/* Scheduled Interview Card */}
      {candidate?.interviewMeetingTimestamp && (
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
              <CalendarOutlined className="text-white text-xs" />
            </div>
            <Text className="text-sm font-medium text-gray-900">Scheduled Interview</Text>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarOutlined className="text-purple-600 text-sm" />
                  <Text className="text-sm font-medium text-purple-800">
                    {moment(candidate.interviewMeetingTimestamp).format('dddd, MMMM D, YYYY')}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-purple-600 text-sm" />
                  <Text className="text-sm text-purple-700">
                    {moment(candidate.interviewMeetingTimestamp).format('h:mm A')}
                    {candidate.interviewMeetingTimestampEnd && (
                      <> - {moment(candidate.interviewMeetingTimestampEnd).format('h:mm A')}</>
                    )}
                  </Text>
                </div>
                {candidate.interviewMeetingLink && (
                  <div className="flex items-center gap-2 mt-2">
                    <GlobalOutlined className="text-purple-600 text-sm" />
                    <a
                      href={candidate.interviewMeetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
              {(candidate.calendly_cancel_url || candidate.calendly_reschedule_url) && (
                <div className="flex flex-col gap-1">
                  {candidate.calendly_reschedule_url && (
                    <a
                      href={candidate.calendly_reschedule_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Reschedule
                    </a>
                  )}
                  {candidate.calendly_cancel_url && (
                    <a
                      href={candidate.calendly_cancel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Cancel
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => {
                    // Extract filename from URL if possible
                    let fileName = 'resume';
                    if (resumeUrl && resumeUrl.startsWith('http')) {
                      const urlParts = resumeUrl.split('/');
                      const lastPart = urlParts[urlParts.length - 1];
                      const decodedPart = decodeURIComponent(lastPart);
                      fileName = decodedPart.split('_').pop() || 'resume';
                    }
                    handleViewFile(resumeUrl, fileName, 'Resume');
                  }}
                  className="hover:!text-white"
                >
                  View
                </Button>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={async () => {
                    try {
                      message.loading('Starting download...', 1);
                      // Extract filename from URL if possible
                      let fileName = 'resume';
                      if (resumeUrl && resumeUrl.startsWith('http')) {
                        const urlParts = resumeUrl.split('/');
                        const lastPart = urlParts[urlParts.length - 1];
                        const decodedPart = decodeURIComponent(lastPart);
                        fileName = decodedPart.split('_').pop() || 'resume';
                      }

                      await downloadFile(resumeUrl, fileName);
                      message.success('Download started');
                    } catch (error) {
                      console.error('Download error:', error);
                      message.error('Failed to download file');
                    }
                  }}
                  title="Download"
                >
                  Download
                </Button>
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
              <Button type="default" loading={uploadingResume}>
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
              <Button type="default" loading={uploadingResume} className="text-white bg-[#5207CD] !hover:text-blue-500  px-8">
                Upload Resume
              </Button>
            </Upload>
          </div>
        </div>
      )}
    </div>
  );

  const renderInterviewHistoryTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Typography.Title level={5} className="mb-1">Interview History</Typography.Title>
          <Typography.Text type="secondary">
            {interviewHistory.length} interview{interviewHistory.length !== 1 ? 's' : ''} conducted
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<QuestionCircleOutlined />}
          onClick={() => setInterviewFormVisible(true)}
          className="hover:!text-white"
        >
          New Interview
        </Button>
      </div>

      {loadingInterviews ? (
        <div className="text-center py-8">
          <Typography.Text type="secondary">Loading interviews...</Typography.Text>
        </div>
      ) : interviewHistory.length === 0 ? (
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
          <Typography.Title level={4} type="secondary">No Interviews Yet</Typography.Title>
          <Typography.Text type="secondary" className="block mb-4">
            Start conducting interviews to track candidate progress
          </Typography.Text>
          <Button
            type="primary"
            icon={<QuestionCircleOutlined />}
            onClick={() => setInterviewFormVisible(true)}
            className="hover:!text-white"
          >
            Conduct First Interview
          </Button>

          {/* How it works info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left max-w-sm mx-auto">
            <Typography.Text strong className="text-blue-800 block mb-2">💡 How to Get Started</Typography.Text>
            <ul className="text-sm text-blue-700 space-y-1 mb-0 list-disc pl-4">
              <li>First, create interview templates in the <strong>Interview Templates</strong> panel (click the ? icon in the ATS header)</li>
              <li>Add questions and skills to assess for each pipeline stage</li>
              <li>Then come back here and click "Conduct First Interview"</li>
              <li>Select a template and fill in the candidate's responses</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {interviewHistory.map((interview) => (
            <Card key={interview._id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography.Text strong className="text-base">
                      {interview.templateId?.name || 'Interview'}
                    </Typography.Text>
                    <Tooltip title={`Interview status: ${interview.status === 'completed' ? 'This interview has been completed' : 'This interview is still in draft mode'}`}>
                      <Tag color={interview.status === 'completed' ? 'green' : 'orange'}>
                        {interview.status === 'completed' ? 'Completed' : 'Draft'}
                      </Tag>
                    </Tooltip>
                    <Tooltip title={`Interview stage: ${interview.stageName}`}>
                      <Tag color="blue">{interview.stageName}</Tag>
                    </Tooltip>
                  </div>
                  <Typography.Text type="secondary" className="text-sm block">
                    Conducted by {interview.interviewedBy?.name ||
                      (interview.interviewedBy?.firstName && interview.interviewedBy?.lastName
                        ? `${interview.interviewedBy.firstName} ${interview.interviewedBy.lastName}`.trim()
                        : interview.interviewedBy?.email?.split('@')[0] || 'Unknown')
                    } • {moment(interview.interviewDate).format('MMM DD, YYYY HH:mm')}
                  </Typography.Text>
                </div>
                {interview.overallRating && (
                  <div className="flex items-center gap-1">
                    <Rate disabled value={interview.overallRating} className="text-sm" />
                    <Typography.Text type="secondary" className="text-sm">
                      ({interview.overallRating}/5)
                    </Typography.Text>
                  </div>
                )}
              </div>

              {/* Interview Summary */}
              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-blue-600">{interview.responses?.length || 0}</div>
                  <div className="text-gray-600">Questions</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-green-600">{interview.skillScores?.length || 0}</div>
                  <div className="text-gray-600">Skills</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-purple-600">
                    {interview.skillScores?.length > 0
                      ? Math.round(interview.skillScores.reduce((sum, skill) => sum + skill.score, 0) / interview.skillScores.length * 10) / 10
                      : 'N/A'
                    }
                  </div>
                  <div className="text-gray-600">Avg Score</div>
                </div>
              </div>

              {/* Overall Notes */}
              {interview.overallNotes && (
                <div className="mt-3 p-3 border border-blue-50 text-blue-500 rounded">
                  <Typography.Text strong className="text-sm text-blue-800">Overall Notes:</Typography.Text>
                  <Typography.Paragraph className="mb-0 mt-1 text-sm text-blue-300">
                    {interview.overallNotes}
                  </Typography.Paragraph>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                <Button
                  size="small"
                  type="text"
                  onClick={() => {
                    // Show interview details in a modal
                    Modal.info({
                      title: `Interview Details - ${interview.templateId?.name || 'Interview'}`,
                      content: (
                        <div className="space-y-4">
                          <div>
                            <strong>Status:</strong> {interview.status === 'completed' ? 'Completed' : 'Draft'}
                          </div>
                          <div>
                            <strong>Stage:</strong> {interview.stageName}
                          </div>
                          <div>
                            <strong>Conducted by:</strong> {interview.interviewedBy?.name ||
                              (interview.interviewedBy?.firstName && interview.interviewedBy?.lastName
                                ? `${interview.interviewedBy.firstName} ${interview.interviewedBy.lastName}`.trim()
                                : interview.interviewedBy?.email?.split('@')[0] || 'Unknown')
                            }
                          </div>
                          <div>
                            <strong>Date:</strong> {moment(interview.interviewDate).format('MMM DD, YYYY HH:mm')}
                          </div>
                          {interview.overallRating && (
                            <div>
                              <strong>Overall Rating:</strong> {interview.overallRating}/5
                            </div>
                          )}
                          {interview.overallNotes && (
                            <div>
                              <strong>Overall Notes:</strong>
                              <div className="mt-1 p-2 border-gray-50 rounded text-sm">
                                {interview.overallNotes}
                              </div>
                            </div>
                          )}
                          {interview.responses?.length > 0 && (
                            <div>
                              <strong>Question Responses:</strong>
                              <div className="mt-2 space-y-2">
                                {interview.responses.map((response, idx) => {
                                  // Find the actual question from template
                                  const question = interview.templateId?.questions?.find(q => q.id === response.questionId);
                                  const questionText = question?.question || response.questionId;

                                  return (
                                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                                      <div className="font-medium">Q{idx + 1}: {questionText}</div>
                                      <div className="text-gray-600 mt-1">{response.answer}</div>
                                      {response.notes && (
                                        <div className="text-xs text-gray-500 mt-1 italic">Notes: {response.notes}</div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {interview.skillScores?.length > 0 && (
                            <div>
                              <strong>Skill Scores:</strong>
                              <div className="mt-2 space-y-2">
                                {interview.skillScores.map((skill, idx) => {
                                  // Find the actual skill from template
                                  const skillTemplate = interview.templateId?.skills?.find(s => s.id === skill.skillId);
                                  const skillName = skillTemplate?.name || skill.skillId;
                                  const maxScore = skillTemplate?.maxScore || 10;

                                  return (
                                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">{skillName}</span>
                                        <span className="text-blue-600 font-bold">{skill.score}/{maxScore}</span>
                                      </div>
                                      {skillTemplate?.description && (
                                        <div className="text-xs text-gray-500 mt-1">{skillTemplate.description}</div>
                                      )}
                                      {skill.notes && (
                                        <div className="text-xs text-gray-500 mt-1 italic">Notes: {skill.notes}</div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                      width: 700,
                      okText: 'Close',
                    });
                  }}
                >
                  View Details
                </Button>
                {interview.status === 'draft' && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      // TODO: Open interview form with existing data
                      setInterviewFormVisible(true);
                    }}
                    className="hover:!text-white"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Convert URLs inside plain text to clickable links (used for text-like form answers)
  const renderTextWithLinks = (text) => {
    if (!text) return null;
    const urlPattern = /(https?:\/\/[^\s]+)/gi;
    const parts = String(text).split(urlPattern);
    return parts.map((part, idx) => {
      const isUrl = /^https?:\/\/[^\s]+$/i.test(part);
      if (isUrl) {
        return (
          <a
            key={`link-${idx}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium break-words"
          >
            {part}
          </a>
        );
      }
      return <span key={`text-${idx}`}>{part}</span>;
    });
  };

  // Highlight @mentions in note text
  const renderNoteWithMentions = (text) => {
    if (!text) return null;
    const parts = String(text).split(/(@[^\s]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith && part.startsWith('@')) {
        return (
          <span key={`m-${idx}`} className="text-blue-600">
            {part}
          </span>
        );
      }
      return <span key={`t-${idx}`}>{part}</span>;
    });
  };

  const renderNotesTab = () => (
    <div className="space-y-6 p-4">
      {/* Add Note */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="space-y-3">
          <div>
            <Text className="text-sm font-medium text-gray-700 mb-2 block">Add Internal Note</Text>
            <Mentions
              value={newNote}
              onChange={(val) => setNewNote(val)}
              prefix="@"
              rows={3}
              placeholder="Add a note about this candidate... Use @ to mention teammates"
            >
              {teamMembers
                .filter(u => (u.email || '').toLowerCase() !== (currentUser?.email || '').toLowerCase())
                .map((u) => {
                  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                  return (
                    <MentionsOption key={u._id} value={u.email}>
                      {name ? `${name} (${u.email})` : u.email}
                    </MentionsOption>
                  );
                })}
            </Mentions>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={addNote}
              disabled={!newNote.trim()}
              size="small"
              className="hover:!text-white"
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
                <Paragraph className="m-0 text-gray-700">
                  {renderNoteWithMentions(note.note)}
                </Paragraph>
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

  const renderCommunicationTab = () => {
    const sent = candidate?.emailSent || [];
    const received = candidate?.emailReceived || [];
    const combined = [
      ...received.map((m) => ({ ...m, direction: 'in' })),
      ...sent.map((m) => ({ ...m, direction: 'out' })),
    ].sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));

    return (
      <div className="space-y-4 p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MailOutlined />
              <Text className="text-sm font-medium text-gray-900">Email Communication</Text>
            </div>
            <Text className="text-xs text-gray-500">
              {combined.length} messages
            </Text>
          </div>
          <List
            dataSource={combined}
            renderItem={(item) => (
              <List.Item className="!border-b-gray-100 !px-0">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.direction === 'in' ? (
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Received</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">Sent</span>
                      )}
                      <Text className="text-sm font-medium text-gray-900">
                        {item.subject || '(no subject)'}
                      </Text>
                    </div>
                    <Text className="text-xs text-gray-500">
                      {moment(item.timestamp || item.createdAt).format('MMM DD, YYYY HH:mm')}
                    </Text>
                  </div>
                  <div className="mt-1">
                    <Text className="text-xs text-gray-500">
                      {item.direction === 'in'
                        ? `From: ${item.from || 'Candidate'}`
                        : (() => {
                          const u = item.user_id;
                          if (u && typeof u === 'object') {
                            const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                            const email = u.email || '';
                            if (name && email) return `From: ${name} <${email}>`;
                            if (name) return `From: ${name}`;
                            if (email) return `From: ${email}`;
                          }
                          return `From: ${u || 'Recruiter'}`;
                        })()}
                    </Text>
                  </div>
                  <Paragraph className="m-0 mt-2 text-gray-700 whitespace-pre-wrap">
                    {(item.body || item.message || '').toString().slice(0, 1000)}
                  </Paragraph>
                </div>
              </List.Item>
            )}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <Text className="text-gray-500">No email communication yet</Text>
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  };

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
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${index === currentIndex
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
      width={750}
      className="candidate-profile-drawer"
      bodyStyle={{
        padding: 0,
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
      headerStyle={{ display: 'none' }}
      maskClosable={true}
      destroyOnClose={false}
      push={false}
      autoFocus={false}
      getContainer={() => document.body}
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
            key: 'communication',
            label: (
              <div className="flex items-center gap-2">
                <MailOutlined />
                <span>Communication</span>
              </div>
            ),
            children: (
              <div className="communication-tab-content">
                {renderCommunicationTab()}
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
            key: 'interview',
            label: (
              <div className="flex items-center gap-2">
                <QuestionCircleOutlined />
                <span>Interview</span>
              </div>
            ),
            children: (
              <div className="interview-tab-content">
                {renderInterviewHistoryTab()}
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

      {/* File Viewer Modal */}
      <FileViewer
        visible={fileViewerVisible}
        onClose={() => setFileViewerVisible(false)}
        fileUrl={viewingFile.url}
        fileName={viewingFile.fileName}
        title={viewingFile.title}
      />

      {/* Interview Form Modal */}
      <InterviewFormModal
        visible={interviewFormVisible}
        onCancel={() => setInterviewFormVisible(false)}
        candidate={candidate}
        currentStage={candidate?.stageName || candidate?.stage || stages.find(s => s.id === candidate?.stageId)?.title || stages.find(s => s.id === candidate?.stageId)?.name}
        onInterviewComplete={(candidateId, stage) => {
          // Refresh candidate data and interview history after interview completion
          loadCandidateData();
          loadInterviewHistory();
          setInterviewFormVisible(false);
        }}
        onOpenTemplates={() => {
          setInterviewFormVisible(false);
          setTemplatesModalVisible(true);
        }}
      />

      {/* Interview Templates Modal */}
      <InterviewTemplatesModal
        visible={templatesModalVisible}
        onCancel={() => setTemplatesModalVisible(false)}
        stages={stages}
      />
    </Drawer>
  );
};

export default CandidateProfile; 