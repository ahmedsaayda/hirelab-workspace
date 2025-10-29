import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class CategoryService {
  constructor(baseURL) {
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  // Get categories for a workspace
  getCategories(workspaceId) {
    return this.api.get(`/${workspaceId}/categories`);
  }

  // Create a new category
  createCategory(workspaceId, categoryData) {
    return this.api.post(`/${workspaceId}/categories`, categoryData);
  }

  // Get a specific category
  getCategory(categoryId) {
    return this.api.get(`/${categoryId}`);
  }

  // Update a category
  updateCategory(categoryId, updateData) {
    return this.api.put(`/${categoryId}`, updateData);
  }

  // Delete a category
  deleteCategory(categoryId) {
    return this.api.delete(`/${categoryId}`);
  }

  // Associate funnels with a category
  associateFunnels(categoryId, funnelIds) {
    return this.api.post(`/${categoryId}/funnels`, { funnelIds });
  }

  // Remove funnel association
  removeFunnelAssociation(categoryId, funnelId) {
    return this.api.delete(`/${categoryId}/funnels/${funnelId}`);
  }

  // Toggle category publish status
  toggleCategoryPublish(categoryId) {
    return this.api.put(`/${categoryId}/publish`);
  }
}

export default new CategoryService(`${getBackendUrl()}/workspaces`);



