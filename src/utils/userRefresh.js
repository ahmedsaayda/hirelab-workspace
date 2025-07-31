import AuthService from "../services/AuthService";
import { store } from "../redux/store";
import { refreshUser } from "../redux/auth/actions";

/**
 * Refreshes user data in the Redux store by fetching the latest data from the API
 * This should be called after operations that affect user billing, usage, or subscription
 * @returns {Promise<Object|null>} Updated user data or null if error
 */
export const refreshUserData = async () => {
  try {
    console.log("🔄 Refreshing user data...");
    const response = await AuthService.me();
    
    if (response?.data?.me) {
      // Update Redux store with fresh user data
      store.dispatch(refreshUser(response.data.me));
      console.log("✅ User data refreshed successfully", response.data.me);
      return response.data.me;
    } else {
      console.error("❌ Failed to refresh user data: Invalid response", response);
      return null;
    }
  } catch (error) {
    console.error("❌ Error refreshing user data:", error);
    return null;
  }
}; 