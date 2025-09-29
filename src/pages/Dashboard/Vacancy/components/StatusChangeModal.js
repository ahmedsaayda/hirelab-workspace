import React, { useState } from 'react';
import { Modal, Select, Button, message, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import CrudService from '../../../../services/CrudService';

const { Option } = Select;
const { Text } = Typography;

const StatusChangeModal = ({ 
  visible, 
  onCancel, 
  candidate, 
  onStatusUpdate 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(candidate?.statusPhase || 'new');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New', color: '#6b7280' },
    { value: 'reviewing', label: 'Under Review', color: '#3b82f6' },
    { value: 'waiting_for_availability', label: 'Waiting for Availability', color: '#eab308' },
    { value: 'availability_received', label: 'Availability Received', color: '#f97316' },
    { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: '#8b5cf6' },
    { value: 'interview_completed', label: 'Interview Completed', color: '#6366f1' },
    { value: 'reference_check', label: 'Reference Check', color: '#06b6d4' },
    { value: 'final_decision', label: 'Final Decision', color: '#ec4899' },
    { value: 'offer_sent', label: 'Offer Sent', color: '#10b981' },
    { value: 'offer_accepted', label: 'Offer Accepted', color: '#22c55e' },
    { value: 'offer_declined', label: 'Offer Declined', color: '#ef4444' },
    { value: 'hired', label: 'Hired', color: '#22c55e' },
    { value: 'rejected', label: 'Rejected', color: '#ef4444' }
  ];

  const handleUpdateStatus = async () => {
    if (!candidate || selectedStatus === candidate.statusPhase) {
      onCancel();
      return;
    }

    setUpdating(true);
    try {
      await CrudService.update('VacancySubmission', candidate.id, {
        statusPhase: selectedStatus,
        statusPhaseUpdatedAt: new Date().toISOString()
      });

      message.success('Status updated successfully');
      
      if (onStatusUpdate) {
        onStatusUpdate(candidate.id, {
          statusPhase: selectedStatus,
          statusPhaseUpdatedAt: new Date().toISOString()
        });
      }
      
      onCancel();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentStatusOption = () => {
    return statusOptions.find(option => option.value === candidate?.statusPhase);
  };

  const getSelectedStatusOption = () => {
    return statusOptions.find(option => option.value === selectedStatus);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <ClockCircleOutlined className="text-blue-500" />
          <div>
            <div className="font-semibold">Change Status</div>
            <div className="text-sm text-gray-500 font-normal">
              {candidate?.fullname || candidate?.email}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <div className="space-y-6">
        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Current Status</div>
          {getCurrentStatusOption() ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getCurrentStatusOption().color }}
              ></div>
              <span className="text-sm font-medium">{getCurrentStatusOption().label}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No status set</span>
          )}
        </div>

        {/* New Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select New Status
          </label>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            className="w-full"
            size="large"
            placeholder="Select a status"
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: option.color }}
                  ></div>
                  <span>{option.label}</span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* Preview */}
        {selectedStatus !== candidate?.statusPhase && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getSelectedStatusOption()?.color }}
              ></div>
              <span className="text-sm font-medium text-gray-800">
                {getSelectedStatusOption()?.label}
              </span>
            </div>
            <Text className="text-xs text-gray-600 mt-1 block">
              This status will be visible on the candidate card
            </Text>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="primary"
            onClick={handleUpdateStatus}
            loading={updating}
            disabled={selectedStatus === candidate?.statusPhase}
            className="hover:!text-white"
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
