import React from "react";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";



export function MemberCard({ member, onEdit, onDelete }) {
  const roleTitle = {
    recruiter: "Recruiter",
    manager: "Hiring Manager",
    "hr-manager": "HR Manager",
  }[member.role];

  return (
    <div className="rounded-lg bg-[#F8FAFC] p-6">
      <div className="flex justify-center mb-4">
        <Avatar size={64} src={member.image} icon={<UserOutlined />} />
      </div>
      <div className="text-center">
        <h3 className="font-medium">{roleTitle}</h3>
        <p className="text-sm text-gray-600">{member.name}</p>
        <p className="text-sm text-gray-600">{member.email}</p>
        <p className="text-sm text-gray-600">{member.designation}</p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(member)}
          className="h-8 w-8 border-[#E5E7EB]"
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={() => onDelete(member.id)}
          className="h-8 w-8 border-[#E5E7EB]"
        />
      </div>
    </div>
  );
}
