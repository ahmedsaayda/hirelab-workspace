import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  message, 
  Avatar,
  Space
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  CloseOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import ATSService from '../../../../services/ATSService';
import CrudService from '../../../../services/CrudService';
import UploadService from '../../../../services/UploadService';

const { Option } = Select;

const AddCandidateModal = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  vacancyId, 
  stages = [], 
  editData = null,
  defaultStageId = null 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [candidateData, setCandidateData] = useState(null);

  // Load candidate data if editing
  useEffect(() => {
    if (editData?.editId) {
      loadCandidateData(editData.editId);
    } else {
      form.resetFields();
      setImageUrl(null);
      setCandidateData(null);
      
      // Set default stage if provided (when clicking + on a specific column)
      if (defaultStageId && !editData) {
        form.setFieldsValue({ stage: defaultStageId });
      }
    }
  }, [editData, form, defaultStageId]);

  // Helper function to extract name from various possible formData structures
  const extractCandidateName = (formData) => {
    console.log('🔍 Extracting name from formData:', formData);
    
    // Try different possible name field combinations
    if (formData.fullname) {
      return formData.fullname;
    }
    
    // Try standard fields
    if (formData.firstname && formData.lastname) {
      return `${formData.firstname} ${formData.lastname}`;
    }
    
    // Try firstName/lastName (camelCase)
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    }
    
    // Try dynamic contact fields (from form submissions)
    const contactFirstNameKey = Object.keys(formData).find(key => 
      key.includes('contact_') && key.includes('_firstName')
    );
    const contactLastNameKey = Object.keys(formData).find(key => 
      key.includes('contact_') && key.includes('_lastName')
    );
    
    if (contactFirstNameKey && contactLastNameKey) {
      const firstName = formData[contactFirstNameKey];
      const lastName = formData[contactLastNameKey];
      if (firstName && lastName) {
        console.log('✅ Found contact fields:', { firstName, lastName });
        return `${firstName} ${lastName}`;
      }
    }
    
    // Fallback to any first/last name fields found
    const firstNameKeys = Object.keys(formData).filter(key => 
      key.toLowerCase().includes('first') || key.toLowerCase().includes('fname')
    );
    const lastNameKeys = Object.keys(formData).filter(key => 
      key.toLowerCase().includes('last') || key.toLowerCase().includes('lname')
    );
    
    if (firstNameKeys.length > 0 && lastNameKeys.length > 0) {
      const firstName = formData[firstNameKeys[0]];
      const lastName = formData[lastNameKeys[0]];
      if (firstName && lastName) {
        console.log('✅ Found fallback name fields:', { firstName, lastName });
        return `${firstName} ${lastName}`;
      }
    }
    
    // Last resort - try to find any field that might contain a name
    if (formData.name) {
      return formData.name;
    }
    
    console.warn('❌ Could not extract name from formData');
    return '';
  };

  // Helper function to extract email from various possible formData structures
  const extractCandidateEmail = (formData) => {
    if (formData.email) return formData.email;
    
    // Try dynamic email fields
    const emailKey = Object.keys(formData).find(key => 
      key.includes('email_') && !key.includes('_label') && !key.includes('_type')
    );
    
    if (emailKey && formData[emailKey]) {
      console.log('✅ Found dynamic email field:', emailKey, '=', formData[emailKey]);
      return formData[emailKey];
    }
    
    return '';
  };

  // Helper function to extract phone from various possible formData structures
  const extractCandidatePhone = (formData) => {
    if (formData.phone) return formData.phone;
    
    // Try dynamic phone fields
    const phoneKey = Object.keys(formData).find(key => 
      key.includes('phone_') && !key.includes('_label') && !key.includes('_type')
    );
    
    if (phoneKey && formData[phoneKey]) {
      console.log('✅ Found dynamic phone field:', phoneKey, '=', formData[phoneKey]);
      return formData[phoneKey];
    }
    
    return '';
  };

  const loadCandidateData = async (candidateId) => {
    try {
      const response = await CrudService.getSingle('VacancySubmission', candidateId);
      if (response.data) {
        setCandidateData(response.data);
        const formData = response.data.formData || {};
        
        // Extract the candidate data properly from various field structures
        const candidateName = extractCandidateName(formData);
        const candidateEmail = extractCandidateEmail(formData);
        const candidatePhone = extractCandidatePhone(formData);
        
        console.log('👤 Extracted candidate data:', { 
          name: candidateName, 
          email: candidateEmail, 
          phone: candidatePhone 
        });
        
        setImageUrl(formData.avatar);
        form.setFieldsValue({
          fullname: candidateName,
          email: candidateEmail,
          phone: candidatePhone,
          position: formData.position || 'Position',
          stage: response.data.stageId,
        });
      }
    } catch (error) {
      console.error('Error loading candidate:', error);
      message.error('Failed to load candidate data');
    }
  };

  const handleImageUpload = async ({ file }) => {
    if (file.status === 'uploading') return;

    try {
      console.log('🔄 Uploading image using UploadService...');
      
      // Use the existing UploadService with Cloudinary
      const response = await UploadService.upload(file, 2); // 2MB max
      
      if (response && response.data && response.data.secure_url) {
        setImageUrl(response.data.secure_url);
        message.success('Image uploaded successfully');
        console.log('✅ Upload successful:', response.data.secure_url);
      } else {
        console.warn('❌ Upload response missing URL:', response);
        message.warning('Image upload completed but no URL returned');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Check if it's a size error (handled by UploadService)
      if (error.message && error.message.includes('Maximum size')) {
        // UploadService already showed the error message
        return;
      }
      
      message.error('Failed to upload image. Please try again.');
    }
  };

  // Helper function to update all candidate fields in formData while preserving structure
  const updateFormDataWithCandidateInfo = (originalFormData, values) => {
    console.log('🔄 Updating formData with candidate info:', values);
    
    // Parse the full name into first and last name
    const nameParts = (values.fullname || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Create updated formData preserving original structure
    const updatedFormData = { ...originalFormData };
    
    // Update name fields
    updatedFormData.fullname = values.fullname?.trim() || '';
    updatedFormData.firstname = firstName;
    updatedFormData.lastname = lastName;
    updatedFormData.firstName = firstName; // camelCase version
    updatedFormData.lastName = lastName;   // camelCase version
    
    // Update email and phone in standard fields
    updatedFormData.email = values.email?.trim() || '';
    updatedFormData.phone = values.phone?.trim() || '';
    updatedFormData.position = values.position?.trim() || '';
    
    // Update dynamic fields if they exist
    Object.keys(originalFormData).forEach(key => {
      // Update dynamic contact name fields
      if (key.includes('contact_') && key.includes('_firstName')) {
        updatedFormData[key] = firstName;
        console.log('✅ Updated dynamic firstName field:', key, '=', firstName);
      }
      if (key.includes('contact_') && key.includes('_lastName')) {
        updatedFormData[key] = lastName;
        console.log('✅ Updated dynamic lastName field:', key, '=', lastName);
      }
      
      // Update dynamic email fields
      if (key.includes('email_') && !key.includes('_label') && !key.includes('_type')) {
        updatedFormData[key] = values.email?.trim() || '';
        console.log('✅ Updated dynamic email field:', key, '=', values.email);
      }
      
      // Update dynamic phone fields
      if (key.includes('phone_') && !key.includes('_label') && !key.includes('_type')) {
        updatedFormData[key] = values.phone?.trim() || '';
        console.log('✅ Updated dynamic phone field:', key, '=', values.phone);
      }
    });
    
    return updatedFormData;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!values.fullname?.trim()) {
        message.error('Full name is required');
        setLoading(false);
        return;
      }
      
      if (!values.stage) {
        message.error('Please select a stage');
        setLoading(false);
        return;
      }

      if (editData?.editId && candidateData) {
        // EDITING existing candidate - preserve original formData structure
        console.log('📝 Editing existing candidate with preserved formData structure');
        
        const originalFormData = candidateData.formData || {};
        
        // Update formData while preserving original structure
        const updatedFormData = updateFormDataWithCandidateInfo(originalFormData, values);
        
        // Update avatar separately
        updatedFormData.avatar = imageUrl || updatedFormData.avatar || '';
        
        // Update existing candidate - preserve formData structure
        const searchIndex = `${values.fullname} ${values.email} ${values.phone} ${values.position}`.toLowerCase();
        
        await CrudService.update('VacancySubmission', editData.editId, {
          formData: updatedFormData,
          stageId: values.stage,
          searchIndex: searchIndex,
        });
        
        console.log('✅ Updated candidate with preserved formData:', {
          candidateId: editData.editId,
          updatedFields: Object.keys(updatedFormData),
          searchIndex
        });
        message.success('Candidate updated successfully');
        
      } else {
        // CREATING new candidate - use simple formData structure
        console.log('➕ Creating new candidate with simple formData structure');
        
        const formData = {
          fullname: values.fullname.trim(),
          firstname: values.fullname.trim().split(' ')[0] || '',
          lastname: values.fullname.trim().split(' ').slice(1).join(' ') || '',
          email: values.email?.trim() || '',
          phone: values.phone?.trim() || '',
          position: values.position?.trim() || '',
          avatar: imageUrl || '',
        };

        const candidatePayload = {
          LandingPageDataId: vacancyId,
          stageId: values.stage,
          formData: formData,
          searchIndex: `${values.fullname} ${values.email} ${values.phone} ${values.position}`.toLowerCase(),
          stars: 0,
          rejected: false,
          qualified: false,
          meetingScheduled: false,
          hired: false,
        };

        // Create new candidate
        await CrudService.create('VacancySubmission', candidatePayload);
        message.success('Candidate added successfully');
      }

      onSuccess();
      form.resetFields();
      setImageUrl(null);
    } catch (error) {
      console.error('Error saving candidate:', error);
      message.error('Failed to save candidate');
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
      <div className="text-blue-500 mb-2">
        <UploadOutlined className="text-2xl" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-blue-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          <span className="text-lg font-semibold">
            {editData?.editId ? 'Edit candidate' : 'Add candidate'}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      destroyOnHidden
      className="modern-modal"
      maskClosable={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        {/* Full Name */}
        <Form.Item
          name="fullname"
          label={<span className="text-sm font-medium text-gray-700">Candidate Full Name</span>}
          rules={[{ required: true, message: 'Please enter the candidate name' }]}
        >
          <Input 
            placeholder="John Smith"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Position */}
        <Form.Item
          name="position"
          label={<span className="text-sm font-medium text-gray-700">Position Applied to</span>}
          rules={[{ required: true, message: 'Please enter the position' }]}
        >
          <Input 
            placeholder="Design Lead"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Stage */}
        <Form.Item
          name="stage"
          label={<span className="text-sm font-medium text-gray-700">Stage</span>}
          rules={[{ required: true, message: 'Please select a stage' }]}
        >
          <Select 
            placeholder="New applied"
            size="large"
            className="rounded-lg"
          >
            {stages.map((stage, index) => (
              <Option key={`stage-option-${stage.id || index}`} value={stage.id || `stage-${index}`}>
                {stage.title || stage.name || `Stage ${index + 1}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label={<span className="text-sm font-medium text-gray-700">Email</span>}
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            placeholder="john@example.com"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label={<span className="text-sm font-medium text-gray-700">Phone</span>}
        >
          <Input 
            placeholder="+1 (555) 123-4567"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Profile Image */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Image</span>}
        >
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative">
                <Avatar size={64} src={imageUrl} />
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => setImageUrl(null)}
                />
              </div>
            ) : (
              <Upload
                name="avatar"
                listType="picture"
                showUploadList={false}
                customRequest={handleImageUpload}
                accept="image/*"
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('You can only upload image files!');
                    return false;
                  }
                  // Size check is handled by UploadService
                  return true;
                }}
                onError={(error) => {
                  console.warn('Upload component error:', error);
                  // Don't show error message here, handleImageUpload will handle it
                }}
              >
                {uploadButton}
              </Upload>
            )}
          </div>
        </Form.Item>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {editData?.editId ? 'Save Changes' : 'Add candidate'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCandidateModal; 