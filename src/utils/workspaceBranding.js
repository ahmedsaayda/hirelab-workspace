/**
 * Workspace Branding Utilities
 *
 * Helper functions to handle workspace-specific branding inheritance
 * and fetching workspace branding data when in workspace sessions.
 */

/**
 * Get branding details based on current user session context
 * @param {Object} user - Current user object from Redux
 * @param {Array} workspaces - Available workspaces (optional, for caching)
 * @returns {Object} Branding details object
 */
export const getBrandingDetails = async (user, workspaces = []) => {
  if (!user) {
    return getDefaultBranding();
  }

  if (user.isWorkspaceSession && user.workspaceId) {
    // In workspace session - fetch workspace-specific branding
    try {
      const workspace = workspaces.find(ws => ws._id === user.workspaceId);

      if (workspace) {
        // Use workspace branding if available, otherwise fall back to user branding
        return {
          companyName: workspace.companyName || user.companyName,
          companyUrl: workspace.companyWebsite || user.companyUrl,
          companyInfo: user.companyInfo, // Company info stays at user level
          companyLogo: workspace.companyLogo || user.companyLogo,
          primaryColor: workspace.primaryColor || user.primaryColor,
          secondaryColor: workspace.secondaryColor || user.secondaryColor,
          tertiaryColor: workspace.tertiaryColor || user.tertiaryColor,
          heroTitleColor: workspace.heroTitleColor || user.heroTitleColor,
          selectedFont: workspace.selectedFont || user.selectedFont,
          titleFont: workspace.titleFont || user.titleFont,
          subheaderFont: workspace.subheaderFont || user.subheaderFont,
          bodyFont: workspace.bodyFont || user.bodyFont,
        };
      } else {
        // Workspace not found in cache, fetch from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workspaces/${user.workspaceId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const workspaceData = await response.json();
          return {
            companyName: workspaceData.workspace.companyName || user.companyName,
            companyUrl: workspaceData.workspace.companyWebsite || user.companyUrl,
            companyInfo: user.companyInfo,
            companyLogo: workspaceData.workspace.companyLogo || user.companyLogo,
            primaryColor: workspaceData.workspace.primaryColor || user.primaryColor,
            secondaryColor: workspaceData.workspace.secondaryColor || user.secondaryColor,
            tertiaryColor: workspaceData.workspace.tertiaryColor || user.tertiaryColor,
            heroTitleColor: workspaceData.workspace.heroTitleColor || user.heroTitleColor,
            selectedFont: workspaceData.workspace.selectedFont || user.selectedFont,
            titleFont: workspaceData.workspace.titleFont || user.titleFont,
            subheaderFont: workspaceData.workspace.subheaderFont || user.subheaderFont,
            bodyFont: workspaceData.workspace.bodyFont || user.bodyFont,
          };
        }
      }
    } catch (error) {
      console.error('Error fetching workspace branding:', error);
    }

    // Fallback to user branding if workspace fetch fails
    return getUserBranding(user);
  } else {
    // Main session - use user branding
    return getUserBranding(user);
  }
};

/**
 * Get user-level branding details
 * @param {Object} user - User object
 * @returns {Object} Branding details
 */
export const getUserBranding = (user) => {
  return {
    companyName: user?.companyName || "",
    companyUrl: user?.companyUrl || "",
    companyInfo: user?.companyInfo || "",
    companyLogo: user?.companyLogo || "",
    primaryColor: user?.primaryColor || "#0066CC",
    secondaryColor: user?.secondaryColor || "#333333",
    tertiaryColor: user?.tertiaryColor || "#666666",
    heroTitleColor: user?.heroTitleColor || "#222222",
    selectedFont: user?.selectedFont || { family: "Poppins-Bold", src: "" },
    titleFont: user?.titleFont || { family: "Poppins-Bold", src: "" },
    subheaderFont: user?.subheaderFont || { family: "Poppins-Medium", src: "" },
    bodyFont: user?.bodyFont || { family: "Poppins-Regular", src: "" },
  };
};

/**
 * Get default branding when no user/workspace data is available
 * @returns {Object} Default branding details
 */
export const getDefaultBranding = () => {
  return {
    companyName: "HireLab",
    companyUrl: "",
    companyInfo: "",
    companyLogo: "",
    primaryColor: "#0066CC",
    secondaryColor: "#333333",
    tertiaryColor: "#666666",
    heroTitleColor: "#222222",
    selectedFont: { family: "Poppins-Bold", src: "" },
    titleFont: { family: "Poppins-Bold", src: "" },
    subheaderFont: { family: "Poppins-Medium", src: "" },
    bodyFont: { family: "Poppins-Regular", src: "" },
  };
};

/**
 * Check if current session is in a workspace context
 * @param {Object} user - User object
 * @returns {boolean} True if in workspace session
 */
export const isWorkspaceSession = (user) => {
  return user?.isWorkspaceSession && user?.workspaceId;
};

/**
 * Get current workspace information
 * @param {Object} user - User object
 * @param {Array} workspaces - Available workspaces
 * @returns {Object|null} Current workspace object or null
 */
export const getCurrentWorkspace = (user, workspaces = []) => {
  if (!isWorkspaceSession(user)) {
    return null;
  }

  return workspaces.find(ws => ws._id === user.workspaceId) || null;
};

/**
 * Format workspace session display information
 * @param {Object} user - User object
 * @param {Array} workspaces - Available workspaces
 * @returns {Object} Formatted display info
 */
export const getWorkspaceDisplayInfo = (user, workspaces = []) => {
  const currentWorkspace = getCurrentWorkspace(user, workspaces);

  if (!currentWorkspace) {
    return {
      isWorkspaceSession: false,
      workspaceName: null,
      workspaceSlug: null,
      displayText: "Main Account"
    };
  }

  return {
    isWorkspaceSession: true,
    workspaceName: currentWorkspace.name,
    workspaceSlug: currentWorkspace.slug,
    displayText: currentWorkspace.name
  };
};
