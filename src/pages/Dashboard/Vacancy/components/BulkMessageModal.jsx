import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Input, message, Typography, Select, Space, Spin, Popconfirm, Alert, Checkbox, Progress } from 'antd';
import { MailOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Mention, MentionsInput } from 'react-mentions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';
import CrudService from '../../../../services/CrudService';
import ATSService from '../../../../services/ATSService';
import classNamesBody from '../../Message/body.module.css';

const { TextArea } = Input;
const { Text } = Typography;

// Available variables for message templates
const MESSAGE_VARIABLES = [
  { id: "candidateFirstname", display: "Candidate's Firstname" },
  { id: "candidateLastname", display: "Candidate's Lastname" },
  { id: "candidateEmail", display: "Candidate's Email" },
  { id: "candidatePhone", display: "Candidate's Phone" },
  { id: "jobTitle", display: "Job Title" },
  { id: "jobLocation", display: "Job Location" },
  { id: "companyName", display: "Company Name" },
  { id: "companyWebsite", display: "Company Website" },
  { id: "currentDate", display: "Current Date" },
  { id: "userFirstname", display: "Your Firstname" },
  { id: "userLastname", display: "Your Lastname" },
  { id: "userEmail", display: "Your Email" },
];

const BulkMessageModal = ({ 
  visible, 
  onCancel, 
  onSuccess,
  selectedCandidates = [],
  candidates = [],
  vacancyInfo = null
}) => {
  const user = useSelector(selectUser);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [markAsRejected, setMarkAsRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0, status: '' });

  // Get selected candidate details
  const selectedCandidateDetails = candidates.filter(c => selectedCandidates.includes(c.id));

  // Load email templates
  const reloadTemplates = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await CrudService.search("GeneralEmailTemplates", 100, 1, {
        filters: { user_id: user._id },
        sort: { createdAt: -1 },
      });
      setTemplates(data.items || []);
    } catch (err) {
      console.error("Failed to load email templates:", err);
    }
  }, [user?._id]);

  useEffect(() => {
    if (visible) {
      reloadTemplates();
      // Reset form when modal opens
      setSubject('');
      setBody('');
      setSelectedTemplate(null);
      setMarkAsRejected(false);
      setRejectionReason('');
      setSendProgress({ current: 0, total: 0, status: '' });
    }
  }, [visible, reloadTemplates]);

  // Apply selected template
  useEffect(() => {
    const selected = templates.find((t) => t._id === selectedTemplate);
    if (selected) {
      setSubject(selected.subject || '');
      setBody(selected.message || '');
    }
  }, [selectedTemplate, templates]);

  // Replace variables in text
  const replaceVariables = (text, candidate) => {
    if (!text) return '';
    
    const formData = candidate?.formData || {};
    const replacements = {
      candidateFirstname: formData.firstname || formData.firstName || candidate?.fullname?.split(' ')[0] || '',
      candidateLastname: formData.lastname || formData.lastName || candidate?.fullname?.split(' ').slice(1).join(' ') || '',
      candidateEmail: formData.email || candidate?.email || '',
      candidatePhone: formData.phone || formData.phoneNumber || '',
      jobTitle: vacancyInfo?.vacancyTitle || vacancyInfo?.name || '',
      jobLocation: Array.isArray(vacancyInfo?.location) ? vacancyInfo.location.join(', ') : (vacancyInfo?.location || ''),
      companyName: user?.companyName || '',
      companyWebsite: user?.companyUrl || '',
      currentDate: new Date().toLocaleDateString(),
      userFirstname: user?.firstname || user?.name?.split(' ')[0] || '',
      userLastname: user?.lastname || user?.name?.split(' ').slice(1).join(' ') || '',
      userEmail: user?.email || '',
    };

    let result = text;
    // Handle MentionsInput format: @[Display](id)
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`@\\[([^\\]]+)\\]\\(${key}\\)`, 'g');
      result = result.replace(regex, replacements[key]);
      // Also handle simple {variable} format
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
    });
    
    return result;
  };

  // Send bulk messages
  const handleSend = async () => {
    if (!subject.trim()) {
      message.error('Please enter a subject');
      return;
    }
    if (!body.trim()) {
      message.error('Please enter a message');
      return;
    }
    if (selectedCandidateDetails.length === 0) {
      message.error('No candidates selected');
      return;
    }

    setLoading(true);
    setSendProgress({ current: 0, total: selectedCandidateDetails.length, status: 'Sending emails...' });

    try {
      // Send all emails via single backend call
      const response = await ATSService.sendBulkEmail({
        candidateIds: selectedCandidates,
        subject,
        body,
        markAsRejected,
        rejectionReason: markAsRejected ? rejectionReason : undefined,
      });

      const results = response.data?.results || { success: [], failed: [] };
      const successCount = results.success?.length || 0;
      const failCount = results.failed?.length || 0;

      setSendProgress({ 
        current: selectedCandidateDetails.length, 
        total: selectedCandidateDetails.length, 
        status: 'Complete!' 
      });

      if (successCount > 0) {
        message.success(`Successfully sent ${successCount} email${successCount !== 1 ? 's' : ''}${markAsRejected ? ' and marked as rejected' : ''}`);
      }
      if (failCount > 0) {
        message.warning(`Failed to send ${failCount} email${failCount !== 1 ? 's' : ''}`);
      }

      // Call success callback
      if (onSuccess) {
        onSuccess({ successCount, failCount, markedAsRejected: markAsRejected });
      }

      // Close modal after short delay
      setTimeout(() => {
        onCancel();
      }, 1000);

    } catch (err) {
      console.error('Bulk send error:', err);
      message.error('Failed to send messages: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Save current as template
  const saveAsTemplate = async () => {
    if (!subject.trim() && !body.trim()) {
      message.error('Cannot save empty template');
      return;
    }

    setTemplateLoading(true);
    try {
      const newTemplate = await CrudService.create("GeneralEmailTemplates", {
        subject: subject,
        message: body,
      });
      await reloadTemplates();
      if (newTemplate?.data?.result?._id) {
        setSelectedTemplate(newTemplate.data.result._id);
      }
      message.success('Template saved');
    } catch (err) {
      console.error('Failed to save template:', err);
      message.error('Failed to save template');
    } finally {
      setTemplateLoading(false);
    }
  };

  // Preview with first candidate's data
  const previewCandidate = selectedCandidateDetails[0];
  const previewSubject = replaceVariables(subject, previewCandidate);
  const previewBody = replaceVariables(body, previewCandidate);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MailOutlined className="text-purple-500" />
          <span>Send Bulk Message</span>
          <span className="text-sm font-normal text-gray-500">
            ({selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''})
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button 
          key="send" 
          type="primary" 
          onClick={handleSend}
          loading={loading}
          icon={<SendOutlined />}
          className="!bg-purple-500 hover:!bg-purple-600 !border-purple-500 hover:!border-purple-600"
          style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
          disabled={selectedCandidates.length === 0}
        >
          Send to {selectedCandidates.length} Candidate{selectedCandidates.length !== 1 ? 's' : ''}
        </Button>
      ]}
    >
      <div className="space-y-4">
        {/* Recipients summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <UserOutlined className="text-gray-500" />
            <Text strong>Recipients:</Text>
          </div>
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {selectedCandidateDetails.slice(0, 10).map((candidate, idx) => (
              <span 
                key={candidate.id} 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700"
              >
                {candidate.fullname || candidate.email}
              </span>
            ))}
            {selectedCandidateDetails.length > 10 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600">
                +{selectedCandidateDetails.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Template selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Template
          </label>
          <div className="flex items-center gap-2">
            <Select
              className="flex-1"
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              showSearch
              allowClear
              placeholder="Select a saved template or write a new one"
              filterOption={(input, option) => {
                const label = (option?.label || '').toString().toLowerCase();
                return label.includes(input.toLowerCase());
              }}
            >
              {templates.map((t) => {
                const label = t.subject || (t.message || '').slice(0, 50) || '-';
                return (
                  <Select.Option key={t._id} value={t._id} label={label}>
                    <Space className="flex justify-between w-full">
                      <div className="truncate max-w-[300px]">{label}</div>
                      <Popconfirm
                        title="Delete this template?"
                        onConfirm={async (e) => {
                          e?.stopPropagation();
                          setTemplateLoading(true);
                          try {
                            await CrudService.delete("GeneralEmailTemplates", t._id);
                            await reloadTemplates();
                            if (selectedTemplate === t._id) {
                              setSelectedTemplate(null);
                            }
                          } catch (err) {
                            console.error("Failed to delete template:", err);
                          } finally {
                            setTemplateLoading(false);
                          }
                        }}
                      >
                        <Button
                          size="small"
                          danger
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          disabled={templateLoading}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Select.Option>
                );
              })}
            </Select>
            <Button
              onClick={saveAsTemplate}
              loading={templateLoading}
              className="!bg-indigo-500 !text-white !border-indigo-500 hover:!bg-indigo-600"
            >
              Save Current
            </Button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
          />
        </div>

        {/* Message body with variables */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <Text type="secondary" className="text-xs">
              Type # to insert variables
            </Text>
          </div>
          <MentionsInput
            placeholder="Type your message... Use # to insert candidate variables"
            value={body}
            onChange={(_, value) => setBody(value)}
            classNames={classNamesBody}
            a11ySuggestionsListLabel="Available variables"
            style={{
              control: { minHeight: 150 },
              input: { minHeight: 150 },
            }}
          >
            <Mention
              trigger="#"
              className="bg-purple-100"
              data={MESSAGE_VARIABLES}
            />
          </MentionsInput>
        </div>

        {/* Mark as rejected option */}
        <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
          <Checkbox
            checked={markAsRejected}
            onChange={(e) => setMarkAsRejected(e.target.checked)}
          >
            <span className="font-medium text-orange-700">Also mark candidates as rejected</span>
          </Checkbox>
          
          {markAsRejected && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason (optional)
              </label>
              <TextArea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter a reason for rejection..."
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        {previewCandidate && (body || subject) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Text strong className="text-sm text-blue-700">Preview (for {previewCandidate.fullname || previewCandidate.email}):</Text>
            <div className="mt-2 bg-white rounded p-2 border border-blue-100">
              {previewSubject && (
                <div className="font-medium text-gray-900 mb-1">
                  Subject: {previewSubject}
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {previewBody}
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {loading && sendProgress.total > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm text-purple-700">{sendProgress.status}</Text>
              <Text className="text-sm text-purple-700">
                {sendProgress.current} / {sendProgress.total}
              </Text>
            </div>
            <Progress 
              percent={Math.round((sendProgress.current / sendProgress.total) * 100)} 
              strokeColor="#8B5CF6"
              size="small"
            />
          </div>
        )}

        {/* Info alert */}
        <Alert
          type="info"
          showIcon
          message={
            <span className="text-sm">
              Each candidate will receive a personalized email with their specific details filled in. 
              Use <code className="bg-gray-100 px-1 rounded">#</code> to insert variables like candidate name, job title, etc.
            </span>
          }
        />
      </div>
    </Modal>
  );
};

export default BulkMessageModal;
