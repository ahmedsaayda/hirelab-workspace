import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class WorkspaceService {
  constructor(baseURL) {
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  // Get all workspaces for current user
  getWorkspaces() {
    return this.api.get("/");
  }

  // Create a new workspace
  createWorkspace(workspaceData) {
    return this.api.post("/", workspaceData);
  }

  // Get a specific workspace
  getWorkspace(workspaceId) {
    return this.api.get(`/${workspaceId}`);
  }

  // Update a workspace
  updateWorkspace(workspaceId, updateData) {
    return this.api.put(`/${workspaceId}`, updateData);
  }

  // Delete a workspace
  deleteWorkspace(workspaceId) {
    return this.api.delete(`/${workspaceId}`);
  }

  // Switch to a workspace session
  switchToWorkspace(workspaceId) {
    return this.api.post(`/${workspaceId}/switch`);
  }

  // Return from workspace session
  returnFromWorkspace() {
    return this.api.post("/return");
  }

  // Get workspace members
  getWorkspaceMembers(workspaceId) {
    return this.api.get(`/${workspaceId}/members`);
  }

  // Invite user to workspace
  inviteUserToWorkspace(workspaceId, email, role) {
    return this.api.post(`/${workspaceId}/members`, { email, role });
  }

  // Accept workspace invitation
  acceptWorkspaceInvitation(token) {
    return this.api.post(`/invitations/${token}/accept`);
  }

  // Decline workspace invitation
  declineWorkspaceInvitation(token) {
    return this.api.post(`/invitations/${token}/reject`);
  }

  // List accessible workspaces for current user
  getAccessibleWorkspaces() {
    return this.api.get('/access');
  }

  // Batched: get map of workspaceId->role for a given user (team member)
  getWorkspaceMemberMap(userId) {
    return this.api.get(`/member-map`, { params: { userId } });
  }

  getPendingInvitations() {
    return this.api.get('/invitations/pending');
  }

  // Update workspace member permissions
  updateWorkspaceMember(workspaceId, memberId, role) {
    return this.api.put(`/${workspaceId}/members/${memberId}`, { role });
  }

  // Remove user from workspace
  removeWorkspaceMember(workspaceId, memberId) {
    return this.api.delete(`/${workspaceId}/members/${memberId}`);
  }

  // Update workspace quotas
  updateWorkspaceQuotas(workspaceId, maxFunnels, atsAccess) {
    return this.api.put(`/${workspaceId}/quotas`, { maxFunnels, atsAccess });
  }

  // Get workspace invite link
  getWorkspaceInviteLink(workspaceId) {
    return this.api.get(`/${workspaceId}/invite-link`);
  }

  // Regenerate workspace invite link
  regenerateWorkspaceInviteLink(workspaceId) {
    return this.api.post(`/${workspaceId}/regenerate-invite-link`);
  }

  // Get workspace funnel usage summary
  getWorkspaceFunnelUsage() {
    return this.api.get('/funnel-usage');
  }

  // Purchase additional funnels
  purchaseAdditionalFunnels(additionalFunnels) {
    return this.api.post('/purchase-funnels', { additionalFunnels });
  }

  // Dev Data Inspector - aggregates all user data for debugging
  getDevData() {
    return this.api.get('/dev-data');
  }

  // Select team members for workspace access
  selectWorkspaceMembers(workspaceId, memberSelections) {
    return this.api.post(`/${workspaceId}/members/select`, { memberSelections });
  }

  // Get available team members for workspace selection
  getAvailableTeamMembers(workspaceId) {
    return this.api.get(`/${workspaceId}/members/available`);
  }

  // Update workspace member role
  updateWorkspaceMemberRole(workspaceId, userId, workspaceRole) {
    return this.api.put(`/${workspaceId}/members/${userId}/role`, { workspaceRole });
  }

  // Remove member from workspace (selection-based)
  removeWorkspaceMemberSelection(workspaceId, userId) {
    return this.api.delete(`/${workspaceId}/members/${userId}/select`);
  }
}

export default new WorkspaceService(`${getBackendUrl()}/workspaces`);


