import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";
import { message } from "antd";

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
  update(model, id, body, additionalData = {}, origine="not specified") {
    if(!id) {
      console.log("No id found for "+origine)
      message.error("No id found for "+origine);}

    // Merge additionalData with body if provided
    const updateData = {
      ...body,
      ...additionalData
    };

    return this.api.put(`/single?ModelName=${model}&id=${id}`, updateData);
  }
  getSingle(model, id,origine="") {
    if(!id) {
      console.log("No id found for "+origine)
      message.error("No id found for "+origine);}
    console.log("getting single",model,id,origine)
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
