import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class CrudService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  create(model, body) {
    return this.api.post(`/create?ModelName=${model}`, body);
  }
  update(model, id, body) {
    return this.api.put(`/single?ModelName=${model}&id=${id}`, body);
  }
  getSingle(model, id) {
    return this.api.get(`/single?ModelName=${model}&id=${id}`);
  }
  delete(model, id) {
    return this.api.delete(`/single?ModelName=${model}&id=${id}`);
  }
  search(model, limit, page, { text, filters, sort, populate, populate2 }) {
    return this.api.post(
      `/search?ModelName=${model}&limit=${limit ?? 10}&page=${page ?? 1}`,
      {
        text,
        filters,
        sort,
        populate,
        populate2,
      }
    );
  }
  getAll(model) {
    return this.api.get(`/all?ModelName=${model}`);
  }
}

export default new CrudService(`${getBackendUrl()}/crud`);
