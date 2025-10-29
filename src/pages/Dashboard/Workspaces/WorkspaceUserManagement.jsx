import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Table,
  Tag,
  Avatar,
  message,
  Space,
  Switch,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import WorkspaceService from "../../../services/WorkspaceService";

const { Option } = Select;

const WorkspaceUserManagement = ({
  open,
  onClose,
  workspaceId,
  workspaceName,
  currentUserRole = "viewer",
  embedded = false
}) => {
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Check if current user can manage workspace
  const canManageWorkspace = currentUserRole === 'owner' || currentUserRole === 'admin';

  useEffect(() => {
    if (open && workspaceId && workspaceId !== 'new-workspace') {
      fetchWorkspaceMembers();
    }
  }, [open, workspaceId, currentUserRole]);

  const fetchWorkspaceMembers = async () => {
    if (workspaceId === 'new-workspace') {
      // For new workspace creation, show the creator as the only member
      setMembers([{
        _id: 'current-user',
        firstName: 'You',
        lastName: '(Creator)',
        email: 'N/A',
        role: 'owner',
        status: 'active'
      }]);
      setLoadingMembers(false);
      return;
    }

    setLoadingMembers(true);
    try {
      const response = await WorkspaceService.getWorkspaceMembers(workspaceId);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      message.error("Failed to load workspace members");
    } finally {
      setLoadingMembers(false);
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

    if (workspaceId === 'new-workspace') {
      message.info("You can invite users after creating the workspace");
      return;
    }

    setLoading(true);
    try {
      await WorkspaceService.inviteUserToWorkspace(workspaceId, inviteEmail, selectedRole);
      message.success("User invited to workspace successfully");
      setInviteEmail("");
      fetchWorkspaceMembers();
    } catch (error) {
      console.error("Error inviting user:", error);
      message.error(error.response?.data?.message || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    if (workspaceId === 'new-workspace') {
      message.info("You can update member roles after creating the workspace");
      return;
    }

    setLoading(true);
    try {
      await WorkspaceService.updateWorkspaceMember(workspaceId, memberId, newRole);
      message.success("Member role updated successfully");
      fetchWorkspaceMembers();
    } catch (error) {
      console.error("Error updating member role:", error);
      message.error("Failed to update member role");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (workspaceId === 'new-workspace') {
      message.info("You can remove members after creating the workspace");
      return;
    }

    setLoading(true);
    try {
      await WorkspaceService.removeWorkspaceMember(workspaceId, memberId);
      message.success("Member removed from workspace");
      fetchWorkspaceMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      message.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      owner: "Owner",
      admin: "Admin",
      editor: "Editor",
      viewer: "Viewer"
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      owner: "red",
      admin: "blue",
      editor: "orange",
      viewer: "green"
    };
    return colorMap[role] || "default";
  };

  const columns = [
    {
      title: "User",
      dataIndex: "firstName",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="small"
            src={record.avatar}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium">
              {record.firstName} {record.lastName}
              {record.role === 'owner' && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Owner
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleDisplayName(role)}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 'active' ? "green" : "red"}>
          {status === 'active' ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canManageWorkspace && record.role !== 'owner' && (
            <Select
              value={record.role}
              onChange={(value) => handleUpdateMemberRole(record._id, value)}
              style={{ width: 100 }}
            >
              <Option value="admin">Admin</Option>
              <Option value="editor">Editor</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          )}
          {canManageWorkspace && record.role !== 'owner' && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveMember(record._id)}
            >
              Remove
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (embedded) {
    return (
      <div className="space-y-6">
        {/* Invite User Section */}
        {canManageWorkspace && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invite New User</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ flex: 1 }}
                onPressEnter={handleInviteUser}
              />
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                style={{ width: 120 }}
              >
                <Option value="viewer">Viewer</Option>
                <Option value="editor">Editor</Option>
                <Option value="admin">Admin</Option>
              </Select>
              <Button
                type="primary"
                onClick={handleInviteUser}
                loading={loading}
                icon={<PlusOutlined />}
              >
                Invite
              </Button>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workspace Members</h3>
          <Table
            columns={columns}
            dataSource={members}
            rowKey="_id"
            loading={loadingMembers}
            pagination={{
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} members`,
            }}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <UserOutlined className="text-4xl text-gray-300 mb-2" />
                  <div className="text-gray-500">No members yet</div>
                  <div className="text-sm text-gray-400">
                    Invite users to collaborate on this workspace
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      title={`Manage Workspace Users: ${workspaceName}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <div className="space-y-6">
        {/* Invite User Section */}
        {canManageWorkspace && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invite New User</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ flex: 1 }}
                onPressEnter={handleInviteUser}
              />
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                style={{ width: 120 }}
              >
                <Option value="viewer">Viewer</Option>
                <Option value="editor">Editor</Option>
                <Option value="admin">Admin</Option>
              </Select>
              <Button
                type="primary"
                onClick={handleInviteUser}
                loading={loading}
                icon={<PlusOutlined />}
              >
                Invite
              </Button>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workspace Members</h3>
          <Table
            columns={columns}
            dataSource={members}
            rowKey="_id"
            loading={loadingMembers}
            pagination={{
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} members`,
            }}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <UserOutlined className="text-4xl text-gray-300 mb-2" />
                  <div className="text-gray-500">No members yet</div>
                  <div className="text-sm text-gray-400">
                    Invite users to collaborate on this workspace
                  </div>
                </div>
              ),
            }}
          />
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkspaceUserManagement;
