import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class ChatService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  getTickets() {
    return this.api.get(`/getTickets`);
  }
  closeTicket(fromId) {
    return this.api.put(`/closeTicket?fromId=${fromId}`);
  }
  submitTicket({ text }) {
    return this.api.post(`/submitTicket`, { text });
  }
  postChat({ to, text }) {
    return this.api.post(`/postChat`, { to, text });
  }
  messages(userId, page, limit) {
    return this.api.get(
      `/messages?userId=${userId ?? ""}&page=${page ?? 1}&limit=${limit ?? 10}`
    );
  }
  getPartnerSupportMessages(userId, page, limit) {
    return this.api.get(
      `/getPartnerSupportMessages?userId=${userId ?? ""}&page=${
        page ?? 1
      }&limit=${limit ?? 10}`
    );
  }
  getLatestChatPartners(page, limit) {
    return this.api.get(
      `/getLatestChatPartners?page=${page ?? 1}&limit=${limit ?? 10}`
    );
  }
  getNumberTickets() {
    return this.api.get(`/getNumberTickets`);
  }
}

export default new ChatService(`${getBackendUrl()}/chat`);
