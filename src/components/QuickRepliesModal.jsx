import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Tabs, Empty, message, Tooltip, Tag, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  FolderOutlined
} from '@ant-design/icons';
import CandidateChatService from '../services/CandidateChatService';

const { TextArea } = Input;
const { Option } = Select;

// Helper function to replace variables in message template
export const replaceVariables = (template, candidateData) => {
  if (!template || !candidateData) return template;

  let result = template;

  // Extract candidate info
  const formData = candidateData.candidateId?.formData || {};
  
  // Get first name
  let firstName = formData.firstname || formData.firstName || '';
  if (!firstName) {
    const firstNameField = Object.keys(formData).find(key => 
      key.toLowerCase().includes('firstname')
    );
    if (firstNameField) firstName = formData[firstNameField];
  }

  // Get last name
  let lastName = formData.lastname || formData.lastName || '';
  if (!lastName) {
    const lastNameField = Object.keys(formData).find(key => 
      key.toLowerCase().includes('lastname')
    );
    if (lastNameField) lastName = formData[lastNameField];
  }

  // Get email
  let email = candidateData.candidateEmail || formData.email || '';
  if (!email) {
    const emailField = Object.keys(formData).find(key => 
      key.toLowerCase().includes('email')
    );
    if (emailField) email = formData[emailField];
  }

  // Get phone
  let phone = formData.phone || '';
  if (!phone) {
    const phoneField = Object.keys(formData).find(key => 
      key.toLowerCase().includes('phone')
    );
    if (phoneField) phone = formData[phoneField];
  }

  const fullName = candidateData.candidateName || 
    (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'Candidate');

  // Replace variables
  result = result.replace(/\{firstName\}/gi, firstName || 'there');
  result = result.replace(/\{lastName\}/gi, lastName || '');
  result = result.replace(/\{fullName\}/gi, fullName);
  result = result.replace(/\{email\}/gi, email || '');
  result = result.replace(/\{phone\}/gi, phone || '');
  result = result.replace(/\{jobTitle\}/gi, candidateData.jobTitle || '');

  return result;
};

const QuickRepliesModal = ({ 
  visible, 
  onCancel, 
  onSelectReply, 
  candidateData,
  mode = 'select' // 'select' or 'manage'
}) => {
  const [quickReplies, setQuickReplies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableVariables, setAvailableVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('select');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state for creating/editing
  const [editingReply, setEditingReply] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'General'
  });

  useEffect(() => {
    if (visible) {
      loadQuickReplies();
      setActiveTab(mode === 'manage' ? 'manage' : 'select');
    }
  }, [visible, mode]);

  const loadQuickReplies = async () => {
    setLoading(true);
    try {
      const response = await CandidateChatService.getQuickReplies();
      setQuickReplies(response.data.quickReplies || []);
      setCategories(response.data.categories || []);
      setAvailableVariables(response.data.availableVariables || []);
    } catch (error) {
      console.error('Error loading quick replies:', error);
      message.error('Failed to load quick replies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      message.warning('Please fill in both title and message');
      return;
    }

    try {
      if (editingReply) {
        await CandidateChatService.updateQuickReply(editingReply._id, formData);
        message.success('Quick reply updated');
      } else {
        await CandidateChatService.createQuickReply(formData);
        message.success('Quick reply created');
      }
      
      setFormData({ title: '', message: '', category: 'General' });
      setEditingReply(null);
      loadQuickReplies();
    } catch (error) {
      console.error('Error saving quick reply:', error);
      message.error('Failed to save quick reply');
    }
  };

  const handleDelete = async (id) => {
    try {
      await CandidateChatService.deleteQuickReply(id);
      message.success('Quick reply deleted');
      loadQuickReplies();
    } catch (error) {
      console.error('Error deleting quick reply:', error);
      message.error('Failed to delete quick reply');
    }
  };

  const handleSelectReply = async (reply) => {
    // Track usage
    try {
      await CandidateChatService.useQuickReply(reply._id);
    } catch (e) {
      // Non-blocking
    }

    // Replace variables with actual data
    const processedMessage = replaceVariables(reply.message, candidateData);
    onSelectReply(processedMessage);
    onCancel();
  };

  const handleEdit = (reply) => {
    setEditingReply(reply);
    setFormData({
      title: reply.title,
      message: reply.message,
      category: reply.category
    });
    setActiveTab('manage');
  };

  const insertVariable = (variable) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message + variable
    }));
  };

  const filteredReplies = quickReplies.filter(reply => {
    const matchesCategory = selectedCategory === 'all' || reply.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderSelectTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search quick replies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          allowClear
        />
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: 150 }}
          suffixIcon={<FolderOutlined />}
        >
          <Option value="all">All Categories</Option>
          {categories.map(cat => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>
      </div>

      {/* Quick Replies List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredReplies.length === 0 ? (
          <Empty 
            description={
              <span className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? "No quick replies match your search" 
                  : "No quick replies yet. Create one in the Manage tab!"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          filteredReplies.map((reply) => (
            <div 
              key={reply._id}
              className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all group"
              onClick={() => handleSelectReply(reply)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ThunderboltOutlined className="text-purple-500" />
                  <span className="font-medium text-gray-900">{reply.title}</span>
                  <Tag color="purple" className="text-xs">{reply.category}</Tag>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title="Edit">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(reply);
                      }}
                      className="text-gray-400 hover:text-purple-600"
                    />
                  </Tooltip>
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {replaceVariables(reply.message, candidateData).substring(0, 100)}
                {reply.message.length > 100 ? '...' : ''}
              </p>
              {reply.usageCount > 0 && (
                <p className="text-xs text-gray-400 mt-1">Used {reply.usageCount} times</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderManageTab = () => (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          {editingReply ? <EditOutlined /> : <PlusOutlined />}
          {editingReply ? 'Edit Quick Reply' : 'Create New Quick Reply'}
        </h4>
        
        <Input
          placeholder="Title (e.g., 'Welcome Message')"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
        
        <TextArea
          placeholder="Message template... Use variables like {firstName}, {jobTitle}"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          rows={4}
        />
        
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gray-500 mr-2">Insert variable:</span>
          {availableVariables.map((v) => (
            <Tooltip key={v.key} title={v.description}>
              <Tag 
                className="cursor-pointer hover:bg-purple-100"
                onClick={() => insertVariable(v.key)}
              >
                {v.key}
              </Tag>
            </Tooltip>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Select
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            style={{ width: 150 }}
          >
            <Option value="General">General</Option>
            <Option value="Greeting">Greeting</Option>
            <Option value="Follow-up">Follow-up</Option>
            <Option value="Interview">Interview</Option>
            <Option value="Rejection">Rejection</Option>
            <Option value="Offer">Offer</Option>
          </Select>
          
          <Button 
            type="primary" 
            onClick={handleCreateOrUpdate}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {editingReply ? 'Update' : 'Create'}
          </Button>
          
          {editingReply && (
            <Button 
              onClick={() => {
                setEditingReply(null);
                setFormData({ title: '', message: '', category: 'General' });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Existing Quick Replies */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Your Quick Replies ({quickReplies.length})</h4>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {quickReplies.length === 0 ? (
            <Empty 
              description="No quick replies yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            quickReplies.map((reply) => (
              <div 
                key={reply._id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{reply.title}</span>
                    <Tag color="purple" className="text-xs">{reply.category}</Tag>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(reply)}
                        className="text-gray-400 hover:text-purple-600"
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete this quick reply?"
                      onConfirm={() => handleDelete(reply._id)}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        className="text-gray-400 hover:text-red-600"
                      />
                    </Popconfirm>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{reply.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-purple-500" />
          <span>Quick Replies</span>
          <Tooltip title="Quick replies are message templates that save you time. Use variables like {firstName} to personalize messages.">
            <InfoCircleOutlined className="text-gray-400 text-sm cursor-help" />
          </Tooltip>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'select',
            label: (
              <span className="flex items-center gap-1">
                <ThunderboltOutlined />
                Use Quick Reply
              </span>
            ),
            children: renderSelectTab()
          },
          {
            key: 'manage',
            label: (
              <span className="flex items-center gap-1">
                <EditOutlined />
                Manage
              </span>
            ),
            children: renderManageTab()
          }
        ]}
      />
    </Modal>
  );
};

export default QuickRepliesModal;

