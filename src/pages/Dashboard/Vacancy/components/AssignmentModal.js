import React, { useState, useEffect } from 'react';
import { Modal, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import TeamService from '../../../../services/TeamService';
import ATSService from '../../../../services/ATSService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';

// Trello-like styling for the assignment modal
const trelloModalStyles = `
  .trello-assignment-modal .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .trello-assignment-modal .ant-modal-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #e1e4e8;
    background: #f8f9fa;
  }
  
  .trello-assignment-modal .ant-modal-title {
    font-size: 14px;
    font-weight: 600;
    color: #172b4d;
  }
  
  .trello-assignment-modal .ant-modal-body {
    padding: 0;
  }
  
  .trello-assignment-modal .ant-modal-close {
    top: 12px;
    right: 12px;
  }
  
  .trello-assignment-modal .ant-modal-close-x {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: #6b778c;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#trello-assignment-modal-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'trello-assignment-modal-styles';
  styleSheet.textContent = trelloModalStyles;
  document.head.appendChild(styleSheet);
}

const AssignmentModal = ({ 
  visible, 
  onCancel, 
  candidate, 
  onAssignmentUpdate,
  currentTeam 
}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (visible && currentTeam?._id) {
      loadTeamMembers();
    }
  }, [visible, currentTeam]);



  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await TeamService.getTeamMembers(currentTeam._id);
      setTeamMembers(response.members || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleUnassign = async () => {
    setAssigning(true);
    try {
      const response = await ATSService.unassignCandidateFromTeamMember(candidate.id);
      
      if (onAssignmentUpdate) {
        onAssignmentUpdate(candidate.id, {
          assignedTo: null,
          assignedAt: null,
          assignedBy: null
        });
      }
      
      onCancel();
    } catch (error) {
      console.error('Error unassigning candidate:', error);
    } finally {
      setAssigning(false);
    }
  };

  const getCurrentAssignment = () => {
    if (!candidate?.assignedTo) return null;
    
    const assignedMember = teamMembers.find(
      member => member.user._id === (candidate.assignedTo._id || candidate.assignedTo)
    );
    
    return assignedMember;
  };

  const currentlyAssigned = getCurrentAssignment();

  const handleMemberClick = async (memberId) => {
    if (assigning) return;
    
    // If clicking the same member that's already assigned, unassign
    if (candidate?.assignedTo?._id === memberId || candidate?.assignedTo === memberId) {
      await handleUnassign();
    } else {
      // Assign to the clicked member
      setAssigning(true);
      try {
        const response = await ATSService.assignCandidateToTeamMember(
          candidate.id, 
          memberId
        );
        
        if (onAssignmentUpdate) {
          onAssignmentUpdate(candidate.id, {
            assignedTo: response.data.candidate.assignedTo,
            assignedAt: response.data.candidate.assignedAt,
            assignedBy: response.data.candidate.assignedBy
          });
        }
        
        onCancel();
      } catch (error) {
        console.error('Error assigning candidate:', error);
      } finally {
        setAssigning(false);
      }
    }
  };

  return (
    <Modal
      title="Members"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={340}
      className="trello-assignment-modal"
    >
      <div className="p-2">
        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search members"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Board members section */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Board members</h4>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : (
            <div className="space-y-1">
              {teamMembers.map((member) => {
                const isAssigned = candidate?.assignedTo?._id === member.user._id || candidate?.assignedTo === member.user._id;
                return (
                  <div
                    key={member.user._id}
                    onClick={() => handleMemberClick(member.user._id)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      isAssigned 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    } ${assigning ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="relative">
                      <Avatar 
                        src={member.user.avatar} 
                        icon={<UserOutlined />} 
                        size={32}
                        className="border-2 border-white shadow-sm"
                      />
                      {isAssigned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {member.user.firstName} {member.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {member.user.email}
                      </div>
                    </div>
                    {member.role === 'owner' && (
                      <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Owner
                      </div>
                    )}
                  </div>
                );
              })}
              
              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No team members found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Currently assigned info */}
        {currentlyAssigned && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Currently assigned to:</div>
            <div className="flex items-center gap-2 text-sm">
              <Avatar 
                src={currentlyAssigned.user.avatar} 
                icon={<UserOutlined />} 
                size={20}
              />
              <span className="font-medium">
                {currentlyAssigned.user.firstName} {currentlyAssigned.user.lastName}
              </span>
            </div>
            {candidate.assignedAt && (
              <div className="text-xs text-gray-400 mt-1">
                Assigned {new Date(candidate.assignedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignmentModal; 