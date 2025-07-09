import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../src/redux/auth/selectors';
import TeamService from '../../../src/services/TeamService';
import { message, Spin, Button, Card } from 'antd';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function JoinTeamPage() {
  const router = useRouter();
  const { inviteLink } = router.query;
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inviteLink) {
      // Store invite link in localStorage and cookie for after authentication
      localStorage.setItem('pendingTeamInvite', inviteLink);
      Cookies.set('pendingTeamInvite', inviteLink, { expires: 1 }); // Expire in 1 day
      console.log('Team join page: Set cookie', inviteLink);
      
      if (user) {
        // User is logged in, try to join the team
        handleJoinTeam();
      } else {
        // User is not logged in, redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        router.push(`/auth/login?returnUrl=${returnUrl}`);
      }
    }
  }, [inviteLink, user]);



  const handleJoinTeam = async () => {
    try {
      setJoining(true);
      const response = await TeamService.joinTeamByLink(inviteLink);
      
      if (response.success) {
        message.success('Successfully joined the team!');
        setJoined(true);
        
        // Set the team as current team
        TeamService.setCurrentTeam(response.team);
        
        // Remove the pending invite
        localStorage.removeItem('pendingTeamInvite');
        Cookies.remove('pendingTeamInvite');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error joining team:', error);
      setError(error.message || 'Failed to join team');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
        <span className="ml-3">Processing team invitation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/auth/login">
              <Button type="primary">Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-500 text-xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">Welcome to the team!</h2>
            <p className="text-gray-600 mb-4">
              You've successfully joined the team. Redirecting to dashboard...
            </p>
            <Spin />
          </div>
        </Card>
      </div>
    );
  }

  if (joining) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center">
            <Spin size="large" />
            <h2 className="text-xl font-semibold mt-4 mb-2">Joining team...</h2>
            <p className="text-gray-600">Please wait while we add you to the team</p>
          </div>
        </Card>
      </div>
    );
  }

  // This component should only be reached by authenticated users
  // since unauthenticated users are redirected to login
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-blue-500 text-xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">Processing Invitation...</h2>
          <p className="text-gray-600 mb-4">
            Please wait while we process your team invitation.
          </p>
          <Spin />
        </div>
      </Card>
    </div>
  );
} 