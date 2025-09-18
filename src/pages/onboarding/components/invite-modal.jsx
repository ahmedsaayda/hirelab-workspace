

import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Dropdown, Menu, Avatar, message, Select, Space } from "antd";
import { CopyOutlined, DownOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TeamService from "../../../services/TeamService";

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

export function InviteModal({ open, onClose, teamId, teamName, currentUserRole = "viewer" }) {
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

  // Check if current user can manage team
  const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'admin';

  useEffect(() => {
    if (open && teamId) {
      console.log("InviteModal: Opening for team", teamId, "with role", currentUserRole);
      fetchTeamMembers();
      // Only fetch invite link if user has team management permissions
      if (canManageTeam) {
        fetchInviteLink();
      }
    }
  }, [open, teamId, canManageTeam]);

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
      await TeamService.inviteUser(teamId, inviteEmail, selectedRole, selectedPermissions);
      message.success("Invitation sent successfully");
      setInviteEmail("");
      fetchTeamMembers(); // Refresh members list
    } catch (error) {
      console.error("Error inviting user:", error);
      message.error(error.message || "Failed to send invitation");
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

  const getRoleDisplay = (role) => {
    const roleOption = accessOptions.find(opt => opt.value === role);
    return roleOption ? roleOption.label : role;
  };

  const getMemberMenu = (member) => (
    <Menu>
      {accessOptions.map((option) => (
        <Menu.Item 
          key={option.value}
          onClick={() => {
            let permissions = {};
            if (option.value === 'viewer') {
              permissions = {
                landingPages: 'read',
                mediaLibrary: 'read',
                teamManagement: 'none',
                ats: 'none',
              };
            } else if (option.value === 'editor') {
              permissions = {
                landingPages: 'write',
                mediaLibrary: 'write',
                teamManagement: 'none',
                ats: 'read',
              };
            } else if (option.value === 'admin') {
              permissions = {
                landingPages: 'admin',
                mediaLibrary: 'admin',
                teamManagement: 'admin',
                ats: 'admin',
              };
            } else if (option.value === 'atsOnly') {
              permissions = {
                landingPages: 'none',
                mediaLibrary: 'none',
                teamManagement: 'none',
                ats: 'admin',
              };
            }
            handleUpdateMemberPermissions(member._id, option.value, permissions);
          }}
        >
          {option.label}
        </Menu.Item>
      ))}
      {member.role !== 'owner' && (
        <>
          <Menu.Divider />
          <Menu.Item 
            key="remove"
            danger
            onClick={() => handleRemoveMember(member._id)}
            icon={<DeleteOutlined />}
          >
            Remove
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Modal
      title={`Invite to ${teamName || 'Team'}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: "600px" }}
      className="!rounded-xl"
    >
      <div className="space-y-6 py-4">
        {/* Invite by email - Only show if user can manage team */}
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
              <Select
                value={selectedRole}
                onChange={(value) => {
                  setSelectedRole(value);
                  // Auto-set permissions based on role
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
                {accessOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
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

        {/* Shareable link - Only show if user can manage team */}
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
                        (member.user?.firstName?.[0] || '') + (member.user?.lastName?.[0] || '')
                      )}
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {member.user?.firstName} {member.user?.lastName}
                        {member.role === 'owner' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.user?.email}
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

        {/* Close button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
