import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

/**
 * Generic Admin API service.
 * Add future admin endpoints here and keep feature-specific wrappers thin.
 */
class AdminService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  // Landing pages
  listTransferableLandingPages({ toUserId, q = "", limit = 100, page = 1 } = {}) {
    return this.api.get("/landing-pages/transferable", {
      params: { toUserId, q, limit, page },
    });
  }

  transferLandingPagesBulk({ toUserId, landingPageIds } = {}) {
    return this.api.post("/landing-pages/transfer", { toUserId, landingPageIds });
  }
}

export default new AdminService(`${getBackendUrl()}/admin`);


