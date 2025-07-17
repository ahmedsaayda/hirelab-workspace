import React, { useState, useEffect } from 'react';
import { Button, Input, Radio, Checkbox, Select, Progress, message } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const { TextArea } = Input;
const { Option } = Select;

// Import the same custom components from apply page
const MultipleChoice = ({ field, value, onChange }) => (
  <Radio.Group value={value} onChange={onChange} className="w-full">
    <div className="space-y-3">
      {field.options?.map((option, index) => (
        <Radio key={index} value={option.text} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
          <span className="ml-2 text-sm">{option.text}</span>
        </Radio>
      ))}
    </div>
  </Radio.Group>
);

const MultiSelectChoice = ({ field, value, onChange }) => (
  <Checkbox.Group value={value} onChange={onChange} className="w-full">
    <div className="space-y-3">
      {field.options?.map((option, index) => (
        <Checkbox key={index} value={option.text} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
          <span className="ml-2 text-sm">{option.text}</span>
        </Checkbox>
      ))}
    </div>
  </Checkbox.Group>
);

const CustomDropdown = ({ field, value, onChange }) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder={field.placeholder || "Select an option"}
    size="large"
    className="w-full"
    style={{ borderRadius: '8px' }}
  >
    {field.options?.map((option, index) => (
      <Option key={index} value={option.text}>
        {option.text}
      </Option>
    ))}
  </Select>
);

const YesNoQuestion = ({ field, value, onChange }) => (
  <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="w-full">
    <div className="grid grid-cols-2 gap-3">
      <Radio.Button value="yes" className="text-center py-3 text-sm font-medium">
        <span>✓ Yes</span>
      </Radio.Button>
      <Radio.Button value="no" className="text-center py-3 text-sm font-medium">
        <span>✗ No</span>
      </Radio.Button>
    </div>
  </Radio.Group>
);

const FileUpload = ({ value, onChange, placeholder }) => (
  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
    <div className="space-y-4">
      <div className="text-blue-500">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-medium text-blue-600">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        {value && <p className="text-sm text-green-600 mt-2">✓ {value}</p>}
      </div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            onChange(file.name);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.svg"
      />
    </div>
  </div>
);

export default function ApplyPagePreview({ landingPageData }) {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (landingPageData) {
      // Filter visible fields (treat undefined as visible for backwards compatibility)
      const visibleFields = (landingPageData?.form?.fields || []).filter(field => field.visible !== false);
      setFormFields(visibleFields);
      
      // Reset to intro step when form fields change
      setCurrentStep(0);
      setFormData({});
    }
  }, [landingPageData]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleNext = () => {
    // Basic validation for preview (simplified)
    const currentField = formFields[currentStep - 1];
    if (currentStep > 0 && currentField?.required) {
      const value = formData[currentField.id];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        message.warning('This field is required in the actual form');
        return;
      }
    }

    if (currentStep < formFields.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Preview "submission"
      message.success('This is a preview - form would be submitted here');
      setCurrentStep(0);
      setFormData({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'contact':
        return (
          <div className="grid grid-cols-2 gap-4">
            {field.firstName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  First Name
                  {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_firstName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_firstName`, e.target.value)}
                  placeholder={field.firstName?.placeholder || "First name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
            {field.lastName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  Last Name
                  {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Input
                  value={formData[`${field.id}_lastName`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_lastName`, e.target.value)}
                  placeholder={field.lastName?.placeholder || "Last name"}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            )}
          </div>
        );

      case 'email':
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Email address"}
            className="rounded-lg"
            size="large"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            defaultCountry="us"
            inputClassName="rounded-lg w-full !h-10"
            placeholder={field.placeholder || "Phone number"}
            value={value}
            onChange={(phoneValue) => handleInputChange(field.id, phoneValue)}
            className="p-1"
          />
        );

      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
            size="large"
          />
        );

      case 'longtext':
        return (
          <TextArea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="rounded-lg"
          />
        );

      case 'motivation':
        return (
          <TextArea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Write your motivation letter"}
            className="h-32 rounded-lg"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Enter a number"}
            min={field.min}
            max={field.max}
            className="rounded-lg"
            size="large"
          />
        );

      case 'multichoice':
        return (
          <MultipleChoice
            field={field}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'dropdown':
        return (
          <CustomDropdown
            field={field}
            value={value}
            onChange={(selectedValue) => handleInputChange(field.id, selectedValue)}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectChoice
            field={field}
            value={Array.isArray(value) ? value : []}
            onChange={(selectedValues) => handleInputChange(field.id, selectedValues)}
          />
        );

      case 'yesno':
      case 'boolean':
        return (
          <YesNoQuestion
            field={field}
            value={value}
            onChange={(selectedValue) => handleInputChange(field.id, selectedValue)}
          />
        );

      case 'address':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">Address Line 1</label>
              <Input
                value={formData[`${field.id}_line1`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_line1`, e.target.value)}
                placeholder="Street address"
                className="rounded-lg"
                size="large"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Address Line 2 (Optional)</label>
              <Input
                value={formData[`${field.id}_line2`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_line2`, e.target.value)}
                placeholder="Apartment, suite, etc."
                className="rounded-lg"
                size="large"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">City</label>
                <Input
                  value={formData[`${field.id}_city`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_city`, e.target.value)}
                  placeholder="City"
                  className="rounded-lg"
                  size="large"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">State/Province</label>
                <Input
                  value={formData[`${field.id}_state`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_state`, e.target.value)}
                  placeholder="State"
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">ZIP/Postal Code</label>
                <Input
                  value={formData[`${field.id}_zip`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_zip`, e.target.value)}
                  placeholder="ZIP code"
                  className="rounded-lg"
                  size="large"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">Country</label>
                <Input
                  value={formData[`${field.id}_country`] || ''}
                  onChange={(e) => handleInputChange(`${field.id}_country`, e.target.value)}
                  placeholder="Country"
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">Month</label>
              <Input
                value={formData[`${field.id}_month`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_month`, e.target.value)}
                placeholder="MM"
                className="rounded-lg"
                size="large"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Day</label>
              <Input
                value={formData[`${field.id}_day`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_day`, e.target.value)}
                placeholder="DD"
                className="rounded-lg"
                size="large"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Year</label>
              <Input
                value={formData[`${field.id}_year`] || ''}
                onChange={(e) => handleInputChange(`${field.id}_year`, e.target.value)}
                placeholder="YYYY"
                className="rounded-lg"
                size="large"
                maxLength={4}
              />
            </div>
          </div>
        );

      case 'file':
        return (
          <FileUpload
            value={value}
            onChange={(fileName) => handleInputChange(field.id, fileName)}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
            size="large"
          />
        );
    }
  };

  if (!landingPageData || landingPageData.applyType !== 'form') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Preview Not Available</h3>
          <p className="text-gray-600 text-sm">Set Apply Type to "Custom Application Form" to see preview</p>
        </div>
      </div>
    );
  }

  const totalSteps = formFields.length + 1; // +1 for intro step
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {landingPageData.companyLogo && (
                <img 
                  src={landingPageData.companyLogo} 
                  alt="Company Logo" 
                  className="h-6 w-auto"
                />
              )}
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  {landingPageData.vacancyTitle || 'Job Application'}
                </h1>
                <p className="text-xs text-gray-500">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-400">PREVIEW</div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress 
              percent={progressPercentage} 
              showInfo={false}
              strokeColor="#5207CD"
              className="mb-2"
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border p-6 flex-1 flex flex-col overflow-auto">
          <div className="flex-1 flex flex-col">
            {currentStep === 0 ? (
              // Intro Step
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {landingPageData.form?.title || "Application Form"}
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  {landingPageData.form?.description || "Please fill out the form below to apply!!!!"}
                </p>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleNext}
                  className="bg-[#5207CD] hover:bg-[#0C7CE6]"
                >
                  Start Application
                </Button>
              </div>
            ) : (
              // Question Step
              <div className="flex-1 flex flex-col">
                {formFields[currentStep - 1] && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {formFields[currentStep - 1].label}
                      {formFields[currentStep - 1].required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h2>
                    
                    <div className="flex-1 mb-6">
                      {renderField(formFields[currentStep - 1])}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStep > 0 && (
            <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
              <Button 
                onClick={handlePrevious}
                className="flex items-center space-x-2 text-sm"
                disabled={currentStep === 0}
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </Button>

              <Button 
                type="primary"
                onClick={handleNext}
                className="flex items-center space-x-2 bg-[#5207CD] hover:bg-[#0C7CE6] text-sm"
              >
                <span>{currentStep === formFields.length ? 'Submit Application' : 'Next'}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 