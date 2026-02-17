import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class TemplateService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  // Get all templates (admin)
  getAllTemplates() {
    return this.api.get("/admin/creatomate-templates");
  }

  // Get active templates only (for frontend use)
  getActiveTemplates() {
    return this.api.get("/admin/creatomate-templates/active");
  }

  // Get template by ID
  getTemplateById(id) {
    return this.api.get(`/admin/creatomate-templates/detail/${id}`);
  }

  // Get template by templateId string (e.g., "clarity")
  getTemplateByTemplateId(templateId) {
    return this.api.get(`/admin/creatomate-templates/by-id/${templateId}`);
  }

  // Create a new template
  createTemplate(data) {
    return this.api.post("/admin/creatomate-templates", data);
  }

  // Update a template
  updateTemplate(id, data) {
    return this.api.put(`/admin/creatomate-templates/${id}`, data);
  }

  // Delete a template
  deleteTemplate(id) {
    return this.api.delete(`/admin/creatomate-templates/${id}`);
  }

  // Toggle template active status
  toggleActive(id) {
    return this.api.patch(`/admin/creatomate-templates/${id}/toggle-active`);
  }

  // Reorder templates
  reorderTemplates(orders) {
    return this.api.post("/admin/creatomate-templates/reorder", { orders });
  }

  // Seed default template
  seedDefaultTemplate() {
    return this.api.post("/admin/creatomate-templates/seed");
  }
}

export default new TemplateService(getBackendUrl());

