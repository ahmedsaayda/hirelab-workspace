import React, { useState, useEffect, useCallback } from 'react';
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
  StarOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  CloseOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/router';
import ATSService from '../../../services/ATSService';
import CrudService from '../../../services/CrudService';
import moment from 'moment';

// Import modern component sub-components
import CandidateCard from './components/CandidateCard';
import AddCandidateModal from './components/AddCandidateModal';
import CandidateProfile from './components/CandidateProfile';

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
    color: #3b82f6;
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
    background: #3b82f6;
    border-color: #3b82f6;
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
    border-top: 1.5px solid #3b82f6;
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
  }
  
  .ats-header .ats-search-input .ant-input-search:hover {
    border-color: #3b82f6 !important;
    box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input-search:focus-within {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    font-size: 14px !important;
    color: #374151 !important;
  }
  
  .ats-header .ats-search-input .ant-input::placeholder {
    color: #9ca3af !important;
    font-size: 14px !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button {
    border: none !important;
    background: #3b82f6 !important;
    color: white !important;
    border-radius: 0 6px 6px 0 !important;
    font-weight: 500 !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 16px !important;
  }
  
  .ats-header .ats-search-input .ant-input-search-button:hover {
    background: #2563eb !important;
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2) !important;
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
  
  .ats-header .ats-search-input .ant-input-affix-wrapper {
    border-radius: 8px !important;
    border: 1px solid #d1d5db !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
    background: white !important;
  }
  
  .ats-header .ats-search-input .ant-input-affix-wrapper:hover {
    border-color: #3b82f6 !important;
    box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1) !important;
  }
  
  .ats-header .ats-search-input .ant-input-affix-wrapper-focused {
    border-color: #3b82f6 !important;
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
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 1px 2px 0 rgba(59, 130, 246, 0.2) !important;
  }
  
  .ats-header .ant-btn-primary:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    border-color: #2563eb !important;
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
  // State management
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'table'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchPending, setSearchPending] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  
  // Bulk action states
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Rating update states
  const [updatingRatings, setUpdatingRatings] = useState(new Set());
  const [recentlyUpdatedRatings, setRecentlyUpdatedRatings] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    stages: [], // array of stage IDs
    ratings: [], // array of rating values (1-5)
    dateRange: null, // { start: Date, end: Date }
    showRejected: false
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
          loadATSData();
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
  const [candidates, setCandidates] = useState([]);

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

  const router = useRouter();

  // Load ATS data with enhanced search using VacancySubmissions
  const loadATSData = useCallback(async () => {
    setLoading(true);
    try {
      if (isMultiJobView) {
        console.log('🔄 Loading ATS data for ALL vacancies (multi-job view)');
      } else {
        console.log('🔄 Loading ATS data for vacancy:', VacancyId);
      }
      
      // First, ensure we have default stages
      let stages = await ensureDefaultStages();
      console.log('📋 Loaded stages:', stages);
      
      if (isMultiJobView) {
        console.log('🔍 Searching for ALL candidates across all user vacancies');
      } else {
        console.log('🔍 Searching for candidates with LandingPageDataId:', VacancyId);
      }
      
      // Try multiple search approaches
      let allCandidates = [];
      let allVacancies = [];
      
      if (isMultiJobView) {
        // Multi-job view: Get all candidates across all user vacancies
        try {
          console.log('🔍 Fetching all candidates for multi-job view');
          const candidatesResponse = await CrudService.search('VacancySubmission', 1000, 1, {});
          console.log('👥 All candidates response:', candidatesResponse);
          allCandidates = candidatesResponse.data?.items || candidatesResponse.data?.data || [];
          console.log('👥 Total candidates found (all vacancies):', allCandidates.length);
          
          // Also fetch all vacancies to get vacancy names
          const vacanciesResponse = await CrudService.search('LandingPageData', 1000, 1, {});
          allVacancies = vacanciesResponse.data?.items || vacanciesResponse.data?.data || [];
          console.log('📋 Total vacancies found:', allVacancies.length);
          
        } catch (error) {
          console.error('❌ Error fetching all candidates:', error);
        }
      } else {
        // Single vacancy view: Search by LandingPageDataId
        try {
          console.log('🔍 Attempting search with params:', { LandingPageDataId: VacancyId });
          const candidatesResponse1 = await CrudService.search('VacancySubmission', 1000, 1, {
            filters: { LandingPageDataId: VacancyId }
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
            const candidatesResponse2 = await CrudService.search('VacancySubmission', 1000, 1, {});
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
              sort: { createdAt: -1 }
            });
            console.log('👥 Alternative CrudService response:', alternativeResponse);
            allCandidates = alternativeResponse.data?.items || alternativeResponse.data?.data || [];
            console.log('👥 Alternative CrudService candidates found:', allCandidates.length);
          } catch (error) {
            console.error('❌ Error with method 3:', error);
          }
        }
      
      // Enrich candidates with vacancy information for multi-job view
      if (isMultiJobView && allVacancies.length > 0) {
        const vacancyMap = {};
        allVacancies.forEach(vacancy => {
          vacancyMap[vacancy._id] = {
            name: vacancy.vacancyTitle || 'Untitled Vacancy',
            location: vacancy.location,
            department: vacancy.department
          };
        });
        
        allCandidates = allCandidates.map(candidate => ({
          ...candidate,
          vacancyInfo: vacancyMap[candidate.LandingPageDataId] || { 
            name: 'Unknown Vacancy', 
            location: '', 
            department: '' 
          }
        }));
        
        console.log('✨ Enriched candidates with vacancy info for multi-job view');
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
          
          // 5. Vacancy filter (multi-job view only)
          if (isMultiJobView && filters.vacancies && filters.vacancies.length > 0) {
            const candidateVacancy = candidate.vacancyInfo?.name;
            if (!candidateVacancy || !filters.vacancies.includes(candidateVacancy)) {
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
            
            return {
              id: candidate._id,
              fullname: fullname || 'Unknown',
              email: email,
              phone: phone,
              avatar: avatar, // null instead of empty string prevents broken image
              stars: candidate.stars || 0,
              createdAt: candidate.createdAt,
              position: vacancyInfo?.name || 'Position',
              stageId: stage._id,
              rejected: candidate.rejected || false
            };
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
        col.cards.map(card => ({
          ...card,
          stage: col.title,
          stageId: col.id
        }))
      );
      
      console.log('📊 Filtering results:', {
        totalCandidatesBeforeFilter: allCandidates.length,
        totalCandidatesAfterFilter: flatCandidates.length,
        stagesShown: boardColumns.filter(col => col.cards.length > 0).length,
        totalStages: boardColumns.length,
        activeStageFilter: filters.stages.length > 0 ? filters.stages : 'none'
      });
      
      setCandidates(flatCandidates);
      
    } catch (error) {
      console.error('Error loading ATS data:', error);
      message.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [VacancyId, debouncedSearchTerm, vacancyInfo, filters, isMultiJobView]);

  // Ensure default stages exist and return them
  const ensureDefaultStages = async () => {
    try {
      console.log('🔍 Checking stages for vacancy:', VacancyId);
      const existingStages = await CrudService.search('VacancyStage', 100, 1, {
        filters: { vacancyId: VacancyId }
      });
      
      console.log('📋 Existing stages response:', existingStages);
      
      const stages = existingStages.data?.items || [];
      console.log('📊 Found stages:', stages.length, stages.map(s => s.name));
      
      if (stages.length === 0) {
        console.log('🔨 No stages found, creating default stages...');
        return await createDefaultStages();
      } else {
        console.log('✅ Using existing stages:', stages.length);
        // Take only the first 5 stages to avoid duplicates
        const uniqueStages = stages.slice(0, 5).sort((a, b) => (a.sort || 0) - (b.sort || 0));
        console.log('📊 Using first 5 stages:', uniqueStages.map(s => s.name));
        return uniqueStages;
      }
    } catch (error) {
      console.error('❌ Error checking stages:', error);
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

  useEffect(() => {
    loadATSData();
  }, [loadATSData]);

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
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      // Update UI optimistically
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

      message.success('Candidate moved successfully');
    } catch (error) {
      console.error('Error moving candidate:', error);
      message.error('Failed to move candidate');
      loadATSData(); // Revert on error
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
          message.success('Candidate deleted successfully');
          loadATSData(); // Reload to update the UI
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
      
      message.success(`Successfully deleted ${selectedCandidates.length} candidate${selectedCandidates.length !== 1 ? 's' : ''}`);
      
      // Clear selection and reload data
      setSelectedCandidates([]);
      setBulkDeleteModal(false);
      loadATSData();
      
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
      
      const stageName = pipelineData.columns.find(col => col.id === stageId)?.title || 'Unknown Stage';
      message.success(`Successfully moved ${selectedCandidates.length} candidate${selectedCandidates.length !== 1 ? 's' : ''} to ${stageName}`);
      
      // Clear selection and reload data
      setSelectedCandidates([]);
      loadATSData();
      
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
          <div className="flex-1 bg-gray-100 p-6">

      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6">
          {pipelineData.columns.map((column, index) => (
            <div key={`column-${column.id || index}`} className="flex-shrink-0 w-72 pipeline-column">
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
                    <h3 className="font-semibold text-gray-900 text-base">
                      {column.title}
                    </h3>
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
                              onRatingUpdate={handleRatingUpdate}
                              showVacancyInfo={isMultiJobView}
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
          ))}
        </div>
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
                    <Button size="small" type="primary" loading={bulkActionLoading}>
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

  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-9 px-4 font-medium shadow-sm"
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
                  loadATSData();
                }}
                loading={searchPending}
                className="w-full ats-search-input"
                size="large"
                allowClear
                enterButton="Search"
                style={{
                  borderRadius: '8px',
                }}
              />
              {searchPending && (
                <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              )}
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
                {(filters.stages.length > 0 || filters.ratings.length > 0 || filters.dateRange || !filters.showRejected) && (
                  <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {filters.stages.length + filters.ratings.length + (filters.dateRange ? 1 : 0) + (!filters.showRejected ? 0 : 1)}
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
                    showRejected: false
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
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isMultiJobView ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
              
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
                    options={Array.from(new Set(candidates.map(c => c.vacancyInfo?.name).filter(Boolean)))
                      .map(vacancyName => {
                        const count = candidates.filter(c => c.vacancyInfo?.name === vacancyName).length;
                        return {
                          label: `${vacancyName} (${count})`,
                          value: vacancyName
                        };
                      })}
                    maxTagCount="responsive"
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
                          vacancies: []
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
            {(filters.stages.length > 0 || filters.ratings.length > 0 || filters.dateRange || filters.showRejected) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
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
          loadATSData();
        }}
        vacancyId={VacancyId}
        stages={pipelineData.columns}
        editData={typeof addCandidateModal === 'object' ? addCandidateModal : null}
        defaultStageId={selectedStageForAdd}
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
            loadATSData();
          }
        }}
        stages={pipelineData.columns}
        allCandidateIds={candidates.map(c => c.id)}
      />
    </div>
  );
};

export default NewATS; 