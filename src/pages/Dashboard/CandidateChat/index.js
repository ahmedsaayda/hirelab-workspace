import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectDarkMode } from "../../../redux/auth/selectors";
import CandidateChatService from "../../../services/CandidateChatService";
import { Input, Button, Avatar, Spin, message } from "antd";
import { SendOutlined, UserOutlined, CalendarOutlined, SearchOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/router";
import { LinkifiedText } from "../../../utils/linkUtils";
import ChatFileUpload from "../../../components/ChatFileUpload";
import ChatAttachments from "../../../components/ChatAttachments";
import InterviewSchedulingMessage from "../../../components/InterviewSchedulingMessage";
import InterviewSchedulingModal from "../Vacancy/components/InterviewSchedulingModal";
import CandidateProfile from "../Vacancy/components/CandidateProfile";
import UploadService from "../../../services/UploadService";

const { TextArea } = Input;
const PAGE_LIMIT = 20;

const CandidateChat = () => {
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const router = useRouter();
  const { chatId } = router.query;

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [page, setPage] = useState(1);
  const [pageM, setPageM] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [hasMoreChats, setHasMoreChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [interviewSchedulingModal, setInterviewSchedulingModal] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearchResults, setMessageSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [candidateProfileId, setCandidateProfileId] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Scroll to bottom function
  const scrollToBottom = useCallback((immediate = false) => {
    const scroll = () => {
      try {
        // Primary method: scroll the element into view
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: immediate ? 'auto' : 'smooth',
            block: 'end'
          });
        }
        // Fallback method: scroll the container
        else if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
              } catch (error) {
          // Final fallback: try container scroll without smooth behavior
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }
    };

    if (immediate) {
      scroll();
    } else {
      setTimeout(scroll, 100);
    }
  }, []);

  // Load team chats
  const loadTeamChats = useCallback(
    async (alternativePage, refresh = false) => {
      // Wait for team to be available before loading chats
      const currentTeam = JSON.parse(localStorage.getItem('currentTeam') || 'null');
      if (!currentTeam) {
        console.log('⏳ CandidateChat: Waiting for team to be set up before loading chats');
        setLoadingChats(false);
        return;
      }

      if (!refresh) setLoadingChats(true);
      try {
        const targetPage = alternativePage || 1;
        const response = await CandidateChatService.getTeamChats(
          targetPage,
          PAGE_LIMIT
        );
        if (response.data) {
          setChats((prevChats) => [
            ...(refresh ? [] : prevChats),
            ...response.data.chats,
          ]);

          setHasMoreChats(response.data.hasMore);
          if (!alternativePage) {
            setPage(2);
          }
          
          // Attempt to preselect chat from URL
          const resolvedChatId = Array.isArray(chatId) ? chatId[0] : chatId;
          if (resolvedChatId && response.data.chats.length > 0) {
            const urlChat = response.data.chats.find(c => c._id === resolvedChatId);
            if (urlChat) {
              setCurrentChat(urlChat);
            }
          } else if (!refresh && response.data.chats?.[0]) {
            setCurrentChat(response.data.chats[0]);
          }
        }
      } catch (error) {
        console.error("Error loading chats:", error);
        
        // Handle specific 404 errors that might occur when team isn't properly set up
        if (error.response?.status === 404) {
          console.log('⚠️ CandidateChat: Team chats not found, user may not have proper team access');
          setChats([]);
          setCurrentChat(null);
        } else {
          message.error("Failed to load chats");
        }
      } finally {
        setLoadingChats(false);
      }
    },
    [chatId]
  );

  // Function to refresh current chat data
  const refreshCurrentChatData = useCallback(async () => {
    if (currentChat) {
      try {
        const response = await CandidateChatService.getTeamChats(1, PAGE_LIMIT);
        if (response.data) {
          const updatedChat = response.data.chats.find(c => c._id === currentChat._id);
          if (updatedChat) {
            setCurrentChat(updatedChat);
            // Also update in the chats list
            setChats(prevChats => 
              prevChats.map(chat => 
                chat._id === currentChat._id ? updatedChat : chat
              )
            );
          }
        }
      } catch (error) {
        console.error("Error refreshing chat data:", error);
      }
    }
  }, [currentChat]);

  // Load messages for a chat
  const loadMessages = useCallback(
    async (chat, alternativePage, refresh = false) => {
      if (!chat) return;
      
      setLoadingMessages(true);
      try {
        const targetPage = alternativePage || 1;
        const response = await CandidateChatService.getChatMessages(
          chat._id,
          targetPage,
          50
        );
        
        if (response.data) {
          setMessages((prevMessages) => [
            ...(refresh ? [] : prevMessages),
            ...response.data.messages,
          ]);
          
          setHasMoreMessages(response.data.hasMore);
          if (!alternativePage) {
            setPageM(2);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        message.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    []
  );

  // Initialize data
  useEffect(() => {
    loadTeamChats(1, true);
  }, []);

  // Listen for team changes and reload chats when team becomes available
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentTeam' && e.newValue) {
        console.log('🔄 CandidateChat: Team updated, reloading chats');
        loadTeamChats(1, true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for team availability (in case of same-tab updates)
    const teamCheckInterval = setInterval(() => {
      const currentTeam = JSON.parse(localStorage.getItem('currentTeam') || 'null');
      if (currentTeam && chats.length === 0 && !loadingChats) {
        console.log('🔄 CandidateChat: Team now available, loading chats');
        loadTeamChats(1, true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(teamCheckInterval);
    };
  }, [loadTeamChats, chats.length, loadingChats]);

  // If URL chatId becomes available after mount, select that chat from existing list
  useEffect(() => {
    const resolvedChatId = Array.isArray(chatId) ? chatId[0] : chatId;
    if (resolvedChatId && chats.length > 0) {
      const urlChat = chats.find(c => c._id === resolvedChatId);
      if (urlChat && (!currentChat || currentChat._id !== urlChat._id)) {
        setCurrentChat(urlChat);
      }
    }
  }, [chatId, chats, currentChat]);

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      setPageM(1);
      setMessages([]);
      loadMessages(currentChat, 1, true).then(() => {
        scrollToBottom(true); // Immediate scroll when selecting chat
      });
    }
  }, [currentChat?._id, loadMessages, scrollToBottom]);

  // Scroll to bottom when messages change (for initial load)
  useEffect(() => {
    if (messages.length > 0 && currentChat) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => scrollToBottom(), 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, currentChat?._id, scrollToBottom]);

  // Polling for new messages
  const pollForNewMessages = useCallback(async () => {
    if (!currentChat) return;
    
    try {
      const response = await CandidateChatService.getChatMessages(currentChat._id, 1, 50);
      if (response.data && response.data.messages.length > 0) {
        const latestMessage = response.data.messages[response.data.messages.length - 1];
        const latestMessageTime = new Date(latestMessage.createdAt).getTime();
        
        setMessages(prevMessages => {
          if (prevMessages.length === 0) return response.data.messages;
          
          const prevLatestTime = prevMessages.length > 0 ? 
            new Date(prevMessages[prevMessages.length - 1].createdAt).getTime() : 0;
            
          if (latestMessageTime > prevLatestTime) {
            // If there are new messages, also refresh chat data to update candidate info
            refreshCurrentChatData();
            
            // Smooth scroll when new messages arrive
            scrollToBottom();
            return response.data.messages;
          }
          
          return prevMessages;
        });
        
        setLastMessageTime(latestMessageTime);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, [currentChat?._id, refreshCurrentChatData, scrollToBottom]);

  // Start polling when chat is selected
  useEffect(() => {
    if (currentChat) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      pollingIntervalRef.current = setInterval(() => {
        pollForNewMessages();
      }, 8000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [currentChat?._id, pollForNewMessages]);

  // Refresh chat list periodically
  useEffect(() => {
    const chatListInterval = setInterval(() => {
      loadTeamChats(1, true);
    }, 60000);

    return () => clearInterval(chatListInterval);
  }, []);

  // Handle sending a new message
  const handleSendMessage = useCallback(async () => {
    if (!currentChat || (!messageText.trim() && pendingAttachments.length === 0)) return;

    setSendingMessage(true);
    
    const validAttachments = pendingAttachments.filter(att => 
      att.fileUrl && att.fileName && att.fileType
    );
    
    let messageType = 'text';
    if (validAttachments.length > 0) {
      const hasImages = validAttachments.some(att => att.fileType && att.fileType.startsWith('image/'));
      messageType = hasImages ? 'image' : 'file';
    }

    const tempMessage = {
      _id: Date.now(),
      senderType: 'recruiter',
      message: messageText,
      messageType,
      attachments: validAttachments,
      senderName: `${user.firstName} ${user.lastName}`,
      senderAvatar: user.avatar,
      createdAt: new Date(),
      temp: true
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    const messageToSend = messageText;
    const attachmentsToSend = [...validAttachments];
    setMessageText("");
    setPendingAttachments([]);

    // Smooth scroll when sending a message
    scrollToBottom();

    try {
      const response = await CandidateChatService.sendMessage(currentChat._id, {
        message: messageToSend,
        attachments: attachmentsToSend,
        messageType,
        baseURL: window.location.origin
      });

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempMessage._id)
      );

      if (response.data) {
        loadMessages(currentChat, 1, true);
        // Refresh chat data in case the message affected candidate status
        refreshCurrentChatData();
      }
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempMessage._id)
      );
      console.error("Error sending message:", error);
      message.error("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  }, [currentChat, messageText, pendingAttachments, user, loadMessages, scrollToBottom, refreshCurrentChatData]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file uploads
  const handleFilesUploaded = useCallback((uploadedFiles) => {
    setPendingAttachments(prev => [...prev, ...uploadedFiles]);
  }, []);

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

  // Handle interview scheduling
  const handleScheduleInterview = () => {
    if (!currentChat) {
      message.warning('Please select a chat first');
      return;
    }
    setInterviewSchedulingModal(true);
  };

  const handleSendInterviewSuggestions = async (suggestions, messageTemplate) => {
    if (!currentChat || !suggestions || suggestions.length === 0) {
      message.error('Please select valid interview times');
      return;
    }

    setSchedulingLoading(true);
    try {
      const suggestionText = suggestions.map((s, index) => 
        `Option ${index + 1}: ${s.displayText}`
      ).join('\n');

      // Use custom template if provided, otherwise use default
      const template = messageTemplate || `🗓️ Interview Invitation\n\nHi {candidateName},\n\nWe would like to schedule an interview with you! Please select one of the following available times:\n\n{timeOptions}\n\nPlease reply with your preferred option, and we'll send you the meeting details.\n\nLooking forward to speaking with you!`;
      
      const messageText = template
        .replace(/\{candidateName\}/g, currentChat.candidateName)
        .replace(/\{timeOptions\}/g, suggestionText);

      const response = await CandidateChatService.sendMessage(currentChat._id, {
        message: messageText,
        messageType: 'interview_scheduling',
        interviewSuggestions: suggestions,
        attachments: [],
        baseURL: window.location.origin
      });

      if (response.data) {
        message.success('Interview suggestions sent successfully!');
        setInterviewSchedulingModal(false);
        loadMessages(currentChat, 1, true);
        // Refresh chat data to update candidate info
        refreshCurrentChatData();
        // Scroll to show the new interview message
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending interview suggestions:', error);
      message.error('Failed to send interview suggestions. Please try again.');
    } finally {
      setSchedulingLoading(false);
    }
  };

  const formatMessageTime = (date) => {
    return moment(date).format("HH:mm");
  };

  const formatChatTime = (date) => {
    return moment(date).fromNow();
  };

  // Helper function to get candidate's full name from form data
  const getCandidateName = (chat) => {
    if (!chat) return "Candidate";
    
    try {
      const formData = chat.candidateId?.formData;
      if (!formData) {
        return chat.candidateName && chat.candidateName !== 'Candidate' 
          ? chat.candidateName 
          : chat.candidateEmail?.split('@')[0] || "Candidate";
      }

      // Try different field combinations
      if (formData.firstname && formData.lastname) {
        return `${formData.firstname} ${formData.lastname}`;
      }
      
      if (formData.firstName && formData.lastName) {
        return `${formData.firstName} ${formData.lastName}`;
      }
      
      // Try the dynamic field names (from the form builder)
      const firstNameField = Object.keys(formData).find(key => key.includes('firstName') || key.includes('firstname'));
      const lastNameField = Object.keys(formData).find(key => key.includes('lastName') || key.includes('lastname'));
      
      if (firstNameField && lastNameField && formData[firstNameField] && formData[lastNameField]) {
        return `${formData[firstNameField]} ${formData[lastNameField]}`;
      }
      
      // Fallback to chat name or email
      return chat.candidateName && chat.candidateName !== 'Candidate' 
        ? chat.candidateName 
        : chat.candidateEmail?.split('@')[0] || "Candidate";
    } catch (error) {
      return chat.candidateName || chat.candidateEmail?.split('@')[0] || "Candidate";
    }
  };

  // Helper function to get candidate's email
  const getCandidateEmail = (chat) => {
    if (!chat) return "No email provided";
    
    try {
      const formData = chat.candidateId?.formData;
      if (!formData) return chat.candidateEmail || "No email provided";
      
      return formData.email || 
             formData.candidateEmail ||
             Object.values(formData).find(value => 
               typeof value === 'string' && value.includes('@')
             ) ||
             chat.candidateEmail || 
             "No email provided";
    } catch (error) {
      return chat.candidateEmail || "No email provided";
    }
  };

  // Helper function to get candidate's phone
  const getCandidatePhone = (chat) => {
    if (!chat) return "No phone provided";
    
    const formData = chat.candidateId?.formData;
    if (!formData) return "No phone provided";
    
    return formData.phone || 
           formData.candidatePhone ||
           Object.values(formData).find(value => 
             typeof value === 'string' && (value.includes('+') || /^\d+/.test(value))
           ) ||
           "No phone provided";
  };

  // Helper function to get candidate's avatar
  const getCandidateAvatar = (chat) => {
    if (!chat) return null;
    
    const formData = chat.candidateId?.formData;
    if (!formData) return null;
    
    // Look for avatar, profile picture, or photo URLs
    return formData.avatar || 
           formData.profilePicture ||
           formData.photo ||
           formData.picture ||
           Object.values(formData).find(value => 
             typeof value === 'string' && 
             (value.includes('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg') || value.includes('.webp')))
           ) ||
           null;
  };

  // Helper function to check if candidate is online (sent message in last 15 minutes)
  const isCandidateOnline = (chat) => {
    if (!chat) return false;
    
    // Use the lastCandidateMessageAt if available (from backend)
    if (chat.lastCandidateMessageAt) {
      const lastActivity = new Date(chat.lastCandidateMessageAt);
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      return lastActivity > fifteenMinutesAgo;
    }
    
    // For the current chat, we can check the loaded messages
    if (currentChat && currentChat._id === chat._id && messages.length > 0) {
      // Find the last message from the candidate
      const lastCandidateMessage = messages
        .filter(msg => msg.senderType === 'candidate')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
      if (lastCandidateMessage) {
        const lastActivity = new Date(lastCandidateMessage.createdAt);
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        return lastActivity > fifteenMinutesAgo;
      }
    }
    
    // Default to false if we can't determine candidate activity
    return false;
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    if (!searchTerm.trim()) return true;
    
    const candidateName = getCandidateName(chat).toLowerCase();
    const candidateEmail = getCandidateEmail(chat).toLowerCase();
    const jobTitle = (chat.jobTitle || '').toLowerCase();
    const lastMessage = (chat.lastMessage || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase().trim();
    

    // Simple substring matching (more flexible than word-by-word)
    const searchableText = `${candidateName} ${candidateEmail} ${jobTitle} ${lastMessage}`;
    return searchableText.includes(searchLower);
  });

  // Debounced message search
  useEffect(() => {
    const term = (searchTerm || "").trim();
    if (!term) {
      setMessageSearchResults([]);
      setLoadingSearch(false);
      return;
    }
    let cancelled = false;
    setLoadingSearch(true);
    const t = setTimeout(async () => {
      try {
        const response = await CandidateChatService.searchMessages(term, 1, 10);
        if (!cancelled) {
          setMessageSearchResults(response.data?.messages || []);
        }
      } catch (e) {
        if (!cancelled) setMessageSearchResults([]);
      } finally {
        if (!cancelled) setLoadingSearch(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchTerm]);

  return (
    <div className="w-full h-full bg-gray-50 flex" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex h-full w-full">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Communication</h1>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchTerm('');
                  }
                }}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {searchTerm.trim() && (
              <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                {filteredChats.length} of {chats.length} conversations
  
              </div>
            )}
            
            {searchTerm.trim() && messageSearchResults.length > 0 && (
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Messages</div>
                <div className="space-y-2">
                  {messageSearchResults.map((res) => (
                    <div
                      key={res._id}
                      onClick={() => {
                        const chat = chats.find(c => c._id === res.chatId);
                        if (chat) setCurrentChat(chat);
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {res.meta?.candidateName || res.meta?.candidateEmail || 'Candidate'} • {res.meta?.jobTitle || ''}
                      </div>
                      <div className="text-sm text-gray-900 truncate">
                        {res.message}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gray-200 my-3" />
              </div>
            )}

            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">
                  {searchTerm.trim() ? 'No matching conversations' : 'No conversations yet'}
                </p>
                {searchTerm.trim() && (
                  <p className="text-xs mt-2 text-gray-400">
                    Try searching for names, emails, or job titles
                  </p>
                )}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setCurrentChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentChat?._id === chat._id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar
                        size={40}
                        src={getCandidateAvatar(chat)}
                        icon={<UserOutlined />}
                        className="bg-purple-500"
                      />
                      {isCandidateOnline(chat) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getCandidateName(chat)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatChatTime(chat.lastMessageAt)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {chat.jobTitle}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {chat.lastMessage || "Start conversation"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {loadingChats && (
              <div className="p-4 text-center">
                <Spin size="small" />
              </div>
            )}
          </div>
        </div>

        {/* Center - Chat Messages */}
        <div className="flex-1 flex flex-col bg-white">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      size={40}
                      src={getCandidateAvatar(currentChat)}
                      icon={<UserOutlined />}
                      className="bg-purple-500"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {getCandidateName(currentChat)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentChat.jobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Chat started: {formatChatTime(currentChat.createdAt)}
                  </div>
                </div>
              </div>

              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loadingMessages && messages.length === 0 && (
                  <div className="flex justify-center py-8">
                    <Spin />
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`flex ${
                        msg.senderType === 'recruiter' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="flex items-start space-x-2 max-w-md">
                        {msg.senderType === 'candidate' && (
                          <Avatar
                            size={32}
                            src={getCandidateAvatar(currentChat)}
                            icon={<UserOutlined />}
                            className="bg-gray-400 flex-shrink-0"
                          />
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md ${
                            msg.senderType === 'recruiter'
                              ? 'bg-purple-500 text-white rounded-br-md'
                              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          {msg.message && (
                            <div className="text-sm leading-relaxed">
                              <LinkifiedText 
                                text={msg.message} 
                                linkClassName={
                                  msg.senderType === 'recruiter' 
                                    ? "text-purple-100 hover:text-white underline" 
                                    : "text-purple-600 hover:text-purple-800 underline"
                                }
                              />
                            </div>
                          )}
                          
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className={msg.message ? "mt-2" : ""}>
                              <ChatAttachments 
                                attachments={msg.attachments}
                                messageType={msg.messageType}
                              />
                            </div>
                          )}
                          
                          {msg.messageType === 'interview_scheduling' && (
                            <div className={msg.message ? "mt-2" : ""}>
                              <InterviewSchedulingMessage 
                                message={msg}
                                isCandidate={false}
                                readOnly={true}
                              />
                            </div>
                          )}
                          
                          <div className={`text-xs mt-2 ${
                            msg.senderType === 'recruiter' 
                              ? 'text-purple-100' 
                              : 'text-gray-500'
                          }`}>
                            {msg.senderType === 'recruiter' 
                              ? msg.senderName 
                              : msg.candidateName || 'Candidate'
                            } • {formatMessageTime(msg.createdAt)}
                          </div>
                        </div>
                        {msg.senderType === 'recruiter' && (
                          <Avatar
                            size={32}
                            icon={<UserOutlined />}
                            className="bg-purple-500 flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                {pendingAttachments.length > 0 && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 mb-2">Ready to send:</p>
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
                    <Button
                      type="default"
                      icon={<CalendarOutlined />}
                      onClick={handleScheduleInterview}
                      disabled={sendingMessage}
                      className="mb-1 border-purple-300 text-purple-600 hover:border-purple-500 hover:text-purple-700"
                      title="Schedule Interview"
                    >
                      Schedule
                    </Button>
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <TextArea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onPaste={handlePaste}
                      placeholder="Start typing the message..."
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      loading={sendingMessage}
                      disabled={!messageText.trim() && pendingAttachments.length === 0}
                      className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600 px-6"
                      style={{
                        backgroundColor: '#8B5CF6',
                        borderColor: '#8B5CF6',
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Candidate Details */}
        {currentChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    size={64}
                    src={getCandidateAvatar(currentChat)}
                    icon={<UserOutlined />}
                    className="bg-purple-500"
                  />
                  {isCandidateOnline(currentChat) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getCandidateName(currentChat)}
                  </h3>
                  <p className="text-sm text-gray-500">{currentChat.jobTitle}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Applied for:</h4>
              <p className="text-sm text-gray-700 font-medium">{currentChat.jobTitle}</p>
            </div>



            <div className="p-6 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <MailOutlined className="text-gray-400" />
                  <span className="text-gray-700">
                    {getCandidateEmail(currentChat)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <PhoneOutlined className="text-gray-400" />
                  <span className="text-gray-700">
                    {getCandidatePhone(currentChat)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">Schedule</h4>
                <Button
                  type="text"
                  size="small"
                  icon={<CalendarOutlined />}
                  onClick={handleScheduleInterview}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Schedule
                </Button>
              </div>

              <div className="mb-4">
                <Button
                  type="default"
                  size="small"
                  onClick={() => setCandidateProfileId(currentChat.candidateId?._id || currentChat.candidateId)}
                  className="border-purple-300 text-purple-600 hover:border-purple-500 hover:text-purple-700"
                >
                  Open Candidate Card
                </Button>
              </div>
              
              {currentChat.candidateId?.meetingScheduled && 
               currentChat.candidateId?.interviewMeetingTimestamp ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-purple-900">
                        Interview with {getCandidateName(currentChat)}
                      </h5>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-purple-700">
                        <CalendarOutlined className="w-4 h-4" />
                        <span>
                          {moment(currentChat.candidateId.interviewMeetingTimestamp).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-purple-700">
                        <ClockCircleOutlined className="w-4 h-4" />
                        <span>
                          {moment(currentChat.candidateId.interviewMeetingTimestamp).format("h:mm A")}
                          {currentChat.candidateId.interviewMeetingTimestampEnd && 
                            ` - ${moment(currentChat.candidateId.interviewMeetingTimestampEnd).format("h:mm A")}`
                          }
                        </span>
                      </div>
                      {currentChat.candidateId.interviewMeetingLink && (
                        <div className="mt-2">
                          <a 
                            href={currentChat.candidateId.interviewMeetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-gray-500 text-sm">
                    No interview scheduled yet
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<CalendarOutlined />}
                    onClick={handleScheduleInterview}
                    className="mt-2 text-purple-600 hover:text-purple-700"
                  >
                    Schedule Interview
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <InterviewSchedulingModal
        visible={interviewSchedulingModal}
        onCancel={() => setInterviewSchedulingModal(false)}
        onSchedule={handleSendInterviewSuggestions}
        candidate={currentChat ? {
          fullname: getCandidateName(currentChat),
          email: getCandidateEmail(currentChat)
        } : null}
        loading={schedulingLoading}
      />

      {/* Candidate Profile Drawer */}
      {candidateProfileId && (
        <CandidateProfile
          candidateId={candidateProfileId}
          onClose={() => setCandidateProfileId(null)}
          onUpdate={() => setCandidateProfileId(null)}
          stages={[]}
          allCandidateIds={[candidateProfileId]}
          onEmail={() => message.info('Compose from chat coming soon')}
          onStatusChange={() => {}}
          onShowReviewBreakdown={() => {}}
        />
      )}
    </div>
  );
};

export default CandidateChat; 