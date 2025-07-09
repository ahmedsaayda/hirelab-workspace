import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { selectUser } from "../../../src/redux/auth/selectors";
import TeamService from "../../../src/services/TeamService";
import { Button } from "../../../src/pages/Landing/Button";
import { Logo } from "../../../src/pages/Landing/Logo";
import { SlimLayout } from "../../../src/pages/Landing/SlimLayout";
import Cookies from 'js-cookie';

export default function InvitationPage() {
  const router = useRouter();
  const { token } = router.query;
  const user = useSelector(selectUser);
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    
    // Store invitation token in localStorage and cookie for after authentication
    localStorage.setItem('pendingInvitation', token);
    Cookies.set('pendingInvitation', token, { expires: 1 }); // Expire in 1 day
    console.log('Team invitation page: Set cookie', token);
    
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      const response = await TeamService.getInvitationDetails(token);
      setInvitation(response.invitation);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      setError("Invalid or expired invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user) {
      // Store invitation token and redirect to login
      localStorage.setItem("pendingInvitation", token);
      Cookies.set('pendingInvitation', token, { expires: 1 });
      console.log("Invitation: Storing pending invitation for auth", token);
      router.push("/auth/login");
      return;
    }

    try {
      setAccepting(true);
      const response = await TeamService.acceptInvitation(token);
      
      // Update localStorage with the new team
      if (response.success && response.team) {
        TeamService.setCurrentTeam(response.team);
        console.log("🔥 Set new current team after accepting invitation:", response.team.name);
      }
      
      // Clean up pending invitation
      localStorage.removeItem("pendingInvitation");
      Cookies.remove("pendingInvitation");
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError("Failed to accept invitation. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!user) {
      router.push("/dashboard");
      return;
    }

    try {
      await TeamService.declineInvitation(token);
      
      // Clean up pending invitation
      localStorage.removeItem("pendingInvitation");
      Cookies.remove("pendingInvitation");
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error declining invitation:", error);
      // Even if decline fails, go back to dashboard
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Logo className="h-10 w-auto mx-auto" black />
          </div>
          <div className="text-gray-600">Loading invitation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col">
        <SlimLayout>
          <div className="flex justify-center">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" black />
            </Link>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mt-8">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Invitation Not Found
            </h2>
            <p className="mt-2 text-gray-600">
              {error}
            </p>
            <div className="mt-6">
              <Link href="/auth/login">
                <Button
                  variant="solid"
                  color="blue"
                  className="w-full"
                >
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </SlimLayout>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" black />
          </Link>
        </div>
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mt-8">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            You're invited to join {invitation?.team?.name}
          </h2>
          
          <p className="mt-2 text-gray-600">
            {invitation?.invitedBy?.firstName} {invitation?.invitedBy?.lastName} has invited you to join their team on HireLab.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Team Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Team:</span> {invitation?.team?.name}
              </div>
              <div>
                <span className="font-medium">Role:</span> {invitation?.role}
              </div>
              <div>
                <span className="font-medium">Invited by:</span> {invitation?.invitedBy?.firstName} {invitation?.invitedBy?.lastName}
              </div>
              {invitation?.team?.description && (
                <div>
                  <span className="font-medium">Description:</span> {invitation?.team?.description}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleAcceptInvitation}
              variant="solid"
              color="blue"
              className="w-full"
              loading={accepting}
            >
              {user ? "Accept Invitation" : "Sign in to Accept"}
            </Button>
            
            {user && (
              <Button
                onClick={handleDeclineInvitation}
                variant="outline"
                color="gray"
                className="w-full"
              >
                Decline Invitation
              </Button>
            )}
            
            {!user && (
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <Link 
                  href="/auth/register" 
                  className="font-medium text-blue-600 hover:underline ml-1"
                  onClick={() => {
                    localStorage.setItem("pendingInvitation", token);
                    Cookies.set('pendingInvitation', token, { expires: 1 });
                  }}
                >
                  Sign up
                </Link>
              </p>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What you'll be able to do:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Access team landing pages ({invitation?.permissions?.landingPages})</li>
              <li>• Access team media library ({invitation?.permissions?.mediaLibrary})</li>
              {invitation?.permissions?.teamManagement !== 'none' && (
                <li>• Manage team members ({invitation?.permissions?.teamManagement})</li>
              )}
            </ul>
          </div>
        </div>
      </SlimLayout>
    </div>
  );
} 