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
   * Generate video with Creatomate (used for both download and approve creatives)
   * @param {string} lpId - Landing page ID
   * @param {Object} params - Generation parameters
   * @param {string} params.variantId - Variant ID
   * @param {Object} params.variant - Full variant object with title, linkDescription, videoUrl, etc.
   * @param {Object} params.landingPage - Landing page data with buttonColor, primaryColor, etc.
   * @param {string} params.format - 'story' | 'square' | 'portrait'
   * @returns {Promise<{renderId: string, status: string, videoUrl?: string}>}
   */
  generateVideo(lpId, { variantId, variant, landingPage, format = 'story' }) {
    return this.api.post(`/landingpage/${lpId}/ads/record-video`, {
      variantId,
      variant,
      landingPage,
      format,
    }, {
      timeout: 60000,
    });
  }

  /**
   * Check Creatomate render status
   * @param {string} lpId - Landing page ID
   * @param {string} renderId - Creatomate render ID
   * @returns {Promise<{status: string, videoUrl?: string}>}
   */
  getRenderStatus(lpId, renderId) {
    return this.api.get(`/landingpage/${lpId}/ads/render-status/${renderId}`);
  }

  /**
   * Wait for video render to complete
   * @param {string} lpId - Landing page ID
   * @param {string} renderId - Creatomate render ID
   * @param {number} maxWaitMs - Maximum wait time
   * @returns {Promise<string>} - Video URL
   */
  async waitForRender(lpId, renderId, maxWaitMs = 120000) {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWaitMs) {
      const response = await this.getRenderStatus(lpId, renderId);
      const data = response?.data?.data;

      if (data?.status === 'succeeded' && data?.videoUrl) {
        return data.videoUrl;
      }

      if (data?.status === 'failed') {
        throw new Error(data?.errorMessage || 'Video render failed');
      }

      await new Promise(r => setTimeout(r, pollInterval));
    }

    throw new Error('Video render timed out');
  }
}

export default new AdsService(`${getBackendUrl()}/landingPage`);














