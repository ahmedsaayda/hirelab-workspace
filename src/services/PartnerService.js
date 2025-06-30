import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class PartnerService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  searchUsers(data) {
    return this.api.post("/searchUsers", data);
  }

  getNumbers() {
    return this.api.get(`/getNumbers`);
  }
  getSegmentedNumbers(timeframe) {
    return this.api.get(`/getSegmentedNumbers?timeframe=${timeframe}`);
  }
  getPartnerSecretConfig() {
    return this.api.get(`/getPartnerSecretConfig`);
  }

  updateSMTP(data) {
    return this.api.put("/updateSMTP", data);
  }
  disconnectSMTP() {
    return this.api.delete(`/disconnectSMTP`);
  }
  updateUser(id, data) {
    return this.api.put(`/updateUser?id=${id}`, data);
  }
  checkPricingDeletable(id) {
    return this.api.get(`/checkPricingDeletable?id=${id}`);
  }
  updateGrowthRequest(data) {
    return this.api.put(`/updateGrowthRequest`, data);
  }
  getOwnGrowthRequest() {
    return this.api.get(`/getOwnGrowthRequest`);
  }
  queryGrowthRequests(page, limit) {
    return this.api.get(`/queryGrowthRequests?page=${page}&limit=${limit}`);
  }
  getNumberOfNew() {
    return this.api.get(`/getNumberOfNew`);
  }
}

export default new PartnerService(`${getBackendUrl()}/partner`);
