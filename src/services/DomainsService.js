import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class DomainsService {
  constructor(baseURL) {
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  list(params = {}) {
    return this.api.get("/", { params });
  }

  add(domain) {
    // Avoid collision with interceptor that injects { domain: window.location.host }
    return this.api.post("/add", { domainToConnect: domain });
  }

  remove(domainId) {
    return this.api.delete(`/${domainId}`);
  }

  check(domain) {
    return this.api.get(`/${encodeURIComponent(domain)}/check-dns`);
  }

  dnsConfig(domain) {
    return this.api.get(`/${encodeURIComponent(domain)}/dns-config`);
  }

  getSettings() {
    return this.api.get(`/global-settings`);
  }

  saveSettings(payload) {
    return this.api.put(`/global-settings`, payload);
  }

  // Public helpers
  static byHostname(hostname) {
    return axios.get(`${getBackendUrl()}/domains/by-hostname?hostname=${hostname}`);
  }
  static settingsByUser(userId) {
    return axios.get(`${getBackendUrl()}/domains/global-settings/${userId}`);
  }
}

export default new DomainsService(`${getBackendUrl()}/domains`);


