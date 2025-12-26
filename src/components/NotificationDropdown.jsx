import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Spin, Empty, Button, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import NotificationService from '../services/NotificationService';

const NotificationDropdown = ({ className = '', onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onToggle) {
          onToggle(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onToggle]);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      loadNotifications();
    }
  }, [isOpen]);

  // Load initial unread count
  useEffect(() => {
    loadUnreadCount();
    
    // Set up polling for new notifications every 10 seconds for testing
    const interval = setInterval(loadUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications({
        page: pageNum,
        limit: 10
      });

      if (response.success) {
        const newNotifications = reset ? response.data.notifications : 
          [...notifications, ...response.data.notifications];
        
        setNotifications(newNotifications);
        setUnreadCount(response.data.unreadCount);
        setHasMore(response.data.pagination.current < response.data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // If API fails (401, 404, etc.), show empty state
      setNotifications([]);
      setUnreadCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await NotificationService.getNotifications({
        page: 1,
        limit: 1,
        unreadOnly: true
      });
      
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      // Silently fail for background polling - API might not be ready yet
      // Don't spam console in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading unread count:', error);
      }
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await NotificationService.markAsRead(notification._id);
        // Optimistically update UI
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (e) {
        console.error('Failed to mark notification as read:', e);
      }
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      setIsOpen(false);
      if (onToggle) {
        onToggle(false);
      }
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    
    const deletedNotification = notifications.find(n => n._id === notificationId);
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    
    if (deletedNotification && !deletedNotification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(page + 1);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-4 h-4 mr-3 text-gray-500";
    
    switch (type) {
      case 'new_applicant':
      case 'first_applicant':
        return <div className={`${iconClass} flex items-center justify-center`}>👤</div>;
      case 'traffic_spike':
        return <div className={`${iconClass} flex items-center justify-center`}>📈</div>;
      case 'engagement_change':
        return <div className={`${iconClass} flex items-center justify-center`}>📊</div>;
      case 'deadline_approaching':
        return <div className={`${iconClass} flex items-center justify-center`}>⏰</div>;
      case 'no_applicants_warning':
        return <div className={`${iconClass} flex items-center justify-center`}>🚨</div>;
      case 'low_conversion_warning':
        return <div className={`${iconClass} flex items-center justify-center`}>⚠️</div>;
      // Removed per request
      // case 'ats_inbox_reminder':
      //   return <div className={`${iconClass} flex items-center justify-center`}>📬</div>;
      case 'unread_feedback':
        return <div className={`${iconClass} flex items-center justify-center`}>💬</div>;
      case 'draft_funnel_reminder':
        return <div className={`${iconClass} flex items-center justify-center`}>📝</div>;
      default:
        return <div className={`${iconClass} flex items-center justify-center`}>🔔</div>;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          if (onToggle) {
            onToggle(newIsOpen);
          }
        }}
        className="relative flex items-center justify-center w-full h-full text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
        style={{ padding: 0 }}
        title={`${unreadCount} unread notifications`}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full min-w-[14px] h-[14px] px-[2px] flex items-center justify-center font-semibold text-[8px] leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden" 
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                size="small" 
                onClick={handleMarkAllAsRead}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : notifications.length === 0 ? (
              <Empty 
                description="No notifications yet"
                className="py-8"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-gray-50 border-l-4 border-l-blue-500' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {getNotificationIcon(notification.type)}
                          <p className={`text-sm font-medium text-gray-900 truncate`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 text-left">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 text-left">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <Tooltip title="Delete notification">
                        <button
                          onClick={(e) => handleDeleteNotification(notification._id, e)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="px-4 py-3 text-center border-t border-gray-200">
                    <Button 
                      type="link" 
                      onClick={loadMore}
                      loading={loading}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 text-center">
            <Button 
              type="link" 
              onClick={() => {
                setIsOpen(false);
                if (onToggle) {
                  onToggle(false);
                }
                router.push('/dashboard/notifications');
              }}
              className="text-indigo-600 hover:text-indigo-500"
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;