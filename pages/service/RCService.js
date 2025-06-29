import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class RCService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  getCurrentRC() {
    return this.api.get("/getCurrentRC");
  }
  getTransactions(limit, page) {
    return this.api.get(`/getTransactions?limit=${limit}&page=${page}`);
  }
  purchaseRC(data) {
    return this.api.post("/purchaseRC", {
      ...data,
      origin: window.location.origin,
    });
  }
}

export default new RCService(`${getBackendUrl()}/rc`);
