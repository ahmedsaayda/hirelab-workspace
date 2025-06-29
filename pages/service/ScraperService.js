import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class ScraperService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  scrapeWebsiteOnboarding(url) {
    return this.api.get(`/onboarding?url=${url}`);
  }
}

export default new ScraperService(`${getBackendUrl()}/scrape`);
