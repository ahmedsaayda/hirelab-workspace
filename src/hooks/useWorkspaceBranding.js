import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/auth/selectors';
import { useWorkspace } from '../contexts/WorkspaceContext';

const buildBrandingFromSources = (workspace, user) => {
  const base = {
    companyName: user?.companyName || '',
    companyUrl: user?.companyUrl || '',
    companyInfo: user?.companyInfo || '',
    companyLogo: user?.companyLogo || '',
    primaryColor: user?.primaryColor || '',
    secondaryColor: user?.secondaryColor || '',
    tertiaryColor: user?.tertiaryColor || '',
    heroTitleColor: user?.heroTitleColor || '',
    selectedFont: user?.selectedFont || null,
    titleFont: user?.titleFont || null,
    subheaderFont: user?.subheaderFont || null,
    bodyFont: user?.bodyFont || null,
    brandColors: user?.brandColors || [],
  };

  if (!workspace) {
    return base;
  }

  return {
    ...base,
    workspaceId: workspace._id || workspace.id,
    companyName: workspace.companyName || base.companyName,
    companyUrl: workspace.companyWebsite || base.companyUrl,
    companyLogo: workspace.companyLogo || base.companyLogo,
    primaryColor: workspace.primaryColor || base.primaryColor,
    secondaryColor: workspace.secondaryColor || base.secondaryColor,
    tertiaryColor: workspace.tertiaryColor || base.tertiaryColor,
    heroTitleColor: workspace.heroTitleColor || base.heroTitleColor,
    selectedFont: workspace.selectedFont || base.selectedFont,
    titleFont: workspace.titleFont || base.titleFont,
    subheaderFont: workspace.subheaderFont || base.subheaderFont,
    bodyFont: workspace.bodyFont || base.bodyFont,
    brandColors: Array.isArray(workspace.brandColors) ? workspace.brandColors : base.brandColors,
  };
};

const useWorkspaceBranding = () => {
  const user = useSelector(selectUser);
  const {
    currentWorkspace,
    workspaceSession,
    getWorkspace,
  } = useWorkspace();

  const initialBranding = useMemo(() => {
    if (!user) return null;
    const workspaceData = workspaceSession ? currentWorkspace : null;
    return buildBrandingFromSources(workspaceData, user);
  }, [user, workspaceSession, currentWorkspace]);

  const [branding, setBranding] = useState(initialBranding);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resolveBranding = useCallback(async () => {
    if (!user) {
      return null;
    }

    if (workspaceSession && user.workspaceId) {
      let workspaceDetails = currentWorkspace;

      try {
        const hasBrandingDetails = workspaceDetails && (
          workspaceDetails.primaryColor ||
          workspaceDetails.secondaryColor ||
          workspaceDetails.tertiaryColor ||
          workspaceDetails.selectedFont
        );

        if (!hasBrandingDetails && getWorkspace) {
          const response = await getWorkspace(user.workspaceId);
          workspaceDetails = response?.data || response || workspaceDetails;
        }
      } catch (workspaceError) {
        console.error('Error fetching workspace branding:', workspaceError);
        setError(workspaceError);
      }

      return buildBrandingFromSources(workspaceDetails, user);
    }

    return buildBrandingFromSources(null, user);
  }, [user, workspaceSession, currentWorkspace, getWorkspace]);

  const refreshBranding = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await resolveBranding();
      setBranding(details);
      return details;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resolveBranding]);

  useEffect(() => {
    if (!user) {
      setBranding(null);
      return;
    }

    setBranding(initialBranding);
    refreshBranding();
  }, [user, workspaceSession, initialBranding, refreshBranding]);

  return {
    branding,
    loading,
    error,
    refreshBranding,
    workspaceSession,
  };
};

export default useWorkspaceBranding;

