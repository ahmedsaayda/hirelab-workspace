import axios from "axios";
import Cookies from "js-cookie";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AuthService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL,
    });
    middleField(this.api);
  }

  register({ role, email, phone, password, firstName, lastName }) {
    return this.api.post("/register", {
      role,
      email,
      phone,
      password,
      firstName,
      lastName,
    });
  }

  registerTeam(data) {
    return this.api.post("/registerTeam", data);
  }

  login({ email, password }) {
    return this.api.post("/login", { email, password });
  }

  logout() {
    return this.api.post("/logout");
  }

  updatePassword({ current, repeatNew, newPassword }) {
    return this.api.put("/updatePassword", { current, repeatNew, newPassword });
  }

  refresh({ accessToken, refreshToken }) {
    var raw = JSON.stringify({ accessToken, refreshToken });

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    };

    return fetch(this.baseURL + "/refresh", requestOptions);
  }

  requestPasswordReset({ email }) {
    return this.api.post("/requestPasswordReset", { email });
  }

  resetPassword({ OTP, email, newPassword }) {
    return this.api.post("/resetPassword", { OTP, email, newPassword });
  }

  confirmEmail({ email }) {
    return this.api.post("/confirmEmail", { email });
  }

  me() {
    return this.api.get("/me");
  }

  updateMe(me) {
    return this.api.put("/updateMe", me);
  }

  updatePartnerConfig(me) {
    return this.api.put("/updatePartnerConfig", me);
  }

  otpRequest({ purpose }) {
    return this.api.post("/otpRequest", { purpose });
  }

  otpVerify({ OTP }) {
    return this.api.post("/otpVerify", { OTP });
  }

  requestKyc() {
    return this.api.post("/requestKyc", { origin: window.location.origin });
  }

  partnerActivation(e) {
    return this.api.post("/partnerActivation", e);
  }

  userActivation(e) {
    return this.api.post("/userActivation", e);
  }

  updateEmailConfirm(data) {
    return this.api.post("/updateEmailConfirm", data);
  }

  handleUpdateEmailRequest(data) {
    return this.api.post("/handleUpdateEmailRequest", {
      ...data,
      origin: window.location.origin,
    });
  }

  getMeetingData(candidateId) {
    return this.api.get(
      `/getMeetingData?candidateId=${candidateId}&origin=${window.location.origin}`
    );
  }

  createSubscription({ tier, return_url, interval, trial = false, explicitBillingChange = false }) {
    return this.api.post("/createSubscription", { 
      tier, 
      return_url, 
      interval, 
      trial,
      explicitBillingChange 
    });
  }

  upgradeTeamSubscription({ tier, interval }) {
    return this.api.post("/upgradeTeamSubscription", { tier, interval });
  }

  getSubscription() {
    return this.api.post("/getSubscription", {
      return_url: window.location.href,
    });
  }

  reactivateSubscription() {
    return this.api.post("/subscription/reactivate");
  }

  getPlansWithPricing() {
    return this.api.get("/plans");
  }



}

export default new AuthService(`${getBackendUrl()}/auth`);
