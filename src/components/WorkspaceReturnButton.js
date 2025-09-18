import React, { useState } from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, ApartmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../redux/auth/actions';

const WorkspaceReturnButton = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleReturn = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post(
        `${BASE_URL}/workspaces/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cookies with new tokens
      Cookies.set('accessToken', response.data.accessToken);
      Cookies.set('refreshToken', response.data.refreshToken);

      // Update Redux store
      dispatch(login(response.data.user));

      message.success('Returned to main account successfully!');
      
      // Redirect to workspaces page
      window.location.href = '/dashboard/workspaces';
    } catch (error) {
      console.error('Error returning from workspace:', error);
      message.error('Failed to return from workspace');
    } finally {
      setLoading(false);
    }
  };

  // Only show if user is in workspace session
  if (!user?.isWorkspaceSession) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <ApartmentOutlined />
          <span className="text-sm font-medium">Workspace Mode</span>
        </div>
        <div className="text-xs opacity-90 mb-2">
          Working as: {user.workspaceName || 'Workspace'}
        </div>
        <Button
          type="primary"
          size="small"
          icon={<ArrowLeftOutlined />}
          onClick={handleReturn}
          loading={loading}
          className="w-full"
        >
          Return to Main Account
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceReturnButton;
