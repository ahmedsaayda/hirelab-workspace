import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const InterviewSchedulingMessage = ({
  message,
  isCandidate = false,
  onSelectTime,
  readOnly = false
}) => {
  const { interviewSuggestions = [], senderType } = message;

  const handleTimeSelection = (suggestion) => {
    if (onSelectTime && !readOnly) {
      onSelectTime(suggestion);
    }
  };

  if (!interviewSuggestions || interviewSuggestions.length === 0) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <CalendarOutlined className="text-purple-500" />
          <Text className="text-purple-700 font-medium">Interview Scheduling</Text>
        </div>
        <Text className="text-gray-600">No time suggestions available.</Text>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <CalendarOutlined className="text-purple-500" />
        <Title level={5} className="text-purple-700 mb-0">
          {senderType === 'recruiter' ? 'Interview Time Options' : 'Interview Response'}
        </Title>
      </div>

      <div className="space-y-2">
        {interviewSuggestions.map((suggestion, index) => (
          <Card
            key={index}
            size="small"
            className={`
              transition-all duration-200 
              ${suggestion.selected
                ? 'border-green-500 bg-green-50'
                : readOnly
                  ? 'border-gray-200 cursor-default'
                  : 'border-gray-200 hover:border-purple-400 hover:bg-purple-25 cursor-pointer'
              }
            `}
            onClick={() => !readOnly && !suggestion.selected && !interviewSuggestions.some(s => s.selected) && handleTimeSelection(suggestion)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined
                  className={suggestion.selected ? 'text-green-500' : 'text-purple-500'}
                />
                <div>
                  <Text className="font-medium block">
                    Option {index + 1}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {suggestion.displayText}
                  </Text>
                </div>
              </div>

              {suggestion.selected && (
                <div className="flex items-center gap-1 text-green-600">
                  <Text className="text-sm font-medium">Selected</Text>
                  <span className="text-green-500">✓</span>
                </div>
              )}

              {!readOnly && !suggestion.selected && isCandidate && !interviewSuggestions.some(s => s.selected) && (
                <Button
                  size="small"
                  type="primary"
                  className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
                  style={{
                    backgroundColor: '#8B5CF6',
                    borderColor: '#8B5CF6',
                  }}
                >
                  Select
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isCandidate && !readOnly && !interviewSuggestions.some(s => s.selected) && (
        <div className="mt-3 p-2 bg-purple-25 rounded text-sm">
          <Text className="text-purple-700">
            💡 Click on a time option to select your preferred interview time
          </Text>
        </div>
      )}

      {interviewSuggestions.some(s => s.selected) && (
        <div className="mt-3 p-2 bg-green-25 border border-green-200 rounded text-sm">
          <Text className="text-[#000000]">
            ✅ Interview time confirmed! We'll send you the meeting details soon.
            {isCandidate && " Contact the recruiter if you need to change the time."}
          </Text>
        </div>
      )}
    </div>
  );
};

export default InterviewSchedulingMessage; 