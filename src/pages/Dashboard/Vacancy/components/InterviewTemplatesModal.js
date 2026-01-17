import React, { useState, useEffect, useCallback } from 'react';
import { 
  Drawer, 
  Button, 
  Input, 
  Select, 
  Form, 
  Card, 
  List, 
  Typography, 
  Space, 
  Divider,
  message,
  Popconfirm,
  Tag,
  Rate,
  Switch,
  InputNumber,
  Row,
  Col,
  Checkbox,
  Radio,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  QuestionCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  NumberOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CloudUploadOutlined,
  AlignLeftOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';
import CrudService from '../../../../services/CrudService';

// Global button styles are now handled in NewATS.js

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

// Enhanced question types matching form builder exactly
const questionTypes = [
  { value: 'text', label: 'Short Text', icon: <AlignLeftOutlined />, description: 'Single line text input' },
  { value: 'longtext', label: 'Long Text', icon: <FileTextOutlined />, description: 'Multi-line textarea' },
  { value: 'motivation', label: 'Motivation Letter', icon: <FileTextOutlined />, description: 'Extended motivation text' },
  { value: 'number', label: 'Number', icon: <NumberOutlined />, description: 'Numeric input with min/max' },
  { value: 'rating', label: 'Rating (1-5)', icon: <StarOutlined />, description: 'Star rating component' },
  { value: 'boolean', label: 'Yes/No', icon: <CheckSquareOutlined />, description: 'Boolean choice' },
  { value: 'yesno', label: 'Yes/No Question', icon: <CheckSquareOutlined />, description: 'Custom yes/no labels' },
  { value: 'multichoice', label: 'Multiple Choice', icon: <CodeOutlined />, description: 'Radio button selection' },
  { value: 'dropdown', label: 'Dropdown', icon: <CodeOutlined />, description: 'Select from dropdown' },
  { value: 'multiselect', label: 'Multi-Select', icon: <CodeOutlined />, description: 'Multiple checkboxes' },
  { value: 'date', label: 'Date', icon: <CalendarOutlined />, description: 'Date picker input' },
  { value: 'email', label: 'Email', icon: <MailOutlined />, description: 'Email address input' },
  { value: 'phone', label: 'Phone', icon: <PhoneOutlined />, description: 'Phone number input' },
  { value: 'website', label: 'Website', icon: <GlobalOutlined />, description: 'URL input' },
  { value: 'file', label: 'File Upload', icon: <CloudUploadOutlined />, description: 'Document/image upload' },
];

const InterviewTemplatesModal = ({ 
  visible, 
  onCancel, 
  stages = [],
  vacancyId = null,
  selectedStage = null 
}) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Check if we're managing a specific stage (one template per stage)
  const isStageSpecific = !!selectedStage;

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, vacancyId, selectedStage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        user_id: user._id,
        ...(vacancyId && { vacancyId })
      };
      
      // If a specific stage is selected, filter by that stage
      if (selectedStage) {
        filters.stageName = selectedStage;
      }
      
      const response = await CrudService.search('InterviewTemplate', 100, 1, {
        filters,
        populate: 'user_id'
      });
      
      const loadedTemplates = response.data?.items || [];
      setTemplates(loadedTemplates);

      // If stage-specific and we have a template, auto-load it for editing
      if (selectedStage && loadedTemplates.length > 0) {
        const stageTemplate = loadedTemplates[0]; // Should be only one per stage
        setCurrentTemplate(stageTemplate);
        setIsEditing(true);
        // Ensure proper form initialization with detailed logging
        console.log('🔄 Setting template form values:', stageTemplate);
        
        // Reset form first to clear any existing values
        form.resetFields();
        
        // Set form values immediately without delay
        form.setFieldsValue({
          name: stageTemplate.name || '',
          description: stageTemplate.description || '',
          stageName: stageTemplate.stageName || '',
          isActive: stageTemplate.isActive !== false,
          isDefault: stageTemplate.isDefault || false,
          questions: stageTemplate.questions || [],
          skills: stageTemplate.skills || []
        });
        
        console.log('🔄 Form values set to:', form.getFieldsValue());
      } else if (selectedStage && loadedTemplates.length === 0) {
        // No template for this stage, create new one
        handleCreateTemplate();
      } else if (!selectedStage) {
        // For main template management, don't auto-edit, show listing first
        setIsEditing(false);
        setCurrentTemplate(null);
      }
    } catch (error) {
      console.error('Error loading interview templates:', error);
      message.error('Failed to load interview templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    const newTemplate = {
      name: selectedStage ? `${selectedStage} Interview` : '',
      description: '',
      stageName: selectedStage || (stages[0]?.title || stages[0]?.name || ''),
      questions: [],
      skills: [],
      isActive: true,
      isDefault: true
    };
    
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
    form.setFieldsValue(newTemplate);
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    console.log('🔄 Editing template, setting form values:', template);
    
    // Reset form first, then set values immediately
    form.resetFields();
    form.setFieldsValue({
      name: template.name || '',
      description: template.description || '',
      stageName: template.stageName || '',
      isActive: template.isActive !== false,
      isDefault: template.isDefault || false,
      questions: template.questions || [],
      skills: template.skills || []
    });
    
    console.log('🔄 Form values set to:', form.getFieldsValue());
  };

  const handleSaveTemplate = async (values) => {
    console.log('🔥 Saving template with values:', values);
    
    try {
      // Ensure questions have proper structure
      const processedQuestions = (values.questions || []).map((q, index) => {
        const question = {
          id: q.id || `q_${Date.now()}_${index}`,
          order: index,
          question: q.question || '',
          type: q.type || 'text',
          required: !!q.required
        };
        
        // Handle options for choice-based questions
        if (['multichoice', 'dropdown', 'multiselect'].includes(q.type)) {
          question.options = (q.options || [])
            .filter(opt => opt && (typeof opt === 'string' ? opt.trim() : opt.text?.trim())) // Filter out empty options
            .map(opt => 
              typeof opt === 'string' ? { text: opt.trim(), isNegative: false } : { 
                text: opt.text?.trim() || '', 
                isNegative: !!opt.isNegative 
              }
            );
        }
        
        // Handle min/max for number questions (only add if defined and not null)
        if (q.type === 'number') {
          if (q.min !== undefined && q.min !== null && q.min !== '') question.min = Number(q.min);
          if (q.max !== undefined && q.max !== null && q.max !== '') question.max = Number(q.max);
        }
        
        // Handle yes/no labels (only add if defined and not empty)
        if (['boolean', 'yesno'].includes(q.type)) {
          if (q.yesLabel && q.yesLabel.trim()) question.yesLabel = q.yesLabel.trim();
          if (q.noLabel && q.noLabel.trim()) question.noLabel = q.noLabel.trim();
        }
        
        // Handle date format
        if (q.type === 'date' && q.dateFormat && q.dateFormat.trim()) {
          question.dateFormat = q.dateFormat.trim();
        }
        
        return question;
      });

      // Ensure skills have proper structure
      const processedSkills = (values.skills || []).map((s, index) => ({
        id: s.id || `s_${Date.now()}_${index}`,
        order: index,
        name: (s.name || '').trim(),
        description: (s.description || '').trim(),
        maxScore: Number(s.maxScore) || 5,
        required: !!s.required
      }));

      const templateData = {
        name: values.name || '',
        description: values.description || '',
        stageName: values.stageName || '',
        user_id: user._id,
        questions: processedQuestions,
        skills: processedSkills,
        isActive: !!values.isActive,
        isDefault: !!values.isDefault,
        ...(vacancyId && { vacancyId })
      };

      console.log('🔥 Final template data being saved:', templateData);

      let result;
      if (currentTemplate?._id) {
        result = await CrudService.update('InterviewTemplate', currentTemplate._id, templateData);
        message.success('Template updated successfully');
      } else {
        result = await CrudService.create('InterviewTemplate', templateData);
        message.success('Template created successfully');
      }

      console.log('🔥 Save result:', result);

      // For stage-specific, keep editing after save
      if (!isStageSpecific) {
        setCurrentTemplate(null);
        setIsEditing(false);
        form.resetFields();
      } else {
        // Update current template with saved data and refresh form
        const updatedTemplate = result.data || templateData;
        setCurrentTemplate(updatedTemplate);
        form.setFieldsValue({
          ...updatedTemplate,
          questions: updatedTemplate.questions || [],
          skills: updatedTemplate.skills || []
        });
      }
      
      await loadData();
    } catch (error) {
      console.error('❌ Error saving template:', error);
      message.error('Failed to save template: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await CrudService.delete('InterviewTemplate', templateId);
      message.success('Template deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting template:', error);
      message.error('Failed to delete template');
    }
  };

  const handleCancel = () => {
    if (isStageSpecific) {
      // For stage-specific, just close the modal
      onCancel();
    } else {
      // For general template management, go back to list
      setIsEditing(false);
      setCurrentTemplate(null);
      form.resetFields();
    }
  };

  const renderQuestionField = (questionField, index, { add, remove }) => {
    return (
      <div key={questionField.key} className="p-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/30">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[14px] text-[#475647]">
            Question {index + 1}
          </span>
          <Button
            size="small"
            danger
            onClick={() => remove(questionField.name)}
            className="p-0 text-red-500 bg-transparent border-none shadow-none hover:text-red-700"
            type="text"
          >
            <DeleteOutlined className="h-[16px] w-[16px]" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-gray-600 mb-1">Question</label>
            <Form.Item
              {...questionField}
              name={[questionField.name, 'question']}
              rules={[{ required: true, message: 'Question is required' }]}
              className="mb-0"
            >
              <Input.TextArea
                placeholder="Enter interview question"
                rows={2}
              />
            </Form.Item>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <label className="block text-[12px] text-gray-600 mb-1">Answer Type</label>
              <Form.Item
                {...questionField}
                name={[questionField.name, 'type']}
                className="mb-0"
              >
                <Select placeholder="Select type" className="w-full">
                  {questionTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Space>
                        {type.icon}
                        {type.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12} className="flex items-end">
              <Form.Item
                {...questionField}
                name={[questionField.name, 'required']}
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox>Required</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* Additional fields for specific question types */}
          <Form.Item shouldUpdate={(prevValues, curValues) => {
            const currentQuestion = curValues.questions?.[questionField.name];
            const prevQuestion = prevValues.questions?.[questionField.name];
            return currentQuestion?.type !== prevQuestion?.type;
          }}>
            {({ getFieldValue }) => {
              const questionType = getFieldValue(['questions', questionField.name, 'type']);
              
              if (['multichoice', 'dropdown', 'multiselect'].includes(questionType)) {
                return (
                  <div>
                    <label className="block text-[12px] text-gray-600 mb-1">Options</label>
                    <Form.List name={[questionField.name, 'options']}>
                      {(optionFields, { add: addOption, remove: removeOption }) => (
                        <div className="space-y-2">
                          {optionFields.map((optionField, optionIndex) => (
                            <div key={optionField.key} className="flex items-center gap-2">
                              <Form.Item
                                {...optionField}
                                name={[optionField.name, 'text']}
                                className="mb-0 flex-1"
                              >
                                <Input placeholder={`Option ${optionIndex + 1}`} />
                              </Form.Item>
                              <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => removeOption(optionField.name)}
                                icon={<DeleteOutlined />}
                              />
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addOption({ text: '', isNegative: false })}
                            size="small"
                            icon={<PlusOutlined />}
                          >
                            Add Option
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                );
              }

              if (questionType === 'number') {
                return (
                  <Row gutter={12}>
                    <Col span={12}>
                      <label className="block text-[12px] text-gray-600 mb-1">Min Value</label>
                      <Form.Item
                        {...questionField}
                        name={[questionField.name, 'min']}
                        className="mb-0"
                      >
                        <InputNumber className="w-full" placeholder="Min" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label className="block text-[12px] text-gray-600 mb-1">Max Value</label>
                      <Form.Item
                        {...questionField}
                        name={[questionField.name, 'max']}
                        className="mb-0"
                      >
                        <InputNumber className="w-full" placeholder="Max" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }

              if (['boolean', 'yesno'].includes(questionType)) {
                return (
                  <Row gutter={12}>
                    <Col span={12}>
                      <label className="block text-[12px] text-gray-600 mb-1">Yes Label</label>
                      <Form.Item
                        {...questionField}
                        name={[questionField.name, 'yesLabel']}
                        className="mb-0"
                      >
                        <Input placeholder="Yes" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label className="block text-[12px] text-gray-600 mb-1">No Label</label>
                      <Form.Item
                        {...questionField}
                        name={[questionField.name, 'noLabel']}
                        className="mb-0"
                      >
                        <Input placeholder="No" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }

              return null;
            }}
          </Form.Item>
        </div>
      </div>
    );
  };

  const renderSkillField = (skillField, index, { add, remove }) => {
    return (
      <div key={skillField.key} className="p-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/30">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[14px] text-[#475647]">
            Skill {index + 1}
          </span>
          <Button
            size="small"
            danger
            onClick={() => remove(skillField.name)}
            className="p-0 text-red-500 bg-transparent border-none shadow-none hover:text-red-700"
            type="text"
          >
            <DeleteOutlined className="h-[16px] w-[16px]" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-gray-600 mb-1">Skill Name</label>
            <Form.Item
              {...skillField}
              name={[skillField.name, 'name']}
              rules={[{ required: true, message: 'Skill name is required' }]}
              className="mb-0"
            >
              <Input
                placeholder="e.g., JavaScript"
              />
            </Form.Item>
          </div>

          <div>
            <label className="block text-[12px] text-gray-600 mb-1">Description</label>
            <Form.Item
              {...skillField}
              name={[skillField.name, 'description']}
              className="mb-0"
            >
              <Input
                placeholder="Brief description"
              />
            </Form.Item>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <label className="block text-[12px] text-gray-600 mb-1">Max Score</label>
              <Form.Item
                {...skillField}
                name={[skillField.name, 'maxScore']}
                className="mb-0"
              >
                <InputNumber min={1} max={10} className="w-full" placeholder="5" />
              </Form.Item>
            </Col>
            
            <Col span={12} className="flex items-end">
              <Form.Item
                {...skillField}
                name={[skillField.name, 'required']}
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox>Required</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderTemplateList = () => {
    if (templates.length === 0) {
      return (
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
          <Title level={4} type="secondary">No Interview Templates</Title>
          <Text type="secondary" className="block mb-4">
            Create your first interview template to standardize your interview process
          </Text>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateTemplate}
          >
            Create Your First Template
          </Button>
          
          {/* How it works info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
            <Text strong className="text-blue-800 block mb-2">💡 How Interview Templates Work</Text>
            <ul className="text-sm text-blue-700 space-y-1 mb-0 list-disc pl-4">
              <li>Create templates with questions and skills for each stage</li>
              <li>Assign templates to pipeline stages (e.g., "Phone Screen", "Technical")</li>
              <li>When viewing a candidate, go to the Interview tab to conduct interviews</li>
              <li>Results are automatically saved and scores are tracked</li>
            </ul>
          </div>
        </div>
      );
    }

    // Group templates by stage
    const templatesByStage = templates.reduce((acc, template) => {
      const stage = template.stageName || 'Unassigned';
      if (!acc[stage]) acc[stage] = [];
      acc[stage].push(template);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="mb-1">Interview Templates</Title>
            <Text type="secondary">
              {templates.length} template{templates.length !== 1 ? 's' : ''} across {Object.keys(templatesByStage).length} stage{Object.keys(templatesByStage).length !== 1 ? 's' : ''}
            </Text>
          </div>
        </div>

        {/* How it works info */}
        <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-3">
          <QuestionCircleOutlined className="text-blue-500 mt-0.5" />
          <div>
            <Text strong className="text-blue-800 text-sm">How to use:</Text>
            <Text className="text-sm text-blue-700 block">
              Open any candidate card → go to the <strong>Interview</strong> tab → click <strong>New Interview</strong> to conduct an interview using these templates.
            </Text>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(templatesByStage).map(([stageName, stageTemplates]) => (
            <div key={stageName} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Title level={5} className="mb-0">{stageName}</Title>
                <Tag color="blue">{stageTemplates.length} template{stageTemplates.length !== 1 ? 's' : ''}</Tag>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {stageTemplates.map((template) => (
                  <Card 
                    key={template._id}
                    className="hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Text strong className="text-base">{template.name}</Text>
                          {template.isDefault && <Tag color="gold" size="small">Default</Tag>}
                          {!template.isActive && <Tag color="red" size="small">Inactive</Tag>}
                        </div>
                        {template.description && (
                          <Text type="secondary" className="text-sm block mb-2">
                            {template.description}
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <QuestionCircleOutlined /> 
                          {template.questions?.length || 0} questions
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <StarOutlined /> 
                          {template.skills?.length || 0} skills
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          type="text" 
                          size="small"
                          icon={<EditOutlined />} 
                          onClick={() => handleEditTemplate(template)}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Delete this template?"
                          description="This action cannot be undone."
                          onConfirm={() => handleDeleteTemplate(template._id)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                        >
                          <Button 
                            type="text" 
                            size="small"
                            danger 
                            icon={<DeleteOutlined />}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTemplateEditor = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSaveTemplate}
      className="space-y-4"
    >
      {/* Template Name */}
      <Form.Item
        label={<span className="font-bold text-[14px] text-[#475647]">Template Name</span>}
        name="name"
        rules={[{ required: true, message: 'Template name is required' }]}
      >
        <Input
          placeholder="e.g., Technical Interview"
          size="large"
        />
      </Form.Item>

      {/* Stage Selection */}
      <Form.Item
        label={<span className="font-bold text-[14px] text-[#475647]">Pipeline Stage</span>}
        name="stageName"
        rules={[{ required: true, message: 'Stage is required' }]}
      >
        <Select 
          placeholder="Select stage" 
          size="large"
          disabled={isStageSpecific} // Don't allow changing stage if opened from stage
        >
          {stages.map(stage => (
            <Option key={stage.id} value={stage.title || stage.name}>
              {stage.title || stage.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Description */}
      <Form.Item
        label={<span className="font-bold text-[14px] text-[#475647]">Description</span>}
        name="description"
      >
        <Input.TextArea
          placeholder="Brief description of this interview template"
          rows={3}
        />
      </Form.Item>

      {/* Template Settings */}
      <div className="flex gap-4">
        <Form.Item name="isActive" valuePropName="checked" className="mb-0">
          <Checkbox>Active Template</Checkbox>
        </Form.Item>
        <Form.Item name="isDefault" valuePropName="checked" className="mb-0">
          <Checkbox>Default for Stage</Checkbox>
        </Form.Item>
      </div>

      <Divider orientation="left" orientationMargin="0">
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          Interview Questions
        </span>
      </Divider>

      {/* Questions Section */}
      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <div className="space-y-4">
            {fields.map((field, index) => renderQuestionField(field, index, { add, remove }))}
            
            <Button
              type="dashed"
              onClick={() => add({ 
                id: `q_${Date.now()}`, 
                question: '', 
                type: 'text', 
                required: false,
                order: fields.length
              })}
              block
              icon={<PlusOutlined />}
              className="mt-4"
            >
              Add Question
            </Button>
          </div>
        )}
      </Form.List>

      <Divider orientation="left" orientationMargin="0">
        <span className="flex items-center gap-2">
          <StarOutlined />
          Skills Assessment
        </span>
      </Divider>

      {/* Skills Section */}
      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <div className="space-y-4">
            {fields.map((field, index) => renderSkillField(field, index, { add, remove }))}
            
            <Button
              type="dashed"
              onClick={() => add({ 
                id: `s_${Date.now()}`, 
                name: '', 
                description: '', 
                maxScore: 5, 
                required: false,
                order: fields.length
              })}
              block
              icon={<PlusOutlined />}
              className="mt-4"
            >
              Add Skill
            </Button>
          </div>
        )}
      </Form.List>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {/* Delete button for existing templates */}
          {currentTemplate?._id && (
            <Popconfirm
              title="Delete this template?"
              description="This action cannot be undone and will remove the interview template for this stage."
              onConfirm={() => {
                handleDeleteTemplate(currentTemplate._id);
                if (isStageSpecific) {
                  onCancel(); // Close modal after deletion
                }
              }}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger size="large" icon={<DeleteOutlined />}>
                Delete Template
              </Button>
            </Popconfirm>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button size="large" onClick={handleCancel}>
            {isStageSpecific ? 'Close' : 'Cancel'}
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
          >
            {currentTemplate?._id ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </Form>
  );

  if (loading) {
    return (
      <Drawer
        title="Loading..."
        placement="right"
        open={visible}
        onClose={onCancel}
        width={750}
      >
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QuestionCircleOutlined className="text-blue-500" />
            <div>
              <div className="font-semibold text-lg">
                Interview Templates
                {selectedStage && <span className="text-blue-600"> - {selectedStage}</span>}
              </div>
              <div className="text-sm text-gray-500 font-normal">
                {selectedStage 
                  ? `Manage interview template for ${selectedStage} stage`
                  : 'Manage interview questions and skills assessment'
                }
              </div>
            </div>
          </div>
          {!isEditing && !isStageSpecific && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateTemplate}
            >
              Create Template
            </Button>
          )}
          {isEditing && !isStageSpecific && (
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => {
                setIsEditing(false);
                setCurrentTemplate(null);
                form.resetFields();
              }}
              size="large"
            >
              Back to List
            </Button>
          )}
        </div>
      }
      placement="right"
      open={visible}
      onClose={onCancel}
      width={750}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      headerStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px'
      }}
    >
      <div className="h-full overflow-y-auto p-6">
        {isEditing ? renderTemplateEditor() : renderTemplateList()}
      </div>
    </Drawer>
  );
};

export default InterviewTemplatesModal;