import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class PublicService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  getPartnerConfig() {
    return this.api.post("/getPartnerConfig", { origin: window.location.host });
  }
  signupPartner(data) {
    return this.api.post("/signupPartner", {
      domain: window.location.host,
      ...data,
    });
  }
  getVacancyData(id) {
    return this.api.get(`/getVacancyData?id=${id}`);
  }
  cloudinarySearch(data) {
    return this.api.post(`/cloudinarySearch`, data);
  }

  createVacancySubmission(data) {
    return this.api.post("/createVacancySubmission", {
      domain: window.location.host,
      ...data,
      baseURL: window.location.origin,
    });
  }
  clickFunnel(data) {
    return this.api.post("/clickFunnel", {
      domain: window.location.host,
      ...data,
    });
  }
  ctaClick(data) {
    return this.api.put("/ctaClick", {
      domain: window.location.host,
      ...data,
    });
  }

  getSurvey(token, checkExpired) {
    return this.api.get(
      `/getSurvey?token=${token}&checkExpired=${checkExpired}`
    );
  }
  getRecruiterData(id, candidateId) {
    return this.api.get(
      `/getRecruiterData?id=${id}&candidateId=${candidateId}`
    );
  }
  queryJobsOfRecruiter({ page = 1, limit = 10, recruiterId }) {
    return this.api.post(`/queryJobsOfRecruiter`, { page, limit, recruiterId });
  }
  queryLandingPagesOfRecruiter({ page = 1, limit = 10, recruiterId, includeUnpublished = false }) {
    return this.api.post(`/queryLandingPagesOfRecruiter`, { page, limit, recruiterId, includeUnpublished });
  }
  getLPBrand(id) {
    return this.api.get(`/getLPBrand?id=${id}`);
  }
  getLP(id) {
    return this.api.get(`/getLP?id=${id}`);
  }
  submitSurvey(data) {
    return this.api.post("/submitSurvey", {
      domain: window.location.host,
      ...data,
    });
  }
}

export default new PublicService(`${getBackendUrl()}/public`);
