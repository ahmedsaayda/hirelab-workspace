import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AdsService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  getAds(lpId) {
    return this.api.get(`/landingpage/${lpId}/ads`);
  }

  saveAds(lpId, ads) {
    return this.api.put(`/landingpage/${lpId}/ads`, { ads });
  }

  generate(lpId, options = {}) {
    return this.api.post(`/landingpage/${lpId}/ads/generate`, options);
  }

  publish(lpId, payload) {
    return this.api.post(`/landingpage/${lpId}/ads/publish`, payload);
  }

  status(lpId) {
    return this.api.get(`/landingpage/${lpId}/ads/status`);
  }

  toggle(lpId, adId, active) {
    return this.api.post(`/landingpage/${lpId}/ads/${adId}/toggle`, { active });
  }

  /**
   * Create a HireLab ad set AND a shallow Meta campaign + ad set.
   * Now also accepts fresh creatives to store on the ad set.
   * Returns { adSet, metaCampaignId, metaAdSetId }
   */
  createAdSet(lpId, creatives = null) {
    return this.api.post(`/landingpage/${lpId}/ads/adset/create`, { creatives });
  }

  /**
   * Generate creative with Creatomate (image or video)
   * Used for both download and approve creatives
   * @param {string} lpId - Landing page ID
   * @param {Object} params - Generation parameters
   * @param {string} params.variantId - Variant ID
   * @param {Object} params.variant - Full variant object with title, linkDescription, videoUrl, etc.
   * @param {Object} params.landingPage - Landing page data with colors, logo, fonts, etc.
   * @param {string} params.format - 'story' | 'square' | 'portrait'
   * @param {string} params.templateName - Creatomate template name (default: 'clarity')
   * @returns {Promise<{renderId: string, status: string, url?: string, isVideo: boolean}>}
   */
  generateVideo(lpId, { variantId, variant, landingPage, format = 'story', templateName = 'clarity' }) {
    return this.api.post(`/landingpage/${lpId}/ads/record-video`, {
      variantId,
      variant,
      landingPage,
      format,
      templateName,
    }, {
      timeout: 60000, // Initial request timeout
    });
  }

  /**
   * Check Creatomate render status
   * @param {string} lpId - Landing page ID
   * @param {string} renderId - Creatomate render ID
   * @returns {Promise<{status: string, url?: string, progress?: number}>}
   */
  getRenderStatus(lpId, renderId) {
    return this.api.get(`/landingpage/${lpId}/ads/render-status/${renderId}`);
  }

  /**
   * Wait for creative render to complete (image or video)
   * @param {string} lpId - Landing page ID
   * @param {string} renderId - Creatomate render ID
   * @param {number} maxWaitMs - Maximum wait time (default 3 minutes)
   * @returns {Promise<string>} - Asset URL
   */
  async waitForRender(lpId, renderId, maxWaitMs = 180000) {
    const startTime = Date.now();
    const pollInterval = 1500; // Poll every 1.5 seconds

    while (Date.now() - startTime < maxWaitMs) {
      const response = await this.getRenderStatus(lpId, renderId);
      const data = response?.data?.data;

      // Check for `url` (new backend) or `videoUrl` (legacy)
      const assetUrl = data?.url || data?.videoUrl;
      
      if (data?.status === 'succeeded' && assetUrl) {
        return assetUrl;
      }

      if (data?.status === 'failed') {
        throw new Error(data?.errorMessage || 'Render failed');
      }

      // Log progress for debugging
      if (data?.progress) {
        console.log(`[AdsService] Render ${renderId}: ${Math.round(data.progress * 100)}%`);
      }

      await new Promise(r => setTimeout(r, pollInterval));
    }

    throw new Error('Render timed out after ' + Math.round(maxWaitMs / 1000) + ' seconds');
  }
}

export default new AdsService(`${getBackendUrl()}/landingPage`);














