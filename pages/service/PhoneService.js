import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class PhoneService {
  constructor() {
    this.baseURL = `${getBackendUrl()}/phone`;
    this.api = axios.create({
      baseURL: this.baseURL,
    });
    middleField(this.api);
  }

  startCall(data) {
    return this.api.post(`/startCall`, data);
  }
  outboundCallConnectionCheck() {
    return this.api.get(`/outboundCallConnectionCheck`);
  }
  getIdentity() {
    return this.api.get(`/getIdentity`);
  }
}

export default new PhoneService();
