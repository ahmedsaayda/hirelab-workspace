import React, { useState } from 'react';
import { Modal, DatePicker, TimePicker, Button, Form, message, Space, Typography, Card, Input } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
  
  // Message template configuration
  const [messageConfigModal, setMessageConfigModal] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState(
    localStorage.getItem('interviewMessageTemplate') || 
    `🗓️ Interview Invitation

Hi {candidateName},

We would like to schedule an interview with you! Please select one of the following available times:

{timeOptions}

Please reply with your preferred option, and we'll send you the meeting details.

Looking forward to speaking with you!`
  );

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

    // Pass both suggestions and template to parent
    onSchedule(formattedSuggestions, messageTemplate);
  };

  const handleSaveMessageTemplate = () => {
    localStorage.setItem('interviewMessageTemplate', messageTemplate);
    setMessageConfigModal(false);
    message.success('Interview message template saved!');
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
    <>
      <Modal
        title={
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" />
              <span>Schedule Interview</span>
            </div>
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => setMessageConfigModal(true)}
              className="text-gray-500 hover:text-blue-500"
              title="Configure message template"
            />
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
          <Title level={5} className="mb-3 flex items-center gap-2">
            <CalendarOutlined className="text-purple-500" />
            Interview Time Suggestions
          </Title>

          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              size="small" 
              className="border border-gray-200 hover:border-purple-300 transition-colors"
              bodyStyle={{ padding: '16px' }}
              title={
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Option {index + 1}</span>
                  {suggestions.length > 1 && (
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeSuggestion(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    />
                  )}
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                  <DatePicker
                    value={suggestion.date}
                    onChange={(date) => handleSuggestionChange(index, 'date', date)}
                    disabledDate={disabledDate}
                    placeholder="Select date"
                    className="w-full"
                    format="MMMM DD, YYYY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                  <TimePicker
                    value={suggestion.time}
                    onChange={(time) => handleSuggestionChange(index, 'time', time)}
                    disabledTime={() => disabledTime(suggestion.date)}
                    placeholder="Select time"
                    className="w-full"
                    format="h:mm A"
                    use12Hours
                  />
                </div>
              </div>
            </Card>
          ))}

          {suggestions.length < 5 && (
            <Button
              type="dashed"
              onClick={addSuggestion}
              className="w-full border-purple-300 text-purple-600 hover:border-purple-500 hover:text-purple-700"
              icon={<CalendarOutlined />}
            >
              Add Another Time Option
            </Button>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <div className="text-purple-500 mt-0.5">💡</div>
              <Text className="text-sm text-purple-700">
                <strong>Tip:</strong> Provide 2-3 time options to give the candidate flexibility. They'll receive these suggestions in the chat and can select their preferred time.
              </Text>
            </div>
          </div>
        </div>
      </Modal>

      {/* Message Template Configuration Modal */}
      <Modal
        title="Configure Interview Message Template"
        open={messageConfigModal}
        onCancel={() => setMessageConfigModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setMessageConfigModal(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveMessageTemplate} className="hover:!text-white">
            Save Template
          </Button>
        ]}
        width={600}
      >
        <div className="space-y-4">
          <div>
            <Text strong>Customize your interview invitation message</Text>
            <div className="mt-2 mb-4">
                             <Text type="secondary" className="text-sm">
                 Available variables: <code>{'{candidateName}'}</code> and <code>{'{timeOptions}'}</code>
               </Text>
            </div>
          </div>
          
          <TextArea
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            rows={8}
            placeholder="Enter your interview message template..."
            className="font-mono"
          />
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <Text strong className="text-sm">Preview:</Text>
                         <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
               {messageTemplate
                 .replace(/\{candidateName\}/g, candidate?.fullname || 'John Doe')
                 .replace(/\{timeOptions\}/g, 'Option 1: Monday, January 15th at 2:00 PM\nOption 2: Tuesday, January 16th at 10:00 AM')
               }
             </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InterviewSchedulingModal; 