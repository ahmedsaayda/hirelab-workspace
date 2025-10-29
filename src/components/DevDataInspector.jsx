import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth/selectors";
import { Modal, Button, Tabs, message, Spin, Alert } from "antd";
import CrudService from "../services/CrudService";
import AuthService from "../services/AuthService";
import WorkspaceService from "../services/WorkspaceService";

const isDev = typeof window !== "undefined" && (process.env.NODE_ENV !== "production");

const Section = ({ title, obj, loading = false, error = null }) => {
  const pretty = useMemo(() => {
    try {
      return JSON.stringify(obj ?? {}, null, 2);
    } catch {
      return String(obj);
    }
  }, [obj]);

  const copy = () => {
    try {
      navigator.clipboard.writeText(pretty);
      message.success(`Copied ${title}`);
    } catch {
      message.error("Copy failed");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <Spin size="large" />
        <div style={{ marginTop: 10 }}>Loading {title}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message={`Error loading ${title}`}
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>{title}</strong>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.isArray(obj) && <span style={{ fontSize: "12px", color: "#666" }}>{obj.length} items</span>}
          <Button size="small" onClick={copy}>Copy</Button>
        </div>
      </div>
      <pre style={{
        margin: 0,
        maxHeight: 360,
        overflow: "auto",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: 12,
        borderRadius: 8,
        fontSize: "11px",
        lineHeight: "1.4"
      }}>{pretty}</pre>
    </div>
  );
};

export default function DevDataInspector({ datasets: initialDatasets = {} }) {
  if (!isDev) return null;

  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState(initialDatasets);
  const [errors, setErrors] = useState({});

  // Smart data fetching using dedicated dev-data endpoint
  const fetchAllData = async () => {
    if (!user?._id) return;

    setLoading(true);
    setErrors({});

    try {
      // Use dedicated dev-data endpoint that aggregates ALL user data (bypasses workspace filtering)
      const response = await WorkspaceService.getDevData();
      const data = response.data || {};

      setDatasets({
        user: data.user || {},
        workspaces: data.workspaces || [],
        vacancies: data.vacancies || [],
        media: data.media || [],
        applications: data.applications || [],
        teams: data.teams || [],
        billing: data.user || {}, // Use user data for billing info
        aggregatedData: data.aggregatedData || {}
      });

      message.success("Data refreshed successfully");
    } catch (err) {
      message.error("Failed to fetch dev data");
      console.error("DevDataInspector fetch error:", err);
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch data when modal opens
  useEffect(() => {
    if (open && user?._id) {
      fetchAllData();
    }
  }, [open, user?._id]);

  // Always calculate aggregatedData with useMemo for consistent hook usage
  const clientAggregatedData = useMemo(() => {
    if (!datasets.user || !datasets.vacancies || !datasets.workspaces) return null;

    const isWorkspaceSession = datasets.user?.isWorkspaceSession;
    const workspaceId = datasets.user?.workspaceId;

    return {
      session: {
        type: isWorkspaceSession ? "workspace" : "main",
        workspaceId: workspaceId || null,
        workspaceName: datasets.user?.workspaceName || null,
        userRole: datasets.user?.workspaceRole || "owner"
      },
      counts: {
        totalVacancies: datasets.vacancies?.length || 0,
        totalMedia: datasets.media?.length || 0,
        totalApplications: datasets.applications?.length || 0,
        totalWorkspaces: datasets.workspaces?.length || 0,
        publishedVacancies: datasets.vacancies?.filter(v => v.published)?.length || 0,
        unpublishedVacancies: datasets.vacancies?.filter(v => !v.published)?.length || 0
      },
      workspaces: datasets.workspaces?.map(ws => ({
        id: ws._id,
        name: ws.name,
        slug: ws.slug,
        role: ws.members?.find(m => m.user === datasets.user?._id)?.role || "owner",
        vacancyCount: datasets.vacancies?.filter(v => v.workspace === ws._id)?.length || 0,
        mediaCount: datasets.media?.filter(m => m.workspace === ws._id)?.length || 0
      })) || []
    };
  }, [datasets]);

  // Use backend aggregatedData if available, otherwise fall back to client calculation
  const aggregatedData = datasets.aggregatedData || clientAggregatedData;

  const tabs = [
    {
      key: "aggregated",
      label: "Overview",
      content: aggregatedData,
      forceRender: true
    },
    {
      key: "user",
      label: `User ${datasets.user?.isWorkspaceSession ? '(Workspace Session)' : '(Main Account)'}`,
      content: datasets.user
    },
    {
      key: "vacancies",
      label: `Vacancies (${datasets.vacancies?.length || 0})`,
      content: datasets.vacancies
    },
    {
      key: "media",
      label: `Media (${datasets.media?.length || 0})`,
      content: datasets.media
    },
    {
      key: "applications",
      label: `Applications (${datasets.applications?.length || 0})`,
      content: datasets.applications
    },
    {
      key: "workspaces",
      label: `Workspaces (${datasets.workspaces?.length || 0})`,
      content: datasets.workspaces
    },
    {
      key: "teams",
      label: `Teams (${datasets.teams?.length || 0})`,
      content: datasets.teams
    },
    {
      key: "billing",
      label: "Billing & Plans",
      content: datasets.billing
    }
  ];

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{ position: "fixed", right: 16, bottom: 16, zIndex: 10000, cursor: "pointer" }}
        title="Dev Data Inspector - Click to inspect all account data"
      >
        <Button type="primary" loading={loading} style={{ borderRadius: 20 }}>
          🔍 Inspector
        </Button>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button onClick={fetchAllData} loading={loading}>
              Refresh All Data
            </Button>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        }
        width={1200}
        title={`Dev Data Inspector - ${datasets.user?.email || 'Loading...'} ${datasets.user?.isWorkspaceSession ? `(Workspace: ${datasets.user?.workspaceName})` : '(Main Account)'}`}
      >
        <Tabs
          defaultActiveKey="aggregated"
          items={tabs.map(t => ({
            key: t.key,
            label: t.label,
            children: (
              <Section
                title={t.label}
                obj={t.content}
                loading={loading && t.key !== 'aggregated'}
                error={errors[t.key]}
              />
            ),
            forceRender: t.forceRender
          }))}
        />
      </Modal>
    </>
  );
}


