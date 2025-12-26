import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class CandidateChatService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  // Start a new chat with a candidate
  startChat(candidateId, baseURL) {
    return this.api.post("/startChat", {
      candidateId,
      baseURL: baseURL || window.location.origin,
    });
  }

  // Get all chats for current team
  getTeamChats(page = 1, limit = 20) {
    return this.api.get(`/chats?page=${page}&limit=${limit}`);
  }

  // Get messages for a specific chat
  getChatMessages(chatId, page = 1, limit = 50) {
    return this.api.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  // Send message to candidate (from recruiter)
  sendMessage(chatId, { message, attachments, messageType, interviewSuggestions, baseURL }) {
    return this.api.post("/sendMessage", {
      chatId,
      message,
      attachments,
      messageType,
      interviewSuggestions,
      baseURL: baseURL || window.location.origin,
    });
  }

  // Search messages across team chats
  searchMessages(q, page = 1, limit = 10) {
    const qp = new URLSearchParams({ q, page: String(page), limit: String(limit) }).toString();
    return this.api.get(`/search?${qp}`);
  }

  getTeamMembers() {
    return this.api.get(`/team-members`);
  }

  notifyNoteMentions(candidateId, note) {
    return this.api.post(`/notify-note-mentions`, { candidateId, note });
  }

  addCandidateNote(candidateId, note) {
    return this.api.post(`/add-note`, { candidateId, note });
  }

  // Quick Reply operations
  getQuickReplies() {
    return this.api.get('/quick-replies');
  }

  createQuickReply({ title, message, category }) {
    return this.api.post('/quick-replies', { title, message, category });
  }

  updateQuickReply(id, { title, message, category }) {
    return this.api.put(`/quick-replies/${id}`, { title, message, category });
  }

  deleteQuickReply(id) {
    return this.api.delete(`/quick-replies/${id}`);
  }

  useQuickReply(id) {
    return this.api.post(`/quick-replies/${id}/use`);
  }
}

export default new CandidateChatService(`${getBackendUrl()}/candidateChat`); 