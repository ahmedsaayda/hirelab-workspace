import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { Button, Input, Typography, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;



export default function MemberDetails() {
  const { role } = useParams();
  const router = useRouter();;
  const [selectedRole, setSelectedRole] = useState(
    role || "recruiter"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    router.push(`/onboarding/hiring-team/${role}`);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleBack = () => {
    router.push("/onboarding/hiring-team");
  };

  const handleAddMember = () => {
    console.log("Member data:", { ...formData, role: selectedRole });
    router.push("/onboarding/hiring-team");
  };

  const roleTitle = {
    recruiter: "Recruiter",
    manager: "Hiring Manager",
    "hr-manager": "HR Manager",
  }[selectedRole];

  return (
    <div className=" bg-white">
      <div className="max-w-2xl py-6 mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Hiring Team</h1>
          <p className="text-gray-600">Add members to your team.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <Button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`flex flex-col items-center justify-center h-24 ${selectedRole === role.id
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : ""
                }`}
            >
              <UserOutlined className="text-2xl" />
              <span className="mt-2 text-sm">{role.label}</span>
            </Button>
          ))}
        </div>

        <form className="space-y-4">
          <div>
            <Text className="mb-1.5 block text-sm text-gray-700">
              Name
            </Text>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={`Enter name here`}
              className="mt-1.5"
            />
          </div>

          <div>
            <Text className="mb-1.5 block text-sm text-gray-700">
              Title
            </Text>
            <Input
              id="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Designation Title here"
              className="mt-1.5"
            />
          </div>

          <div>
            <Text className="mb-1.5 block text-sm text-gray-700">
              Email
            </Text>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@company.com"
              className="mt-1.5"
            />
          </div>

          <div>
            <Text className="mb-1.5 block text-sm text-gray-700">
              Phone
            </Text>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className="mt-1.5"
              addonBefore={
                <select className="w-20 bg-gray-100 border-0">
                  <option value="US">US</option>
                </select>
              }
            />
          </div>

          <div>
            <Text className="mb-1.5 block text-sm text-gray-700">Image</Text>
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Text className="block mt-2 text-xs text-gray-500">
              SVG, PNG, JPG or GIF (max. 800×400px)
            </Text>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button onClick={handleBack}>Back</Button>
            <Button type="primary" onClick={handleAddMember}>
              Add member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
