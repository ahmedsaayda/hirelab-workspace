import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class MessagingService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  messageCandidate({
    candidateId,
    subject,
    message,
    includeBCC = false,
    isSMS = false,
  }) {
    return this.api.post(`/messageCandidate?id=${candidateId}`, {
      subject,
      includeBCC,
      message,
      baseURL: window.location.origin,
      isSMS,
    });
  }

  /**
   * Send WhatsApp message to candidate
   * @param {Object} params
   * @param {string} params.candidateId - Candidate ID
   * @param {string} params.message - Message text (supports variables)
   * @param {string} params.workspaceId - Optional workspace ID
   */
  whatsappCandidate({ candidateId, message, workspaceId }) {
    return this.api.post(`/whatsappCandidate?id=${candidateId}`, {
      message,
      workspaceId,
      baseURL: window.location.origin,
    });
  }
}

export default new MessagingService(`${getBackendUrl()}/messaging`);
