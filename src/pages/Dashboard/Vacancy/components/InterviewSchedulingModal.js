import React, { useState } from 'react';
import { Modal, DatePicker, TimePicker, Button, Form, message, Space, Typography, Card } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const InterviewSchedulingModal = ({ 
  visible, 
  onCancel, 
  onSchedule, 
  candidate,
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [suggestions, setSuggestions] = useState([
    { date: null, time: null },
    { date: null, time: null },
    { date: null, time: null }
  ]);

  const handleSuggestionChange = (index, field, value) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index][field] = value;
    setSuggestions(newSuggestions);
  };

  const removeSuggestion = (index) => {
    if (suggestions.length <= 1) {
      message.warning('You must provide at least one time suggestion');
      return;
    }
    const newSuggestions = suggestions.filter((_, i) => i !== index);
    setSuggestions(newSuggestions);
  };

  const addSuggestion = () => {
    if (suggestions.length >= 5) {
      message.warning('Maximum 5 time suggestions allowed');
      return;
    }
    setSuggestions([...suggestions, { date: null, time: null }]);
  };

  const handleSubmit = () => {
    // Validate that at least one complete suggestion is provided
    const validSuggestions = suggestions.filter(s => s.date && s.time);
    
    if (validSuggestions.length === 0) {
      message.error('Please provide at least one complete date and time suggestion');
      return;
    }

    // Format suggestions for sending
    const formattedSuggestions = validSuggestions.map(s => ({
      date: s.date.format('YYYY-MM-DD'),
      time: s.time.format('HH:mm'),
      datetime: moment(`${s.date.format('YYYY-MM-DD')} ${s.time.format('HH:mm')}`).toISOString(),
      displayText: `${s.date.format('dddd, MMMM Do')} at ${s.time.format('h:mm A')}`
    }));

    onSchedule(formattedSuggestions);
  };

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < moment().startOf('day');
  };

  const disabledTime = (current) => {
    // Disable past times for today
    if (current && current.isSame(moment(), 'day')) {
      const now = moment();
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < now.hour(); i++) {
            hours.push(i);
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour === now.hour()) {
            const minutes = [];
            for (let i = 0; i <= now.minute(); i++) {
              minutes.push(i);
            }
            return minutes;
          }
          return [];
        }
      };
    }
    return {};
  };

  const handleCancel = () => {
    setSuggestions([
      { date: null, time: null },
      { date: null, time: null },
      { date: null, time: null }
    ]);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-blue-500" />
          <span>Schedule Interview</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="schedule" 
          type="primary" 
          onClick={handleSubmit}
          loading={loading}
          icon={<CalendarOutlined />}
          className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
          style={{
            backgroundColor: '#8B5CF6',
            borderColor: '#8B5CF6',
          }}
        >
          Send Interview Suggestions
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <div className="mb-4">
        <Text type="secondary">
          Send interview time suggestions to <strong>{candidate?.fullname || candidate?.email}</strong>. 
          They will be able to select their preferred time from the options you provide.
        </Text>
      </div>

      <div className="space-y-4">
        <Title level={5}>Interview Time Suggestions:</Title>
        
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            size="small" 
            className="border-gray-200"
            title={`Option ${index + 1}`}
            extra={
              suggestions.length > 1 && (
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />}
                  onClick={() => removeSuggestion(index)}
                  className="text-red-500 hover:text-red-700"
                />
              )
            }
          >
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Text className="block mb-1 text-xs text-gray-600">Date</Text>
                <DatePicker
                  value={suggestion.date}
                  onChange={(date) => handleSuggestionChange(index, 'date', date)}
                  disabledDate={disabledDate}
                  placeholder="Select date"
                  className="w-full"
                  format="dddd, MMMM Do, YYYY"
                />
              </div>
              <div className="flex-1">
                <Text className="block mb-1 text-xs text-gray-600">Time</Text>
                <TimePicker
                  value={suggestion.time}
                  onChange={(time) => handleSuggestionChange(index, 'time', time)}
                  placeholder="Select time"
                  className="w-full"
                  format="h:mm A"
                  use12Hours
                  minuteStep={15}
                  disabledTime={() => disabledTime(suggestion.date)}
                />
              </div>
            </div>
            
            {suggestion.date && suggestion.time && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <ClockCircleOutlined className="text-blue-500 mr-1" />
                {suggestion.date.format('dddd, MMMM Do')} at {suggestion.time.format('h:mm A')}
              </div>
            )}
          </Card>
        ))}

        {suggestions.length < 5 && (
          <Button 
            type="dashed" 
            onClick={addSuggestion}
            icon={<CalendarOutlined />}
            className="w-full"
          >
            Add Another Time Option
          </Button>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <Text className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Provide 2-3 time options to give the candidate flexibility. 
          They'll receive these suggestions in the chat and can select their preferred time.
        </Text>
      </div>
    </Modal>
  );
};

export default InterviewSchedulingModal; 