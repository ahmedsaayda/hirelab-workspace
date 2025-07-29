import React, { useState } from 'react';
import { Modal, Button, Input, message, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const InitialMessageModal = ({ 
  visible, 
  onCancel, 
  onSend, 
  candidate,
  loading = false 
}) => {
  const [messageText, setMessageText] = useState(
    localStorage.getItem('initialChatMessageTemplate') || 
    `Hello {candidateName}! I'd like to discuss your application for {jobTitle}. Please feel free to ask any questions you may have.`
  );

  const handleSend = () => {
    if (!messageText.trim()) {
      message.error('Please enter a message');
      return;
    }

    // Save template for future use
    localStorage.setItem('initialChatMessageTemplate', messageText);
    
    // Replace variables and send
    const finalMessage = messageText
      .replace(/\{candidateName\}/g, candidate?.fullname || candidate?.email || 'there')
      .replace(/\{jobTitle\}/g, candidate?.jobTitle || 'this position');

    onSend(finalMessage);
  };

  const resetToDefault = () => {
    setMessageText(`Hello {candidateName}! I'd like to discuss your application for {jobTitle}. Please feel free to ask any questions you may have.`);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MessageOutlined className="text-blue-500" />
          <span>Configure Initial Message</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="reset" onClick={resetToDefault}>
          Reset to Default
        </Button>,
        <Button 
          key="send" 
          type="primary" 
          onClick={handleSend}
          loading={loading}
          className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
          style={{
            backgroundColor: '#8B5CF6',
            borderColor: '#8B5CF6',
          }}
        >
          Start Chat
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <Text strong>Customize your initial message to {candidate?.fullname || candidate?.email}</Text>
          <div className="mt-2 mb-4">
            <Text type="secondary" className="text-sm">
              Available variables: <code>{'{candidateName}'}</code> and <code>{'{jobTitle}'}</code>
            </Text>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Template
          </label>
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={6}
            placeholder="Enter your message..."
            className="font-mono"
          />
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <Text strong className="text-sm">Preview:</Text>
          <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
            {messageText
              .replace(/\{candidateName\}/g, candidate?.fullname || candidate?.email || 'John Doe')
              .replace(/\{jobTitle\}/g, candidate?.jobTitle || 'Software Developer')
            }
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-500 mt-0.5">💡</div>
            <Text className="text-sm text-blue-700">
              <strong>Tip:</strong> This message will be automatically sent when you start a chat with the candidate. 
              You can customize it each time or save a template for future use.
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InitialMessageModal; 