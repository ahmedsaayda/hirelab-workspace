import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { selectUser } from '../redux/auth/selectors';
import { refreshUser } from '../redux/auth/actions';
import WorkspaceService from '../services/WorkspaceService';
import TeamService from '../services/TeamService';
import CategoryService from '../services/CategoryService';
import Cookies from 'js-cookie';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workspaceSession, setWorkspaceSession] = useState(false);
  const [accessibleWorkspaces, setAccessibleWorkspaces] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  // Check if user is in workspace session
  useEffect(() => {
    const isWorkspaceSession = user?.isWorkspaceSession || false;
    const workspaceData = isWorkspaceSession ? {
      id: user.workspaceId,
      name: user.workspaceName || 'Current Workspace'
    } : null;

    setWorkspaceSession(isWorkspaceSession);
    setCurrentWorkspace(workspaceData);
  }, [user]);

  useEffect(() => {
    const fetchAccessibleWorkspaces = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) return;

      try {
        const response = await WorkspaceService.getAccessibleWorkspaces();
        setAccessibleWorkspaces(response.data || []);
        const pending = (response.data || []).filter((workspace) => workspace?.status === 'pending');
        setPendingInvitations(pending);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching accessible workspaces:", error);
        }
      }
    };

    fetchAccessibleWorkspaces();
  }, [workspaceSession]);

  // Fetch workspaces for current user
  const fetchWorkspaces = useCallback(async () => {
    if (workspaceSession) return; // Don't fetch if in workspace session

    setLoading(true);
    try {
      const response = await WorkspaceService.getWorkspaces();
      const workspaceList = response.data;
      setWorkspaces(workspaceList);

      if (currentWorkspace && workspaceList?.length) {
        const match = workspaceList.find((ws) => ws._id === currentWorkspace?.id || ws._id === currentWorkspace?._id);
        if (match) {
          setCurrentWorkspace((prev) => ({
            ...prev,
            ...match,
            id: match._id,
            name: match.name || match.clientName || prev?.name,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      if (error.response?.status === 403) {
        message.error("Workspace feature not enabled for your account. Please contact admin.");
      } else {
        message.error("Failed to fetch workspaces");
      }
    } finally {
      setLoading(false);
    }
  }, [workspaceSession, currentWorkspace]);

  // Switch to a workspace
  const switchToWorkspace = useCallback(async (workspaceId, { skipRedirect = false } = {}) => {
    // Prevent multiple simultaneous switches
    if (loading) {
      console.log("Workspace switch already in progress, ignoring...");
      return;
    }

    setLoading(true);
    try {
      const response = await WorkspaceService.switchToWorkspace(workspaceId);

      // Set cookies with explicit options for better reliability
      Cookies.set("accessToken", response.data.accessToken, {
        path: "/",
        secure: window.location.protocol === "https:",
        sameSite: "lax"
      });
      Cookies.set("refreshToken", response.data.refreshToken, {
        path: "/",
        secure: window.location.protocol === "https:",
        sameSite: "lax"
      });

      dispatch(refreshUser(response.data.user));

      message.success(`Switched to workspace successfully!`);

      if (!skipRedirect) {
        // Add a small delay to ensure cookies are fully written before redirect
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }

      return response.data;
    } catch (error) {
      console.error("Error switching to workspace:", error);
      message.error("Failed to switch to workspace");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch, loading]);

  const refreshAccessibleWorkspaces = useCallback(async () => {
    const accessToken = Cookies.get("accessToken");
    if (!user || !accessToken) {
      return;
    }

    try {
      const response = await WorkspaceService.getAccessibleWorkspaces();
      setAccessibleWorkspaces(response.data || []);
      const pending = (response.data || []).filter((workspace) => workspace?.status === 'pending');
      setPendingInvitations(pending);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error refreshing accessible workspaces:", error);
      }
    }
  }, [user]);

  const acceptWorkspaceInvitation = useCallback(async (token) => {
    try {
      const response = await WorkspaceService.acceptWorkspaceInvitation(token);

      if (response.data?.accessToken) {
        Cookies.set("accessToken", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
      }

      if (response.data?.user) {
        dispatch(refreshUser(response.data.user));
      }

      if (response.data?.workspace?._id) {
        setCurrentWorkspace({
          id: response.data.workspace._id,
          name: response.data.workspace.name,
        });
      }

      message.success("Invitation accepted. Switching workspace...");
      await refreshAccessibleWorkspaces();

      if (response.data?.workspace?._id) {
        window.location.href = "/dashboard";
      }

      return response.data;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      message.error(error.response?.data?.message || "Failed to accept invitation");
      throw error;
    }
  }, [dispatch, refreshAccessibleWorkspaces]);

  const declineWorkspaceInvitation = useCallback(async (token) => {
    try {
      await WorkspaceService.declineWorkspaceInvitation(token);
      message.success("Invitation declined");
      await refreshAccessibleWorkspaces();
    } catch (error) {
      console.error("Error declining invitation:", error);
      message.error(error.response?.data?.message || "Failed to decline invitation");
      throw error;
    }
  }, [refreshAccessibleWorkspaces]);

  // Return from workspace session
  const returnFromWorkspace = useCallback(async ({ redirectTo, skipRedirect } = {}) => {
    setLoading(true);
    try {
      const response = await WorkspaceService.returnFromWorkspace();

      // Update cookies with new tokens
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      // Update Redux store with new user data
      dispatch(refreshUser(response.data.user));

      message.success("Returned to main account successfully!");
      if (!skipRedirect) {
        window.location.href = redirectTo || "/dashboard/workspaces";
      }

      return response.data;
    } catch (error) {
      console.error("Error returning from workspace:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Unified smart return: server return + optional team switch back to own team, with loop suppression
  const returnToMainSmart = useCallback(async () => {
    try {
      const response = await WorkspaceService.returnFromWorkspace();
      console.log('[returnToMainSmart] Backend response user:', {
        currentTeam: response.data.user.currentTeam,
        defaultTeam: response.data.user.defaultTeam
      });
      Cookies.set('accessToken', response.data.accessToken);
      Cookies.set('refreshToken', response.data.refreshToken);
      dispatch(refreshUser(response.data.user));
      window.location.href = '/dashboard?t=' + Date.now();
    } catch (error) {
      console.error('Error returning to main account:', error);
      message.error('Failed to return to main account');
      throw error;
    }
  }, [dispatch]);

  // Get workspace details
  const getWorkspace = useCallback(async (workspaceId) => {
    try {
      const response = await WorkspaceService.getWorkspace(workspaceId);
      const data = response.data || {};
      return data.workspace || data;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      throw error;
    }
  }, []);

  // Update workspace
  const updateWorkspace = useCallback(async (workspaceId, data) => {
    const canUpdate = user?.allowWorkspaces || (user?.isWorkspaceSession && user?.workspaceRole === 'owner');
    if (!canUpdate) {
      message.error("You do not have permission to update this workspace");
      return;
    }
    try {
      console.log("updateWorkspace data:", data);
      const response = await WorkspaceService.updateWorkspace(workspaceId, data);
      console.log("updateWorkspace response:", response);

      const updatedWorkspace = response.data?.workspace || response.data;

      if (updatedWorkspace) {
        // Update cached workspaces list
        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.map((workspace) =>
            workspace._id === updatedWorkspace._id ? { ...workspace, ...updatedWorkspace } : workspace
          )
        );

        // Update current workspace cache if it matches
        if (currentWorkspace && (currentWorkspace.id === updatedWorkspace._id || currentWorkspace._id === updatedWorkspace._id)) {
          setCurrentWorkspace((prev) => ({
            ...prev,
            ...updatedWorkspace,
            id: updatedWorkspace._id,
            name: updatedWorkspace.name || updatedWorkspace.clientName || prev?.name,
          }));
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw error;
    }
  }, [currentWorkspace, user]);

  // Delete workspace
  const deleteWorkspace = useCallback(async (workspaceId) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to delete this workspace");
      return;
    }
    try {
      const response = await WorkspaceService.deleteWorkspace(workspaceId);
      // Don't show message here - the modal will show detailed success message
      fetchWorkspaces(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      message.error("Failed to delete workspace");
      throw error;
    }
  }, [fetchWorkspaces, user]);

  // Get workspace members
  const getWorkspaceMembers = useCallback(async (workspaceId) => {
    try {
      const response = await WorkspaceService.getWorkspaceMembers(workspaceId);
      return response.data;
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      throw error;
    }
  }, []);

  // Invite user to workspace
  const inviteUserToWorkspace = useCallback(async (workspaceId, email, role) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to invite users to this workspace");
      return;
    }
    try {
      await WorkspaceService.inviteUserToWorkspace(workspaceId, email, role);
      message.success(`Invitation sent to ${email}`);
      await refreshAccessibleWorkspaces();
    } catch (error) {
      console.error("Error inviting user:", error);
      message.error("Failed to send invitation");
    }
  }, [refreshAccessibleWorkspaces, user]);

  // Update workspace member role
  const updateWorkspaceMember = useCallback(async (workspaceId, memberId, role) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to update workspace members");
      return;
    }
    try {
      await WorkspaceService.updateWorkspaceMember(workspaceId, memberId, role);
      message.success("Member role updated successfully");
      await refreshAccessibleWorkspaces();
    } catch (error) {
      console.error("Error updating member role:", error);
      message.error("Failed to update member role");
    }
  }, [refreshAccessibleWorkspaces, user]);

  // Remove workspace member
  const removeWorkspaceMember = useCallback(async (workspaceId, memberId) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to remove workspace members");
      return;
    }
    try {
      await WorkspaceService.removeWorkspaceMember(workspaceId, memberId);
      message.success("Member removed successfully");
      await refreshAccessibleWorkspaces();
    } catch (error) {
      console.error("Error removing member:", error);
      message.error("Failed to remove member");
    }
  }, [refreshAccessibleWorkspaces, user]);

  // Create workspace
  const createWorkspace = useCallback(async (workspaceData) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to create workspaces");
      return;
    }
    try {
      const response = await WorkspaceService.createWorkspace(workspaceData);
      return response.data;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  }, [user]);

  // Get categories for workspace
  const getCategories = useCallback(async (workspaceId) => {
    try {
      const response = await CategoryService.getCategories(workspaceId);
      console.log("Categories response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (workspaceId, categoryData) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to create categories in this workspace");
      return;
    }
    try {
      await CategoryService.createCategory(workspaceId, categoryData);
      message.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Failed to create category");
    }
  }, [user]);

  // Update category
  const updateCategory = useCallback(async (categoryId, categoryData) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to update categories in this workspace");
      return;
    }
    try {
      await CategoryService.updateCategory(categoryId, categoryData);
      message.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");
    }
  }, [user]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to delete categories in this workspace");
      return;
    }
    try {
      await CategoryService.deleteCategory(categoryId);
      message.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    }
  }, [user]);

  // Toggle category publish status
  const toggleCategoryPublish = useCallback(async (categoryId) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to publish categories in this workspace");
      return;
    }
    try {
      await CategoryService.toggleCategoryPublish(categoryId);
      message.success("Category publish status updated");
    } catch (error) {
      console.error("Error updating category publish status:", error);
      message.error("Failed to update category publish status");
    }
  }, [user]);

  // Update workspace quotas
  const updateWorkspaceQuotas = useCallback(async (workspaceId, maxFunnels, atsAccess) => {
    if (!user?.allowWorkspaces) {
      message.error("You do not have permission to update workspace quotas");
      return;
    }
    try {
      await WorkspaceService.updateWorkspaceQuotas(workspaceId, maxFunnels, atsAccess);
      message.success('Workspace quotas updated');
    } catch (error) {
      console.error("Error updating quotas:", error);
      message.error("Failed to update quotas");
    }
  }, [user]);

  // Get workspace funnel usage
  const getWorkspaceFunnelUsage = useCallback(async () => {
    try {
      const response = await WorkspaceService.getWorkspaceFunnelUsage();
      return response.data;
    } catch (error) {
      console.error("Error getting workspace funnel usage:", error);
      throw error;
    }
  }, []);

  // Purchase additional funnels
  const purchaseAdditionalFunnels = useCallback(async (additionalFunnels) => {
    try {
      const response = await WorkspaceService.purchaseAdditionalFunnels(additionalFunnels);

      // If we get a payment link, redirect to Stripe checkout
      if (response.data?.paymentLink) {
        window.location.href = response.data.paymentLink;
        return;
      }

      // Fallback success message (shouldn't happen with proper Stripe integration)
      message.success(`Successfully purchased ${additionalFunnels} additional funnels!`);
      return response.data;
    } catch (error) {
      console.error("Error purchasing additional funnels:", error);
      message.error(error.response?.data?.message || "Failed to purchase additional funnels");
      throw error;
    }
  }, []);

  const getWorkspaceSwitcherEntries = useCallback(() => {
    const activeWorkspaces = (accessibleWorkspaces || []).filter((entry) => entry.status === 'active');
    const pending = pendingInvitations || [];

    const entries = activeWorkspaces.map((workspace) => ({
      id: workspace._id,
      name: workspace.name || workspace.clientName || 'Workspace',
      ownerId: workspace.ownerId,
      role: workspace.role,
      status: 'active',
    }));

    const invites = pending.map((entry) => ({
      id: entry.workspaceId,
      name: entry.workspaceName,
      ownerId: entry.ownerId,
      role: entry.role,
      status: 'pending',
      token: entry.token,
      invitedAt: entry.invitedAt,
    }));

    return { active: entries, pending: invites };
  }, [accessibleWorkspaces, pendingInvitations]);

  const value = {
    // State
    currentWorkspace,
    workspaces,
    loading,
    workspaceSession,
    accessibleWorkspaces,
    pendingInvitations,
    workspaceEnabled: Boolean(user?.allowWorkspaces),
    workspaceSwitcherEntries: getWorkspaceSwitcherEntries,

    // Actions
    fetchWorkspaces,
    createWorkspace,
    switchToWorkspace,
    returnFromWorkspace,
    returnToMainSmart,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceMembers,
    inviteUserToWorkspace,
    updateWorkspaceMember,
    removeWorkspaceMember,
    acceptWorkspaceInvitation,
    declineWorkspaceInvitation,
    refreshAccessibleWorkspaces,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryPublish,
    updateWorkspaceQuotas,
    getWorkspaceFunnelUsage,
    purchaseAdditionalFunnels,
    getWorkspaceSwitcherEntries,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContext;
