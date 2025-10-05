import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class NotificationService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  async getSettings() {
    try {
      const response = await this.api.get(`/notifications/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  async updateSettings(settings) {
    try {
      const response = await this.api.put(`/notifications/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }
  // Get user notifications
  async getNotifications({ page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString()
      });

      const response = await this.api.get(`/user-notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await this.api.patch(`/user-notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await this.api.patch(`/user-notifications/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await this.api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get notification analytics
  async getAnalytics({ vacancyId, days = 30 } = {}) {
    try {
      const params = new URLSearchParams({
        days: days.toString()
      });

      if (vacancyId) {
        params.append('vacancyId', vacancyId);
      }

      const response = await this.api.get(`/notifications/analytics?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification analytics:', error);
      throw error;
    }
  }

  // Get unread count (helper method)
  async getUnreadCount() {
    try {
      const response = await this.getNotifications({ page: 1, limit: 1, unreadOnly: true });
      return response.success ? response.data.unreadCount : 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Real-time notification helpers
  setupRealTimeNotifications(callback) {
    // This could be extended to use WebSockets or Server-Sent Events
    // For now, we'll use polling
    const interval = setInterval(async () => {
      try {
        const unreadCount = await this.getUnreadCount();
        callback({ unreadCount });
      } catch (error) {
        console.error('Error in real-time notification polling:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }
}

export default new NotificationService(`${getBackendUrl()}`);
