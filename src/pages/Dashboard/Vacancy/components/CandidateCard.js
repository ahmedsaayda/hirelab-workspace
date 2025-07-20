import React, { useState } from 'react';
import { Avatar, Rate, Dropdown, Button } from 'antd';
import { 
  UserOutlined, 
  MoreOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

// Inject custom styles for candidate card rating
const cardRatingStyles = `
  .candidate-card-rating .ant-rate-star {
    margin-right: 1px;
    transition: all 0.2s ease;
  }
  
  .candidate-card-rating .ant-rate-star:hover {
    transform: scale(1.1);
  }
  
  .candidate-card-rating .ant-rate-star-full .ant-rate-star-first,
  .candidate-card-rating .ant-rate-star-full .ant-rate-star-second {
    color: #fbbf24;
  }
  
  .candidate-card-rating .ant-rate-star-zero .ant-rate-star-first,
  .candidate-card-rating .ant-rate-star-zero .ant-rate-star-second {
    color: #d1d5db;
  }
  
  .candidate-card-rating .ant-rate-star:hover .ant-rate-star-first,
  .candidate-card-rating .ant-rate-star:hover .ant-rate-star-second {
    color: #f59e0b !important;
  }
  
  /* Success animation */
  .rating-success-feedback {
    animation: ratingSuccess 0.6s ease-out;
  }
  
  @keyframes ratingSuccess {
    0% { 
      transform: scale(1);
      background-color: transparent;
    }
    50% { 
      transform: scale(1.05);
      background-color: rgba(34, 197, 94, 0.1);
    }
    100% { 
      transform: scale(1);
      background-color: transparent;
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#candidate-card-rating-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'candidate-card-rating-styles';
  styleSheet.textContent = cardRatingStyles;
  document.head.appendChild(styleSheet);
}

const CandidateCard = ({ 
  candidate, 
  isDragging = false, 
  onView, 
  onEdit, 
  onEmail, 
  onPhone, 
  onDelete,
  onRatingUpdate,
  showVacancyInfo = false 
}) => {
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);

  const handleRatingChange = async (value) => {
    if (!onRatingUpdate) return;
    
    setIsUpdatingRating(true);
    try {
      await onRatingUpdate(candidate.id, value);
      
      // Show brief success feedback
      setRecentlyUpdated(true);
      setTimeout(() => setRecentlyUpdated(false), 1000);
      
    } catch (error) {
      console.error('Failed to update rating:', error);
    } finally {
      setIsUpdatingRating(false);
    }
  };

  const renderAvatar = () => {
    if (candidate.avatar && candidate.avatar.trim()) {
      return <Avatar size={40} src={candidate.avatar} />;
    }
    
    const name = candidate.fullname?.trim() ? candidate.fullname : candidate.email;
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    return (
      <Avatar 
        size={40} 
        style={{ 
          backgroundColor: '#6366f1',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const getTimeAgo = () => {
    const now = moment();
    const appliedAt = moment(candidate.createdAt);
    const diff = now.diff(appliedAt);

    const duration = moment.duration(diff);
    
    if (duration.asMonths() >= 1) {
      return `${Math.floor(duration.asMonths())}mo`;
    } else if (duration.asWeeks() >= 1) {
      return `${Math.floor(duration.asWeeks())}w`;
    } else if (duration.asDays() >= 1) {
      return `${Math.floor(duration.asDays())}d`;
    } else if (duration.asHours() >= 1) {
      return `${Math.floor(duration.asHours())}h`;
    } else if (duration.asMinutes() >= 1) {
      return `${Math.floor(duration.asMinutes())}m`;
    } else {
      return 'now';
    }
  };

  const menuItems = [
    {
      key: 'view',
      label: 'View Profile',
      icon: <UserOutlined />,
      onClick: (e) => {
        e?.domEvent?.stopPropagation();
        onView && onView();
      },
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (e) => {
        e?.domEvent?.stopPropagation();
        onEdit && onEdit();
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'email',
      label: 'Send Email',
      icon: <MailOutlined />,
      onClick: (e) => {
        e?.domEvent?.stopPropagation();
        onEmail && onEmail();
      },
    },
    {
      key: 'phone',
      label: 'Call',
      icon: <PhoneOutlined />,
      onClick: (e) => {
        e?.domEvent?.stopPropagation();
        onPhone && onPhone();
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e?.domEvent?.stopPropagation();
        onDelete && onDelete();
      },
    },
  ];

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 
        cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300
        w-full
        ${isDragging ? 'rotate-3 shadow-xl border-blue-300 z-50 scale-105' : ''}
      `}
      onClick={onView}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {renderAvatar()}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {candidate.fullname?.trim() || 'Unnamed Candidate'}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {candidate.email}
            </p>
          </div>
        </div>
        
        {/* Actions Menu */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>

      {/* Contact Info */}
      {candidate.phone && (
        <div className="flex items-center gap-2 mb-3">
          <PhoneOutlined className="text-gray-400 text-xs" />
          <span className="text-xs text-gray-600">{candidate.phone}</span>
        </div>
      )}

      {/* Vacancy Info (Multi-job view) */}
      {showVacancyInfo && candidate.vacancyInfo && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100">
          <div className="text-xs font-medium text-blue-700 mb-1">Applied to:</div>
          <div className="text-xs text-blue-600 font-medium">{candidate.vacancyInfo.name}</div>
          {candidate.vacancyInfo.location && (
            <div className="text-xs text-blue-500">{candidate.vacancyInfo.location}</div>
          )}
        </div>
      )}

      {/* Footer with Rating and Time */}
      <div className="flex items-center justify-between">
        {/* Rating */}
        <div 
          className={`flex items-center gap-2 px-1 py-0.5 rounded transition-all duration-300 ${
            recentlyUpdated ? 'bg-green-50 scale-105' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Rate 
            value={candidate.stars || 0} 
            onChange={handleRatingChange}
            style={{ 
              fontSize: '14px',
              opacity: isUpdatingRating ? 0.6 : 1,
              pointerEvents: isUpdatingRating ? 'none' : 'auto'
            }}
            className="candidate-card-rating cursor-pointer"
            allowClear
            allowHalf={false}
            disabled={isUpdatingRating}
            title={isUpdatingRating ? 'Updating rating...' : 'Click to rate this candidate'}
          />
          {isUpdatingRating && (
            <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {recentlyUpdated && (
            <div className="text-green-500 text-xs">✓</div>
          )}
        </div>

        {/* Time Applied */}
        <div className="flex items-center gap-1 text-gray-400">
          <ClockCircleOutlined className="text-xs" />
          <span className="text-xs font-medium">{getTimeAgo()}</span>
        </div>
      </div>

      {/* Additional Info */}
      {candidate.position && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Applied for: </span>
          <span className="text-xs font-medium text-gray-700">{candidate.position}</span>
        </div>
      )}
    </div>
  );
};

export default CandidateCard; 