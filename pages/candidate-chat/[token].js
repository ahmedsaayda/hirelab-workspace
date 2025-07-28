import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Spin, message, Avatar } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { getBackendUrl } from '../../src/services/getBackendUrl';
import { LinkifiedText } from '../../src/utils/linkUtils';
import ChatFileUpload from '../../src/components/ChatFileUpload';
import ChatAttachments from '../../src/components/ChatAttachments';
import InterviewSchedulingMessage from '../../src/components/InterviewSchedulingMessage';
import UploadService from '../../src/services/UploadService';
import '../../src/styles/chat-fix.css';

const { TextArea } = Input;

const CandidateChatPage = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  // Load chat data
  const loadChat = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${getBackendUrl()}/candidateChat/candidate/${token}`);
      console.log('🔍 Frontend loadChat Debug:');
      console.log('- Full response data:', JSON.stringify(response.data, null, 2));
      console.log('- Chat object:', response.data.chat);
      console.log('- Company logo value:', response.data.chat?.companyLogo);
      setChat(response.data.chat);
    } catch (error) {
      console.error('Error loading chat:', error);
      if (error.response?.status === 401) {
        setError('Invalid or expired link. Please contact the recruiter for a new link.');
      } else {
        setError('Failed to load chat. Please try again later.');
      }
    }
  };

  // Load messages
  const loadMessages = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${getBackendUrl()}/candidateChat/candidate/${token}/messages`);
      setMessages(response.data.messages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() && pendingAttachments.length === 0) return;
    if (!token) return;

    setSendingMessage(true);
    
    // Filter valid attachments (must have fileUrl)
    const validAttachments = pendingAttachments.filter(att => 
      att.fileUrl && att.fileName && att.fileType
    );
    
    if (validAttachments.length !== pendingAttachments.length) {
      console.warn('Some attachments were invalid and filtered out:', {
        original: pendingAttachments,
        valid: validAttachments
      });
    }
    
    // Determine message type
    let messageType = 'text';
    if (validAttachments.length > 0) {
      const hasImages = validAttachments.some(att => att.fileType && att.fileType.startsWith('image/'));
      messageType = hasImages ? 'image' : 'file';
    }

    const tempMessage = {
      _id: Date.now(),
      senderType: 'candidate',
      message: messageText,
      messageType,
      attachments: validAttachments,
      candidateName: chat?.candidateName || 'You',
      createdAt: new Date(),
      temp: true
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = messageText;
    const attachmentsToSend = [...validAttachments];
    setMessageText('');
    setPendingAttachments([]);
    
    setTimeout(scrollToBottom, 10);

    try {
      const response = await axios.post(`${getBackendUrl()}/candidateChat/candidate/${token}/send`, {
        message: messageToSend,
        attachments: attachmentsToSend,
        candidateName: chat?.candidateName
      });

      if (response.data.success) {
        // Remove temp message and add real one
        setMessages(prev => prev.filter(m => !m.temp).concat([response.data.message]));
        message.success('Message sent!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message. Please try again.');
      // Remove temp message on error
      setMessages(prev => prev.filter(m => !m.temp));
      // Restore attachments on error
      setPendingAttachments(attachmentsToSend);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle file uploads
  const handleFilesUploaded = (uploadedFiles) => {
    setPendingAttachments(prev => [...prev, ...uploadedFiles]);
  };

  // Handle paste events for image pasting
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      
      // Upload the pasted images immediately
      try {
        message.loading('Uploading pasted image(s)...', 0);
        
        const uploadPromises = imageFiles.map(async (file) => {
          const response = await UploadService.uploadForChat(file, 10);
          const fileUrl = response.data.secure_url;
          const fileName = file.name || `pasted-image-${Date.now()}.png`;
          
          return {
            fileUrl,
            fileName,
            fileSize: file.size,
            fileType: file.type,
            thumbnailUrl: UploadService.generateThumbnail(fileUrl) || fileUrl
          };
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        setPendingAttachments(prev => [...prev, ...uploadedFiles]);
        
        message.destroy();
        message.success(`${uploadedFiles.length} image(s) ready to send`);
      } catch (error) {
        message.destroy();
        message.error('Failed to upload pasted image(s)');
        console.error('Paste upload error:', error);
      }
    }
  }, []);

  // Handle interview time selection
  const handleSelectInterviewTime = async (messageId, suggestion) => {
    try {
      // First, update the original interview scheduling message in the database
      await axios.put(`${getBackendUrl()}/candidateChat/message/${messageId}/select-time`, {
        selectedSuggestion: suggestion
      });

      // Then send a response message selecting the time
      const responseMessage = `I would like to select ${suggestion.displayText} for the interview.`;
      
      const response = await axios.post(`${getBackendUrl()}/candidateChat/candidate/${token}/send`, {
        message: responseMessage,
        candidateName: chat?.candidateName
      });

      if (response.data) {
        // Update the message to mark the suggestion as selected
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? {
                ...msg,
                interviewSuggestions: msg.interviewSuggestions?.map(s => 
                  s.displayText === suggestion.displayText 
                    ? { ...s, selected: true }
                    : s
                ) || []
              }
            : msg
        ));
        
        // Refresh chat data to potentially update any candidate status
        loadChat();
        
        message.success('Interview time selected successfully!');
      }
    } catch (error) {
      console.error('Error selecting interview time:', error);
      message.error('Failed to select interview time. Please try again.');
    }
  };

  // Initialize data
  useEffect(() => {
    if (token) {
      loadChat();
      loadMessages();
    }
  }, [token]);

  // Polling for new messages
  const pollForNewMessages = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${getBackendUrl()}/candidateChat/candidate/${token}/messages`);
      if (response.data && response.data.messages.length > 0) {
        const latestMessage = response.data.messages[response.data.messages.length - 1];
        const latestMessageTime = new Date(latestMessage.createdAt).getTime();
        
        if (lastMessageTime && latestMessageTime > lastMessageTime) {
          // New message found, update messages
          setMessages(response.data.messages);
          setTimeout(scrollToBottom, 100);
        }
        
        setLastMessageTime(latestMessageTime);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, [token, lastMessageTime]);

  // Start polling when component mounts
  useEffect(() => {
    if (token && !loading) {
      // Set initial last message time
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        setLastMessageTime(new Date(latestMessage.createdAt).getTime());
      }
      
      // Start polling every 3 seconds
      pollingIntervalRef.current = setInterval(pollForNewMessages, 3000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [token, loading, pollForNewMessages, messages]);

  const formatMessageTime = (date) => {
    return moment(date).format("HH:mm");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chat Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {chat?.companyLogo ? (
              <img 
                src={chat.companyLogo} 
                alt="Company Logo"
                className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200"
              />
            ) : (
              <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Chat with Recruiter
              </h1>
              <p className="text-gray-600">
                Application for {chat?.jobTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col chat-container">
          {/* Messages */}
          <div
            ref={messagesEndRef}
            className="flex-1 overflow-auto p-6 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <UserOutlined className="text-4xl mb-4" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${
                    msg.senderType === 'candidate' ? 'justify-end' : 'justify-start'
                  } message-container`}
                  style={{ maxWidth: '100%', overflow: 'hidden' }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.senderType === 'candidate'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                    style={{
                      maxWidth: '90%',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      overflow: 'hidden'
                    }}
                  >
                    {msg.message && (
                      <div className="text-sm leading-relaxed chat-message-content chat-message-text">
                        <LinkifiedText 
                          text={msg.message} 
                          linkClassName={
                            msg.senderType === 'candidate' 
                              ? "text-blue-100 hover:text-white underline" 
                              : "text-blue-600 hover:text-blue-800 underline"
                          }
                        />
                      </div>
                    )}
                    
                    {/* Render attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={msg.message ? "mt-2" : ""}>
                        <ChatAttachments 
                          attachments={msg.attachments}
                          messageType={msg.messageType}
                        />
                      </div>
                    )}
                    
                    {/* Render interview scheduling message */}
                    {msg.messageType === 'interview_scheduling' && (
                      <div className={msg.message ? "mt-2" : ""}>
                        <InterviewSchedulingMessage 
                          message={msg}
                          isCandidate={true}
                          onSelectTime={(suggestion) => handleSelectInterviewTime(msg._id, suggestion)}
                        />
                      </div>
                    )}
                    <div className={`text-xs mt-2 ${
                      msg.senderType === 'candidate' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {msg.senderType === 'candidate' 
                        ? 'You' 
                        : msg.senderName || 'Recruiter'
                      } • {formatMessageTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            {/* Pending attachments preview */}
            {pendingAttachments.length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ready to send:</p>
                <ChatAttachments 
                  attachments={pendingAttachments}
                  messageType={pendingAttachments.some(att => att.fileType?.startsWith('image/')) ? 'image' : 'file'}
                />
                <Button 
                  size="small" 
                  type="text" 
                  onClick={() => setPendingAttachments([])}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Clear attachments
                </Button>
              </div>
            )}
            
            <div className="flex space-x-3">
              <div className="flex items-end space-x-2">
                <ChatFileUpload
                  onFilesUploaded={handleFilesUploaded}
                  disabled={sendingMessage}
                />
              </div>
              <TextArea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder="Type your message... (Ctrl+V to paste images)"
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="flex-1"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                loading={sendingMessage}
                disabled={!messageText.trim() && pendingAttachments.length === 0}
                size="large"
                className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
                style={{
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                }}
              >
                Send
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Ctrl+V to paste images • The recruitment team will be notified immediately
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500 text-sm">
          <p>This is a secure conversation between you and the recruitment team.</p>
          <p>Your messages are private and will only be seen by authorized team members.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateChatPage; 