import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AdminLandingPageService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  listTransferable({ toUserId, q = "", limit = 100, page = 1 } = {}) {
    return this.api.get("/transferable", {
      params: { toUserId, q, limit, page },
    });
  }

  // Alias (preferred naming) - keep for backward/forward compatibility
  listTransferableLandingPages({ toUserId, q = "", limit = 100, page = 1 } = {}) {
    return this.listTransferable({ toUserId, q, limit, page });
  }

  transferBulk({ toUserId, landingPageIds } = {}) {
    return this.api.post("/transfer", { toUserId, landingPageIds });
  }

  // Alias (preferred naming) - keep for backward/forward compatibility
  transferLandingPagesBulk({ toUserId, landingPageIds } = {}) {
    return this.transferBulk({ toUserId, landingPageIds });
  }
}

export default new AdminLandingPageService(`${getBackendUrl()}/admin/landing-pages`);


