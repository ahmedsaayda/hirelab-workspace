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

  getPageLogo(workspaceId, forceRefresh = false) {
    const params = { forceRefresh };
    // Only include workspaceId if it's defined (not null/undefined)
    // This ensures backend correctly falls back to user connection when no workspace
    if (workspaceId !== null && workspaceId !== undefined) {
      params.workspaceId = workspaceId;
    }
    return this.api.get(`/page-logo`, { params });
  }

  // WhatsApp Business API methods
  getWhatsAppStatus(workspaceId) {
    return this.api.get(`/whatsapp/status`, { params: { workspaceId } });
  }

  listWhatsAppAssets(workspaceId) {
    return this.api.get(`/whatsapp/assets`, { params: { workspaceId } });
  }

  saveWhatsAppPhone({ workspaceId, wabaId, phoneNumberId, displayPhoneNumber }) {
    return this.api.post(`/whatsapp/save-phone`, {
      workspaceId,
      wabaId,
      phoneNumberId,
      displayPhoneNumber,
    });
  }
}

export default new MetaService(`${getBackendUrl()}/meta`);













