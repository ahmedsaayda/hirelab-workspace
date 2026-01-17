import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Button, 
  Input, 
  Select, 
  Form, 
  Card, 
  Typography, 
  Space, 
  Divider,
  message,
  Rate,
  Radio,
  InputNumber,
  Avatar,
  Tag,
  Row,
  Col,
  Progress,
  Modal,
  DatePicker,
  Upload
} from 'antd';
import { 
  UserOutlined, 
  StarOutlined, 
  CheckCircleOutlined,
  SaveOutlined,
  SendOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';
import CrudService from '../../../../services/CrudService';
import moment from 'moment';

// Global button styles are now handled in NewATS.js

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

const InterviewFormModal = ({ 
  visible, 
  onCancel, 
  candidate,
  currentStage,
  onInterviewComplete,
  onOpenTemplates
}) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [existingResponse, setExistingResponse] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && currentStage) {
      loadTemplates();
    }
  }, [visible, currentStage]);

  useEffect(() => {
    if (selectedTemplate && candidate) {
      loadExistingResponse();
    }
  }, [selectedTemplate, candidate]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await CrudService.search('InterviewTemplate', 100, 1, {
        filters: {
          user_id: user._id,
          stageName: currentStage,
          isActive: true
        }
      });
      const templateList = response.data?.items || [];
      setTemplates(templateList);
      
      // Auto-select default template or first template
      const defaultTemplate = templateList.find(t => t.isDefault) || templateList[0];
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    } catch (error) {
      console.error('Error loading interview templates:', error);
      message.error('Failed to load interview templates');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingResponse = async () => {
    if (!selectedTemplate || !candidate) return;
    
    try {
      const response = await CrudService.search('InterviewResponse', 10, 1, {
        filters: {
          candidateId: candidate._id,
          templateId: selectedTemplate._id,
          interviewedBy: user._id
        }
      });
      
      const existingResp = response.data?.items?.[0];
      if (existingResp) {
        setExistingResponse(existingResp);
        
        // Populate form with existing data
        const formData = {
          overallRating: existingResp.overallRating,
          overallNotes: existingResp.overallNotes,
          responses: {},
          skillScores: {}
        };
        
        // Populate question responses
        existingResp.responses?.forEach(resp => {
          formData.responses[resp.questionId] = resp.answer;
        });
        
        // Populate skill scores
        existingResp.skillScores?.forEach(skill => {
          formData.skillScores[skill.skillId] = skill.score;
        });
        
        form.setFieldsValue(formData);
      } else {
        setExistingResponse(null);
        form.resetFields();
      }
    } catch (error) {
      console.error('Error loading existing response:', error);
    }
  };

  const handleSaveInterview = async (values, status = 'draft') => {
    if (!selectedTemplate || !candidate) {
      message.error('Missing required data for interview');
      return;
    }
    
    if (!candidate._id) {
      console.error('Candidate missing ID:', candidate);
      message.error('Candidate ID is missing. Please try again.');
      return;
    }
    
    setSaving(true);
    try {
      console.log('🔥 Saving interview for candidate:', candidate._id, 'template:', selectedTemplate._id);
      // Process responses
      const responses = [];
      const skillScores = [];
      
      // Process question responses
      Object.entries(values.responses || {}).forEach(([questionId, answer]) => {
        if (answer !== undefined && answer !== '') {
          responses.push({
            questionId,
            answer,
            notes: values.questionNotes?.[questionId] || ''
          });
        }
      });
      
      // Process skill scores
      Object.entries(values.skillScores || {}).forEach(([skillId, score]) => {
        if (score !== undefined && score > 0) {
          skillScores.push({
            skillId,
            score,
            notes: values.skillNotes?.[skillId] || ''
          });
        }
      });
      
      const interviewData = {
        candidateId: candidate._id,
        templateId: selectedTemplate._id,
        interviewedBy: user._id,
        stageName: currentStage,
        responses,
        skillScores,
        overallRating: values.overallRating || null,
        overallNotes: values.overallNotes || '',
        status,
        interviewDate: new Date().toISOString()
      };
      
      console.log('🔥 Interview data being saved:', interviewData);
      
      if (existingResponse) {
        await CrudService.update('InterviewResponse', existingResponse._id, interviewData);
        message.success(`Interview ${status === 'completed' ? 'completed' : 'saved'} successfully`);
      } else {
        await CrudService.create('InterviewResponse', interviewData);
        message.success(`Interview ${status === 'completed' ? 'completed' : 'saved'} successfully`);
      }
      
      if (status === 'completed' && onInterviewComplete) {
        onInterviewComplete(candidate._id, currentStage);
      }
      
      if (status === 'completed') {
        onCancel();
      }
    } catch (error) {
      console.error('Error saving interview:', error);
      message.error('Failed to save interview');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionField = (question) => {
    const fieldName = ['responses', question.id];
    
    switch (question.type) {
      case 'text':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Input placeholder="Enter your answer" />
          </Form.Item>
        );

      case 'longtext':
      case 'motivation':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <TextArea rows={4} placeholder="Enter detailed response" />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <InputNumber 
              className="w-full" 
              min={question.min} 
              max={question.max} 
              placeholder="Enter number" 
            />
          </Form.Item>
        );
        
      case 'rating':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Rate allowHalf />
          </Form.Item>
        );
        
      case 'boolean':
      case 'yesno':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Radio.Group>
              <Radio value={true}>{question.yesLabel || 'Yes'}</Radio>
              <Radio value={false}>{question.noLabel || 'No'}</Radio>
            </Radio.Group>
          </Form.Item>
        );

      case 'multichoice':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Radio.Group>
              {question.options?.map((option, index) => (
                <Radio key={index} value={option.text || option}>
                  {option.text || option}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
        
      case 'dropdown':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Select placeholder="Select an option">
              {question.options?.map((option, index) => (
                <Option key={index} value={option.text || option}>
                  {option.text || option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'multiselect':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Select mode="multiple" placeholder="Select options">
              {question.options?.map((option, index) => (
                <Option key={index} value={option.text || option}>
                  {option.text || option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <DatePicker className="w-full" format={question.dateFormat || 'YYYY-MM-DD'} />
          </Form.Item>
        );

      case 'email':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={[
              ...(question.required ? [{ required: true, message: 'This field is required' }] : []),
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        );

      case 'phone':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        );

      case 'website':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={[
              ...(question.required ? [{ required: true, message: 'This field is required' }] : []),
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="Enter website URL" />
          </Form.Item>
        );

      case 'file':
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        );
        
      default: // fallback to text area
        return (
          <Form.Item
            name={fieldName}
            label={question.question}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <TextArea rows={3} placeholder="Enter your notes/observations" />
          </Form.Item>
        );
    }
  };

  const renderSkillField = (skill) => {
    return (
      <div key={skill.id} className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Text strong>{skill.name}</Text>
            {skill.description && (
              <div className="text-sm text-gray-500">{skill.description}</div>
            )}
          </div>
          <Tag color="blue">Max: {skill.maxScore}</Tag>
        </div>
        
        <Form.Item
          name={['skillScores', skill.id]}
          label="Score"
          rules={skill.required ? [{ required: true, message: 'Score is required' }] : []}
        >
          <InputNumber min={0} max={skill.maxScore} />
        </Form.Item>
        
        <Form.Item
          name={['skillNotes', skill.id]}
          label="Notes"
        >
          <TextArea rows={2} placeholder="Additional notes about this skill" />
        </Form.Item>
      </div>
    );
  };

  if (!selectedTemplate) {
    return (
      <Drawer
        title="No Templates Available"
        placement="right"
        open={visible}
        onClose={onCancel}
        width="50vw"
        bodyStyle={{ padding: '24px' }}
      >
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
          <Typography.Title level={4} type="secondary">No Interview Templates</Typography.Title>
          <Typography.Text type="secondary" className="block mb-6">
            No interview templates found for the "{currentStage || 'current'}" stage.
            <br />
            Create a template first to conduct interviews.
          </Typography.Text>
          <div className="flex flex-col items-center gap-3">
            {onOpenTemplates && (
              <Button 
                type="primary" 
                size="large" 
                onClick={onOpenTemplates}
              >
                Create Interview Template
              </Button>
            )}
            <Button 
              type={onOpenTemplates ? "default" : "primary"}
              size="large" 
              onClick={onCancel}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserOutlined className="text-blue-500" />
            <div>
              <div className="font-semibold text-lg">Interview Form</div>
              <div className="text-sm text-gray-500 font-normal">
                {candidate?.fullname || candidate?.email} - {currentStage}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {existingResponse && (
              <Tag color={existingResponse.status === 'completed' ? 'green' : 'orange'}>
                {existingResponse.status === 'completed' ? 'Completed' : 'Draft'}
              </Tag>
            )}
          </div>
        </div>
      }
      placement="right"
      open={visible}
      onClose={onCancel}
      width="70vw"
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      headerStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px'
      }}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Template: {selectedTemplate.name}</Text>
              {selectedTemplate.description && (
                <div className="text-sm text-gray-600">{selectedTemplate.description}</div>
              )}
            </div>
            {templates.length > 1 && (
              <Select
                value={selectedTemplate._id}
                onChange={(templateId) => {
                  const template = templates.find(t => t._id === templateId);
                  setSelectedTemplate(template);
                }}
                style={{ minWidth: 200 }}
              >
                {templates.map(template => (
                  <Option key={template._id} value={template._id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleSaveInterview(values, 'completed')}
        >
          {/* Interview Questions */}
          {selectedTemplate.questions?.length > 0 && (
            <div>
              <Title level={5}>Interview Questions</Title>
              <div className="space-y-4">
                {selectedTemplate.questions
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(question => (
                    <Card key={question.id} size="small">
                      {renderQuestionField(question)}
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Skills Assessment */}
          {selectedTemplate.skills?.length > 0 && (
            <div>
              <Divider />
              <Title level={5}>Skills Assessment</Title>
              <div className="space-y-4">
                {selectedTemplate.skills
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(skill => renderSkillField(skill))}
              </div>
            </div>
          )}

          {/* Overall Assessment */}
          <div>
            <Divider />
            <Title level={5}>Overall Assessment</Title>
            
            <Form.Item
              name="overallRating"
              label="Overall Rating"
            >
              <Rate allowHalf />
            </Form.Item>
            
            <Form.Item
              name="overallNotes"
              label="Overall Notes"
            >
              <TextArea 
                rows={4} 
                placeholder="Overall impressions, recommendations, next steps..." 
              />
            </Form.Item>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button onClick={onCancel}>
              Cancel
            </Button>
            
            <Space>
              <Button 
                icon={<SaveOutlined />}
                onClick={() => form.validateFields().then(values => handleSaveInterview(values, 'draft'))}
                loading={saving}
              >
                Save Draft
              </Button>
              <Button 
                type="primary"
                icon={<SendOutlined />}
                htmlType="submit"
                loading={saving}
              >
                Complete Interview
              </Button>
            </Space>
          </div>
        </Form>
        </div>
      </div>
    </Drawer>
  );
};

export default InterviewFormModal;
