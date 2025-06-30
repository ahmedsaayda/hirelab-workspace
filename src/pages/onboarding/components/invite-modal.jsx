

import React from "react";
import { Modal, Input, Button, Dropdown, Menu, Avatar } from "antd";
import { CopyOutlined, DownOutlined } from "@ant-design/icons";



const accessOptions = ["Edit", "View"];

const users = [
  { name: "Jeroen Minnee", email: "jeroen.minnee1", access: "Edit", avatar: "JM" },
  { name: "G", email: "gxx84000945", access: "Edit", avatar: "G" },
  { name: "Ali Hossem Edine", email: "alihossemidine", access: "View", avatar: "" },
  { name: "Codecraft", email: "codecraft26", access: "Edit", avatar: "C" },
  { name: "Ralph van Katwijk", email: "ralphvankatwijk", access: "View", avatar: "RK" },
];

export function InviteModal({ open, onClose }) {
  return (
    <Modal
      title="Share Board"
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: "500px" }}
      className="!rounded-xl"
    >
      <div className="space-y-6 py-4">
        {/* Invite by email */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="johndoe@email.com"
            className="!rounded !border-[#E5E7EB]"
          />
          <Dropdown
            overlay={
              <Menu>
                {accessOptions.map((access) => (
                  <Menu.Item key={access}>{access}</Menu.Item>
                ))}
              </Menu>
            }
            trigger={["click"]}
          >
            <Button>
              Edit <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="primary">Invite</Button>
        </div>

        {/* Shareable link */}
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Anyone with the link can join with view access
          </div>
          <div className="flex items-center gap-2">
            <Input
              value="join.hirelab.com/project"
              readOnly
              className="!rounded !border-[#E5E7EB]"
              suffix={
                <CopyOutlined className="text-gray-400 cursor-pointer hover:text-gray-600" />
              }
            />
            <Dropdown
              overlay={
                <Menu>
                  {accessOptions.map((access) => (
                    <Menu.Item key={access}>Access: {access}</Menu.Item>
                  ))}
                </Menu>
              }
              trigger={["click"]}
            >
              <Button>Change Access <DownOutlined /></Button>
            </Dropdown>
          </div>
        </div>

        {/* Members list */}
        <div>
          <div className="font-medium text-sm mb-2">Board Members ({users.length})</div>
          <div className="space-y-3">
            {users.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>{user.avatar || user.name.charAt(0)}</Avatar>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.email}</div>
                  </div>
                </div>
                <Dropdown
                  overlay={
                    <Menu>
                      {accessOptions.map((access) => (
                        <Menu.Item key={access}>{access}</Menu.Item>
                      ))}
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button>{user.access} <DownOutlined /></Button>
                </Dropdown>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel button */}
        <div className="flex justify-end pt-6 gap-2 border-t border-gray-200">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
