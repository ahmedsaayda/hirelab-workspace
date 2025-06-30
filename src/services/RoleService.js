// services/RoleService.js
import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class RoleService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  createRole(data) {
    return this.api.post("/", data);
  }

  getRoles() {
    return this.api.get("/");
  }

  updateRole(id, data) {
    return this.api.put(`/${id}`, data);
  }

  deleteRole(id) {
    return this.api.delete(`/${id}`);
  }
}

export default new RoleService(`${getBackendUrl()}/role`);
