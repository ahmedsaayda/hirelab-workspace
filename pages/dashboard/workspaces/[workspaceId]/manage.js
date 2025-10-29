import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  SettingOutlined,
  ApartmentOutlined,
  EditOutlined,
  UserAddOutlined,
  MailOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Avatar,
  Switch,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Tag,
  Select,
  Radio,
  Spin,
  Modal,
  Checkbox,
} from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../src/redux/auth/selectors";
import Layout from "../../layout";
import { useWorkspace } from "../../../../src/contexts/WorkspaceContext";
import ImageUploader from "../../../../src/pages/LandingpageEdit/ImageUploader.js";
import ColorPickerButton from "../../../../src/pages/onboarding/components/ColorPickerButton.jsx";
import WorkspaceService from "../../../../src/services/WorkspaceService.js";
import { refreshUserData } from "../../../../src/utils/userRefresh";

const { Title, Text } = Typography;

const WorkspaceManagePage = () => {
  const router = useRouter();
  const { workspaceId } = router.query;
  const {
    currentWorkspace,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceMembers,
    inviteUserToWorkspace,
    updateWorkspaceMember,
    removeWorkspaceMember,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryPublish,
    updateWorkspaceQuotas,
    loading: workspaceLoading
  } = useWorkspace();
  const user = useSelector(selectUser);

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteForm] = Form.useForm();
  const [form] = Form.useForm();
  const [selectedFontStyle, setSelectedFontStyle] = useState("h1");
  const [googleFonts, setGoogleFonts] = useState([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [fontCategories, setFontCategories] = useState({});
  const [fonts, setFonts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryForm] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    confirmText: '',
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSelectionLoading, setMemberSelectionLoading] = useState(false);

  // Get max allowed funnels for this workspace from backend calculation
  const getMaxAllowedFunnels = () => {
    if (!user || !workspace) return 999;

    // Use pre-calculated funnel allocation from backend
    const workspaceAllocation = user.funnelAllocation?.[workspace._id];
    if (workspaceAllocation) {
      // Can't go below current usage in this workspace
      const minAllowed = workspace.currentFunnels || 0;
      return Math.max(minAllowed, workspaceAllocation.maxAllowed);
    }

    // Fallback to unlimited if no allocation data
    return 999;
  };

  // Fetch Google Fonts
  useEffect(() => {
    setIsLoadingFonts(true);

    // This is using a proxy to avoid needing an API key. For production, use a proper API key from Google.
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyAOES8EmKhuJEnsn9kS1XKBpxxp-TgN8Jc')
      .then(response => response.json())
      .then(data => {
        // Get the top 100 popular fonts
        const popularFonts = data.items.slice(0, 100);

        // Transform the response into the format needed
        const fontList = popularFonts.map(font => ({
          family: font.family,
          src: `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@400;700&display=swap`,
          category: font.category
        }));

        // Group fonts by category
        const categories = {};
        fontList.forEach(font => {
          if (!categories[font.category]) {
            categories[font.category] = [];
          }
          categories[font.category].push(font);
        });

        setFontCategories(categories);
        setGoogleFonts(fontList);

        // Load web fonts for preview
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${popularFonts.map(f => `family=${f.family.replace(/ /g, '+')}:wght@400;700`).join('&')}&display=swap`;
        document.head.appendChild(link);

        // Merge with any existing custom fonts
        setFonts(prev => {
          const customFonts = prev.filter(f => f.family && f.src);
          return [...customFonts, ...fontList];
        });
      })
      .catch(err => {
        console.error('Error fetching Google Fonts:', err);
        message.error('Failed to load fonts. Using default fonts instead.');
      })
      .finally(() => setIsLoadingFonts(false));
  }, []);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const response = await getWorkspace(workspaceId);
      console.log("Workspace data fetched:", response);
      const workspaceData = response.data || response;
      console.log("Setting workspace state with:", workspaceData);
      setWorkspace(workspaceData);
      console.log("Workspace state after setting:", workspace);

      // Wait a bit for form to be ready, then populate
      setTimeout(() => {
        try {
          console.log("Populating form with workspace data:", workspaceData);
          // Populate form with workspace data
          form.setFieldsValue({
            clientName: workspaceData?.clientName || workspaceData?.name || '',
            clientDomain: workspaceData?.clientDomain || '',
            clientEmail: workspaceData?.clientEmail || '',
            companyName: workspaceData?.companyName || '',
            companyWebsite: workspaceData?.companyWebsite || '',
            companyLogo: workspaceData?.companyLogo || '',
            primaryColor: workspaceData?.primaryColor || '',
            secondaryColor: workspaceData?.secondaryColor || '',
            tertiaryColor: workspaceData?.tertiaryColor || '',
            heroBackgroundColor: workspaceData?.heroBackgroundColor || '',
            heroTitleColor: workspaceData?.heroTitleColor || '',
            maxFunnels: workspaceData?.maxFunnels || 10,
            atsAccess: workspaceData?.atsAccess || false,
            customDomain: workspaceData?.customDomain || '',
            companyAddress: workspaceData?.companyAddress || '',
            brandColors: JSON.stringify(Array.isArray(workspaceData?.brandColors) ? workspaceData.brandColors : []),
            selectedFont: workspaceData?.selectedFont?.family || '',
            titleFont: workspaceData?.titleFont?.family || '',
            subheaderFont: workspaceData?.subheaderFont?.family || '',
            bodyFont: workspaceData?.bodyFont?.family || '',
          });

          setWorkspace(prev => ({
            ...prev,
            primaryColor: workspaceData?.primaryColor || prev?.primaryColor,
            secondaryColor: workspaceData?.secondaryColor || prev?.secondaryColor,
            tertiaryColor: workspaceData?.tertiaryColor || prev?.tertiaryColor,
            heroBackgroundColor: workspaceData?.heroBackgroundColor || prev?.heroBackgroundColor,
            heroTitleColor: workspaceData?.heroTitleColor || prev?.heroTitleColor,
            selectedFont: workspaceData?.selectedFont || prev?.selectedFont,
            titleFont: workspaceData?.titleFont || prev?.titleFont,
            subheaderFont: workspaceData?.subheaderFont || prev?.subheaderFont,
            bodyFont: workspaceData?.bodyFont || prev?.bodyFont,
            brandColors: Array.isArray(workspaceData?.brandColors) ? workspaceData.brandColors : prev?.brandColors,
          }));
        } catch (formError) {
          console.error("Error setting form values:", formError);
          message.error("Failed to populate form with workspace data");
        }
      }, 100);

      // Fetch team members
      fetchTeamMembers();

      // Fetch available team members for selection
      fetchAvailableMembers();

      // Fetch categories
      fetchCategories();
    } catch (error) {
      console.error("Error fetching workspace:", error);
      message.error("Failed to fetch workspace details");
    //   router.push("/dashboard/workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      // Helper function to get font src from family name
      const getFontSrc = (familyName) => {
        if (!familyName) return '';
        const allFonts = [...googleFonts, ...fonts];
        const font = allFonts.find((f) => f.family === familyName);
        return font?.src || '';
      };

      const normalizeColor = (value, fallback) => {
        if (value && typeof value === 'string' && value.trim() !== '') {
          return value.startsWith('#') ? value : `#${value}`;
        }
        return fallback || '';
      };

      const parseBrandColors = (value) => {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (error) {
            // Ignore parse error and fall back to workspace values
          }
        }
        return Array.isArray(workspace?.brandColors) ? workspace.brandColors : [];
      };

      const normalizeFont = (value, fallback) => {
        const family = value || fallback?.family || fallback || '';
        if (!family) {
          return fallback || null;
        }

        const src = getFontSrc(family) || fallback?.src || '';
        return { family, src };
      };

      // Process JSON fields
      const payload = {
        clientName: values.clientName || workspace?.clientName || workspace?.name || '',
        clientDomain: values.clientDomain ?? workspace?.clientDomain ?? '',
        clientEmail: values.clientEmail ?? workspace?.clientEmail ?? '',
        companyName: values.companyName ?? workspace?.companyName ?? '',
        companyWebsite: values.companyWebsite ?? workspace?.companyWebsite ?? '',
        companyLogo: values.companyLogo || workspace?.companyLogo || '',
        companyAddress: values.companyAddress ?? workspace?.companyAddress ?? '',
        customDomain: values.customDomain ?? workspace?.customDomain ?? '',
        primaryColor: normalizeColor(values.primaryColor, workspace?.primaryColor),
        secondaryColor: normalizeColor(values.secondaryColor, workspace?.secondaryColor),
        tertiaryColor: normalizeColor(values.tertiaryColor, workspace?.tertiaryColor),
        heroBackgroundColor: normalizeColor(values.heroBackgroundColor, workspace?.heroBackgroundColor),
        heroTitleColor: normalizeColor(values.heroTitleColor, workspace?.heroTitleColor),
        brandColors: parseBrandColors(values.brandColors),
        selectedFont: normalizeFont(values.selectedFont, workspace?.selectedFont),
        titleFont: normalizeFont(values.titleFont, workspace?.titleFont),
        subheaderFont: normalizeFont(values.subheaderFont, workspace?.subheaderFont),
        bodyFont: normalizeFont(values.bodyFont, workspace?.bodyFont),
      };

      console.log("handleSave payload:", payload);
      await updateWorkspace(workspaceId, payload);
      message.success("Workspace updated successfully!");
      fetchWorkspace(); // Refresh data
    } catch (error) {
      console.error("Error saving workspace:", error);
      message.error(
        error.response?.data?.message || "Failed to save workspace"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleATSAccess = async (checked) => {
    try {
      await WorkspaceService.updateWorkspaceQuotas(workspaceId, null, checked);
      message.success(`ATS access ${checked ? 'enabled' : 'disabled'}`);
      fetchWorkspace(); // Refresh data
    } catch (error) {
      console.error("Error updating ATS access:", error);
      message.error("Failed to update ATS access");
    }
  };

  const handleUpdateQuotas = async (maxFunnels) => {
    // Validate funnel limits before saving
    const maxAllowed = getMaxAllowedFunnels();
    const minAllowed = workspace.currentFunnels || 0;

    if (maxFunnels < minAllowed) {
      message.error(`Cannot set max funnels below current usage (${minAllowed} funnels)`);
      return;
    }

    if (maxFunnels > maxAllowed) {
      message.error(`Cannot exceed available limit (${maxAllowed} funnels). You may need to purchase additional funnels.`);
      return;
    }

    try {
      await WorkspaceService.updateWorkspaceQuotas(workspaceId, maxFunnels, workspace.atsAccess);
      message.success('Workspace quotas updated');
      fetchWorkspace(); // Refresh workspace data
      await refreshUserData(); // Refresh user data (totalAllocatedFunnels)
    } catch (error) {
      console.error("Error updating quotas:", error);

      // Handle subscription limit errors
      if (error.response?.data?.currentUsage) {
        const { currentUsage } = error.response.data;
        Modal.error({
          title: 'Subscription Limit Exceeded',
          content: (
            <div>
              <p>You've reached your subscription limit of <strong>{currentUsage.subscriptionLimit} funnels</strong>.</p>
              <p>You currently have <strong>{currentUsage.totalCurrentFunnels} funnels</strong> allocated across your workspaces.</p>
              <p>You requested <strong>{currentUsage.requestedMaxFunnels} funnels</strong> for this workspace.</p>
              <p>You have <strong>{currentUsage.availableFunnels} funnels</strong> available.</p>
              <div className="mt-4 p-3  border border-blue-200 rounded">
                <p className="text-blue-800 font-medium">💡 Options:</p>
                <ul className="text-blue-700 text-sm mt-2">
                  <li>• Reduce funnels in other workspaces</li>
                  <li>• Upgrade your subscription plan</li>
                  <li>• Purchase additional funnels</li>
                </ul>
              </div>
            </div>
          ),
          width: 520,
        });
      } else {
        message.error(error.response?.data?.message || "Failed to update quotas");
      }
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await getWorkspaceMembers(workspaceId);
      setTeamMembers(response.members || response || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      message.error("Failed to fetch team members");
    }
  };

  const handleInviteMember = async (values) => {
    setInviteLoading(true);
    try {
      const response = await inviteUserToWorkspace(workspaceId, values.email, values.role);

      if (response?.emailSent === false) {
        message.warning(`Invitation created for ${values.email}, but email delivery failed`);
        return;
      }

      inviteForm.resetFields();
      fetchTeamMembers();

    } catch (error) {
      console.error("Error inviting member:", error);
      message.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeWorkspaceMember(workspaceId, memberId);
      message.success("Member removed successfully");
      fetchTeamMembers(); // Refresh team list
    } catch (error) {
      console.error("Error removing member:", error);
      message.error("Failed to remove member");
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    try {
      await updateWorkspaceMember(workspaceId, memberId, newRole);
      message.success("Member role updated successfully");
      fetchTeamMembers(); // Refresh team list
    } catch (error) {
      console.error("Error updating member role:", error);
      message.error("Failed to update member role");
    }
  };

  // Fetch available team members for selection
  const fetchAvailableMembers = async () => {
    if (!workspaceId) return;
    try {
      const response = await WorkspaceService.getAvailableTeamMembers(workspaceId);
      setAvailableMembers(response.data.availableMembers || []);
    } catch (error) {
      console.error("Error fetching available members:", error);
      message.error("Failed to load available team members");
    }
  };

  // Handle member selection for workspace access
  const handleMemberSelection = async () => {
    try {
      setMemberSelectionLoading(true);
      const memberSelections = selectedMembers.map(memberId => {
        const member = availableMembers.find(m => m._id === memberId);
        // Map team roles to appropriate workspace roles
        let defaultWorkspaceRole = 'viewer';
        if (member?.teamRole === 'owner') {
          defaultWorkspaceRole = 'owner';
        } else if (member?.teamRole === 'admin') {
          defaultWorkspaceRole = 'admin';
        } else if (member?.teamRole === 'editor') {
          defaultWorkspaceRole = 'editor';
        }
        return {
          userId: memberId,
          workspaceRole: defaultWorkspaceRole
        };
      });

      await WorkspaceService.selectWorkspaceMembers(workspaceId, memberSelections);
      message.success("Workspace members updated successfully");

      // Refresh available members and clear selection
      await fetchAvailableMembers();
      setSelectedMembers([]);

      // Refresh full workspace data and team members
      if (workspaceId) {
        await fetchWorkspace();
        await fetchTeamMembers();
      }
    } catch (error) {
      console.error("Error selecting members:", error);
      message.error(error.response?.data?.message || "Failed to select members");
    } finally {
      setMemberSelectionLoading(false);
    }
  };

  // Note: member role updates are handled via handleUpdateMemberRole for unified members list

  // Remove member by userId via selection removal endpoint (unified)
  const handleRemoveWorkspaceMemberByUser = async (userId) => {
    try {
      await WorkspaceService.removeWorkspaceMemberSelection(workspaceId, userId);
      message.success("Member removed from workspace");
      await fetchAvailableMembers();
      await fetchTeamMembers();
      if (workspaceId) {
        await fetchWorkspace();
      }
    } catch (error) {
      console.error("Error removing workspace member:", error);
      message.error("Failed to remove member");
    }
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const response = await getCategories(workspaceId);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      await createCategory(workspaceId, values);
      message.success("Category created successfully");
      categoryForm.resetFields();
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error creating category:", error);
      message.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdateCategory = async (categoryId, values) => {
    try {
      await updateCategory(categoryId, values);
      message.success("Category updated successfully");
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success("Category deleted successfully");
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    }
  };

  const handleToggleCategoryPublish = async (categoryId) => {
    try {
      await toggleCategoryPublish(categoryId);
      message.success("Category publish status updated");
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error updating category publish status:", error);
      message.error("Failed to update category publish status");
    }
  };

  const handleDeleteWorkspaceClick = () => {
    setDeleteModal({
      visible: true,
      confirmText: '',
    });
  };

  const handleDeleteModalCancel = () => {
    setDeleteModal({
      visible: false,
      confirmText: '',
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.confirmText === 'DELETE') {
      try {
        const result = await deleteWorkspace(workspaceId);
        const { deletedData } = result;

        // Show detailed success message
        Modal.success({
          title: 'Workspace Deleted Successfully',
          content: (
            <div>
              <p>The workspace <strong>{workspace.clientName}</strong> has been permanently deleted along with:</p>
              <ul className="mt-2 text-sm">
                <li>• {deletedData.funnels} funnels/landing pages</li>
                <li>• {deletedData.categories} categories</li>
                <li>• {deletedData.vacancies} job postings</li>
                <li>• {deletedData.submissions} applications</li>
                <li>• {deletedData.domains} custom domains</li>
                <li>• {deletedData.settings} domain settings</li>
              </ul>
            </div>
          ),
          width: 480,
          onOk: () => router.push("/dashboard/workspaces"),
        });

        router.push("/dashboard/workspaces");
      } catch (error) {
        // Error is already handled in the context
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading workspace...</div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Workspace not found</div>
          <Button type="primary" onClick={() => router.push("/dashboard/workspaces")}>
            Back to Workspaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Responsive Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          {/* Mobile Layout - Stack vertically */}
          <div className="flex flex-col gap-4 sm:hidden">
            {/* Mobile: Back button and workspace info in first row */}
            <div className="flex items-center justify-between">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/dashboard/workspaces")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 w-9 flex items-center justify-center rounded-lg"
              />
              <div className="flex items-center gap-3">
                <Avatar
                  size={32}
                  src={workspace.companyLogo}
                  icon={<ApartmentOutlined />}
                  className="bg-blue-100"
                >
                  {workspace.clientName?.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('')}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate text-sm">{workspace.clientName}</div>
                  <div className="text-xs text-gray-500">Workspace Management</div>
                </div>
              </div>
            </div>

            {/* Mobile: Action buttons in second row */}
            <div className="flex gap-2">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteWorkspaceClick}
                className="h-9 px-3 font-medium shadow-sm flex-1 text-xs"
              >
                Delete
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={() => form.submit()}
                className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-9 px-3 font-medium shadow-sm flex-1 text-xs"
                style={{
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                }}
              >
                Save
              </Button>
            </div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/dashboard/workspaces")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 w-9 flex items-center justify-center rounded-lg flex-shrink-0"
                title="Back to Workspaces"
              />
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar
                  size={40}
                  src={workspace.companyLogo}
                  icon={<ApartmentOutlined />}
                  className="bg-blue-100 flex-shrink-0"
                >
                  {workspace.clientName?.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('')}
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{workspace.clientName}</div>
                  <div className="text-sm text-gray-500">Workspace Management</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteWorkspaceClick}
                className="h-9 px-4 font-medium shadow-sm"
              >
                Delete Workspace
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={() => form.submit()}
                className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-9 px-4 font-medium shadow-sm"
                style={{
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item name="primaryColor" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="secondaryColor" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="tertiaryColor" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="heroBackgroundColor" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="heroTitleColor" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="selectedFont" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="titleFont" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="subheaderFont" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="bodyFont" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="brandColors" hidden>
            <Input type="hidden" />
          </Form.Item>
          {/* Modern Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {[
                  { key: 'basic', label: 'Basic Information', icon: <SettingOutlined /> },
                  { key: 'branding', label: 'Branding', icon: <EditOutlined /> },
                  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
                  { key: 'team', label: 'Team', icon: <UserOutlined /> },
                  { key: 'categories', label: 'Categories', icon: <ApartmentOutlined /> }
                ].map((tab) => (
                  <Button
                    key={tab.key}
                    type="text"
                    onClick={() => setActiveTab(tab.key)}
                    className={`tab-navigation-btn flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white">
            {activeTab === 'basic' && (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Workspace Name"
                    name="clientName"
                    rules={[{ required: true, message: 'Please enter workspace name' }]}
                  >
                    <Input size="large" placeholder="Enter workspace name" />
                  </Form.Item>
                  <Form.Item label="Domain" name="clientDomain">
                    <Input size="large" placeholder="workspace.example.com" />
                  </Form.Item>
                  <Form.Item label="Contact Email" name="clientEmail">
                    <Input size="large" placeholder="contact@workspace.com" />
                  </Form.Item>
                  <Form.Item label="Company Name" name="companyName">
                    <Input size="large" placeholder="Company Name" />
                  </Form.Item>
                  <Form.Item label="Company Website" name="companyWebsite">
                    <Input size="large" placeholder="https://company.com" />
                  </Form.Item>
                  <Form.Item label="Custom Domain" name="customDomain">
                    <Input size="large" placeholder="custom.domain.com" />
                  </Form.Item>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="p-4 sm:p-6">
                {/* Step 2 Content (Brand Assets) */}
                <div className="space-y-6">
                  {/* Logo Upload Section */}
                  <div>
                    <Typography.Text className="mb-1.5 block text-sm text-gray-700">
                      Upload your logo. Horizontally oriented logos display best. We recommend avoiding logos with too much white space.
                    </Typography.Text>
                    <div className="mt-2">
                      <ImageUploader
                        maxFiles={1}
                        multiple={false}
                        defaultImage={workspace.companyLogo}
                        imageAdjustments={{}}
                        fieldKey="companyLogo"
                        onImageUpload={async (url) => {
                          console.log("ImageUploader callback called with:", url);
                          // Handle different formats that ImageUploader might pass
                          const logoUrl = Array.isArray(url) ? url[0] : url;
                          if (logoUrl && logoUrl !== "") {
                            // Update local state immediately
                            setWorkspace(prev => ({ ...prev, companyLogo: logoUrl }));
                            form.setFieldsValue({ companyLogo: logoUrl });

                            // Auto-save the logo to backend
                            try {
                              await updateWorkspace(workspaceId, { companyLogo: logoUrl });
                              console.log("Logo auto-saved successfully");
                            } catch (error) {
                              console.error("Error auto-saving logo:", error);
                              message.error("Logo uploaded but failed to save. Please save manually.");
                            }
                          }
                        }}
                        isSettingDisabled={false}
                        type="image"
                        accept="image/*"
                        isLogo={true}
                        currentSectionLimits={{
                          images: 1,
                          videos: 0,
                          mediaType: "image",
                        }}
                        allowedTabs={["image"]}
                        onImageAdjustmentChange={(fieldKey, adjustments) => {}}
                      />
                    </div>
                  </div>

                  {/* Brand Colors Section */}
                  <div>
                    <Typography.Text strong className="mb-2 block text-md text-gray-700">
                      Color Palette
                    </Typography.Text>
                    <div className="flex flex-wrap gap-4 justify-start items-start">
                      {/* Main color section */}
                      <div className="flex gap-2 justify-center items-center">
                        <ColorPickerButton
                          label="Main"
                          color={workspace.primaryColor || "#000000"}
                          setColor={(color) => {
                            console.log("Primary color changed to:", color);
                            setWorkspace(prev => ({ ...prev, primaryColor: color }));
                            form.setFieldsValue({ primaryColor: color });
                          }}
                        />
                        <div>
                          <Typography.Text className="block text-sm text-gray-700">
                            Primary Color
                          </Typography.Text>
                          <Typography.Text className="block text-sm text-gray-700">
                            {workspace.primaryColor || "#000000"}
                          </Typography.Text>
                        </div>
                      </div>
                      {/* Secondary color section */}
                      <div className="flex gap-2 justify-center items-center">
                        <ColorPickerButton
                          label="Secondary"
                          color={workspace.secondaryColor || "#666666"}
                          setColor={(color) => {
                            console.log("Secondary color changed to:", color);
                            setWorkspace(prev => ({ ...prev, secondaryColor: color }));
                            form.setFieldsValue({ secondaryColor: color });
                          }}
                        />
                        <div>
                          <Typography.Text className="block text-sm text-gray-700">
                            Secondary Color
                          </Typography.Text>
                          <Typography.Text className="block text-sm text-gray-700">
                            {workspace.secondaryColor || "#666666"}
                          </Typography.Text>
                        </div>
                      </div>
                      {/* Tertiary color section */}
                      <div className="flex gap-2 justify-center items-center">
                        <ColorPickerButton
                          label="Tertiary"
                          color={workspace.tertiaryColor || "#999999"}
                          setColor={(color) => {
                            console.log("Tertiary color changed to:", color);
                            setWorkspace(prev => ({ ...prev, tertiaryColor: color }));
                            form.setFieldsValue({ tertiaryColor: color });
                          }}
                        />
                        <div>
                          <Typography.Text className="block text-sm text-gray-700">
                            Tertiary Color
                          </Typography.Text>
                          <Typography.Text className="block text-sm text-gray-700">
                            {workspace.tertiaryColor || "#999999"}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography Section */}
                  <div>
                    <Typography.Text strong className="mb-1.5 block text-md text-gray-700">
                      Text Style
                    </Typography.Text>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                      {/* Title Font Card */}
                      <div
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedFontStyle === "h1"
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedFontStyle("h1")}
                      >
                        <div className="flex items-start gap-2">
                          <Radio
                            checked={selectedFontStyle === "h1"}
                            className="mr-2 mt-0.5"
                          />
                          <div>
                            <Typography.Text strong className="text-gray-700">
                              Title Style
                            </Typography.Text>
                            <Typography.Text className="block text-xs text-gray-500">
                              {workspace.titleFont?.family || "No font selected"}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>

                      {/* Subheader Font Card */}
                      <div
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedFontStyle === "h2"
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedFontStyle("h2")}
                      >
                        <div className="flex items-start gap-2">
                          <Radio
                            checked={selectedFontStyle === "h2"}
                            className="mt-0.5"
                          />
                          <div>
                            <Typography.Text strong className="text-gray-700">
                              H2, H3 Style
                            </Typography.Text>
                            <Typography.Text className="block text-xs text-gray-500">
                              {workspace.subheaderFont?.family || "No font selected"}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>

                      {/* Body Font Card */}
                      <div
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedFontStyle === "h3"
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedFontStyle("h3")}
                      >
                        <div className="flex items-start gap-2">
                          <Radio
                            checked={selectedFontStyle === "h3"}
                            className="mt-0.5"
                          />
                          <div>
                            <Typography.Text strong className="text-gray-700">
                              Body Style
                            </Typography.Text>
                            <Typography.Text className="block text-xs text-gray-500">
                              {workspace.bodyFont?.family || "No font selected"}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font Selection Dropdown */}
                    <div className="mb-6">
                      {isLoadingFonts ? (
                        <div className="flex justify-center items-center py-4">
                          <Spin size="small" />
                          <span className="ml-2 text-sm text-gray-500">Loading fonts...</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex mb-2">
                            <Typography.Text strong className="text-md text-gray-700">
                              Select a font for {selectedFontStyle === "h1" ? "titles" :
                                                selectedFontStyle === "h2" ? "subheaders" : "body text"}
                            </Typography.Text>
                          </div>

                          <Select
                            showSearch
                            value={
                              selectedFontStyle === "h1"
                                ? workspace.titleFont?.family || ""
                                : selectedFontStyle === "h2"
                                ? workspace.subheaderFont?.family || ""
                                : workspace.bodyFont?.family || ""
                            }
                            onChange={(value) => {
                              const selectedFont = googleFonts.find(f => f.family === value) ||
                                                  fonts.find(f => f.family === value);

                              if (selectedFontStyle === "h1") {
                                setWorkspace(prev => ({
                                  ...prev,
                                  titleFont: { family: value, src: selectedFont?.src || "" },
                                  selectedFont: { family: value, src: selectedFont?.src || "" }
                                }));
                                form.setFieldsValue({
                                  titleFont: value,
                                  selectedFont: value
                                });
                              } else if (selectedFontStyle === "h2") {
                                setWorkspace(prev => ({
                                  ...prev,
                                  subheaderFont: { family: value, src: selectedFont?.src || "" }
                                }));
                                form.setFieldsValue({ subheaderFont: value });
                              } else {
                                setWorkspace(prev => ({
                                  ...prev,
                                  bodyFont: { family: value, src: selectedFont?.src || "" }
                                }));
                                form.setFieldsValue({ bodyFont: value });
                              }

                              // Mark form as modified
                              console.log(`Font ${selectedFontStyle} changed to:`, value);
                            }}
                            className="w-full"
                            placeholder={`Select a font for ${
                              selectedFontStyle === "h1"
                                ? "titles"
                                : selectedFontStyle === "h2"
                                ? "subheaders"
                                : "body text"
                            }`}
                            optionLabelProp="label"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {Object.keys(fontCategories).map(category => (
                              <Select.OptGroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                                {fontCategories[category].map(font => (
                                  <Select.Option
                                    key={font.family}
                                    value={font.family}
                                    label={font.family}
                                  >
                                    <div style={{ fontFamily: font.family }}>
                                      {font.family}
                                    </div>
                                  </Select.Option>
                                ))}
                              </Select.OptGroup>
                            ))}

                            {fonts.filter((f) =>
                              !googleFonts.some((gf) => gf.family === f.family)).length > 0 && (
                              <Select.OptGroup label="Custom Fonts">
                                {fonts
                                  .filter((f) =>
                                    !googleFonts.some((gf) => gf.family === f.family))
                                  .map((font) => (
                                    <Select.Option key={font.family} value={font.family} label={font.family}>
                                      <div>{font.family}</div>
                                    </Select.Option>
                                  ))}
                              </Select.OptGroup>
                            )}
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Access Control" className="mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">ATS Access</div>
                          <div className="text-sm text-gray-500">Allow ATS functionality for this workspace</div>
                        </div>
                        <Switch
                          checked={workspace.atsAccess}
                          onChange={handleToggleATSAccess}
                        />
                      </div>
                    </div>
                  </Card>
                  <Card title="Quotas & Limits">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Max Funnels</div>
                            <div className="text-sm text-gray-500">
                              Maximum number of funnels allowed
                              {user && workspace && (
                                <div className="text-xs mt-1 text-blue-600">
                                  Range: {workspace.currentFunnels || 0} - {getMaxAllowedFunnels()} funnels
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={workspace.currentFunnels || 0}
                              max={getMaxAllowedFunnels()}
                              value={workspace.maxFunnels || 0}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const maxAllowed = getMaxAllowedFunnels();
                                const minAllowed = workspace.currentFunnels || 0;

                                if (value < minAllowed) {
                                  message.warning(`Cannot set below current usage (${minAllowed} funnels)`);
                                  return;
                                }
                                if (value > maxAllowed) {
                                  message.warning(`Cannot exceed available limit (${maxAllowed} funnels)`);
                                  return;
                                }

                                setWorkspace(prev => ({ ...prev, maxFunnels: value }));
                                form.setFieldsValue({ maxFunnels: value });
                              }}
                              style={{ width: 80, textAlign: 'center' }}
                              className="font-semibold"
                            />
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleUpdateQuotas(workspace.maxFunnels)}
                              disabled={workspace.maxFunnels < (workspace.currentFunnels || 0)}
                              className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-8 px-3 font-medium shadow-sm"
                              style={{
                                backgroundColor: '#8B5CF6',
                                borderColor: '#8B5CF6',
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Current Funnels</div>
                            <div className="text-sm text-gray-500">Currently active funnels</div>
                          </div>
                          <span className="text-lg font-semibold">{workspace.currentFunnels || 0}</span>
                        </div>
                        {workspace.maxFunnels < (workspace.currentFunnels || 0) && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            ⚠️ Max funnels cannot be less than current funnels ({workspace.currentFunnels || 0})
                          </div>
                        )}
                        <Divider />
                        {/* Show message when user doesn't have enough funnels */}
                        {getMaxAllowedFunnels() < 10 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <PlusOutlined className="text-blue-600 mt-0.5" />
                              <div className="w-full">
                                <h4 className="font-semibold text-blue-800 mb-2">Need More Funnels?</h4>
                                <p className="text-blue-700 text-sm mb-3">
                                  You don't have enough funnels available for allocation. Purchase additional funnels from your billing page.
                                </p>
                                <Button
                                  type="primary"
                                  onClick={() => router.push('/dashboard/billing')}
                                  className="!bg-blue-600 hover:!bg-blue-700"
                                >
                                  Go to Billing
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="p-4 sm:p-6">
                {/* Direct Workspace Invitation Section */}
                <Card title="Invite to Workspace Only" className="mb-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Workspace-only access:</strong> Invite users to access this workspace without giving them access to your main account.
                    </div>
                    <div className="text-xs text-gray-500">
                      Perfect for clients, contractors, or external collaborators who only need access to this specific workspace.
                    </div>
                  </div>
                  <Form
                    form={inviteForm}
                    layout="inline"
                    onFinish={handleInviteMember}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter email address' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="user@example.com"
                        style={{ width: 300 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="role"
                      rules={[{ required: true, message: 'Please select a role' }]}
                    >
                      <Select size="large" placeholder="Select role" style={{ width: 150 }}>
                        <Select.Option value="viewer">Viewer</Select.Option>
                        <Select.Option value="editor">Editor</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="atsOnly">ATS Only</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        size="large"
                        icon={<UserAddOutlined />}
                        loading={inviteLoading}
                        onClick={() => {
                          try {
                            inviteForm.submit();
                          } catch (error) {
                            console.error("Form submission error:", error);
                          }
                        }}
                        className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-10 px-4 font-medium shadow-sm"
                        style={{
                          backgroundColor: '#8B5CF6',
                          borderColor: '#8B5CF6',
                        }}
                      >
                        Send Invitation
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* Team Member Selection Section */}
                <Card title="Grant Workspace Access to Team Members" className="mb-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Team member access:</strong> Select existing team members to grant them access to this workspace.
                    </div>
                    <div className="text-xs text-gray-500">
                      These users already have access to your main account and will get additional access to this workspace.
                    </div>
                  </div>

                  {availableMembers.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Available Team Members ({availableMembers.length})
                        </span>
                        <Button
                          type="primary"
                          size="small"
                          onClick={handleMemberSelection}
                          loading={memberSelectionLoading}
                          disabled={selectedMembers.length === 0}
                          className="!bg-green-600 hover:!bg-green-700"
                        >
                          Add Selected ({selectedMembers.length})
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                        <Checkbox.Group
                          value={selectedMembers}
                          onChange={setSelectedMembers}
                          className="w-full"
                        >
                          <div className="grid grid-cols-1 gap-2">
                            {availableMembers.map((member) => (
                              <div key={member._id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                                <Checkbox value={member._id} />
                                <Avatar size="small" className="flex-shrink-0">
                                  {member.firstName?.[0]}{member.lastName?.[0]}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">{member.email}</div>
                                </div>
                                <div className="text-xs text-gray-400 capitalize">
                                  {member.teamRole}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Checkbox.Group>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserOutlined className="text-4xl text-gray-300 mb-4" />
                      <div className="text-gray-500 mb-2">No team members available</div>
                      <div className="text-sm text-gray-400">
                        All your team members already have access to this workspace, or you don't have any team members yet.
                      </div>
                    </div>
                  )}
                </Card>

                {/* Unified Workspace Members */}
                <Card title={`Workspace Members (${teamMembers.length})`}>
                  {teamMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <UserOutlined className="text-4xl text-gray-300 mb-4" />
                      <div className="text-gray-500 mb-4">No team members yet</div>
                      <div className="text-sm text-gray-400">Invite team members to start collaborating</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teamMembers?.map((member) => {
                        console.log("Member mapping:", member,"and user:", user);
                        /* {
    _id: '68fb6d9fb002076b109fb4d2',
    user: {
      _id: '660a151459afa0e843b877de',
      firstName: 'test',
      lastName: '123',
      email: '123@123.com',
      avatar: ''
    },
    role: 'owner',
    status: 'active',
    invitedAt: '2025-10-24T12:14:23.570Z',
    invitedBy: '660a151459afa0e843b877de'
  } */

    const isAwner = member?.user?._id === user?._id && member?.role === 'owner';
                        return(
                        <div key={member._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar icon={<UserOutlined />} className={`bg-blue-100 ${member.status === 'pending' ? 'opacity-60' : ''}`}>
                              {(member.user?.email || member.invitedEmail || 'U').charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                {member.user?.email || member.invitedEmail || 'Unknown User'}
                                {member.status === 'pending' && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.user?.firstName && member.user?.lastName
                                  ? `${member.user.firstName} ${member.user.lastName}`
                                  : member.status === 'pending'
                                    ? 'Invitation sent'
                                    : 'No name provided'
                                }
                              </div>
                            </div>
                            <Tag color={
                              member.role === 'admin' ? 'red' :
                              member.role === 'atsOnly' ? 'orange' : 'green'
                            }>
                              {member.role === 'atsOnly' ? 'ATS Only' : member.role}
                            </Tag>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              size="small"
                              value={member.role}
                              style={{ width: 100 }}
                              onChange={(value) => handleUpdateMemberRole(member._id, value)}
                              disabled={isAwner}
                              title={isAwner ? 'You are the owner of the workspace and cannot change your own role' : ''}
                            >
                              <Select.Option value="admin">Admin</Select.Option>
                              <Select.Option value="atsOnly">ATS Only</Select.Option>
                            </Select>
                            {!isAwner && <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveMember(member._id)}
                            />}
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="p-4 sm:p-6">
                {/* Create Category Section */}
                <Card title="Create New Category" className="mb-6">
                  <Form
                    form={categoryForm}
                    layout="vertical"
                    onFinish={handleCreateCategory}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter category name' }]}
                      >
                        <Input size="large" placeholder="Enter category name" />
                      </Form.Item>
                      <Form.Item
                        label="Category Slug"
                        name="slug"
                        rules={[{ required: true, message: 'Please enter category slug' }]}
                      >
                        <Input size="large" placeholder="category-slug" />
                      </Form.Item>
                      <div className="md:col-span-2">
                        <Form.Item label="Description" name="description">
                          <Input.TextArea rows={3} placeholder="Category description" />
                        </Form.Item>
                      </div>
                      <div className="md:col-span-2">
                        <Form.Item>
                          <Button
                            type="primary"
                            loading={categoryLoading}
                            onClick={() => {
                              try {
                                categoryForm.submit();
                              } catch (error) {
                                console.error("Form submission error:", error);
                              }
                            }}
                            className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 h-9 px-4 font-medium shadow-sm"
                            style={{
                              backgroundColor: '#8B5CF6',
                              borderColor: '#8B5CF6',
                            }}
                          >
                            Create Category
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </Card>

                {/* Categories List */}
                <Card title={`Categories (${categories.length})`}>
                  {categoryLoading ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                      <div className="mt-2 text-gray-500">Loading categories...</div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-8">
                      <SettingOutlined className="text-4xl text-gray-300 mb-4" />
                      <div className="text-gray-500 mb-4">No categories yet</div>
                      <div className="text-sm text-gray-400">Create your first category to organize your content</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Slug: {category.slug} • Created: {new Date(category.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag color={category.isActive ? 'green' : 'red'}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Tag>
                            {category.published && (
                              <Button
                                type="primary"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => window.open(`/careers/${category.slug}`, '_blank')}
                              >
                                View Page
                              </Button>
                            )}
                            <Button
                              type="text"
                              size="small"
                              onClick={() => handleToggleCategoryPublish(category._id)}
                            >
                              {category.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteCategory(category._id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </Form>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500 text-lg" />
            <span>Delete Workspace</span>
          </div>
        }
        open={deleteModal.visible}
        onCancel={handleDeleteModalCancel}
        footer={null}
        width={480}
        closeIcon={<CloseOutlined />}
      >
        <div className="py-4">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Are you sure?</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <ExclamationCircleOutlined className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Warning: This action cannot be undone</p>
                  <p>This will permanently delete the workspace and all associated data including:</p>
                  <ul className="mt-2 list-disc list-inside text-xs">
                    <li>All funnels and landing pages</li>
                    <li>All categories and configurations</li>
                    <li>All job postings and applications</li>
                    <li>All custom domains and settings</li>
                    <li>All team member permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Workspace Preview Card */}
          {workspace && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size={40}
                  src={workspace.companyLogo}
                  icon={<ApartmentOutlined />}
                  className="bg-blue-100"
                >
                  {workspace.clientName?.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('')}
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{workspace.clientName}</div>
                  <div className="text-sm text-gray-500">{workspace.customDomain || workspace.companyWebsite || workspace.clientDomain}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Active Funnels</span>
                  <div className="font-semibold text-gray-900">{workspace.currentFunnels || 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Max Funnels</span>
                  <div className="font-semibold text-gray-900">{workspace.maxFunnels || 10}</div>
                </div>
              </div>
            </div>
          )}

          {/* Type to Confirm */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Type <strong>DELETE</strong> to confirm:</p>
            <Input
              value={deleteModal.confirmText}
              onChange={(e) => setDeleteModal(prev => ({ ...prev, confirmText: e.target.value }))}
              placeholder="Type DELETE here"
              className="mb-4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button onClick={handleDeleteModalCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              disabled={deleteModal.confirmText !== 'DELETE'}
              onClick={handleDeleteConfirm}
            >
              Delete Workspace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const WorkspaceManageWithLayout = () => {
  return (
    <Layout>
      <WorkspaceManagePage />
    </Layout>
  );
};

export default WorkspaceManageWithLayout;
