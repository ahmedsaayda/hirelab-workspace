import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Spin, Alert, Button, Card, Typography } from "antd";
import Cookies from "js-cookie";
import { useWorkspace } from "../../src/contexts/WorkspaceContext";
import PublicService from "../../src/services/PublicService";
import { SlimLayout } from "../../src/pages/Landing/SlimLayout";
import { Logo } from "../../src/pages/Landing/Logo";

const { Title, Paragraph } = Typography;

const WorkspaceInvitationPage = () => {
  const router = useRouter();
  const { token, workspace: workspaceId, email } = router.query;
  const {
    acceptWorkspaceInvitation,
    declineWorkspaceInvitation,
    loading,
    refreshAccessibleWorkspaces,
  } = useWorkspace();

  const [status, setStatus] = useState("pending"); // pending | accepted | declined | error | awaitingAuth
  const [error, setError] = useState(null);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [fetchingInvite, setFetchingInvite] = useState(true);
  const [autoAcceptAttempted, setAutoAcceptAttempted] = useState(false);

  const persistInviteContext = useCallback(() => {
    if (!token || !email) return;
    const context = {
      token,
      email,
      workspaceId,
      redirectTo: router.asPath,
      timestamp: Date.now(),
    };
    localStorage.setItem("workspaceInvite", JSON.stringify(context));
    Cookies.set("workspaceInvite", JSON.stringify(context), { expires: 1 });
  }, [token, email, workspaceId, router.asPath]);

  // Fetch invite metadata from backend for better UX
  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!token) {
        setStatus("error");
        setError("No invitation token provided");
        setFetchingInvite(false);
        return;
      }

      try {
        const response = await PublicService.fetchWorkspaceInvitationMeta(token);
        setInviteDetails(response.data);
        setStatus("pending");
        persistInviteContext();
      } catch (err) {
        console.error("Error validating invitation:", err);
        setInviteDetails(null);
        setStatus("error");
        setError(err.response?.data?.message || "This invitation is invalid or has already been processed.");
      } finally {
        setFetchingInvite(false);
      }
    };

    fetchInviteDetails();
  }, [token, persistInviteContext]);

  const handleAccept = useCallback(async () => {
    if (!token) return;
    setStatus("accepting");
    setError(null);
    try {
      await acceptWorkspaceInvitation(token);
      await refreshAccessibleWorkspaces();

      // Clean up stored invitation context
      localStorage.removeItem("workspaceInvite");
      Cookies.remove("workspaceInvite");

      setStatus("accepted");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError(err.response?.data?.message || err.message || "Failed to accept invitation");
      setStatus("error");
    }
  }, [token, acceptWorkspaceInvitation, refreshAccessibleWorkspaces]);

  const handleDecline = useCallback(async () => {
    if (!token) return;
    setStatus("declining");
    setError(null);
    try {
      await declineWorkspaceInvitation(token);
      await refreshAccessibleWorkspaces();
      setStatus("declined");
    } catch (err) {
      console.error("Error declining invitation:", err);
      setError(err.response?.data?.message || err.message || "Failed to decline invitation");
      setStatus("error");
    }
  }, [token, declineWorkspaceInvitation, refreshAccessibleWorkspaces]);

  const handleAuthenticate = useCallback(() => {
    if (!token || !email) return;
    persistInviteContext();
    const returnUrl = encodeURIComponent(router.asPath);
    router.push(`/auth/login?returnUrl=${returnUrl}`);
  }, [router, token, email, persistInviteContext]);

  const isAuthenticated = !!Cookies.get("accessToken");

  // Auto-accept invitation when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && inviteDetails && status === "pending" && !autoAcceptAttempted) {
      // Check if user came from email link (has stored context)
      const context = localStorage.getItem("workspaceInvite") || Cookies.get("workspaceInvite");
      if (context) {
        try {
          const parsed = JSON.parse(context);
          if (parsed.token === token) {
            // User came from email link, auto-accept the invitation
            setAutoAcceptAttempted(true);
            handleAccept();
          }
        } catch (error) {
          console.error("Error parsing invitation context:", error);
        }
      }
    }
  }, [isAuthenticated, inviteDetails, status, token, autoAcceptAttempted, handleAccept]);

  useEffect(() => {
    if (status === "accepted") {
      const timer = setTimeout(() => {
        const context = localStorage.getItem("workspaceInvite");
        if (context) {
          const parsed = JSON.parse(context);
          if (parsed.workspaceId) {
            router.push(`/dashboard?workspace=${parsed.workspaceId}`);
            return;
          }
        }
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const renderContent = () => {
    if (fetchingInvite) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <Paragraph>Loading invitation…</Paragraph>
        </div>
      );
    }

    if (!isAuthenticated) {
    return (
      <Alert
        message="Sign in to continue"
        description={
          <div className="space-y-3">
            <Paragraph>
              You need to log in or create an account with {email} to accept this invitation.
            </Paragraph>
            <div className="flex justify-center gap-3">
              <Button type="primary" onClick={handleAuthenticate}>Log in</Button>
              <Button
                onClick={() => {
                  persistInviteContext();
                  router.push(`/auth/register?returnUrl=${encodeURIComponent(router.asPath)}`);
                }}
              >
                Sign up
              </Button>
            </div>
          </div>
        }
        type="info"
        showIcon
      />
    );
    }

    if (status === "pending" || status === "accepting" || status === "declining") {
      return (
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <Paragraph>
            {status === "pending" && autoAcceptAttempted
              ? "Accepting workspace invitation..."
              : status === "pending"
              ? "Review the invitation details below."
              : status === "accepting"
              ? "Accepting invitation..."
              : "Declining invitation..."}
          </Paragraph>
        </div>
      );
    }

    if (status === "accepted") {
      return (
        <Alert
          message="Invitation accepted"
          description="Access granted. Redirecting you into the workspace..."
          type="success"
          showIcon
        />
      );
    }

    if (status === "declined") {
      return (
        <Alert
          message="Invitation declined"
          description="You have declined the workspace invitation."
          type="info"
          showIcon
        />
      );
    }

    return (
      <Alert
        message="Invitation error"
        description={error || "There was a problem processing your invitation."}
        type="error"
        showIcon
      />
    );
  };

  return (
    <SlimLayout>
      <div className="flex justify-center">
        <Logo className="w-auto h-10" black />
      </div>
      <div className="max-w-3xl mx-auto py-8">
        <Card className="shadow-lg">
          <div className="space-y-4 text-center">
            <Title level={2}>Workspace Invitation</Title>
            {inviteDetails?.workspace && (
              <Paragraph>
                Workspace: <strong>{inviteDetails.workspace.name}</strong>
              </Paragraph>
            )}
            {inviteDetails?.role && (
              <Paragraph>Role: <strong>{inviteDetails.role}</strong></Paragraph>
            )}
            {email && (
              <Paragraph>Invited email: <strong>{email}</strong></Paragraph>
            )}
            {renderContent()}
            {isAuthenticated && status === "pending" && (
              <div className="flex justify-center gap-3 pt-4">
                <Button type="primary" onClick={handleAccept} loading={loading}>
                  Accept Invitation
                </Button>
                <Button danger onClick={handleDecline} loading={loading}>
                  Decline Invitation
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </SlimLayout>
  );
};

export default WorkspaceInvitationPage;
