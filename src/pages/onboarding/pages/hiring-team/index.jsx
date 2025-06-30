import React, { useState } from "react";
import { Button, Modal, Avatar } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

export default function HiringTeam() {
  // const router = useRouter()
  const router = useRouter();;

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [members, setMembers] = useState([
    {
      id: "1",
      role: "hr-manager",
      name: "HR Manager Name",
      email: "name@mail.com",
      designation: "HR Manager ID",
      phone: "+1 (555) 000-0000",
      image: "/placeholder.svg",
    },
    {
      id: "2",
      role: "manager",
      name: "Manager Name",
      email: "name@mail.com",
      designation: "Manager ID",
      phone: "+1 (555) 000-0000",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      role: "recruiter",
      name: "Recruiter Name",
      email: "name@mail.com",
      designation: "Recruiter ID",
      phone: "+1 (555) 000-0000",
      image: "/placeholder.svg",
    },
  ]);

  const handleEditMember = (member) => {
    // router.push(`/hiring-team/${member.role}?id=${member.id}`)
    router.push(`/onboarding/hiring-team/${member.role}?id=${member.id}`);
  };

  const handleDeleteMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleBack = () => {
    // router.push('/')
    router.push("/onboarding");
  };

  const handleSaveAndNext = () => {
    console.log("Hiring team members:", members);
    // router.push('/location')
    router.push("/onboarding/location");
  };

  return (
    <div className="flex flex-grow min-h-[calc(100vh-290px)] md:min-h-[calc(100vh-64px)] bg-white ">
      {/* Main Content */}
      <div className="flex flex-col flex-grow py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Hiring Team</h1>
          <p className="text-gray-600">Add members to your team.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.id} className="rounded-lg bg-[#F8FAFC] p-6">
              <div className="flex justify-center mb-4">
                <Avatar size={64} src={member.image} icon={<UserOutlined />} />
              </div>
              <div className="text-center">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-sm text-gray-600">{member.designation}</p>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  icon={<EditOutlined />}
                  className="w-8 h-8 border-gray-300"
                  onClick={() => handleEditMember(member)}
                >
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  className="w-8 h-8 border-gray-300"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsAddingMember(true)}
            className="flex items-center justify-center h-10 text-center rounded-lg col-span-full bg-[#EFF8FF]  border-none"
          >
            <span className="text-sm text-[#0066FF]">+ Add more</span>
          </button>
        </div>

        <div className="flex justify-between pt-6 mt-auto border-t border-gray-200 gap-6">
          <Button type="text"  className="w-1/2 text-gray-700 border-gray-300" onClick={handleBack}>
            Back
          </Button>
          <Button type="primary" className="w-1/2 custom-button" onClick={handleSaveAndNext}>
            Save & Next
          </Button>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Modal
        open={isAddingMember}
        onCancel={() => setIsAddingMember(false)}
        footer={null}
        width={485}
      >
        <h2 className="mb-4 text-lg font-semibold">Add member</h2>
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => {
              setIsAddingMember(false);
              // router.push('/hiring-team/recruiter')
              router.push("/onboarding/hiring-team/recruiter");
            }}
            className="flex  items-center justify-center p-4 border border-gray-200 border-dashed rounded-lg hover:bg-gray-50"
          >
            <UserOutlined className="text-gray-500" />
            <span className="mt-2 text-sm text-[#0066FF]">Recruiter</span>
          </Button>
          <Button
            onClick={() => {
              setIsAddingMember(false);
              // router.push('/hiring-team/manager')
              router.push("/onboarding/hiring-team/manager");
            }}
            className="flex  items-center justify-center p-4 border border-gray-200 border-dashed rounded-lg hover:bg-gray-50"
          >
            <UserOutlined className="text-gray-500" />
            <span className="mt-2 text-sm text-[#0066FF]">Manager</span>
          </Button>
          <Button
            onClick={() => {
              setIsAddingMember(false);
              // router.push('/hiring-team/hr-manager')
              router.push("/onboarding/hiring-team/hr-manager");
            }}
            className="flex  items-center justify-center p-4 border border-gray-200 border-dashed rounded-lg hover:bg-gray-50"
          >
            <UserOutlined className="text-gray-500" />
            <span className="mt-2 text-sm text-[#0066FF]">HR Manager</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
