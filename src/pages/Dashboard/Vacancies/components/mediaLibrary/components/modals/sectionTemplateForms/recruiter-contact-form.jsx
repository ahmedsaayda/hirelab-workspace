import React, { useState } from "react";
import { Input, Button, Collapse, Popconfirm, Switch } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { message } from 'antd';

const { Panel } = Collapse;


const RecruiterContactForm = ({ initialData, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    recruiterContactTitle: initialData?.recruiterContactTitle || "Contact Our Recruiters",
    recruiterContactText: initialData?.recruiterContactText || "",
    recruiters: initialData?.recruiters || [
      {
        recruiterFullname: "",
        recruiterRole: "",
        recruiterPhone: "",
        recruiterPhoneEnabled: false,
        recruiterEmail: "",
        recruiterAvatar: ""
      }
    ],
    type: 'recruiterContact'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecruiterChange = (index, field, value) => {
    const updatedRecruiters = [...formData.recruiters];
    updatedRecruiters[index][field] = value;
    handleChange('recruiters', updatedRecruiters);
  };

  const addRecruiter = () => {
    handleChange('recruiters', [
      ...formData.recruiters,
      {
        recruiterFullname: "",
        recruiterRole: "",
        recruiterPhone: "",
        recruiterPhoneEnabled: false,
        recruiterEmail: "",
        recruiterAvatar: ""
      }
    ]);
  };

  const removeRecruiter = (index) => {
    handleChange('recruiters', formData.recruiters.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Recruiter contact saved successfully");
    } catch (error) {
      message.error("Failed to save recruiter contact");
      console.error("Error saving recruiter contact:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.recruiterContactTitle.length}/40</p>
      </div>
      <Input
        value={formData.recruiterContactTitle}
        onChange={(e) => handleChange('recruiterContactTitle', e.target.value)}
        maxLength={40}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.recruiterContactText.length}/120</p>
      </div>
      <Input.TextArea
        value={formData.recruiterContactText}
        onChange={(e) => handleChange('recruiterContactText', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Recruiters */}
      <div className="mt-4">
        <Collapse ghost className="!border-none" expandIconPosition="end">
          {formData.recruiters.map((recruiter, index) => (
            <Panel
              key={index}
              header={
                <div className="flex items-center gap-2">
                  <span>{recruiter.recruiterFullname || `Recruiter ${index + 1}`}</span>
                  <Popconfirm
                    title="Delete this recruiter?"
                    onConfirm={() => removeRecruiter(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <CloseOutlined className="text-red-500 ml-auto" />
                  </Popconfirm>
                </div>
              }
            >
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                <ImageUploader
                  defaultImage={recruiter.recruiterAvatar}
                  onImageUpload={(url) => 
                    handleRecruiterChange(index, 'recruiterAvatar', url)
                  }
                  allowedTabs={["image"]}
                //   title="Upload Recruiter Photo"
                />

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p>Full Name</p>
                    <p>{recruiter.recruiterFullname.length}/40</p>
                  </div>
                  <Input
                    value={recruiter.recruiterFullname}
                    onChange={(e) => 
                      handleRecruiterChange(index, 'recruiterFullname', e.target.value)
                    }
                    maxLength={40}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p>Role</p>
                    <p>{recruiter.recruiterRole.length}/25</p>
                  </div>
                  <Input
                    value={recruiter.recruiterRole}
                    onChange={(e) => 
                      handleRecruiterChange(index, 'recruiterRole', e.target.value)
                    }
                    maxLength={25}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p>Contact Information</p>
                  <Input
                    placeholder="Phone Number"
                    value={recruiter.recruiterPhone}
                    onChange={(e) => 
                      handleRecruiterChange(index, 'recruiterPhone', e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={recruiter.recruiterPhoneEnabled}
                      onChange={(checked) => 
                        handleRecruiterChange(index, 'recruiterPhoneEnabled', checked)
                      }
                    />
                    <span>Enable Phone Contact</span>
                  </div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={recruiter.recruiterEmail}
                    onChange={(e) => 
                      handleRecruiterChange(index, 'recruiterEmail', e.target.value)
                    }
                  />
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>

        <Button
          onClick={addRecruiter}
          className="mt-4 flex items-center gap-2"
          icon={<PlusOutlined />}
        >
          Add Recruiter
        </Button>
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#5207CD] text-white hover:border hover:shadow-sm border-none"
      >
        {initialData ? "Update Contact" : "Create Contact"}
      </Button>
    </div>
  );
};

export default RecruiterContactForm;
