import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class MetaService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  getAuthUrl(workspaceId, returnUrl) {
    return this.api.get(`/auth-url`, { params: { workspaceId, returnUrl } });
  }

  getStatus(workspaceId) {
    return this.api.get(`/status`, { params: { workspaceId } });
  }

  listAssets(workspaceId) {
    return this.api.get(`/assets`, { params: { workspaceId } });
  }

  listPixels(workspaceId) {
    return this.api.get(`/pixels`, { params: { workspaceId } });
  }

  saveAssets({ workspaceId, adAccountId, pageId, instagramActorId, lpId }) {
    return this.api.post(`/select-assets`, {
      workspaceId,
      adAccountId,
      pageId,
      instagramActorId,
      lpId,
    });
  }

  disconnect(workspaceId) {
    return this.api.post(`/disconnect`, { workspaceId });
  }
}

export default new MetaService(`${getBackendUrl()}/meta`);













