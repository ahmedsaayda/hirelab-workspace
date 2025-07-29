import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Input, 
  Table, 
  Modal, 
  message, 
  Dropdown, 
  Avatar, 
  Rate,
  Drawer,
  Tabs,
  Tag,
  Skeleton,
  Checkbox,
  DatePicker,
  Select,
  Divider,
  Collapse,
  Space
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  MoreOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  StarOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/router';
import ATSService from '../../../services/ATSService';
import CrudService from '../../../services/CrudService';
import TeamService from '../../../services/TeamService';
import CandidateChatService from '../../../services/CandidateChatService';
import moment from 'moment';
import { selectUser } from '../../../redux/auth/selectors';

// Import modern component sub-components
import CandidateCard from './components/CandidateCard';
import AddCandidateModal from './components/AddCandidateModal';
import CandidateProfile from './components/CandidateProfile';
import AssignmentModal from './components/AssignmentModal';
import InterviewSchedulingModal from './components/InterviewSchedulingModal';

// Add table styles for enhanced sorting UI
const tableStyles = `
  .candidate-table .ant-table-thead > tr > th {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 600;
    color: #374151;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .candidate-table .ant-table-thead > tr > th:hover {
    background: #f1f5f9;
    color: #1f2937;
  }
  
  .candidate-table .ant-table-thead > tr > th.ant-table-column-sort {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .candidate-table .ant-table-column-sorter {
    color: #9ca3af;
  }
  
  .candidate-table .ant-table-column-sorter-up.active,
  .candidate-table .ant-table-column-sorter-down.active {
    color: #5207cd;
  }
  
  .candidate-table .ant-table-tbody > tr:hover > td {
    background: #f8fafc !important;
    cursor: pointer;
  }
  
  .candidate-table .ant-table-row-selected > td {
    background: #dbeafe !important;
  }
  
  .candidate-table .ant-table-row-selected:hover > td {
    background: #bfdbfe !important;
  }
  
  .candidate-table .ant-pagination {
    margin: 16px 0;
    padding: 16px 24px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .candidate-table .ant-pagination-total-text {
    color: #64748b;
    font-weight: 500;
    font-size: 14px;
  }
  
  .candidate-table .ant-pagination-item {
    border-radius: 6px;
    font-weight: 500;
  }
  
  .candidate-table .ant-pagination-item-active {
    background: #5207cd;
    border-color: #5207cd;
  }
  
  .candidate-table .ant-pagination-item-active a {
    color: white;
  }
  
  .candidate-table .ant-pagination-options-size-changer {
    margin-right: 8px;
  }
  
  .candidate-table .ant-pagination-options-quick-jumper {
    margin-left: 8px;
  }
  
  /* Interactive Rating Styles */
  .candidate-table .ant-rate {
    font-size: 12px !important;
    line-height: 1;
  }
  
  .candidate-table .ant-rate-star {
    margin-right: 2px;
    transition: all 0.2s ease;
  }
  
  .candidate-table .ant-rate-star:hover {
    transform: scale(1.15);
  }
  
  .candidate-table .ant-rate-star-full .ant-rate-star-first,
  .candidate-table .ant-rate-star-full .ant-rate-star-second {
    color: #fbbf24;
  }
  
  .candidate-table .ant-rate-star-zero .ant-rate-star-first,
  .candidate-table .ant-rate-star-zero .ant-rate-star-second {
    color: #d1d5db;
  }
  
  .candidate-table .ant-rate-star:hover .ant-rate-star-first,
  .candidate-table .ant-rate-star:hover .ant-rate-star-second {
    color: #f59e0b !important;
  }
  
  .candidate-table .ant-rate .ant-rate-star-focused {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    border-radius: 2px;
  }
  
  /* Rating Loading Styles */
  .candidate-table .ant-rate.updating {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .rating-loading-spinner {
    width: 12px;
    height: 12px;
    border: 1.5px solid #e5e7eb;
    border-top: 1.5px solid #5207cd;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Rating Column Styling */
  .candidate-table .ant-table-cell:has(.ant-rate) {
    white-space: nowrap;
    min-width: 140px;
  }
  
  .candidate-table .ant-rate {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: nowrap;
  }

  /* Rating Update Animation */
  .rating-updated {
    animation: ratingPulse 0.6s ease-out;
  }
  
  @keyframes ratingPulse {
    0% { 
      transform: scale(1);
      background-color: transparent;
    }
    50% { 
      transform: scale(1.05);
      background-color: rgba(59, 130, 246, 0.1);
    }
    100% { 
      transform: scale(1);
      background-color: transparent;
    }
  }
`;

// Modern header styles
const headerStyles = `
  /* ATS Header Styles */
  .ats-header .ats-search-input .ant-input-search {
    border-radius: 8px !important;
    border: 1px solid #d1d5db !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
    background: white !important;
    height: 40px !important;
    display: flex !important;
    align-items: stretch !important;
    overflow: hidden !important;
  }
  
  .ats-header .ats-search-input .ant-input-search:hover {
    border-color: #5207cd !important;
    box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input-search:focus-within {
    border-color: #5207cd !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    font-size: 14px !important;
    color: #374151 !important;
    height: 38px !important;
    padding: 0 16px !important;
    line-height: 1.4 !important;
  }
  
  .ats-header .ats-search-input .ant-input::placeholder {
    color: #9ca3af !important;
    font-size: 14px !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button {
    border: none !important;
    background: #5207cd !important;
    color: white !important;
    border-radius: 0 8px 8px 0 !important;
    font-weight: 500 !important;
    height: 40px !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 16px !important;
    margin: 0 !important;
    line-height: 1 !important;
    font-size: 14px !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button:hover {
    background: #4a06b9 !important;
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2) !important;
    transform: none !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button:active {
    background: #1d4ed8 !important;
    transform: none !important;
  }
  
  .ats-header .ats-search-input .ant-input-clear-icon {
    color: #9ca3af !important;
    font-size: 12px !important;
  }
  
  .ats-header .ats-search-input .ant-input-clear-icon:hover {
    color: #6b7280 !important;
  }
  
  /* Search input container styling */
  .ats-header .ats-search-input {
    position: relative;
  }
  

  
  .ats-header .ats-search-input .ant-input-group {
    display: flex !important;
    height: 40px !important;
  }
  
  .ats-header .ats-search-input .ant-input-group-addon {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    height: 40px !important;
    display: flex !important;
    align-items: stretch !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button .anticon {
    font-size: 14px !important;
    margin-right: 4px !important;
  }
  
  /* Fix any potential border conflicts */
  .ats-header .ats-search-input .ant-input-group .ant-input:last-child {
    border-radius: 8px 0 0 8px !important;
  }
  
  /* Ensure proper alignment and no overflow issues */
  .ats-header .ats-search-input * {
    box-sizing: border-box !important;
  }
  
  .ats-header .ats-search-input .ant-input-search .ant-input-group {
    width: 100% !important;
    display: flex !important;
  }
  
  .ats-header .ats-search-input .ant-input-search .ant-input-group .ant-input {
    flex: 1 !important;
  }
  
  .ats-header .ats-search-input .ant-input-affix-wrapper {
    border-radius: 8px !important;
    border: 1px solid #d1d5db !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
    background: white !important;
    height: 40px !important;
    overflow: hidden !important;
  }
  
  .ats-header .ats-search-input .ant-input-affix-wrapper:hover {
    border-color: #5207cd !important;
    box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input-affix-wrapper-focused {
    border-color: #5207cd !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  /* View Toggle Buttons */
  .ats-header .ant-btn.view-toggle-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease !important;
    border-radius: 0 !important;
  }
  
  .ats-header .ant-btn.view-toggle-btn:first-child {
    border-radius: 6px 0 0 6px !important;
  }
  
  .ats-header .ant-btn.view-toggle-btn:last-child {
    border-radius: 0 6px 6px 0 !important;
  }
  
  .ats-header .view-toggle-container {
    position: relative;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .ats-header .view-toggle-container .ant-btn + .ant-btn {
    border-left: 1px solid #e5e7eb;
  }
  
  .ats-header .view-toggle-container .ant-btn.bg-blue-600 + .ant-btn:not(.bg-blue-600) {
    border-left: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .ats-header .view-toggle-container .ant-btn:not(.bg-blue-600) + .ant-btn.bg-blue-600 {
    border-left: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  /* Pipeline Stage Color Bars */
  .pipeline-stage-color-bar {
    height: 6px;
    width: 100%;
    border-radius: 0;
    margin: 0;
    transition: all 0.2s ease;
    background: linear-gradient(135deg, var(--color) 0%, var(--color) 100%);
  }
  
  .pipeline-stage-header {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease;
    border-bottom: none;
  }
  
  .pipeline-stage-header:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Connected column styling */
  .pipeline-column {
    display: flex;
    flex-direction: column;
    height: fit-content;
    background: transparent;
  }
  
  .pipeline-droppable-area {
    border-top: none;
    margin-top: -1px;
    min-height: 400px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  
  .pipeline-droppable-area:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Empty state styling */
  .pipeline-droppable-area:empty::after {
    content: '';
    display: block;
    height: 100px;
  }
  
  .ats-header .ant-btn {
    border-radius: 6px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease !important;
    border: 1px solid #d1d5db !important;
  }
  
  .ats-header .ant-btn:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  }
  
  .ats-header .ant-btn-primary {
    background: linear-gradient(135deg, #5207cd 0%, #4a06b9 100%) !important;
    border-color: #5207cd !important;
    color: white !important;
    box-shadow: 0 1px 2px 0 rgba(59, 130, 246, 0.2) !important;
  }
  
  .ats-header .ant-btn-primary:hover {
    background: linear-gradient(135deg, #4a06b9 0%, #1d4ed8 100%) !important;
    border-color: #4a06b9 !important;
    color: white !important;
    box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.4) !important;
  }
  
  .ats-header h1 {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
`;

// Inject table styles
if (typeof document !== 'undefined' && !document.querySelector('#candidate-table-styles')) {
  const tableStyleSheet = document.createElement('style');
  tableStyleSheet.id = 'candidate-table-styles';
  tableStyleSheet.textContent = tableStyles;
  document.head.appendChild(tableStyleSheet);
}

// Inject header styles
if (typeof document !== 'undefined' && !document.querySelector('#ats-header-styles')) {
  const headerStyleSheet = document.createElement('style');
  headerStyleSheet.id = 'ats-header-styles';
  headerStyleSheet.textContent = headerStyles;
  document.head.appendChild(headerStyleSheet);
}

const { Search } = Input;
const { TabPane } = Tabs;

const NewATS = ({ VacancyId, vacancyInfo, isMultiJobView = false }) => {
  // Get current user
  const user = useSelector(selectUser);
  
  // Debug: Log component props
  console.log('🔍 NewATS Component Props:', {
    VacancyId,
    vacancyInfo: vacancyInfo?.name,
    isMultiJobView,
    user: user?._id
  });
  
  // State management
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'table'
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [dataRefreshing, setDataRefreshing] = useState(false); // Non-blocking refresh
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchPending, setSearchPending] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  
  // Bulk action states
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Granular loading states for better UX
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [columnOperationLoading, setColumnOperationLoading] = useState({});
  
  // Rating update states
  const [updatingRatings, setUpdatingRatings] = useState(new Set());
  const [recentlyUpdatedRatings, setRecentlyUpdatedRatings] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    stages: [], // array of stage IDs
    ratings: [], // array of rating values (1-5)
    dateRange: null, // { start: Date, end: Date }
    showRejected: false,
    assignees: [] // array of assignee user IDs
  });
  const [showFilters, setShowFilters] = useState(false);

    // Update candidate rating handler
    const handleRatingUpdate = async (candidateId, newRating) => {
        // Prevent multiple updates for the same candidate
        if (updatingRatings.has(candidateId)) {
          return;
        }
        
        try {
          console.log('⭐ Updating candidate rating:', { candidateId, newRating });
          
          // Add to updating set
          setUpdatingRatings(prev => new Set([...prev, candidateId]));
          
          // Optimistic update - update UI immediately in both pipeline and candidates data
          setCandidates(prevCandidates => 
            prevCandidates.map(candidate => 
              candidate.id === candidateId 
                ? { ...candidate, stars: newRating }
                : candidate
            )
          );
          
          // Also update pipeline data for immediate UI update
          setPipelineData(prevPipelineData => ({
            ...prevPipelineData,
            columns: prevPipelineData.columns.map(column => ({
              ...column,
              cards: column.cards.map(candidate => 
                candidate.id === candidateId 
                  ? { ...candidate, stars: newRating }
                  : candidate
              )
            }))
          }));
          
          // Update in backend
          await CrudService.update('VacancySubmission', candidateId, { 
            stars: newRating 
          });
          
          const ratingText = newRating === 0 ? 'Rating cleared' : `Rating updated to ${newRating} star${newRating !== 1 ? 's' : ''}`;
          message.success(ratingText);
          
          // Add to recently updated for animation
          setRecentlyUpdatedRatings(prev => new Set([...prev, candidateId]));
          
          // Remove from recently updated after animation completes
          setTimeout(() => {
            setRecentlyUpdatedRatings(prev => {
              const newSet = new Set(prev);
              newSet.delete(candidateId);
              return newSet;
            });
          }, 600);
          
        } catch (error) {
          console.error('❌ Error updating rating:', error);
          message.error('Failed to update rating');
          
          // Revert optimistic update on error
          loadATSData({ isBackgroundRefresh: true });
        } finally {
          // Remove from updating set
          setUpdatingRatings(prev => {
            const newSet = new Set(prev);
            newSet.delete(candidateId);
            return newSet;
          });
        }
      };
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    // Persist page size preference in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ats-table-page-size');
      return saved ? parseInt(saved, 10) : 25;
    }
    return 25;
  });
  
  // Modal states
  const [addCandidateModal, setAddCandidateModal] = useState(false);
  const [selectedStageForAdd, setSelectedStageForAdd] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [selectedCandidateForAssignment, setSelectedCandidateForAssignment] = useState(null);
  const [interviewSchedulingModal, setInterviewSchedulingModal] = useState(false);
  const [selectedCandidateForScheduling, setSelectedCandidateForScheduling] = useState(null);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [addingColumn, setAddingColumn] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [candidates, setCandidates] = useState([]);
  
  // Team states
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  // Keyboard shortcuts for bulk actions and rating
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only trigger when table view is active
      if (viewMode !== 'table') return;
      
      // Number keys (1-5) for rating when a single candidate is selected
      if (selectedCandidates.length === 1 && /^[1-5]$/.test(event.key)) {
        event.preventDefault();
        const rating = parseInt(event.key, 10);
        const candidateId = selectedCandidates[0];
        handleRatingUpdate(candidateId, rating);
        console.log(`⌨️ Keyboard rating: ${rating} stars for candidate ${candidateId}`);
        return;
      }
      
      // 0 key to clear rating when a single candidate is selected
      if (selectedCandidates.length === 1 && event.key === '0') {
        event.preventDefault();
        const candidateId = selectedCandidates[0];
        handleRatingUpdate(candidateId, 0);
        console.log(`⌨️ Keyboard rating cleared for candidate ${candidateId}`);
        return;
      }
      
      // Bulk action shortcuts (only when candidates are selected)
      if (selectedCandidates.length === 0) return;
      
      // Cmd/Ctrl + A: Select all
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        event.preventDefault();
        setSelectedCandidates(candidates.map(c => c.id));
      }
      
      // Escape: Clear selection
      if (event.key === 'Escape') {
        setSelectedCandidates([]);
      }
      
      // Delete key: Show delete confirmation
      if (event.key === 'Delete' && selectedCandidates.length > 0) {
        event.preventDefault();
        setBulkDeleteModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedCandidates, candidates, handleRatingUpdate]);
  
  // Data states
  const [pipelineData, setPipelineData] = useState({
    columns: []
  });
  const [allVacancies, setAllVacancies] = useState([]); // Store all user vacancies for filter dropdown

  const router = useRouter();

  // Load ATS data with enhanced search using VacancySubmissions
  const loadATSData = useCallback(async (options = {}) => {
    // Don't load data if user is not available yet
    if (!user || !user._id) {
      console.log('⏳ Waiting for user to be available...');
      return;
    }
    
    const { 
      isInitialLoad = false, 
      isBackgroundRefresh = false, 
      skipCandidates = false,
      skipStages = false 
    } = options;
    
    // Smart loading state management
    if (isInitialLoad) {
      setInitialLoading(true);
    } else if (!isBackgroundRefresh) {
      setDataRefreshing(true);
    }
    
    if (!skipCandidates) setCandidatesLoading(true);
    if (!skipStages) setColumnsLoading(true);
    try {
      if (isMultiJobView) {
        console.log('🔄 Loading ATS data for ALL vacancies (multi-job view) - User:', user._id);
      } else {
        console.log('🔄 Loading ATS data for vacancy:', VacancyId, '- User:', user._id);
      }
      
      // First, ensure we have default stages
      console.log('🔄 LOAD DEBUG: About to call ensureDefaultStages...');
      console.log('🔄 LOAD DEBUG: VacancyId:', VacancyId);
      console.log('🔄 LOAD DEBUG: Current time:', new Date().toISOString());
      let stages = await ensureDefaultStages();
      console.log('📋 LOAD DEBUG: Loaded stages from ensureDefaultStages:', stages.map(s => ({ name: s.name, id: s._id })));
      console.log(`📊 LOAD DEBUG: Total stage count: ${stages.length}`);
      
      if (stages.length === 0) {
        console.log('🚨 WARNING: ensureDefaultStages returned empty array!');
        console.log('🚨 This means no stages will be displayed!');
      }
      
      if (isMultiJobView) {
        console.log('🔍 Searching for ALL candidates across all user vacancies');
      } else {
        console.log('🔍 Searching for candidates with LandingPageDataId:', VacancyId);
      }
      
      // Try multiple search approaches
      let allCandidates = [];
      let fetchedVacancies = [];
      
      // Always fetch user's vacancies for filter dropdown (both single and multi-job view)
      try {
        console.log('🔍 Fetching user vacancies for filter dropdown - User ID:', user?._id);
        const vacanciesResponse = await CrudService.search('LandingPageData', 1000, 1, {
          filters: {
            user_id: user._id
          },
          sort: { createdAt: -1 }
        });
        fetchedVacancies = vacanciesResponse.data?.items || vacanciesResponse.data?.data || [];
        console.log('📋 Total vacancies found for user:', fetchedVacancies.length);
        
        if (fetchedVacancies.length > 0) {
          console.log('📋 First 3 vacancies:', fetchedVacancies.slice(0, 3).map(v => ({
            id: v._id,
            title: v.vacancyTitle,
            location: v.location,
            department: v.department
          })));
        }
        
        // Store for filter dropdown
        setAllVacancies(fetchedVacancies);
        
              } catch (error) {
          console.error('❌ Error fetching vacancies:', error);
          // Set empty array as fallback to prevent UI errors
          setAllVacancies([]);
        }
      
      if (isMultiJobView) {
        // Multi-job view: Get all candidates across all user vacancies
        try {
          console.log('🔍 Fetching all candidates for multi-job view');
          const candidatesResponse = await CrudService.search('VacancySubmission', 1000, 1, {
            populate: "assignedTo",
            filters: {
              // LandingPageDataId: {
              //   $in: fetchedVacancies.map(v => v._id)
              // }
              user_id: user._id
            }
          });
          console.log('👥 All candidates response:', candidatesResponse);
          allCandidates = candidatesResponse.data?.items || candidatesResponse.data?.data || [];
          console.log('👥 Total candidates found (all vacancies):', allCandidates.length);
          
        } catch (error) {
          console.error('❌ Error fetching all candidates:', error);
        }
      } else {
        // Single vacancy view: Search by LandingPageDataId
        try {
          console.log('🔍 Attempting search with params:', { LandingPageDataId: VacancyId });
          const candidatesResponse1 = await CrudService.search('VacancySubmission', 1000, 1, {
            filters: { LandingPageDataId: VacancyId },
            populate: "assignedTo"
          });
          console.log('👥 Raw candidates response:', candidatesResponse1);
          console.log('👥 Response data structure:', candidatesResponse1.data);
          allCandidates = candidatesResponse1.data?.items || candidatesResponse1.data?.data || [];
          console.log('👥 Extracted candidates array:', allCandidates);
          console.log('👥 Loaded candidates (method 1):', allCandidates.length);
        } catch (error) {
          console.error('❌ Error with method 1:', error);
          console.error('❌ Error details:', error.response?.data || error.message);
        }
      }
      
        // Approach 2: If no results and single vacancy view, try getting all submissions and filter manually
        if (allCandidates.length === 0 && !isMultiJobView) {
          try {
            console.log('🔄 Trying fallback approach - get all candidates');
            const candidatesResponse2 = await CrudService.search('VacancySubmission', 1000, 1, {
              populate: "assignedTo"
            });
            console.log('👥 All candidates response:', candidatesResponse2);
            const allSubmissions = candidatesResponse2.data?.items || candidatesResponse2.data?.data || [];
            
            console.log('👥 Total submissions found:', allSubmissions.length);
            
            if (allSubmissions.length > 0) {
              console.log('📝 First 3 submission structures:');
              allSubmissions.slice(0, 3).forEach((sub, index) => {
                console.log(`📝 Submission ${index + 1}:`, {
                  id: sub._id,
                  landingPageId: sub.LandingPageDataId,
                  targetId: VacancyId,
                  formData: sub.formData,
                  name: sub.formData?.firstname || sub.formData?.fullname
                });
              });
            }
            
            // Filter manually with multiple approaches
            allCandidates = allSubmissions.filter(candidate => {
              const landingPageId = candidate.LandingPageDataId;
              const match1 = landingPageId?.toString() === VacancyId?.toString();
              const match2 = landingPageId?.$oid === VacancyId;
              const match3 = landingPageId === VacancyId;
              
              console.log(`🔍 Candidate ${candidate._id} match check:`, {
                landingPageId,
                targetId: VacancyId,
                match1, match2, match3
              });
              
              return match1 || match2 || match3;
            });
            
            console.log('👥 Filtered candidates for this vacancy:', allCandidates.length);
          } catch (error) {
            console.error('❌ Error with method 2:', error);
            console.error('❌ Error details:', error.response?.data || error.message);
          }
        }
        
        // Approach 3: Try CrudService with different search params (single vacancy only)
        if (allCandidates.length === 0 && !isMultiJobView) {
          try {
            console.log('🔄 Trying CrudService with alternative search params');
            const alternativeResponse = await CrudService.search('VacancySubmission', 1000, 1, {
              filters: { LandingPageDataId: VacancyId },
              text: "",
              sort: { createdAt: -1 },
              populate: "assignedTo"
            });
            console.log('👥 Alternative CrudService response:', alternativeResponse);
            allCandidates = alternativeResponse.data?.items || alternativeResponse.data?.data || [];
            console.log('👥 Alternative CrudService candidates found:', allCandidates.length);
          } catch (error) {
            console.error('❌ Error with method 3:', error);
          }
        }
      
      // Enrich candidates with vacancy information for multi-job view
      if (isMultiJobView && fetchedVacancies.length > 0) {
        const vacancyMap = {};
        fetchedVacancies.forEach(vacancy => {
          vacancyMap[vacancy._id] = {
            name: vacancy.vacancyTitle || 'Untitled Vacancy',
            location: vacancy.location,
            department: vacancy.department
          };
        });
        
        console.log('🗺️ Created vacancy map:', Object.keys(vacancyMap).length, 'vacancies');
        console.log('🗺️ Vacancy map sample:', Object.entries(vacancyMap).slice(0, 3));
        
        allCandidates = allCandidates.map(candidate => {
          const vacancyInfo = vacancyMap[candidate.LandingPageDataId];
          console.log(`👤 Candidate ${candidate._id}: LandingPageDataId=${candidate.LandingPageDataId}, found vacancy=${!!vacancyInfo}`);
          return {
            ...candidate,
            vacancyInfo: vacancyInfo || { 
              name: 'Unknown Vacancy', 
              location: '', 
              department: '' 
            }
          };
        });
        
        console.log('✨ Enriched candidates with vacancy info for multi-job view');
        console.log('✨ Sample enriched candidate:', allCandidates[0] ? {
          id: allCandidates[0]._id,
          landingPageId: allCandidates[0].LandingPageDataId,
          vacancyInfo: allCandidates[0].vacancyInfo
        } : 'No candidates found');
      }
      
      if (allCandidates.length > 0) {
        console.log('📝 First candidate sample:', {
          id: allCandidates[0]._id,
          name: allCandidates[0].formData?.firstname || allCandidates[0].formData?.fullname,
          email: allCandidates[0].formData?.email,
          stageId: allCandidates[0].stageId,
          landingPageId: allCandidates[0].LandingPageDataId,
          vacancyInfo: allCandidates[0].vacancyInfo
        });
      }
      
      // Group candidates by stage
      console.log('🔍 Stage filtering:', {
        activeStageFilter: filters.stages,
        totalStages: stages.length,
        stageNames: stages.map(s => s.name)
      });
      
      const boardColumns = stages.map(stage => {
        // Skip stage if stage filter is active and this stage is not selected
        if (filters.stages.length > 0 && !filters.stages.includes(stage._id)) {
          console.log(`🚫 Skipping stage "${stage.name}" (${stage._id}) - not in stage filter:`, filters.stages);
          return {
            id: stage._id,
            title: stage.name,
            sort: stage.sort || 0,
            cards: []
          };
        }
        
        const stageCandidates = allCandidates.filter(candidate => 
          candidate.stageId === stage._id ||
          (!candidate.stageId && stage.name === 'Applied') // Default to "Applied" if no stage
        );
        
        // Apply comprehensive filters
        const filteredCandidates = stageCandidates.filter(candidate => {
          const formData = candidate.formData || {};
          
          // 1. Search filter
          if (debouncedSearchTerm) {
            const searchTermLower = debouncedSearchTerm.toLowerCase();
            
            // Extract data for searching
            let fullname = formData.fullname || formData.firstname || '';
            if (!fullname && formData.firstname && formData.lastname) {
              fullname = `${formData.firstname} ${formData.lastname}`;
            }
            const contactFirstName = Object.keys(formData).find(key => key.includes('firstName'));
            const contactLastName = Object.keys(formData).find(key => key.includes('lastName'));
            if (!fullname && contactFirstName && contactLastName) {
              fullname = `${formData[contactFirstName]} ${formData[contactLastName]}`;
            }
            
            let email = formData.email || '';
            if (!email) {
              const emailField = Object.keys(formData).find(key => key.includes('email'));
              if (emailField) email = formData[emailField];
            }
            
            let phone = formData.phone || '';
            if (!phone) {
              const phoneField = Object.keys(formData).find(key => key.includes('phone'));
              if (phoneField) phone = formData[phoneField];
            }
            
            const matchesSearch = (
              fullname?.toLowerCase().includes(searchTermLower) ||
              email?.toLowerCase().includes(searchTermLower) ||
              phone?.includes(debouncedSearchTerm) ||
              candidate.searchIndex?.toLowerCase().includes(searchTermLower)
            );
            
            if (!matchesSearch) return false;
          }
          
          // 2. Rating filter
          if (filters.ratings.length > 0) {
            const candidateRating = candidate.stars || 0;
            if (!filters.ratings.includes(candidateRating)) {
              return false;
            }
          }
          
          // 3. Date range filter
          if (filters.dateRange) {
            const candidateDate = new Date(candidate.createdAt);
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            endDate.setHours(23, 59, 59, 999); // Include end of day
            
            if (candidateDate < startDate || candidateDate > endDate) {
              return false;
            }
          }
          
          // 4. Rejected filter
          if (!filters.showRejected && candidate.rejected) {
            return false;
          }
          
          // 5. Vacancy filter (for multi-job view)
          if (isMultiJobView && filters.vacancies && filters.vacancies.length > 0) {
            const candidateVacancy = candidate.vacancyInfo?.name;
            if (!candidateVacancy || !filters.vacancies.includes(candidateVacancy)) {
              return false;
            }
          }
          
          // 6. Assignee filter
          if (filters.assignees.length > 0) {
            const candidateAssigneeId = candidate.assignedTo?._id || candidate.assignedTo;
            const isUnassigned = !candidateAssigneeId;
            
            // Check if "unassigned" is selected and candidate is unassigned
            if (filters.assignees.includes('unassigned') && isUnassigned) {
              // Allow unassigned candidates if "unassigned" is selected
            }
            // Check if candidate is assigned to a selected team member
            else if (candidateAssigneeId && filters.assignees.includes(candidateAssigneeId)) {
              // Allow assigned candidates if their assignee is selected
            }
            // Otherwise, filter out this candidate
            else {
              return false;
            }
          }
          
          return true;
        });
          
        console.log(`🔍 Stage "${stage.name}": ${stageCandidates.length} → ${filteredCandidates.length} candidates after filter`);
        
        return {
          id: stage._id,
          title: stage.name,
          sort: stage.sort || 0,
          cards: filteredCandidates.map(candidate => {
            const formData = candidate.formData || {};
            
            // Extract name from different possible field structures
            console.log('🔍 Extracting name from formData:', Object.keys(formData));
            
            let fullname = '';
            
            // Method 1: Check for existing fullname
            if (formData.fullname) {
              fullname = formData.fullname;
            }
            // Method 2: Combine firstname + lastname
            else if (formData.firstname && formData.lastname) {
              fullname = `${formData.firstname} ${formData.lastname}`;
            }
            // Method 3: Handle dynamic contact field structure
            else {
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
            
            console.log('📝 Extracted fullname:', fullname);
            
            // Extract email from different possible fields
            let email = formData.email || '';
            if (!email) {
              const emailField = Object.keys(formData).find(key => key.includes('email'));
              if (emailField) email = formData[emailField];
            }
            console.log('📧 Extracted email:', email);
            
            // Extract phone from different possible fields  
            let phone = formData.phone || '';
            if (!phone) {
              const phoneField = Object.keys(formData).find(key => key.includes('phone'));
              if (phoneField) phone = formData[phoneField];
            }
            console.log('📞 Extracted phone:', phone);

            // Extract avatar - for form submissions, there usually isn't an avatar
            let avatar = null;
            if (candidate.formData?.avatar && candidate.formData.avatar.trim()) {
              avatar = candidate.formData.avatar;
            } else {
              // Check for image upload field
              const imageField = Object.keys(formData).find(key => 
                key.includes('image') || key.includes('photo') || key.includes('avatar')
              );
              if (imageField && formData[imageField] && formData[imageField].trim()) {
                avatar = formData[imageField];
              }
            }
            
            const cardData = {
              id: candidate._id,
              fullname: fullname || 'Unknown',
              email: email,
              phone: phone,
              avatar: avatar, // null instead of empty string prevents broken image
              stars: candidate.stars || 0,
              createdAt: candidate.createdAt,
              position: vacancyInfo?.name || 'Position',
              stageId: stage._id,
              rejected: candidate.rejected || false,
              // Include original fields for vacancy matching (but not vacancyInfo unless needed)
              LandingPageDataId: candidate.LandingPageDataId,
              vacancyId: candidate.vacancyId,
              // Assignment data
              assignedTo: candidate.assignedTo,
              assignedAt: candidate.assignedAt,
              assignedBy: candidate.assignedBy
            };
            
            // ABSOLUTELY DO NOT add vacancyInfo in single-job view to prevent purple "Applied to" text
            if (isMultiJobView && candidate.vacancyInfo) {
              cardData.vacancyInfo = candidate.vacancyInfo;
              console.log(`✅ Adding vacancyInfo to candidate ${candidate._id} in multi-job view:`, candidate.vacancyInfo);
            } else {
              console.log(`❌ NOT adding vacancyInfo to candidate ${candidate._id} - isMultiJobView: ${isMultiJobView}, hasVacancyInfo: ${!!candidate.vacancyInfo}`);
            }
            
            return cardData;
          })
        };
      }).sort((a, b) => a.sort - b.sort);
      
      console.log('📊 Created board columns:', boardColumns);
      
      // Ensure all stages have proper IDs and names
      const safeColumns = boardColumns.map((col, index) => ({
        ...col,
        id: col.id || `stage-${index}-${Date.now()}`,
        title: col.title || `Stage ${index + 1}`
      }));
      
      // Fallback: If no stages were loaded, create default ones in UI
      if (safeColumns.length === 0) {
        console.log('⚠️ No stages found, creating UI fallback');
        const fallbackColumns = [
          { id: `applied-${Date.now()}`, title: 'Applied', sort: 0, cards: [] },
          { id: `screening-${Date.now()}`, title: 'Screening', sort: 1, cards: [] },
          { id: `interview-${Date.now()}`, title: 'Interview', sort: 2, cards: [] },
          { id: `offer-${Date.now()}`, title: 'Offer', sort: 3, cards: [] },
          { id: `hired-${Date.now()}`, title: 'Hired', sort: 4, cards: [] }
        ];
        setPipelineData({ columns: fallbackColumns });
      } else {
        console.log('✅ Setting pipeline with safe columns:', safeColumns);
        setPipelineData({ columns: safeColumns });
      }
      
      // Flatten for table view
      const flatCandidates = boardColumns.flatMap(col =>
        col.cards.map(card => {
          const baseCard = {
            ...card,
            stage: col.title,
            stageId: col.id,
            // Ensure vacancy reference fields are preserved for table view
            LandingPageDataId: card.LandingPageDataId,
            vacancyId: card.vacancyId
          };
          
          // Only add vacancyInfo if we're in multi-job view
          if (isMultiJobView && card.vacancyInfo) {
            baseCard.vacancyInfo = card.vacancyInfo;
          }
          
          return baseCard;
        })
      );
      
      console.log('📊 Filtering results:', {
        totalCandidatesBeforeFilter: allCandidates.length,
        totalCandidatesAfterFilter: flatCandidates.length,
        stagesShown: boardColumns.filter(col => col.cards.length > 0).length,
        totalStages: boardColumns.length,
        activeStageFilter: filters.stages.length > 0 ? filters.stages : 'none'
      });
      
      console.log('🔍 Debug candidate data for vacancy counting:', {
        isMultiJobView,
        VacancyId,
        candidatesWithVacancyInfo: flatCandidates.map(c => ({
          id: c.id,
          name: c.fullname,
          LandingPageDataId: c.LandingPageDataId,
          vacancyId: c.vacancyId,
          vacancyInfo: c.vacancyInfo
        }))
      });
      
      setCandidates(flatCandidates);
      
    } catch (error) {
      console.error('Error loading ATS data:', error);
      if (!isBackgroundRefresh) {
        message.error('Failed to load candidates');
      }
    } finally {
      // Clean up all loading states
      if (isInitialLoad) setInitialLoading(false);
      if (!isBackgroundRefresh) setDataRefreshing(false);
      setCandidatesLoading(false);
      setColumnsLoading(false);
    }
  }, [VacancyId, debouncedSearchTerm, vacancyInfo, filters, isMultiJobView, user]);

  // Counter to track how many times this function is called
  let ensureDefaultStagesCallCount = 0;

  // Ensure default stages exist and return them
  const ensureDefaultStages = async () => {
    try {
      ensureDefaultStagesCallCount++;
      console.log(`🔍 STAGE LOAD: ensureDefaultStages() called #${ensureDefaultStagesCallCount} for vacancy:`, VacancyId);
      console.log('🔍 STAGE LOAD: Call stack:', new Error().stack.split('\n').slice(1, 4).join('\n'));
      
      const existingStages = await CrudService.search('VacancyStage', 100, 1, {
        filters: { vacancyId: VacancyId }
      });
      
      const stages = existingStages.data?.items || [];
      console.log('📊 STAGE LOAD: Found existing stages:', stages.length);
      console.log('📋 STAGE LOAD: Stage names:', stages.map(s => s.name));
      console.log('🆔 STAGE LOAD: Stage IDs:', stages.map(s => ({ name: s.name, id: s._id })));
      
      if (stages.length === 0) {
        console.log('🚨 STAGE LOAD: No stages found, calling createDefaultStages...');
        console.log('🔍 STAGE LOAD: Creating default stages for new vacancy');
        return await createDefaultStages();
      } else {
        console.log('✅ STAGE LOAD: Using existing stages, skipping creation');
        console.log('⚠️ STAGE LOAD: If duplicates appear, they are NOT from this function!');
        
        // Check if we have the minimum required stages (don't auto-create if missing)
        const hasApplied = stages.some(s => s.name === 'Applied');
        const hasHired = stages.some(s => s.name === 'Hired');
        
        // AGGRESSIVE DUPLICATE CLEANUP - Actually delete duplicates from database
        console.log('🔍 CLEANUP: Starting aggressive duplicate cleanup...');
        console.log('📊 CLEANUP: Total stages fetched:', stages.length);
        
        // Group stages by name to identify duplicates
        const stagesByName = {};
        stages.forEach(stage => {
          if (!stagesByName[stage.name]) {
            stagesByName[stage.name] = [];
          }
          stagesByName[stage.name].push(stage);
        });
        
        // Find and delete duplicates for each stage name
        const stagesToKeep = [];
        const stagesToDelete = [];
        
        for (const [stageName, stageGroup] of Object.entries(stagesByName)) {
          if (stageGroup.length > 1) {
            console.log(`🚨 CLEANUP: Found ${stageGroup.length} duplicates for "${stageName}"`);
            
            // Sort by creation time or sort order to keep the "best" one
            stageGroup.sort((a, b) => {
              // Prefer stages with proper sort values
              if (a.sort && !b.sort) return -1;
              if (!a.sort && b.sort) return 1;
              // Then by sort order
              if (a.sort && b.sort) return (a.sort || 0) - (b.sort || 0);
              // Finally by creation time (older first)
              return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            });
            
            // Keep the first (best) one
            stagesToKeep.push(stageGroup[0]);
            console.log(`✅ CLEANUP: Keeping "${stageName}" with ID: ${stageGroup[0]._id}`);
            
            // Mark the rest for deletion
            for (let i = 1; i < stageGroup.length; i++) {
              stagesToDelete.push(stageGroup[i]);
              console.log(`🗑️ CLEANUP: Marking for deletion "${stageName}" with ID: ${stageGroup[i]._id}`);
            }
          } else {
            // No duplicates, keep as is
            stagesToKeep.push(stageGroup[0]);
          }
        }
        
        // Actually delete the duplicate stages from the database
        if (stagesToDelete.length > 0) {
          console.log(`🚨 CLEANUP: Deleting ${stagesToDelete.length} duplicate stages from database...`);
          
          const deletePromises = stagesToDelete.map(async (stage) => {
            try {
              console.log(`🗑️ CLEANUP: Deleting duplicate "${stage.name}" (ID: ${stage._id})...`);
              await ATSService.deleteStage(stage._id);
              console.log(`✅ CLEANUP: Successfully deleted duplicate "${stage.name}" (ID: ${stage._id})`);
              return true;
            } catch (error) {
              console.error(`❌ CLEANUP: Failed to delete duplicate "${stage.name}" (ID: ${stage._id}):`, error);
              return false;
            }
          });
          
          const deleteResults = await Promise.all(deletePromises);
          const successfulDeletes = deleteResults.filter(result => result).length;
          
          console.log(`📊 CLEANUP: Deleted ${successfulDeletes}/${stagesToDelete.length} duplicate stages`);
          if (successfulDeletes > 0) {
            console.log('✅ CLEANUP: Database cleanup completed successfully!');
          }
        } else {
          console.log('✅ CLEANUP: No duplicates found - database is clean!');
        }
        
        // Sort the stages to keep
        let cleanedStages = stagesToKeep.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        
        // Ensure proper sort values
        cleanedStages = cleanedStages.map((stage, index) => ({
          ...stage,
          sort: stage.sort || (index + 1)
        }));
        
        console.log('🧹 FINAL STAGES:', cleanedStages.map(s => ({ name: s.name, id: s._id })));
        return cleanedStages;
      }
    } catch (error) {
      console.error('❌ Error checking stages:', error);
      console.log('🚨 CRITICAL ERROR: ensureDefaultStages failed!');
      console.log('🚨 ERROR DETAILS:', error.message);
      // Fallback: create default stages if there's an error
      console.log('🔄 Fallback: creating default stages due to error');
      return await createDefaultStages();
    }
  };

  // Delete existing stages for this vacancy
  const deleteExistingStages = async () => {
    try {
      console.log('🗑️ Deleting existing stages for vacancy:', VacancyId);
      const existingStages = await CrudService.search('VacancyStage', 100, 1, {
        filters: { vacancyId: VacancyId }
      });
      
      const stages = existingStages.data?.items || [];
      for (const stage of stages) {
        try {
          await CrudService.delete('VacancyStage', stage._id);
          console.log('🗑️ Deleted stage:', stage.name);
        } catch (error) {
          console.error('❌ Error deleting stage:', stage.name, error);
        }
      }
    } catch (error) {
      console.error('❌ Error finding stages to delete:', error);
    }
  };

  // Delete ALL stages for this vacancy (cleanup function)
  const deleteAllStagesForVacancy = async () => {
    try {
      console.log('🧹 CLEANUP: Deleting ALL stages for vacancy:', VacancyId);
      
      // Get ALL stages with higher limit
      const allStages = await CrudService.search('VacancyStage', 1000, 1, {
        filters: { vacancyId: VacancyId }
      });
      
      const stages = allStages.data?.items || [];
      console.log(`🗑️ Found ${stages.length} total stages to delete`);
      
      let deleted = 0;
      for (const stage of stages) {
        try {
          await CrudService.delete('VacancyStage', stage._id);
          deleted++;
          console.log(`🗑️ Deleted stage ${deleted}/${stages.length}: ${stage.name}`);
        } catch (error) {
          console.error('❌ Error deleting stage:', stage.name, error);
        }
      }
      
      console.log(`✅ Cleanup complete: Deleted ${deleted}/${stages.length} stages`);
    } catch (error) {
      console.error('❌ Error in cleanup:', error);
    }
  };

  // Create default stages
  const createDefaultStages = async () => {
    console.log('🚨🚨🚨 CRITICAL: createDefaultStages() CALLED!!!');
    console.log('🔍 Stack trace:', new Error().stack);
    console.log('🔨 Creating default stages...');
    
    // First delete any existing stages
    await deleteExistingStages();
    
    const defaultStages = [
      { name: 'Applied', sort: 0 },
      { name: 'Screening', sort: 1 },
      { name: 'Interview', sort: 2 },
      { name: 'Offer', sort: 3 },
      { name: 'Hired', sort: 4 }
    ];

    const createdStages = [];
    
    for (const stage of defaultStages) {
      try {
        console.log('🔨 Creating stage:', stage.name);
        const response = await CrudService.create('VacancyStage', {
          ...stage,
          vacancyId: VacancyId,
          user_id: null // Will be set by backend
        });
        
        if (response.data) {
          console.log('🔍 Stage creation response:', response.data);
          // Handle multiple possible response structures
          const createdStage = response.data.result || response.data.data || response.data;
          createdStages.push(createdStage);
          console.log('✅ Created stage:', stage.name, 'ID:', createdStage._id);
          console.log('🔍 Stage object:', createdStage);
        } else {
          console.error('❌ Failed to create stage:', stage.name, 'No data in response');
          console.log('❌ Full response:', response);
        }
              } catch (error) {
        console.error('❌ Error creating stage:', stage.name, error);
        // Add a fallback stage object even if API fails
        const fallbackStage = {
          _id: `fallback-${stage.sort}-${Date.now()}`,
          name: stage.name,
          sort: stage.sort,
          vacancyId: VacancyId
        };
        createdStages.push(fallbackStage);
        console.log('🔄 Created fallback stage:', fallbackStage);
      }
    }
    
    console.log('📋 Created stages result:', createdStages);
    return createdStages;
  };

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchPending(true);
      console.log('🔍 Search pending for:', searchTerm);
    }
    
    const timer = setTimeout(() => {
      console.log('🔍 Executing debounced search for:', searchTerm);
      setDebouncedSearchTerm(searchTerm);
      setSearchPending(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Track if this is the first load
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  useEffect(() => {
    loadATSData({ isInitialLoad: !hasLoadedOnce });
    if (!hasLoadedOnce) setHasLoadedOnce(true);
  }, [loadATSData, hasLoadedOnce]);

  // Load current team information
  useEffect(() => {
    const loadCurrentTeam = async () => {
      try {
        const storedTeam = TeamService.getCurrentTeam();
        if (storedTeam) {
          setCurrentTeam(storedTeam);
          
          // Also load team members for assignment filter
          try {
            const response = await TeamService.getTeamMembers(storedTeam._id);
            setTeamMembers(response.members || []);
          } catch (error) {
            console.error('Error loading team members:', error);
            setTeamMembers([]);
          }
        }
      } catch (error) {
        console.error('Error loading current team:', error);
      }
    };

    if (user) {
      loadCurrentTeam();
    }
  }, [user]);

  // Debug: Log vacancies when they change
  useEffect(() => {
    console.log('🔍 All vacancies state updated:', allVacancies.length, 'vacancies');
    console.log('👤 Current user:', user?._id, user?.fullname);
    if (allVacancies.length > 0) {
      console.log('📋 User\'s vacancies:', allVacancies.map(v => ({
        id: v._id,
        title: v.vacancyTitle,
        published: v.published,
        user_id: v.user_id
      })));
    } else {
      console.log('📋 No vacancies found for user or still loading...');
    }
  }, [allVacancies, user]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
    console.log('🔄 Pagination reset due to search/filter change');
  }, [debouncedSearchTerm, filters]);

  // Adjust current page if it becomes invalid after data changes
  useEffect(() => {
    const totalPages = Math.ceil(candidates.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      console.log('📄 Adjusted current page to:', totalPages);
    }
  }, [candidates.length, pageSize, currentPage]);

  // Save page size preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ats-table-page-size', pageSize.toString());
      console.log('💾 Saved page size preference:', pageSize);
    }
  }, [pageSize]);

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      // Handle column reordering
      if (type === 'COLUMN') {
        await handleColumnReorder(source.index, destination.index);
        return;
      }

      // Handle candidate movement (existing logic)
      const newColumns = [...pipelineData.columns];
      const sourceColumn = newColumns.find(col => col.id === source.droppableId);
      const destColumn = newColumns.find(col => col.id === destination.droppableId);
      
      const [movedCard] = sourceColumn.cards.splice(source.index, 1);
      movedCard.stageId = destination.droppableId; // Update stage reference
      destColumn.cards.splice(destination.index, 0, movedCard);
      
      setPipelineData({ columns: newColumns });

      // Update backend - update the VacancySubmission's stageId
      await CrudService.update('VacancySubmission', draggableId, {
        stageId: destination.droppableId
      });

    } catch (error) {
      console.error('Error in drag operation:', error);
      message.error('Failed to complete drag operation');
      loadATSData({ isBackgroundRefresh: true }); // Revert on error
    }
  };

  // Delete candidate handler
  const handleDeleteCandidate = async (candidateId) => {
    // Find candidate details for confirmation
    const candidate = candidates.find(c => c.id === candidateId);
    const candidateName = candidate?.fullname || 'this candidate';
    
    Modal.confirm({
      title: 'Delete Candidate',
      content: `Are you sure you want to delete ${candidateName}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          console.log('🗑️ Deleting candidate:', candidateId);
          await CrudService.delete('VacancySubmission', candidateId);
          
          // Optimistic update - remove from local state immediately
          setCandidates(prevCandidates => 
            prevCandidates.filter(candidate => candidate.id !== candidateId)
          );
          setPipelineData(prevData => ({
            ...prevData,
            columns: prevData.columns.map(col => ({
              ...col,
              cards: col.cards.filter(card => card.id !== candidateId)
            }))
          }));
          
          // Background refresh to ensure consistency
          loadATSData({ isBackgroundRefresh: true });
        } catch (error) {
          console.error('❌ Error deleting candidate:', error);
          message.error('Failed to delete candidate');
        }
      }
    });
  };

  // Bulk delete candidates handler
  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    try {
      console.log('🗑️ Bulk deleting candidates:', selectedCandidates);
      
      // Delete all selected candidates in parallel
      const deletePromises = selectedCandidates.map(candidateId => 
        CrudService.delete('VacancySubmission', candidateId)
      );
      
      await Promise.all(deletePromises);
      
      // Optimistic update - remove all deleted candidates from local state
      setCandidates(prevCandidates => 
        prevCandidates.filter(candidate => !selectedCandidates.includes(candidate.id))
      );
      setPipelineData(prevData => ({
        ...prevData,
        columns: prevData.columns.map(col => ({
          ...col,
          cards: col.cards.filter(card => !selectedCandidates.includes(card.id))
        }))
      }));
      
      message.success(`Successfully deleted ${selectedCandidates.length} candidate${selectedCandidates.length !== 1 ? 's' : ''}`);
      
      // Clear selection and close modal
      setSelectedCandidates([]);
      setBulkDeleteModal(false);
      
      // Background refresh to ensure consistency
      loadATSData({ isBackgroundRefresh: true });
      
    } catch (error) {
      console.error('❌ Error bulk deleting candidates:', error);
      message.error('Failed to delete some candidates. Please try again.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Bulk move candidates to stage
  const handleBulkMoveStage = async (stageId) => {
    setBulkActionLoading(true);
    try {
      console.log('📋 Bulk moving candidates to stage:', stageId, selectedCandidates);
      
      // Move all selected candidates to the specified stage
      const movePromises = selectedCandidates.map(candidateId => 
        CrudService.update('VacancySubmission', candidateId, { stageId })
      );
      
      await Promise.all(movePromises);
      
      // Optimistic update - move candidates in local state immediately
      setPipelineData(prevData => {
        const newColumns = prevData.columns.map(col => ({
          ...col,
          cards: col.cards.filter(card => !selectedCandidates.includes(card.id))
        }));
        
        // Find target column and moved cards
        const targetColumnIndex = newColumns.findIndex(col => col.id === stageId);
        const movedCards = prevData.columns.flatMap(col => 
          col.cards.filter(card => selectedCandidates.includes(card.id))
        ).map(card => ({ ...card, stageId }));
        
        if (targetColumnIndex >= 0) {
          newColumns[targetColumnIndex].cards = [...newColumns[targetColumnIndex].cards, ...movedCards];
        }
        
        return { ...prevData, columns: newColumns };
      });
      
      const stageName = pipelineData.columns.find(col => col.id === stageId)?.title || 'Unknown Stage';
      message.success(`Successfully moved ${selectedCandidates.length} candidate${selectedCandidates.length !== 1 ? 's' : ''} to ${stageName}`);
      
      // Clear selection 
      setSelectedCandidates([]);
      
      // Background refresh to ensure consistency
      loadATSData({ isBackgroundRefresh: true });
      
    } catch (error) {
      console.error('❌ Error bulk moving candidates:', error);
      message.error('Failed to move some candidates. Please try again.');
    } finally {
      setBulkActionLoading(false);
    }
  };



  // Email candidate handler
  const handleEmailCandidate = (candidate) => {
    if (candidate.email) {
      window.open(`mailto:${candidate.email}`, '_blank');
    } else {
      message.warning('No email address available for this candidate');
    }
  };

  // Phone candidate handler
  const handlePhoneCandidate = (candidate) => {
    if (candidate.phone) {
      window.open(`tel:${candidate.phone}`, '_blank');
    } else {
      message.warning('No phone number available for this candidate');
    }
  };

  // Assignment handlers
  const handleAssignCandidate = (candidate) => {
    setSelectedCandidateForAssignment(candidate);
    setAssignmentModal(true);
  };

  // Chat handler
  const handleStartChatWithCandidate = async (candidate) => {
    if (!candidate?.email) {
      message.warning('Cannot start chat: No email address available for this candidate');
      return;
    }

    try {
      // Start a new chat with the candidate
      const response = await CandidateChatService.startChat(candidate.id);
      
      if (response.data.chatId) {
        
        // Redirect to chat interface with the specific chat
        router.push(`/dashboard/candidate-chat?chatId=${response.data.chatId}`);
      }
    } catch (error) {
      console.error('Error starting chat with candidate:', error);
      message.error('Failed to start chat with candidate. Please try again.');
    }
  };

  // Interview scheduling handler
  const handleScheduleInterview = (candidate) => {
    setSelectedCandidateForScheduling(candidate);
    setInterviewSchedulingModal(true);
  };

  // Send interview suggestions to candidate
  const handleSendInterviewSuggestions = async (suggestions) => {
    if (!selectedCandidateForScheduling || !suggestions || suggestions.length === 0) {
      message.error('Please select valid interview times');
      return;
    }

    setSchedulingLoading(true);
    try {
      // Start a chat with the candidate first if not exists
      const chatResponse = await CandidateChatService.startChat(selectedCandidateForScheduling.id);
      
      if (!chatResponse.data.chatId) {
        throw new Error('Failed to create chat');
      }

      // Prepare the interview scheduling message
      const suggestionText = suggestions.map((s, index) => 
        `Option ${index + 1}: ${s.displayText}`
      ).join('\n');

      const message_text = `🗓️ Interview Invitation\n\nHi ${selectedCandidateForScheduling.fullname || selectedCandidateForScheduling.email},\n\nWe would like to schedule an interview with you! Please select one of the following available times:\n\n${suggestionText}\n\nPlease reply with your preferred option, and we'll send you the meeting details.\n\nLooking forward to speaking with you!`;

      // Send the scheduling message with special interview type
      const sendResponse = await CandidateChatService.sendMessage(chatResponse.data.chatId, {
        message: message_text,
        messageType: 'interview_scheduling',
        interviewSuggestions: suggestions,
        attachments: [],
        baseURL: window.location.origin
      });

      if (sendResponse.data) {
        setInterviewSchedulingModal(false);
        setSelectedCandidateForScheduling(null);
        
        // Optionally redirect to chat
        setTimeout(() => {
          router.push(`/dashboard/candidate-chat?chatId=${chatResponse.data.chatId}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending interview suggestions:', error);
      message.error('Failed to send interview suggestions. Please try again.');
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Handle adding new column
  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) {
      message.error('Please enter a column title');
      return;
    }

    if (user?.accessLevel === "read") {
      message.error("Your access is read-only");
      return;
    }

    try {
      // Get the highest sort value
      const maxSort = Math.max(...pipelineData.columns.map(col => col.sort || 0), 0);
      
      // Use consistent vacancyId - prioritize VacancyId (from URL/state) over vacancyInfo._id
      const targetVacancyId = VacancyId || vacancyInfo?._id || searchParams.get('vacancyId');
      
      console.log('➕ Adding column with vacancyId:', targetVacancyId);
      
      console.log('🚨🚨🚨 CRITICAL: CREATING NEW STAGE IN FRONTEND (ADD COLUMN)!!!');
      console.log('🔍 Stack trace:', new Error().stack);
      console.log('📝 Stage name:', newColumnTitle.trim());
      console.log('🆔 VacancyId:', targetVacancyId);
      
      // Create new stage in backend
      const newStage = await CrudService.create("VacancyStage", {
        name: newColumnTitle.trim(),
        sort: maxSort + 1,
        vacancyId: targetVacancyId,
        user_id: user._id,
        partner: user.partner
      });

      console.log('✅ New stage created:', newStage);

      // Optimistic update - add to local state immediately
      const newColumn = {
        id: newStage.data?._id || newStage._id,
        title: newColumnTitle.trim(),
        sort: maxSort + 1,
        cards: []
      };
      
      setPipelineData(prevData => ({
        ...prevData,
        columns: [...prevData.columns, newColumn]
      }));
      
      // Background refresh to ensure consistency
      setTimeout(() => {
        loadATSData({ isBackgroundRefresh: true, skipCandidates: true });
      }, 500);
      
      // Reset form
      setAddingColumn(false);
      setNewColumnTitle('');
      
    } catch (error) {
      console.error('Error adding column:', error);
      message.error('Failed to add column');
    }
  };

  // Handle renaming column
  const handleRenameColumn = async (columnId, newTitle) => {
    if (!newTitle.trim()) {
      message.error('Please enter a column title');
      return;
    }

    if (user?.accessLevel === "read") {
      message.error("Your access is read-only");
      return;
    }

          try {
        console.log(`🏷️ RENAME DEBUG: Starting rename of column ${columnId} to "${newTitle.trim()}"`);
        
        // ONLY use direct ATS service - no fallbacks that could cause duplicates
        console.log('🔄 RENAME DEBUG: Calling ATSService.updateStage...');
        const response = await ATSService.updateStage(columnId, { 
          name: newTitle.trim() 
        });
        console.log('✅ RENAME DEBUG: ATSService.updateStage response:', response);

        // Update local state immediately for better UX
        setPipelineData(prevData => ({
          ...prevData,
          columns: prevData.columns.map(col => 
            col.id === columnId ? { ...col, title: newTitle.trim() } : col
          )
        }));

        setEditingColumnId(null);
        
        // Background refresh to ensure consistency (non-blocking)
        console.log('🔄 RENAME DEBUG: Background refresh after rename...');
        setTimeout(() => {
          loadATSData({ isBackgroundRefresh: true, skipCandidates: true });
        }, 1000);
        
      } catch (error) {
        console.error('❌ RENAME ERROR: Column rename failed completely:', error);
        console.error('❌ RENAME ERROR: Full error object:', error);
        message.error(`Failed to rename column: ${error.message}`);
        
        // Revert optimistic update and background refresh
        setPipelineData(prevData => ({
          ...prevData,
          columns: prevData.columns.map(col => 
            col.id === columnId ? { ...col, title: col.originalTitle || col.title } : col
          )
        }));
        
        loadATSData({ isBackgroundRefresh: true, skipCandidates: true });
      }
  };

  // Handle deleting column
  const handleDeleteColumn = async (columnId, columnTitle) => {
    if (user?.accessLevel === "read") {
      message.error("Your access is read-only");
      return;
    }

    // Check if column has candidates
    const column = pipelineData.columns.find(col => col.id === columnId);
    const candidatesInColumn = column?.cards || [];
    
    if (candidatesInColumn.length > 0) {
      message.error(`Cannot delete "${columnTitle}" - it contains ${candidatesInColumn.length} candidate(s). Please move them to another column first.`);
      return;
    }

    // Prevent deletion if only one column remains
    if (pipelineData.columns.length <= 1) {
      message.error('Cannot delete the last remaining column');
      return;
    }

    // Show confirmation modal
    Modal.confirm({
      title: 'Delete Column',
      content: `Are you sure you want to delete the "${columnTitle}" column? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          console.log('🗑️ Deleting column:', columnId, columnTitle);
          
          // Delete stage from backend
          await CrudService.delete("VacancyStage", columnId);

          // Remove from local state immediately for better UX
          setPipelineData(prevData => ({
            ...prevData,
            columns: prevData.columns.filter(col => col.id !== columnId)
          }));

        } catch (error) {
          console.error('Error deleting column:', error);
          message.error('Failed to delete column');
          // Background refresh in case of error
          loadATSData({ isBackgroundRefresh: true, skipCandidates: true });
        }
      }
    });
  };

  // Handle sorting/reordering columns
  const handleColumnReorder = async (sourceIndex, destinationIndex) => {
    if (user?.accessLevel === "read") {
      message.error("Your access is read-only");
      return;
    }

    if (sourceIndex === destinationIndex) return;

    try {
      console.log('🔄 Reordering columns:', sourceIndex, '->', destinationIndex);
      
      // Update local state immediately for better UX
      const newColumns = Array.from(pipelineData.columns);
      const [reorderedColumn] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, reorderedColumn);

      // Update sort values
      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        sort: index + 1
      }));

      setPipelineData(prevData => ({
        ...prevData,
        columns: updatedColumns
      }));

      // Update sort values in backend
      const updatePromises = updatedColumns.map(col => 
        CrudService.update("VacancyStage", col.id, { sort: col.sort })
      );

      await Promise.all(updatePromises);
      
    } catch (error) {
      console.error('Error reordering columns:', error);
      message.error('Failed to reorder columns');
      // Background refresh in case of error
      loadATSData({ isBackgroundRefresh: true, skipCandidates: true });
    }
  };

  const handleAssignmentUpdate = (candidateId, assignmentData) => {
    // Update candidate in both pipeline and table data
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, ...assignmentData }
          : candidate
      )
    );

    // Update pipeline data
    setPipelineData(prevPipelineData => ({
      ...prevPipelineData,
      columns: prevPipelineData.columns.map(column => ({
        ...column,
        cards: column.cards.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, ...assignmentData }
            : candidate
        )
      }))
    }));
  };

  // Get stage color based on stage name
  const getStageColor = (stageName) => {
    const stageColors = {
      'Applied': '#8B5CF6',        // Purple - matches Figma
      'New applied': '#8B5CF6',    // Purple
      'Application': '#8B5CF6',    // Purple
      'Screening': '#3B82F6',      // Blue - matches Figma
      'Screen': '#3B82F6',         // Blue
      'Interview': '#EF4444',      // Red - matches Figma
      'Offer': '#F59E0B',          // Orange - matches Figma
      'Tests': '#F59E0B',          // Orange
      'Test': '#F59E0B',           // Orange
      'Assessment': '#F59E0B',     // Orange
      'Hired': '#10B981',          // Green - matches Figma
      'Lead': '#10B981',           // Green
      'Onboarding': '#10B981',     // Green
      'Rejected': '#6B7280',       // Gray
      'Declined': '#6B7280',       // Gray
    };
    
    // Find matching color, fallback to gray
    const normalizedName = stageName?.toLowerCase();
    for (const [key, color] of Object.entries(stageColors)) {
      if (normalizedName?.includes(key.toLowerCase())) {
        return color;
      }
    }
    return '#6B7280'; // Gray fallback
  };

  // Pipeline View Component
  const PipelineView = () => (
          <div className="flex-1 bg-gray-100 p-6 relative">


      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided, snapshot) => (
            <div 
              className="flex gap-5 overflow-x-auto pb-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {pipelineData.columns.map((column, index) => (
                <Draggable key={`column-${column.id}`} draggableId={`column-${column.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      key={`column-${column.id || index}`} 
                      className={`flex-shrink-0 w-72 pipeline-column group transition-all duration-200 ${snapshot.isDragging ? 'opacity-50 shadow-lg scale-105 rotate-2' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
              {/* Column Header with Color Bar */}
              <div className="bg-white border pipeline-stage-header">
                {/* Color Bar */}
                <div 
                  className="pipeline-stage-color-bar"
                  style={{ 
                    '--color': getStageColor(column.title),
                    backgroundColor: getStageColor(column.title)
                  }}
                />
                
                {/* Header Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    {editingColumnId === column.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={newColumnTitle}
                          onChange={(e) => setNewColumnTitle(e.target.value)}
                          onPressEnter={() => handleRenameColumn(column.id, newColumnTitle)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setEditingColumnId(null);
                              setNewColumnTitle('');
                            }
                          }}
                          onBlur={() => {
                            if (newColumnTitle.trim()) {
                              handleRenameColumn(column.id, newColumnTitle);
                            } else {
                              setEditingColumnId(null);
                              setNewColumnTitle('');
                            }
                          }}
                          autoFocus
                          className="text-base font-semibold"
                          style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                        />
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CheckOutlined />}
                          onClick={() => handleRenameColumn(column.id, newColumnTitle)}
                          className="text-green-600 hover:text-green-700"
                        />
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CloseOutlined />}
                          onClick={() => {
                            setEditingColumnId(null);
                            setNewColumnTitle('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          {...provided.dragHandleProps}
                          className="flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors"
                          title="Drag to reorder column"
                        >
                          <DragOutlined className="text-gray-400 hover:text-gray-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-base flex-1">
                          {column.title}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => {
                              setEditingColumnId(column.id);
                              setNewColumnTitle(column.title);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title={`Rename ${column.title}`}
                          />
                          {pipelineData.columns.length > 1 && (
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteColumn(column.id, column.title)}
                              className="text-red-400 hover:text-red-600"
                              title={`Delete ${column.title}`}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        {column.cards?.length || 0}
                      </span>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setSelectedStageForAdd(column.id);
                          setAddCandidateModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title={`Add candidate to ${column.title}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column Cards */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 p-4 pipeline-droppable-area transition-all duration-200 ${
                      snapshot.isDraggingOver 
                        ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-xl scale-[1.02]' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    style={{
                      borderTopLeftRadius: '0px',
                      borderTopRightRadius: '0px',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      minHeight: '400px'
                    }}
                  >
                    {column.cards?.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CandidateCard
                              candidate={candidate}
                              isDragging={snapshot.isDragging}
                              onView={() => setCandidateProfile(candidate.id)}
                              onEdit={() => {
                                setSelectedStageForAdd(null);
                                setAddCandidateModal({ editId: candidate.id });
                              }}
                              onDelete={() => handleDeleteCandidate(candidate.id)}
                              onEmail={() => handleEmailCandidate(candidate)}
                              onPhone={() => handlePhoneCandidate(candidate)}
                              onChat={() => handleStartChatWithCandidate(candidate)}
                              onRatingUpdate={handleRatingUpdate}
                              onAssign={() => handleAssignCandidate(candidate)}
                              onScheduleInterview={() => handleScheduleInterview(candidate)}
                              showVacancyInfo={false}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Empty state */}
                    {(!column.cards || column.cards.length === 0) && (
                      <div className="text-center py-12 text-gray-400">
                        <UserOutlined className="text-3xl mb-3 block" />
                        <p className="text-sm font-medium">No candidates</p>
                        <p className="text-xs mt-1">Drag candidates here or use the + button</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
          
          {/* Add Column Button */}
          <div className="flex-shrink-0 w-72">
            {addingColumn ? (
              <div className="bg-white border rounded-lg p-4">
                <div className="space-y-3">
                  <Input
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onPressEnter={handleAddColumn}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setAddingColumn(false);
                        setNewColumnTitle('');
                      }
                    }}
                    placeholder="Enter column title"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={handleAddColumn}
                      disabled={!newColumnTitle.trim()}
                      className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
                      style={{
                        backgroundColor: '#8B5CF6',
                        borderColor: '#8B5CF6',
                      }}
                    >
                      Add
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => {
                        setAddingColumn(false);
                        setNewColumnTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                onClick={() => setAddingColumn(true)}
              >
                <PlusOutlined className="text-2xl text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium">Add Column</span>
              </div>
            )}
          </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  // Table View Component  
  const TableView = () => {
    const columns = [
      {
        title: 'Candidate',
        key: 'candidate',
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <Avatar 
              src={record.avatar} 
              icon={<UserOutlined />}
              size={window.innerWidth < 768 ? 32 : 40}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 text-sm truncate">
                {record.fullname || record.email}
              </div>
              <div className="text-xs text-gray-500 truncate hidden md:block">
                {record.email}
              </div>
            </div>
          </div>
        ),
        sorter: (a, b) => {
          const nameA = (a.fullname || a.email || '').toLowerCase();
          const nameB = (b.fullname || b.email || '').toLowerCase();
          return nameA.localeCompare(nameB);
        },
        sortDirections: ['ascend', 'descend'],
      },
      ...(isMultiJobView ? [{
        title: 'Vacancy',
        key: 'vacancy',
        render: (_, record) => (
          <div className="min-w-0">
            <div className="text-xs font-medium text-blue-700 truncate">
              {record.vacancyInfo?.name || 'Unknown Vacancy'}
            </div>
            {record.vacancyInfo?.location && (
              <div className="text-xs text-gray-500 truncate">
                {record.vacancyInfo.location}
              </div>
            )}
          </div>
        ),
        responsive: ['lg'],
        sorter: (a, b) => {
          const vacancyA = (a.vacancyInfo?.name || '').toLowerCase();
          const vacancyB = (b.vacancyInfo?.name || '').toLowerCase();
          return vacancyA.localeCompare(vacancyB);
        },
        sortDirections: ['ascend', 'descend'],
      }] : []),
      {
        title: 'Stage',
        dataIndex: 'stage',
        key: 'stage',
        render: (stage) => (
          <Tag color="blue" className="text-xs">{stage}</Tag>
        ),
        responsive: ['md'],
        sorter: (a, b) => {
          const stageA = (a.stage || '').toLowerCase();
          const stageB = (b.stage || '').toLowerCase();
          return stageA.localeCompare(stageB);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        render: (position) => (
          <span className="text-xs text-gray-600">{position || 'Not specified'}</span>
        ),
        responsive: ['xl'],
        sorter: (a, b) => {
          const positionA = (a.position || '').toLowerCase();
          const positionB = (b.position || '').toLowerCase();
          return positionA.localeCompare(positionB);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: (
          <div className="flex items-center gap-1">
            <span>Rating</span>
            <StarOutlined style={{ fontSize: '10px', color: '#6b7280' }} />
          </div>
        ),
        dataIndex: 'stars',
        key: 'rating',
        render: (stars, record) => {
          const isUpdating = updatingRatings.has(record.id);
          const isRecentlyUpdated = recentlyUpdatedRatings.has(record.id);
          return (
            <div 
              className={`flex items-center gap-2 px-2 py-1 rounded whitespace-nowrap ${isRecentlyUpdated ? 'rating-updated' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Rate 
                value={stars || 0} 
                onChange={(value) => handleRatingUpdate(record.id, value)}
                style={{ 
                  fontSize: '12px',
                  opacity: isUpdating ? 0.6 : 1,
                  pointerEvents: isUpdating ? 'none' : 'auto',
                  lineHeight: 1
                }} 
                className="cursor-pointer flex-shrink-0"
                character={<StarOutlined />}
                allowClear
                allowHalf={false}
                title={isUpdating ? 'Updating...' : (stars > 0 ? `${stars} star${stars !== 1 ? 's' : ''}` : 'Click to rate')}
              />
              {isUpdating && (
                <div className="flex items-center flex-shrink-0">
                  <div className="rating-loading-spinner"></div>
                </div>
              )}
            </div>
          );
        },
        width: 140,
        responsive: ['lg'],
        sorter: (a, b) => (a.stars || 0) - (b.stars || 0),
        sortDirections: ['ascend', 'descend'],
        defaultSortOrder: 'descend',
      },
      {
        title: 'Applied',
        dataIndex: 'createdAt',
        key: 'applied',
        render: (date) => (
          <span className="text-xs">
            {moment(date).format(window.innerWidth < 768 ? 'MMM DD' : 'MMM DD, YYYY')}
          </span>
        ),
        sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        sortDirections: ['ascend', 'descend'],
        defaultSortOrder: 'descend',
      },
      {
        title: '',
        key: 'actions',
        width: 50,
        render: (_, record) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'view',
                  label: 'View Profile',
                  icon: <UserOutlined />,
                  onClick: () => setCandidateProfile(record.id),
                },
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => {
              setSelectedStageForAdd(null);
              setAddCandidateModal({ editId: record.id });
            },
                },
                {
                  key: 'email',
                  label: 'Send Email',
                  icon: <MailOutlined />,
                  onClick: () => handleEmailCandidate(record),
                },
                {
                  key: 'chat',
                  label: 'Start Chat',
                  icon: <MessageOutlined />,
                  onClick: () => handleStartChatWithCandidate(record),
                },
                {
                  key: 'schedule',
                  label: 'Schedule Interview',
                  icon: <CalendarOutlined />,
                  onClick: () => handleScheduleInterview(record),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              size="small" 
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        ),
      },
    ];

    return (
      <div className="flex-1 bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Table Header with Sort Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Candidate List
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} total
                  </div>
                  {candidates.length > pageSize && (
                    <div className="text-sm text-gray-400">
                      Page {currentPage} of {Math.ceil(candidates.length / pageSize)} • {pageSize} per page
                    </div>
                  )}
                  {selectedCandidates.length > 0 && (
                    <div className="text-sm text-blue-600 font-medium">
                      {selectedCandidates.length} selected
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-400">
                  💡 Click column headers to sort
                </div>
                {selectedCandidates.length > 0 && (
                  <div className="text-xs text-blue-500">
                    Use bulk actions below to manage selected candidates
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  Shortcuts: Ctrl+A (select all) • Esc (clear) • Del (delete) • 1-5 (rate selected) • 0 (clear rating)
                </div>
              </div>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={candidates}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: candidates.length,
              showSizeChanger: true,
              showQuickJumper: window.innerWidth >= 768,
              showTotal: (total, range) => {
                if (total === 0) {
                  return 'No candidates found';
                }
                const start = range ? range[0] : 0;
                const end = range ? range[1] : 0;
                const selectedText = selectedCandidates.length > 0 
                  ? ` (${selectedCandidates.length} selected)`
                  : '';
                return `Showing ${start}-${end} of ${total} candidate${total !== 1 ? 's' : ''}${selectedText}`;
              },
              size: 'small',
              pageSizeOptions: window.innerWidth >= 768 ? ['10', '25', '50', '100'] : ['10', '25', '50'],
              onChange: (page, size) => {
                console.log('📄 Pagination changed:', { page, size, previousPage: currentPage });
                setCurrentPage(page);
                
                // Clear selection when changing pages for better UX
                if (selectedCandidates.length > 0) {
                  setSelectedCandidates([]);
                  console.log('🔄 Cleared selection due to page change');
                }
                
                if (size !== pageSize) {
                  setPageSize(size);
                  setCurrentPage(1); // Reset to first page when page size changes
                }
              },
              onShowSizeChange: (current, size) => {
                console.log('📊 Page size changed:', { current, size, previousSize: pageSize });
                setPageSize(size);
                setCurrentPage(1); // Reset to first page when page size changes
                
                // Clear selection when changing page size for better UX
                if (selectedCandidates.length > 0) {
                  setSelectedCandidates([]);
                  console.log('🔄 Cleared selection due to page size change');
                }
              },
              position: ['bottomCenter'],
              hideOnSinglePage: false,
            }}
            rowSelection={{
              selectedRowKeys: selectedCandidates,
              onChange: setSelectedCandidates,
              getCheckboxProps: (record) => ({
                name: record.fullname || record.email,
              }),
              onSelectAll: (selected, selectedRows, changeRows) => {
                console.log('📋 Select all toggled:', selected, selectedRows.length);
              },
              selections: [
                {
                  key: 'all',
                  text: 'Select All',
                  onSelect: () => {
                    setSelectedCandidates(candidates.map(c => c.id));
                  },
                },
                {
                  key: 'none',
                  text: 'Select None',
                  onSelect: () => {
                    setSelectedCandidates([]);
                  },
                },
                {
                  key: 'current-stage',
                  text: 'Select Current Stage',
                  onSelect: () => {
                    // Get candidates from the currently visible stage
                    const currentStageCandidates = candidates.filter(c => 
                      c.stage === (pipelineData.columns[0]?.title || 'Applied')
                    );
                    setSelectedCandidates(currentStageCandidates.map(c => c.id));
                  },
                },
              ],
            }}
            scroll={{ x: 800 }}
            size="small"
            showSorterTooltip={{
              title: 'Click to sort this column'
            }}
            onChange={(pagination, filters, sorter, extra) => {
              console.log('📊 Table change:', {
                pagination,
                filters,
                sorter,
                action: extra.action
              });
            }}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            }}
            onRow={(record) => ({
              onClick: () => {
                setCandidateProfile(record.id);
              },
              style: { cursor: 'pointer' },
              title: `Click to view ${record.fullname || record.email}'s profile`
            })}
            className="candidate-table"
          />
          
          {/* Table Footer */}
          {selectedCandidates.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700">
                  {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <Button size="small" onClick={() => setSelectedCandidates([])}>
                    Clear Selection
                  </Button>
                  
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'move',
                          label: 'Move to Stage',
                          icon: <EditOutlined />,
                          children: pipelineData.columns.map(stage => ({
                            key: `move-${stage.id}`,
                            label: stage.title,
                            onClick: () => handleBulkMoveStage(stage.id)
                          }))
                        },
                        {
                          type: 'divider'
                        },
                        {
                          key: 'delete',
                          label: 'Delete Selected',
                          icon: <DeleteOutlined />,
                          danger: true,
                          onClick: () => setBulkDeleteModal(true)
                        }
                      ]
                    }}
                    trigger={['click']}
                    placement="topRight"
                  >
                    <Button 
                      size="small" 
                      type="primary" 
                      loading={bulkActionLoading}
                      className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
                      style={{
                        backgroundColor: '#8B5CF6',
                        borderColor: '#8B5CF6',
                      }}
                    >
                      Bulk Actions <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Only show skeleton during initial load or when user is not available
  if (initialLoading || !user || !user._id) {
    return (
      <div className="p-4 md:p-6 min-h-screen">
        <Skeleton active />
        {!user && (
          <div className="text-center mt-4 text-gray-500">
            Loading user information...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background refresh indicator */}
      {dataRefreshing && (
        <div className="fixed top-4 right-4 z-50 bg-purple-100 border border-purple-300 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
          <span className="text-sm text-purple-700">Refreshing data...</span>
        </div>
      )}
      
      {/* Modern Header */}
      <div className="ats-header bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          {/* Top Row - Title and Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 w-9 flex items-center justify-center rounded-lg"
                title="Go back"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {isMultiJobView ? 'All Candidates' : (vacancyInfo?.name || 'Candidates')}
                </h1>
                {isMultiJobView && (
                  <div className="text-sm text-gray-500">
                    Showing candidates across all your job postings
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {candidates.length}
                </div>
                {!isMultiJobView && (
                  <Button
                    type="default"
                    size="small"
                    onClick={() => router.push('/dashboard/ats')}
                    className="text-blue-600 border-blue-200 hover:border-blue-300 hover:text-blue-700"
                  >
                    View All Candidates
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="view-toggle-container flex">
                <Button
                  type="text"
                  onClick={() => setViewMode('pipeline')}
                  size="small"
                  icon={<AppstoreOutlined />}
                  className={`view-toggle-btn ${
                    viewMode === 'pipeline' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } border-0 h-9 px-3`}
                >
                  Pipeline
                </Button>
                <Button
                  type="text"
                  onClick={() => setViewMode('table')}
                  size="small"
                  icon={<BarsOutlined />}
                  className={`view-toggle-btn ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } border-0 h-9 px-3`}
                >
                  Table
                </Button>
              </div>

              {/* Add Candidate Button */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedStageForAdd(null);
                  setAddCandidateModal(true);
                }}
                className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-9 px-4 font-medium shadow-sm"
                style={{
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                }}
              >
                Add Candidate
              </Button>
            </div>
          </div>
          
          {/* Bottom Row - Search and Filters */}
          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex-1 max-w-lg">
              <Search
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={(value) => {
                  setSearchTerm(value);
                  loadATSData({ isBackgroundRefresh: true });
                }}
                loading={searchPending}
                className="w-full ats-search-input"
                size="default"
                allowClear
                enterButton="Search"
                style={{
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
       
            </div>
            
            {/* Filter Actions */}
            <div className="flex items-center gap-2">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                className={`${
                  showFilters 
                    ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                } transition-all duration-200 h-9 px-3`}
              >
                Filters
                {(filters.stages.length > 0 || filters.ratings.length > 0 || filters.dateRange || !filters.showRejected || filters.assignees.length > 0 || (isMultiJobView && filters.vacancies && filters.vacancies.length > 0)) && (
                  <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {filters.stages.length + filters.ratings.length + (filters.dateRange ? 1 : 0) + (!filters.showRejected ? 0 : 1) + filters.assignees.length + (isMultiJobView && filters.vacancies ? filters.vacancies.length : 0)}
                  </span>
                )}
              </Button>
              
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilters({
                    stages: [],
                    ratings: [],
                    dateRange: null,
                    showRejected: false,
                    assignees: [],
                    ...(isMultiJobView && { vacancies: [] })
                  });
                  setSearchTerm('');
                }}
                className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 h-9 px-3"
                title="Reset all filters and search"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="p-6">
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isMultiJobView ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-6`}>
              
              {/* Vacancy Filter (Multi-job view only) */}
              {isMultiJobView && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Vacancy
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select vacancies"
                    value={filters.vacancies || []}
                    onChange={(values) => setFilters(prev => ({ ...prev, vacancies: values }))}
                    style={{ width: '100%' }}
                    options={allVacancies
                      .filter(vacancy => vacancy.published !== false) // Only show published vacancies
                      .map(vacancy => {
                        const vacancyName = vacancy.vacancyTitle || 'Untitled Vacancy';
                        const vacancyId = vacancy._id;
                        
                        // Count candidates for this vacancy - check by vacancy ID for accuracy
                        let count = 0;
                                                 if (isMultiJobView) {
                           // In multi-job view, count candidates that belong to this specific vacancy
                           count = candidates.filter(c => {
                             // Check multiple possible ways the vacancy might be linked
                             const matchByVacancyInfo = c.vacancyInfo?.name === vacancyName;
                             const matchByLandingPageId = c.LandingPageDataId === vacancyId;
                             const matchByVacancyId = c.vacancyId === vacancyId;
                             
                             return matchByVacancyInfo || matchByLandingPageId || matchByVacancyId;
                           }).length;
                        } else {
                          // In single view, if we're looking at a specific vacancy, show all candidates for that vacancy
                          if (VacancyId === vacancyId) {
                            count = candidates.length;
                          } else {
                            count = 0;
                          }
                        }
                        
                        console.log(`📊 Vacancy "${vacancyName}" (${vacancyId}) has ${count} candidates`);
                        
                        return {
                          label: `${vacancyName} (${count} candidate${count !== 1 ? 's' : ''})`,
                          value: vacancyName
                        };
                      })}
                    maxTagCount="responsive"
                    notFoundContent={allVacancies.length === 0 ? "No vacancies found" : "No matching vacancies"}
                  />
                </div>
              )}

              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Stage
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select stages"
                  value={filters.stages}
                  onChange={(values) => setFilters(prev => ({ ...prev, stages: values }))}
                  style={{ width: '100%' }}
                  options={pipelineData.columns.map(stage => ({
                    label: `${stage.title} (${stage.cards?.length || 0})`,
                    value: stage.id
                  }))}
                  maxTagCount="responsive"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Rating
                </label>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Checkbox
                      key={rating}
                      checked={filters.ratings.includes(rating)}
                      onChange={(e) => {
                        const newRatings = e.target.checked 
                          ? [...filters.ratings, rating]
                          : filters.ratings.filter(r => r !== rating);
                        setFilters(prev => ({ ...prev, ratings: newRatings }));
                      }}
                      className="flex items-center"
                    >
                      <Rate disabled defaultValue={rating} style={{ fontSize: '14px' }} />
                      <span className="ml-1 text-sm">({rating} star{rating !== 1 ? 's' : ''})</span>
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Date
                </label>
                <DatePicker.RangePicker
                  value={filters.dateRange ? [
                    moment(filters.dateRange.start),
                    moment(filters.dateRange.end)
                  ] : null}
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      setFilters(prev => ({
                        ...prev,
                        dateRange: {
                          start: dates[0].toDate(),
                          end: dates[1].toDate()
                        }
                      }));
                    } else {
                      setFilters(prev => ({ ...prev, dateRange: null }));
                    }
                  }}
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                />
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Assignee
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select assignees"
                  value={filters.assignees}
                  onChange={(values) => setFilters(prev => ({ ...prev, assignees: values }))}
                  style={{ width: '100%' }}
                  options={[
                    {
                      label: 'Unassigned',
                      value: 'unassigned'
                    },
                    ...teamMembers.map(member => ({
                      label: `${member.user.firstName} ${member.user.lastName}`,
                      value: member.user._id
                    }))
                  ]}
                  maxTagCount="responsive"
                  notFoundContent={teamMembers.length === 0 ? "No team members found" : "No matching members"}
                />
              </div>

              {/* Additional Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-3">
                  <Checkbox
                    checked={filters.showRejected}
                    onChange={(e) => setFilters(prev => ({ ...prev, showRejected: e.target.checked }))}
                  >
                    Show rejected candidates
                  </Checkbox>
                  
                  <div className="pt-2">
                    <Button
                      size="small"
                      onClick={() => {
                        setFilters({
                          stages: [],
                          ratings: [],
                          dateRange: null,
                          showRejected: false,
                          assignees: [],
                          ...(isMultiJobView && { vacancies: [] })
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Filters */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 mr-2">Quick filters:</span>
                
                <Button
                  size="small"
                  type={filters.ratings.includes(5) ? 'primary' : 'default'}
                  onClick={() => {
                    const newRatings = filters.ratings.includes(5) 
                      ? filters.ratings.filter(r => r !== 5)
                      : [...filters.ratings, 5];
                    setFilters(prev => ({ ...prev, ratings: newRatings }));
                  }}
                  className="text-xs"
                >
                  ⭐ 5 Stars
                </Button>
                
                <Button
                  size="small"
                  type={filters.dateRange && moment(filters.dateRange.start).isSame(moment().subtract(7, 'days'), 'day') ? 'primary' : 'default'}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      dateRange: {
                        start: moment().subtract(7, 'days').toDate(),
                        end: moment().toDate()
                      }
                    }));
                  }}
                  className="text-xs"
                >
                  Last 7 days
                </Button>
                
                <Button
                  size="small"
                  type={filters.dateRange && moment(filters.dateRange.start).isSame(moment().subtract(30, 'days'), 'day') ? 'primary' : 'default'}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      dateRange: {
                        start: moment().subtract(30, 'days').toDate(),
                        end: moment().toDate()
                      }
                    }));
                  }}
                  className="text-xs"
                >
                  Last 30 days
                </Button>
                
                <Button
                  size="small"
                  type={!filters.showRejected ? 'primary' : 'default'}
                  onClick={() => setFilters(prev => ({ ...prev, showRejected: !prev.showRejected }))}
                  className="text-xs"
                >
                  {filters.showRejected ? 'Hide' : 'Show'} rejected
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.stages.length > 0 || filters.ratings.length > 0 || filters.dateRange || filters.showRejected || (isMultiJobView && filters.vacancies && filters.vacancies.length > 0)) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {isMultiJobView && filters.vacancies && filters.vacancies.length > 0 && (
                    <Tag 
                      closable 
                      onClose={() => setFilters(prev => ({ ...prev, vacancies: [] }))}
                      color="purple"
                    >
                      Vacancies: {filters.vacancies.join(', ')}
                    </Tag>
                  )}
                  
                  {filters.stages.length > 0 && (
                    <Tag 
                      closable 
                      onClose={() => setFilters(prev => ({ ...prev, stages: [] }))}
                      color="blue"
                    >
                      Stages: {filters.stages.map(stageId => {
                        const stage = pipelineData.columns.find(col => col.id === stageId);
                        return stage ? stage.title : stageId;
                      }).join(', ')}
                    </Tag>
                  )}
                  
                  {filters.ratings.length > 0 && (
                    <Tag 
                      closable 
                      onClose={() => setFilters(prev => ({ ...prev, ratings: [] }))}
                      color="orange"
                    >
                      Ratings: {filters.ratings.join(', ')} stars
                    </Tag>
                  )}
                  
                  {filters.dateRange && (
                    <Tag 
                      closable 
                      onClose={() => setFilters(prev => ({ ...prev, dateRange: null }))}
                      color="green"
                    >
                      Date: {moment(filters.dateRange.start).format('MMM DD')} - {moment(filters.dateRange.end).format('MMM DD')}
                    </Tag>
                  )}
                  
                  {filters.showRejected && (
                    <Tag 
                      closable 
                      onClose={() => setFilters(prev => ({ ...prev, showRejected: false }))}
                      color="red"
                    >
                      Including rejected
                    </Tag>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {viewMode === 'pipeline' ? <PipelineView /> : <TableView />}
      </div>

      {/* Modals */}
      <AddCandidateModal
        visible={!!addCandidateModal}
        onCancel={() => {
          setAddCandidateModal(false);
          setSelectedStageForAdd(null);
        }}
        onSuccess={() => {
          setAddCandidateModal(false);
          setSelectedStageForAdd(null);
          loadATSData({ isBackgroundRefresh: true });
        }}
        vacancyId={VacancyId}
        stages={pipelineData.columns}
        editData={typeof addCandidateModal === 'object' ? addCandidateModal : null}
        defaultStageId={selectedStageForAdd}
        allVacancies={allVacancies}
        currentVacancy={vacancyInfo}
      />

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        title="Delete Selected Candidates"
        open={bulkDeleteModal}
        onCancel={() => setBulkDeleteModal(false)}
        onOk={handleBulkDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        confirmLoading={bulkActionLoading}
        width={500}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <DeleteOutlined className="text-red-500 text-xl" />
            <div>
              <div className="font-medium text-red-800">
                Permanent Deletion Warning
              </div>
              <div className="text-sm text-red-600 mt-1">
                This action cannot be undone. All candidate data will be permanently removed.
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-gray-700 mb-3">
              You are about to delete <strong>{selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''}</strong>:
            </p>
            
            <div className="max-h-40 overflow-y-auto bg-gray-50 border rounded-lg p-3">
              <div className="space-y-2">
                {selectedCandidates.map(candidateId => {
                  const candidate = candidates.find(c => c.id === candidateId);
                  return (
                    <div key={candidateId} className="flex items-center gap-2 text-sm">
                      <Avatar 
                        src={candidate?.avatar} 
                        icon={<UserOutlined />} 
                        size={24}
                      />
                      <span className="font-medium">
                        {candidate?.fullname || candidate?.email || 'Unknown'}
                      </span>
                      <span className="text-gray-500">
                        ({candidate?.stage || 'No stage'})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Are you sure you want to proceed with this deletion?
          </div>
        </div>
      </Modal>

      <CandidateProfile
        candidateId={candidateProfile}
        onClose={() => setCandidateProfile(null)}
        onUpdate={(newCandidateId) => {
          if (newCandidateId) {
            // Navigate to different candidate
            setCandidateProfile(newCandidateId);
          } else {
            // Just refresh data
            loadATSData({ isBackgroundRefresh: true });
          }
        }}
        stages={pipelineData.columns}
        allCandidateIds={candidates.map(c => c.id)}
      />

      <AssignmentModal
        visible={assignmentModal}
        onCancel={() => {
          setAssignmentModal(false);
          setSelectedCandidateForAssignment(null);
        }}
        candidate={selectedCandidateForAssignment}
        onAssignmentUpdate={handleAssignmentUpdate}
        currentTeam={currentTeam}
      />

      <InterviewSchedulingModal
        visible={interviewSchedulingModal}
        onCancel={() => {
          setInterviewSchedulingModal(false);
          setSelectedCandidateForScheduling(null);
        }}
        onSchedule={handleSendInterviewSuggestions}
        candidate={selectedCandidateForScheduling}
        loading={schedulingLoading}
      />
    </div>
  );
};

export default NewATS; 