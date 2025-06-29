import React, { useState } from "react";
import { Modal, Input, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";



export function MemberForm({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [selectedRole, setSelectedRole] = useState(
    initialData?.role || "recruiter"
  );
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    designation: initialData?.designation || "",
  });

  const roles = [
    { id: "recruiter", label: "Recruiter" },
    { id: "manager", label: "Manager" },
    { id: "hr-manager", label: "HR Manager" },
  ];

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      role: selectedRole,
      id: initialData?.id,
    });
  };

  const roleTitle = {
    recruiter: "Recruiter",
    manager: "Manager",
    "hr-manager": "HR Manager",
  }[selectedRole];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Add member"
      width={485}
      closeIcon={<span className="text-gray-400 hover:text-gray-600">×</span>}
    >
      <div className="pt-4">
        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedRole === role.id
                  ? "bg-[#F0F7FF] border-[#0066FF]"
                  : "border-dashed border-[#E5E7EB]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedRole === role.id
                    ? "bg-[#0066FF] text-white"
                    : "bg-gray-100"
                }`}
              >
                <UserOutlined />
              </div>
              <span
                className={`mt-2 text-sm ${
                  selectedRole === role.id ? "text-[#0066FF]" : ""
                }`}
              >
                {role.label}
              </span>
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              {roleTitle} Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={`Enter ${roleTitle.toLowerCase()} name`}
              className="rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">
              {roleTitle} ID
            </label>
            <Input
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              placeholder="Designation Title here"
              className="rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">
              {roleTitle} Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@company.com"
              className="rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Image</label>
            <Upload.Dragger
              accept=".svg,.png,.jpg,.gif"
              maxCount={1}
              showUploadList={false}
              className="!bg-white !border-dashed !border-[#E5E7EB] !rounded-lg !py-8"
            >
              <p className="text-[#0066FF] text-sm cursor-pointer">
                Click to upload
              </p>
              <p className="text-xs text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-400">
                SVG, PNG, JPG or GIF (max. 800×400px)
              </p>
            </Upload.Dragger>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 h-10 px-4 border border-[#E5E7EB] text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-10 px-4 bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]"
          >
            Add member
          </button>
        </div>
      </div>
    </Modal>
  );
}
