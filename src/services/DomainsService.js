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

  add(domain, params = {}) {
    // Avoid collision with interceptor that injects { domain: window.location.host }
    return this.api.post("/add", { domainToConnect: domain }, { params });
  }

  remove(domainId, params = {}) {
    return this.api.delete(`/${domainId}`, { params });
  }

  check(domain, params = {}) {
    return this.api.get(`/${encodeURIComponent(domain)}/check-dns`, { params });
  }

  dnsConfig(domain, params = {}) {
    return this.api.get(`/${encodeURIComponent(domain)}/dns-config`, { params });
  }

  getSettings(params = {}) {
    return this.api.get(`/global-settings`, { params });
  }

  saveSettings(payload, params = {}) {
    return this.api.put(`/global-settings`, payload, { params });
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


