import React, { useState } from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useWorkspace } from '../contexts/WorkspaceContext';

const WorkspaceReturnButton = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { returnToMainSmart } = useWorkspace();

  const handleReturn = async () => {
    setLoading(true);
    try {
      await returnToMainSmart();
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
