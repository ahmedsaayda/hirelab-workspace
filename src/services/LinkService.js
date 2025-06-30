import { getBackendUrl } from "./getBackendUrl";

const LinkService = {
  updateShortLink: async (path, shortLink) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/links/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({ path, shortLink }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update short link');
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('LinkService updateShortLink error:', error);
      throw error;
    }
  },
};

export default LinkService; 
