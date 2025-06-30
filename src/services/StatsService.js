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

  getNumbers(funnelId) {
    return this.api.get(`/getNumbers?funnelId=${funnelId}`);
  }
  getTimeToApply(funnelId) {
    return this.api.get(`/getTimeToApply?funnelId=${funnelId}`);
  }
  getSegmentedNumbers(funnelId, timeframe) {
    return this.api.get(
      `/getSegmentedNumbers?funnelId=${funnelId}&timeframe=${timeframe}`
    );
  }
  getSurveys(funnelId) {
    return this.api.get(`/getSurveys?funnelId=${funnelId}`);
  }
}

export default new GarbageService(`${getBackendUrl()}/stats`);
