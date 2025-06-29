import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class ATSService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  deleteFunnel(id, deleteApplicants) {
    return this.api.delete(
      `/deleteFunnel?id=${id}&deleteApplicants=${deleteApplicants}`
    );
  }
  deleteStage(id) {
    return this.api.delete(`/deleteStage?id=${id}`);
  }
  countApplicants(funnels) {
    return this.api.post(`/countApplicants`, { funnels });
  }

  getExisting(emails) {
    return this.api.post(`/getExisting`, { emails });
  }
  submitCV(candidateId, alternativeUrl) {
    return this.api.post(`/submitCV`, { candidateId, alternativeUrl });
  }
  reloadStages(data) {
    return this.api.post(`/reloadStages`, data);
  }
  fetchCandidates(data) {
    return this.api.post(`/fetchCandidates`, data);
  }

  searchCandidates(data) {
    return this.api.post("/searchCandidates", data);
  }
  updateCandidateDetails(id, formData) {
    return this.api.put(`/updateCandidateDetails?id=${id}`, { formData });
  }
  moveCandidate({ targetStage, candidateId, destinationCol }) {
    return this.api.put("/moveCandidate", {
      targetStage,
      candidateId,
      destinationCol,
      baseURL: window.location.origin,
    });
  }
  rejectCandidate(data) {
    return this.api.put("/rejectCandidate", data);
  }
  undoRejectCandidate(data) {
    return this.api.put("/undoRejectCandidate", data);
  }
  duplicateVacancy(data) {
    return this.api.post("/duplicateVacancy", data);
  }
  createVacancy(data) {
    return this.api.post("/createVacancy", { ...data, askForCV: true });
  }
  cleanupRejected(vacancyId) {
    return this.api.delete(`/cleanupRejected?vacancyId=${vacancyId}`);
  }
  getCandidateDocuments(candidate) {
    return this.api.get(`/getCandidateDocuments?candidate=${candidate}`);
  }
  getActivePromotions() {
    return this.api.get(`/getActivePromotions`);
  }
  getVacancyCallAverage(id) {
    return this.api.get(`/getVacancyCallAverage?id=${id}`);
  }
  getVacancyCallAverageEmotional(id) {
    return this.api.get(`/getVacancyCallAverageEmotional?id=${id}`);
  }
  getVacancyCallAverageCultural(id) {
    return this.api.get(`/getVacancyCallAverageCultural?id=${id}`);
  }
  promoteFunnel(id, data) {
    return this.api.post(`/promoteFunnel?id=${id}`, {
      ...data,
      origin: window.location.origin,
    });
  }
  loadFunnelConfigTemplateIntoVacancy({ templateId, vacancyId }) {
    return this.api.post("/loadFunnelConfigTemplateIntoVacancy", {
      templateId,
      vacancyId,
    });
  }
  importCandidates(data) {
    return this.api.put("/importCandidates", {
      ...data,
      baseURL: window.location.origin,
    });
  }
  getApplyToken(id) {
    return this.api.post(`/get-apply-token/${id}`);
  }
}

export default new ATSService(`${getBackendUrl()}/ats`);
