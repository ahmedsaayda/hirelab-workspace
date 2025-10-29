import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class UserService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  searchUsers(data) {
    return this.api.post("/searchUsers", data);
  }
  updateUser(id, data) {
    return this.api.put(`/updateUser?id=${id}`, data);
  }
  deleteTeamMember(id) {
    return this.api.delete(`/deleteTeamMember?id=${id}`);
  }
  updateAccessLevel(id, accessLevel = "read-write") {
    return this.api.put(`/updateAccessLevel?id=${id}`, { accessLevel });
  }
  inviteUser(data) {
    return this.api.post(`/inviteUser`, {
      ...data,
      origin: window.location.origin,
    });
  }

  deleteFile(publicId) {
    return this.api.delete(`/deleteFile?publicId=${publicId}`);
  }
  importFromATS({ url }) {
    return this.api.post(`/importFromATS`, { url });
  }
  postAd(data) {
    return this.api.post(`/postAd`, data);
  }
  extendTokenTime() {
    return this.api.post(`/extendTokenTime`);
  }

  getDashboardAnalytics(filterVacancy = 'all', filterTimeFrame = 'all', workspaceId = null) {
    const params = new URLSearchParams({
      filterVacancy,
      filterTimeFrame
    });

    // Add workspace filter if in workspace session
    if (workspaceId) {
      params.append('workspaceId', workspaceId);
    }

    return this.api.get(`/dashboardAnalytics?${params.toString()}`);
  }
}

export default new UserService(`${getBackendUrl()}/user`);
