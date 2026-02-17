import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  // Scrape URL with Firecrawl
  scrapeUrl(url) {
    return this.api.post("/scrape-url", { url });
  }

  // Process content with AI
  processContentWithAI(data) {
    console.log("data", data);
    return this.api.post("/process-content", data);
  }

  // Process from scratch with AI
  processFromScratchWithAI(data) {
    return this.api.post("/process-from-scratch", data);
  }

  // Search images from Unsplash
  searchUnsplash(query, per_page = 5, page = 1, orientation = null) {
    console.log(`[AiService] searching Unsplash for: "${query}" with per_page: ${per_page}, page: ${page}, orientation: ${orientation}`);
    return this.api.post("/search-images", { query, per_page, page, orientation });
  }

  // Create vacancy in database
  createVacancy(vacancyData) {
    return this.api.post("/create-vacancy", vacancyData);
  }

  // Approach 1: Direct URL to GPT
  analyzeUrlWithGPT(url) {
    return this.api.post("/analyze-url-gpt", { url });
  }

  // Approach 2a: Scrape then GPT
  scrapeAndAnalyze(url) {
    return this.api.post("/scrape-and-analyze", { url });
  }

  // Approach 2b: Copy text then GPT
  copyTextAndAnalyze(url) {
    return this.api.post("/copy-text-and-analyze", { url });
  }

  // Approach 3: Gemini
  analyzeUrlWithGemini(url) {
    return this.api.post("/analyze-url-gemini", { url });
  }

  // Approach 4: AgentQL
  analyzeUrlWithAgentQL(url) {
    return this.api.post("/analyze-url-agentql", { url });
  }

  // Generate application form using AI
  generateApplicationForm(data) {
    return this.api.post("/generate-application-form", data);
  }

  // Enhance scraped company data (backend AI)
  enhanceCompanyData(data) {
    return this.api.post("/enhance-company-data", data);
  }

  // Generate section content for AI editor modal
  generateSectionContent(data) {
    return this.api.post("/generate-section-content", data);
  }

  // Translate an existing vacancy/landing page to another language (AI)
  translateVacancy({ lpId, language }) {
    return this.api.post("/translate-vacancy", { lpId, language });
  }

  // Generate ad copy for a generated variants list (AI)
  // variants: [{ id, adTypeId, variantNumber?, source? }]
  generateAdsCopy({ lpId, variants = [], language }) {
    return this.api.post("/generate-ads-copy", { lpId, variants, language });
  }

  // Regenerate a single ad text field using AI
  // field: title, linkDescription, quoteText, description, metaHeadline, metaDescription, etc.
  regenerateAdField({ lpId, field, currentValue, adTypeId, instruction, language }) {
    return this.api.post("/regenerate-ad-field", { lpId, field, currentValue, adTypeId, instruction, language });
  }

  // Generate image with DALL-E AI
  generateImage({ prompt, size = "1024x1024" }) {
    return this.api.post("/generate-image", { prompt, size }, { timeout: 60000 });
  }

  // Create multi-job campaign page with backend AI generation
  // This moves AI generation to the backend like single job pages
  createMultiVacanciesPage({ linkedCampaignIds, campaignTitle, language, templateId, brandingDetails, user_id }) {
    return this.api.post("/create-multi-vacancies-page", {
      linkedCampaignIds,
      campaignTitle,
      language,
      templateId,
      brandingDetails,
      user_id
    });
  }
}

export default new AiService(`${getBackendUrl()}/ai`);
