import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class CalendlyService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  getAuthURI() {
    return this.api.get(
      `/getAuthURI?redirect_uri=${window.location.origin.replace(
        "http://",
        "https://"
      )}/calendly`
    );
  }
  requestToken({ code, redirect_uri }) {
    return this.api.post("/requestToken", { code, redirect_uri });
  }
  getCurrentToken() {
    return this.api.get("/getCurrentToken");
  }
  disconnectCalendly() {
    return this.api.delete("/disconnectCalendly");
  }
  getEventTypes() {
    return this.api.get("/getEventTypes");
  }
  getNeedsToSelectEventType() {
    return this.api.get("/getNeedsToSelectEventType");
  }
  setPreferedEventType(eventType) {
    return this.api.put("/setPreferedEventType", { eventType });
  }
}

export default new CalendlyService(`${getBackendUrl()}/calendly`);
