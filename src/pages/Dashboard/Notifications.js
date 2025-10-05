import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Badge, 
  Button, 
  Switch, 
  Divider, 
  Empty, 
  Spin, 
  message, 
  Modal,
  Tabs,
  InputNumber,
  Select,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  BellIcon, 
  Cog6ToothIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import NotificationService from '../../services/NotificationService';
import { useRouter } from 'next/router';

const { TabPane } = Tabs;
const { Option } = Select;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications({
        page: 1,
        limit: 50
      });

      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      message.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await NotificationService.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await NotificationService.markAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      const deletedNotification = notifications.find(n => n._id === notificationId);
      
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      message.success('Notification deleted');
    } catch (error) {
      message.error('Failed to delete notification');
    }
  };

  const handleSettingsUpdate = async (updatedSettings) => {
    try {
      setSettingsLoading(true);
      const response = await NotificationService.updateSettings(updatedSettings);
      
      if (response.success) {
        setSettings(response.data);
        message.success('Notification settings updated');
        setSettingsModalVisible(false);
      }
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#fa8c16';
      case 'medium': return '#1890ff';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_applicant':
      case 'first_applicant':
        return '👤';
      case 'traffic_spike':
        return '📈';
      case 'engagement_change':
        return '📊';
      case 'deadline_approaching':
        return '⏰';
      case 'no_applicants_warning':
        return '🚨';
      case 'low_conversion_warning':
        return '⚠️';
      case 'ats_inbox_reminder':
        return '📬';
      case 'unread_feedback':
        return '💬';
      case 'draft_funnel_reminder':
        return '📝';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BellIcon className="h-8 w-8 text-indigo-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <Button 
              type="primary" 
              onClick={handleMarkAllAsRead}
              icon={<CheckIcon className="h-4 w-4" />}
            >
              Mark All Read
            </Button>
          )}
          <Button 
            icon={<Cog6ToothIcon className="h-4 w-4" />}
            onClick={() => setSettingsModalVisible(true)}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: `All (${notifications.length})`,
            },
            {
              key: 'unread',
              label: `Unread (${notifications.filter(n => !n.read).length})`,
            },
            {
              key: 'read',
              label: `Read (${notifications.filter(n => n.read).length})`,
            }
          ]}
        />

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Empty 
            description={`No ${activeTab === 'all' ? '' : activeTab} notifications`}
            className="py-8"
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            renderItem={(notification) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  <Tooltip title="Delete notification" key="delete">
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<TrashIcon className="h-4 w-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification._id);
                      }}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {getNotificationIcon(notification.type)}
                      </span>
                      {!notification.read && (
                        <Badge 
                          color={getPriorityColor(notification.priority)} 
                          className="mr-2"
                        />
                      )}
                    </div>
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <span className={`${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  }
                  description={
                    <div>
                      <p className="text-gray-600 mb-1">{notification.message}</p>
                      <Badge 
                        color={getPriorityColor(notification.priority)} 
                        text={notification.priority.toUpperCase()}
                        size="small"
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Settings Modal */}
      <NotificationSettingsModal
        visible={settingsModalVisible}
        settings={settings}
        loading={settingsLoading}
        onCancel={() => setSettingsModalVisible(false)}
        onSave={handleSettingsUpdate}
      />
    </div>
  );
};

// Notification Settings Modal Component
const NotificationSettingsModal = ({ visible, settings, loading, onCancel, onSave }) => {
  const [formSettings, setFormSettings] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormSettings({ ...settings });
    }
  }, [settings]);

  const handleSave = () => {
    onSave(formSettings);
  };

  const updateSetting = (category, field, value) => {
    setFormSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  if (!formSettings) return null;

  const settingCategories = [
    {
      title: 'Applicant Notifications',
      key: 'applicant',
      settings: [
        { key: 'newApplicant', label: 'New Applications', hasDelivery: true },
        { key: 'firstApplicant', label: 'First Application Milestone', hasDelivery: false }
      ]
    },
    {
      title: 'Performance & Analytics',
      key: 'performance',
      settings: [
        { key: 'trafficSpike', label: 'Traffic Spikes', hasThreshold: true },
        { key: 'engagementChange', label: 'Engagement Changes', hasThreshold: true }
      ]
    },
    {
      title: 'Time-based Alerts',
      key: 'timebased',
      settings: [
        { key: 'deadlineApproaching', label: 'Deadline Approaching', hasDays: true },
        { key: 'noApplicantsWarning', label: 'No Applicants Warning', hasDays: true },
        { key: 'lowConversionWarning', label: 'Low Conversion Warning', hasThreshold: true }
      ]
    },
    {
      title: 'System Reminders',
      key: 'system',
      settings: [
        { key: 'atsInboxReminder', label: 'ATS Inbox Reminders', hasFrequency: true },
        { key: 'unreadFeedback', label: 'Unread Feedback', hasDelivery: false },
        { key: 'draftFunnelReminder', label: 'Draft Funnel Reminders', hasDays: true }
      ]
    }
  ];

  return (
    <Modal
      title="Notification Settings"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={loading}
      width={800}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <div className="space-y-6">
        {settingCategories.map(category => (
          <div key={category.key}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{category.title}</h3>
            
            {category.settings.map(setting => {
              const settingData = formSettings[setting.key];
              if (!settingData) return null;

              return (
                <Card key={setting.key} size="small" className="mb-4">
                  <Row gutter={16} align="middle">
                    <Col span={8}>
                      <div className="flex items-center">
                        <Switch
                          checked={settingData.enabled}
                          onChange={(checked) => updateSetting(setting.key, 'enabled', checked)}
                          className="mr-3"
                        />
                        <span className="font-medium">{setting.label}</span>
                      </div>
                    </Col>
                    
                    <Col span={16}>
                      <Row gutter={8}>
                        {setting.hasDelivery && (
                          <Col span={8}>
                            <Select
                              value={settingData.delivery}
                              onChange={(value) => updateSetting(setting.key, 'delivery', value)}
                              disabled={!settingData.enabled}
                              size="small"
                            >
                              <Option value="instant">Instant</Option>
                              <Option value="hourly">Hourly</Option>
                              <Option value="daily">Daily</Option>
                            </Select>
                          </Col>
                        )}
                        
                        {setting.hasThreshold && (
                          <Col span={8}>
                            <InputNumber
                              value={settingData.threshold}
                              onChange={(value) => updateSetting(setting.key, 'threshold', value)}
                              disabled={!settingData.enabled}
                              min={1}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}
                              size="small"
                            />
                          </Col>
                        )}
                        
                        {setting.hasDays && (
                          <Col span={8}>
                            <InputNumber
                              value={settingData.daysBefore || settingData.daysThreshold}
                              onChange={(value) => updateSetting(
                                setting.key, 
                                settingData.daysBefore !== undefined ? 'daysBefore' : 'daysThreshold', 
                                value
                              )}
                              disabled={!settingData.enabled}
                              min={1}
                              max={30}
                              formatter={value => `${value} days`}
                              parser={value => value.replace(' days', '')}
                              size="small"
                            />
                          </Col>
                        )}
                        
                        <Col span={4}>
                          <Switch
                            checked={settingData.email}
                            onChange={(checked) => updateSetting(setting.key, 'email', checked)}
                            disabled={!settingData.enabled}
                            size="small"
                          />
                          <span className="ml-1 text-xs">Email</span>
                        </Col>
                        
                        <Col span={4}>
                          <Switch
                            checked={settingData.inApp}
                            onChange={(checked) => updateSetting(setting.key, 'inApp', checked)}
                            disabled={!settingData.enabled}
                            size="small"
                          />
                          <span className="ml-1 text-xs">In-App</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Notifications;
