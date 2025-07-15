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
}

export default new AiService(`${getBackendUrl()}/ai`);
