import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

const API_BASE_URL = getBackendUrl();

class TeamService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/team`;
    this.api = axios.create({
      baseURL:this.baseURL,
    });
    middleField(this.api);
  }


  // Create a new team
  async createTeam(name, description) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/create`,
        { name, description },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get user's teams
  async getUserTeams() {
    try {
      const response = await this.api.get(this.baseURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get team details
  async getTeamDetails(teamId) {
    try {
      const response = await this.api.get(`${this.baseURL}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team details:", error);
      throw error.response?.data || error.message;
    }
  }

  // Update team
  async updateTeam(teamId, updateData) {
    try {
      const response = await this.api.put(
        `${this.baseURL}/${teamId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating team:", error);
      throw error.response?.data || error.message;
    }
  }

  // Switch current team
  async switchTeam(teamId) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/switch/${teamId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error switching team:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get team members
  async getTeamMembers(teamId) {
    try {
      const response = await this.api.get(`${this.baseURL}/${teamId}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error.response?.data || error.message;
    }
  }

  // Invite user to team (supports mainAccountAccess, mainAccountRole, workspaceAssignments)
  async inviteUser(teamId, email, role = "viewer", permissions = null, options = {}) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/${teamId}/invite`,
        { email, role, permissions, ...options },
      );
      return response.data;
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error.response?.data || error.message;
    }
  }

  // Accept invitation
  async acceptInvitation(token) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/invitation/${token}/accept`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      throw error.response?.data || error.message;
    }
  }

  // Decline invitation
  async declineInvitation(token) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/invitation/${token}/reject`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error declining invitation:", error);
      throw error.response?.data || error.message;
    }
  }

  // Update member permissions
  async updateMemberPermissions(teamId, memberId, role, permissions) {
    try {
      const response = await this.api.put(
        `${this.baseURL}/${teamId}/members/${memberId}`,
        { role, permissions },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating member permissions:", error);
      throw error.response?.data || error.message;
    }
  }

  // Remove member from team
  async removeMember(teamId, memberId) {
    try {
      const response = await this.api.delete(
        `${this.baseURL}/${teamId}/members/${memberId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error.response?.data || error.message;
    }
  }

  async updateTeamMember(teamId, memberId, updateData) {
    try {
      const response = await this.api.put(
        `${this.baseURL}/${teamId}/members/${memberId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get invitation details
  async getInvitationDetails(token) {
    try {
      const response = await this.api.get(`${this.baseURL}/invitation/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invitation details:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get pending invitation by email
  async getInvitationByEmail(email) {
    try {
      const response = await this.api.get(`${this.baseURL}/invitation/by-email/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invitation by email:", error);
      throw error.response?.data || error.message;
    }
  }

  // Get team's invite link
  async getInviteLink(teamId) {
    try {
      const response = await this.api.get(`${this.baseURL}/${teamId}/invite-link`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invite link:", error);
      throw error.response?.data || error.message;
    }
  }

  // Regenerate invite link
  async regenerateInviteLink(teamId) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/${teamId}/regenerate-invite-link`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error regenerating invite link:", error);
      throw error.response?.data || error.message;
    }
  }

  // Helper method to get current team from localStorage
  getCurrentTeam() {
    const currentTeam = localStorage.getItem("currentTeam");
    return currentTeam ? JSON.parse(currentTeam) : null;
  }

  // Helper method to set current team in localStorage
  setCurrentTeam(team) {
    localStorage.setItem("currentTeam", JSON.stringify(team));
  }

  // Helper method to remove current team from localStorage
  removeCurrentTeam() {
    localStorage.removeItem("currentTeam");
  }

  // Auto-create a team for user (when they don't have one)
  async createTeamForUser() {
    try {
      const response = await this.api.post(
        `${this.baseURL}/create-for-user`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error creating team for user:", error);
      throw error.response?.data || error.message;
    }
  }



  // Join team by invite link
  async joinTeamByLink(inviteLink) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/join/${inviteLink}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error joining team by link:", error);
      throw error.response?.data || error.message;
    }
  }

  // Check for pending team invite and auto-join
  async processPendingInvite() {
    try {
      const pendingInvite = localStorage.getItem('pendingTeamInvite');
      if (pendingInvite) {
        const response = await this.joinTeamByLink(pendingInvite);
        if (response.success) {
          // Set as current team
          this.setCurrentTeam(response.team);
          // Remove pending invite
          localStorage.removeItem('pendingTeamInvite');
          return response;
        }
      }
      return null;
    } catch (error) {
      console.error("Error processing pending invite:", error);
      // Remove invalid invite
      localStorage.removeItem('pendingTeamInvite');
      throw error;
    }
  }
}

export default new TeamService(); 