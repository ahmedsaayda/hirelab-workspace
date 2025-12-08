import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AdsLaunchService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  getSummary(lpId, params = {}) {
    return this.api.get(`/landingPage/landingpage/${lpId}/ads/launch`, { params });
  }

  updateCampaign(lpId, payload) {
    return this.api.post(`/landingPage/landingpage/${lpId}/ads/meta/campaign`, payload);
  }

  updateAdSet(lpId, payload) {
    return this.api.post(`/landingPage/landingpage/${lpId}/ads/meta/adset`, payload);
  }

  updateAd(lpId, payload) {
    return this.api.post(`/landingPage/landingpage/${lpId}/ads/meta/ad`, payload);
  }
}

export default new AdsLaunchService(`${getBackendUrl()}`);


