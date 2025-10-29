

import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Dropdown, Menu, Avatar, message, Select, Space, Radio, Card, Alert, Switch } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { CopyOutlined, DownOutlined, DeleteOutlined, EditOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import TeamService from "../../../services/TeamService";
import WorkspaceService from "../../../services/WorkspaceService";
import { useWorkspace } from "../../../contexts/WorkspaceContext";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";

const { Option } = Select;

const accessOptions = [
  { value: "viewer", label: "View", description: "Can view team resources" },
  { value: "editor", label: "Edit", description: "Can edit team resources" },
  { value: "admin", label: "Admin", description: "Can manage team and members" },
  { value: "atsOnly", label: "ATS Only", description: "Can only access ATS system" },
];

const permissionOptions = {
  landingPages: [
    { value: "read", label: "View" },
    { value: "write", label: "Edit" },
    { value: "admin", label: "Admin" },
  ],
  mediaLibrary: [
    { value: "read", label: "View" },
    { value: "write", label: "Edit" },
    { value: "admin", label: "Admin" },
  ],
  teamManagement: [
    { value: "none", label: "None" },
    { value: "invite", label: "Invite" },
    { value: "admin", label: "Admin" },
  ],
};

export function InviteModal({
  open,
  onClose,
  teamId,
  teamName,
  currentUserRole = "viewer",
  workspaceId,
  workspaceName,
  defaultInvitationType = "team" // "team" or "workspace"
}) {
  const { workspaceSession, currentWorkspace, user } = useWorkspace();
  const reduxUser = useSelector(selectUser);

  // Unified invitation controls
  const [mainAccountAccess, setMainAccountAccess] = useState(true);
  const [mainAccountRole, setMainAccountRole] = useState("viewer");
  const [workspaceEnabled, setWorkspaceEnabled] = useState({}); // { [workspaceId]: boolean }
  const [workspaceRoles, setWorkspaceRoles] = useState({}); // { [workspaceId]: role }

  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [selectedPermissions, setSelectedPermissions] = useState({
    landingPages: "read",
    mediaLibrary: "read",
    teamManagement: "none",
    ats: "none",
  });
  const [members, setMembers] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLinkAccess, setInviteLinkAccess] = useState("viewer");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingInviteLink, setLoadingInviteLink] = useState(false);
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  console.log("availableWorkspaces:",availableWorkspaces)
  console.log("members:",members)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId || null);

  // Edit member state
  const [editingMember, setEditingMember] = useState(null);
  console.log("editingMember:",editingMember)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMainAccountAccess, setEditMainAccountAccess] = useState(true);
  const [editRole, setEditRole] = useState("viewer");
  const [editWorkspaceAssignments, setEditWorkspaceAssignments] = useState([]);
  const [workspaceMemberMap, setWorkspaceMemberMap] = useState({}); // { [workspaceId]: role }

  // Check permissions
  const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'admin';
  const isWorkspaceFeatureEnabled = Boolean((reduxUser && reduxUser.allowWorkspaces !== undefined) ? reduxUser.allowWorkspaces : user?.allowWorkspaces);

  // Defaults
  useEffect(() => {
    setMainAccountAccess(true);
    setMainAccountRole("viewer");
  }, [open]);

  // Fetch available workspaces for workspace invitations
  const fetchAvailableWorkspaces = async () => {
    try {
      const response = await WorkspaceService.getWorkspaces();
      setAvailableWorkspaces(response.data || []);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  useEffect(() => {
    if (open) {
      if (teamId) {
        fetchTeamMembers();
        if (canManageTeam) {
          fetchInviteLink();
        }
      }
      if (isWorkspaceFeatureEnabled) {
        fetchAvailableWorkspaces();
      }
    }
  }, [open, teamId, canManageTeam, isWorkspaceFeatureEnabled, reduxUser?.allowWorkspaces]);

  // Normalize ID helper
  const normalizeId = (val) => (val && typeof val === 'object' && val._id) ? String(val._id) : String(val || '');

  // Re-resolve workspace assignments using batched API once workspaces load while editing
  useEffect(() => {
    if (!editModalVisible || !editingMember) return;
    if (!Array.isArray(availableWorkspaces) || availableWorkspaces.length === 0) return;
    (async () => {
      try {
        const memberUserId = normalizeId(editingMember?.user);
        const res = await WorkspaceService.getWorkspaceMemberMap(memberUserId);
        const map = res?.data?.map || {};

        // Build assignment array from the map
        const assignments = Object.entries(map).map(([workspaceId, role]) => ({ workspaceId, role: role || 'viewer' }));
        setWorkspaceMemberMap(map);

        // Merge with any existing local changes
        const mergedMap = new Map();
        (editWorkspaceAssignments || []).forEach((a) => mergedMap.set(normalizeId(a.workspaceId), { ...a, workspaceId: normalizeId(a.workspaceId) }));
        assignments.forEach((a) => mergedMap.set(normalizeId(a.workspaceId), a));
        setEditWorkspaceAssignments(Array.from(mergedMap.values()));
      } catch (e) {
        // If the batched call fails, keep current state
      }
    })();
  }, [editModalVisible, editingMember, availableWorkspaces]);

  const fetchTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await TeamService.getTeamMembers(teamId);
      setMembers(response.members || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      
      // Handle specific error cases
      if (error.message && error.message.includes("don't have access")) {
        message.error("You no longer have access to this team");
        // Close modal if user doesn't have access
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        message.error("Failed to load team members");
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchInviteLink = async () => {
    try {
      setLoadingInviteLink(true);
      const response = await TeamService.getInviteLink(teamId);
      setInviteLink(response.inviteUrl);
    } catch (error) {
      console.error("Error fetching invite link:", error);
      message.error("Failed to load invite link");
    } finally {
      setLoadingInviteLink(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      message.error("Please enter an email address");
      return;
    }

    if (!inviteEmail.includes("@")) {
      message.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      if (!teamId) {
        message.error("No team selected for invitation");
        return;
      }

      // Build workspace assignments (only if feature enabled)
      const workspaceAssignments = isWorkspaceFeatureEnabled
        ? Object.keys(workspaceEnabled)
            .filter((id) => workspaceEnabled[id])
            .map((id) => ({ workspaceId: id, role: workspaceRoles[id] || 'viewer' }))
        : [];

        const finalMainAccountAccess = isWorkspaceFeatureEnabled ? mainAccountAccess : true;
        const finalMainAccountRole = isWorkspaceFeatureEnabled ? mainAccountRole : selectedRole;

        console.log("invite team member payload :=", {
          mainAccountAccess: finalMainAccountAccess,
          mainAccountRole: finalMainAccountRole,
          workspaceAssignments,
        });
      await TeamService.inviteUser(teamId, inviteEmail, selectedRole, selectedPermissions, {
        mainAccountAccess: finalMainAccountAccess,
        mainAccountRole: finalMainAccountRole,
        workspaceAssignments,
      });
      message.success(`Invitation sent to ${inviteEmail}`);
      fetchTeamMembers(); // Refresh members list

      setInviteEmail("");
    } catch (error) {
      console.error("Error inviting user:", error);
      message.error(error.response?.data?.message || error.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      message.success("Invite link copied to clipboard");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      message.error("Failed to copy link");
    }
  };

  const handleRegenerateLink = async () => {
    try {
      const response = await TeamService.regenerateInviteLink(teamId);
      setInviteLink(response.inviteUrl);
      message.success("Invite link regenerated");
    } catch (error) {
      console.error("Error regenerating invite link:", error);
      message.error("Failed to regenerate link");
    }
  };

  const handleUpdateMemberPermissions = async (memberId, newRole, newPermissions) => {
    try {
      await TeamService.updateMemberPermissions(teamId, memberId, newRole, newPermissions);
      message.success("Member permissions updated");
      fetchTeamMembers(); // Refresh members list
    } catch (error) {
      console.error("Error updating member permissions:", error);
      message.error("Failed to update permissions");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await TeamService.removeMember(teamId, memberId);
      message.success("Member removed from team");
      fetchTeamMembers(); // Refresh members list
    } catch (error) {
      console.error("Error removing member:", error);
      message.error("Failed to remove member");
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setEditMainAccountAccess(member.mainAccountAccess !== false); // Default to true if not set
    setEditRole(member.role || "viewer");

    // Initialize with any pre-attached assignments on the member (if present)
    const seedAssignments = [];
    if (member.workspaceAssignments) {
      member.workspaceAssignments.forEach(assignment => {
        seedAssignments.push({ workspaceId: assignment.workspace, role: assignment.role });
      });
    }
    setEditWorkspaceAssignments(seedAssignments);
    setEditModalVisible(true);

    // Enhance assignments by resolving actual membership per workspace
    // This ensures we correctly show existing access instead of only "Add Access"
    (async () => {
      try {
        if (!Array.isArray(availableWorkspaces) || availableWorkspaces.length === 0) return;
        const results = await Promise.all(
          availableWorkspaces.map(async (ws) => {
            try {
              const res = await WorkspaceService.getWorkspaceMembers(ws._id);
              const members = res?.members || res?.data || res || [];
              const found = members.find((m) => {
                const id = m?.user?._id || m?.user;
                const memberUserId = member?.user?._id || member?.user;
                return id && memberUserId && String(id) === String(memberUserId);
              });
              if (found) {
                return { workspaceId: ws._id, role: found.role || 'viewer' };
              }
              return null;
            } catch (e) {
              return null;
            }
          })
        );
        const resolved = results.filter(Boolean);
        if (resolved.length > 0) {
          // Merge unique by workspaceId, prefer resolved role
          const mergedMap = new Map();
          [...seedAssignments, ...resolved].forEach((a) => {
            mergedMap.set(String(a.workspaceId), a);
          });
          setEditWorkspaceAssignments(Array.from(mergedMap.values()));
        }
      } catch (err) {
        // Silent fail - keep seed assignments
      }
    })();
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      setLoading(true);

      // Prepare the update data
      const updateData = {
        mainAccountAccess: editMainAccountAccess,
        role: editRole,
        workspaceAssignments: editWorkspaceAssignments.map(assignment => ({
          workspace: assignment.workspaceId,
          role: assignment.role
        }))
      };

      await TeamService.updateTeamMember(teamId, editingMember._id, updateData);
      message.success("Member updated successfully");
      setEditModalVisible(false);
      setEditingMember(null);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating member:", error);
      message.error("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roleOption = accessOptions.find(opt => opt.value === role);
    return roleOption ? roleOption.label : role;
  };

  const getMemberMenu = (member) => (
    <Menu>
      <Menu.Item
        onClick={() => handleEditMember(member)}
        icon={<EditOutlined />}
      >
        Edit Member Details
      </Menu.Item>
      {member.role !== 'owner' && (
        <>
          <Menu.Divider />
          <Menu.Item
            key="remove"
            danger
            onClick={() => handleRemoveMember(member._id)}
            icon={<DeleteOutlined />}
          >
            Remove Member
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  // Get modal title
  const getModalTitle = () => {
    return `Invite to ${teamName || 'Team'}`;
  };

  return (
    <>
    <Modal
      title={getModalTitle()}
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: "700px" }}
      className="!rounded-xl"
    >
      <div className="space-y-6 py-4">
        {/* Access Controls */}
        <div className="space-y-4">
          {isWorkspaceFeatureEnabled ? (
            <>
              <div className="text-sm font-medium text-gray-700">Main Account Access</div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mainAccountAccess}
                    onChange={(e) => setMainAccountAccess(e.target.checked)}
                  />
                  Grant access to main account
                </label>
                <Select
                  value={mainAccountRole}
                  onChange={setMainAccountRole}
                  disabled={!mainAccountAccess}
                  className="w-32"
                >
                  <Select.Option value="viewer">Viewer</Select.Option>
                  <Select.Option value="editor">Editor</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="atsOnly">ATS Only</Select.Option>
                </Select>
              </div>

              <div className="text-sm font-medium text-gray-700 mt-4">Assign Workspaces</div>
              <div className="space-y-2 max-h-56 overflow-y-auto border rounded-md p-3">
                {availableWorkspaces.length === 0 && (
                  <div className="text-sm text-gray-500">No workspaces available. Create a workspace to assign access.</div>
                )}
                {availableWorkspaces.map((ws) => (
                  <div key={ws._id} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(workspaceEnabled[ws._id])}
                        onChange={(e) =>
                          setWorkspaceEnabled((prev) => ({ ...prev, [ws._id]: e.target.checked }))
                        }
                      />
                      <span className="text-sm">{ws.name || ws.clientName || 'Workspace'}</span>
                    </label>
                    <Select
                      value={workspaceRoles[ws._id] || 'viewer'}
                      onChange={(val) => setWorkspaceRoles((prev) => ({ ...prev, [ws._id]: val }))}
                      disabled={!workspaceEnabled[ws._id]}
                      className="w-28"
                      size="small"
                    >
                      <Select.Option value="viewer">Viewer</Select.Option>
                      <Select.Option value="editor">Editor</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                      <Select.Option value="atsOnly">ATS Only</Select.Option>
                    </Select>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700">Team Access Level</div>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedRole}
                  onChange={(value) => {
                    setSelectedRole(value);
                    setMainAccountRole(value);
                    // Auto-set default team permissions
                    if (value === 'viewer') {
                      setSelectedPermissions({
                        landingPages: 'read',
                        mediaLibrary: 'read',
                        teamManagement: 'none',
                        ats: 'none',
                      });
                    } else if (value === 'editor') {
                      setSelectedPermissions({
                        landingPages: 'write',
                        mediaLibrary: 'write',
                        teamManagement: 'none',
                        ats: 'read',
                      });
                    } else if (value === 'admin') {
                      setSelectedPermissions({
                        landingPages: 'admin',
                        mediaLibrary: 'admin',
                        teamManagement: 'admin',
                        ats: 'admin',
                      });
                    } else if (value === 'atsOnly') {
                      setSelectedPermissions({
                        landingPages: 'none',
                        mediaLibrary: 'none',
                        teamManagement: 'none',
                        ats: 'admin',
                      });
                    }
                  }}
                  className="w-32"
                >
                  <Select.Option value="viewer">Viewer</Select.Option>
                  <Select.Option value="editor">Editor</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="atsOnly">ATS Only</Select.Option>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Invite by email */}
        {canManageTeam && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Invite by email</div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="johndoe@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="!rounded !border-[#E5E7EB] flex-1"
                onPressEnter={handleInviteUser}
              />
              {isWorkspaceFeatureEnabled && (
                <Select
                  value={selectedRole}
                  onChange={(value) => {
                    setSelectedRole(value);
                    // Auto-set default team permissions
                    if (value === 'viewer') {
                      setSelectedPermissions({
                        landingPages: 'read',
                        mediaLibrary: 'read',
                        teamManagement: 'none',
                        ats: 'none',
                      });
                    } else if (value === 'editor') {
                      setSelectedPermissions({
                        landingPages: 'write',
                        mediaLibrary: 'write',
                        teamManagement: 'none',
                        ats: 'read',
                      });
                    } else if (value === 'admin') {
                      setSelectedPermissions({
                        landingPages: 'admin',
                        mediaLibrary: 'admin',
                        teamManagement: 'admin',
                        ats: 'admin',
                      });
                    } else if (value === 'atsOnly') {
                      setSelectedPermissions({
                        landingPages: 'none',
                        mediaLibrary: 'none',
                        teamManagement: 'none',
                        ats: 'admin',
                      });
                    }
                  }}
                  className="w-24"
                >
                  <Select.Option value="viewer">Viewer</Select.Option>
                  <Select.Option value="editor">Editor</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="atsOnly">ATS Only</Select.Option>
                </Select>
              )}
              <Button
                type="primary"
                onClick={handleInviteUser}
                loading={loading}
              >
                Invite
              </Button>
            </div>
          </div>
        )}

        {/* Shareable link - Team invitations only */}
        {canManageTeam && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Shareable link
            </div>
            <div className="text-xs text-gray-500">
              Anyone with this link can join the team with view access
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                readOnly
                loading={loadingInviteLink}
                className="!rounded !border-[#E5E7EB] flex-1"
                suffix={
                  <CopyOutlined 
                    className="text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={handleCopyInviteLink}
                  />
                }
              />
              <Button onClick={handleRegenerateLink} size="small">
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Info message for viewers */}
        {!canManageTeam && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 text-sm">
              <strong>Team Member View</strong>
            </div>
            <div className="text-blue-600 text-sm mt-1">
              You can view team members but cannot invite new members or manage team settings. Contact a team admin to invite new members.
            </div>
          </div>
        )}

        {/* Members list */}
        {(
          <div className="space-y-3">
            <div className="font-medium text-sm text-gray-700">
              Team Members ({members.length})
            </div>
          {loadingMembers ? (
            <div className="text-center py-4 text-gray-500">Loading members...</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {members.map((member) => (
                <div key={member._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar size="small">
                      {member.user?.avatar ? (
                        <img src={member.user.avatar} alt={member.user.firstName} />
                      ) : (
                        (member.user?.firstName?.[0] || member.invitedEmail?.[0] || 'U') + (member.user?.lastName?.[0] || '')
                      )}
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {member.user?.firstName && member.user?.lastName
                          ? `${member.user.firstName} ${member.user.lastName}`
                          : (member.invitedEmail || 'Pending user')}
                        {member.role === 'owner' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Owner
                          </span>
                        )}
                        {(!member.user && member.invitedEmail) && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.user?.email || member.invitedEmail}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {getRoleDisplay(member.role)}
                    </span>
                    {member.role !== 'owner' && canManageTeam && (
                      <Dropdown
                        overlay={getMemberMenu(member)}
                        trigger={["click"]}
                      >
                        <Button size="small" icon={<EditOutlined />}>
                          <DownOutlined />
                        </Button>
                      </Dropdown>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>

    {/* Edit Member Modal */}
    <Modal
      title={`Edit ${editingMember?.user?.firstName} ${editingMember?.user?.lastName}`}
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setEditModalVisible(false)}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleUpdateMember}>
          Save Changes
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-6">
        {/* Main Account Access */}
        <div className="space-y-3">
          <div className="font-medium text-gray-700">Main Account Access</div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Grant access to main account</div>
              <div className="text-sm text-gray-600">
                {editMainAccountAccess
                  ? "User can access team dashboard, resources, and manage content"
                  : "User can only access assigned workspaces"
                }
              </div>
            </div>
            <Switch
              checked={editMainAccountAccess}
              onChange={setEditMainAccountAccess}
            />
          </div>

          {editMainAccountAccess && (
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Access Level</div>
              <Select
                value={editRole}
                onChange={setEditRole}
                className="w-full"
              >
                <Select.Option value="viewer">Viewer - Can view resources</Select.Option>
                <Select.Option value="editor">Editor - Can edit resources</Select.Option>
                <Select.Option value="admin">Admin - Can manage team</Select.Option>
                <Select.Option value="atsOnly">ATS Only - Can only access ATS</Select.Option>
              </Select>
            </div>
          )}
        </div>

        {/* Workspace Assignments */}
        {isWorkspaceFeatureEnabled && (
          <div className="space-y-3">
            <div className="font-medium text-gray-700">Workspace Access</div>
            <div className="text-sm text-gray-600 mb-3">
              Assign this team member to specific workspaces with custom access levels.
            </div>

            {availableWorkspaces.map((workspace) => {
              const wsId = normalizeId(workspace._id || workspace.id);
              const existingRole = workspaceMemberMap[wsId];
              const displayName = workspace.clientName || workspace.name || 'Unnamed Workspace';

              return (
                <Card key={workspace._id} size="small" className="mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={32}
                        src={workspace.companyLogo}
                        icon={<ApartmentOutlined />}
                        className={`${workspace.companyLogo ? '' : 'bg-blue-100'} flex-shrink-0`}
                        style={workspace.companyLogo ? {} : { backgroundColor: '#dbeafe' }}
                      >
                        {!workspace.companyLogo && displayName
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase())
                          .slice(0, 2)
                          .join('')}
                      </Avatar>
                      <div>
                        <div className="font-medium">{displayName}</div>
                        <div className="text-sm text-gray-500">{workspace.clientDomain || workspace.companyWebsite || ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {existingRole ? (
                        <>
                          <Select
                            value={existingRole}
                            onChange={(role) => {
                              setWorkspaceMemberMap(prev => ({ ...prev, [wsId]: role }));
                              setEditWorkspaceAssignments(prev => {
                                const normalized = (prev || []).filter(a => normalizeId(a.workspaceId) !== wsId);
                                return [...normalized, { workspaceId: wsId, role }];
                              });
                            }}
                            size="small"
                            className="w-24"
                          >
                            <Select.Option value="viewer">Viewer</Select.Option>
                            <Select.Option value="editor">Editor</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="atsOnly">ATS Only</Select.Option>
                          </Select>
                          <Button
                            size="small"
                            danger
                            onClick={() => {
                              setWorkspaceMemberMap(prev => {
                                const copy = { ...prev };
                                delete copy[wsId];
                                return copy;
                              });
                              setEditWorkspaceAssignments(prev => (prev || []).filter(a => normalizeId(a.workspaceId) !== wsId));
                            }}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            setEditWorkspaceAssignments(prev => [
                              ...prev,
                              { workspaceId: workspace._id, role: 'viewer' }
                            ]);
                          }}
                        >
                          Add Access
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
    </>
  );
}
