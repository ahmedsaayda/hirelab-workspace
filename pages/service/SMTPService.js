import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class SMTPService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  getCurrentSMTP() {
    return this.api.get("/getCurrentSMTP");
  }
  updateSMTP(data) {
    return this.api.put("/updateSMTP", data);
  }
  disconnectSMTP() {
    return this.api.delete("/disconnectSMTP");
  }
}

export default new SMTPService(`${getBackendUrl()}/smtp`);
