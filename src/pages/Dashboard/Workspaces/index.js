import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Avatar,
  Switch,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ApartmentOutlined,
  SwapOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Modal, Input } from "antd";
import { useWorkspace } from "../../../contexts/WorkspaceContext";
import { useSelector } from "react-redux";
import TeamService from "../../../services/TeamService";
import { selectUser } from "../../../redux/auth/selectors";

const { Title, Text } = Typography;

const WorkspaceManagement = () => {
  const user = useSelector(selectUser);

  const {
    workspaces,
    loading,
    workspaceSession,
    currentWorkspace,
    fetchWorkspaces,
    switchToWorkspace,
    returnToMainSmart,
    deleteWorkspace,
    updateWorkspaceQuotas
  } = useWorkspace();

  console.log("workspaces:",workspaces)
  // Local state for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    workspace: null,
    confirmText: '',
  });

  // Use context workspace session state
  const isWorkspaceSession = workspaceSession;

  // Helper functions for display
  const getWorkspaceLogo = (workspace) => {
    // Prefer explicit logo fields; fall back to companyLogo
    return workspace.logo || workspace.companyLogo || null;
  };

  const getWorkspaceDisplayName = (workspace) => {
    return workspace.clientName || workspace.name || 'Unnamed Workspace';
  };

  const getWorkspaceDisplayDomain = (workspace) => {
    return workspace.customDomain || workspace.companyWebsite || workspace.clientDomain || '';
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.allowWorkspaces) {
      window.location.replace('/dashboard');
      return;
    }

    if (!isWorkspaceSession) {
      fetchWorkspaces();
    }
  }, [isWorkspaceSession, fetchWorkspaces, user]);

  const handleCreateWorkspace = () => {
    // Navigate to workspace creation page
    window.location.href = "/dashboard/workspaces/create";
  };

  const handleDeleteWorkspaceClick = (workspace) => {
    setDeleteModal({
      visible: true,
      workspace,
      confirmText: '',
    });
  };

  const handleDeleteModalCancel = () => {
    setDeleteModal({
      visible: false,
      workspace: null,
      confirmText: '',
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.confirmText === 'DELETE') {
      try {
        const result = await deleteWorkspace(deleteModal.workspace._id);
        const { deletedData } = result;

        // Show detailed success message
        Modal.success({
          title: 'Workspace Deleted Successfully',
          content: (
            <div>
              <p>The workspace <strong>{deleteModal.workspace.clientName}</strong> has been permanently deleted along with:</p>
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
        });

        handleDeleteModalCancel();
      } catch (error) {
        // Error is already handled in the context
      }
    }
  };

  const handleManageWorkspace = (workspace) => {
    // Navigate to the workspace management page
    window.location.href = `/dashboard/workspaces/${workspace._id}/manage`;
  };

  console.log("-")
  const handleSwitchToWorkspace = async (workspaceId) => {
    try {
      await switchToWorkspace(workspaceId);
      // switchToWorkspace already handles the redirect and Redux update
    } catch (error) {
      console.error("Error switching to workspace:", error);
      message.error("Failed to switch to workspace");
    }
  };

  const handleReturnFromWorkspace = async () => {
    await returnToMainSmart();
  };

  const handleToggleATSAccess = async (workspaceId, atsAccess) => {
    await updateWorkspaceQuotas(workspaceId, null, atsAccess);
  };

  const handleUpdateQuotas = async (workspaceId, maxFunnels, atsAccess) => {
    await updateWorkspaceQuotas(workspaceId, maxFunnels, atsAccess);
  };

  // If user is in workspace session, show return option
  if (isWorkspaceSession) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <ApartmentOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={3}>Workspace Session Active</Title>
            <Text type="secondary" className="block mb-6">
              You are currently working in: <strong>{currentWorkspace?.name}</strong>, Your have {currentWorkspace?.role} access.
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleReturnFromWorkspace}
              loading={loading}
            >
              Return to Main Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
      <div className="p-4 sm:p-6">
        {/* Current Workspace Indicator */}
        {isWorkspaceSession && currentWorkspace && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <ApartmentOutlined className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900">Current Workspace</div>
                  <div className="text-sm text-blue-700">{currentWorkspace.name}</div>
                </div>
              </div>
              <Button
                type="primary"
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={returnFromWorkspace}
                loading={loading}
              >
                Return to Main
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Title level={2} className="!mb-2">
            <ApartmentOutlined className="mr-2" />
            Workspaces
          </Title>
          <Text type="secondary">
            Manage your client workspaces and access controls.
          </Text>
        </div>

      {/* Stats Cards - Matching Figma Design (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 border-solid rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 border border-gray-200 border-solid rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
              <ApartmentOutlined className="text-lg text-gray-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-600 font-medium truncate">Total Workspaces</div>
              <div className="text-2xl font-semibold text-gray-900">{workspaces.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-solid rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 border border-gray-200 border-solid rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-600 font-medium truncate">Active Funnels</div>
              <div className="text-2xl font-semibold text-gray-900">
                {workspaces.reduce((sum, ws) => sum + (ws.currentFunnels || 0), 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-solid rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 border border-gray-200 border-solid rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
              <UserOutlined className="text-lg text-gray-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-600 font-medium truncate">ATS Users</div>
              <div className="text-2xl font-semibold text-gray-900">
                {workspaces.filter(ws => ws.atsAccess).length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-solid rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 border border-gray-200 border-solid rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-600 font-medium truncate">Applications</div>
              <div className="text-2xl font-semibold text-gray-900">
                {workspaces.reduce((sum, ws) => sum + (ws.members?.length || 1), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Cards - Matching Figma Design (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <div key={workspace._id} className="bg-white rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              {/* Logo and Name */}
              <div className="flex items-center gap-3 mb-5">
                <Avatar
                  size={48}
                  src={getWorkspaceLogo(workspace)}
                  icon={<ApartmentOutlined />}
                  className={`${workspace.companyLogo ? '' : 'bg-blue-100'} flex-shrink-0`}
                  style={workspace.companyLogo ? {} : { backgroundColor: '#dbeafe' }}
                >
                  {!workspace.companyLogo && getWorkspaceDisplayName(workspace)
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join('')}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 text-base truncate">
                    {getWorkspaceDisplayName(workspace)}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {getWorkspaceDisplayDomain(workspace)}
                  </div>
                </div>
              </div>

              {/* Gray section with stats and controls */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="space-y-3">
                  {/* Active Funnels */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Active Funnels</span>
                    <span className="text-sm font-medium text-gray-900">
                      {workspace.currentFunnels || 0}/{workspace.maxFunnels || 0}
                    </span>
                  </div>

                  {/* ATS Access Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">ATS Access</span>
                    <Switch
                      checked={workspace.atsAccess}
                      onChange={(checked) => handleToggleATSAccess(workspace._id, checked)}
                      size="small"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    type="primary"
                    size="small"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                    icon={<SwapOutlined />}
                    onClick={() => handleSwitchToWorkspace(workspace._id)}
                  >
                    Switch
                  </Button>
                  <Button
                    size="small"
                    className="flex-1 bg-white border border-gray-300 border-solid hover:border-gray-400 transition-colors"
                    icon={<EditOutlined />}
                    onClick={() => handleManageWorkspace(workspace)}
                  >
                    Manage
                  </Button>
                  <Button
                    size="small"
                    danger
                    className="flex-1"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteWorkspaceClick(workspace)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Workspace Card - Matching Figma Design (Responsive) */}
        <div className="bg-white border-2 border-dashed border-blue-500 group rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-200" onClick={handleCreateWorkspace}>
          <div className="flex flex-col items-center justify-center h-full p-6 text-blue-600 group-hover:text-white">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <PlusOutlined className="text-2xl" />
            </div>
            <div className="text-lg font-semibold mb-1">Add workspace</div>
            <div className="text-sm text-blue-600/80">Create a new client workspace</div>
          </div>
        </div>
      </div>

      {workspaces.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ApartmentOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="text-2xl text-gray-500 mb-2">No workspaces yet</div>
          <div className="text-gray-400 mb-8 max-w-md mx-auto">Create your first workspace to get started with managing your client projects and organizing your recruitment funnels.</div>
          <Button
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
            icon={<PlusOutlined />}
            onClick={handleCreateWorkspace}
          >
            Create Your First Workspace
          </Button>
        </div>
      )}

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
          {deleteModal.workspace && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size={40}
                  src={getWorkspaceLogo(deleteModal.workspace)}
                  icon={<ApartmentOutlined />}
                  className="bg-blue-100"
                >
                  {getWorkspaceDisplayName(deleteModal.workspace)
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join('')}
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{getWorkspaceDisplayName(deleteModal.workspace)}</div>
                  <div className="text-sm text-gray-500">{getWorkspaceDisplayDomain(deleteModal.workspace)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Active Funnels</span>
                  <div className="font-semibold text-gray-900">{deleteModal.workspace.currentFunnels || 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Max Funnels</span>
                  <div className="font-semibold text-gray-900">{deleteModal.workspace.maxFunnels || 10}</div>
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

export default WorkspaceManagement;
