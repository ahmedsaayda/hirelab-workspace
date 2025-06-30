import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class GarbageService {
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
}

export default new GarbageService(`${getBackendUrl()}/messaging`);
