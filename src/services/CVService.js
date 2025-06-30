import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class CVService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  searchOrganization(k) {
    return this.api.get(`/searchOrganization?keyword=${k}`);
  }
  getCVData(k) {
    return this.api.get(`/getCVData?token=${k}`);
  }
  submitCV(k, alternativeUrl) {
    return this.api.post(`/submitCV?token=${k}`, { alternativeUrl });
  }
  updateCVData(k, body) {
    return this.api.put(`/updateCVData?token=${k}`, body);
  }
}

export default new CVService(`${getBackendUrl()}/cv`);
