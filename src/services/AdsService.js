import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AdsService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  getAds(lpId) {
    return this.api.get(`/landingpage/${lpId}/ads`);
  }

  saveAds(lpId, ads) {
    return this.api.put(`/landingpage/${lpId}/ads`, { ads });
  }

  generate(lpId, options = {}) {
    return this.api.post(`/landingpage/${lpId}/ads/generate`, options);
  }

  publish(lpId, payload) {
    return this.api.post(`/landingpage/${lpId}/ads/publish`, payload);
  }

  status(lpId) {
    return this.api.get(`/landingpage/${lpId}/ads/status`);
  }

  toggle(lpId, adId, active) {
    return this.api.post(`/landingpage/${lpId}/ads/${adId}/toggle`, { active });
  }

  /**
   * Create a HireLab ad set AND a shallow Meta campaign + ad set.
   * Now also accepts fresh creatives to store on the ad set.
   * Returns { adSet, metaCampaignId, metaAdSetId }
   */
  createAdSet(lpId, creatives = null) {
    return this.api.post(`/landingpage/${lpId}/ads/adset/create`, { creatives });
  }
}

export default new AdsService(`${getBackendUrl()}/landingPage`);














