import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Tabs,
  Transfer,
  Tag,
  Divider,
  Spin,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const RoleManagement = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [models, setModels] = useState([
    "User",
    "Partner",
    "LandingPageData",
    "Role",
    "VacancyStage",
  ]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [userRoleForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${BASE_URL}/roles/getRoles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Handle role creation
  const handleCreateRole = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.post(`${BASE_URL}/roles`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Role created successfully");
      setModalVisible(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      message.error("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  // Handle role update
  const handleUpdateRole = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.put(
        `${BASE_URL}/roles/${selectedRole._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Role updated successfully");
      setModalVisible(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      message.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.delete(`${BASE_URL}/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      message.error("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  // Handle user role update
  const handleUpdateUserRole = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.put(
        `${BASE_URL}/admin/users/${selectedUser._id}`,
        {
          roles: values.roles,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("User roles updated successfully");
      setUserRoleModalVisible(false);
      userRoleForm.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user roles:", error);
      message.error("Failed to update user roles");
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleFormSubmit = (values) => {
    if (selectedRole) {
      handleUpdateRole(values);
    } else {
      handleCreateRole(values);
    }
  };

  // Role management columns
  const roleColumns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Read Access",
      dataIndex: "readAccess",
      key: "readAccess",
      render: (access) => (
        <Space wrap>
          {access && access.length > 0 ? (
            access.map((model) => (
              <Tag color="blue" key={`read-${model}`}>
                {model}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No access</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Write Access",
      dataIndex: "writeAccess",
      key: "writeAccess",
      render: (access) => (
        <Space wrap>
          {access && access.length > 0 ? (
            access.map((model) => (
              <Tag color="green" key={`write-${model}`}>
                {model}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No access</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedRole(record);
              form.setFieldsValue({
                name: record.name,
                readAccess: record.readAccess || [],
                writeAccess: record.writeAccess || [],
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDeleteRole(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // User management columns for role assignment
  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {record.avatar ? (
              <img
                src={record.avatar}
                alt="avatar"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            ) : (
              <UserOutlined style={{ fontSize: "20px" }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: "bold" }}>{`${record.firstName || ""} ${
              record.lastName || ""
            }`}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "System Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin"
              ? "red"
              : role === "partner"
              ? "blue"
              : role === "recruiter"
              ? "green"
              : "default"
          }
        >
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Custom Roles",
      key: "roles",
      render: (_, record) => (
        <Space wrap>
          {record.roles && record.roles.length > 0 ? (
            record.roles.map((roleId) => {
              const role = roles.find((r) => r._id === roleId);
              return role ? (
                <Tag color="purple" key={roleId}>
                  {role.name}
                </Tag>
              ) : null;
            })
          ) : (
            <Text type="secondary">No custom roles</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type=""
          className="bg-light_blue-A700 hover-fix !text-white !border-gray-300"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedUser(record);
            userRoleForm.setFieldsValue({
              roles: record.roles || [],
            });
            setUserRoleModalVisible(true);
          }}
        >
          Manage Roles
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <LockOutlined /> Role Management
            </span>
          }
          key="1"
        >
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4}>System Roles</Title>
                <Button
                  type=""
                  className="bg-light_blue-A700 hover-fix !text-white !border-gray-300"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedRole(null);
                    form.resetFields();
                    setModalVisible(true);
                  }}
                >
                  Create New Role
                </Button>
              </div>
            }
          >
            {loading && roles.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={roleColumns}
                dataSource={roles}
                rowKey="_id"
                loading={loading}
              />
            )}
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <TeamOutlined /> User Role Assignment
            </span>
          }
          key="2"
        >
          <Card title={<Title level={4}>User Role Assignment</Title>}>
            {loading && users.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Role Create/Edit Modal */}
      <Modal
        title={selectedRole ? "Edit Role" : "Create New Role"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter a role name" }]}
          >
            <Input
              placeholder="Enter role name"
              className="!border-gray-300 !rounded-lg"
            />
          </Form.Item>

          <Divider orientation="left">Access Permissions</Divider>

          <Form.Item
            name="readAccess"
            label="Read Access"
            help="Select which data models this role can read"
          >
            <Select
              mode="multiple"
              placeholder="Select models for read access"
              style={{ width: "100%" }}
            >
              {models.map((model) => (
                <Option key={`read-${model}`} value={model}>
                  {model}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="writeAccess"
            label="Write Access"
            help="Select which data models this role can modify"
          >
            <Select
              mode="multiple"
              placeholder="Select models for write access"
              style={{ width: "100%" }}
            >
              {models.map((model) => (
                <Option key={`write-${model}`} value={model}>
                  {model}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "8px",
              marginTop: "24px",
            }}
          >
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button
              type=""
              className="bg-light_blue-A700 hover-fix !text-white !border-gray-300"
              htmlType="submit"
              loading={loading}
            >
              {selectedRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* User Role Assignment Modal */}
      <Modal
        title="Manage User Roles"
        open={userRoleModalVisible}
        onCancel={() => setUserRoleModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>User: </Text>
              <Text>{`${selectedUser.firstName || ""} ${
                selectedUser.lastName || ""
              } (${selectedUser.email})`}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>System Role: </Text>
              <Tag
                color={
                  selectedUser.role === "admin"
                    ? "red"
                    : selectedUser.role === "partner"
                    ? "blue"
                    : selectedUser.role === "recruiter"
                    ? "green"
                    : "default"
                }
              >
                {selectedUser.role?.toUpperCase()}
              </Tag>
            </div>

            <Form
              form={userRoleForm}
              layout="vertical"
              onFinish={handleUpdateUserRole}
            >
              <Form.Item
                name="roles"
                label="Assigned Roles"
                help="Select custom roles for this user"
              >
                <Select
                  mode="multiple"
                  placeholder="Select roles"
                  style={{ width: "100%" }}
                  optionLabelProp="label"
                >
                  {roles.map((role) => (
                    <Option key={role._id} value={role._id} label={role.name}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{role.name}</span>
                        <span style={{ color: "#999" }}>
                          {role.writeAccess?.length || 0} write,{" "}
                          {role.readAccess?.length || 0} read
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: "8px",
                  marginTop: "24px",
                }}
              >
                <Button onClick={() => setUserRoleModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update User Roles
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoleManagement;
