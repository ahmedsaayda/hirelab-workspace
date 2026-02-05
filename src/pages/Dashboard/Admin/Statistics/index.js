import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Select,
  Checkbox,
  Spin,
  Tag,
  Tooltip,
  message,
  Empty,
  Avatar,
  Drawer,
  Button,
  Divider,
  List,
} from "antd";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  MailOutlined,
  CloseOutlined,
  ExportOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import AdminStatsService from "../../../../services/AdminStatsService";
import CandidateProfile from "../../Vacancy/components/CandidateProfile";
import CrudService from "../../../../services/CrudService";

const { Option } = Select;

// Color palette for metrics
const METRIC_COLORS = {
  users: "#3B82F6",        // Blue
  landingPages: "#F59E0B", // Amber
  candidates: "#10B981",   // Emerald
  workspaces: "#8B5CF6",   // Purple
  vacancies: "#EC4899",    // Pink
};

const METRIC_LABELS = {
  users: "Users",
  landingPages: "Funnels",
  candidates: "Candidates",
  workspaces: "Workspaces",
  vacancies: "Vacancies",
};

// Timeframe options
const TIMEFRAMES = [
  { value: "day", label: "24 Hours" },
  { value: "week", label: "7 Days" },
  { value: "month", label: "30 Days" },
  { value: "quarter", label: "90 Days" },
  { value: "year", label: "1 Year" },
  { value: "all", label: "All Time" },
];

// Granularity options
const GRANULARITIES = [
  { value: "hour", label: "Hourly" },
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

// Activity type icons and colors
const ACTIVITY_CONFIG = {
  user_signup: { icon: <UserOutlined />, color: "#3B82F6", bg: "#EFF6FF" },
  candidate_submission: { icon: <TeamOutlined />, color: "#10B981", bg: "#ECFDF5" },
  funnel_created: { icon: <FundProjectionScreenOutlined />, color: "#F59E0B", bg: "#FFFBEB" },
};

const Statistics = () => {
  // State
  const [initialLoading, setInitialLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Granular loading states for each section
  const [loadingKpi, setLoadingKpi] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingPerformers, setLoadingPerformers] = useState(false);
  
  // Filters
  const [timeframe, setTimeframe] = useState("week");
  const [granularity, setGranularity] = useState("day");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([
    "users", "landingPages", "candidates"
  ]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Candidate profile drawer state
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  
  // Company drawer state
  const [companyDrawerOpen, setCompanyDrawerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyFunnels, setCompanyFunnels] = useState([]);
  const [loadingCompanyFunnels, setLoadingCompanyFunnels] = useState(false);
  const [companyOwner, setCompanyOwner] = useState(null);

  // Fetch KPI data
  const fetchKPIData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoadingKpi(true);
    try {
      const response = await AdminStatsService.getKPIStats(timeframe, selectedUser);
      setKpiData(response.data.data);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setLoadingKpi(false);
    }
  }, [timeframe, selectedUser]);

  // Fetch chart data
  const fetchChartData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoadingChart(true);
    try {
      const response = await AdminStatsService.getChartData({
        timeframe,
        granularity,
        userId: selectedUser,
        metrics: selectedMetrics.join(","),
      });
      
      // Transform data for Recharts
      const { labels, datasets } = response.data.data;
      const transformedData = labels.map((label, index) => {
        const point = { name: label };
        Object.keys(datasets).forEach(key => {
          point[key] = datasets[key][index] || 0;
        });
        return point;
      });
      
      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoadingChart(false);
    }
  }, [timeframe, granularity, selectedUser, selectedMetrics]);

  // Fetch activities
  const fetchActivities = useCallback(async (showLoading = true) => {
    if (showLoading) setLoadingActivities(true);
    try {
      const response = await AdminStatsService.getRealtimeActivity(15, selectedUser);
      setActivities(response.data.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  }, [selectedUser]);

  // Fetch top performers
  const fetchTopPerformers = useCallback(async (showLoading = true) => {
    if (showLoading) setLoadingPerformers(true);
    try {
      const response = await AdminStatsService.getTopPerformers(timeframe, 5, selectedUser);
      setTopPerformers(response.data.data.topByFunnels || []);
    } catch (error) {
      console.error("Error fetching top performers:", error);
    } finally {
      setLoadingPerformers(false);
    }
  }, [timeframe, selectedUser]);

  // Fetch users for filter
  const fetchUsers = useCallback(async () => {
    try {
      const response = await AdminStatsService.getUsersForFilter();
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadAllData = async () => {
      setInitialLoading(true);
      await Promise.all([
        fetchKPIData(false),
        fetchChartData(false),
        fetchActivities(false),
        fetchTopPerformers(false),
        fetchUsers(),
      ]);
      setInitialLoading(false);
    };
    loadAllData();
  }, []);

  // Reload when filters change (without blocking UI)
  useEffect(() => {
    if (!initialLoading) {
      fetchKPIData(true);
      fetchChartData(true);
      fetchTopPerformers(true);
      fetchActivities(true);
    }
  }, [timeframe, granularity, selectedUser, selectedMetrics]);

  // Auto-refresh (silent, no loading indicators)
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchKPIData(false);
        fetchActivities(false);
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchKPIData, fetchActivities]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Open candidate profile
  const handleOpenCandidate = (candidateId) => {
    if (candidateId) {
      setSelectedCandidateId(candidateId);
    }
  };

  // Open vacancy/funnel page in new tab
  const handleOpenVacancy = (landingPageId) => {
    if (landingPageId) {
      window.open(`/lp/${landingPageId}`, "_blank");
    }
  };

  // Open company drawer and load data
  const handleOpenCompany = async (workspace, workspaceId) => {
    if (!workspace && !workspaceId) return;
    
    setSelectedCompany(workspace || { _id: workspaceId });
    setCompanyDrawerOpen(true);
    setLoadingCompanyFunnels(true);
    setCompanyOwner(null);
    setCompanyFunnels([]);

    try {
      // If we only have workspaceId, fetch full workspace data
      let workspaceData = workspace;
      if (!workspace || !workspace.name) {
        const wsResponse = await CrudService.getSingle("Workspace", workspaceId);
        workspaceData = wsResponse?.data || { _id: workspaceId };
        setSelectedCompany(workspaceData);
      }

      // Fetch owner details if available
      if (workspaceData?.owner) {
        const ownerResponse = await CrudService.getSingle("User", workspaceData.owner);
        setCompanyOwner(ownerResponse?.data || null);
      }

      // Fetch all funnels/campaigns for this workspace
      const funnelsResponse = await CrudService.search("LandingPageData", 50, 1, {
        filters: { workspace: workspaceData?._id || workspaceId },
        sort: { createdAt: -1 },
      });
      setCompanyFunnels(funnelsResponse?.data?.items || []);
    } catch (error) {
      console.error("Error loading company data:", error);
      message.error("Failed to load company details");
    } finally {
      setLoadingCompanyFunnels(false);
    }
  };

  // Render activity item with clickable elements
  const renderActivityItem = (activity) => {
    const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.user_signup;
    
    if (activity.type === "candidate_submission") {
      return (
        <div className="flex items-start gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: config.bg }}
          >
            <span style={{ color: config.color, fontSize: "14px" }}>
              {config.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <button
                onClick={() => handleOpenCandidate(activity.candidateId)}
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                {activity.candidateName || "Candidate"}
              </button>
              {" "}applied for{" "}
              <button
                onClick={() => handleOpenVacancy(activity.landingPageId)}
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                {activity.vacancyTitle || "a position"}
              </button>
              {activity.companyName && activity.companyName !== "Unknown Company" && (
                <>
                  {" "}at{" "}
                  <button
                    onClick={() => handleOpenCompany(activity.workspace, activity.workspaceId)}
                    className="font-medium text-purple-600 hover:text-purple-800 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {activity.companyName}
                  </button>
                </>
              )}
            </p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatTimestamp(activity.timestamp)}
          </span>
        </div>
      );
    }

    // Default rendering for other activity types
    return (
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.bg }}
        >
          <span style={{ color: config.color, fontSize: "14px" }}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {activity.title}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {activity.description}
          </p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">
          {formatTimestamp(activity.timestamp)}
        </span>
      </div>
    );
  };

  // Company Drawer Component
  const renderCompanyDrawer = () => (
    <Drawer
      title={null}
      placement="right"
      open={companyDrawerOpen}
      onClose={() => setCompanyDrawerOpen(false)}
      width={600}
      headerStyle={{ display: "none" }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 relative">
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setCompanyDrawerOpen(false)}
          className="absolute top-4 right-4 text-white hover:bg-white/20 border-0"
        />
        
        <div className="flex items-center gap-4">
          {selectedCompany?.brandLogo ? (
            <img 
              src={selectedCompany.brandLogo} 
              alt={selectedCompany?.name}
              className="w-16 h-16 rounded-xl object-contain bg-white p-2"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <FundProjectionScreenOutlined className="text-3xl text-white/80" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold m-0">{selectedCompany?.name || "Company"}</h2>
            {selectedCompany?.websiteUrl && (
              <a 
                href={selectedCompany.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 text-sm hover:text-white flex items-center gap-1"
              >
                <GlobalOutlined /> {selectedCompany.websiteUrl}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        {selectedCompany?.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
            <p className="text-gray-700">{selectedCompany.description}</p>
          </div>
        )}

        {/* Brand Colors & Font */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Brand Settings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Primary Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-200"
                  style={{ backgroundColor: selectedCompany?.primaryColor || "#5207cd" }}
                />
                <span className="text-sm font-mono">{selectedCompany?.primaryColor || "#5207cd"}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Secondary Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-200"
                  style={{ backgroundColor: selectedCompany?.secondaryColor || "#10b981" }}
                />
                <span className="text-sm font-mono">{selectedCompany?.secondaryColor || "#10b981"}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Font</p>
              <span className="text-sm" style={{ fontFamily: selectedCompany?.selectedFont }}>
                {selectedCompany?.selectedFont || "Default"}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        {companyOwner && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Linked User</h3>
            <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
              <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {companyOwner.firstName} {companyOwner.lastName}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MailOutlined /> {companyOwner.email}
                </p>
              </div>
              <Tag color={companyOwner.role === "admin" ? "red" : "blue"}>
                {companyOwner.role || "User"}
              </Tag>
            </div>
          </div>
        )}

        {/* Campaigns/Funnels */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Campaigns ({companyFunnels.length})
            </h3>
          </div>
          
          {loadingCompanyFunnels ? (
            <div className="text-center py-8">
              <Spin />
              <p className="text-gray-500 mt-2">Loading campaigns...</p>
            </div>
          ) : companyFunnels.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {companyFunnels.map((funnel) => (
                <div 
                  key={funnel._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {funnel.vacancyTitle || "Untitled Campaign"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag color={funnel.isPublished ? "green" : "orange"} className="text-xs">
                          {funnel.isPublished ? "Published" : "Draft"}
                        </Tag>
                        <span className="text-xs text-gray-400">
                          Created {new Date(funnel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<ExportOutlined />}
                      onClick={() => window.open(`/lp/${funnel._id}`, "_blank")}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No campaigns found" className="py-4" />
          )}
        </div>
      </div>
    </Drawer>
  );

  // KPI Card component
  const KPICard = ({ title, value, periodValue, total, subtitle, icon, color, trend }) => (
    <Card 
      className="relative overflow-hidden border-l-4 hover:shadow-lg transition-shadow"
      style={{ borderLeftColor: color }}
      bodyStyle={{ padding: "20px" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{periodValue?.toLocaleString() || 0}</span>
            {trend !== undefined && (
              <span className={`text-sm font-medium flex items-center ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                {trend >= 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
          {total !== undefined && (
            <p className="text-gray-400 text-xs mt-1">Total: {total?.toLocaleString()}</p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color, fontSize: "24px" }}>{icon}</span>
        </div>
      </div>
    </Card>
  );

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Statistics</h1>
          <p className="text-gray-500 mt-1">Real-time analytics and insights</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: 130 }}
            options={TIMEFRAMES}
          />
          <Select
            value={granularity}
            onChange={setGranularity}
            style={{ width: 120 }}
            options={GRANULARITIES}
          />
          <Select
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="All Users"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: 200 }}
            options={users.map(u => ({ value: u._id, label: u.label }))}
          />
          <Tooltip title={autoRefresh ? "Auto-refresh ON (30s)" : "Enable auto-refresh"}>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg border transition-colors ${
                autoRefresh 
                  ? "bg-green-50 border-green-300 text-green-600" 
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ThunderboltOutlined className={autoRefresh ? "animate-pulse" : ""} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 transition-opacity ${loadingKpi ? "opacity-60" : "opacity-100"}`}>
        <KPICard
          title={`Users (${TIMEFRAMES.find(t => t.value === timeframe)?.label})`}
          value={kpiData?.users?.total}
          periodValue={kpiData?.users?.period}
          total={kpiData?.users?.total}
          subtitle={`${kpiData?.users?.active || 0} active this week`}
          icon={<UserOutlined />}
          color={METRIC_COLORS.users}
        />
        <KPICard
          title={`Funnels (${TIMEFRAMES.find(t => t.value === timeframe)?.label})`}
          value={kpiData?.landingPages?.total}
          periodValue={kpiData?.landingPages?.period}
          total={kpiData?.landingPages?.total}
          subtitle={`Published: ${kpiData?.landingPages?.published || 0}`}
          icon={<FundProjectionScreenOutlined />}
          color={METRIC_COLORS.landingPages}
        />
        <KPICard
          title={`Candidates (${TIMEFRAMES.find(t => t.value === timeframe)?.label})`}
          value={kpiData?.candidates?.total}
          periodValue={kpiData?.candidates?.period}
          total={kpiData?.candidates?.total}
          subtitle={`Avg: ${kpiData?.insights?.avgCandidatesPerFunnel || 0}/funnel`}
          icon={<TeamOutlined />}
          color={METRIC_COLORS.candidates}
        />
        <KPICard
          title={`Workspaces (${TIMEFRAMES.find(t => t.value === timeframe)?.label})`}
          value={kpiData?.workspaces?.total}
          periodValue={kpiData?.workspaces?.period}
          total={kpiData?.workspaces?.total}
          icon={<FileTextOutlined />}
          color={METRIC_COLORS.workspaces}
        />
        <KPICard
          title={`Vacancies (${TIMEFRAMES.find(t => t.value === timeframe)?.label})`}
          value={kpiData?.vacancies?.total}
          periodValue={kpiData?.vacancies?.period}
          total={kpiData?.vacancies?.total}
          subtitle={`Active: ${kpiData?.vacancies?.active || 0}`}
          icon={<FileTextOutlined />}
          color={METRIC_COLORS.vacancies}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart section */}
        <div className="xl:col-span-2">
          <Card 
            title={
              <div className="flex items-center justify-between">
                <span>Growth Trends</span>
                <div className="flex items-center gap-3">
                  {Object.entries(METRIC_LABELS).map(([key, label]) => (
                    <Checkbox
                      key={key}
                      checked={selectedMetrics.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMetrics([...selectedMetrics, key]);
                        } else {
                          setSelectedMetrics(selectedMetrics.filter(m => m !== key));
                        }
                      }}
                    >
                      <span style={{ color: METRIC_COLORS[key] }}>{label}</span>
                    </Checkbox>
                  ))}
                </div>
              </div>
            }
            className="shadow-sm"
          >
            <div className="relative">
              {loadingChart && (
                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                  <Spin tip="Loading chart..." />
                </div>
              )}
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <defs>
                      {Object.entries(METRIC_COLORS).map(([key, color]) => (
                        <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Legend />
                    {selectedMetrics.map(metric => (
                      <Area
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        name={METRIC_LABELS[metric]}
                        stroke={METRIC_COLORS[metric]}
                        fill={`url(#gradient-${metric})`}
                        strokeWidth={2}
                        dot={{ r: 3, fill: METRIC_COLORS[metric] }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <Empty description="No data available for selected filters" />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Real-time Activity */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-green-500" />
                <span>Recent Activity</span>
                {loadingActivities && (
                  <Spin size="small" className="ml-2" />
                )}
                {autoRefresh && !loadingActivities && (
                  <Tag color="green" className="ml-auto">Live</Tag>
                )}
              </div>
            }
            className="shadow-sm"
            bodyStyle={{ padding: 0, maxHeight: "400px", overflow: "auto", position: "relative" }}
          >
            <div className={`transition-opacity ${loadingActivities ? "opacity-50" : "opacity-100"}`}>
              {activities.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {activities.map((activity, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                      {renderActivityItem(activity)}
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No recent activity" className="py-8" />
              )}
            </div>
          </Card>

          {/* Top Performers */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-amber-500" />
                <span>Top Performers</span>
                {loadingPerformers && (
                  <Spin size="small" className="ml-2" />
                )}
              </div>
            }
            className="shadow-sm"
          >
            <div className={`transition-opacity ${loadingPerformers ? "opacity-50" : "opacity-100"}`}>
              {topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div 
                      key={performer.userId} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? "bg-amber-100 text-amber-700" : 
                          index === 1 ? "bg-gray-100 text-gray-600" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "bg-gray-50 text-gray-500"}
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {performer.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {performer.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">
                          {performer.funnels}
                        </span>
                        <p className="text-xs text-gray-400">funnels</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No data available" className="py-4" />
              )}
            </div>
          </Card>

          {/* Quick Insights */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <ThunderboltOutlined className="text-amber-500" />
                <span>Quick Insights</span>
              </div>
            }
            className="shadow-sm"
          >
            <div className="space-y-4">
              <Tooltip title="Average number of candidates per funnel that has received at least 1 application">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-help">
                  <div>
                    <span className="text-sm text-green-700 font-medium">Avg Candidates/Funnel</span>
                    <p className="text-xs text-green-600 opacity-70">Active funnels only</p>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {kpiData?.insights?.avgCandidatesPerFunnel || 0}
                  </span>
                </div>
              </Tooltip>
              <Tooltip title="Funnels that have received at least 1 candidate application">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-help">
                  <div>
                    <span className="text-sm text-blue-700 font-medium">Active Funnels</span>
                    <p className="text-xs text-blue-600 opacity-70">With ≥1 candidate</p>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {kpiData?.insights?.activeFunnelsCount || 0} / {kpiData?.landingPages?.total || 0}
                  </span>
                </div>
              </Tooltip>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <span className="text-sm text-purple-700 font-medium">Published Funnels</span>
                  <p className="text-xs text-purple-600 opacity-70">Live on website</p>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {kpiData?.landingPages?.published || 0} / {kpiData?.landingPages?.total || 0}
                </span>
              </div>
              {/* Explanatory note */}
              <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                💡 Metrics exclude draft funnels for accuracy
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Candidate Profile Drawer */}
      <CandidateProfile
        candidateId={selectedCandidateId}
        onClose={() => setSelectedCandidateId(null)}
        onUpdate={() => {
          // Refresh activities when candidate is updated
          fetchActivities();
        }}
        stages={[]}
        allCandidateIds={[]}
      />

      {/* Company Details Drawer */}
      {renderCompanyDrawer()}
    </div>
  );
};

export default Statistics;

