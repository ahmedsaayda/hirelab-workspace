import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { message, Spin, Select, Modal } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import MetaService from "../../services/MetaService";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Unplug,
  Plug,
  ArrowLeft,
} from "lucide-react";

const Integrations = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const { workspaceSession, currentWorkspace } = useWorkspace();

  // Get return URL from query params (passed when coming from Ads page)
  const returnUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("returnUrl") || null;
  }, []);

  // Meta connection state
  const [metaStatus, setMetaStatus] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [assets, setAssets] = useState({ adAccounts: [], pages: [], instagramByPageId: {} });
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [selectedAdAccount, setSelectedAdAccount] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Get the workspace ID if in workspace context
  const workspaceId = workspaceSession?.workspaceId || currentWorkspace?._id || null;

  // Load Meta connection status
  const loadMetaStatus = useCallback(async () => {
    setMetaLoading(true);
    try {
      const resp = await MetaService.getStatus(workspaceId);
      const data = resp?.data?.data || {};
      setMetaStatus(data);

      // If connected, load assets
      if (data.connected) {
        setSelectedAdAccount(data.adAccountId || null);
        setSelectedPage(data.pageId || null);
        loadAssets();
      }
    } catch (e) {
      console.error("Failed to load Meta status:", e);
      setMetaStatus({ connected: false });
    } finally {
      setMetaLoading(false);
    }
  }, [workspaceId]);

  // Load Meta assets (ad accounts, pages)
  const loadAssets = useCallback(async () => {
    setAssetsLoading(true);
    try {
      const resp = await MetaService.listAssets(workspaceId);
      const data = resp?.data?.data || {};
      setAssets({
        adAccounts: data.adAccounts || [],
        pages: data.pages || [],
        instagramByPageId: data.instagramByPageId || {},
      });
    } catch (e) {
      console.error("Failed to load Meta assets:", e);
      message.error("Failed to load Meta assets");
    } finally {
      setAssetsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadMetaStatus();
  }, [loadMetaStatus]);

  // Check for OAuth callback success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("meta_success") === "true") {
      message.success("Meta connected successfully!");
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
      loadMetaStatus();
    }
  }, [loadMetaStatus]);

  // Connect to Meta
  const handleConnectMeta = async () => {
    try {
      const returnUrl = `${window.location.origin}/dashboard/integrations`;
      const resp = await MetaService.getAuthUrl(workspaceId, returnUrl);
      const url = resp?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        message.error("Failed to get Meta auth URL");
      }
    } catch (e) {
      console.error("Failed to initiate Meta connection:", e);
      message.error(e?.response?.data?.message || "Failed to connect to Meta");
    }
  };

  // Disconnect from Meta
  const handleDisconnectMeta = async () => {
    setDisconnecting(true);
    try {
      await MetaService.disconnect(workspaceId);
      setMetaStatus({ connected: false });
      setAssets({ adAccounts: [], pages: [], instagramByPageId: {} });
      setSelectedAdAccount(null);
      setSelectedPage(null);
      message.success("Meta disconnected successfully");
      setShowDisconnectModal(false);
    } catch (e) {
      console.error("Failed to disconnect Meta:", e);
      message.error("Failed to disconnect from Meta");
    } finally {
      setDisconnecting(false);
    }
  };

  // Save selected assets
  const handleSaveAssets = async () => {
    if (!selectedAdAccount || !selectedPage) {
      message.warning("Please select both an Ad Account and a Page");
      return;
    }
    setSaving(true);
    try {
      const igActorId = assets.instagramByPageId[selectedPage] || null;
      await MetaService.saveAssets({
        workspaceId,
        adAccountId: selectedAdAccount,
        pageId: selectedPage,
        instagramActorId: igActorId,
      });
      message.success("Meta settings saved successfully");
      // Refresh status to confirm
      loadMetaStatus();
    } catch (e) {
      console.error("Failed to save Meta assets:", e);
      message.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Check if settings have changed
  const hasChanges =
    metaStatus?.connected &&
    (selectedAdAccount !== metaStatus?.adAccountId ||
      selectedPage !== metaStatus?.pageId);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back button when coming from another page */}
      {returnUrl && (
        <button
          onClick={() => window.location.href = decodeURIComponent(returnUrl)}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ads
        </button>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h1>
      <p className="text-gray-600 mb-8">
        Connect your external accounts to enable advanced features.
      </p>

      {/* Meta / Facebook Ads Integration */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                  fill="#1877F2"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Meta Ads (Facebook & Instagram)
              </h2>
              <p className="text-sm text-gray-500">
                Connect your Meta Business account to create and manage ad
                campaigns.
              </p>
            </div>
            {metaLoading ? (
              <Spin size="small" />
            ) : metaStatus?.connected ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Not connected</span>
              </div>
            )}
          </div>
        </div>

        {!metaLoading && (
          <div className="p-6">
            {!metaStatus?.connected ? (
              /* Not Connected State */
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <Plug className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Connect your Meta Business account
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  To create ad campaigns on Facebook and Instagram, you need to
                  connect your Meta Business account and select an Ad Account
                  and Page.
                </p>
                <button
                  onClick={handleConnectMeta}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    />
                  </svg>
                  Connect with Meta
                </button>
              </div>
            ) : (
              /* Connected State */
              <div className="space-y-6">
                {/* Connection info */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800">
                      Connected via{" "}
                      <span className="font-medium">
                        {metaStatus?.via === "workspace"
                          ? "Workspace"
                          : metaStatus?.via === "user"
                          ? "Personal Account"
                          : "System"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleConnectMeta}
                    className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reconnect
                  </button>
                </div>

                {/* Assets warning if not configured */}
                {(!metaStatus?.adAccountId || !metaStatus?.pageId) && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Configuration Required
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Please select an Ad Account and Page below to complete
                        your setup.
                      </p>
                    </div>
                  </div>
                )}

                {/* Asset Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ad Account */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Account
                    </label>
                    <Select
                      className="w-full"
                      placeholder="Select an Ad Account"
                      loading={assetsLoading}
                      value={selectedAdAccount ? String(selectedAdAccount).replace("act_", "") : null}
                      onChange={(val) => setSelectedAdAccount(val ? String(val).replace("act_", "") : null)}
                      options={assets.adAccounts.map((acc) => {
                        const accountId = acc.account_id || String(acc.id || "").replace("act_", "");
                        return {
                          value: accountId,
                          label: `${acc.name || accountId || "Unnamed"} (${acc.currency || "USD"})`,
                        };
                      })}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                    {selectedAdAccount && (
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {String(selectedAdAccount).replace("act_", "")}
                      </p>
                    )}
                  </div>

                  {/* Page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Page
                    </label>
                    <Select
                      className="w-full"
                      placeholder="Select a Page"
                      loading={assetsLoading}
                      value={selectedPage}
                      onChange={setSelectedPage}
                      options={assets.pages.map((page) => ({
                        value: page.id,
                        label: page.name || "Unnamed Page",
                      }))}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                    {selectedPage && assets.instagramByPageId[selectedPage] && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-purple-600">
                          Instagram connected
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Save / Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Unplug className="w-4 h-4" />
                    Disconnect Meta
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={loadAssets}
                      disabled={assetsLoading}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          assetsLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </button>
                    <button
                      onClick={handleSaveAssets}
                      disabled={!hasChanges && metaStatus?.adAccountId && metaStatus?.pageId}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        hasChanges || !metaStatus?.adAccountId || !metaStatus?.pageId
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {saving ? (
                        <Spin size="small" />
                      ) : (
                        "Save Settings"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disconnect Confirmation Modal */}
      <Modal
        open={showDisconnectModal}
        onCancel={() => setShowDisconnectModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <Unplug className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Disconnect Meta?
          </h3>
          <p className="text-gray-500 mb-6">
            This will remove your Meta connection. You won't be able to create
            or manage ad campaigns until you reconnect.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDisconnectModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnectMeta}
              disabled={disconnecting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              {disconnecting ? <Spin size="small" /> : "Disconnect"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;

