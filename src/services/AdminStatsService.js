import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class AdminStatsService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL });
    middleField(this.api);
  }

  // Get KPI summary stats
  getKPIStats(timeframe = "week", userId = null) {
    const params = { timeframe };
    if (userId) params.userId = userId;
    return this.api.get("/admin/stats/kpi", { params });
  }

  // Get chart data
  getChartData(options = {}) {
    const { 
      timeframe = "week", 
      granularity = "day", 
      userId = null,
      metrics = "users,landingPages,candidates"
    } = options;
    
    const params = { timeframe, granularity, metrics };
    if (userId) params.userId = userId;
    return this.api.get("/admin/stats/chart", { params });
  }

  // Get real-time activity
  getRealtimeActivity(limit = 20, userId = null) {
    const params = { limit };
    if (userId) params.userId = userId;
    return this.api.get("/admin/stats/activity", { params });
  }

  // Get users for filter dropdown
  getUsersForFilter() {
    return this.api.get("/admin/stats/users");
  }

  // Get top performers
  getTopPerformers(timeframe = "month", limit = 10, userId = null) {
    const params = { timeframe, limit };
    if (userId) params.userId = userId;
    return this.api.get("/admin/stats/top-performers", { params });
  }
}

export default new AdminStatsService(getBackendUrl());

